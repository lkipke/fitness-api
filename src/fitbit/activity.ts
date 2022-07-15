import { readFile, writeFile } from 'fs/promises';
import ActivitySummary from '../mysql/models/ActivitySummary';
import HeartRateZone from '../mysql/models/HeartRateZone';
import Metric from '../mysql/models/Metric';
import { fetchWithAuthRefresh, getUserAuthHeader } from './auth';
import {
  FitbitDataPoint,
  FitbitIntradayData,
  IntradayMetric,
  intradayMetrics,
  ActivitySummaryType,
} from './types';
import { formatTime, formatDate } from './utils';

const USER_ID = process.env.FITBIT_USER_ID;

const parseAndStoreActivityData = async (
  data: FitbitIntradayData[],
  activity: ActivitySummary
) => {
  let map = data.reduce(
    (agg, curr, idx) => ({
      ...agg,
      [curr.metricType]: curr,
    }),
    {} as Record<IntradayMetric, FitbitIntradayData>
  );

  let entries = data[0].points.map((pt, idx) => {
    return {
      ActivitySummaryId: activity.id,
      time: new Date(`${data[0].date} ${pt.time}`),
      calories: map['calories'].points[idx].value,
      steps: map['steps'].points[idx].value,
      distance: map['distance'].points[idx].value,
      elevation: map['elevation'].points[idx].value,
      floors: map['floors'].points[idx].value,
    };
  });

  await Metric.bulkCreate(entries);
};

const parseAndStoreActivityLogs = async (activities: Record<string, any>) => {
  const records = activities.map((activity: any) => {
    const parsed: Partial<ActivitySummaryType> = {
      activeDuration: activity.activeDuration,
      levelMinutesSedentary: activity.activityLevel?.find(
        (rec: any) => rec.name === 'sedentary'
      )?.minutes,
      levelMinutesLightly: activity.activityLevel?.find(
        (rec: any) => rec.name === 'lightly'
      )?.minutes,
      levelMinutesFairly: activity.activityLevel?.find(
        (rec: any) => rec.name === 'fairly'
      )?.minutes,
      levelMinutesVery: activity.activityLevel?.find(
        (rec: any) => rec.name === 'very'
      )?.minutes,
      activityName: activity.activityName,
      activityTypeId: activity.activityTypeId,
      averageHeartRate: activity.averageHeartRate,
      calories: activity.calories,
      caloriesLink: activity.caloriesLink,
      duration: activity.duration,
      heartRateLink: activity.heartRateLink,
      lastModified: activity.lastModified
        ? new Date(activity.lastModified)
        : undefined,
      logId: activity.logId,
      logType: activity.logType,
      startTime: activity.startTime,
      steps: activity.steps,
      tcxLink: activity.tcxLink,
    };

    return parsed;
  });

  let summaries = await ActivitySummary.bulkCreate(records);

  let heartRateZones: Record<string, any>[] = [];
  activities.forEach((activity: any, idx: number) => {
    if (activity.heartRateZones?.length) {
      heartRateZones = heartRateZones.concat(
        activity.heartRateZones.map((zone: any) => ({
          ...zone,
          ActivitySummaryId: summaries[idx].id,
        }))
      );
    }
  });

  await HeartRateZone.bulkCreate(heartRateZones);

  return summaries;
};

const getRealActivityLogList = async (date: string) => {
  let result = await fetchWithAuthRefresh(
    `https://api.fitbit.com/1/user/-/activities/list.json?afterDate=${date}&sort=asc&offset=0&limit=25`,
    {
      headers: {
        accept: 'application/json',
        Authorization: await getUserAuthHeader(),
      },
    }
  );

  console.log('headers', result.headers);
  let data: { activities: Record<string, any>[] } = await result.json();

  return { result, data };
};

const getFakeActivityLogList = async (date: string) => {
  let filename = `json/logs/${date}.json`;
  let data = JSON.parse(await readFile(filename, 'utf-8'));
  let result = { ok: true };

  return { result, data };
};

export const getActivityLogListForDate = async (date: string) => {
  const { result, data } = await getRealActivityLogList(date);

  if (result.ok) {
    // await writeFile(filename, JSON.stringify(data));

    let logs = await parseAndStoreActivityLogs(data.activities);
    data.activities.forEach(async (activity: any, idx: number) => {
      let data = await Promise.all(
        intradayMetrics.map((activityType) =>
          getActivityIntraday(
            activityType,
            activity.caloriesLink.replace('calories', activityType)
          )
        )
      );

      parseAndStoreActivityData(data, logs[idx]);
    });
  } else {
    console.error(data);
  }
};

const getRealActivityIntraday = async (
  metricType: IntradayMetric,
  url: string
) => {
  // let url = `https://api.fitbit.com/1/user/-/activities/${metricType}/date/${formatDate(
  //   startDate
  // )}/1d/1min/time/${formatTime(startDate)}/${formatTime(endDate)}.json`;

  let result = await fetchWithAuthRefresh(url, {
    headers: {
      accept: 'application/json',
      Authorization: await getUserAuthHeader(),
    },
  });

  let data = await result.json();
  return { result, data };
};

// const getFakeActivityIntraday = async (
//   metricType: IntradayMetric,
//   url: string
// ) => {
//   let result = { ok: true };

//   let filename = `json/activity/${metricType}-${formatDate(
//     startDate
//   )}-${formatTime(startDate)}.json`;
//   let data = JSON.parse(await readFile(filename, 'utf-8'));

//   return { result, data };
// };

export const getActivityIntraday = async (
  metricType: IntradayMetric,
  url: string
): Promise<FitbitIntradayData> => {
  console.log('getting activity intraday', metricType, url);

  let { result, data } = await getRealActivityIntraday(metricType, url);

  if (!result.ok) {
    throw new Error('error getting data');
  }
  // await writeFile(filename, JSON.stringify(data));

  return {
    metricType: metricType,
    date: data[`activities-${metricType}`][0].dateTime,
    value: data[`activities-${metricType}`][0].value,
    points: data[`activities-${metricType}-intraday`]
      .dataset as FitbitDataPoint[],
  };
};
