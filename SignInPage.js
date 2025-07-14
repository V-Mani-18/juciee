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
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Slide from "@mui/material/Slide";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function SignInPage() {
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [popup, setPopup] = useState({
    open: false,
    success: false,
    message: "",
  });

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

  const showPopup = (success, message) => {
    setPopup({ open: true, success, message });
    setTimeout(() => setPopup((p) => ({ ...p, open: false })), 2000);
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
        localStorage.setItem('userId', result.user._id);
        showPopup(true, result.message || "Login successful!");
        setTimeout(() => navigate("/chat"), 2000);
      } else {
        showPopup(false, result.message || "Invalid credentials.");
      }
    } catch (err) {
      console.error("Login error:", err);
      showPopup(false, "Server error. Try again.");
    }
  };

  return (
    <>
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
      <Dialog
        open={popup.open}
        TransitionComponent={Transition}
        keepMounted
        PaperProps={{
          sx: {
            position: "fixed",
            bottom: 32,
            left: "44%",
            transform: "translateX(-50%)",
            bgcolor: "#fff",
            borderRadius: 3,
            minWidth: 320,
            boxShadow: 6,
            display: "flex",
            alignItems: "center",
            px: 3,
            py: 2,
          },
        }}
        hideBackdrop
      >
        <DialogContent sx={{ display: "flex", alignItems: "center", gap: 2, p: 0 }}>
          {popup.success ? (
            <CheckCircleRoundedIcon sx={{ color: "#1ecb4f", fontSize: 40 }} />
          ) : (
            <CancelRoundedIcon sx={{ color: "#ef1c1c", fontSize: 40 }} />
          )}
          <Typography
            variant="subtitle1"
            sx={{
              color: popup.success ? "#1ecb4f" : "#ef1c1c",
              fontWeight: "bold",
              fontFamily: "Pacifico, cursive",
              letterSpacing: 1,
            }}
          >
            {popup.message}
          </Typography>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default SignInPage;
