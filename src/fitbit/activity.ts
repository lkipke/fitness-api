import { readFile, writeFile } from 'fs/promises';
import ActivitySummary from '../mysql/models/ActivitySummary';
import HeartRateZone from '../mysql/models/HeartRateZone';
import Metric from '../mysql/models/Metric';
import { fetchFitbit, getUserAuthHeader } from './auth';
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

export const getActivityLogListForDate = async (date: string) => {
  let data = await fetchFitbit<Record<string, any[]>>(
    `https://api.fitbit.com/1/user/-/activities/list.json?afterDate=${date}&sort=asc&offset=0&limit=100`
  );

  let logs = await parseAndStoreActivityLogs(data.activities);
  data.activities.forEach(async (activity: any, idx: number) => {
    let promises = [];
    if (activity.heartRateLink) {
      promises.push(getActivityIntraday('heart', activity.heartRateLink))
    }

    promises = promises.concat(
      intradayMetrics
        .filter((activityType) => activityType !== 'heart')
        .map((activityType) =>
          getActivityIntraday(
            activityType,
            activity.caloriesLink.replace('calories', activityType)
          )
        )
    );

    let data = await Promise.all(promises);

    parseAndStoreActivityData(data, logs[idx]);
  });
};

// const getFakeActivityIntraday = async (
//   metricType: IntradayMetric,
//   url: string
// ) => {
//   let result = { ok: true };
// let url = `https://api.fitbit.com/1/user/-/activities/${metricType}/date/${formatDate(
//   startDate
// )}/1d/1min/time/${formatTime(startDate)}/${formatTime(endDate)}.json`;

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
  console.log('*** Getting activity intraday', metricType, url);

  let data = await fetchFitbit<Record<string, any>>(url);

  return {
    metricType: metricType,
    date: data[`activities-${metricType}`][0].dateTime,
    value: data[`activities-${metricType}`][0].value,
    points: data[`activities-${metricType}-intraday`]
      .dataset as FitbitDataPoint[],
  };
};
