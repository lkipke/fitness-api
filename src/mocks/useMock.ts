import { readFile } from 'fs/promises';
import minimatch from 'minimatch';
import path from 'path';
import activitiesList from './activityLogList';
import calories from './activityIntraday/calories';
import distance from './activityIntraday/calories';
import elevation from './activityIntraday/elevation';
import floors from './activityIntraday/floors';
import steps from './activityIntraday/steps';

const MOCKS = {
  '**/activities/list.json*': activitiesList,
  '**/activities/calories/**': calories,
  '**/activities/distance/**': distance,
  '**/activities/elevation/**': elevation,
  '**/activities/floors/**': floors,
  '**/activities/steps/**': steps,
};

export const useMock = async <T>(url: string): Promise<T> => {
  let mockGlobs = Object.keys(MOCKS);
  console.log(mockGlobs)

  for (let glob of mockGlobs) {
    console.log('trying to match ', glob, url)
    if (minimatch(url, glob)) {
      console.log("DATA", JSON.parse(JSON.stringify((MOCKS as any)[glob])));
      return (MOCKS as any)[glob];
      // return JSON.parse(
      //   await readFile(path.join(__dirname, (MOCKS as any)[glob]), 'utf-8')
      // );
    }
  }

  throw new Error(`no matching mock found for url ${url}`);
};
