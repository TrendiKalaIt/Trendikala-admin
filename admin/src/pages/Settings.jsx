import React, { useState, useEffect } from "react";
import { Pencil } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("general");
  const [editingField, setEditingField] = useState(null);
  const [formData, setFormData] = useState({});
  const [allUsers, setAllUsers] = useState([]);
  const [passwords, setPasswords] = useState({});  // userId => newPassword
  const [loadingIds, setLoadingIds] = useState([]); // loading for each user password change

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admins/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (res.ok) {
          setFormData({
            name: data.name,
            email: data.email,
            phone: data.phone || "",
            role: data.role,
          });
        }
      } catch (err) {
        console.error("Failed to load profile:", err);
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    const fetchAllAdmins = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admins`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (res.ok) {
          setAllUsers(data);
        } else {
          console.error("Failed to fetch admin users:", data.message);
        }
      } catch (err) {
        console.error("Error fetching admin users:", err);
      }
    };

    if (formData?.role?.toLowerCase() === "superadmin") {
      fetchAllAdmins();
    }
  }, [formData.role]);

  const handleEditClick = (field) => setEditingField(field);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone" && (!/^\d*$/.test(value) || value.length > 10)) return;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async () => {
    if (editingField === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        toast.error("Invalid email format");
        return;
      }
    }

    if (editingField === "phone" && formData.phone.length !== 10) {
       toast.error("Phone number must be exactly 10 digits");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admins/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setFormData({
          name: data.name,
          email: data.email,
          phone: data.phone || "",
          role: data.role,
        });
        toast.success("Profile updated successfully");
      } else {
        toast.error(data.message || "Failed to update profile");
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      toast.error(data.message || "Something went wrong");
    }

    setEditingField(null);
  };

  const handlePasswordChange = (userId, value) => {
    setPasswords(prev => ({ ...prev, [userId]: value }));
  };

  const handleChangePasswordSubmit = async (userId) => {
    const newPassword = passwords[userId];
    if (!newPassword || newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      setLoadingIds(prev => [...prev, userId]);

      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admins/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId,
          newPassword,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Password changed successfully for user");
        setPasswords(prev => ({ ...prev, [userId]: "" }));
      } else {
        toast.error(data.message || "Failed to change password");
      }
    } catch (err) {
      console.error("Error changing password:", err);
      toast.error(data.message || "Something went wrong");
    } finally {
      setLoadingIds(prev => prev.filter(id => id !== userId));
    }
  };

  return (
    <div className="p-2 bg-[#f0f5eb] min-h-screen">
      <ToastContainer />
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
                Users Details
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
                  <h2>User Profile</h2>
                </div>
              </div>

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
                      <th className="p-2 border">Role</th>
                      <th className="p-2 border">Change Password</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allUsers.map((user) => (
                      <tr key={user._id} className="hover:bg-gray-50">
                        <td className="p-2 border">{user.name}</td>
                        <td className="p-2 border">{user.email}</td>
                        <td className="p-2 border">{user.role}</td>
                        <td className="p-2 border-b border-t flex">
                          <input
                            type="password"
                            placeholder="New Password"
                            value={passwords[user._id] || ""}
                            onChange={(e) => handlePasswordChange(user._id, e.target.value)}
                            className="border px-2 py-3  mr-2 rounded"
                            disabled={loadingIds.includes(user._id)}
                          />
                          <button
                            onClick={() => handleChangePasswordSubmit(user._id)}
                            disabled={loadingIds.includes(user._id)}
                            className="bg-green-600 text-white px-3 py-1 rounded disabled:opacity-50"
                          >
                            Change
                          </button>
                        </td>
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
