import { DataTypes, Model } from "sequelize";
import sequelize from "../sequelize";

class MetricData extends Model {
  declare id: string;
  declare time: Date;
  declare heartRate: string;
  declare speed: string;
  declare cadence: string;
  declare power: string;
  declare calories: string;
  declare SessionId: string;
}

MetricData.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    time: {
        type: DataTypes.DATE,
        allowNull: false
    },
    heartRate: DataTypes.INTEGER,
    speed: DataTypes.DOUBLE,
    cadence: DataTypes.DOUBLE,
    power: DataTypes.DOUBLE,
    calories: DataTypes.DOUBLE,
  },
  { sequelize }
);

export default MetricData;
