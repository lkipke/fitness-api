import { DataTypes, Model } from 'sequelize';
import sequelize from '../sequelize';

class AuthSession extends Model {
  /** foreign key to User table*/
  declare UserId: string;
  declare sessionToken: string;
}

AuthSession.init(
  {
    sessionToken: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
  },
  { sequelize }
);

export default AuthSession;
