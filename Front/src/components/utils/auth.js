// Fonctions d'authentification centralisées

// Vérifier si l'utilisateur est authentifié
export const isAuthenticated = () => {
    return localStorage.getItem("authToken") !== null
  }
  
  // Connecter l'utilisateur
  export const login = (token, email) => {
    localStorage.setItem("authToken", token)
    localStorage.setItem("currentUserEmail", email)
  }
  
  // Déconnecter l'utilisateur
  export const logout = () => {
    localStorage.removeItem("authToken")
    localStorage.removeItem("currentUserEmail")
  }
  
  // Obtenir le token d'authentification
  export const getToken = () => {
    return localStorage.getItem("authToken")
  }
  
  // Obtenir l'email de l'utilisateur connecté
  export const getCurrentUserEmail = () => {
    return localStorage.getItem("currentUserEmail")
  }
  
  // Obtenir les informations de l'utilisateur connecté
  export const getCurrentUser = () => {
    const email = getCurrentUserEmail()
    if (!email) return null
  
    const users = JSON.parse(localStorage.getItem("users")) || []
    return users.find((user) => user.email === email) || null
  }
  
  // Mettre à jour les informations de l'utilisateur
  export const updateCurrentUser = (userData) => {
    const email = getCurrentUserEmail()
    if (!email) return false
  
    const users = JSON.parse(localStorage.getItem("users")) || []
    const updatedUsers = users.map((user) => {
      if (user.email === email) {
        return { ...user, ...userData }
      }
      return user
    })
  
    localStorage.setItem("users", JSON.stringify(updatedUsers))
    return true
  }
  