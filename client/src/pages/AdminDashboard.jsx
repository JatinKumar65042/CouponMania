import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { BASEURL } from "../baseurl.js";
function AdminDashboard() {
    const navigate = useNavigate();
    const [couponStats, setCouponStats] = useState({ total: 0, claimed: 0, unclaimed: 0 });

    useEffect(() => {
        fetchCouponStats();
    }, []);

    const fetchCouponStats = async () => {
        try {
            const response = await fetch(`${BASEURL}/coupon/all`, {
                credentials: "include",
            });
            const data = await response.json();
            if (data.success) {
                const total = data.coupons.length;
                const claimed = data.coupons.filter((c) => c.isClaimed).length;
                const unclaimed = total - claimed;
                setCouponStats({ total, claimed, unclaimed });
            }
        } catch (error) {
            console.error("❌ Error fetching coupon stats:", error);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h2 className="text-3xl font-bold mb-6">🎟 Admin Dashboard</h2>

            {/* Coupon Stats */}
            <div className="grid grid-cols-3 gap-6 mb-6">
                <div className="p-6 bg-white shadow-lg rounded-lg text-center">
                    <h3 className="text-lg font-semibold">Total Coupons</h3>
                    <p className="text-2xl font-bold">{couponStats.total}</p>
                </div>
                <div className="p-6 bg-green-100 shadow-lg rounded-lg text-center">
                    <h3 className="text-lg font-semibold">Unclaimed</h3>
                    <p className="text-2xl font-bold">{couponStats.unclaimed}</p>
                </div>
                <div className="p-6 bg-red-100 shadow-lg rounded-lg text-center">
                    <h3 className="text-lg font-semibold">Claimed</h3>
                    <p className="text-2xl font-bold">{couponStats.claimed}</p>
                </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex space-x-4">
                <button
                    onClick={() => navigate("/admin/coupons")}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg"
                >
                    Manage Coupons
                </button>
                <button
                    onClick={() => navigate("/admin/generate-coupons")}
                    className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg"
                >
                    Generate Coupons
                </button>
            </div>
    
        </div>
    );
}

export default AdminDashboard;
