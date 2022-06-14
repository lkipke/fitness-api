import { DataTypes, Model } from 'sequelize';
import sequelize from '../sequelize';
import Session from './Session';

class User extends Model {
  declare id: string;
  declare firstName: string;
  declare lastName: string;
  declare username: string;
  declare password: string;
  declare authToken: string;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
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
    authToken: {
      type: DataTypes.STRING,
    },
    // authTokenExpiry: {
    //   type: DataTypes.DATE,
    // },
  },
  { sequelize }
);

User.hasMany(Session);
Session.belongsTo(User);

export default User;
