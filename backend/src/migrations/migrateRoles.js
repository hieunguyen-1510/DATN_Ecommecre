import connectDB from "../connectDB.js"; 
import User from "../models/userModel.js"; 
import Role from "../models/roleModel.js"; 

// Connect to MongoDB
const migrateRoles = async () => {
  try {
    // Connect to DB
    await connectDB();

    // Create roles
    const userRole = await Role.findOneAndUpdate(
      { name: "user" },
      { name: "user" },
      { upsert: true, new: true }
    );
    const adminRole = await Role.findOneAndUpdate(
      { name: "admin" },
      { name: "admin" },
      { upsert: true, new: true }
    );

    // Update existing users
    await User.updateMany(
      { role: "user" },
      { role: userRole._id }
    );
    await User.updateMany(
      { role: "admin" },
      { role: adminRole._id }
    );

    console.log("Migration completed!");
  } catch (error) {
    console.error("Migration error:", error);
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log("MongoDB connection closed.");
  }
};

// Run the migration
migrateRoles();