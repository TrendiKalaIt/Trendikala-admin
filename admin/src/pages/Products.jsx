import React, { useState, useMemo, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, ArrowLeft, ArrowRight, Check, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const initialProductsData = [
    { id: 1, name: 'Men Grey Hoodie', category: 'Hoodies', inventory: 10, price: '49.90', image: 'https://via.placeholder.com/40/cccccc/ffffff?text=H' },
    { id: 2, name: 'Women Striped T-Shirt', category: 'T-Shirt', inventory: 10, price: '34.90', image: 'https://via.placeholder.com/40/cccccc/ffffff?text=T' },
    { id: 3, name: 'Women White T-Shirt', category: 'T-Shirt', inventory: 10, price: '40.90', image: 'https://via.placeholder.com/40/cccccc/ffffff?text=T' },
    { id: 4, name: 'Men White T-Shirt', category: 'T-Shirt', inventory: 10, price: '49.90', image: 'https://via.placeholder.com/40/cccccc/ffffff?text=T' },
    { id: 5, name: 'Women Red T-Shirt', category: 'T-Shirt', inventory: 10, price: '34.90', image: 'https://via.placeholder.com/40/cccccc/ffffff?text=T' },
    { id: 6, name: 'Men Grey Hoodie', category: 'Hoodies', inventory: 10, price: '49.90', image: 'https://via.placeholder.com/40/cccccc/ffffff?text=H' },
    { id: 7, name: 'Women Striped T-Shirt', category: 'T-Shirt', inventory: 10, price: '34.90', image: 'https://via.placeholder.com/40/cccccc/ffffff?text=T' },
    { id: 8, name: 'Women White T-Shirt', category: 'T-Shirt', inventory: 10, price: '40.90', image: 'https://via.placeholder.com/40/cccccc/ffffff?text=T' },
    { id: 9, name: 'Men White T-Shirt', category: 'T-Shirt', inventory: 10, price: '49.90', image: 'https://via.placeholder.com/40/cccccc/ffffff?text=T' },
    { id: 10, name: 'Women Red T-Shirt', category: 'T-Shirt', inventory: 10, price: '34.90', image: 'https://via.placeholder.com/40/cccccc/ffffff?text=T' },
    { id: 11, name: 'Blue Denim Jeans', category: 'Bottoms', inventory: 15, price: '59.90', image: 'https://via.placeholder.com/40/cccccc/ffffff?text=J' },
    { id: 12, name: 'Black Leather Jacket', category: 'Outerwear', inventory: 5, price: '129.90', image: 'https://via.placeholder.com/40/cccccc/ffffff?text=J' },
    { id: 13, name: 'Sporty Sneakers', category: 'Footwear', inventory: 20, price: '75.00', image: 'https://via.placeholder.com/40/cccccc/ffffff?text=S' },
    { id: 14, name: 'Casual Cap', category: 'Accessories', inventory: 30, price: '15.00', image: 'https://via.placeholder.com/40/cccccc/ffffff?text=C' },
    { id: 15, name: 'Summer Dress', category: 'Dresses', inventory: 12, price: '45.00', image: 'https://via.placeholder.com/40/cccccc/ffffff?text=D' },
    { id: 16, name: 'Formal Shirt', category: 'Shirts', inventory: 8, price: '65.00', image: 'https://via.placeholder.com/40/cccccc/ffffff?text=F' },
    { id: 17, name: 'Yoga Pants', category: 'Activewear', inventory: 25, price: '30.00', image: 'https://via.placeholder.com/40/cccccc/ffffff?text=Y' },
    { id: 18, name: 'Winter Scarf', category: 'Accessories', inventory: 18, price: '20.00', image: 'https://via.placeholder.com/40/cccccc/ffffff?text=S' },
    { id: 19, name: 'Classic Watch', category: 'Accessories', inventory: 7, price: '99.00', image: 'https://via.placeholder.com/40/cccccc/ffffff?text=W' },
    { id: 20, name: 'Kids T-Shirt', category: 'Kids', inventory: 40, price: '19.90', image: 'https://via.placeholder.com/40/cccccc/ffffff?text=K' },
    { id: 21, name: 'Another Grey Hoodie', category: 'Hoodies', inventory: 10, price: '49.90', image: 'https://via.placeholder.com/40/cccccc/ffffff?text=H' },
    { id: 22, name: 'Another Striped T-Shirt', category: 'T-Shirt', inventory: 10, price: '34.90', image: 'https://via.placeholder.com/40/cccccc/ffffff?text=T' },
    { id: 23, name: 'Another White T-Shirt', category: 'T-Shirt', inventory: 10, price: '40.90', image: 'https://via.placeholder.com/40/cccccc/ffffff?text=T' },
    { id: 24, name: 'Another Men White T-Shirt', category: 'T-Shirt', inventory: 10, price: '49.90', image: 'https://via.placeholder.com/40/cccccc/ffffff?text=T' },
    { id: 25, name: 'Another Women Red T-Shirt', category: 'T-Shirt', inventory: 10, price: '34.90', image: 'https://via.placeholder.com/40/cccccc/ffffff?text=T' },
    { id: 26, name: 'Different Grey Hoodie', category: 'Hoodies', inventory: 10, price: '49.90', image: 'https://via.placeholder.com/40/cccccc/ffffff?text=H' },
    { id: 27, name: 'Different Striped T-Shirt', category: 'T-Shirt', inventory: 10, price: '34.90', image: 'https://via.placeholder.com/40/cccccc/ffffff?text=T' },
    { id: 28, name: 'Different White T-Shirt', category: 'T-Shirt', inventory: 10, price: '40.90', image: 'https://via.placeholder.com/40/cccccc/ffffff?text=T' },
    { id: 29, name: 'Different Men White T-Shirt', category: 'T-Shirt', inventory: 10, price: '49.90', image: 'https://via.placeholder.com/40/cccccc/ffffff?text=T' },
    { id: 30, name: 'Different Women Red T-Shirt', category: 'T-Shirt', inventory: 10, price: '34.90', image: 'https://via.placeholder.com/40/cccccc/ffffff?text=T' },
    { id: 31, name: 'More Blue Denim Jeans', category: 'Bottoms', inventory: 15, price: '59.90', image: 'https://via.placeholder.com/40/cccccc/ffffff?text=J' },
    { id: 32, name: 'More Black Leather Jacket', category: 'Outerwear', inventory: 5, price: '129.90', image: 'https://via.placeholder.com/40/cccccc/ffffff?text=J' },
    { id: 33, name: 'More Sporty Sneakers', category: 'Footwear', inventory: 20, price: '75.00', image: 'https://via.placeholder.com/40/cccccc/ffffff?text=S' },
    { id: 34, name: 'More Casual Cap', category: 'Accessories', inventory: 30, price: '15.00', image: 'https://via.placeholder.com/40/cccccc/ffffff?text=C' },
    { id: 35, name: 'More Summer Dress', category: 'Dresses', inventory: 12, price: '45.00', image: 'https://via.placeholder.com/40/cccccc/ffffff?text=D' },
    { id: 36, name: 'More Formal Shirt', category: 'Shirts', inventory: 8, price: '65.00', image: 'https://via.placeholder.com/40/cccccc/ffffff?text=F' },
    { id: 37, name: 'More Yoga Pants', category: 'Activewear', inventory: 25, price: '30.00', image: 'https://via.placeholder.com/40/cccccc/ffffff?text=Y' },
    { id: 38, name: 'More Winter Scarf', category: 'Accessories', inventory: 18, price: '20.00', image: 'https://via.placeholder.com/40/cccccc/ffffff?text=S' },
    { id: 39, name: 'More Classic Watch', category: 'Accessories', inventory: 7, price: '99.00', image: 'https://via.placeholder.com/40/cccccc/ffffff?text=W' },
    { id: 40, name: 'More Kids T-Shirt', category: 'Kids', inventory: 40, price: '19.90', image: 'https://via.placeholder.com/40/cccccc/ffffff?text=K' },
    { id: 41, name: 'Another Hoodie again', category: 'Hoodies', inventory: 10, price: '49.90', image: 'https://via.placeholder.com/40/cccccc/ffffff?text=H' },
    { id: 42, name: 'Another T-Shirt again', category: 'T-Shirt', inventory: 10, price: '34.90', image: 'https://via.placeholder.com/40/cccccc/ffffff?text=T' },
    { id: 43, name: 'Final White T-Shirt', category: 'T-Shirt', inventory: 10, price: '40.90', image: 'https://via.placeholder.com/40/cccccc/ffffff?text=T' },
    { id: 44, name: 'Final Men White T-Shirt', category: 'T-Shirt', inventory: 10, price: '49.90', image: 'https://via.placeholder.com/40/cccccc/ffffff?text=T' },
    { id: 45, name: 'Final Women Red T-Shirt', category: 'T-Shirt', inventory: 10, price: '34.90', image: 'https://via.placeholder.com/40/cccccc/ffffff?text=T' },
    { id: 46, name: 'Last Hoodie', category: 'Hoodies', inventory: 10, price: '49.90', image: 'https://via.placeholder.com/40/cccccc/ffffff?text=H' },
    { id: 47, name: 'Last Striped T-Shirt', category: 'T-Shirt', inventory: 10, price: '34.90', image: 'https://via.placeholder.com/40/cccccc/ffffff?text=T' },
    { id: 48, name: 'Last White T-Shirt', category: 'T-Shirt', inventory: 10, price: '40.90', image: 'https://via.placeholder.com/40/cccccc/ffffff?text=T' },
    { id: 49, name: 'Last Men White T-Shirt', category: 'T-Shirt', inventory: 10, price: '49.90', image: 'https://via.placeholder.com/40/cccccc/ffffff?text=T' },
    { id: 50, name: 'Last Women Red T-Shirt', category: 'T-Shirt', inventory: 10, price: '34.90', image: 'https://via.placeholder.com/40/cccccc/ffffff?text=T' },
];

const ProductsPageContent = () => {
    const [products, setProducts] = useState(initialProductsData);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [editingProductId, setEditingProductId] = useState(null);
    const [editedInventory, setEditedInventory] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const navigate = useNavigate(); // Initialize useNavigate

    const filteredProducts = useMemo(() => {
        return products.filter(product =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase())
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
            setEditingProductId(null);
        }
    };

    const handlePreviousPage = () => {
        setCurrentPage(prev => Math.max(1, prev - 1));
        setEditingProductId(null);
    };

    const handleNextPage = () => {
        setCurrentPage(prev => Math.min(totalPages, prev + 1));
        setEditingProductId(null);
    };

    
    const handleEditInventoryClick = (product) => {
        setEditingProductId(product.id);
        setEditedInventory(String(product.inventory));
    };

    const handleInventoryChange = (e) => {
        const value = e.target.value;
        if (/^\d*$/.test(value)) {
            setEditedInventory(value);
        }
    };

    const handleSaveInventory = (productId) => {
        const newInventoryValue = parseInt(editedInventory, 10);
        if (isNaN(newInventoryValue) || newInventoryValue < 0) {
            alert('Please enter a valid non-negative number for inventory.');
            return;
        }

        setProducts(prevProducts =>
            prevProducts.map(product =>
                product.id === productId ? { ...product, inventory: newInventoryValue } : product
            )
        );
        setEditingProductId(null);
        setEditedInventory('');
    };

    const handleCancelEdit = () => {
        setEditingProductId(null);
        setEditedInventory('');
    };
    

    // --- Delete Functionality ---
    const handleDeleteProduct = (productId, productName) => {
        if (window.confirm(`Are you sure you want to delete "${productName}"? This action cannot be undone.`)) {
            setProducts(prevProducts => {
                const updatedProducts = prevProducts.filter(product => product.id !== productId);
                return updatedProducts;
            });

            const newTotalPages = Math.ceil(filteredProducts.filter(p => p.id !== productId).length / itemsPerPage);

            if (currentPage > newTotalPages && newTotalPages > 0) {
                setCurrentPage(newTotalPages);
            } else if (filteredProducts.length - 1 === 0 && searchTerm === '') {
                setCurrentPage(1);
            } else if (filteredProducts.length - 1 === 0 && searchTerm !== '') {
                setCurrentPage(1);
            } else if (newTotalPages === 0 && filteredProducts.length > 0) {
                setCurrentPage(1);
            }
            setEditingProductId(null);
        }
    };
    


    const handleAddProductClick = () => {
        navigate('/add-product'); 
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
                pageNumbers.push('...');
                pageNumbers.push(totalPages);
            } else if (currentPage >= rightEllipsisThreshold) {
                pageNumbers.push(1);
                pageNumbers.push('...');
                for (let i = totalPages - (maxPageButtons - 3); i <= totalPages; i++) {
                    pageNumbers.push(i);
                }
            } else {
                pageNumbers.push(1);
                if (currentPage > 2 + 1) {
                    pageNumbers.push('...');
                }
                const startPage = currentPage - Math.floor((maxPageButtons - 5) / 2);
                const endPage = currentPage + Math.floor((maxPageButtons - 5) / 2);

                for (let i = Math.max(2, startPage); i <= Math.min(totalPages - 1, endPage); i++) {
                    pageNumbers.push(i);
                }
                if (currentPage < totalPages - 2) {
                    pageNumbers.push('...');
                }
                pageNumbers.push(totalPages);
            }
        }
        return Array.from(new Set(pageNumbers));
    };

    return (
        // <>products</>
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
                        <button className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors duration-200">
                            Export
                        </button>
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
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Product
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Inventory
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Price
                                </th>
                                <th scope="col" className="relative px-6 py-3">
                                    <span className="sr-only">Delete Action</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {currentProducts.length > 0 ? (
                                currentProducts.map(product => (
                                    <tr key={product.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10">
                                                    <img className="h-10 w-10 rounded-md object-cover border border-gray-200" src={product.image} alt={product.name} />
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                                    <div className="text-xs text-gray-500">{product.category}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                            {editingProductId === product.id ? (
                                                <div className="flex items-center gap-1">
                                                    <input
                                                        type="text"
                                                        value={editedInventory}
                                                        onChange={handleInventoryChange}
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter') handleSaveInventory(product.id);
                                                            if (e.key === 'Escape') handleCancelEdit();
                                                        }}
                                                        className="w-16 px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
                                                    />
                                                    <button
                                                        onClick={() => handleSaveInventory(product.id)}
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
                                                    {product.inventory}
                                                    <button
                                                        onClick={() => handleEditInventoryClick(product)}
                                                        className="text-gray-500 hover:text-green-600 transition-colors duration-200"
                                                        title="Edit Inventory"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                            ${product.price}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex justify-end gap-3">
                                                <button
                                                    onClick={() => handleDeleteProduct(product.id, product.name)}
                                                    className="text-gray-500 hover:text-red-600 transition-colors duration-200"
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
                                    <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
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
                            className={`p-2 rounded-md transition-colors duration-200 ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-200'}`}
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </button>

                        {getPageNumbers().map((pageNumber, index) => (
                            pageNumber === '...' ? (
                                <span key={`ellipsis-${index}`} className="px-2 py-2 text-sm text-gray-500">...</span>
                            ) : (
                                <button
                                    key={pageNumber}
                                    onClick={() => handlePageChange(pageNumber)}
                                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200
                                        ${currentPage === pageNumber
                                            ? 'text-white bg-green-500 hover:bg-green-600'
                                            : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-100'
                                        }`}
                                >
                                    {pageNumber}
                                </button>
                            )
                        ))}

                        <button
                            onClick={handleNextPage}
                            disabled={currentPage === totalPages}
                            className={`p-2 rounded-md transition-colors duration-200 ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-200'}`}
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