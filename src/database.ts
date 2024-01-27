import { MONGODB_URI } from "./config";
import mongoose,{type ConnectOptions} from "mongoose";
const clientOptions : ConnectOptions = { serverApi: { version: "1", strict: true, deprecationErrors: true } };
async function connectDB() {
    try {
        // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
        await mongoose.connect(MONGODB_URI, clientOptions);
        await mongoose.connection.db.admin().command({ ping: 1 });
        console.log("🥭 Successfully connected to MongoDB!");
    } catch(err) {
        // Ensures that the client will close when you finish/error
        await mongoose.disconnect();
        console.error(err);
        process.exit(1);
    }
}
export default connectDB;