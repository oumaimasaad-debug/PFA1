"use client"

import React from "react"
import { useLocation, Route, Routes } from "react-router-dom"

// Importez directement les vues
import Login from "../../views/Login.js"
import Register from "../../views/Register.js"

// Importez le fichier CSS
import "../../assets/css/login-style.css"

function Auth() {
  const location = useLocation()

  React.useEffect(() => {
    // Ajouter la classe appropriée selon la page
    if (location.pathname.includes("login")) {
      document.body.classList.add("login-page")
    } else if (location.pathname.includes("register")) {
      document.body.classList.add("register-page")
    }

    return function cleanup() {
      document.body.classList.remove("login-page")
      document.body.classList.remove("register-page")
    }
  }, [location])

  return (
    <div className="auth-container">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Login />} />
      </Routes>
    </div>
  )
}

export default Auth
