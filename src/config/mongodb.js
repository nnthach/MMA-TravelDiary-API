import { env } from "~/config/environment";
import { MongoClient, ServerApiVersion } from "mongodb";

// Khởi tạo đối tượng
let traveldiaryDatabaseInstance = null;

// Hàm khởi tạo kết nối MongoDB
const mongoClientInstance = new MongoClient(env.MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// Connect to database first
export const CONNECT_DB = async () => {
  await mongoClientInstance.connect();

  // if connect success => set instance
  traveldiaryDatabaseInstance = mongoClientInstance.db(env.DATABASE_NAME);
};

// Get database instance after connect success
export const GET_DB = () => {
  if (!traveldiaryDatabaseInstance) {
    throw new Error("Connect to db first");
  }
  return traveldiaryDatabaseInstance;
};

export const CLOSE_DB = async () => {
  await mongoClientInstance.close();
}
