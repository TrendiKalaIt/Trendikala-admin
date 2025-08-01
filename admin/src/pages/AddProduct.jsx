import React, { useState } from 'react';

// Dynamic key-value pairs input for `details`
const KeyValueInput = ({ data, setData }) => {
  const handleChangeKey = (index, key) => {
    const newData = [...data];
    newData[index].key = key;
    setData(newData);
  };

  const handleChangeValue = (index, value) => {
    const newData = [...data];
    newData[index].value = value;
    setData(newData);
  };

  const addRow = () => {
    setData([...data, { key: '', value: '' }]);
  };

  const removeRow = (index) => {
    setData(data.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-2">
      {data.map((item, index) => (
        <div key={index} className="flex space-x-2">
          <input
            type="text"
            placeholder="Key (e.g. weight)"
            value={item.key}
            onChange={(e) => handleChangeKey(index, e.target.value)}
            className="flex-1 border rounded px-2 py-1"
          />
          <input
            type="text"
            placeholder="Value (e.g. 1.2kg)"
            value={item.value}
            onChange={(e) => handleChangeValue(index, e.target.value)}
            className="flex-1 border rounded px-2 py-1"
          />
          <button
            type="button"
            onClick={() => removeRow(index)}
            className="bg-red-500 text-white px-2 rounded"
          >
            &times;
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={addRow}
        className="mt-2 bg-indigo-600 text-white px-4 py-1 rounded"
      >
        Add Detail
      </button>
    </div>
  );
};

// Component for handling the dynamic list of features inside detailedDescription
const DetailedDescriptionInput = ({ data, setData }) => {
  const handleTitleChange = (e) => {
    setData({ ...data, title: e.target.value });
  };

  const handleListChange = (index, value) => {
    const newList = [...data.list];
    newList[index] = value;
    setData({ ...data, list: newList });
  };

  const addListItem = () => {
    setData({ ...data, list: [...data.list, ''] });
  };

  const removeListItem = (index) => {
    const newList = data.list.filter((_, i) => i !== index);
    setData({ ...data, list: newList });
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Title (e.g. Key Features)"
        value={data.title}
        onChange={handleTitleChange}
        className="w-full border rounded px-2 py-1 mb-2"
      />
      <div className="space-y-2">
        {data.list.map((item, index) => (
          <div key={index} className="flex space-x-2">
            <input
              type="text"
              placeholder={`Feature ${index + 1}`}
              value={item}
              onChange={(e) => handleListChange(index, e.target.value)}
              className="flex-1 border rounded px-2 py-1"
            />
            <button
              type="button"
              onClick={() => removeListItem(index)}
              className="bg-red-500 text-white px-2 rounded"
            >
              &times;
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={addListItem}
        className="mt-2 bg-indigo-600 text-white px-4 py-1 rounded"
      >
        Add Feature
      </button>
    </div>
  );
};

// Reusable component for handling dynamic lists of strings (e.g., Sizes, Material & Washing)
const DynamicStringInputList = ({ label, items, setItems }) => {
  const handleItemChange = (index, value) => {
    const newItems = [...items];
    newItems[index] = value;
    setItems(newItems);
  };

  const handleAddItem = () => {
    setItems([...items, '']);
  };

  const handleRemoveItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      {items.map((item, index) => (
        <div key={index} className="flex items-center space-x-2">
          <input
            type="text"
            value={item}
            onChange={(e) => handleItemChange(index, e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm sm:text-sm"
          />
          <button
            type="button"
            onClick={() => handleRemoveItem(index)}
            className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600 focus:outline-none"
          >
            &times;
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={handleAddItem}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
      >
        Add {label.split(' ')[0]}
      </button>
    </div>
  );
};

// Component for handling the dynamic list of color objects with name and hex code
const DynamicColorInputList = ({ items, setItems }) => {
  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const handleAddItem = () => {
    setItems([...items, { name: '', hex: '' }]);
  };

  const handleRemoveItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">Colors</label>
      {items.map((item, index) => (
        <div key={index} className="flex items-center space-x-2 p-2 border border-gray-200 rounded-md">
          <input
            type="text"
            placeholder="Color Name (e.g., Red)"
            value={item.name}
            onChange={(e) => handleItemChange(index, 'name', e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm sm:text-sm"
          />
          <input
            type="text"
            placeholder="Hex Code (e.g., #FF0000)"
            value={item.hex}
            onChange={(e) => handleItemChange(index, 'hex', e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm sm:text-sm"
          />
          <button
            type="button"
            onClick={() => handleRemoveItem(index)}
            className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600 focus:outline-none"
          >
            &times;
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={handleAddItem}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
      >
        Add Color
      </button>
    </div>
  );
};

const AddProductForm = () => {
  const [formData, setFormData] = useState({
    productName: '',
    category: '', // ObjectId string
    brand: '',
    price: 0,
    discountPrice: 0,
    discountPercent: 0,
    description: '',
    stock: 0,
  });

  const [files, setFiles] = useState([]);
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [materialWashing, setMaterialWashing] = useState([]);
  const [sizeShape, setSizeShape] = useState([]);

  // New states for details and detailedDescription as objects
  const [detailsData, setDetailsData] = useState([{ key: '', value: '' }]);
  const [detailedDescriptionData, setDetailedDescriptionData] = useState({
    title: '',
    list: [''],
  });

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'number' ? Number(value) : value,
    });
  };

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();

    // Append simple fields
    for (const key in formData) {
      data.append(key, formData[key]);
    }

    // Append arrays and objects as JSON strings
    data.append('colors', JSON.stringify(colors));
    data.append('sizes', JSON.stringify(sizes));
    data.append('materialWashing', JSON.stringify(materialWashing));
    data.append('sizeShape', JSON.stringify(sizeShape));

    // Convert detailsData array of key-value pairs to object
    const detailsObj = detailsData.reduce((obj, item) => {
      if (item.key.trim()) obj[item.key.trim()] = item.value;
      return obj;
    }, {});
    data.append('details', JSON.stringify(detailsObj));

    // detailedDescriptionData is already the desired shape
    data.append('detailedDescription', JSON.stringify(detailedDescriptionData));

    // Append media files
    files.forEach((file) => {
      data.append('media', file);
    });

    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/products`, {
        method: 'POST',
        body: data,
        headers: {
          Authorization: `Bearer ${token}`, // add this line
        },
      });


      if (response.ok) {
        const result = await response.json();
        console.log('Product created successfully:', result);

        // Reset all
        setFormData({
          productName: '',
          category: '',
          brand: '',
          price: 0,
          discountPrice: 0,
          discountPercent: 0,
          description: '',
          stock: 0,
        });
        setColors([]);
        setSizes([]);
        setMaterialWashing([]);
        setSizeShape([]);
        setDetailsData([{ key: '', value: '' }]);
        setDetailedDescriptionData({ title: '', list: [''] });
        setFiles([]);

        alert('Product created successfully!');
      } else {
        const errorData = await response.json();
        console.error('Failed to create product:', errorData);
        alert('Failed to create product. Check console for details.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error submitting form. Check console.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-8 w-full max-w-2xl space-y-6">
        <h2 className="text-2xl font-bold text-gray-800 text-center">Add New Product</h2>

        {/* Main Product Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="productName" className="block text-sm font-medium text-gray-700">Product Name</label>
            <input
              type="text"
              name="productName"
              id="productName"
              value={formData.productName}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="brand" className="block text-sm font-medium text-gray-700">Brand</label>
            <input
              type="text"
              name="brand"
              id="brand"
              value={formData.brand}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm sm:text-sm"
            />
          </div>
        </div>

        {/* Category & Stock */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category ID</label>
            <input
              type="text"
              name="category"
              id="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="stock" className="block text-sm font-medium text-gray-700">Stock</label>
            <input
              type="number"
              name="stock"
              id="stock"
              value={formData.stock}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm sm:text-sm"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            id="description"
            rows="3"
            value={formData.description}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm sm:text-sm"
          />
        </div>

        {/* Pricing */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
            <input
              type="number"
              name="price"
              id="price"
              value={formData.price}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="discountPrice" className="block text-sm font-medium text-gray-700">Discount Price</label>
            <input
              type="number"
              name="discountPrice"
              id="discountPrice"
              value={formData.discountPrice}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="discountPercent" className="block text-sm font-medium text-gray-700">Discount Percentage</label>
            <input
              type="number"
              name="discountPercent"
              id="discountPercent"
              value={formData.discountPercent}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm sm:text-sm"
            />
          </div>
        </div>

        {/* Media Upload */}
        <div>
          <label htmlFor="media" className="block text-sm font-medium text-gray-700">Product Media</label>
          <input
            type="file"
            name="media"
            id="media"
            multiple
            onChange={handleFileChange}
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
          />
          <p className="mt-1 text-sm text-gray-500">Upload multiple images and/or videos.</p>
        </div>

        {/* Dynamic and JSON-based Fields */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-800">Product Specifications</h3>

          <DynamicColorInputList items={colors} setItems={setColors} />

          <DynamicStringInputList label="Sizes" items={sizes} setItems={setSizes} />
          <DynamicStringInputList label="Material & Washing" items={materialWashing} setItems={setMaterialWashing} />
          <DynamicStringInputList label="Size & Shape" items={sizeShape} setItems={setSizeShape} />

          <div>
            <label className="block text-sm font-medium text-gray-700">Details (key-value pairs)</label>
            <KeyValueInput data={detailsData} setData={setDetailsData} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Detailed Description</label>
            <DetailedDescriptionInput data={detailedDescriptionData} setData={setDetailedDescriptionData} />
          </div>
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Create Product
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProductForm;

