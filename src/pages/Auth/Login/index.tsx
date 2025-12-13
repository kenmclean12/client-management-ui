import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Stack, Input, Button, Typography } from "@mui/material";
import { Login, NightsStay } from "@mui/icons-material";
import { useSnackbar } from "notistack";
import {
  buttonContainerStyles,
  contentContainerStyles,
  titleContainerStyles,
} from "./styles";
import { validateLogin } from "./utils";
import { LoginRequestDto } from "../../../types";
import {
  authButtonStyles,
  authInnerContainerStyles,
  authInputStyles,
} from "../styles";
import { useAuth } from "../../../context/authContext";

export interface Errors {
  email: boolean;
  password: boolean;
}

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const [form, setForm] = useState<LoginRequestDto>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Errors>({
    email: false,
    password: false,
  });

const handleLogin = async () => {
  const error = validateLogin(form);
  if (error) {
    setErrors({
      email: error.field === "email",
      password: error.field === "password",
    });
    enqueueSnackbar(error.message, { variant: "warning" });
    return;
  }

  setErrors({ email: false, password: false });

  try {
    await login(form.email, form.password);
    navigate("/", { replace: true });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Login failed";
    enqueueSnackbar(errorMessage, { variant: "error" });
  }
};


  return (
    <Stack
      sx={{
        height: "100vh",
        width: "100vw",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Stack sx={authInnerContainerStyles}>
        <Stack sx={titleContainerStyles}>
          <Typography fontSize={24}>Login</Typography>
          <NightsStay sx={{ color: "lightblue" }} />
        </Stack>
        <Stack sx={contentContainerStyles}>
          <Input
            placeholder="Email"
            value={form.email}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                email: e.target.value,
              }))
            }
            sx={{
              ...authInputStyles,
              border: errors.email ? "2px solid lightblue" : "1px solid #ccc",
            }}
            fullWidth
            disableUnderline
          />
          <Input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, password: e.target.value }))
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleLogin();
              }
            }}
            sx={{
              ...authInputStyles,
              border: errors.password
                ? "2px solid lightblue"
                : "1px solid #ccc",
            }}
            fullWidth
            disableUnderline
          />
        </Stack>
        <Stack sx={buttonContainerStyles}>
          <Button
            variant="contained"
            onClick={handleLogin}
            sx={authButtonStyles}
          >
            Login
            <Login style={{ height: 16 }} />
          </Button>
          <Typography align="center" fontSize={12}>
            Don't have an account?{" "}
            <Link to="/register" style={{ color: "lightblue" }}>
              Register
            </Link>
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  );
}
