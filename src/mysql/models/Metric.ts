import { DataTypes, Model } from 'sequelize';
import sequelize from '../sequelize';

export const metricNames = [
  'steps',
  'calories',
  'distance',
  'elevation',
  'floors',
] as const;
export type MetricName = typeof metricNames[number];

class Metric extends Model {
  declare id: string;
  declare ActivitySummaryId: string;
  declare time: Date;
  declare calories: number;
  declare steps: number;
  declare distance: number;
  declare elevation: number;
  declare floors: number;
  declare heartRate?: number;

  // only used in calories
  declare mets?: number;
  declare level?: number;
}

Metric.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    metricType: {
      type: DataTypes.ENUM(...metricNames),
      
    },
    time: DataTypes.DATE,
    calories: DataTypes.DOUBLE,
    steps: DataTypes.DOUBLE,
    distance: DataTypes.DOUBLE,
    elevation: DataTypes.DOUBLE,
    floors: DataTypes.DOUBLE,
    heartRate: DataTypes.DOUBLE,
    mets: DataTypes.INTEGER,
    level: DataTypes.INTEGER,
  },
  { sequelize }
);

export default Metric;
