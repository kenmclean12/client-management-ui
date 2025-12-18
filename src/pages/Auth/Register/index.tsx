/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Stack, Input, Button, Typography } from "@mui/material";
import { ArrowBackIos, ArrowForwardIos, Check } from "@mui/icons-material";
import {
  contentContainerStyles,
  buttonContainerStyles,
  buttonInnerContainerStyles,
  mainContainerStyles,
} from "./styles";
import { useSnackbar } from "notistack";
import { FormErrors, Step } from "./types";
import { UserCreateDto } from "../../../types";
import { previousStep, update, validateStep } from "./utils";
import { stepFields } from "./config";
import { authInnerContainerStyles, authInputStyles } from "../styles";
import { useAuth } from "../../../context";
import { dialogButtonStyles } from "../../styles";

export function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const [params] = useSearchParams();
  const token = params.get("invite");
  const emailParam = params.get("email");

  const [step, setStep] = useState<Step>(Step.One);
  const [form, setForm] = useState<UserCreateDto>({
    firstName: "",
    lastName: "",
    email: "",
    userName: "",
    password: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (!token) {
      enqueueSnackbar("Registration requires a valid invite", {
        variant: "error",
      });
      navigate("/login", { replace: true });
      return;
    }

    if (emailParam) {
      setForm((f) => ({ ...f, email: emailParam }));
    }
  }, [token, emailParam, navigate, enqueueSnackbar]);

  const handleNext = () => {
    const validationErrors = validateStep(step, form);
    if (validationErrors) {
      enqueueSnackbar(Object.values(validationErrors)[0]!, {
        variant: "warning",
      });
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setStep(step + 1);
  };

  const handleRegister = async () => {
    if (!token) return;
    if (Object.keys(errors).length) return;
    await register(form);
    navigate("/", { replace: true });
  };

  const renderField = (field: {
    key: keyof UserCreateDto;
    placeholder: string;
    type?: string;
  }) => {
    const value = form[field.key] ?? "";

    return (
      <Input
        key={field.key}
        placeholder={field.placeholder}
        value={value}
        type={field.type}
        onChange={(e) => {
          if (field.key !== 'email') {
            update(field.key, e.target.value, setForm) 
          }
        }}
        sx={{
          ...authInputStyles,
          opacity: field.key === "email" ? 0.6 : 1,
          border: errors[field.key as keyof FormErrors]
            ? "1px solid red"
            : "1px solid #444",
        }}
        fullWidth
        disableUnderline
      />
    );
  };

  return (
    <Stack sx={mainContainerStyles}>
      <Stack sx={authInnerContainerStyles}>
        <Typography fontSize={24} color="white">
          Register
        </Typography>
        <Stack sx={contentContainerStyles}>
          {stepFields[step].map(renderField)}
        </Stack>
        <Stack sx={buttonContainerStyles}>
          <Stack sx={buttonInnerContainerStyles}>
            {step !== Step.One && (
              <Button
                onClick={() => setStep(previousStep(step))}
                sx={{ ...dialogButtonStyles, mx: 0 }}
                fullWidth
              >
                <ArrowBackIos sx={{ height: 15 }} /> Back
              </Button>
            )}
            {step === Step.Two ? (
              <Button
                onClick={handleRegister}
                sx={{ ...dialogButtonStyles, mx: 0 }}
                fullWidth
              >
                Register <Check sx={{ height: 15 }} />
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                sx={{ ...dialogButtonStyles, mx: 0 }}
                fullWidth
              >
                Next <ArrowForwardIos sx={{ height: 15 }} />
              </Button>
            )}
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
}
