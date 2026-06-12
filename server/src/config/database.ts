import { Sequelize } from "sequelize";
import * as dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME!,
  process.env.DB_USER!,
  String(process.env.DB_PASSWORD!),
  {
    host: process.env.DB_HOST!,
    port: Number(process.env.DB_PORT!),
    dialectOptions: process.env.NODE_ENV === 'prod' ? {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    } : {},
    dialect: "postgres",
    logging: false,
  }
);

export default sequelize;
