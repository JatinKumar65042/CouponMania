import { Navigate } from "react-router";

const ProtectedRoute = ({ user, children }) => {
    if (!user || user.role !== "ADMIN") {
        return <Navigate to="/login" replace />;
    }
    return children;
};

export default ProtectedRoute;