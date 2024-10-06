import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    avatar: {type: String, default: "https://nursinginstitutegoa.org/wp-content/uploads/2016/01/tutor-8.jpg"}
}, {timestamps: true});

const User = mongoose.model("User", userSchema);

export default User;
