const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRound = 10;
// var db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function() {
//   // we're connected!
// });

var userSchema = mongoose.Schema({
    email: { type: String, required: true, index: { unique: true } },
    password: { type: String },
    twitter: { type: Object }
});

userSchema.pre('save', function(next) {
  var user = this;
  if (!user.password) {
    next();
  }else{
    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();
    // generate a salt
    bcrypt.genSalt(saltRound, function(err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
  }
})


userSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};


var User = mongoose.model('User', userSchema);

module.exports = User;
