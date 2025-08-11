
import React, { useState, useMemo, useEffect } from "react";
import axios from "axios";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";


const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const ProductsPageContent = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/products`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProducts(response.data);
    } catch (err) {
      console.error("Failed to fetch products", err);
      setProducts([]);
    }
    setLoading(false);
  };

  const filteredProducts = useMemo(() => {
    return products.filter((product) =>
      product?.productName?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  };

  const handleDeleteProduct = async (productId, productName) => {
    if (
      window.confirm(
        `Are you sure you want to delete "${productName}"? This action cannot be undone.`
      )
    ) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${API_URL}/api/products/${productId}`, {
  headers: {
    Authorization: `Bearer ${token}`,
    "x-product-name": productName,
    "x-user-name": localStorage.getItem("userName"),
    "x-user-role": localStorage.getItem("userRole"),
  }
});


        const updatedProducts = products.filter(
          (product) => (product._id || product.id) !== productId
        );
        setProducts(updatedProducts);

        const newTotalPages = Math.ceil(updatedProducts.length / itemsPerPage);
        if (currentPage > newTotalPages && newTotalPages > 0) {
          setCurrentPage(newTotalPages);
        } else if (updatedProducts.length === 0) {
          setCurrentPage(1);
        }
      } catch (err) {
        toast.error("Failed to delete product.");
        console.error(err);
      }
    }
  };

  const handleAddProductClick = () => {
    navigate("/add-product");
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPageButtons = 6;
    if (totalPages <= maxPageButtons) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      const leftEllipsisThreshold = Math.floor(maxPageButtons / 2);
      const rightEllipsisThreshold = totalPages - Math.floor((maxPageButtons - 1) / 2);
      if (currentPage <= leftEllipsisThreshold) {
        for (let i = 1; i <= maxPageButtons - 2; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push("...");
        pageNumbers.push(totalPages);
      } else if (currentPage >= rightEllipsisThreshold) {
        pageNumbers.push(1);
        pageNumbers.push("...");
        for (let i = totalPages - (maxPageButtons - 3); i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        pageNumbers.push(1);
        if (currentPage > 3) {
          pageNumbers.push("...");
        }
        const startPage = currentPage - 1;
        const endPage = currentPage + 1;
        for (let i = startPage; i <= endPage; i++) {
          pageNumbers.push(i);
        }
        if (currentPage < totalPages - 2) {
          pageNumbers.push("...");
        }
        pageNumbers.push(totalPages);
      }
    }
    return Array.from(new Set(pageNumbers));
  };

  return (
    <div className="flex justify-center p-5 min-h-screen bg-[#f5f9ef]">
      <div className="bg-white rounded-lg shadow-md w-full max-w-5xl p-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <h1 className="text-3xl font-semibold text-[#49951C]">Products</h1>
          <div className="relative flex-grow max-w-xs w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm text-gray-700"
            />
          </div>
          <button
            onClick={handleAddProductClick}
            className="px-5 py-2.5 bg-green-500 text-white rounded-md text-sm font-medium flex items-center gap-2 hover:bg-green-600 transition-colors duration-200"
          >
            <Plus className="h-5 w-5 text-white" /> Add Product
          </button>
        </div>

        {/* Product Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Inventory</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-center text-gray-500">Loading...</td>
                </tr>
              ) : currentProducts.length > 0 ? (
                currentProducts.map((product) => (
                  <tr key={product._id || product.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          className="h-10 w-10 rounded-md object-cover border border-gray-200"
                          src={product.media?.find((m) => m.type === "image")?.url || "https://via.placeholder.com/40?text=No+Image"}
                          alt={product.productName}
                        />
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{product.productName}</div>
                          <div className="text-xs text-gray-500">{product.category}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {parseInt(product.stock)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      ${product.price}
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium">
                      <div className="flex justify-end gap-3">
                        <button
                          onClick={() => navigate(`/edit-product/${product._id || product.id}`)}
                          className="text-gray-500 hover:text-green-600"
                          title="Edit Product"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product._id || product.id, product.productName)}
                          className="text-gray-500 hover:text-red-600"
                          title="Delete Product"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-center text-gray-500">No products found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 0 && (
          <div className="flex justify-center items-center mt-8 space-x-2">
            <button onClick={handlePreviousPage} disabled={currentPage === 1} className={`p-2 rounded-md ${currentPage === 1 ? "text-gray-400 cursor-not-allowed" : "text-gray-500 hover:bg-gray-200"}`}>
              <ArrowLeft className="h-4 w-4" />
            </button>
            {getPageNumbers().map((pageNumber, index) =>
              pageNumber === "..." ? (
                <span key={`ellipsis-${index}`} className="px-2 py-2 text-sm text-gray-500">...</span>
              ) : (
                <button key={pageNumber} onClick={() => handlePageChange(pageNumber)}
                  className={`px-4 py-2 text-sm font-medium rounded-md ${currentPage === pageNumber ? "text-white bg-green-500 hover:bg-green-600" : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-100"}`}>
                  {pageNumber}
                </button>
              )
            )}
            <button onClick={handleNextPage} disabled={currentPage === totalPages} className={`p-2 rounded-md ${currentPage === totalPages ? "text-gray-400 cursor-not-allowed" : "text-gray-500 hover:bg-gray-200"}`}>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPageContent;
