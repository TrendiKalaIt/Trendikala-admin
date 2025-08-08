import { useParams } from "react-router-dom";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const EditProduct = ({ onSuccess }) => {
    const { id } = useParams();
    const [formData, setFormData] = useState({
        productName: '',
        category: '',
        brand: '',
        price: '',
        discountPrice: '',
        discountPercent: '',
        description: '',
        detailedDescription: { paragraph1: '', paragraph2: '' },
        colors: [],
        sizes: '',
        details: {
            fabric: '',
            fitType: '',
            length: '',
            sleeveNeckType: '',
            patternPrint: '',
            occasionType: '',
            washCare: '',
            countryOfOrigin: '',
            deliveryReturns: '',
        },
        materialWashing: '',
        sizeShape: '',
        stock: '',
    });

    // Media format: [{ id, url, file (optional), type:image|video }]
    const [mediaGroups, setMediaGroups] = useState([]);

    const [categories, setCategories] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(false);
    const [loadingProduct, setLoadingProduct] = useState(true);

    useEffect(() => {
        // Fetch categories
        const fetchCategories = async () => {
            setLoadingCategories(true);
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(`${API_URL}/api/categories`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setCategories(res.data);
            } catch (e) {
                console.error('Error loading categories', e);
            } finally {
                setLoadingCategories(false);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        if (!id) return;
        // Fetch product data by id
        const fetchProduct = async () => {
            setLoadingProduct(true);
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(`${API_URL}/api/products/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const product = res.data;

                // Normalize and set form data
                setFormData({
                    productName: product.productName || '',
                    category: product.category || '',
                    brand: product.brand || '',
                    price: product.price || '',
                    discountPrice: product.discountPrice || '',
                    discountPercent: product.discountPercent || '',
                    description: product.description || '',
                    detailedDescription: product.detailedDescription || { paragraph1: '', paragraph2: '' },
                    colors: product.colors && product.colors.length > 0 ? product.colors : [],
                    sizes: product.sizes ? product.sizes.join(', ') : '',
                    details: product.details || {
                        fabric: '',
                        fitType: '',
                        length: '',
                        sleeveNeckType: '',
                        patternPrint: '',
                        occasionType: '',
                        washCare: '',
                        countryOfOrigin: '',
                        deliveryReturns: '',
                    },
                    materialWashing: Array.isArray(product.materialWashing)
                        ? product.materialWashing.map((item) => `${item.label}: ${item.value}`).join('\n')
                        : product.materialWashing || '',
                    sizeShape: Array.isArray(product.sizeShape)
                        ? product.sizeShape.map((item) => `${item.label}: ${item.value}`).join('\n')
                        : product.sizeShape || '',
                    stock: product.stock || '',
                });

                // Setup media groups from product.media array as single group for edit
                if (product.media && Array.isArray(product.media) && product.media.length > 0) {
                    setMediaGroups([
                        {
                            id: uuidv4(),
                            files: [], // empty because existing files are URLs, not local File objects
                            previews: product.media.map((m) => ({
                                id: uuidv4(),
                                url: m.url,
                                type: m.type,
                            })),
                        }
                    ]);
                } else {
                    setMediaGroups([]);
                }
            } catch (e) {
                console.error('Failed to load product', e);
                toast.error('Failed to load product data.');
            } finally {
                setLoadingProduct(false);
            }
        };
        fetchProduct();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData((prev) => ({
                ...prev,
                [parent]: { ...prev[parent], [child]: value },
            }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleColorChange = (index, key, value) => {
        const updatedColors = [...formData.colors];
        updatedColors[index] = { ...updatedColors[index], [key]: value };
        setFormData((prev) => ({ ...prev, colors: updatedColors }));
    };

    const addColor = () => {
        setFormData((prev) => ({
            ...prev,
            colors: [...prev.colors, { name: '', hex: '#000000' }],
        }));
    };

    const removeColor = (index) => {
        const updatedColors = formData.colors.filter((_, i) => i !== index);
        setFormData((prev) => ({ ...prev, colors: updatedColors }));
    };

    const handleMediaFilesChange = (groupId, files) => {
        const updatedGroups = mediaGroups.map((group) => {
            if (group.id === groupId) {
                const newFiles = Array.from(files);
                const newPreviews = newFiles.map((file) => ({
                    id: uuidv4(),
                    url: URL.createObjectURL(file),
                    type: file.type.startsWith('image/') ? 'image' : 'video',
                }));
                return {
                    ...group,
                    files: newFiles,
                    previews: newPreviews,
                };
            }
            return group;
        });
        setMediaGroups(updatedGroups);
    };

    const addMediaGroup = () => {
        setMediaGroups((prev) => [...prev, { id: uuidv4(), files: [], previews: [] }]);
    };

    const removeMediaGroup = (groupId) => {
        setMediaGroups((prev) => prev.filter((group) => group.id !== groupId));
    };

    const formatArrayFromTextarea = (text) => {
        return text.split('\n').filter(Boolean).map((line) => {
            const [label, ...vals] = line.split(':');
            return { label: label?.trim(), value: vals.join(':').trim() };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.productName.trim() || !formData.category.trim()) {
            toast.error('Please fill in all required fields.');
            return;
        }

        try {
            const data = new FormData();

            for (const key in formData) {
                const value = formData[key];

                if (typeof value === 'object' && !Array.isArray(value)) {
                    data.append(key, JSON.stringify(value));
                } else if (key === 'sizes') {
                    data.append(key, JSON.stringify(value.split(',').map((s) => s.trim()).filter(Boolean)));
                } else if (key === 'colors') {
                    data.append(key, JSON.stringify(value));
                } else if (key === 'materialWashing' || key === 'sizeShape') {
                    data.append(key, JSON.stringify(formatArrayFromTextarea(value)));
                } else {
                    data.append(key, value);
                }
            }

            // Append all media files from all groups
            mediaGroups.forEach((group) => {
                group.files.forEach((file) => {
                    data.append('media', file);
                });
            });

            const token = localStorage.getItem('token');
            await axios.put(`${API_URL}/api/products/edit/${id}`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                },
            });

            toast.success('Product updated successfully!');
            if (typeof onSuccess === 'function') onSuccess();
        } catch (err) {
            toast.error('Failed to update product.');
            console.error(err);
        }
    };

    if (loadingProduct) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p className="text-green-600 text-xl font-semibold">Loading product data...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-green-50 py-8">
            <ToastContainer position="top-right" autoClose={3500} />
            <div className="bg-white rounded-xl shadow-xl p-6 md:p-10 max-w-4xl mt-2 mx-auto border-t-8 border-green-600">
                <h2 className="text-3xl font-bold text-green-800 mb-7 text-center">Edit Product</h2>
                <form onSubmit={handleSubmit} className="space-y-10">
                    {/* General Information */}
                    <section>
                        <h3 className="text-xl font-semibold text-green-700 border-l-4 border-green-400 pl-4 mb-5">
                            General Information
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label className="block font-medium text-gray-700 mb-2">
                                    Product Name <span className="text-red-500">*</span>
                                    <input
                                        type="text"
                                        name="productName"
                                        value={formData.productName}
                                        onChange={handleChange}
                                        required
                                        className="w-full mt-2 p-3 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                                    />
                                </label>
                            </div>
                            <div>
                                <label className="block font-medium text-gray-700 mb-2">
                                    Category <span className="text-red-500">*</span>
                                    {loadingCategories ? (
                                        <div className="text-gray-500 mt-2">Loading categories...</div>
                                    ) : (
                                        <select
                                            name="category"
                                            value={formData.category}
                                            onChange={handleChange}
                                            required
                                            className="w-full mt-2 p-3 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                                        >
                                            <option value="">Select a category</option>
                                            {categories.map((cat) => (
                                                <option key={cat._id} value={cat._id}>
                                                    {cat.name}
                                                </option>
                                            ))}
                                        </select>
                                    )}
                                </label>
                            </div>
                            <div>
                                <label className="block font-medium text-gray-700 mb-2">
                                    Brand
                                    <input
                                        type="text"
                                        name="brand"
                                        value={formData.brand}
                                        onChange={handleChange}
                                        className="w-full mt-2 p-3 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                                    />
                                </label>
                            </div>
                        </div>
                    </section>

                    {/* Pricing & Stock */}
                    <section>
                        <h3 className="text-xl font-semibold text-green-700 border-l-4 border-green-400 pl-4 mb-5">
                            Pricing & Stock
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                            {['price', 'discountPrice', 'stock'].map((field) => (
                                <label key={field} className="block font-medium text-gray-700 mb-2">
                                    {field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}
                                    <input
                                        type="number"
                                        name={field}
                                        value={formData[field]}
                                        onChange={handleChange}
                                        className="w-full mt-2 p-3 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                                        min="0"
                                        step="1"
                                        {...(field === 'discountPercent' ? { max: 100 } : {})}
                                    />
                                </label>
                            ))}
                        </div>
                    </section>

                    {/* Description */}
                    <section>
                        <h3 className="text-xl font-semibold text-green-700 border-l-4 border-green-400 pl-4 mb-5">
                            Description
                        </h3>
                        <label className="block font-medium text-gray-700 mb-2">
                            Short Description
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                className="w-full mt-2 p-3 border border-green-300 rounded-lg min-h-[100px] focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                            />
                        </label>
                       
                    </section>

                    {/* Product Variations */}
                    <section>
                        <h3 className="text-xl font-semibold text-green-700 border-l-4 border-green-400 pl-4 mb-5">
                            Product Variations
                        </h3>
                        <div className="mb-6">
                            <h4 className="text-lg font-medium text-gray-700">Colors</h4>
                            {formData.colors.map((color, i) => (
                                <div key={i} className="flex items-center gap-3 my-2 bg-green-50 rounded-lg p-3">
                                    <input
                                        type="text"
                                        placeholder="Color Name"
                                        value={color.name}
                                        onChange={(e) => handleColorChange(i, 'name', e.target.value)}
                                        className="input flex-1 rounded-md"
                                    />
                                    <input
                                        type="color"
                                        value={color.hex}
                                        onChange={(e) => handleColorChange(i, 'hex', e.target.value)}
                                        className="w-10 h-10 rounded-md cursor-pointer border-none"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeColor(i)}
                                        className="px-3 py-2 ml-2 rounded-md border border-red-300 text-red-700 hover:bg-red-50 transition text-sm"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={addColor}
                                className="mt-2 px-4 py-2 rounded-md bg-green-100 text-green-800 border border-green-200 hover:bg-green-200 transition text-sm"
                            >
                                + Add Color
                            </button>
                        </div>

                        <div>
                            <label className="block font-medium text-gray-700 mb-2">
                                Sizes (comma-separated)
                                <input
                                    type="text"
                                    name="sizes"
                                    value={formData.sizes}
                                    onChange={handleChange}
                                    placeholder="e.g., S, M, L, XL"
                                    className="w-full mt-2 p-3 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                                />
                            </label>
                        </div>
                    </section>

                    {/* Product Details */}
                    <section>
                        <h3 className="text-xl font-semibold text-green-700 border-l-4 border-green-400 pl-4 mb-5">
                            Product Details
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {Object.entries(formData.details).map(([key]) => (
                                <label key={key} className="block font-medium text-gray-700 mb-2">
                                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())}
                                    <input
                                        type="text"
                                        name={`details.${key}`}
                                        value={formData.details[key]}
                                        onChange={handleChange}
                                        className="w-full mt-2 p-3 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                                    />
                                </label>
                            ))}
                        </div>
                    </section>

                    {/* Additional Info */}
                    <section>
                        <h3 className="text-xl font-semibold text-green-700 border-l-4 border-green-400 pl-4 mb-5">
                            Additional Info <span className="text-base text-gray-400">(label:value per line)</span>
                        </h3>
                        <div className="mb-5">
                            <label className="block font-medium text-gray-700 mb-2">
                                Material & Washing
                                <textarea
                                    name="materialWashing"
                                    value={formData.materialWashing}
                                    onChange={handleChange}
                                    className="w-full mt-2 p-3 border border-green-300 rounded-lg min-h-[80px] focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                                    placeholder={'e.g.\nMaterial: Cotton\nWash Care: Machine Wash'}
                                />
                            </label>
                        </div>
                        <div>
                            <label className="block font-medium text-gray-700 mb-2">
                                Size & Shape
                                <textarea
                                    name="sizeShape"
                                    value={formData.sizeShape}
                                    onChange={handleChange}
                                    className="w-full mt-2 p-3 border border-green-300 rounded-lg min-h-[80px] focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                                    placeholder={'e.g.\nFit: Slim Fit\nLength: Full-Length'}
                                />
                            </label>
                        </div>
                    </section>

                    {/* Media Uploads */}
                    <section>
                        <h3 className="text-xl font-semibold text-green-700 border-l-4 border-green-400 pl-4 mb-5">
                            Product Images & Videos
                        </h3>

                        {mediaGroups.length === 0 && (
                            <div className="text-gray-500 text-sm mb-4">No media added yet. Click "Add Media Group".</div>
                        )}
                        <div className="space-y-6">
                            {mediaGroups.map((group, idx) => (
                                <div key={group.id} className="bg-green-50 border border-green-200 rounded-lg p-5 shadow-sm">
                                    <div className="flex justify-between items-center mb-3">
                                        <h4 className="font-medium text-green-800">Media Group #{idx + 1}</h4>
                                        <button
                                            type="button"
                                            onClick={() => removeMediaGroup(group.id)}
                                            className="px-3 py-1 rounded-md bg-red-50 text-red-800 border border-red-200 hover:bg-red-100 transition"
                                            aria-label={`Remove media group ${idx + 1}`}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*,video/*"
                                        onChange={(e) => handleMediaFilesChange(group.id, e.target.files)}
                                        className="block w-full bg-white p-2 rounded-md border border-green-300 mb-2"
                                    />
                                    <div className="flex flex-wrap gap-4 mt-3">
                                        {group.previews.map((preview) =>
                                            preview.type === 'image' ? (
                                                <img
                                                    key={preview.id}
                                                    src={preview.url}
                                                    alt="Media Preview"
                                                    className="w-28 h-28 object-cover rounded-md border"
                                                />
                                            ) : (
                                                <video
                                                    key={preview.id}
                                                    src={preview.url}
                                                    controls
                                                    className="w-28 h-28 rounded-md border"
                                                />
                                            )
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button
                            type="button"
                            onClick={addMediaGroup}
                            className="mt-4 block mx-auto px-4 py-2 rounded-md bg-green-100 text-green-800 border border-green-200 hover:bg-green-200 transition"
                            aria-label="Add media group"
                        >
                            + Add Media Group
                        </button>
                    </section>

                    <button
                        type="submit"
                        className="w-full py-3 mt-6 rounded-lg font-bold bg-green-600 text-white hover:bg-green-700 transition text-lg shadow"
                    >
                        Update Product
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditProduct;
