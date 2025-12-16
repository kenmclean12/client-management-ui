import {
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Stack,
  Box,
  Chip,
  Divider,
} from "@mui/material";
import { Phone, Email, Person } from "@mui/icons-material";
import { Client } from "../../../../../../types";
import { useContactsGetByClient } from "../../../../../../hooks";
import {
  ContactAddDialog,
  ContactDeleteDialog,
  ContactEditDialog,
} from "../../../../../../components";

interface Props {
  client: Client;
}

export function ClientContacts({ client }: Props) {
  const { data: contacts = [] } = useContactsGetByClient(client.id);

  return (
    <Paper
      sx={{
        p: 2,
        paddingInline: 3,
        m: 1,
        mt: 2,
        backgroundColor: "black",
        border: "1px solid #444",
        borderRadius: 2,
        color: "white",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography fontSize={18} fontWeight={600} sx={{ color: "white" }}>
          Contacts
        </Typography>
        <ContactAddDialog clientId={client.id} />
      </Box>
      <Divider sx={{ my: 1, backgroundColor: "#444" }} />
      {contacts.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 8, color: "#aaa" }}>
          <Person sx={{ fontSize: 60, mb: 2, color: "#555" }} />
          <Typography variant="h6">No contacts yet</Typography>
          <Typography sx={{ mt: 1 }}>
            Add the first contact to this client
          </Typography>
        </Box>
      ) : (
        <TableContainer>
          <Table
            sx={{
              "& th": { color: "#ccc", borderColor: "#333" },
              "& td": { color: "white", borderColor: "#333" },
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {contacts.map((contact) => (
                <TableRow
                  key={contact.id}
                  hover
                  sx={{ "&:hover": { backgroundColor: "#111" } }}
                >
                  <TableCell>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Person fontSize="small" sx={{ color: "#777" }} />
                      <Typography>{contact.name}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Email fontSize="small" sx={{ color: "#777" }} />
                      <Typography>{contact.email}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    {contact.phone ? (
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Phone fontSize="small" sx={{ color: "#777" }} />
                        <Typography>{contact.phone}</Typography>
                      </Stack>
                    ) : (
                      <Chip
                        label="No phone"
                        size="small"
                        variant="outlined"
                        sx={{ color: "#aaa", borderColor: "#555" }}
                      />
                    )}
                  </TableCell>
                  <TableCell align="right">
                    <Stack
                      direction="row"
                      spacing={1}
                      justifyContent="flex-end"
                    >
                      <ContactEditDialog contact={contact} />
                      <ContactDeleteDialog
                        clientId={client.id}
                        contactId={contact.id}
                        contactName={contact.name}
                      />
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Paper>
  );
}
