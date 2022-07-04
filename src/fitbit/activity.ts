import { readFile, writeFile } from 'fs/promises';
import {
  IntradayMetric,
  intradayMetrics,
  storeActivityIntraday,
  storeActivityLogs,
} from '../database';
import { fetchWithAuthRefresh, getUserAuthHeader } from './auth';

const USER_ID = process.env.FITBIT_USER_ID;

export const getActivityLogListForDate = async (date: string) => {
  // let result = await fetchWithAuthRefresh(
  //   `https://api.fitbit.com/1/user/-/activities/list.json?afterDate=${date}&sort=asc&offset=0&limit=25`,
  //   {
  //     headers: {
  //       accept: 'application/json',
  //       Authorization: await getUserAuthHeader(),
  //     },
  //   }
  // );

  // let data: { activities: Record<string, any>[] } = await result.json();
  let filename = `json/logs/${date}.json`;
  let data = JSON.parse(await readFile(filename, 'utf-8'));
  // console.log('headers', result.headers);
  console.log('got data!', data);
  let result = {
    ok: true,
  };

  if (result.ok) {
    await writeFile(filename, JSON.stringify(data));
    // await storeActivityLogs(data.activities);

    data.activities.forEach((activity: any) => {
      intradayMetrics.forEach((activityType) => {
        getActivityIntraday(
          activityType,
          activity.startTime,
          activity.duration
        );
      });
    });
  } else {
    console.error(data);
  }
};

const pad0 = (num: number) => {
  let numStr = `${num}`;
  if (numStr.length < 2) {
    return '0' + numStr;
  }

  return numStr;
};

const formatDate = (date: Date) => {
  return `${pad0(date.getFullYear())}-${pad0(date.getMonth() + 1)}-${pad0(
    date.getDate()
  )}`;
};

const formatTime = (d: Date) => {
  return `${pad0(d.getHours())}:${pad0(d.getMinutes())}`;
};

export const getActivityIntraday = async (
  metricType: IntradayMetric,
  start: string,
  duration: number
) => {
  console.log('getting activity intraday', metricType, start);

  let startDate = new Date(start);
  let endDate = new Date(startDate.getTime() + duration);
  let url = `https://api.fitbit.com/1/user/-/activities/${metricType}/date/${formatDate(
    startDate
  )}/1d/1min/time/${formatTime(startDate)}/${formatTime(endDate)}.json`;

  // let result = await fetchWithAuthRefresh(url, {
  //   headers: {
  //     accept: 'application/json',
  //     Authorization: await getUserAuthHeader(),
  //   },
  // });

  // let data = await result.json();

  let result = {
    ok: true,
  };

  let filename = `json/activity/${metricType}-${formatDate(
    startDate
  )}-${formatTime(startDate)}.json`;
  let data = JSON.parse(await readFile(filename, 'utf-8'));

  if (result.ok) {
    // await writeFile(filename, JSON.stringify(data));

    let dataToStore = data[`activities-${metricType}-intraday`].dataset.map(
      (entry: Record<string, any>) => {
        let timestamp = new Date(`${formatDate(startDate)} ${entry.time}`);

        return {
          ...entry,
          type: metricType,
          timestamp,
        };
      }
    );

    storeActivityIntraday(metricType, dataToStore);
  } else {
    console.error(data);
  }
};
