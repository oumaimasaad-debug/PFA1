import { useState, useEffect } from 'react';
import { TextField, Button, Typography, Box, Paper } from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const [existingUsers, setExistingUsers] = useState([]);

  useEffect(() => {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    setExistingUsers(users);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const existingUser = existingUsers.find((user) => user.email === email);

    if (existingUser) {
      setError("L'email existe déjà.");
    } else {
      if (password === confirmPassword) {
        const newUser = { email, password };
        const updatedUsers = [...existingUsers, newUser];

        localStorage.setItem('users', JSON.stringify(updatedUsers));

        alert('Inscription réussie');
        navigate('/');  // Rediriger vers la page de connexion
      } else {
        setError('Les mots de passe ne correspondent pas');
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="flex justify-center items-center h-screen bg-gray-100"
    >
      <Paper className="p-8 w-96">
        <Typography variant="h5" className="mb-4 text-center">S'inscrire</Typography>
        <form onSubmit={handleSubmit}>
          <Box className="space-y-4">
            <TextField
              label="Email"
              fullWidth
              type="email"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              label="Mot de passe"
              fullWidth
              type="password"
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <TextField
              label="Confirmer le mot de passe"
              fullWidth
              type="password"
              variant="outlined"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {error && (
              <Typography variant="body2" color="error" align="center">
                {error}
              </Typography>
            )}
            <Button
              variant="contained"
              color="primary"
              fullWidth
              type="submit"
            >
              S'inscrire
            </Button>
          </Box>
        </form>
      </Paper>
    </motion.div>
  );
};

export default SignUp;
