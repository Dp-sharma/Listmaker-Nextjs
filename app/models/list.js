import mongoose from 'mongoose';
const { Schema } = mongoose;

const list_schema = new Schema({
  email: { 
    type: String, 
    required: true,
    trim: true, 
    minLength: [6, 'Email should be greater than 6 characters']
  },
  title: { 
    type: String, 
    required: true 
  },
  items: { 
    type: [String], 
    default: [] 
  }
});

const list_model = mongoose.models["List"] || mongoose.model('List', list_schema);
export default list_model;
