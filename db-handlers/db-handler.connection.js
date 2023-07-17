import { MongoClient } from "mongodb";

let databaseState = null;

const connectDB = async () => {
  try {
    const PORT = 27017;
    const mongoURL = `mongodb://localhost:${PORT}`;
    const databaseName = "crud-database";
    const client = new MongoClient(mongoURL);
    await client.connect();
    console.log("Connected to mongodb port:", PORT);
    databaseState = client.db(databaseName);
    console.log("Connected to database:", databaseName);
  } catch (error) {
    console.error("Error connecting to database ", error);
  }
};

const getDB = () => {
  if (!databaseState) {
    throw new Error("Database connection has not been established");
  }
  return databaseState
};

const getCollection = (collectionName) => {
    if (!databaseState) {
        throw new Error("Database connection has not been established");
      }
    return databaseState.collection(collectionName)
}

export { connectDB, getDB, getCollection };
