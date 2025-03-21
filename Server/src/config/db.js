import mongoose from "mongoose";
import { config } from "dotenv";
import { DB_NAME } from "../../constants.js";

config() ;

const connecttoDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`)
        console.log(`\n MONGODB Connected !! DB HOST : ${connectionInstance.connection.host}`)
    } catch (error) {
        console.log("MONGODB connection error", error);
        process.exit(1) ;
    }
}

export default connecttoDB ;