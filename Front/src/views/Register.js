"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardBody, Form, Input, Button, Row, Col } from "reactstrap"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faFacebookF, faTwitter, faGoogle } from "@fortawesome/free-brands-svg-icons"

// Importez le fichier CSS
import "../assets/css/login-style.css"

function Register() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    setError("")

    // Vérifier si les mots de passe correspondent
    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas")
      return
    }

    // Récupérer les utilisateurs existants
    const storedUsers = JSON.parse(localStorage.getItem("users")) || []

    // Vérifier si l'email existe déjà
    if (storedUsers.some((user) => user.email === formData.email)) {
      setError("Cet email est déjà enregistré")
      return
    }

    // Ajouter le nouvel utilisateur
    const newUser = {
      email: formData.email,
      password: formData.password,
    }

    storedUsers.push(newUser)
    localStorage.setItem("users", JSON.stringify(storedUsers))

    // Rediriger vers la page de connexion
    alert("Inscription réussie! Vous pouvez maintenant vous connecter.")
    navigate("/auth/login")
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="auth-wrapper">
      <div className="container">
        <Row className="justify-content-center">
          <Col xs="12" sm="10" md="8" lg="6" xl="5">
            <Card className="auth-card">
              <CardBody className="auth-card-body">
                <h2 className="auth-title">Sign Up</h2>
                <p className="auth-subtitle"></p>

                {error && <div className="text-danger text-center mb-3">{error}</div>}

                <Form onSubmit={handleSubmit}>
                  <Input
                    className="auth-input"
                    type="email"
                    name="email"
                    placeholder="Email address"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                  <Input
                    className="auth-input"
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <Input
                    className="auth-input"
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />

                  <div className="text-center">
                    <Button className="auth-btn" type="submit">
                      Sign Up
                    </Button>
                  </div>

                  <div className="social-icons">
                    <a href="#!" className="social-icon">
                      <FontAwesomeIcon icon={faFacebookF} />
                    </a>
                    <a href="#!" className="social-icon">
                      <FontAwesomeIcon icon={faTwitter} />
                    </a>
                    <a href="#!" className="social-icon">
                      <FontAwesomeIcon icon={faGoogle} />
                    </a>
                  </div>

                  <div className="auth-footer">
                    <p>
                      Already have an account?{" "}
                      <a
                        href="#!"
                        className="auth-link auth-link-bold"
                        onClick={(e) => {
                          e.preventDefault()
                          navigate("/auth/login")
                        }}
                      >
                        Login
                      </a>
                    </p>
                  </div>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  )
}

export default Register
