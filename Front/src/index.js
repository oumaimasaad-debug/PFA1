import ReactDOM from "react-dom/client"
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom"

import AdminLayout from "./layouts/Admin/Admin.js"
import AuthLayout from "./layouts/Auth/Auth.js"

import "./assets/scss/black-dashboard-react.scss"
import "./assets/demo/demo.css"
import "./assets/css/nucleo-icons.css"
import "@fortawesome/fontawesome-free/css/all.min.css"

import ThemeContextWrapper from "./components/ThemeWrapper/ThemeWrapper"
import BackgroundColorWrapper from "./components/BackgroundColorWrapper/BackgroundColorWrapper"


const isAuthenticated = () => {
  return localStorage.getItem("authToken") !== null
}

const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/auth/login" replace />
  }
  return children
}

const root = ReactDOM.createRoot(document.getElementById("root"))

root.render(
  <ThemeContextWrapper>
    <BackgroundColorWrapper>
      <BrowserRouter>
        <Routes>
          <Route path="/auth/*" element={<AuthLayout />} />
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          />
          <Route
            path="*"
            element={
              isAuthenticated() ? <Navigate to="/admin/dashboard" replace /> : <Navigate to="/auth/login" replace />
            }
          />
        </Routes>
      </BrowserRouter>
    </BackgroundColorWrapper>
  </ThemeContextWrapper>,
)
