const { model, Schema } = require('mongoose');

const userSchema = Schema({
    firstName: {type: String, required: true, trim: true},
    lastName: {type: String, required: true, trim: true},
    email: {type: String, required: true, unique: true, trim: true},
    password: {type: String, required: true}
}, {versionKey: false});

const User = model("User", userSchema);

module.exports=User;