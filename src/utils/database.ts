import mongoose from "mongoose";
import config from "config";

const dbUrl = `mongodb://${config.get("dbName")}:${config.get(
  "dbPass",
)}@localhost:6000/iqbalikhlasulamal?authSource=admin`;

export const connect = async () => {
  try {
    await mongoose.connect(dbUrl, {
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    });
    console.log("Connected to db");
  } catch (err) {
    console.log(err);
    setTimeout(connect, 5000);
  }
};

export const disconnect = async () => {
  await mongoose.disconnect();
};

export default {
  connect,
  disconnect,
};
