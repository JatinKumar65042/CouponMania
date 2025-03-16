import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { BASEURL } from "../baseurl.js";


function Home() {
    const [message, setMessage] = useState("");
    const [couponCode, setCouponCode] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Check localStorage for user details
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);
            } catch (error) {
                console.error("❌ Error parsing user data:", error);
            }
        }
    }, []);

    const claimCoupon = async () => {
        setIsLoading(true);
        setMessage("");
        try {
            const response = await fetch(`${BASEURL}/coupon/claim`, {
                method: "POST",
                credentials: "include", // Ensures cookies (JWT) are sent
            });

            const data = await response.json();
            if (data.success) {
                setCouponCode(data.coupon.code);
                setMessage(data.message);
            } else {
                setMessage(data.message);
            }
        } catch (error) {
            setMessage("❌ Error claiming coupon. Try again later.");
        }
        setIsLoading(false);
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <h2 className="text-3xl font-bold mb-6">🎟 Claim Your Coupon</h2>
            
            <button
                onClick={claimCoupon}
                disabled={isLoading}
                className={`bg-green-500 hover:bg-green-600 text-white p-3 rounded-lg ${
                    isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
            >
                {isLoading ? "Processing..." : "Claim Coupon"}
            </button>

            {message && <p className="text-red-500 mt-4">{message}</p>}

            {couponCode && (
                <div className="mt-5 p-4 bg-white shadow-md rounded-lg text-center">
                    <h3 className="text-xl font-bold">🎉 Your Coupon Code:</h3>
                    <p className="text-green-600 font-semibold text-lg">{couponCode}</p>
                </div>
            )}

            {/* Show "Admin Dashboard" Button for Admins */}
            {user && user?.role === "ADMIN" && (
                <button
                    onClick={() => navigate("/admin/dashboard")}
                    className="mt-6 bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-lg"
                >
                    Go to Admin Dashboard
                </button>
            )}
        </div>
    );
}

export default Home;
