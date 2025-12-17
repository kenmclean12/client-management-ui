import {
  Select,
  MenuItem,
  OutlinedInput,
  Box,
  Typography,
  Stack,
} from "@mui/material";
import { useState } from "react";
import type { UserResponseDto } from "../../../types";
import { UserRow } from "../UserRow";
import { CSSObject } from "@emotion/react";
import { selectStyles } from "./styles";

interface Props {
  users: UserResponseDto[];
  value?: UserResponseDto | null;
  label?: string;
  onChange: (user: UserResponseDto | null) => void;
  menuPaperStyles?: CSSObject;
}

export function UserSelect({
  users,
  value,
  label = "Assigned User",
  onChange,
  menuPaperStyles,
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <Stack>
      <Typography fontSize={11} ml={2} zIndex={1000}>
        {label}
      </Typography>
      <Select
        displayEmpty
        value={value?.id ?? ""}
        size="small"
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        sx={selectStyles}
        input={<OutlinedInput label={label} sx={{ padding: 0 }} notched />}
        renderValue={() => {
          if (value) return <UserRow user={value} />;
          return <Box height="40px" />;
        }}
        MenuProps={{
          PaperProps: { sx: { ...menuPaperStyles, p: 0 } },
          MenuListProps: { sx: { p: 0 } },
        }}
      >
        <Box maxHeight="240px" sx={{ overflowY: "auto" }}>
          {users.map((u) => (
            <MenuItem
              key={u.id}
              value={u.id}
              disableGutters
              sx={{ p: 0, minHeight: "unset" }}
              onClick={() => onChange(u)}
            >
              <UserRow user={u} />
            </MenuItem>
          ))}
        </Box>
      </Select>
    </Stack>
  );
}
