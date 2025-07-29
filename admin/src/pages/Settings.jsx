import React, { useState, useEffect } from "react";
import { Pencil, Trash2, Upload } from "lucide-react";


const Settings = () => {
  const [activeTab, setActiveTab] = useState("general");
  const [editingField, setEditingField] = useState(null);
  const [formData, setFormData] = useState({});


  const [image, setImage] = useState("");
  const [newImageFile, setNewImageFile] = useState(null);
  const [allUsers, setAllUsers] = useState([]); // for superadmin

  useEffect(() => {
  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (res.ok) {
        setFormData({
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          role: data.role || "",
        });
        setImage(data.profileImage || "");
      } else {
        console.error("Failed to fetch profile:", data.message);
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
    }
  };

  fetchProfile();
}, []);

  
  useEffect(() => {
  const fetchUsers = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user/users`)
;
      const data = await res.json();
      setAllUsers(data);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    }
  };

  if (formData.role === "superadmin") {
    fetchUsers();
  }
}, [formData.role]);


  const handleEditClick = (field) => setEditingField(field);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone" && (!/^\d*$/.test(value) || value.length > 10)) return;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = () => {
    if (editingField === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        alert("Invalid email format");
        return;
      }
    }
    if (editingField === "phone" && formData.phone.length !== 10) {
      alert("Phone number must be exactly 10 digits");
      return;
    }
    setEditingField(null);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewImageFile(file);
      const imgURL = URL.createObjectURL(file);
      setImage(imgURL);
    }
  };

  const handleImageDelete = () => {
    setImage("");
    setNewImageFile(null);
  };

  const handleImageSave = async () => {
    if (!newImageFile) return alert("Please select an image to upload");

    const formDataImage = new FormData();
    formDataImage.append("profileImage", newImageFile);

    try {
      const res = await fetch("/api/upload-profile-image", {
        method: "POST",
        body: formDataImage,
      });

      const data = await res.json();
      if (res.ok) {
        setImage(data.imageUrl);
        alert("Image uploaded successfully");
        setNewImageFile(null);
      } else {
        alert("Failed to upload image");
      }
    } catch (err) {
      alert("Error uploading image");
    }
  };

  return (
    <div className="p-2 bg-[#f0f5eb] min-h-screen">
      <h1 className="text-3xl font-bold text-[#49951C] mb-6">Settings</h1>

      <div className="bg-white rounded-lg shadow p-2 grid md:grid-cols-5 gap-2">
        {/* Sidebar Tabs */}
        <div className="col-span-1 border-r">
          <div className="space-y-4">
            <button
              onClick={() => setActiveTab("general")}
              className={`w-full text-left text-lg font-semibold ${
                activeTab === "general"
                  ? "text-[#3a4d39] border-b pb-2 border-[#3a4d39]"
                  : "text-gray-600 hover:text-[#3a4d39]"
              }`}
            >
              General Settings
            </button>
            {formData.role === "superadmin" && (
              <button
                onClick={() => setActiveTab("roles")}
                className={`w-full text-left text-lg ${
                  activeTab === "roles"
                    ? "text-[#3a4d39] border-b pb-2 border-[#3a4d39]"
                    : "text-gray-600 hover:text-[#3a4d39]"
                }`}
              >
                Manage Users
              </button>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="col-span-4 p-4">
          {activeTab === "general" && (
            <>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <img
                    src={image || "https://via.placeholder.com/150"}
                    alt="Profile"
                    className="w-20 h-20 rounded-full border object-cover"
                  />
                  <div className="flex gap-2">
                    <button
                      className="p-2 bg-gray-100 rounded-full hover:bg-red-100"
                      onClick={handleImageDelete}
                    >
                      <Trash2 size={18} className="text-red-600" />
                    </button>
                    <label className="p-2 bg-gray-100 rounded-full hover:bg-green-100 cursor-pointer">
                      <Upload size={18} className="text-green-600" />
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                    </label>
                  </div>
                </div>
              </div>

              {newImageFile && (
                <button
                  onClick={handleImageSave}
                  className="mb-4 px-4 py-2 bg-[#3a4d39] text-white rounded hover:bg-[#2f3d2d]"
                >
                  Save Image
                </button>
              )}

              <div className="space-y-6">
                {[
                  { label: "Name", name: "name" },
                  { label: "Phone No", name: "phone" },
                  { label: "Email", name: "email" },
                ].map(({ label, name }) => (
                  <div
                    key={name}
                    className="flex items-center justify-between border-b pb-3"
                  >
                    <div className="w-full">
                      <p className="text-gray-500 text-sm">{label}</p>
                      {editingField === name ? (
                        <input
                          name={name}
                          value={formData[name]}
                          onChange={handleChange}
                          className="border rounded px-3 py-1 mt-1 w-full"
                        />
                      ) : (
                        <p className="font-medium text-lg">{formData[name]}</p>
                      )}
                    </div>
                    <div className="ml-4">
                      {editingField === name ? (
                        <button
                          className="text-sm text-green-600 font-medium"
                          onClick={handleSave}
                        >
                          Save
                        </button>
                      ) : (
                        <Pencil
                          size={18}
                          className="cursor-pointer text-gray-600 hover:text-black"
                          onClick={() => handleEditClick(name)}
                        />
                      )}
                    </div>
                  </div>
                ))}
                <div className="border-b pb-3">
                  <p className="text-gray-500 text-sm">User Role</p>
                  <p className="font-medium text-lg">{formData.role}</p>
                </div>
              </div>
            </>
          )}

          {activeTab === "roles" && formData.role === "superadmin" && (
            <div>
              <h2 className="text-xl font-semibold mb-4">All Users</h2>
              <div className="overflow-x-auto">
                <table className="w-full bg-white border">
                  <thead>
                    <tr className="bg-[#f0f0f0] text-left">
                      <th className="p-2 border">Name</th>
                      <th className="p-2 border">Email</th>
                      <th className="p-2 border">Phone</th>
                      <th className="p-2 border">Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allUsers.map((user, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="p-2 border">{user.name}</td>
                        <td className="p-2 border">{user.email}</td>
                        <td className="p-2 border">{user.phone}</td>
                        <td className="p-2 border">{user.role}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
