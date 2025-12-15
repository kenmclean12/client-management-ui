import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Stack, Divider, Input } from "@mui/material";
import { Search } from "@mui/icons-material";
import { useUsersGetAll } from "../../../hooks";
import { UserResponseDto } from "../../../types";
import { UserRow } from "../../../components";
import { inputStyles, rowContainerStyles } from "./styles";

export function UserSearchSection() {
  const navigate = useNavigate();
  const [search, setSearch] = useState<string>("");
  const { data: users = [] } = useUsersGetAll({ enabled: true });

  const filteredUsers = users.filter(
    (u) =>
      u.firstName?.toLowerCase().includes(search.toLowerCase()) ||
      u.lastName?.toLowerCase().includes(search.toLowerCase()) ||
      u.userName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Divider sx={{ borderColor: "#333", my: 1 }} />
      <Input
        placeholder="Search users..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        startAdornment={<Search sx={{ color: "#888", mr: 1 }} />}
        sx={inputStyles}
        disableUnderline
        fullWidth
      />
      <Stack sx={rowContainerStyles}>
        {filteredUsers.map((u: UserResponseDto) => (
          <UserRow
            key={u.id}
            user={u}
            showUserName
            onClick={() => navigate(`/users/${u.id}`)}
            hoverColor="#222"
            color="#111"
          />
        ))}
      </Stack>
    </>
  );
}
