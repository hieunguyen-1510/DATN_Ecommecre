import { useState, useCallback, useEffect } from "react"; 
import axios from "axios";
import qs from "qs";
import { debounce } from "lodash";
import { message } from "antd";
import { backendUrl } from "../App";

export default function useInventory() {
  const token = localStorage.getItem("token");
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState({
    totalProducts: 0,
    criticalStock: 0,
    lowStock: 0,
    overstock: 0,
  });
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState([]);

  // Fetch products
  const fetchProducts = useCallback(
    debounce(async (currentPagination, currentSearch, currentStatusFilter) => {
      setLoading(true);
      try {
        const response = await axios.get(`${backendUrl}/api/inventory/alerts`, {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            page: currentPagination.current,
            limit: currentPagination.pageSize,
            search: currentSearch, 
            status: currentStatusFilter, 
          },
          paramsSerializer: (params) => qs.stringify(params, { arrayFormat: "repeat" }),
        });
        if (response.data.success) {
          setProducts(response.data.data);
          setPagination((prev) => ({
            ...prev,
            total: response.data.pagination?.total || response.data.total,
          }));
        }
      } catch (error) {
        message.error(error.response?.data?.message || "Lỗi tải dữ liệu sản phẩm");
      } finally {
        setLoading(false);
      }
    }, 500),
    [token]
  );

 
  useEffect(() => {
    // Gọi fetchProducts
    fetchProducts(pagination, search, statusFilter);
  }, [pagination, search, statusFilter, fetchProducts]); 

  // Fetch stats (không thay đổi)
  const fetchStats = useCallback(async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/inventory/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        setStats({
          totalProducts: response.data.data.totalProducts,
          criticalStock: response.data.data.criticalStock,
          lowStock: response.data.data.lowStock,
          overstock: response.data.data.overstock || 0,
        });
      }
    } catch (error) {
      message.error(error.response?.data?.message || "Lỗi tải thống kê");
    }
  }, [token]);

  // Update stock 
  const handleUpdateStock = async (id, value) => {
    setUpdatingId(id);
    try {
      const response = await axios.put(
        `${backendUrl}/api/inventory/${id}/stock`,
        {
          stock: value,
          transactionType: "adjustment",
          source: "manual_adjustment",
          note: "Cập nhật tồn kho thủ công từ giao diện",
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        message.success("Cập nhật tồn kho thành công");
        setProducts((prev) =>
          prev.map((p) =>
            p._id === id
              ? { ...p, stock: value, stockStatus: response.data.data.stockStatus }
              : p
          )
        );
        fetchStats();
      }
    } catch (error) {
      message.error(error.response?.data?.message || "Cập nhật thất bại");
    } finally {
      setUpdatingId(null);
    }
  };

  // Pagination change (không thay đổi, nhưng sẽ kích hoạt useEffect)
  const handlePagination = (pagination) => {
    setPagination((prev) => ({
      ...prev,
      current: pagination.current,
      pageSize: pagination.pageSize,
    }));
   
  };

  // Search 
  const handleSearch = (value) => {
    setSearch(value);
    setPagination((prev) => ({ ...prev, current: 1 }));
  };

  // Filter 
  const handleStatusFilter = (value) => {
    setStatusFilter(value);
    setPagination((prev) => ({ ...prev, current: 1 })); 
  };

  return {
    products,
    stats,
    loading,
    updatingId,
    pagination,
    search,
    statusFilter,
    fetchProducts, 
    fetchStats,
    handleUpdateStock,
    handlePagination,
    handleSearch,
    handleStatusFilter,
    setPagination,
  };
}