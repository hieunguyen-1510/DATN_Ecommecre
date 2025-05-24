import cartModel from "../models/cartModel.js";

// GET user cart
const getUserCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const cart = await cartModel.findOne({ userId }).populate("items.productId");

    if (!cart) {
      return res.json({ success: true, cartData: [] });
    }

    res.json({ success: true, cartData: cart.items });
  } catch (error) {
    console.error("Lỗi lấy giỏ hàng:", error);
    res.status(500).json({ success: false, message: "Lỗi server!" });
  }
};

// addToCart
const addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { itemId, size } = req.body;

    let cart = await cartModel.findOne({ userId });

    if (!cart) {
      cart = new cartModel({ userId, items: [] });
    }

    const existingItem = cart.items.find(
      item => item.productId.toString() === itemId && item.size === size
    );

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.items.push({ productId: itemId, size, quantity: 1 });
    }

    await cart.save();
    res.json({ success: true, message: "Thêm vào giỏ hàng thành công!" });
  } catch (error) {
    console.error("Lỗi thêm vào giỏ hàng:", error);
    res.status(500).json({ success: false, message: "Lỗi server!" });
  }
};

// updateCart
const updateCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { itemId, size, quantity } = req.body;

    const cart = await cartModel.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ success: false, message: "Không tìm thấy giỏ hàng!" });
    }

    const itemIndex = cart.items.findIndex(
      (i) => i.productId.toString() === itemId && i.size === size
    );

    if (itemIndex === -1) {
      return res.status(404).json({ success: false, message: "Sản phẩm không tồn tại trong giỏ hàng!" });
    }

    if (quantity === 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = quantity;
    }

    await cart.save();
    res.json({ success: true, message: "Giỏ hàng đã được cập nhật!" });
  } catch (error) {
    console.error("Lỗi cập nhật giỏ hàng:", error);
    res.status(500).json({ success: false, message: "Lỗi server!" });
  }
};

// clearCart
const clearCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const cart = await cartModel.findOneAndDelete({ userId });

    if (!cart) {
      return res.status(404).json({ 
        success: false, 
        message: "Không tìm thấy giỏ hàng để xóa" 
      });
    }

    res.json({ 
      success: true, 
      message: "Đã xóa toàn bộ giỏ hàng thành công" 
    });
  } catch (error) {
    console.error("Lỗi xóa giỏ hàng:", error);
    res.status(500).json({ 
      success: false, 
      message: "Lỗi server!" 
    });
  }
};

export { getUserCart, addToCart, updateCart, clearCart };
