const mongoose = require("mongoose");
const plm = require("passport-local-mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/pinterest-app");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: false },
  fullname: { type: String, required: true, unique: false },
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
  dp: {type: String,},
  email: { type: String, required: true, unique: true },
  password: { type: String },
});

userSchema.plugin(plm);

module.exports = mongoose.model("User", userSchema);
