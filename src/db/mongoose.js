import mongoose from "mongoose";

mongoose.connect(
  "mongodb+srv://tofiksaliba:YJeenwNBY1KxjDQI@tofik.x4r2a7e.mongodb.net/bank-api?retryWrites=true&w=majority",
  (error, mongoConnectionInstance) => {
    if (error) throw Error("Mongoose Connection!!, Error: " + error);
    if (!process.env.NODE_ENV) {
      const { host, port, name } = mongoConnectionInstance;
      console.log({ host, port, name });
    }
  }
);