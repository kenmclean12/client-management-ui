import { useState } from "react";
import {
  Typography,
  Box,
  Stack,
  TextField,
  Button,
  IconButton,
  CircularProgress,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardContent,
  CardActions,
} from "@mui/material";
import {
  Edit,
  Delete,
  Save,
  Cancel,
  Add,
  Note,
  AccessTime,
  EditCalendar,
} from "@mui/icons-material";
import {
  Note as NoteType,
  NoteCreateDto,
  NoteUpdateDto,
} from "../../../../../../../types";
import {
  useNotesGetByClient,
  useNotesCreate,
  useNotesUpdate,
  useNotesDelete,
} from "../../../../../../../hooks";

interface Props {
  clientId: number;
}

interface EditingNote {
  id: number | null; // null for new note
  data: NoteUpdateDto;
}

// Helper function to format dates
const formatDate = (dateString: string | null) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export function ClientNotes({ clientId }: Props) {
  // State
  const [editingNote, setEditingNote] = useState<EditingNote | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<NoteType | null>(null);
  const { data: notes } = useNotesGetByClient(clientId);
  const createMutation = useNotesCreate();
  const updateMutation = useNotesUpdate(editingNote?.id || 0);
  const deleteMutation = useNotesDelete(noteToDelete?.id || 0);

  // Handlers
  const handleEditClick = (note: NoteType) => {
    setEditingNote({
      id: note.id,
      data: {
        content: note.content,
        clientId: note.clientId,
      },
    });
  };

  const handleAddClick = () => {
    setShowAddDialog(true);
    setEditingNote({
      id: null,
      data: {
        content: "",
        clientId: clientId,
      },
    });
  };

  const handleCancelEdit = () => {
    setEditingNote(null);
    if (showAddDialog) {
      setShowAddDialog(false);
    }
  };

  const handleSaveEdit = async () => {
    if (!editingNote) return;

    if (editingNote.id === null) {
      const createDto: NoteCreateDto = {
        content: editingNote.data.content || "",
        clientId: clientId,
      };
      await createMutation.mutateAsync(createDto);
    } else {
      await updateMutation.mutateAsync({
        id: editingNote.id,
        dto: editingNote.data,
      });
    }
    setEditingNote(null);
    setShowAddDialog(false);
  };

  const handleDeleteClick = (note: NoteType) => {
    setNoteToDelete(note);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!noteToDelete) return;
    await deleteMutation.mutateAsync();
    setDeleteDialogOpen(false);
    setNoteToDelete(null);
  };

  const handleChange =
    (field: keyof NoteUpdateDto) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (editingNote) {
        setEditingNote({
          ...editingNote,
          data: {
            ...editingNote.data,
            [field]: e.target.value || null,
          },
        });
      }
    };

  const isEditing = (noteId: number) => editingNote?.id === noteId;

  // Sort notes by date (newest first)
  const sortedNotes = [...(notes || [])].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h5" fontWeight={600}>
          Notes
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAddClick}
          disabled={createMutation.isPending}
        >
          Add Note
        </Button>
      </Box>

      {sortedNotes.length === 0 ? (
        <Box
          sx={{
            textAlign: "center",
            py: 8,
            color: "text.secondary",
          }}
        >
          <Note sx={{ fontSize: 60, mb: 2, color: "action.disabled" }} />
          <Typography variant="h6">No notes yet</Typography>
          <Typography variant="body1" sx={{ mt: 1 }}>
            Add the first note for this client
          </Typography>
        </Box>
      ) : (
        <Stack spacing={3}>
          {sortedNotes.map((note) => (
            <Card
              key={note.id}
              variant="outlined"
              sx={{
                borderLeft: "4px solid",
                borderLeftColor: isEditing(note.id)
                  ? "primary.main"
                  : "primary.light",
                transition: "all 0.2s",
              }}
            >
              {isEditing(note.id) ? (
                <Box sx={{ p: 2 }}>
                  <TextField
                    value={editingNote?.data.content || ""}
                    onChange={handleChange("content")}
                    multiline
                    rows={4}
                    fullWidth
                    required
                    placeholder="Enter note content..."
                    variant="outlined"
                    error={!editingNote?.data.content}
                    helperText={!editingNote?.data.content ? "Required" : ""}
                  />
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-end",
                      gap: 1,
                      mt: 2,
                    }}
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
                        updateMutation.isPending || !editingNote?.data.content
                      }
                    >
                      <Save />
                    </IconButton>
                  </Box>
                </Box>
              ) : (
                <>
                  <CardContent>
                    <Box sx={{ whiteSpace: "pre-wrap", mb: 2 }}>
                      {note.content}
                    </Box>
                    <Divider sx={{ my: 1 }} />
                    <Box
                      sx={{ display: "flex", flexWrap: "wrap", gap: 2, mt: 1 }}
                    >
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                      >
                        <AccessTime fontSize="small" color="action" />
                        <Typography variant="caption" color="text.secondary">
                          Created: {formatDate(note.createdAt)}
                        </Typography>
                      </Box>
                      {note.updatedAt && (
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                          }}
                        >
                          <EditCalendar fontSize="small" color="action" />
                          <Typography variant="caption" color="text.secondary">
                            Updated: {formatDate(note.updatedAt)}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </CardContent>
                  <CardActions sx={{ justifyContent: "flex-end", pt: 0 }}>
                    <IconButton
                      size="small"
                      onClick={() => handleEditClick(note)}
                      disabled={!!editingNote}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDeleteClick(note)}
                      disabled={deleteMutation.isPending}
                    >
                      <Delete />
                    </IconButton>
                  </CardActions>
                </>
              )}
            </Card>
          ))}
        </Stack>
      )}

      <Dialog
        open={showAddDialog}
        onClose={handleCancelEdit}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Add New Note</DialogTitle>
        <DialogContent>
          <TextField
            value={editingNote?.data.content || ""}
            onChange={handleChange("content")}
            multiline
            rows={6}
            fullWidth
            required
            placeholder="Enter note content..."
            variant="outlined"
            sx={{ mt: 2 }}
            error={!editingNote?.data.content}
            helperText={!editingNote?.data.content ? "Required" : ""}
          />
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
            disabled={createMutation.isPending || !editingNote?.data.content}
          >
            {createMutation.isPending ? (
              <>
                <CircularProgress size={20} sx={{ mr: 1 }} />
                Creating...
              </>
            ) : (
              "Add Note"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Note</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this note? This action cannot be
            undone.
          </Typography>
          {noteToDelete && (
            <Card
              variant="outlined"
              sx={{ mt: 2, p: 2, maxHeight: 150, overflow: "auto" }}
            >
              <Typography variant="body2" color="text.secondary">
                {noteToDelete.content.length > 200
                  ? `${noteToDelete.content.substring(0, 200)}...`
                  : noteToDelete.content}
              </Typography>
            </Card>
          )}
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
