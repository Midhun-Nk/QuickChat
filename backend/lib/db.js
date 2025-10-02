import mongoose from "mongoose";

const connectDB = async()=>{
    try {

       mongoose.connection.on('connected',()=>{
        console.log("Db is connected")
       })
       await mongoose.connect(`${process.env.MONGODB_URI}/chatApp`)
        
    } catch (error) {
        console.log(error)
    }
}


export default connectDB