import { DataTypes, Model } from "sequelize";
import sequelize from "../sequelize";

class Metric extends Model {
  /** primary key */
  declare id: string;
  /** foreign key to Activity table */
  declare ActivityId: string;

  declare timestamp: Date;
  declare heartRate?: number;
  declare speed?: number;
  declare cadence?: number;
  declare power?: number;
  declare calories?: number;
}

Metric.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    timestamp: {
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

export default Metric;
