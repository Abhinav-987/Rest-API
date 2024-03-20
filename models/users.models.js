const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    //required: true
  },
  user_id: {
    type: Number
    //required: true
  },
  // mac_add: {
  //   type: String
  // },
  //
  sender_id: {
    type: String,
    //required: true
  },
  reciever_id : {
    type: String,
    //required: true
  },
  connection : {
    type: [String],
  }
});

const User = mongoose.model('user', UserSchema);
module.exports=User;