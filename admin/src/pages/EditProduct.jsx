import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";


export default function EditProduct({ onSuccess }) {
  const { id } = useParams();

  const [formData, setFormData] = useState({
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

  // mediaGroups: array of { id, files: [{id, file}], previews: [{id, url, type, existing, existingId}] }
  const [mediaGroups, setMediaGroups] = useState([]);
  const [removedMediaIds, setRemovedMediaIds] = useState([]); // identifiers of existing media to delete

  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingProduct, setLoadingProduct] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_URL}/api/categories`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCategories(res.data || []);
      } catch (err) {
        console.error("Error fetching categories", err);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      setLoadingProduct(true);
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_URL}/api/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const product = res.data;

        // Normalize sizes: if backend stores array of objects, use it; if old format, try to convert
        const sizes = Array.isArray(product.sizes)
          ? product.sizes.map((s) => ({
              size: s.size ?? s, // if s is string (old) or object
              price: s.price ?? "",
              discountPrice: s.discountPrice ?? "",
              discountPercent: s.discountPercent ?? "",
              stock: s.stock ?? "",
            }))
          : [];

        // Normalize colors
        const colors = Array.isArray(product.colors)
          ? product.colors.map((c) => ({ name: c.name ?? "", hex: c.hex ?? c.hexCode ?? "#000000" }))
          : [];

        // materialWashing and sizeShape: convert array of {label,value} to textarea text
        const materialWashing = Array.isArray(product.materialWashing)
          ? product.materialWashing.map((it) => `${it.label}: ${it.value}`).join("\n")
          : product.materialWashing || "";

        const sizeShape = Array.isArray(product.sizeShape)
          ? product.sizeShape.map((it) => `${it.label}: ${it.value}`).join("\n")
          : product.sizeShape || "";

        setFormData((prev) => ({
          ...prev,
          productName: product.productName || "",
          productCode: product.productCode || "",
          category: product.category?._id || product.category || "",
          brand: product.brand || "",
          description: product.description || "",
          detailedDescription: product.detailedDescription || { paragraph1: "", paragraph2: "" },
          colors,
          sizes,
          details: product.details || prev.details,
          materialWashing,
          sizeShape,
        }));

        // Build media group(s) from existing media. We'll put all existing media in one group by default.
        if (product.media && Array.isArray(product.media) && product.media.length > 0) {
          const previews = product.media.map((m) => ({
            id: uuidv4(),
            url: m.url,
            type: m.type || (m.url?.includes(".mp4") ? "video" : "image"),
            existing: true,
            existingId: m._id || m.id || m.public_id || m.url, // fallback to url if no id
          }));
          setMediaGroups([{ id: uuidv4(), files: [], previews }]);
        } else {
          setMediaGroups([]);
        }
      } catch (err) {
        console.error("Failed to load product", err);
        toast.error("Failed to load product data.");
      } finally {
        setLoadingProduct(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    if (type === "number" && value !== "" && isNaN(value)) return;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({ ...prev, [parent]: { ...prev[parent], [child]: value } }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Colors
  const handleColorChange = (index, key, value) => {
    const updated = [...formData.colors];
    updated[index] = { ...updated[index], [key]: value };
    setFormData((prev) => ({ ...prev, colors: updated }));
  };
  const addColor = () => setFormData((prev) => ({ ...prev, colors: [...prev.colors, { name: "", hex: "#000000" }] }));
  const removeColor = (index) => setFormData((prev) => ({ ...prev, colors: prev.colors.filter((_, i) => i !== index) }));

  // Sizes
  const handleSizeChange = (index, key, value) => {
    const updated = [...formData.sizes];
    updated[index] = { ...updated[index], [key]: value };
    setFormData((prev) => ({ ...prev, sizes: updated }));
  };
  const addSize = () => setFormData((prev) => ({ ...prev, sizes: [...prev.sizes, { size: "", price: "", discountPrice: "", discountPercent: "", stock: "" }] }));
  const removeSize = (index) => setFormData((prev) => ({ ...prev, sizes: prev.sizes.filter((_, i) => i !== index) }));

  // Media handling
  const addMediaGroup = () => setMediaGroups((prev) => [...prev, { id: uuidv4(), files: [], previews: [] }]);

  const handleMediaFilesChange = (groupId, fileList) => {
    const newFiles = Array.from(fileList).map((f) => ({ id: uuidv4(), file: f }));
    const newPreviews = newFiles.map((nf) => ({ id: nf.id, url: URL.createObjectURL(nf.file), type: nf.file.type.startsWith("image/") ? "image" : "video", existing: false }));

    setMediaGroups((prev) =>
      prev.map((g) => (g.id === groupId ? { ...g, files: [...g.files, ...newFiles], previews: [...g.previews, ...newPreviews] } : g))
    );
  };

  const removePreview = (groupId, previewId) => {
    setMediaGroups((prev) =>
      prev.map((g) => {
        if (g.id !== groupId) return g;
        const preview = g.previews.find((p) => p.id === previewId);
        // If it was an existing preview, mark it for removal
        if (preview && preview.existing) {
          setRemovedMediaIds((r) => [...r, preview.existingId]);
        }
        // Remove preview
        const newPreviews = g.previews.filter((p) => p.id !== previewId);
        // Also remove associated new file if present
        const newFiles = g.files.filter((f) => f.id !== previewId);
        return { ...g, previews: newPreviews, files: newFiles };
      })
    );
  };

  const removeMediaGroup = (groupId) => {
    // collect existing preview ids to remove
    const group = mediaGroups.find((g) => g.id === groupId);
    if (group) {
      group.previews.forEach((p) => {
        if (p.existing) setRemovedMediaIds((r) => [...r, p.existingId]);
      });
    }
    setMediaGroups((prev) => prev.filter((g) => g.id !== groupId));
  };

  const formatArrayFromTextarea = (text) =>
    text
      .split("\n")
      .filter(Boolean)
      .map((line) => {
        const [label, ...vals] = line.split(":");
        return { label: label?.trim(), value: vals.join(":").trim() };
      });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.productName.trim() || !formData.category) {
      toast.error("Please fill in required fields (name & category).");
      return;
    }

    try {
      const data = new FormData();

      // Append simple keys and objects
      const keysToAppend = { ...formData };

      // details and detailedDescription are objects
      data.append("detailedDescription", JSON.stringify(keysToAppend.detailedDescription || {}));
      data.append("details", JSON.stringify(keysToAppend.details || {}));
      data.append("productName", keysToAppend.productName || "");
      data.append("productCode", keysToAppend.productCode || "");
      data.append("category", keysToAppend.category || "");
      data.append("brand", keysToAppend.brand || "");
      data.append("description", keysToAppend.description || "");

      // sizes and colors
      data.append("sizes", JSON.stringify(keysToAppend.sizes || []));
      data.append("colors", JSON.stringify(keysToAppend.colors || []));

      // materialWashing and sizeShape -> arrays
      data.append("materialWashing", JSON.stringify(formatArrayFromTextarea(keysToAppend.materialWashing || "")));
      data.append("sizeShape", JSON.stringify(formatArrayFromTextarea(keysToAppend.sizeShape || "")));

      // Append removed existing media identifiers so backend can delete
      if (removedMediaIds.length > 0) {
        data.append("removedMedia", JSON.stringify(removedMediaIds));
      }

      // Append new media files
      mediaGroups.forEach((g) => {
        g.files.forEach((fObj) => {
          data.append("media", fObj.file);
        });
      });

      const token = localStorage.getItem("token");
      await axios.put(`${API_URL}/api/products/edit/${id}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Product updated successfully!");
      if (typeof onSuccess === "function") onSuccess();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update product. Check console.");
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
    <div className="min-h-screen bg-gray-100 py-8">
      <ToastContainer position="top-right" autoClose={3500} />
      <div className="bg-white rounded-xl shadow-xl p-6 md:p-10 max-w-5xl mt-2 mx-auto border-t-8 border-green-600">
        <h2 className="text-3xl font-bold text-green-800 mb-7 text-center">Edit Product</h2>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* General Info */}
          <section>
            <h3 className="text-xl font-semibold text-green-400 border-l-4 border-green-400 pl-4 mb-5">General Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block font-medium text-gray-700 mb-2">Product Name <span className="text-red-500">*</span>
                  <input type="text" name="productName" value={formData.productName} onChange={handleChange} required className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition" />
                </label>
              </div>
              <div>
                <label className="block font-medium text-gray-700 mb-2">Product Code
                  <input type="text" name="productCode" value={formData.productCode} onChange={handleChange} className="w-full mt-2 p-3 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition" />
                </label>
              </div>
              <div>
                <label className="block font-medium text-gray-700 mb-2">Category <span className="text-gray-500">*</span>
                  {loadingCategories ? (
                    <div className="text-gray-500 mt-2">Loading...</div>
                  ) : (
                    <select name="category" value={formData.category} onChange={handleChange} required className="w-full mt-2 p-3 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition">
                      <option value="">Select a category</option>
                      {categories.map((cat) => (
                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                      ))}
                    </select>
                  )}
                </label>
              </div>
              <div>
                <label className="block font-medium text-gray-700 mb-2">Brand
                  <input type="text" name="brand" value={formData.brand} onChange={handleChange} className="w-full mt-2 p-3 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition" />
                </label>
              </div>
            </div>
          </section>

          {/* Sizes & Pricing */}
          <section>
            <h3 className="text-xl font-semibold text-green-700 border-l-4 border-green-400 pl-4 mb-5">Sizes & Pricing</h3>
            {formData.sizes.map((s, idx) => (
              <div key={idx} className="grid grid-cols-1 sm:grid-cols-6 gap-3 mb-3 items-center">
                <input type="text" placeholder="Size (S, M, L...)" value={s.size} onChange={(e) => handleSizeChange(idx, "size", e.target.value)} className="p-2 border border-gray-300 rounded" />
                <input type="number" placeholder="Price" value={s.price} onChange={(e) => handleSizeChange(idx, "price", e.target.value)} className="p-2 border border-gray-300 rounded" />
                <input type="number" placeholder="Discount Price" value={s.discountPrice} onChange={(e) => handleSizeChange(idx, "discountPrice", e.target.value)} className="p-2 border border-gray-300 rounded" />
                <input type="number" placeholder="Stock" value={s.stock} onChange={(e) => handleSizeChange(idx, "stock", e.target.value)} className="p-2 border border-gray-300 rounded" />
                <button type="button" onClick={() => removeSize(idx)} className="px-2 py-1 bg-red-100 text-red-700 rounded">Remove</button>
              </div>
            ))}
            <button type="button" onClick={addSize} className="px-4 py-2 bg-green-100 text-green-700 rounded">+ Add Size</button>
          </section>

          {/* Description */}
          <section>
            <h3 className="text-xl font-semibold text-green-700 border-l-4 border-green-400 pl-4 mb-5">Description</h3>
            <label className="block font-medium text-gray-700 mb-2">Short Description
              <textarea name="description" value={formData.description} onChange={handleChange} className="w-full mt-2 p-3 border border-green-300 rounded-lg min-h-[100px] focus:outline-none focus:ring-2 focus:ring-green-400 transition" />
            </label>
          </section>

          {/* Variations: Colors */}
          <section>
            <h3 className="text-xl font-semibold text-green-700 border-l-4 border-green-400 pl-4 mb-5">Product Variations</h3>
            <div className="mb-6">
              <h4 className="text-lg font-medium text-gray-700">Colors</h4>
              {formData.colors.map((color, i) => (
                <div key={i} className="flex items-center gap-3 my-2 bg-gray-50 rounded-lg p-3">
                  <input type="text" placeholder="Color Name" value={color.name} onChange={(e) => handleColorChange(i, "name", e.target.value)} className="input flex-1 rounded-md" />
                  <input type="color" value={color.hex} onChange={(e) => handleColorChange(i, "hex", e.target.value)} className="w-10 h-10 rounded-md cursor-pointer border-none" />
                  <button type="button" onClick={() => removeColor(i)} className="px-3 py-2 ml-2 rounded-md border border-green-300 text-green-700 hover:bg-red-50 transition text-sm">Remove</button>
                </div>
              ))}
              <button type="button" onClick={addColor} className="mt-2 px-4 py-2 rounded-md bg-green-100 text-green-800 border border-green-200 hover:bg-green-200 transition text-sm">+ Add Color</button>
            </div>
          </section>

          {/* Details */}
          <section>
            <h3 className="text-xl font-semibold text-green-700 border-l-4 border-green-400 pl-4 mb-5">Product Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {Object.entries(formData.details).map(([key]) => (
                <label key={key} className="block font-medium text-gray-700 mb-2">
                  {key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase())}
                  <input type="text" name={`details.${key}`} value={formData.details[key]} onChange={handleChange} className="w-full mt-2 p-3 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition" />
                </label>
              ))}
            </div>
          </section>

          {/* Additional Info */}
          <section>
            <h3 className="text-xl font-semibold text-green-700 border-l-4 border-green-400 pl-4 mb-5">Additional Info <span className="text-base text-green-400">(label:value per line)</span></h3>
            <div className="mb-5">
              <label className="block font-medium text-gray-700 mb-2">Material & Washing
                <textarea name="materialWashing" value={formData.materialWashing} onChange={handleChange} className="w-full mt-2 p-3 border border-green-300 rounded-lg min-h-[80px] focus:outline-none focus:ring-2 focus:ring-green-400 transition" placeholder={"e.g.\nMaterial: Cotton\nWash Care: Machine Wash"} />
              </label>
            </div>
            <div>
              <label className="block font-medium text-gray-700 mb-2">Size & Shape
                <textarea name="sizeShape" value={formData.sizeShape} onChange={handleChange} className="w-full mt-2 p-3 border border-green-300 rounded-lg min-h-[80px] focus:outline-none focus:ring-2 focus:ring-green-400 transition" placeholder={"e.g.\nFit: Slim Fit\nLength: Full-Length"} />
              </label>
            </div>
          </section>

          {/* Media */}
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
                    <div className="flex gap-2">
                      <button type="button" onClick={() => removeMediaGroup(group.id)} className="px-3 py-1 rounded-md bg-gren-50 text-green-800 border border-green-200 hover:bg-green-100 transition">Remove</button>
                    </div>
                  </div>

                  <input type="file" multiple accept="image/*,video/*" onChange={(e) => handleMediaFilesChange(group.id, e.target.files)} className="block w-full bg-white p-2 rounded-md border border-green-300 mb-2" />

                  <div className="flex flex-wrap gap-4 mt-3">
                    {group.previews.map((preview) =>
                      preview.type === "image" ? (
                        <div key={preview.id} className="relative">
                          <img src={preview.url} alt="Preview" className="w-28 h-28 object-cover rounded-md border" />
                          <button type="button" onClick={() => removePreview(group.id, preview.id)} className="absolute -top-1 -right-1 bg-white rounded-full p-1 border">✕</button>
                        </div>
                      ) : (
                        <div key={preview.id} className="relative">
                          <video src={preview.url} controls className="w-28 h-28 rounded-md border" />
                          <button type="button" onClick={() => removePreview(group.id, preview.id)} className="absolute -top-1 -right-1 bg-white rounded-full p-1 border">✕</button>
                        </div>
                      )
                    )}
                  </div>
                </div>
              ))}
            </div>
            <button type="button" onClick={addMediaGroup} className="mt-4 block mx-auto px-4 py-2 rounded-md bg-green-100 text-green-800 border border-green-200 hover:bg-green-200 transition">+ Add Media Group</button>
          </section>

          <button type="submit" className="w-full py-3 mt-6 rounded-lg font-bold bg-green-600 text-white hover:bg-green-700 transition text-lg shadow">Update Product</button>
        </form>
      </div>
    </div>
  );
}

