import mongoose from 'mongoose';
const { Schema } = mongoose;

const user_schema = new Schema({
  name: { type: String, required: true  }, // String is shorthand for {type: String}
  email: { type: String, required: true ,trim:true, minLength:[6,'Password Should be Greate than 6 Charachter']},
  password: { type: String, required: true },
  date : {
    type:Date,
    default:Date.now
  }
});
const user_model = mongoose.models["Users"] || mongoose.model('Users', user_schema);
export default user_model;