import { SxProps } from "@mui/material";

export const titleContainerStyles: SxProps = {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  height: "15%",
  width: "100%",
  gap: "8px",
};

export const contentContainerStyles: SxProps = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "60%",
  width: "100%",
  paddingTop: "16px",
};

export const contentInnerContainerStyles: SxProps = {
  display: "flex",
  flexDirection: "column",
  width: "100%",
  gap: "16px",
  paddingTop: "16px",
};

export const buttonContainerStyles: SxProps = {
  display: "flex",
  flexDirection: "column",
  height: "30%",
  width: "100%",
  gap: "12px",
  padding: "36px 0 36px 0",
};

export const buttonInnerContainerStyles: SxProps = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  gap: "12px",
};

export const authInputStyles: SxProps = {
  borderRadius: "4px",
  padding: "10px",
  fontSize: "14px",
};

export const uploadPhotoButtonStyles: SxProps = {
  backgroundColor: "#f5f5f5",
  border: "1px solid #ccc",
  color: "#333",
};

export const avatarContainerStyles: SxProps = {
  position: "relative",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

export const avatarStyles: SxProps = {
  width: 80,
  height: 80,
  borderRadius: "50%",
};

export const cameraIconContainerStyles: SxProps = {
  position: "absolute",
  bottom: 0,
  right: 0,
  backgroundColor: "lightblue",
  borderRadius: "50%",
  padding: "4px",
  cursor: "pointer",
};
