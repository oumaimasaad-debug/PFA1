"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardBody, Form, Input, Button, Row, Col } from "reactstrap"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faFacebookF, faTwitter, faGoogle } from "@fortawesome/free-brands-svg-icons"

// Importez le fichier CSS
import "../assets/css/login-style.css"

function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()

    // Récupérer les utilisateurs stockés
    const storedUsers = JSON.parse(localStorage.getItem("users")) || []
    const user = storedUsers.find((user) => user.email === email)

    if (user && user.password === password) {
      // Si l'utilisateur est trouvé et le mot de passe correspond, se connecter
      localStorage.setItem("authToken", "fake-token")
      navigate("/admin/dashboard")
    } else {
      // Si l'utilisateur n'existe pas ou mot de passe incorrect
      setError("Email ou mot de passe incorrect")

      if (!user) {
        setError("Cet email n'est pas enregistré. Redirection vers l'inscription...")
        setTimeout(() => {
          navigate("/auth/register") // Rediriger vers la page d'inscription
        }, 2000)
      }
    }
  }

  return (
    <div className="auth-wrapper">
      <div className="container">
        <Row className="justify-content-center">
          <Col xs="12" sm="10" md="8" lg="6" xl="5">
            <Card className="auth-card">
              <CardBody className="auth-card-body">
                <h2 className="auth-title">Login</h2>
                <p className="auth-subtitle"></p>

                {error && <div className="text-danger text-center mb-3">{error}</div>}

                <Form onSubmit={handleSubmit}>
                  <Input
                    className="auth-input"
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <Input
                    className="auth-input"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />

                  <div className="text-center mb-3">
                    <a href="#!" className="auth-link">
                     
                    </a>
                  </div>

                  <div className="text-center">
                    <Button className="auth-btn" type="submit">
                      Login
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
                      Don't have an account?{" "}
                      <a
                        href="#!"
                        className="auth-link auth-link-bold"
                        onClick={(e) => {
                          e.preventDefault()
                          navigate("/auth/register")
                        }}
                      >
                        Sign Up
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

export default Login