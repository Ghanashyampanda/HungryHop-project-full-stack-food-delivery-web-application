import mongoose from "mongoose"
import dns from "dns"

const connectDb = async () => {
    try {
        // Set DNS servers to resolve MongoDB SRV records correctly
        dns.setServers(["8.8.8.8", "8.8.4.4"])
        await mongoose.connect(process.env.MONGODB_URL)
        console.log("MongoDB connected successfully")
    } catch (error) {
        console.error("MongoDB connection failed:", error);
    }
}

export default connectDb