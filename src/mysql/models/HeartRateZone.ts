import { DataTypes, Model } from 'sequelize';
import sequelize from '../sequelize';

const heartRateZoneNames = [
  'Out of Range',
  'Fat Burn',
  'Cardio',
  'Peak',
] as const;
type HeartRateZoneName = typeof heartRateZoneNames[number];

class HeartRateZone extends Model {
  declare id: string;
  declare caloriesOut: number;
  declare max: number;
  declare min: number;
  declare minutes: number;
  declare name: HeartRateZoneName;
  declare ActivitySummaryId: string;
}

HeartRateZone.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    caloriesOut: DataTypes.DOUBLE,
    max: DataTypes.INTEGER,
    min: DataTypes.INTEGER,
    minutes: DataTypes.INTEGER,
    name: DataTypes.ENUM(...heartRateZoneNames),
  },
  { sequelize }
);

export default HeartRateZone;
