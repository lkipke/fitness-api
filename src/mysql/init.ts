import sequelize from './sequelize';

/**
 * This will update the tables if any of the schema was wrong.
 * If FORCE_DB_RESET is true, then it will drop the tables and
 * recreate them.
 */
export default async () => {
  let forceReset = process.env.FORCE_DB_RESET === 'true';
  await sequelize.sync({ force: forceReset });
};
