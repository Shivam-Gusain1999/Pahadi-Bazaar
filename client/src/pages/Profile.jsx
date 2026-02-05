import React, { useState, useEffect } from "react";
import { useAppContext } from "../context/AppContext";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const Profile = () => {
    const { axios, navigate, user, setUser, currency, setShowUserLogin } = useAppContext();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState("profile");
    const [profile, setProfile] = useState({ name: "", email: "", phone: "" });
    const [passwords, setPasswords] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        if (user) {
            fetchProfile();
            fetchOrders();
        } else {
            setLoading(false);
        }
    }, [user]);

    // Show login prompt if not logged in
    if (!user) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
                <div className="text-6xl mb-4">👤</div>
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-2">Login to View Profile</h2>
                <p className="text-gray-500 dark:text-gray-400 mb-6">Please login to access your profile and orders</p>
                <button
                    onClick={() => setShowUserLogin(true)}
                    className="px-8 py-3 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white rounded-full transition shadow-lg hover:shadow-green-500/30 font-medium"
                >
                    Login Now
                </button>
            </div>
        );
    }

    const fetchProfile = async () => {
        try {
            const { data } = await axios.get("/api/user/profile");
            if (data.success) {
                setProfile({
                    name: data.data.user.name || "",
                    email: data.data.user.email || "",
                    phone: data.data.user.phone || "",
                });
            }
        } catch (error) {
            toast.error("Failed to load profile");
        } finally {
            setLoading(false);
        }
    };

    const fetchOrders = async () => {
        try {
            const { data } = await axios.get("/api/order/user");
            if (data.success) {
                setOrders(data.data.orders || []);
            }
        } catch (error) {
            console.error("Failed to fetch orders");
        }
    };

    const updateProfile = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const { data } = await axios.put("/api/user/profile", {
                name: profile.name,
                phone: profile.phone,
            });
            if (data.success) {
                toast.success("Profile updated!");
                setUser({ ...user, name: profile.name });
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update");
        } finally {
            setSaving(false);
        }
    };

    const changePassword = async (e) => {
        e.preventDefault();
        if (passwords.newPassword !== passwords.confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }
        if (passwords.newPassword.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }
        setSaving(true);
        try {
            const { data } = await axios.put("/api/user/change-password", {
                currentPassword: passwords.currentPassword,
                newPassword: passwords.newPassword,
            });
            if (data.success) {
                toast.success("Password changed!");
                setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to change password");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full"></div>
            </div>
        );
    }

    return (
        <div className="py-10 max-w-4xl mx-auto">
            <h1 className="text-2xl md:text-3xl font-semibold text-gray-800 dark:text-white mb-8">👤 My Profile</h1>

            {/* Tabs */}
            <div className="flex gap-4 border-b border-gray-200 dark:border-gray-700 mb-8">
                {["profile", "orders", "security"].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`pb-3 px-4 font-medium capitalize transition ${activeTab === tab
                            ? "text-green-600 border-b-2 border-green-600"
                            : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            }`}
                    >
                        {tab === "security" ? "🔒 Security" : tab === "orders" ? "📦 Orders" : "👤 Profile"}
                    </button>
                ))}
            </div>

            {/* Profile Tab */}
            {activeTab === "profile" && (
                <form onSubmit={updateProfile} className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                    <div className="grid gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                            <input
                                type="text"
                                value={profile.name}
                                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                            <input
                                type="email"
                                value={profile.email}
                                disabled
                                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label>
                            <input
                                type="tel"
                                value={profile.phone}
                                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                placeholder="+91 98765 43210"
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 dark:text-white"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={saving}
                            className="w-full py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 transition"
                        >
                            {saving ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </form>
            )}

            {/* Orders Tab */}
            {activeTab === "orders" && (
                <div className="space-y-4">
                    {orders.length === 0 ? (
                        <div className="text-center py-10 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                            <div className="text-5xl mb-4">📦</div>
                            <p className="text-gray-500 dark:text-gray-400">No orders yet</p>
                            <Link to="/products" className="text-green-600 hover:underline mt-2 inline-block">
                                Start Shopping
                            </Link>
                        </div>
                    ) : (
                        orders.slice(0, 5).map((order) => (
                            <div key={order._id} className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Order #{order._id.slice(-8)}</p>
                                        <p className="font-medium text-gray-800 dark:text-white">{currency}{order.amount}</p>
                                    </div>
                                    <span className={`px-3 py-1 text-xs rounded-full ${order.status === "Delivered" ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400" : "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400"
                                        }`}>
                                        {order.status}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {order.items?.length} items • {new Date(order.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        ))
                    )}
                    {orders.length > 5 && (
                        <Link to="/my-orders" className="block text-center text-green-600 hover:underline">
                            View All Orders →
                        </Link>
                    )}
                </div>
            )}

            {/* Security Tab */}
            {activeTab === "security" && (
                <form onSubmit={changePassword} className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">Change Password</h3>
                    <div className="grid gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Current Password</label>
                            <input
                                type="password"
                                value={passwords.currentPassword}
                                onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New Password</label>
                            <input
                                type="password"
                                value={passwords.newPassword}
                                onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirm New Password</label>
                            <input
                                type="password"
                                value={passwords.confirmPassword}
                                onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 dark:text-white"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={saving}
                            className="w-full py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 transition"
                        >
                            {saving ? "Changing..." : "Change Password"}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default Profile;
