import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Stack, Divider, Input } from "@mui/material";
import { Search } from "@mui/icons-material";
import { useClientsGetAll } from "../../../hooks";
import { Client } from "../../../types";
import { UserRow } from "../../../components";
import { inputStyles, rowContainerStyles } from "./styles";

export function ClientSearchSection() {
  const navigate = useNavigate();
  const [search, setSearch] = useState<string>("");
  const { data: clients = [] } = useClientsGetAll({ enabled: true });

  const filteredClients = clients.filter(
    (c) =>
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.id.toString() === search
  );

  return (
    <>
      <Divider sx={{ borderColor: "#333", my: 1 }} />
      <Input
        placeholder="Search clients..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        startAdornment={<Search sx={{ color: "#888", mr: 1 }} />}
        sx={inputStyles}
        disableUnderline
        fullWidth
      />
      <Stack sx={rowContainerStyles}>
        {filteredClients.map((c: Client) => (
          <UserRow
            key={c.id}
            message={c.name}
            onClick={() => navigate(`/clients/${c.id}`)}
            hoverColor="#222"
            color="#111"
          />
        ))}
      </Stack>
    </>
  );
}
