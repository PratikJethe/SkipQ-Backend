import mongoose, { ConnectOptions } from "mongoose";

const mongoConnect = async () => {
  const options: ConnectOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
  };
console.log(process.env.DB)
  mongoose.connect(process.env.DB as string, options);
};

export { mongoConnect };


