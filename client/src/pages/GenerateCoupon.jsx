import { useState } from "react";
import { BASEURL } from "../baseurl.js";
function GenerateCoupons() {
    const [numCoupons, setNumCoupons] = useState("");
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const generateCoupons = async () => {
        if (!numCoupons || numCoupons <= 0) {
            setMessage("❌ Please enter a valid number of coupons.");
            return;
        }

        setIsLoading(true);
        setMessage("");

        try {
            const response = await fetch(`${BASEURL}/coupon/generate`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include", // Ensures admin authentication
                body: JSON.stringify({ numberOfCoupons: parseInt(numCoupons) }),
            });

            const data = await response.json();
            if (data.success) {
                setMessage(`✅ ${numCoupons} coupons generated successfully!`);
                setNumCoupons(""); // Reset input field
            } else {
                setMessage(data.message);
            }
        } catch (error) {
            setMessage("❌ Error generating coupons. Try again.");
        }
        setIsLoading(false);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
            <h2 className="text-3xl font-bold mb-6">🎟 Generate Coupons</h2>

            <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center">
                <input
                    type="number"
                    placeholder="Enter number of coupons"
                    value={numCoupons}
                    onChange={(e) => setNumCoupons(e.target.value)}
                    className="w-full p-3 border rounded-lg mb-4 focus:ring focus:ring-blue-200"
                />
                <button
                    onClick={generateCoupons}
                    disabled={isLoading}
                    className={`w-full bg-green-500 hover:bg-green-600 text-white p-3 rounded-lg ${
                        isLoading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                >
                    {isLoading ? "Generating..." : "Generate Coupons"}
                </button>

                {message && <p className="mt-4 text-gray-700">{message}</p>}
            </div>
        </div>
    );
}

export default GenerateCoupons;
