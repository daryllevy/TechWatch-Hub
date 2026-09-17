import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import App from "./App.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Resources from "./pages/Resources.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import PublicOnlyRoute from "./components/PublicOnlyRoute.jsx";
import ResourceDetail from "./pages/ResourceDetail.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route
          path="login"
          element={
            <PublicOnlyRoute>
              <Login />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="register"
          element={
            <PublicOnlyRoute>
              <Register />
            </PublicOnlyRoute>
          }
        />
        <Route path="/" element={<App />}>
          <Route
            index
            element={
              <PrivateRoute>
                <Navigate to="/resources" replace />
              </PrivateRoute>
            }
          />
          <Route
            path="resources"
            element={
              <PrivateRoute>
                <Resources />
              </PrivateRoute>
            }
          />
          <Route
            path="resources/:id"
            element={
              <PrivateRoute>
                <ResourceDetail />
              </PrivateRoute>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
