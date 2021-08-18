import mongoose, { ConnectOptions } from "mongoose";

const mongoConnect = async () => {
    
  const options: ConnectOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };

   mongoose.connect(
    "mongodb://127.0.0.1:27017/booktokenDB",
    options,
  );
};

export { mongoConnect };
