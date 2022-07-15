export const intradayMetrics = [
  'steps',
  'calories',
  'distance',
  'elevation',
  'floors',
] as const;
export type IntradayMetric = typeof intradayMetrics[number];

interface FitbitTime {
  dateTime: string;
  value: string;
}

export interface FitbitData {
  time: string;
  value: number;
  mets?: number;
  level?: number;
}

interface FitbitDataSet {
  dataset: FitbitData[];
  datasetInterval: number;
  datasetType: "minute" | "hour";
}

const parseActivityIntraday = async (metricType: IntradayMetric, entries: Record<string, any>): Promise<> => {
  const timeData: FitbitTime[] = entries[`activities-${metricType}`];
  const dataset: FitbitDataSet = entries[`activities-${metricType}-intraday`];

  if (!timeData || !dataset) {
    throw new Error('malformed data set, could not parse');
  }

  return {
    // activeDuration: ;
    // levelMinutesSedentary: number;
    // levelMinutesLightly: number;
    // levelMinutesFairly: number;
    // levelMinutesVery: number;
    // activityName: string;
    // activityTypeId: number;
    // averageHeartRate: number;
    // calories: number;
    // caloriesLink: string;
    // duration: number;
    // heartRateLink: string;
    // lastModified: Date;
    // logId: number;
    // logType: string;
    // startTime: Date;
    // steps: number;
    // tcxLink: string;
  }
}
