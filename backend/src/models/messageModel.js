import { Schema, model } from "mongoose";

const MessageSchema = new Schema(
  {
    userId: { type: String, required: true },
    role: { type: String, enum: ["user", "bot"], required: true },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

export default model("Message", MessageSchema);
