import { useState } from "react";
import { useNavigate } from "react-router";
import { BASEURL } from "../baseurl.js";
function Register() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [secretKey, setSecretKey] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleRegister = async () => {
        try {
            const response = await fetch(`${BASEURL}/user/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, email, password, secretKey }),
            });

            const data = await response.json();
            if (data.success) {
                setMessage("✅ Registration successful! Redirecting...");
                setTimeout(() => navigate("/login"), 2000); // Redirect to login page after success
            } else {
                setMessage(data.message);
            }
        } catch (error) {
            setMessage("❌ Registration failed. Try again.");
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-96">
                <h2 className="text-2xl font-bold text-center mb-4">Register</h2>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full p-2 border rounded-lg mb-3 focus:ring focus:ring-blue-200"
                />
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
                <input
                    type="text"
                    placeholder="Secret Key (For Admins)"
                    value={secretKey}
                    onChange={(e) => setSecretKey(e.target.value)}
                    className="w-full p-2 border rounded-lg mb-3 focus:ring focus:ring-blue-200"
                />
                <span className="text-red-500"> * If you are not registering as admin type anything in Secret Key</span>
                <button
                    onClick={handleRegister}
                    className="w-full bg-green-500 hover:bg-green-600 text-white p-2 rounded-lg"
                >
                    Register
                </button>
                {message && <p className="text-red-500 mt-3 text-center">{message}</p>}
            </div>
        </div>
    );
}

export default Register;
