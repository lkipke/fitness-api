export interface FitbitDataPoint {
  time: string;
  value: number;
  mets?: number;
  level?: number;
}

export interface HeartRateZone {
  caloriesOut: number;
  max: number;
  min: number;
  minutes: number;
  name: string;
}

export interface HeartRateValue {
  customHeartRateZones: HeartRateZone[];
  heartRateZones: HeartRateZone[];
}

export interface FitbitIntradayData {
  metricType: IntradayMetric;
  date: string;
  value: number | HeartRateValue;
  points: FitbitDataPoint[];
}

export const intradayMetrics = [
  'steps',
  'calories',
  'distance',
  'elevation',
  // 'floors',
  'heart'
] as const;
export type IntradayMetric = typeof intradayMetrics[number];

export interface ActivitySummaryType {
  activeDuration: number;
  levelMinutesSedentary: number;
  levelMinutesLightly: number;
  levelMinutesFairly: number;
  levelMinutesVery: number;
  activityName: string;
  activityTypeId: number;
  averageHeartRate: number;
  calories: number;
  caloriesLink: string;
  duration: number;
  heartRateLink: string;
  lastModified: Date;
  logId: number;
  logType: string;
  startTime: Date;
  steps: number;
  tcxLink: string;
}
