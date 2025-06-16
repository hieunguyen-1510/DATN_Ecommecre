import User from "../models/userModel.js";

// GET user Profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await User
      .findById(req.user._id)
      .populate("role")
      .select("-password -resetPasswordToken -resetPasswordExpires");

      if (!user) {
        return res.json({success: false, message: "Người dùng không tìm thấy."})
      }

      res.json({
        success: true,
        data: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role ? user.role.name: "N/A",
            address: user.address,
            phone: user.phone,
            avatar: user.avatar,
            rank: user.rank
        },

      });
  } catch (error) {
    console.error("Lỗi khi lấy thông tin profile:", error);
    res.json({success: false, message: "Lỗi server khi lấy thông tin profile."});
  }
};

// PUT update profile

export const updateUserProfile = async(req, res) => {
    try {
        const userId = req.user._id;
        const {name, email, address, phone, avatar} = req.body;

        // Tim va cap nhat nguoi dung
        const user = await User.findById(userId);

        if (!user) {
            return res.json({success: false, message: "Người dùng không tìm thấy."});
        }

        // Cập nhật các trường thông tin 
        if (email && email !== user.email) {
            const emailExists = await User.findOne({email});
            if (emailExists && emailExists._id.toString() !== userId) {
                return res.json({success: false, message: "Email này đã được sử dụng bởi người khác."});
            }
            user.email = email;
        }
        user.name = name || user.name;
        user.address = address || user.address;
        user.phone = phone || user.phone;
        user.avatar = avatar || user.avatar;
        await user.save();

        const updatedUser = await User
        .findById(req.user._id)
        .populate("role")
        .select("-password -resetPasswordToken -resetPasswordExpires");

        res.json({
            success: true, 
            message: "Cập nhật hồ sơ thành công.",
            data: {
                id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role ? updatedUser.role.name: "N/A",
                address: updatedUser.address,
                phone: updatedUser.phone,
                avatar: updatedUser.avatar,
                rank: updatedUser.rank
            },
        });
    } catch (error) {
        console.error("Lỗi khi cập nhật profile:", error);
        res.json({success: false, message: "Lỗi server khi cập nhật profile."})
    }
}
