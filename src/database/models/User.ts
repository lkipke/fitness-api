import { DataTypes, Model } from 'sequelize';
import sequelize from '../sequelize';
import Activity from './Activity';
import AuthSession from './AuthSession';
import FitbitAuthSession from './FitbitAuthSession';

class User extends Model {
  /** primary key */
  declare id: string;

  declare fitbitUserId?: string;
  declare firstName: string;
  declare lastName: string;
  declare username: string;
  declare password: string;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    fitbitUserId: DataTypes.STRING,
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING(64),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { sequelize }
);

User.hasMany(Activity);
Activity.belongsTo(User);

User.hasOne(AuthSession);
AuthSession.belongsTo(User);

User.hasOne(FitbitAuthSession);
FitbitAuthSession.belongsTo(User);

export default User;
