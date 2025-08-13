import React, { useState, useEffect } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const AddProduct = () => {
  const [formData, setFormData] = useState({
    productName: "",
    category: "",
    productCode: "",
    brand: "",
    description: "",
    detailedDescription: { paragraph1: "", paragraph2: "" },
    colors: [],
    sizes: [], // now array of objects with size, price, discountPrice, discountPercent, stock
    details: {
      fabric: "",
      fitType: "",
      length: "",
      sleeveNeckType: "",
      patternPrint: "",
      occasionType: "",
      washCare: "",
      countryOfOrigin: "",
      deliveryReturns: "",
    },
    materialWashing: "",
    sizeShape: "",
  });

  const [mediaGroups, setMediaGroups] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_URL}/api/categories`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCategories(response.data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  // General input handler
  const handleChange = (e) => {
    const { name, value, type } = e.target;

    if (type === "number" && value !== "" && isNaN(value)) return;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Colors
  const handleColorChange = (index, key, value) => {
    const updatedColors = [...formData.colors];
    updatedColors[index] = { ...updatedColors[index], [key]: value };
    setFormData({ ...formData, colors: updatedColors });
  };

  const addColor = () => {
    setFormData((prev) => ({
      ...prev,
      colors: [...prev.colors, { name: "", hex: "#000000" }],
    }));
  };

  const removeColor = (index) => {
    const updatedColors = formData.colors.filter((_, i) => i !== index);
    setFormData({ ...formData, colors: updatedColors });
  };

  // Sizes
  const handleSizeChange = (index, key, value) => {
    const updatedSizes = [...formData.sizes];
    updatedSizes[index] = { ...updatedSizes[index], [key]: value };
    setFormData({ ...formData, sizes: updatedSizes });
  };

  const addSize = () => {
    setFormData((prev) => ({
      ...prev,
      sizes: [
        ...prev.sizes,
        { size: "", price: "", discountPrice: "", discountPercent: "", stock: "" },
      ],
    }));
  };

  const removeSize = (index) => {
    const updatedSizes = formData.sizes.filter((_, i) => i !== index);
    setFormData({ ...formData, sizes: updatedSizes });
  };

  // Media
  const handleMediaFilesChange = (groupId, files) => {
    const updatedGroups = mediaGroups.map((group) => {
      if (group.id === groupId) {
        const newFiles = Array.from(files);
        const newPreviews = newFiles.map((file) => ({
          id: uuidv4(),
          url: URL.createObjectURL(file),
          type: file.type.startsWith("image/") ? "image" : "video",
        }));
        return { ...group, files: newFiles, previews: newPreviews };
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
    const lines = text.split("\n").filter(Boolean);
    return lines.map((line) => {
      const [label, ...values] = line.split(":");
      return { label: label?.trim(), value: values?.join(":").trim() };
    });
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.productName.trim() || !formData.category.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      const data = new FormData();

      for (const key in formData) {
        const value = formData[key];
        if (typeof value === "object" && !Array.isArray(value)) {
          data.append(key, JSON.stringify(value));
        } else if (key === "sizes" || key === "colors") {
          data.append(key, JSON.stringify(value));
        } else if (key === "materialWashing" || key === "sizeShape") {
          data.append(key, JSON.stringify(formatArrayFromTextarea(value)));
        } else {
          data.append(key, value);
        }
      }

      // Append media files
      mediaGroups.forEach((group) => {
        group.files.forEach((file) => data.append("media", file));
      });

      const token = localStorage.getItem("token");
      await axios.post(`${API_URL}/api/products/add`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Product added successfully!");
      // Reset form
      setFormData({
        productName: "",
        category: "",
        productCode: "",
        brand: "",
        description: "",
        detailedDescription: { paragraph1: "", paragraph2: "" },
        colors: [],
        sizes: [],
        details: {
          fabric: "",
          fitType: "",
          length: "",
          sleeveNeckType: "",
          patternPrint: "",
          occasionType: "",
          washCare: "",
          countryOfOrigin: "",
          deliveryReturns: "",
        },
        materialWashing: "",
        sizeShape: "",
      });
      setMediaGroups([]);
    } catch (err) {
      toast.error("Failed to add product. Please check your inputs.");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <ToastContainer position="top-right" autoClose={3500} />
      <div className="bg-white rounded-xl shadow-xl p-6 md:p-10 max-w-4xl mt-2 mx-auto border-t-8 border-green-600">
        <h2 className="text-3xl font-bold text-green-800 mb-7 text-center">
          Add New Product
        </h2>
        <form onSubmit={handleSubmit} className="space-y-10">
          {/* General Info */}
          <section>
            <h3 className="text-xl font-semibold text-green-400 border-l-4 border-green-400 pl-4 mb-5">
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
                    className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                  />
                </label>
              </div>
              <div>
                <label className="block font-medium text-gray-700 mb-2">
                  Product Code <span className="text-red-500">*</span>
                  <input
                    type="text"
                    name="productCode"
                    value={formData.productCode}
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

          {/* Sizes Section */}
          <section>
            <h3 className="text-xl font-semibold text-green-700 border-l-4 border-green-400 pl-4 mb-5">
              Sizes & Pricing
            </h3>
            {formData.sizes.map((s, idx) => (
              <div key={idx} className="grid grid-cols-1 sm:grid-cols-5 gap-4 mb-3">
                <input
                  type="text"
                  placeholder="Size (S, M, L...)"
                  value={s.size}
                  onChange={(e) => handleSizeChange(idx, "size", e.target.value)}
                  className="p-2 border border-gray-300 rounded"
                />
                <input
                  type="number"
                  placeholder="Price"
                  value={s.price}
                  onChange={(e) => handleSizeChange(idx, "price", e.target.value)}
                  className="p-2 border border-gray-300 rounded"
                />
                <input
                  type="number"
                  placeholder="Discount Price"
                  value={s.discountPrice}
                  onChange={(e) => handleSizeChange(idx, "discountPrice", e.target.value)}
                  className="p-2 border border-gray-300 rounded"
                />
              
                <input
                  type="number"
                  placeholder="Stock"
                  value={s.stock}
                  onChange={(e) => handleSizeChange(idx, "stock", e.target.value)}
                  className="p-2 border border-gray-300 rounded"
                />
                <button
                  type="button"
                  onClick={() => removeSize(idx)}
                  className="px-2 py-1 bg-red-100 text-red-700 rounded"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addSize}
              className="px-4 py-2 bg-green-100 text-green-700 rounded"
            >
              + Add Size
            </button>
          </section>

          {/* Section: Description */}
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

          {/* Section: Variations */}
          <section>
            <h3 className="text-xl font-semibold text-green-700 border-l-4 border-green-400 pl-4 mb-5">
              Product Variations
            </h3>
            <div className="mb-6">
              <h4 className="text-lg font-medium text-gray-700">Colors</h4>
              {formData.colors.map((color, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 my-2 bg-gray-50 rounded-lg p-3"
                >
                  <input
                    type="text"
                    placeholder="Color Name"
                    value={color.name}
                    onChange={(e) =>
                      handleColorChange(i, "name", e.target.value)
                    }
                    className="input flex-1 rounded-md"
                  />
                  <input
                    type="color"
                    value={color.hex}
                    onChange={(e) =>
                      handleColorChange(i, "hex", e.target.value)
                    }
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

          
          </section>

          {/* Section: Details */}
          <section>
            <h3 className="text-xl font-semibold text-green-700 border-l-4 border-green-400 pl-4 mb-5">
              Product Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {Object.entries(formData.details).map(([key]) => (
                <label
                  key={key}
                  className="block font-medium text-gray-700 mb-2"
                >
                  {key
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, (s) => s.toUpperCase())}
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
            <h3 className="text-xl font-semibold text-green-700 border-l-4 border-green-400 pl-4 mb-5">
              Additional Info{" "}
              <span className="text-base text-green-400">
                (label:value per line)
              </span>
            </h3>
            <div className="mb-5">
              <label className="block font-medium text-gray-700 mb-2">
                Material & Washing
                <textarea
                  name="materialWashing"
                  value={formData.materialWashing}
                  onChange={handleChange}
                  className="w-full mt-2 p-3 border border-green-300 rounded-lg min-h-[80px] focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                  placeholder={
                    "e.g.\nMaterial: Cotton\nWash Care: Machine Wash"
                  }
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
                  placeholder={"e.g.\nFit: Slim Fit\nLength: Full-Length"}
                />
              </label>
            </div>
          </section>

          {/* Section: Media */}
          <section>
            <h3 className="text-xl font-semibold text-green-700 border-l-4 border-green-400 pl-4 mb-5">
              Product Media
            </h3>
            {mediaGroups.length === 0 && (
              <div className="text-gray-500 text-sm mb-4">
                No media added yet. Click "Add Media Group".
              </div>
            )}
            <div className="space-y-6">
              {mediaGroups.map((group, idx) => (
                <div
                  key={group.id}
                  className="bg-green-50 border border-green-200 rounded-lg p-5 shadow-sm"
                >
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-medium text-gray-800">
                      Media Group #{idx + 1}
                    </h4>
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
                    onChange={(e) =>
                      handleMediaFilesChange(group.id, e.target.files)
                    }
                    className="block w-full bg-white p-2 rounded-md border border-green-300 mb-2"
                  />
                  <div className="flex flex-wrap gap-4 mt-3">
                    {group.previews.map((preview) =>
                      preview.type === "image" ? (
                        <img
                          key={preview.id}
                          src={preview.url}
                          alt="Preview"
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
            Add Product
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
