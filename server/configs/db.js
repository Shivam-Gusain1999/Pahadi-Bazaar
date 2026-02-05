import mongoose from "mongoose";

const connectDB = async()=>{
mongoose.connection.on('connected', ()=>{
    console.log("Database Connected")
})
try {
   await mongoose.connect(`${process.env.MONGODB_URI}/pahadibazaar`)
} catch (error) {
    console.error(error.message)
}
}
export default connectDB;