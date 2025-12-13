import type { ReactNode } from "react";
import { MenuItem, Typography, Box } from "@mui/material";
import { menuItemStyles } from "./styles";

interface Props {
  label: string;
  iconRight?: ReactNode;
  onClick?: () => void;
  closeOnSelect?: boolean;
  closeMenu?: () => void;
  disabled?: boolean;
}

export function PopoverMenuItem({
  label,
  iconRight,
  onClick,
  closeOnSelect,
  closeMenu,
  disabled,
}: Props) {
  return (
    <MenuItem
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
        if (closeOnSelect) closeMenu?.();
      }}
      sx={menuItemStyles}
      disabled={disabled}
    >
      <Typography fontSize="14px">{label}</Typography>
      {iconRight && <Box>{iconRight}</Box>}
    </MenuItem>
  );
}
