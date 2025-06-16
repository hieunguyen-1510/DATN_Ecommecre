import mongoose from "mongoose";
import User from "../models/userModel.js";
import Order from "../models/orderModel.js";

export const getCustomerRanks = async (req, res) => {
    try {
        const users = await User.find().populate("role");
        const orders = await Order.aggregate([
            {
              $group: {
                _id: "$userId",
                totalSpent: {$sum: "$totalAmount"}
              },
            },
        ]);

        const rankedUsers = users.map((user) => {
            const orderData = orders.find((o) => o._id.toString() === user._id.toString());
            const totalSpent = orderData?.totalSpent || 0;

            let rank = "Chưa mua hàng";
            if (totalSpent >= 10000000) rank = "Kim cương";
            else if (totalSpent >= 5000000) rank = "Bạch kim";
            else if (totalSpent >= 2000000) rank = "Vàng";
            else if (totalSpent > 0) rank = "Bạc";

            return {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role?.name || "User",
                totalSpent,
                rank,
            };
        });

        res.json(rankedUsers);

    } catch (error) {
        console.error("Lỗi khi lấy danh sách khách hàng:", error);
        res.status(500).json({message: "Lỗi server"});
    }
}

export const updateUserRank = async (userId) => {
  try {
    // Tính tổng số tiền đã chi tiêu của người dùng
     const orders = await Order.aggregate([
          {$match: {userId: new mongoose.Types.ObjectId(userId)}}, 
            {
              $group: {
                  _id: "$userId",
                  totalSpent: {$sum: "$totalAmount"}
            },
        },
      ]);

    const totalSpent = orders[0]?.totalSpent || 0;

    let rank = "Chưa mua hàng";
    if (totalSpent >= 10000000) rank = "Kim cương";
    else if (totalSpent >= 5000000) rank = "Bạch kim";
    else if (totalSpent >= 2000000) rank = "Vàng";
    else if (totalSpent > 0) rank = "Bạc";

    // Cập nhật rank vào db
    const updatedUser = await User.findByIdAndUpdate(
        userId, 
        { rank: rank }, 
        { new: true } 
    );

    if (!updatedUser) {
            console.warn(`Không tìm thấy người dùng với ID ${userId} để cập nhật hạng.`);
        } else {
            console.log(`Hạng của người dùng ${updatedUser.name} (${userId}) đã được cập nhật thành: ${rank}`);
        }

        return updatedUser;
    
  } catch (error) {
    console.error(`Lỗi khi cập nhật hạng người dùng ${userId}:`, error);
  }  
}