import mongoose from "mongoose";

let isConnected = false; // track the connection

export const connectToDB = async () => {
  mongoose.set("strictQuery", true);

  if (isConnected) {
    console.log("MongoDB is already connected");
    return;
  }

  if (!process.env.MONGODB_URI) {
    console.error("MONGODB_URI is not defined");
    throw new Error("MONGODB_URI is not defined");
  }

  try {
    const opts = {
      dbName: "share_prompt",
      serverSelectionTimeoutMS: 5000,
      maxPoolSize: 10, // Maintain up to 10 socket connections
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      family: 4, // Use IPv4, skip trying IPv6
    };

    await mongoose.connect(process.env.MONGODB_URI, opts);

    isConnected = true;
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);

    // Implement retry logic
    if (error.name === "MongooseServerSelectionError") {
      console.log("Retrying connection in 5 seconds...");
      setTimeout(connectToDB, 5000);
    } else {
      throw error;
    }
  }
};

// Graceful shutdown
process.on("SIGINT", async () => {
  try {
    await mongoose.connection.close();
    console.log("MongoDB connection closed through app termination");
    process.exit(0);
  } catch (err) {
    console.error("Error closing MongoDB connection:", err);
    process.exit(1);
  }
});
