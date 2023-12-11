import mongoose, { mongo } from "mongoose";
import config from "config";

async function connect(): Promise<void> {
  const dbUri = config.get<string>("dbUri");

  try {
    await mongoose.connect(dbUri);
    console.log("Connected to database");
  } catch (e) {
    console.log("Error connecting to database");
    console.log(e);
    process.exit(1);
  }
}

export default connect;
