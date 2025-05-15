import React, { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import Title from "../components/Title";
import ProductsItem from "../components/ProductsItem";

const Collection = () => {
  const { products, search, showSearch } = useContext(ShopContext);
  const [filterProducts, setFilterProducts] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [sortType, setSortType] = useState("relavent");

  // Toggle category filter
  const toggleCategory = (e) => {
    const value = e.target.value;
    if (category.includes(value)) {
      setCategory((prev) => prev.filter((item) => item !== value));
    } else {
      setCategory((prev) => [...prev, value]);
    }
  };

  // Toggle subcategory filter
  const toggleSubCategory = (e) => {
    const value = e.target.value;
    if (subCategory.includes(value)) {
      setSubCategory((prev) => prev.filter((item) => item !== value));
    } else {
      setSubCategory((prev) => [...prev, value]);
    }
  };

  // Apply filters to products
  const applyFilter = () => {
    let productsCopy = [...products];
    // console.log("Products before filter:", products.length);

    // Debug sample product data
    if (products.length > 0) {
      console.log("Sample product:", {
        category: products[0].category,
        subCategory: products[0].subCategory,
      });
    }

    // Filter by category
    if (category.length > 0) {
      // console.log("Category filter:", category);
      productsCopy = productsCopy.filter((item) => {
        const itemCategory = String(item.category || "").toLowerCase().trim();
        console.log(`Product category: ${itemCategory}`); 
        return category.some(
          (cat) => String(cat).toLowerCase().trim() === itemCategory
        );
      });
    }

    // Filter by subcategory
    if (subCategory.length > 0) {
      // console.log("Applying subCategory filter:", subCategory);
      productsCopy = productsCopy.filter((item) => {
        const itemSubCategory = String(item.subCategory || "")
          .toLowerCase()
          .trim();
        return subCategory.some(
          (sub) => String(sub).toLowerCase().trim() === itemSubCategory
        );
      });
    }
    // console.log("Products after subCategory filter:", productsCopy.length);

    // Filter by search query
    if (showSearch && search) {
      productsCopy = productsCopy.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }
    // console.log("Products after all filters:", productsCopy.length);

    // Update filtered products
    setFilterProducts(productsCopy);
  };

  // Sort products based on selected sort type
  const sortProducts = () => {
    let filteredProductsCopy = [...filterProducts];
    switch (sortType) {
      case "thấp-cao":
        setFilterProducts(
          filteredProductsCopy.sort((a, b) => a.price - b.price)
        );
        break;
      case "cao-thấp":
        setFilterProducts(
          filteredProductsCopy.sort((a, b) => b.price - a.price)
        );
        break;
      default:
        break;
    }
  };

  // Trigger applyFilter when filtering conditions change
  useEffect(() => {
    applyFilter();
  }, [category, subCategory, search, showSearch, products]);

  // Trigger sortProducts when sortType or filtered products change
  useEffect(() => {
    if (filterProducts.length > 0) {
      sortProducts();
    }
  }, [sortType]);

  // Set default display of all products when the page loads
  useEffect(() => {
    if (products.length > 0 && filterProducts.length === 0) {
      setFilterProducts([...products]);
    }
  }, [products]);

  // Animation variants for sections
  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Banner */}
      <motion.div
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="relative h-64 bg-cover bg-center"
        style={{ backgroundImage: `url(${assets.banner3})` }}
      >
        <div className="absolute inset-0 bg-gray-900 bg-opacity-60 flex flex-col items-center justify-center text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg bebas-neue">
            Khám phá bộ sưu tập phong cách đường phố
          </h1>
          <p className="text-md md:text-lg text-gray-200 mt-2">
            Định hình phong cách của bạn với thời trang đường phố Việt Nam chính
            hiệu
          </p>
        </div>
      </motion.div>

      {/* Main Content */}
      <motion.div
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="py-16"
      >
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row gap-8">
          {/* Filter Section */}
          <div className="min-w-64 bg-white p-6 rounded-xl shadow-md">
            <p
              className="my-2 text-xl flex items-center cursor-pointer gap-2 bebas-neue text-black"
              onClick={() => setShowFilter(!showFilter)}
            >
              BỘ LỌC
              <img
                src={assets.dropdown_icon}
                className={`h-3 sm:hidden ${showFilter ? "rotate-90" : ""}`}
                alt="dropdown"
              />
            </p>

            {/* Debug information */}
            {process.env.NODE_ENV === "development" && (
              <div className="mb-2 text-xs text-gray-500">
                <p>Lọc theo: {category.join(", ")}</p>
                <p>Loại: {subCategory.join(", ")}</p>
                <p>Sản phẩm: {filterProducts.length}</p>
              </div>
            )}

            {/* Category Filter */}
            <div
              className={`border border-gray-200 bg-gray-50 pl-5 py-4 my-5 rounded-lg ${
                showFilter ? "" : "hidden"
              } sm:block`}
            >
              <p className="mb-3 text-sm font-medium text-gray-700">DANH MỤC</p>
              <div className="flex flex-col gap-2 text-sm text-gray-600">
                {["Men", "Women", "Kids"].map((cat) => (
                  <p key={cat} className="flex gap-2 items-center">
                    <input
                      type="checkbox"
                      className="w-4 h-4 accent-red-500 rounded"
                      value={cat}
                      onChange={toggleCategory}
                      checked={category.includes(cat)}
                    />
                    {cat}
                  </p>
                ))}
              </div>
            </div>

            {/* Subcategory Filter */}
            <div
              className={`border border-gray-200 bg-gray-50 pl-5 py-4 my-5 rounded-lg ${
                showFilter ? "" : "hidden"
              } sm:block`}
            >
              <p className="mb-3 text-sm font-medium text-gray-700">LOẠI</p>
              <div className="flex flex-col gap-2 text-sm text-gray-600">
                {["Street Tops", "Street Bottoms", "Hoodies", "Outerwear"].map(
                  (sub) => (
                    <p key={sub} className="flex gap-2 items-center">
                      <input
                        type="checkbox"
                        className="w-4 h-4 accent-red-500 rounded"
                        value={sub}
                        onChange={toggleSubCategory}
                        checked={subCategory.includes(sub)}
                      />
                      {sub}
                    </p>
                  )
                )}
              </div>
            </div>

            {/* Reset filter button */}
            {(category.length > 0 || subCategory.length > 0) && (
              <button
                onClick={() => {
                  setCategory([]);
                  setSubCategory([]);
                }}
                className="w-full bg-gray-100 hover:bg-red-500 hover:text-white py-2 rounded-lg text-sm font-medium transition-colors duration-200"
              >
                Xóa bộ lọc
              </button>
            )}
          </div>

          {/* Product List */}
          <div className="flex-1">
            <div className="flex justify-between items-center text-base sm:text-2xl mb-8">
              <Title text1="TẤT CẢ" text2="BỘ SƯU TẬP" />
              <select
                className="border-2 border-gray-200 bg-white text-sm px-4 py-2 rounded-lg hover:bg-red-500 hover:text-white transition focus:outline-none"
                onChange={(e) => setSortType(e.target.value)}
                value={sortType}
              >
                <option value="relavent">Sắp xếp theo: Phù hợp</option>
                <option value="thấp-cao">Sắp xếp theo: Giá thấp đến cao</option>
                <option value="cao-thấp">Sắp xếp theo: Giá cao đến thấp</option>
              </select>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {filterProducts.length > 0 ? (
                filterProducts.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.3,
                      delay: Math.min(index * 0.05, 0.3),
                    }}
                    className="relative bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300"
                  >
                    <ProductsItem
                      id={item._id}
                      name={item.name}
                      image={item.image}
                      price={item.price}
                      className="p-4"
                    />
                    {item.isNew && (
                      <span className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 text-xs font-semibold rounded-full shadow">
                        Mới
                      </span>
                    )}
                  </motion.div>
                ))
              ) : (
                <p className="col-span-full text-center py-8 text-gray-500">
                  Không tìm thấy sản phẩm phù hợp
                </p>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Collection;