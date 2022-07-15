import { DataTypes, Model } from 'sequelize';
import sequelize from '../sequelize';
import HeartRateZone from './HeartRateZone';
import Metric from './Metric';

class ActivitySummary extends Model {
  declare id: string;
  declare activeDuration: number;
  declare levelMinutesSedentary: number;
  declare levelMinutesLightly: number;
  declare levelMinutesFairly: number;
  declare levelMinutesVery: number;
  declare activityName: string;
  declare activityTypeId: number;
  declare averageHeartRate: number;
  declare calories: number;
  declare caloriesLink: string;
  declare duration: number;
  declare heartRateLink: string;
  declare lastModified: Date;
  declare logId: number;
  declare logType: string;
  declare startTime: Date;
  declare steps: number;
  declare tcxLink: string;
}

ActivitySummary.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    activeDuration: DataTypes.INTEGER,
    levelMinutesSedentary: DataTypes.INTEGER,
    levelMinutesLightly: DataTypes.INTEGER,
    levelMinutesFairly: DataTypes.INTEGER,
    levelMinutesVery: DataTypes.INTEGER,
    activityName: DataTypes.STRING,
    activityTypeId: DataTypes.BIGINT,
    averageHeartRate: DataTypes.INTEGER,
    calories: DataTypes.INTEGER,
    caloriesLink: DataTypes.STRING,
    distance: DataTypes.DOUBLE,
    duration: DataTypes.INTEGER,
    heartRateLink: DataTypes.STRING,
    lastModified: DataTypes.DATE,
    logId: DataTypes.BIGINT,
    logType: DataTypes.STRING,
    startTime: DataTypes.DATE,
    steps: DataTypes.INTEGER,
    tcxLink: DataTypes.STRING,
  },
  { sequelize }
);

ActivitySummary.hasMany(HeartRateZone);
HeartRateZone.belongsTo(ActivitySummary);

ActivitySummary.hasMany(Metric);
Metric.belongsTo(ActivitySummary);

export default ActivitySummary;
