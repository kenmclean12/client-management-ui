import { useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Stack, Input, Button, Typography, Avatar, Box } from "@mui/material";
import {
  NightsStay,
  ArrowBackIos,
  ArrowForwardIos,
  Check,
  CameraAlt,
} from "@mui/icons-material";
import {
  titleContainerStyles,
  contentContainerStyles,
  contentInnerContainerStyles,
  buttonContainerStyles,
  buttonInnerContainerStyles,
  authInputStyles,
  avatarStyles,
  avatarContainerStyles,
  cameraIconContainerStyles,
} from "./styles";
import { useSnackbar } from "notistack";
import { FormErrors, Step } from "./types";
import { UserCreateDto } from "../../../types";
import { useAuthRegister } from "../../../hooks";
import { previousStep, update, validateStep } from "./utils";
import { stepFields } from "./config";

export function RegisterPage() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [step, setStep] = useState<Step>(Step.One);
  const [form, setForm] = useState<UserCreateDto>({
    firstName: "",
    lastName: "",
    email: "",
    userName: "",
    password: "",
    avatarUrl: null,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const { mutateAsync: registerUser } = useAuthRegister();

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
    if (Object.keys(errors).length) return;

    const payload: UserCreateDto = { ...form };
    Object.keys(payload).forEach((key) => {
      const k = key as keyof UserCreateDto;
      if (payload[k] === "" || payload[k] === null) delete payload[k];
    });

    await registerUser(payload);
    navigate("/", { replace: true });
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setForm((prev) => ({ ...prev, avatarUrl: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const triggerAvatarSelect = () => inputRef.current?.click();

  const renderField = (field: {
    key: keyof UserCreateDto;
    placeholder: string;
    type?: string;
  }) => {
    if (field.key === "avatarUrl") {
      return (
        <Box key="avatar-upload" sx={avatarContainerStyles}>
          <Avatar src={form.avatarUrl ?? undefined} sx={avatarStyles} />
          <Box sx={cameraIconContainerStyles} onClick={triggerAvatarSelect}>
            <CameraAlt sx={{ fontSize: 18, color: "#fff" }} />
          </Box>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            style={{ display: "none" }}
          />
        </Box>
      );
    }

    const value = form[field.key] ?? "";
    return (
      <Input
        key={field.key}
        placeholder={field.placeholder}
        value={value}
        type={field.type}
        onChange={(e) => update(field.key, e.target.value, setForm)}
        sx={{
          ...authInputStyles,
          border: errors[field.key as keyof FormErrors]
            ? "2px solid lightblue"
            : "1px solid #ccc",
        }}
        fullWidth
        disableUnderline
      />
    );
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
      <Stack sx={{ width: "400px" }}>
        <Stack sx={titleContainerStyles}>
          <Typography fontSize={24}>Register</Typography>
          <NightsStay sx={{ color: "lightblue" }} />
        </Stack>
        <Stack sx={contentContainerStyles}>
          <Stack sx={contentInnerContainerStyles}>
            {stepFields[step].map(renderField)}
          </Stack>
        </Stack>
        <Stack sx={buttonContainerStyles}>
          <Stack sx={buttonInnerContainerStyles}>
            {step !== Step.One && (
              <Button onClick={() => setStep(previousStep(step))} fullWidth>
                <ArrowBackIos /> Back
              </Button>
            )}
            {step === Step.Two ? (
              <Button onClick={handleRegister} fullWidth>
                Register <Check />
              </Button>
            ) : (
              <Button onClick={handleNext} fullWidth>
                Next <ArrowForwardIos />
              </Button>
            )}
          </Stack>
          {step === Step.One && (
            <Typography align="center" fontSize={12}>
              Already have an account?{" "}
              <Link to="/login" style={{ color: "lightblue" }}>
                Login
              </Link>
            </Typography>
          )}
        </Stack>
      </Stack>
    </Stack>
  );
}
