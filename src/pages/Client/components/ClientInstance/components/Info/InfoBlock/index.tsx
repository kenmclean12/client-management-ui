import { Box, Typography } from "@mui/material";
import { boxStyles } from "./styles";

interface Props {
  icon: React.ReactNode;
  label: string;
  value: string;
  multiline?: boolean;
}

export function InfoBlock({ icon, label, value, multiline }: Props) {
  return (
    <Box gap={3}>
      <Box sx={boxStyles}>
        {icon}
        <Typography variant="subtitle2">{label}</Typography>
      </Box>
      <Typography
        variant="body1"
        color="white"
        whiteSpace={multiline ? "pre-line" : "normal"}
      >
        {value}
      </Typography>
    </Box>
  );
}
