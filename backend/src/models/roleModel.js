import mongoose from "mongoose";

const roleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      enum: ["user", "admin"],  
      unique: true, 
    },
  },
  {
    timestamps: true,  
    collection: "roles",  
  }
);

const Role = mongoose.models.Role || mongoose.model("Role", roleSchema);
export default Role;
