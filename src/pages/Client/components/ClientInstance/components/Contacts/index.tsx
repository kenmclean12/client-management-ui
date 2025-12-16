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
import {
  emptyBoxStyles,
  paperStyles,
  personIconStyles,
  tableRowStyles,
  tableStyles,
  titleStyles,
  topRowBoxStyles,
} from "./styles";

interface Props {
  client: Client;
}

export function ClientContacts({ client }: Props) {
  const { data: contacts = [] } = useContactsGetByClient(client.id);

  return (
    <Paper sx={paperStyles}>
      <Box sx={topRowBoxStyles}>
        <Typography sx={titleStyles}>Contacts</Typography>
        <ContactAddDialog clientId={client.id} />
      </Box>
      <Divider sx={{ my: 1, backgroundColor: "#444" }} />
      {contacts.length === 0 ? (
        <Box sx={emptyBoxStyles}>
          <Person sx={personIconStyles} />
          <Typography variant="h6">No contacts yet</Typography>
          <Typography sx={{ mt: 1 }}>
            Add the first contact to this client
          </Typography>
        </Box>
      ) : (
        <TableContainer>
          <Table sx={tableStyles}>
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
                <TableRow key={contact.id} sx={tableRowStyles} hover>
                  <TableCell>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Person fontSize="small" sx={{ color: "#777" }} />
                      <Typography>{contact.name}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" alignItems="center" spacing={1}>
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
                      justifyContent="flex-end"
                      spacing={1}
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
