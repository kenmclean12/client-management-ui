import type { ReactNode } from "react";
import { MenuItem, Typography, Box } from "@mui/material";
import { menuItemStyles } from "./styles";

interface Props {
  label: string;
  iconRight?: ReactNode;
  onClick?: () => void;
  closeOnSelect?: boolean;
  closeMenu?: () => void;
}

export function PopoverMenuItem({
  label,
  iconRight,
  onClick,
  closeOnSelect,
  closeMenu,
}: Props) {
  return (
    <MenuItem
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
        if (closeOnSelect) closeMenu?.();
      }}
      sx={menuItemStyles}
    >
      <Typography fontSize="14px">{label}</Typography>
      {iconRight && <Box>{iconRight}</Box>}
    </MenuItem>
  );
}
