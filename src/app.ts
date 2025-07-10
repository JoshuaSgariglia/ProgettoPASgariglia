import express from "express";
import userRoutes from "./routes/userRoutes";
import { ErrorFactory } from "./utils/errorFactory"
import { ErrorType } from "./utils/enums";
import { User } from "./orm/User";
import { DatabaseConnector } from "./orm/DatabaseConnector";
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Use values from .env with fallbacks
const APP_HOST = process.env.APP_HOST || 'localhost';
const APP_PORT = process.env.APP_PORT || 8080;


app.use(express.json());
//app.use("/api", userRoutes);

DatabaseConnector.getInstance();

/* Create Redis client
const redisClient = createClient({
  url: `redis://${REDIS_HOST}:${REDIS_PORT}`
});

redisClient.on('error', (err: Error) => console.error('Redis Client Error', err));
*/

//await redisClient.connect();
app.get('/', async (req: any, res: any) => {
  try {
    const userList = await User.findAll();
    //ErrorFactory.getError(ErrorType.Unauthorized).send(res)
    res.json(userList);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

app.listen(APP_PORT, () => {
  console.log(`App listening at http://${APP_HOST}:${APP_PORT}`);
});
