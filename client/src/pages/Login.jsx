import { useState } from "react";
import { useNavigate } from "react-router";
import { BASEURL } from "../baseurl.js";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await fetch(`${BASEURL}/user/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
                credentials: "include", // Ensures cookies (JWT) are sent
            });

            const data = await response.json();
            if (data.success) {
                localStorage.setItem("user", JSON.stringify(data.user)); // Store user data
                navigate("/"); // ✅ Redirect to Home Page
                window.location.reload(); // Refresh to update UI
            } else {
                setMessage(data.message);
            }
        } catch (error) {
            setMessage("❌ Login failed. Try again.");
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-96">
                <h2 className="text-2xl font-bold text-center mb-4">Login</h2>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2 border rounded-lg mb-3 focus:ring focus:ring-blue-200"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-2 border rounded-lg mb-3 focus:ring focus:ring-blue-200"
                />
                <button
                    onClick={handleLogin}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg"
                >
                    Login
                </button>
                {message && <p className="text-red-500 mt-3 text-center">{message}</p>}
            </div>
        </div>
    );
}

export default Login;
