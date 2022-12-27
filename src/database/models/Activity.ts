import { DataTypes, Model } from 'sequelize';
import sequelize from '../sequelize';
import Metric from './Metric';

class Activity extends Model {
  /** primary key */
  declare id: string;
  /** foreign key to user table */
  declare UserId: string;

  /** where did this come from, i.e. pedal pal, fitbit */
  declare source: string;
  declare name: string;
  declare activityType?: string;
  declare duration?: number;
  declare calories?: number;
}

Activity.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    activityType: DataTypes.STRING,
    duration: DataTypes.DOUBLE,
    calories: DataTypes.DOUBLE
  },
  { sequelize }
);

Activity.hasMany(Metric);
Metric.belongsTo(Activity);

export default Activity;
