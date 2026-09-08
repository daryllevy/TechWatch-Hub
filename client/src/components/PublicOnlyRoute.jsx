import { Navigate } from "react-router-dom";

function PublicOnlyRoute({ children }) {
  const token = localStorage.getItem("token");

  if (token) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default PublicOnlyRoute;
