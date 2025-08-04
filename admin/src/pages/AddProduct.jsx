


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const AddProduct = () => {
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

  // Array of media file groups: each group is { id, files: [File], previews: [{id,url,type}] }
  const [mediaGroups, setMediaGroups] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);


   useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/api/categories`, {
          headers: { Authorization: `Bearer ${token}` }, // Remove if no auth needed
        });
        setCategories(response.data);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData(prev => ({ ...prev, [name]: value }));
  // };

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
    setFormData({ ...formData, colors: updatedColors });
  };

  const addColor = () => {
    setFormData((prev) => ({
      ...prev,
      colors: [...prev.colors, { name: '', hex: '#000000' }],
    }));
  };

  const removeColor = (index) => {
    const updatedColors = formData.colors.filter((_, i) => i !== index);
    setFormData({ ...formData, colors: updatedColors });
  };

  // When user selects files in one media group input
  const handleMediaFilesChange = (groupId, files) => {
    const updatedGroups = mediaGroups.map((group) => {
      if (group.id === groupId) {
        const newFiles = Array.from(files);
        const newPreviews = newFiles.map(file => ({
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
    const lines = text.split('\n').filter(Boolean);
    return lines.map((line) => {
      const [label, ...values] = line.split(':');
      return { label: label?.trim(), value: values?.join(':').trim() };
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
      await axios.post(`${API_URL}/api/products/add`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success('Product added successfully!');
      // Reset form if needed
      setFormData({
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
      setMediaGroups([]);
    } catch (err) {
      toast.error('Failed to add product. Please check your inputs.');
      console.error(err);
    }
  };

//   return (
//     <div className="container mx-auto p-4 md:p-8">
//       <ToastContainer position="top-right" autoClose={3500} />
//       <div className="bg-white rounded-lg shadow-xl p-6 md:p-10 max-w-7xl mx-auto">
//         <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center border-b pb-4">Add New Product</h2>
//         <form onSubmit={handleSubmit} className="space-y-8">
//           {/* General Information */}
//           <section className="space-y-4">
//             <h3 className="text-2xl font-semibold text-gray-700">General Information</h3>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//               <input
//                 type="text"
//                 name="productName"
//                 placeholder="Product Name *"
//                 value={formData.productName}
//                 onChange={handleChange}
//                 required
//                 className="input"
//               />
//               <label htmlFor="category" className="block font-semibold mb-1">Category *</label>
//               {loadingCategories ? (
//                 <p>Loading categories...</p>
//               ) : (
//                 <select
//                   id="category"
//                   name="category"
//                   value={formData.category}
//                   onChange={handleChange}
//                   required
//                   className="input w-full"
//                 >
//                   <option value="">Select a category</option>
//                   {categories.map(cat => (
//                     <option key={cat._id} value={cat._id}>
//                       {cat.name}
//                     </option>
//                   ))}
//                 </select>
//               )}
//               <input
//                 type="text"
//                 name="brand"
//                 placeholder="Brand"
//                 value={formData.brand}
//                 onChange={handleChange}
//                 className="input"
//               />
//             </div>
//           </section>

//           {/* Pricing & Stock */}
//           <section className="space-y-4">
//             <h3 className="text-2xl font-semibold text-gray-700">Pricing & Stock</h3>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//               <input
//                 type="number"
//                 name="price"
//                 placeholder="Price"
//                 value={formData.price}
//                 onChange={handleChange}
//                 className="input"
//                 min="0"
//                 step="0.01"
//               />
//               <input
//                 type="number"
//                 name="discountPrice"
//                 placeholder="Discount Price"
//                 value={formData.discountPrice}
//                 onChange={handleChange}
//                 className="input"
//                 min="0"
//                 step="0.01"
//               />
//               <input
//                 type="number"
//                 name="discountPercent"
//                 placeholder="Discount %"
//                 value={formData.discountPercent}
//                 onChange={handleChange}
//                 className="input"
//                 min="0"
//                 max="100"
//                 step="0.01"
//               />
//               <input
//                 type="number"
//                 name="stock"
//                 placeholder="Stock"
//                 value={formData.stock}
//                 onChange={handleChange}
//                 className="input"
//                 min="0"
//               />
//             </div>
//           </section>

//           {/* Description */}
//           <section className="space-y-4">
//             <h3 className="text-2xl font-semibold text-gray-700">Description</h3>
//             <textarea
//               name="description"
//               placeholder="Short Description"
//               value={formData.description}
//               onChange={handleChange}
//               className="input min-h-[100px]"
//             />
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <textarea
//                 name="detailedDescription.paragraph1"
//                 placeholder="Detailed Description (Paragraph 1)"
//                 value={formData.detailedDescription.paragraph1}
//                 onChange={handleChange}
//                 className="input min-h-[120px]"
//               />
//               <textarea
//                 name="detailedDescription.paragraph2"
//                 placeholder="Detailed Description (Paragraph 2)"
//                 value={formData.detailedDescription.paragraph2}
//                 onChange={handleChange}
//                 className="input min-h-[120px]"
//               />
//             </div>
//           </section>

//           {/* Product Variations */}
//           <section className="space-y-4">
//             <h3 className="text-2xl font-semibold text-gray-700">Product Variations</h3>
//             <div>
//               <h4 className="text-xl font-medium text-gray-600 mb-2">Colors</h4>
//               {formData.colors.map((color, index) => (
//                 <div key={index} className="flex items-center gap-2 mb-2">
//                   <input
//                     type="text"
//                     placeholder="Color Name"
//                     value={color.name}
//                     onChange={(e) => handleColorChange(index, 'name', e.target.value)}
//                     className="input flex-grow"
//                   />
//                   <input
//                     type="color"
//                     value={color.hex}
//                     onChange={(e) => handleColorChange(index, 'hex', e.target.value)}
//                     className="w-12 h-12 border-none rounded-lg cursor-pointer"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => removeColor(index)}
//                     className="btn-secondary"
//                     aria-label="Remove Color"
//                   >
//                     Remove
//                   </button>
//                 </div>
//               ))}
//               <button type="button" onClick={addColor} className="btn-primary-outline">
//                 + Add Color
//               </button>
//             </div>
//             <div className="mt-4">
//               <label className="block text-xl font-medium text-gray-600 mb-2">
//                 Sizes (comma-separated)
//               </label>
//               <input
//                 type="text"
//                 name="sizes"
//                 placeholder="e.g., S, M, L, XL"
//                 value={formData.sizes}
//                 onChange={handleChange}
//                 className="input"
//               />
//             </div>
//           </section>

//           {/* Product Details */}
//           <section className="space-y-4">
//             <h3 className="text-2xl font-semibold text-gray-700">Product Details</h3>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               {Object.entries(formData.details).map(([key]) => (
//                 <input
//                   key={key}
//                   type="text"
//                   name={`details.${key}`}
//                   placeholder={key
//                     .replace(/([A-Z])/g, ' $1')
//                     .replace(/^./, (str) => str.toUpperCase())}
//                   value={formData.details[key]}
//                   onChange={handleChange}
//                   className="input"
//                 />
//               ))}
//             </div>
//           </section>

//           {/* Additional Info */}
//           <section className="space-y-4">
//             <h3 className="text-2xl font-semibold text-gray-700">Additional Info (label:value per line)</h3>
//             <div>
//               <label className="block text-xl font-medium text-gray-600 mb-2">Material & Washing</label>
//               <textarea
//                 name="materialWashing"
//                 placeholder={'e.g.\nMaterial: Cotton\nWash Care: Machine Wash'}
//                 value={formData.materialWashing}
//                 onChange={handleChange}
//                 className="input min-h-[120px]"
//               />
//             </div>
//             <div>
//               <label className="block text-xl font-medium text-gray-600 mb-2">Size & Shape</label>
//               <textarea
//                 name="sizeShape"
//                 placeholder={'e.g.\nFit: Slim Fit\nLength: Full-Length'}
//                 value={formData.sizeShape}
//                 onChange={handleChange}
//                 className="input min-h-[120px]"
//               />
//             </div>
//           </section>

//           {/* Media Uploads */}
//           <section className="space-y-6">
//             <h3 className="text-2xl font-semibold text-gray-700">Product Images & Videos</h3>

//             {mediaGroups.length === 0 && (
//               <p className="text-gray-500 mb-2">No media added yet. Click "Add Media Group" below.</p>
//             )}

//             {mediaGroups.map((group, idx) => (
//               <div key={group.id} className="border p-4 rounded-md bg-gray-50">
//                 <div className="flex justify-between items-center mb-3">
//                   <h4 className="text-lg font-medium">Media Group #{idx + 1}</h4>
//                   <button
//                     type="button"
//                     onClick={() => removeMediaGroup(group.id)}
//                     className="btn-secondary"
//                     aria-label={`Remove media group ${idx + 1}`}
//                   >
//                     Remove Group
//                   </button>
//                 </div>
//                 <input
//                   type="file"
//                   multiple
//                   accept="image/*,video/*"
//                   onChange={(e) => handleMediaFilesChange(group.id, e.target.files)}
//                   className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
//                 />
//                 <div className="mt-4 flex flex-wrap gap-4">
//                   {group.previews.map((preview) =>
//                     preview.type === 'image' ? (
//                       <img
//                         key={preview.id}
//                         src={preview.url}
//                         alt="Media Preview"
//                         className="rounded-lg shadow-md w-32 h-32 object-cover"
//                       />
//                     ) : (
//                       <video
//                         key={preview.id}
//                         src={preview.url}
//                         controls
//                         className="rounded-lg shadow-md w-32 h-32 object-cover"
//                       />
//                     )
//                   )}
//                 </div>
//               </div>
//             ))}

//             <button
//               type="button"
//               onClick={addMediaGroup}
//               className="btn-primary-outline mt-2"
//               aria-label="Add new media group"
//             >
//               + Add Media Group
//             </button>
//           </section>

//           <button type="submit" className="w-full btn-primary py-3 text-lg" disabled={false}>
//             Add Product
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };




return (
    <div className="min-h-screen bg-gray-100 py-8">
      <ToastContainer position="top-right" autoClose={3500} />
      <div className="bg-white rounded-xl shadow-xl p-6 md:p-10 max-w-4xl mt-2 mx-auto border-t-8 border-green-600">
        <h2 className="text-3xl font-bold text-green-800 mb-7 text-center">Add New Product</h2>
        <form onSubmit={handleSubmit} className="space-y-10">
          
          {/* Section: General Information */}
          <section>
            <h3 className="text-xl font-semibold text-green-400 border-l-4 border-green-400 pl-4 mb-5">General Information</h3>
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
                    className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                  />
                </label>
              </div>
              <div>
                <label className="block font-medium text-gray-700 mb-2">
                  Category <span className="text-gray-500">*</span>
                  {loadingCategories ? (
                    <div className="text-gray-500 mt-2">Loading...</div>
                  ) : (
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      required
                      className="w-full mt-2 p-3 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                    >
                      <option value="">Select a category</option>
                      {categories.map(cat => (
                        <option key={cat._id} value={cat._id}>{cat.name}</option>
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

          {/* Section: Pricing & Stock */}
          <section>
            <h3 className="text-xl font-semibold text-green-700 border-l-4 border-green-400 pl-4 mb-5">Pricing & Stock</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {['price', 'discountPrice', 'stock'].map((field, i) => (
                <label key={field} className="block font-medium text-gray-700 mb-2">
                  {field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}
                  <input
                    type="number"
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    className="w-full mt-2 p-3 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                    min="0"
                    {...(field === 'discountPercent' ? { max: 100 } : {})}
                    step="0.01"
                  />
                </label>
              ))}
            </div>
          </section>

          {/* Section: Description */}
          <section>
            <h3 className="text-xl font-semibold text-green-700 border-l-4 border-green-400 pl-4 mb-5">Description</h3>
            <label className="block font-medium text-gray-700 mb-2">
              Short Description
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full mt-2 p-3 border border-green-300 rounded-lg min-h-[100px] focus:outline-none focus:ring-2 focus:ring-green-400 transition"
              />
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-2">
              <label className="block font-medium text-gray-700 mb-2">
                Detailed Description (Paragraph 1)
                <textarea
                  name="detailedDescription.paragraph1"
                  value={formData.detailedDescription.paragraph1}
                  onChange={handleChange}
                  className="w-full mt-2 p-3 border border-gray-300 rounded-lg min-h-[80px] focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                />
              </label>
              <label className="block font-medium text-gray-700 mb-2">
                Detailed Description (Paragraph 2)
                <textarea
                  name="detailedDescription.paragraph2"
                  value={formData.detailedDescription.paragraph2}
                  onChange={handleChange}
                  className="w-full mt-2 p-3 border border-green-300 rounded-lg min-h-[80px] focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                />
              </label>
            </div>
          </section>

          {/* Section: Variations */}
          <section>
            <h3 className="text-xl font-semibold text-green-700 border-l-4 border-green-400 pl-4 mb-5">Product Variations</h3>
            <div className="mb-6">
              <h4 className="text-lg font-medium text-gray-700">Colors</h4>
              {formData.colors.map((color, i) => (
                <div key={i} className="flex items-center gap-3 my-2 bg-gray-50 rounded-lg p-3">
                  <input
                    type="text"
                    placeholder="Color Name"
                    value={color.name}
                    onChange={e => handleColorChange(i, 'name', e.target.value)}
                    className="input flex-1 rounded-md"
                  />
                  <input
                    type="color"
                    value={color.hex}
                    onChange={e => handleColorChange(i, 'hex', e.target.value)}
                    className="w-10 h-10 rounded-md cursor-pointer border-none"
                  />
                  <button
                    type="button"
                    onClick={() => removeColor(i)}
                    className="px-3 py-2 ml-2 rounded-md border border-green-300 text-green-700 hover:bg-red-50 transition text-sm"
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

          {/* Section: Details */}
          <section>
            <h3 className="text-xl font-semibold text-green-700 border-l-4 border-green-400 pl-4 mb-5">Product Details</h3>
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

          {/* Section: Additional */}
          <section>
            <h3 className="text-xl font-semibold text-green-700 border-l-4 border-green-400 pl-4 mb-5">Additional Info <span className="text-base text-green-400">(label:value per line)</span></h3>
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

          {/* Section: Media */}
          <section>
            <h3 className="text-xl font-semibold text-green-700 border-l-4 border-green-400 pl-4 mb-5">Product Media</h3>
            {mediaGroups.length === 0 && (
              <div className="text-gray-500 text-sm mb-4">No media added yet. Click "Add Media Group".</div>
            )}
            <div className="space-y-6">
              {mediaGroups.map((group, idx) => (
                <div key={group.id} className="bg-green-50 border border-green-200 rounded-lg p-5 shadow-sm">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-medium text-gray-800">Media Group #{idx + 1}</h4>
                    <button
                      type="button"
                      onClick={() => removeMediaGroup(group.id)}
                      className="px-3 py-1 rounded-md bg-gren-50 text-green-800 border border-green-200 hover:bg-green-100 transition"
                      aria-label={`Remove media group ${idx + 1}`}
                    >
                      Remove
                    </button>
                  </div>
                  <input
                    type="file"
                    multiple
                    accept="image/*,video/*"
                    onChange={e => handleMediaFilesChange(group.id, e.target.files)}
                    className="block w-full bg-white p-2 rounded-md border border-green-300 mb-2"
                  />
                  <div className="flex flex-wrap gap-4 mt-3">
                    {group.previews.map(preview => 
                      preview.type === 'image' ? (
                        <img key={preview.id} src={preview.url} alt="Preview" className="w-28 h-28 object-cover rounded-md border" />
                      ) : (
                        <video key={preview.id} src={preview.url} controls className="w-28 h-28 rounded-md border" />
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
            Add Product
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
