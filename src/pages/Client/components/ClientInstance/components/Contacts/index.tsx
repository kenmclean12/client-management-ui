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

export function ClientContacts({ client }: Props) {
  const [editingContact, setEditingContact] = useState<EditingContact | null>(
    null
  );
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [contactToDelete, setContactToDelete] = useState<Contact | null>(null);

  const { data: contacts, refetch } = useContactsGetByClient(client.id);
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
      data: {
        name: "",
        email: "",
        phone: "",
        clientId: client.id,
      },
    });
  };

  const handleCancelEdit = () => {
    setEditingContact(null);
    if (showAddDialog) {
      setShowAddDialog(false);
    }
  };

  const handleSaveEdit = async () => {
    if (!editingContact) return;
    if (editingContact.id === null) {
      const createDto: ContactCreateDto = {
        name: editingContact.data.name || "",
        email: editingContact.data.email || "",
        phone: editingContact.data.phone,
        clientId: client.id,
      };
      await createMutation.mutateAsync(createDto);
      refetch();
    } else {
      await updateMutation.mutateAsync({
        id: editingContact.id,
        dto: editingContact.data,
      });
      refetch();
    }
    setEditingContact(null);
    setShowAddDialog(false);
  };

  const handleDeleteClick = (contact: Contact) => {
    setContactToDelete(contact);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!contactToDelete) return;
    await deleteMutation.mutateAsync();
    setDeleteDialogOpen(false);
    setContactToDelete(null);
    refetch();
  };

  const handleChange =
    (field: keyof ContactUpdateDto) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (editingContact) {
        setEditingContact({
          ...editingContact,
          data: {
            ...editingContact.data,
            [field]: e.target.value || null,
          },
        });
      }
    };

  const isEditing = (contactId: number) => editingContact?.id === contactId;

  return (
    <>
      <Paper
        sx={{
          p: 4,
          borderRadius: 2,
          boxShadow: "0 2px 12px rgba(0, 0, 0, 0.08)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            color: "black",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h5" fontWeight={600}>
            Contacts
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleAddClick}
            disabled={createMutation.isPending}
          >
            Add Contact
          </Button>
        </Box>

        {contacts?.length === 0 ? (
          <Box
            sx={{
              textAlign: "center",
              py: 8,
              color: "text.secondary",
            }}
          >
            <Person sx={{ fontSize: 60, mb: 2, color: "action.disabled" }} />
            <Typography variant="h6">No contacts yet</Typography>
            <Typography variant="body1" sx={{ mt: 1 }}>
              Add the first contact to this client
            </Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table>
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
                  <TableRow key={contact.id} hover>
                    {/* Name Column */}
                    <TableCell>
                      {isEditing(contact.id) ? (
                        <TextField
                          value={editingContact?.data.name || ""}
                          onChange={handleChange("name")}
                          size="small"
                          fullWidth
                          required
                          error={!editingContact?.data.name}
                          helperText={
                            !editingContact?.data.name ? "Required" : ""
                          }
                        />
                      ) : (
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <Person color="action" fontSize="small" />
                          <Typography>{contact.name}</Typography>
                        </Box>
                      )}
                    </TableCell>

                    {/* Email Column */}
                    <TableCell>
                      {isEditing(contact.id) ? (
                        <TextField
                          value={editingContact?.data.email || ""}
                          onChange={handleChange("email")}
                          size="small"
                          fullWidth
                          required
                          type="email"
                          error={!editingContact?.data.email}
                          helperText={
                            !editingContact?.data.email ? "Required" : ""
                          }
                        />
                      ) : (
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <Email color="action" fontSize="small" />
                          <Typography>{contact.email}</Typography>
                        </Box>
                      )}
                    </TableCell>

                    {/* Phone Column */}
                    <TableCell>
                      {isEditing(contact.id) ? (
                        <TextField
                          value={editingContact?.data.phone || ""}
                          onChange={handleChange("phone")}
                          size="small"
                          fullWidth
                          placeholder="Optional"
                        />
                      ) : contact.phone ? (
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <Phone color="action" fontSize="small" />
                          <Typography>{contact.phone}</Typography>
                        </Box>
                      ) : (
                        <Chip
                          label="No phone"
                          size="small"
                          variant="outlined"
                          color="default"
                        />
                      )}
                    </TableCell>

                    {/* Actions Column */}
                    <TableCell align="right">
                      {isEditing(contact.id) ? (
                        <Stack
                          direction="row"
                          spacing={1}
                          justifyContent="flex-end"
                        >
                          <IconButton
                            size="small"
                            onClick={handleCancelEdit}
                            disabled={updateMutation.isPending}
                          >
                            <Cancel />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={handleSaveEdit}
                            disabled={
                              updateMutation.isPending ||
                              !editingContact?.data.name ||
                              !editingContact?.data.email
                            }
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
                            size="small"
                            onClick={() => handleEditClick(contact)}
                            disabled={!!editingContact}
                          >
                            <Edit />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDeleteClick(contact)}
                            disabled={deleteMutation.isPending}
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
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add New Contact</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            <TextField
              label="Name"
              value={editingContact?.data.name || ""}
              onChange={handleChange("name")}
              fullWidth
              required
              error={!editingContact?.data.name}
              helperText={!editingContact?.data.name ? "Required" : ""}
            />
            <TextField
              label="Email"
              value={editingContact?.data.email || ""}
              onChange={handleChange("email")}
              fullWidth
              required
              type="email"
              error={!editingContact?.data.email}
              helperText={!editingContact?.data.email ? "Required" : ""}
            />
            <TextField
              label="Phone"
              value={editingContact?.data.phone || ""}
              onChange={handleChange("phone")}
              fullWidth
              placeholder="Optional"
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCancelEdit}
            disabled={createMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSaveEdit}
            disabled={
              createMutation.isPending ||
              !editingContact?.data.name ||
              !editingContact?.data.email
            }
          >
            {createMutation.isPending ? (
              <>
                <CircularProgress size={20} sx={{ mr: 1 }} />
                Creating...
              </>
            ) : (
              "Create Contact"
            )}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Contact</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete{" "}
            <strong>{contactToDelete?.name}</strong>? This action cannot be
            undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            disabled={deleteMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            color="error"
            variant="contained"
            onClick={handleConfirmDelete}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? (
              <>
                <CircularProgress size={20} sx={{ mr: 1 }} />
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
