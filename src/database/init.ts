import sequelize from './sequelize';
import User from './models/User';
import { generateHashFromPassword } from '../helpers';

interface UserFromEnv {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
}

/**
 * This will update the tables if any of the schema was wrong.
 * If FORCE_DB_RESET is true, then it will drop the tables and
 * recreate them.
 *
 * It will also create the owner's user entry in the Users table.
 */
export default async () => {
  let forceReset = process.env.FORCE_DB_RESET === 'true';
  await sequelize.sync({ force: forceReset });

  let usersToSeed: UserFromEnv[] = JSON.parse(process.env.APP_USERS);
  if (!Array.isArray(usersToSeed)) return;

  usersToSeed.map(async (user) => {
    let existingUser = await User.findOne({
      where: {
        username: user.username
      },
    });

    if (existingUser) {
      existingUser.update({
        ...user,
        password: generateHashFromPassword(user.password),
      });
    } else {
      User.create({
        ...user,
        password: generateHashFromPassword(user.password),
      });
    }
  });
};
