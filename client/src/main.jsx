import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Resources from "./pages/Resources.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import PublicOnlyRoute from "./components/PublicOnlyRoute.jsx";
import ResourceDetail from "./pages/ResourceDetail.jsx";
import Collections from "./pages/Collections.jsx";
import CollectionDetail from "./pages/CollectionDetail.jsx";
import Library from "./pages/Library.jsx";
import Dashboard from "./pages/Dashboard.jsx";
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
                <Dashboard />
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
          <Route
            path="collections"
            element={
              <PrivateRoute>
                <Collections />
              </PrivateRoute>
            }
          />
          <Route path="collections/:id" element={<CollectionDetail />} />
          <Route path="library" element={<Library />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
