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

    const orders = await Order.aggregate([
        {$match: {userId: userId}},
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

    await User.findById(userId, {rank});
}