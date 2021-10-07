const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  passwordHash: {
    type: String,
  },
});

UserSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.passwordHash;
  },
});

class User {
  static getUserByUsername(username) {
    return this.findOne({ username });
  }

  static createUser(userObj) {
    const user = new User({ userObj });
    return user.save();
  }
}

UserSchema.loadClass(User);

module.exports = mongoose.model('User', UserSchema);
