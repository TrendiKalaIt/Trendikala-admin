import React, { useState } from "react";
import { saveAs } from "file-saver";

const AddProduct = () => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    discountPrice: "",
    category: "",
    brand: "",
    fabric: "",
    pattern: "",
    washCare: "",
    deliveryReturn: "",
    fitType: "",
    occasionType: "",
    countryOrigin: "",
  });

  const [colors, setColors] = useState([]);
  const [colorInput, setColorInput] = useState("");
  const [sizes, setSizes] = useState([]);
  const [sizeInput, setSizeInput] = useState("");
  const [files, setFiles] = useState([]);
  const [errors, setErrors] = useState({});

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const totalFiles = [...files, ...selectedFiles];

    if (totalFiles.length > 10) {
      alert("❌ You can only upload up to 10 files.");
      return;
    }

    setFiles(totalFiles);
  };

  const removeFile = (index) => {
    const updatedFiles = [...files];
    updatedFiles.splice(index, 1);
    setFiles(updatedFiles);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if ((name === "price" || name === "discountPrice") && value !== "") {
      if (!/^\d+$/.test(value)) return;
    }
    setForm({ ...form, [name]: value });
  };

  const handleAddColor = () => {
    if (colorInput && !colors.includes(colorInput)) {
      setColors([...colors, colorInput]);
      setColorInput("");
    }
  };

  const handleAddSize = () => {
    if (sizeInput && !sizes.includes(sizeInput)) {
      setSizes([...sizes, sizeInput]);
      setSizeInput("");
    }
  };

  const handleRemoveColor = (color) => {
    setColors(colors.filter((c) => c !== color));
  };

  const handleRemoveSize = (size) => {
    setSizes(sizes.filter((s) => s !== size));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.name) newErrors.name = "Product name is required.";
    if (!form.description) newErrors.description = "Description is required.";
    if (!form.price) newErrors.price = "Price is required.";
    if (!form.category) newErrors.category = "Category is required.";
    if (colors.length === 0) newErrors.colors = "At least one color required.";
    if (sizes.length === 0) newErrors.sizes = "At least one size required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

