import mongoose, { mongo } from "mongoose";
import config from "config";
import log from "./logger";

async function connect(): Promise<void> {
  const dbUri = config.get<string>("dbUri");

  try {
    await mongoose.connect(dbUri);
    log.info("Connected to database");
  } catch (e) {
    log.error("Error connecting to database");
    process.exit(1);
  }
}

export default connect;
