import mongoose from "mongoose";

const sendMoneySchema = new mongoose.Schema(
  {
    sender: {
      type: String,
      required: true,
      min: 2,
      max: 50,
    },
    recipient: {
      type: String,
      required: true,
      min: 2,
      max: 50,
    },
    amount: {
      type: String,
      required: true,
      max: 50,
      unique: true,
    },
    purpose: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const SendMoney = mongoose.model("sendMoney", sendMoneySchema);
export default SendMoney;
