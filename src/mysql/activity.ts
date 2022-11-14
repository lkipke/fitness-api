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
