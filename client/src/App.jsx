import { BrowserRouter as Router, Route, Routes } from "react-router";

import Login from "./pages/Login.jsx";
import Navbar from "./components/Navbar.jsx";
import Register from "./pages/Register.jsx";
import Home from "./pages/Home.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import AdminCoupons from "./pages/AdminCoupon.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import GenerateCoupons from "./pages/GenerateCoupon.jsx";

const user = JSON.parse(localStorage.getItem("user"));

function App() {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element = {<Home/>} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/admin/dashboard" element={
                    <ProtectedRoute user={user}>
                        <AdminDashboard />
                    </ProtectedRoute>
                } />
                <Route path="/admin/coupons" element={
                    <ProtectedRoute user={user}>
                        <AdminCoupons />
                    </ProtectedRoute>
                } />
                <Route path="/admin/generate-coupons" element={
                    <ProtectedRoute user={user}>
                        <GenerateCoupons />
                    </ProtectedRoute>
                } />
            </Routes>
        </Router>
    );
}

export default App;
