import mongoose from "mongoose";
import { initializeRolesAndAssignDefault } from "../middleware/role.js";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: mongoose.Schema.Types.ObjectId, ref: "Role", required: true }, 
    address: { type: String },
    resetPasswordToken: { type: String, select: false },
    resetPasswordExpires: { type: Date, select: false },
  },
  { timestamps: true }
);

// Apply the middleware to the schema
userSchema.pre("save", initializeRolesAndAssignDefault);

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;