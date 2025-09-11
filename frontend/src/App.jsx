import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import Collection from "./pages/Collection";
import PlaceOrder from "./pages/PlaceOrder";
import About from "./pages/About";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Product from "./pages/Product";
import { ToastContainer, toast } from "react-toastify";
import ForgotPassword from "./pages/ForgotPassword";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import BackToTop from "./components/BackToTop";
import Profile from "./components/Profile";
import ResetPassword from "./pages/ResetPassword";
import Chatbot from "./components/Chatbot";
import PaymentSuccess from "./pages/PaymentSuccess";
import MenCollection from "./pages/MenCollection";
import SubCollectionPage from "./pages/SubCollectionPage";
import WomenCollection from "./pages/WomenCollection";
import KidsCollection from "./pages/KidsCollection";

const App = () => {
  return (
    <>
      <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
        <ToastContainer />
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/collection" element={<Collection />} />
          <Route path="/collection/men" element={<MenCollection />} />
          <Route
            path="/collection/:category/:subcategory"
            element={<SubCollectionPage />}
          />
          <Route path="/collection/women" element={<WomenCollection />} />
          <Route path="/collection/kids" element={<KidsCollection />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/product/:productId" element={<Product />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/place-order" element={<PlaceOrder />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Routes>
        <BackToTop />
        <Chatbot />
      </div>
      <Footer />
    </>
  );
};

export default App;
