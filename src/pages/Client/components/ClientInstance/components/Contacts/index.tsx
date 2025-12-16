import { useState } from "react";
import {
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
  Stack,
  Box,
  TextField,
  CircularProgress,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
} from "@mui/material";
import {
  Edit,
  Delete,
  Save,
  Cancel,
  Add,
  Phone,
  Email,
  Person,
} from "@mui/icons-material";
import {
  Client,
  Contact,
  ContactCreateDto,
  ContactUpdateDto,
} from "../../../../../../types";
import {
  useContactsGetByClient,
  useContactsCreate,
  useContactsUpdate,
  useContactsDelete,
} from "../../../../../../hooks";

interface EditingContact {
  id: number | null;
  data: ContactUpdateDto;
}

interface Props {
  client: Client;
}

const darkTextFieldSx = {
  "& .MuiInputBase-input": {
    color: "white",
    backgroundColor: "black",
  },
  "& .MuiInputLabel-root": { color: "#ccc" },
  "& .MuiOutlinedInput-root": {
    backgroundColor: "black",
    "& fieldset": { borderColor: "#444" },
    "&:hover fieldset": { borderColor: "#777" },
    "&.Mui-focused fieldset": { borderColor: "white" },
  },
};

export function ClientContacts({ client }: Props) {
  const [editingContact, setEditingContact] = useState<EditingContact | null>(
    null
  );
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [contactToDelete, setContactToDelete] = useState<Contact | null>(null);

  const { data: contacts = [], refetch } = useContactsGetByClient(client.id);
  const createMutation = useContactsCreate(client.id);
  const updateMutation = useContactsUpdate(editingContact?.id || 0);
  const deleteMutation = useContactsDelete(contactToDelete?.id || 0);

  const handleEditClick = (contact: Contact) => {
    setEditingContact({
      id: contact.id,
      data: {
        name: contact.name,
        email: contact.email,
        phone: contact.phone,
        clientId: contact.clientId,
      },
    });
  };

  const handleAddClick = () => {
    setShowAddDialog(true);
    setEditingContact({
      id: null,
      data: { name: "", email: "", phone: "", clientId: client.id },
    });
  };

  const handleCancelEdit = () => {
    setEditingContact(null);
    setShowAddDialog(false);
  };

  const handleSaveEdit = async () => {
    if (!editingContact) return;
    if (editingContact.id === null) {
      const dto: ContactCreateDto = {
        name: editingContact.data.name || "",
        email: editingContact.data.email || "",
        phone: editingContact.data.phone,
        clientId: client.id,
      };
      await createMutation.mutateAsync(dto);
    } else {
      await updateMutation.mutateAsync({
        id: editingContact.id,
        dto: editingContact.data,
      });
    }
    setEditingContact(null);
    setShowAddDialog(false);
    refetch();
  };

  const handleDeleteClick = (contact: Contact) => {
    setContactToDelete(contact);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!contactToDelete) return;
    await deleteMutation.mutateAsync(contactToDelete.id);
    setDeleteDialogOpen(false);
    setContactToDelete(null);
    refetch();
  };

  const handleChange =
    (field: keyof ContactUpdateDto) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!editingContact) return;
      setEditingContact({
        ...editingContact,
        data: { ...editingContact.data, [field]: e.target.value || null },
      });
    };

  const isEditing = (id: number) => editingContact?.id === id;

  return (
    <>
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
          <IconButton
            onClick={handleAddClick}
            sx={{ color: "white", borderColor: "#666" }}
          >
            <Add />
          </IconButton>
        </Box>
        <Divider sx={{ my: 1, backgroundColor: "#444" }} />
        {contacts?.length === 0 ? (
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
                {contacts?.map((contact) => (
                  <TableRow
                    key={contact.id}
                    hover
                    sx={{ "&:hover": { backgroundColor: "#111" } }}
                  >
                    <TableCell>
                      {isEditing(contact.id) ? (
                        <TextField
                          fullWidth
                          size="small"
                          value={editingContact?.data.name || ""}
                          onChange={handleChange("name")}
                          sx={darkTextFieldSx}
                        />
                      ) : (
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Person fontSize="small" sx={{ color: "#777" }} />
                          <Typography>{contact.name}</Typography>
                        </Stack>
                      )}
                    </TableCell>
                    <TableCell>
                      {isEditing(contact.id) ? (
                        <TextField
                          fullWidth
                          size="small"
                          value={editingContact?.data.email || ""}
                          onChange={handleChange("email")}
                          sx={darkTextFieldSx}
                        />
                      ) : (
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Email fontSize="small" sx={{ color: "#777" }} />
                          <Typography>{contact.email}</Typography>
                        </Stack>
                      )}
                    </TableCell>
                    <TableCell>
                      {isEditing(contact.id) ? (
                        <TextField
                          fullWidth
                          size="small"
                          value={editingContact?.data.phone || ""}
                          onChange={handleChange("phone")}
                          sx={darkTextFieldSx}
                        />
                      ) : contact.phone ? (
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
                      {isEditing(contact.id) ? (
                        <Stack
                          direction="row"
                          spacing={1}
                          justifyContent="flex-end"
                        >
                          <IconButton
                            onClick={handleCancelEdit}
                            sx={{ color: "#aaa" }}
                          >
                            <Cancel />
                          </IconButton>
                          <IconButton
                            onClick={handleSaveEdit}
                            sx={{ color: "white" }}
                          >
                            <Save />
                          </IconButton>
                        </Stack>
                      ) : (
                        <Stack
                          direction="row"
                          spacing={1}
                          justifyContent="flex-end"
                        >
                          <IconButton
                            onClick={() => handleEditClick(contact)}
                            sx={{ color: "#aaa" }}
                          >
                            <Edit />
                          </IconButton>
                          <IconButton
                            onClick={() => handleDeleteClick(contact)}
                            sx={{ color: "#f55" }}
                          >
                            <Delete />
                          </IconButton>
                        </Stack>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      <Dialog
        open={showAddDialog}
        onClose={handleCancelEdit}
        fullWidth
        maxWidth="sm"
        PaperProps={{ sx: { backgroundColor: "black", color: "white" } }}
      >
        <DialogTitle>Add New Contact</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            <TextField
              label="Name"
              value={editingContact?.data.name || ""}
              onChange={handleChange("name")}
              sx={darkTextFieldSx}
            />
            <TextField
              label="Email"
              value={editingContact?.data.email || ""}
              onChange={handleChange("email")}
              sx={darkTextFieldSx}
            />
            <TextField
              label="Phone"
              value={editingContact?.data.phone || ""}
              onChange={handleChange("phone")}
              sx={darkTextFieldSx}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelEdit} sx={{ color: "#aaa" }}>
            Cancel
          </Button>
          <Button
            variant="outlined"
            onClick={handleSaveEdit}
            sx={{ color: "white", borderColor: "#666" }}
          >
            {createMutation.isPending ? (
              <CircularProgress size={20} />
            ) : (
              "Create Contact"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{ sx: { backgroundColor: "black", color: "white" } }}
      >
        <DialogTitle>Delete Contact</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete{" "}
            <strong>{contactToDelete?.name}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            sx={{ color: "#aaa" }}
          >
            Cancel
          </Button>
          <Button
            variant="outlined"
            sx={{ color: "#f55", borderColor: "#f55" }}
            onClick={handleConfirmDelete}
          >
            {deleteMutation.isPending ? (
              <CircularProgress size={20} />
            ) : (
              "Delete"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
