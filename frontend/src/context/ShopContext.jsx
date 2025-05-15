import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";
export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const currency = "đ";
  const delivery_fee = 10000;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState({});
  const [token, setToken] = useState("");
  const [products, setProducts] = useState([]);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || null);

  const navigate = useNavigate();

  const handleLogin = (userToken, userData) => {
    localStorage.setItem("token", userToken);
    localStorage.setItem("user", JSON.stringify(userData));
    setToken(userToken);
    setUser(userData);
  };

  const updateUser = (newUserData) => {
    setUser(newUserData);
    localStorage.setItem("user", JSON.stringify(newUserData));
  };

  const addToCart = async (itemId, size) => {
    if (!size) {
      toast.error("Vui lòng chọn kích thước!");
      return;
    }

    let cartData = structuredClone(cartItems);
    if (cartData[itemId]) {
      if (cartData[itemId][size]) {
        cartData[itemId][size] += 1;
      } else {
        cartData[itemId][size] = 1;
      }
    } else {
      cartData[itemId] = {};
      cartData[itemId][size] = 1;
    }

    setCartItems(cartData);

    if (token) {
      try {
        await axios.post(
          backendUrl + "/api/cart/add",
          { itemId, size },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        // Refresh cart and products after adding
        await getUserCart();
        await getProductsData();
        // toast.success("Thêm vào giỏ hàng thành công!");
      } catch (error) {
        console.log(error);
        toast.error(error.response?.data?.message || "Lỗi khi thêm sản phẩm!");
      }
    }
  };

  const getCartCount = () => {
    let totalCount = 0;
    for (const items in cartItems) {
      for (const item in cartItems[items]) {
        try {
          if (cartItems[items][item] > 0) {
            totalCount += cartItems[items][item];
          }
        } catch (error) {}
      }
    }
    return totalCount;
  };

  const updateQuantity = async (itemId, size, quantity) => {
    let cartData = structuredClone(cartItems);
    cartData[itemId][size] = quantity;
    setCartItems(cartData);
    if (token) {
      try {
        await axios.post(
          backendUrl + "/api/cart/update",
          { itemId, size, quantity },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      }
    }
  };

  // clear cart 
 const clearCart = async () => {
  try {
    if (token) {
      await axios.delete(`${backendUrl}/api/cart/clear`, {
        headers: { Authorization: `Bearer ${token}` }
      });
    }
    setCartItems({});
    // toast.success("Đã xóa giỏ hàng thành công!");
  } catch (error) {
    console.error("Lỗi khi xóa giỏ hàng:", error);
    toast.error(error.response?.data?.message || "Không thể xóa giỏ hàng");
  }
};

  const getCartAmount = () => {
    let totalAmount = 0;
    for (const items in cartItems) {
      let itemInfo = products.find((product) => product._id === items);
      for (const item in cartItems[items]) {
        try {
          if (cartItems[items][item] > 0 && itemInfo) {
            totalAmount += itemInfo.price * cartItems[items][item];
          }
        } catch (error) {}
      }
    }
    return totalAmount;
  };

  const getProductsData = async () => {
    try {
      console.log("Gọi API lấy sản phẩm... Token:", token);
      const response = await axios.get(`${backendUrl}/api/product/list`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        console.log("Fetched Products:", response.data.products);
        setProducts(response.data.products);
      } else {
        toast.error(response.data.message || "Không thể lấy sản phẩm");
      }
    } catch (error) {
      console.error("Lỗi API:", error);
      toast.error(error.message || "Lỗi khi lấy sản phẩm");
    }
  };

  const getUserCart = async () => {
  try {
    const response = await axios.get(`${backendUrl}/api/cart/get`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (response.data.success) {
      const transformedCart = {};
      response.data.cartData.forEach(item => {
        if (!transformedCart[item.productId._id]) {
          transformedCart[item.productId._id] = {};
        }
        transformedCart[item.productId._id][item.size] = item.quantity;
      });
      setCartItems(transformedCart);
    }
  } catch (error) {
    console.error("Lỗi giỏ hàng:", error);
  }
};

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken && !token) {
      setToken(savedToken);
    }
  }, []);

  useEffect(() => {
    if (token && token !== "") {
      console.log("Gọi API với token:", token);
      getUserCart();
      getProductsData();
    }
  }, [token]);

  const value = {
    products,
    currency,
    delivery_fee,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItems,
    addToCart,
    getCartCount,
    updateQuantity,
    getCartAmount,
    navigate,
    backendUrl,
    token,
    setToken,
    user,
    setUser,
    handleLogin,
    updateUser,
    clearCart
  };

  return <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>;
};

export default ShopContextProvider;