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
    <Box>
      <Box sx={boxStyles}>
        {icon}
        <Typography variant="subtitle2" color="text.secondary">
          {label}
        </Typography>
      </Box>
      <Typography
        variant="body1"
        ml={3}
        whiteSpace={multiline ? "pre-line" : "normal"}
      >
        {value}
      </Typography>
    </Box>
  );
}
