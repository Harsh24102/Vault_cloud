import mongoose from 'mongoose';

const connectDB = handler => async (req, res) => {
  if (mongoose.connections[0].readyState) {
    // Use current db connection
    return handler(req, res);
  }
  // Use new db connection
  try{

    await mongoose.connect(process.env.MONGODB_URI, {
       useUnifiedTopology: true,
       useNewUrlParser: true
     })
     console.log("Database connected!")
  }
  catch(err){
    // Stop here instead of running the handler without a database.
    console.error(err)
    return res.status(500).json({ message: 'Database connection failed' })
  }
  return handler(req, res);
};

export default connectDB;