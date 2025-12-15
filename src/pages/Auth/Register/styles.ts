import { SxProps } from "@mui/material";

export const mainContainerStyles: SxProps = {
  alignItems: "center",
  justifyContent: "center",
  height: "100vh",
  width: "100vw",
};

export const contentContainerStyles: SxProps = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "60%",
  width: "100%",
  paddingTop: "32px",
  gap: "16px",
};

export const buttonContainerStyles: SxProps = {
  display: "flex",
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
