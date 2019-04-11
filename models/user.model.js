const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let UserSchema = new Schema({
  googleUserID: {type: String, required: true, maxlength: 180}, // userID
  displayName: {type: String, required: true, maxlength: 180}, // userID
  image: {type: String, required: false, maxlength: 180} // gravitar URL?
}, { timestamps: true }, { collection : 'users' })

UserSchema.options.toJSON = {
  transform: function(doc, ret, options) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
  }
};

module.exports = mongoose.model('User', UserSchema);