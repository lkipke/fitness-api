import { DataTypes, Model } from 'sequelize';
import sequelize from '../sequelize';

class Auth extends Model {
  declare userId: string;
  declare accessToken: string;
  declare expiresIn: number;
  declare refreshToken: string;
  declare scope: string;
  declare tokenType: string;
}

Auth.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    accessToken: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    refreshToken: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    scope: DataTypes.STRING,
    tokenType: DataTypes.STRING,
  },
  { sequelize }
);

export default Auth;
