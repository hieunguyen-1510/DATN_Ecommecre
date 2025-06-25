import React, { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import ProductCard from "../components/ProductCard";
import { assets } from "../assets/assets";

const categoryMap = {
  men: "Nam",
  women: "Nữ",
  kids: "Trẻ em",
};

const subCategoryMap = {
  // Men
  men: {
    shirts: {
      display: "Short Sleeve Tees",
      value: "Street Tops",
      banner: assets.menBanner,
    },
    sweaters: {
      display: "Stylish Sweaters",
      value: "Sweater",
      banner: assets.menBanner,
    },
    jackets: {
      display: "Urban Outerwear",
      value: "Outerwear",
      banner: assets.menBanner,
    },
    kaki: {
      display: "Smart Pants",
      value: "Street Bottoms",
      banner: assets.menBanner,
    },
  },
  // Women
  women: {
    longsleeve: {
      display: "Long Sleeve Tees",
      value: "Street Tops",
      banner: assets.womenBanner,
    },
    hoodie: {
      display: "Cozy Hoodies",
      value: "Hoodies",
      banner: assets.womenBanner,
    },
    sweaters: {
      display: "Sweater Season",
      value: "Sweater",
      banner: assets.womenBanner,
    },
    jackets: {
      display: "Elegant Outerwear",
      value: "Outerwear",
      banner: assets.womenBanner,
    },
    kaki: {
      display: "Smart Pants",
      value: "Street Bottoms",
      banner: assets.womenBanner,
    },
  },
  // Kids
  kids: {
    sweaters: {
      display: "Cute Sweaters",
      value: "Sweater",
      banner: assets.kidsBanner,
    },
    shorts: {
      display: "Kids Shorts",
      value: "Shorts",
      banner: assets.kidsBanner,
    },
    tshirts: {
      display: "Everyday Tees",
      value: "Street Tops",
      banner: assets.kidsBanner,
    },
  },
};

const getSubCategoryDisplay = (category, slug) =>
  subCategoryMap[category]?.[slug]?.display || "";
const getSubCategoryValue = (category, slug) =>
  subCategoryMap[category]?.[slug]?.value || "";
const getSubCategoryBanner = (category, slug) =>
  subCategoryMap[category]?.[slug]?.banner || "";
const getCategoryDisplay = (slug) => categoryMap[slug] || slug;

const SubCollectionPage = () => {
  const { products } = useContext(ShopContext);
  const { category, subcategory } = useParams();
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    const subCategoryValue = getSubCategoryValue(category, subcategory);
    const filteredProducts = products.filter(
      (p) =>
        p.category.toLowerCase() === category.toLowerCase() &&
        p.subCategory?.toLowerCase() === subCategoryValue.toLowerCase()
    );
    setFiltered(filteredProducts);
  }, [products, category, subcategory]);

  const displayName = getSubCategoryDisplay(category, subcategory);
  const bannerImg = getSubCategoryBanner(category, subcategory);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Breadcrumb */}
      <nav className="text-xs sm:text-sm text-gray-500 mb-4">
        <Link to="/" className="hover:underline">
          Trang chủ
        </Link>
        <span className="mx-1">/</span>
        <Link to="/collection" className="hover:underline">
          Bộ sưu tập
        </Link>
        <span className="mx-1">/</span>
        <Link to={`/collection/${category}`} className="hover:underline">
          {getCategoryDisplay(category)}
        </Link>
        <span className="mx-1">/</span>
        <span className="font-medium text-gray-900">{displayName}</span>
      </nav>

      {/* Banner */}
      {bannerImg && (
        <div className="mb-6">
          <img
            src={bannerImg}
            alt={displayName}
            className="w-full h-64 sm:h-96 object-cover rounded-lg"
          />
        </div>
      )}

      {/* Product Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600">
          Không có sản phẩm nào phù hợp.
        </p>
      )}
    </div>
  );
};

export default SubCollectionPage;
