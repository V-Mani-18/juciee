import {
  Button,
  TextField,
  Link,
  Grid,
  Box,
  Typography,
  Container,
  Paper,
  IconButton,
  InputAdornment,
} from "@mui/material";
import React, { useState } from "react";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useNavigate } from "react-router-dom";
import { Link as RouterLink } from "react-router-dom";
import AnimatedTitle from "./AnimatedTitle";
import "@fontsource/pacifico"; // Import Pacifico font
function SignInPage() {
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handlePasswordChange = (e) => {
    const inputValue = e.target.value;
    const previousMasked = "❤️".repeat(password.length);
    const newMasked = inputValue;

    if (newMasked.length < previousMasked.length) {
      // User deleted a character
      setPassword(password.slice(0, -1));
    } else {
      // User added a character
      const addedChar = inputValue.replaceAll("❤️", "")[0] || "";
      setPassword(password + addedChar);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = data.get("email");

    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (response.ok) {
        alert(result.message); // "Login successful"
        navigate("/chat");
      } else {
        alert(result.message); // Error from backend
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Server error. Try again.");
    }
  };


  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#fef6f7",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Container component="main" maxWidth="xs">
        <Paper
          elevation={3}
          sx={{
            padding: 3,
            borderRadius: 3,
            bgcolor: "#fff",
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <AnimatedTitle sx={{ mb: 1 }} />
            <Typography
              component="h1"
              variant="h4"
              sx={{ mt: 2, fontWeight: "bold" }}
            >
              Welcome
            </Typography>

            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                name="email"
                label="Username or Email"
                autoComplete="email"
                autoFocus
                sx={{
                  backgroundColor: "#f4dddd",
                  borderRadius: 1,
                }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="text"
                value={showPassword ? password : "❤️".repeat(password.length)}
                onChange={handlePasswordChange}
                sx={{
                  backgroundColor: "#f4dddd",
                  borderRadius: 1,
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleClickShowPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Grid item xs={12}>
                <Link href="#" variant="body2" sx={{ color: "#a94442" }}>
                  Forgot password?
                </Link>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  mt: 3,
                  mb: 2,
                  bgcolor: "#ef1c1c",
                  "&:hover": { bgcolor: "#cc1818" },
                  borderRadius: 5,
                  textTransform: "none",
                  fontWeight: "bold",
                }}
              >
                Sign In
              </Button>
              <Grid container justifyContent="center">
                <Grid item>
                  <Typography variant="body2">
                    New User?{" "}
                    <Link component={RouterLink} to="/signup" variant="body2">
                      Sign Up
                    </Link>
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default SignInPage;