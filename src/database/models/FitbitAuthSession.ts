import { DataTypes, Model } from 'sequelize';
import sequelize from '../sequelize';

class FitbitAuthSession extends Model {
  /** foreign key to User table*/
  declare UserId: string;

  declare accessToken: string;
  declare refreshToken: string;
  declare expiresIn: number;
  declare scope: string;
  declare tokenType: string;
}

FitbitAuthSession.init(
  {
    accessToken: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    refreshToken: {
      type:  DataTypes.STRING(500),
      allowNull: false
    },
    scope: DataTypes.STRING,
    tokenType: DataTypes.STRING,
  },
  { sequelize }
);

export default FitbitAuthSession;
