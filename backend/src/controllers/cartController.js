import cartModel from "../models/cartModel.js";

// GET user cart
const getUserCart = async (req, res) => {
  try {
    const userId = req.user.id;
    if (!userId) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Không tìm thấy thông tin người dùng.",
        });
    }
    const cart = await cartModel
      .findOne({ userId })
      .populate("items.productId");

    if (!cart) {
      return res.json({ success: true, cartData: { items: [] } });
    }

    res.json({ success: true, cartData: cart });
  } catch (error) {
    console.error("Lỗi lấy giỏ hàng:", error);
    res.status(500).json({ success: false, message: "Lỗi server!" });
  }
};

// addToCart
const addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    if (!userId) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Không tìm thấy thông tin người dùng.",
        });
    }

    const { itemId, size, quantity = 1 } = req.body;
    if (!itemId || !size) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Thiếu thông tin sản phẩm (itemId, size).",
        });
    }

    let cart = await cartModel.findOne({ userId });

    if (!cart) {
      cart = new cartModel({ userId, items: [] });
    }

    const existingItem = cart.items.find(
      (item) => item.productId.toString() === itemId && item.size === size
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ productId: itemId, size, quantity });
    }

    await cart.save();
    res.json({ success: true, message: "Thêm vào giỏ hàng thành công!" });
  } catch (error) {
    console.error("Lỗi thêm vào giỏ hàng:", error);
    if (error.name === "ValidationError") {
      return res
        .status(400)
        .json({
          success: false,
          message: "Dữ liệu không hợp lệ.",
          errors: error.errors,
        });
    }
    res.status(500).json({ success: false, message: "Lỗi server!" });
  }
};

// updateCart
const updateCart = async (req, res) => {
  try {
    const userId = req.user.id;
    if (!userId) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Không tìm thấy thông tin người dùng.",
        });
    }

    const { itemId, size, quantity } = req.body;

    if (!itemId || !size || quantity === undefined) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Thiếu thông tin sản phẩm (itemId, size, quantity).",
        });
    }
    if (typeof quantity !== "number" || quantity < 0) {
      return res
        .status(400)
        .json({ success: false, message: "Số lượng không hợp lệ." });
    }

    const cart = await cartModel.findOne({ userId });
    if (!cart) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy giỏ hàng!" });
    }

    const itemIndex = cart.items.findIndex(
      (i) => i.productId.toString() === itemId && i.size === size
    );

    if (itemIndex === -1) {
      return res
        .status(404)
        .json({
          success: false,
          message: "Sản phẩm không tồn tại trong giỏ hàng!",
        });
    }

    if (quantity === 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = quantity;
    }

    await cart.save();
    const populatedCart = await cartModel
      .findOne({ userId })
      .populate("items.productId");
    res.json({
      success: true,
      message: "Giỏ hàng đã được cập nhật!",
      cartData: populatedCart,
    });
  } catch (error) {
    console.error("Lỗi cập nhật giỏ hàng:", error);
    res.status(500).json({ success: false, message: "Lỗi server!" });
  }
};

// clearCart
const clearCart = async (req, res) => {
  try {
    const userId = req.user.id;
    if (!userId) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Không tìm thấy thông tin người dùng.",
        });
    }

    const cart = await cartModel.findOneAndDelete({ userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy giỏ hàng để xóa",
      });
    }

    res.json({
      success: true,
      message: "Đã xóa toàn bộ giỏ hàng thành công",
      cartData: { items: [] },
    });
  } catch (error) {
    console.error("Lỗi xóa giỏ hàng:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server!",
    });
  }
};

const mergeGuestCart = async (req, res) => {
  try {
    const userId = req.user.id;
    if (!userId) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Không tìm thấy thông tin người dùng.",
        });
    }

    const { guestCartItems } = req.body;
    if (!guestCartItems || !Array.isArray(guestCartItems)) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Dữ liệu giỏ hàng của guest không hợp lệ.",
        });
    }

    if (guestCartItems.length === 0) {
      // Nếu giỏ của guest rỗng, vẫn lấy giỏ hàng hiện tại của user trả về
      const currentUserCart = await cartModel
        .findOne({ userId })
        .populate("items.productId");
      res.json({
        success: true,
        message: "Không có sản phẩm nào ở giỏ hàng guest để đồng bộ.",
        cartData: currentUserCart || { items: [] },
      });
    }

    let userCart = await cartModel.findOne({ userId });

    if (!userCart) {
      userCart = new cartModel({ userId, items: [] });
    }

    for (const guestItem of guestCartItems) {
      if (
        !guestItem.productId ||
        guestItem.size ||
        typeof guestItem.quantity !== "number" ||
        guestItem.quantity <= 0
      ) {
        console.warn("Bỏ qua guest item không hợp lệ:", guestItem);
        continue; // Bỏ qua item không hợp lệ
      }

      const existingItemIndex = userCart.items.findIndex(
        (item) =>
          item.productId.toString() === guestItem.productId &&
          item.size === guestItem.size
      );

      if (existingItemIndex > -1) {
        userCart.items[existingItemIndex].quantity += guestItem.quantity; // Cộng dồn số lượng
      } else {
        userCart.items.push({
          productId: guestItem.productId,
          size: guestItem.size,
          quantity: guestItem.quantity,
        });
      }
    }

    await userCart.save();
    const populatedCart = await cartModel
      .findOne({ userId })
      .populate("items.productId");
    res.json({
      success: true,
      message: "Đồng bộ giỏ hàng thành công.",
      cartData: populatedCart,
    });
  } catch (error) {
    console.error("Lỗi đồng bộ giỏ hàng guest:", error);
    if (error.name === "ValidationError") {
      return res
        .status(400)
        .json({
          success: false,
          message: "Dữ liệu không hợp lệ khi đồng bộ.",
          errors: error.errors,
        });
    }
    res
      .status(500)
      .json({ success: false, message: "Lỗi server khi đồng bộ giỏ hàng!" });
  }
};

export { getUserCart, addToCart, updateCart, clearCart, mergeGuestCart };
