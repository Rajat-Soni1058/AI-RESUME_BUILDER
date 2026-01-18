import mongoose from "mongoose";

const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log("Database connected successfully");
    });

    let mongodbURI = process.env.MONGODB_URI;
    const projectName = 'resume-builder';

    if (!mongodbURI) {
      throw new Error("MONGODB_URI environment variable not set");
    }
    await mongoose.connect(`${mongodbURI}/${projectName}`)

  } catch (error) {
    console.log("error connected to data base :",error);

  }
};
export default connectDB;
