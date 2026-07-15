import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true, //to hide whitespaces
      index: true, //this is used to make the field Searchable in a optimized way
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      trim: true,
    },
    fullname: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    avatar: {
      type: String, //use cloudinary url later
      required: true,
    },
    coverImage: {
      type: String, //use cloudinary url later
    },
    watchHistory: [
      {
        type: Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);


//We cannot give the callback with arrow function because in arrow function we cannot use "this" keyword for referance but here giving referance is important
//"save" means the logic we r writing in the function will execute just right before saving the data
//using "next" because we r using middleware

// userSchema.pre("save", async function (next) {
//   //using if condtion to avoid to run this hook everytime on every save , now this will only run if password is modified 
//    if(!this.isModified("password")) return next();
//    this.password = await bcrypt.hash(this.password, 10)
//     next()
// });
userSchema.pre("save", async function () {
    if (!this.isModified("password")) return
    this.password = await bcrypt.hash(this.password, 10)
})

//Making a custom method to ask from user that password is correct?
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password)
}

//Making Another custom method to generate the Access token
userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
      {
        //payload
        _id: this._id,
        // email: this.email,
        // username: this.username,
        // fullname: this.fullname
      },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    }
  )
}

//Making Another custom method to generate the Refresh token
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
      {
        //payload
        _id: this._id
      },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY
      }
    )
}

export const User = mongoose.model("User", userSchema);
