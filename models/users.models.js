const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    //required: true
  },
  email: {
    type: String,
    lowercase: true,
    validate: {
      validator: function(v) {
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
      },
      message: props => `${props.value} is not a valid email!`
    },
  },
  password: {
    type: String,
  },
  phone_no: {
    type: Number,
    trim: true,
    validate: {
      validator: function(v) {
        return /\d{10}/.test(v);
      },
      message: props => `${props.value} is not a valid phone number!`
    },
  },
  organization_name:{
    type: String,
  },
  bio : {
    type: String,
    maxlength: 250
  },
  linkedin_profile : {
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        return /^(www\.)?linkedin\.com\/in\/[A-Za-z0-9-]+\/?$/.test(v);
      },
      message: props => `${props.value} is not a valid LinkedIn profile URL`
    },
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