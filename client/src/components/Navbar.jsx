import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router"; // ✅ Fix import
import { BASEURL } from "../baseurl";

function Navbar() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        setUser(storedUser);
    }, []);

    const logout = async () => {
        try {
            await fetch(`${BASEURL}/user/logout`, {
                method: "GET",
                credentials: "include", // ✅ Ensures cookies are cleared
            });

            localStorage.removeItem("user"); // ✅ Clear local storage
            setUser(null); // ✅ Update state to trigger re-render
            navigate("/"); // ✅ Redirect to Home Page
        } catch (error) {
            console.error("❌ Error logging out:", error);
        }
    };

    return (
        <nav className="bg-blue-600 text-white p-4">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="text-xl font-bold">CouponMania</Link>

                <div className="flex space-x-4">
                    {user ? (
                        <button
                            onClick={logout}
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                        >
                            Logout
                        </button>
                    ) : (
                        <>
                            <Link to="/login" className="hover:underline">Login</Link>
                            <Link to="/register" className="hover:underline">Register</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
