import React, { useContext, useEffect, useState } from "react";
import Title from "../components/Title";
import CartTotal from "../components/CartTotal";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";
import QRCode from "react-qr-code";

const PlaceOrder = () => {
  const [method, setMethod] = useState("COD");
  const [payurl, setPayUrl] = useState("");
  const [orderId, setOrderId] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    navigate,
    backendUrl,
    token,
    cartItems,
    getCartAmount,
    delivery_fee,
    products,
    clearCart,
  } = useContext(ShopContext);

  useEffect(() => {
    console.log("Method:", method);
    console.log("PayUrl:", payurl);
  }, [method, payurl]);

  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    phonenumber: "",
    address: "",
    ward: "",
    district: "",
    city: "",
  });

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // checkPaymentStatus
  const checkPaymentStatus = async () => {
    try {
      const response = await axios.get(
        `${backendUrl}/api/payment/momo/status/${orderId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setPaymentStatus(response.data.status);
      if (response.data.status === "completed") {
        toast.success("Thanh toán thành công!");
        navigate("/orders");
      } else if (response.data.status === "failed") {
        toast.error("Thanh toán thất bại!");
      }
    } catch (error) {
      console.error("Lỗi kiểm tra trạng thái:", error);
      toast.error("Không thể kiểm tra trạng thái thanh toán");
    }
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const orderItems = [];
      for (const productId in cartItems) {
        const product = products.find((p) => p._id === productId);
        if (product) {
          const sizes = cartItems[productId];
          for (const size in sizes) {
            const quantity = sizes[size];
            if (quantity > 0) {
              orderItems.push({
                productId,
                quantity,
                size,
                price: product.price,
              });
            }
          }
        }
      }

      if (orderItems.length === 0) {
        toast.error(
          "Giỏ hàng trống. Vui lòng thêm sản phẩm trước khi đặt hàng."
        );
        setLoading(false);
        return;
      }

      if (
        !formData.fullname ||
        !formData.email ||
        !formData.phonenumber ||
        !formData.address ||
        !formData.ward ||
        !formData.district ||
        !formData.city
      ) {
        toast.error("Vui lòng điền đầy đủ thông tin giao hàng.");
        setLoading(false);
        return;
      }

      const subtotal = getCartAmount();
      const totalAmount = subtotal + delivery_fee;

      const orderData = {
        address: `${formData.address}, ${formData.ward}, ${formData.district}, ${formData.city}`,
        paymentMethod: method,
        items: orderItems,
        totalAmount,
        deliveryFee: delivery_fee,
      };

      const response = await axios.post(
        `${backendUrl}/api/orders/place`,
        orderData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data && response.data.success) {
        toast.success("Đặt hàng thành công!");
        await clearCart();

        setFormData({
          fullname: "",
          email: "",
          phonenumber: "",
          address: "",
          ward: "",
          district: "",
          city: "",
        });

        if (method === "COD") {
          navigate("/orders");
        } else if (method === "MOMO") {
          // console.log("Response từ backend:", response.data);

          // if (
          //   response.data.success &&
          //   response.data.payUrl &&
          //   response.data.momoOrderId
          // ) {
            setPayUrl(response.data.payUrl);
            setOrderId(response.data.momoOrderId);
            console.log("response.data.payUrl", response.data.payUrl);
            
            window.open(response.data.payUrl, "_blank");  
          // } else {
          //   toast.error("Không nhận được thông tin thanh toán từ MoMo");
          // }
        } else if (method === "VNPAY") {
          window.location.href = response.data.redirectUrl || "#";
        }
      } else {
        toast.error(response.data?.message || "Đặt hàng thất bại");
      }
    } catch (error) {
      console.error("Lỗi đặt hàng:", error);
      console.log("Error Response:", error.response?.data);
      toast.error(
        `Đặt hàng thất bại: ${error.response?.data?.message || error.message}`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      className="flex flex-col sm:flex-row justify-between gap-8 pt-5 sm:pt-14 min-h-[100vh] border-t bg-gray-50 px-6 pb-10"
      onSubmit={onSubmitHandler}
    >
      <div className="flex flex-col gap-6 w-full sm:max-w-[480px] bg-white shadow-lg p-8 rounded-xl">
        <div className="text-xl sm:text-2xl mb-4">
          <Title text1="THÔNG TIN" text2="GIAO HÀNG" />
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Họ và tên
            </label>
            <input
              required
              onChange={onChangeHandler}
              name="fullname"
              value={formData.fullname}
              className="border border-gray-300 rounded-lg py-2.5 px-4 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              type="text"
              placeholder="Full name..."
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input
              required
              onChange={onChangeHandler}
              name="email"
              value={formData.email}
              className="border border-gray-300 rounded-lg py-2.5 px-4 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              type="email"
              placeholder="Email..."
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Số điện thoại
            </label>
            <input
              required
              onChange={onChangeHandler}
              name="phonenumber"
              value={formData.phonenumber}
              className="border border-gray-300 rounded-lg py-2.5 px-4 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              type="number"
              placeholder="Phone Number..."
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Địa chỉ</label>
            <input
              onChange={onChangeHandler}
              name="address"
              value={formData.address}
              className="border border-gray-300 rounded-lg py-2.5 px-4 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              type="text"
              placeholder="Address..."
            />
          </div>
          <div className="flex gap-3">
            <div className="flex flex-col gap-1 w-full">
              <label className="text-sm font-medium text-gray-700">
                Phường/Xã
              </label>
              <input
                required
                onChange={onChangeHandler}
                name="ward"
                value={formData.ward}
                className="border border-gray-300 rounded-lg py-2.5 px-4 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                type="text"
                placeholder="Ward..."
              />
            </div>
            <div className="flex flex-col gap-1 w-full">
              <label className="text-sm font-medium text-gray-700">
                Quận/Huyện
              </label>
              <input
                required
                onChange={onChangeHandler}
                name="district"
                value={formData.district}
                className="border border-gray-300 rounded-lg py-2.5 px-4 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                type="text"
                placeholder="District..."
              />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Tỉnh/Thành phố
            </label>
            <input
              required
              onChange={onChangeHandler}
              name="city"
              value={formData.city}
              className="border border-gray-300 rounded-lg py-2.5 px-4 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              type="text"
              placeholder="City..."
            />
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-8">
        <div className="bg-white shadow-lg p-6 rounded-xl">
          <CartTotal />
        </div>
        <div className="bg-white shadow-lg p-6 rounded-xl">
          <div className="mb-4">
            <Title text1="PHƯƠNG THỨC" text2="THANH TOÁN" />
          </div>
          <div className="flex flex-col gap-4">
            <div
              onClick={() => setMethod("COD")}
              className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:shadow-md transition-all ${
                method === "COD"
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200"
              }`}
            >
              <img className="h-6 w-6" src={assets.cod} alt="Biểu tượng COD" />
              <span className="text-gray-800 font-medium">
                Thanh toán khi nhận hàng (COD)
              </span>
            </div>
            <div
              onClick={() => setMethod("MOMO")}
              className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:shadow-md transition-all ${
                method === "MOMO"
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200"
              }`}
            >
              <img
                className="h-6 w-6"
                src={assets.momo}
                alt="Biểu tượng MoMo"
              />
              <span className="text-gray-800 font-medium">
                Thanh toán qua MoMo
              </span>
            </div>
            <div
              onClick={() => setMethod("VNPAY")}
              className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:shadow-md transition-all ${
                method === "VNPAY"
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200"
              }`}
            >
              <img
                className="h-6 w-6"
                src={assets.vnpay}
                alt="Biểu tượng Ngân hàng"
              />
              <span className="text-gray-800 font-medium">
                Thanh toán qua VNPay
              </span>
            </div>
          </div>
          <div className="text-center mt-8">
            {/* Hiển thị mã QR nếu chọn MOMO và đã có payUrl */}
            {method === "MOMO" && payurl && (
              <div className="bg-white shadow-lg p-6 rounded-xl">
                <div className="mb-4">
                  <Title text1="Quét mã QR" text2="MoMo để thanh toán" />
                </div>
                <div className="flex flex-col items-center gap-4">
                  <QRCode value={payurl} size={200} />
                  <button
                    onClick={checkPaymentStatus}
                    type="button"
                    className="bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700 transition"
                  >
                    Kiểm tra trạng thái thanh toán
                  </button>
                  {paymentStatus && (
                    <div className="text-sm text-gray-600">
                      Trạng thái thanh toán:{" "}
                      <span className="font-semibold">{paymentStatus}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition font-semibold text-lg mt-4 sm:mt-0"
              disabled={loading}
            >
              {loading ? "Đang xử lý..." : "Đặt hàng"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