const handleSubmit = async () => {
  if (!validateForm()) return;

  try {
    const uploadedUrls = [];

    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "your_upload_preset"); // 🔁 Change this
      formData.append("cloud_name", "your_cloud_name");        // 🔁 Change this if needed

      const res = await fetch("https://api.cloudinary.com/v1_1/your_cloud_name/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.secure_url) {
        uploadedUrls.push(data.secure_url);
      } else {
        console.error("Cloudinary upload failed:", data);
        alert("❌ Failed to upload one or more files.");
        return;
      }
    }

    const productData = {
      ...form,
      colors,
      sizes,
      images: uploadedUrls,
      createdAt: new Date().toISOString(),
    };

    const dbRes = await fetch("/api/products/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productData),
    });

    if (!dbRes.ok) throw new Error("Failed to save product");

    const result = await dbRes.json();
    alert(result.message || " Product saved to DB!");

    // Reset form
    setForm({
      name: "",
      description: "",
      price: "",
      discountPrice: "",
      category: "",
      brand: "",
      fabric: "",
      pattern: "",
      washCare: "",
      deliveryReturn: "",
      fitType: "",
      occasionType: "",
      countryOrigin: "",
    });
    setColors([]);
    setSizes([]);
    setFiles([]);
    setErrors({});
  } catch (err) {
    console.error(" Error saving product:", err);
    alert(" Error saving product");
  }
};



  return (
    <div className="p-6 space-y-6 bg-[#f5f9ef]">
      <h1 className="text-2xl font-bold text-[#49951C]">Add Product</h1>

      <div className="bg-white rounded-lg p-6 shadow space-y-4">
        {/* Product Name */}
        <div>
          <label className="block text-sm font-medium">Product Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            type="text"
            placeholder="Enter product name"
            className="mt-1 w-full border rounded px-3 py-2"
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium">Product Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Product description"
            className="mt-1 w-full border rounded px-3 py-2"
          />
          {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
        </div>

        {/* File Upload */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Upload Files (images/videos/pdfs)
          </label>
          <input
            type="file"
            multiple
            accept="image/*,video/*,application/pdf"
            onChange={handleFileChange}
            className="w-full border px-3 py-2 rounded"
          />
          <div className="mt-2 text-sm text-gray-600 space-y-1">
            {files.map((file, index) => (
              <div key={index} className="flex items-center justify-between bg-gray-100 px-3 py-1 rounded">
                <span className="truncate">{file.name}</span>
                <button
                  onClick={() => removeFile(index)}
                  className="text-red-600 text-sm ml-2"
                >
                  X
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Price & Discount */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Product Price</label>
            <input
              name="price"
              value={form.price}
              onChange={handleChange}
              type="text"
              placeholder="Enter price"
              className="mt-1 w-full border rounded px-3 py-2"
            />
            {errors.price && <p className="text-red-500 text-sm">{errors.price}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium">Discount Price</label>
            <input
              name="discountPrice"
              value={form.discountPrice}
              onChange={handleChange}
              type="text"
              placeholder="Discounted price"
              className="mt-1 w-full border rounded px-3 py-2"
            />
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium">Category</label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="mt-1 w-full border rounded px-3 py-2"
          >
            <option value="">Choose category</option>
            <option value="Men">Men</option>
            <option value="Women">Women</option>
          </select>
          {errors.category && <p className="text-red-500 text-sm">{errors.category}</p>}
        </div>

        {/* Sizes */}
        <div>
          <label className="block text-sm font-medium">Sizes</label>
          <div className="flex gap-2 mt-2">
            <input
              type="text"
              value={sizeInput}
              onChange={(e) => setSizeInput(e.target.value)}
              placeholder="Add Size"
              className="border rounded px-3 py-2"
            />
            <button type="button" onClick={handleAddSize} className="bg-green-700 text-white px-4 py-2 rounded">
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {sizes.map((size) => (
              <span key={size} className="bg-gray-200 px-3 py-1 rounded text-sm flex items-center gap-2">
                {size}
                <button onClick={() => handleRemoveSize(size)}>✕</button>
              </span>
            ))}
          </div>
          {errors.sizes && <p className="text-red-500 text-sm">{errors.sizes}</p>}
        </div>

        {/* Colors */}
        <div>
          <label className="block text-sm font-medium">Colors</label>
          <div className="flex gap-2 mt-2">
            <input
              type="text"
              value={colorInput}
              onChange={(e) => setColorInput(e.target.value)}
              placeholder="Add Color"
              className="border rounded px-3 py-2"
            />
            <button type="button" onClick={handleAddColor} className="bg-green-700 text-white px-4 py-2 rounded">
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {colors.map((color) => (
              <span key={color} className="bg-gray-200 px-3 py-1 rounded text-sm flex items-center gap-2">
                {color}
                <button onClick={() => handleRemoveColor(color)}>✕</button>
              </span>
            ))}
          </div>
          {errors.colors && <p className="text-red-500 text-sm">{errors.colors}</p>}
        </div>

        {/* Other Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          {[["brand", "Brand Name"], ["fabric", "Fabric"], ["pattern", "Pattern/Print"], ["washCare", "Wash Care"], ["deliveryReturn", "Delivery & Return"], ["fitType", "Fit Type"], ["occasionType", "Occasion Type"], ["countryOrigin", "Country Origin"]].map(([key, label]) => (
            <div key={key}>
              <label className="block text-sm font-medium">{label}</label>
              <input
                name={key}
                value={form[key]}
                onChange={handleChange}
                type="text"
                placeholder={label}
                className="mt-1 w-full border rounded px-3 py-2"
              />
            </div>
          ))}
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end gap-4 mt-6">
          
          <button onClick={handleSubmit} className="px-4 py-2 rounded bg-[#3a4d39] text-white">
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
