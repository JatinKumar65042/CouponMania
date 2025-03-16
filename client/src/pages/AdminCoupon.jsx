import { useEffect, useState } from "react";
import { BASEURL } from "../baseurl.js";

function AdminCoupons() {
    const [coupons, setCoupons] = useState([]);
    const [filter, setFilter] = useState("all");
    const [message, setMessage] = useState("");

    useEffect(() => {
        fetchCoupons();
    }, [filter]);

    const fetchCoupons = async () => {
        try {
            let url = `${BASEURL}/coupon/`;
            if (filter === "unclaimed") url += "unclaimed";
            else if (filter === "claimed") url += "claimed";
            else url += "all";

            const response = await fetch(url, { credentials: "include" });
            const data = await response.json();
            if (data.success) {
                setCoupons(data.coupons);
            } else {
                setMessage(data.message);
            }
        } catch (error) {
            setMessage("❌ Error fetching coupons.");
        }
    };

    const toggleAvailability = async (couponId, isActive) => {
        try {
            const response = await fetch(`${BASEURL}/coupon/toggle-availability`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ couponId, isActive }),
            });
    
            const data = await response.json();
            if (data.success) {
                setCoupons((prevCoupons) =>
                    prevCoupons.map((coupon) =>
                        coupon._id === couponId ? { ...coupon, isActive } : coupon
                    )
                );
            } else {
                setMessage(data.message);
            }
        } catch (error) {
            setMessage("❌ Error toggling coupon availability.");
        }
    };

    const deleteAllCoupons = async () => {
        try {
            const response = await fetch(`${BASEURL}/coupon/delete-all`, {
                method: "DELETE",
                credentials: "include"
            });
            const data = await response.json();
            if (data.success) {
                setMessage("✅ All coupons deleted!");
                setCoupons([]);
            } else {
                setMessage(data.message);
            }
        } catch (error) {
            setMessage("❌ Error deleting coupons.");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
            <h2 className="text-3xl font-bold mb-4">🎟 Admin Coupon Management</h2>

            {/* Filter Buttons */}
            <div className="flex space-x-4 mb-6">
                <button
                    onClick={() => setFilter("all")}
                    className={`px-4 py-2 rounded-lg ${
                        filter === "all" ? "bg-blue-600 text-white" : "bg-gray-300"
                    }`}
                >
                    All Coupons
                </button>
                <button
                    onClick={() => setFilter("unclaimed")}
                    className={`px-4 py-2 rounded-lg ${
                        filter === "unclaimed" ? "bg-green-600 text-white" : "bg-gray-300"
                    }`}
                >
                    Unclaimed
                </button>
                <button
                    onClick={() => setFilter("claimed")}
                    className={`px-4 py-2 rounded-lg ${
                        filter === "claimed" ? "bg-red-600 text-white" : "bg-gray-300"
                    }`}
                >
                    Claimed
                </button>
            </div>

            {message && <p className="text-red-500 mb-4">{message}</p>}

            {/* Coupon List */}
            <div className="w-full max-w-3xl bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-bold mb-3">Coupons ({filter})</h3>
                <ul>
                    {coupons.length > 0 ? (
                        coupons.map((coupon) => (
                            <li key={coupon._id} className="p-2 border-b flex justify-between items-center">
                                <div>
                                    <span className="font-semibold">{coupon.code}</span>
                                    {coupon.isClaimed && (
                                        <span className="text-sm text-gray-500 ml-2">
                                            (Claimed by: {coupon.claimedBy})
                                        </span>
                                    )}
                                </div>

                                {/* Toggle Button */}
                                <button
                                    onClick={() => toggleAvailability(coupon._id, !coupon.isActive)}
                                    className={`px-3 py-1 rounded-lg text-white ${
                                        coupon.isActive ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600" 
                                    }`}
                                >
                                    {coupon.isActive ? "Enable" : "Disable"}
                                </button>
                            </li>
                        ))
                    ) : (
                        <p className="text-gray-500">No coupons available.</p>
                    )}
                </ul>
            </div>

            {/* Delete All Coupons */}
            <button
                onClick={deleteAllCoupons}
                className="mt-6 bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg"
            >
                Delete All Coupons
            </button>
        </div>
    );
}

export default AdminCoupons;
