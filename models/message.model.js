const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let MessageSchema = new Schema({
  recipient: {type: String, required: true, maxlength: 180}, // userID
  sender: {type: String, required: true, maxlength: 180}, // userID
  title: {type: String, required: true, maxlength: 180},
  body: {type: String, required: true, maxlength: 500},
  image: {type: String, maxlength: 180}, // URL
  anonymous: {type: Boolean, default: false},
  deleted: {type: Boolean, default: false}
}, { timestamps: true }, { collection : 'messages' })

MessageSchema.options.toJSON = {
  transform: function(doc, ret, options) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
  }
};

module.exports = mongoose.model('Message', MessageSchema);