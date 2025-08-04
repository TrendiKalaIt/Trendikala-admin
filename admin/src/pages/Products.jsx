

import React, { useState, useMemo, useEffect } from "react";
import axios from "axios";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  ArrowLeft,
  ArrowRight,
  Check,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// Use your API base URL from environment
const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const ProductsPageContent = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [editingProductId, setEditingProductId] = useState(null);
  const [editedInventory, setEditedInventory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // Fetch products from backend API on mount
  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token'); // Or wherever your auth token is stored
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
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      setEditingProductId(null);
    }
  };

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
    setEditingProductId(null);
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
    setEditingProductId(null);
  };

  const handleEditInventoryClick = (product) => {
    setEditingProductId(product._id || product.id);
    setEditedInventory(String(product.stock));
  };

  const handleInventoryChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setEditedInventory(value);
    }
  };

  const handleSaveInventory = async (productId) => {
    const newInventoryValue = parseInt(editedInventory, 10);
    if (isNaN(newInventoryValue) || newInventoryValue < 0) {
      alert("Please enter a valid non-negative number for inventory.");
      return;
    }
    try {
      await axios.patch(`${API_URL}/api/products/inventory/${productId}`, {
        inventory: newInventoryValue,
      });
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          (product._id || product.id) === productId
            ? { ...product, inventory: newInventoryValue }
            : product
        )
      );
      setEditingProductId(null);
      setEditedInventory("");
    } catch (err) {
      alert("Failed to update inventory.");
      console.error(err);
    }
  };

  const handleCancelEdit = () => {
    setEditingProductId(null);
    setEditedInventory("");
  };

  // --- Delete Functionality ---
  const handleDeleteProduct = async (productId, productName) => {
    if (
      window.confirm(
        `Are you sure you want to delete "${productName}"? This action cannot be undone.`
      )
    ) {
      try {
        const token = localStorage.getItem('token'); // Adjust if you store token under a different key
        await axios.delete(`${API_URL}/api/products/${productId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
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

        setEditingProductId(null);
        toast.success(`"${productName}" deleted successfully.`);
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
        if (currentPage > 2 + 1) {
          pageNumbers.push("...");
        }
        const startPage = currentPage - Math.floor((maxPageButtons - 5) / 2);
        const endPage = currentPage + Math.floor((maxPageButtons - 5) / 2);
        for (
          let i = Math.max(2, startPage);
          i <= Math.min(totalPages - 1, endPage);
          i++
        ) {
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
          <div className="flex gap-3">


            <button
              onClick={handleAddProductClick}
              className="px-5 py-2.5 bg-green-500 text-white rounded-md text-sm font-medium flex items-center gap-2 hover:bg-green-600 transition-colors duration-200"
            >
              <Plus className="h-5 w-5 text-white" /> Add Product
            </button>
          </div>
        </div>

        {/* Product Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Product
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Inventory
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Price
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Delete Action</span>
                </th>
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
                        <div className="flex-shrink-0 h-10 w-10">
                          <img
                            className="h-10 w-10 rounded-md object-cover border border-gray-200"
                            src={
                              product.media?.find((m) => m.type === "image")?.url ||
                              "https://via.placeholder.com/40?text=No+Image"
                            }
                            alt={product.productName}
                          />

                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {product.productName}
                          </div>
                          <div className="text-xs text-gray-500">
                            {product.category}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {editingProductId === (product._id || product.id) ? (
                        <div className="flex items-center gap-1">
                          <input
                            type="text"
                            value={editedInventory}
                            onChange={handleInventoryChange}
                            onKeyDown={(e) => {
                              if (e.key === "Enter")
                                handleSaveInventory(product._id || product.id);
                              if (e.key === "Escape") handleCancelEdit();
                            }}
                            className="w-16 px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
                          />
                          <button
                            onClick={() => handleSaveInventory(product._id || product.id)}
                            className="p-1 text-green-600 hover:text-green-700 rounded-md transition-colors duration-200"
                            title="Save"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="p-1 text-red-600 hover:text-red-700 rounded-md transition-colors duration-200"
                            title="Cancel"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          {product.stock}
                          {/* <button
                            onClick={() => handleEditInventoryClick(product)}
                            className="text-gray-500 hover:text-green-600 transition-colors duration-200"
                            title="Edit Inventory"
                          >
                            <Edit className="h-4 w-4" />
                          </button> */}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      ${product.price}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-3">
                        <button
                          onClick={() => navigate(`/edit-product/${product._id || product.id}`)}
                          className="text-gray-500 hover:text-green-600 transition-colors duration-200"
                          title="Edit Product"
                          aria-label={`Edit product ${product.productName}`}
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() =>
                            handleDeleteProduct(product._id || product.id, product.productName)
                          }
                          className="text-gray-500 hover:text-red-600 transition-colors duration-200"
                          title="Delete Product"
                          aria-label={`Delete product ${product.productName}`}
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 0 && (
          <div className="flex justify-center items-center mt-8 space-x-2">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className={`p-2 rounded-md transition-colors duration-200 ${currentPage === 1
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-500 hover:bg-gray-200"
                }`}
            >
              <ArrowLeft className="h-4 w-4" />
            </button>

            {getPageNumbers().map((pageNumber, index) =>
              pageNumber === "..." ? (
                <span
                  key={`ellipsis-${index}`}
                  className="px-2 py-2 text-sm text-gray-500"
                >
                  ...
                </span>
              ) : (
                <button
                  key={pageNumber}
                  onClick={() => handlePageChange(pageNumber)}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200
                                    ${currentPage === pageNumber
                      ? "text-white bg-green-500 hover:bg-green-600"
                      : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-100"
                    }`}
                >
                  {pageNumber}
                </button>
              )
            )}

            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-md transition-colors duration-200 ${currentPage === totalPages
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-500 hover:bg-gray-200"
                }`}
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPageContent;
