import cartModel from "../models/cartModel.js";
import cartHistoryModel  from "../models/cartHistoryModel.js";

const getUserCart = async (req, res) => {
    try {
      const userId = req.user.id;
      const cart = await cartModel.findOne({ userId }).populate("items.productId");
      // console.log("Populated Cart Items:", cart.items); 
      if (!cart) {
        return res.json({ success: true, cartData: [] });
      }
      res.json({ success: true, cartData: cart.items });
    } catch (error) {
      console.error("Lỗi lấy giỏ hàng:", error);
      res.status(500).json({ success: false, message: "Lỗi server!" });
    }
  };

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
    await cartHistoryModel.create({
      userId,
      productId: itemId,
      size,
      action: existingItem ? "update" : "add",
      quantity: 1,
    });
    res.json({ success: true, message: "Thêm vào giỏ hàng thành công!" });
  } catch (error) {
    console.error("Lỗi thêm vào giỏ hàng:", error);
    res.status(500).json({ success: false, message: "Lỗi server!" });
  }
};

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
        // Remove
        cart.items.splice(itemIndex, 1);
      } else {
        // Update
        cart.items[itemIndex].quantity = quantity;
      }
  
      await cart.save();
      await cartHistoryModel.create({
        userId,
        productId: itemId,
        size,
        action: quantity === 0 ? "remove" : "update",
        quantity,
      });      
      res.json({ success: true, message: "Giỏ hàng đã được cập nhật!" });
    } catch (error) {
      console.error("Lỗi cập nhật giỏ hàng:", error);
      res.status(500).json({ success: false, message: "Lỗi server!" });
    }
  };

  // DELETE cart
  const clearCart = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Tìm và xóa toàn bộ giỏ hàng
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

  // GET history 
  const getCartHistory = async (req, res) => {
    try {
      const userId = req.user.id;
      const history = await cartHistoryModel
        .find({ userId })
        .populate("productId")
        .sort({ timestamp: -1 });
  
      res.json({ success: true, history });
    } catch (error) {
      console.error("Lỗi lấy lịch sử giỏ hàng:", error);
      res.status(500).json({ success: false, message: "Lỗi server!" });
    }
  };

export { getUserCart, addToCart, updateCart,clearCart, getCartHistory};
