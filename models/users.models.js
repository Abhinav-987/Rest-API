const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    //required: true
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  phone_no: {
    type: Number,
  },
  organization_name:{
    type: String,
  },
  bio : {
    type: String,
  },
  linkedin_profile : {
    type: String,
  },
  user_id: {
    type: Number
    //required: true
  },
  sender_id: {
    type: String,
    //required: true
  },
  reciever_id : {
    type: String,
    //required: true
  },
  connection : [{
      user_id : {
        type : String
      },
      connected_at : {
        type : Date
      }
  }]
});

const User = mongoose.model('user', UserSchema);
module.exports=User;