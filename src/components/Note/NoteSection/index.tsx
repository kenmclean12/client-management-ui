import { useState } from "react";
import {
  Typography,
  Box,
  Stack,
  TextField,
  Button,
  IconButton,
  Divider,
  Card,
  CardContent,
} from "@mui/material";
import {
  Edit,
  Delete,
  Add,
  AccessTime,
  EditCalendar,
  Note as NoteIcon,
  Close,
  Send,
} from "@mui/icons-material";
import { NoteCreateDto, NoteUpdateDto, Note } from "../../../types";
import { useNotesCreate, useNotesUpdate, useNotesDelete } from "../../../hooks";
import { formatDate } from "../../../utils";
import { UniversalDialog } from "../../../components";
import { textFieldStyles } from "../../../pages/styles";

interface Props {
  clientId: number;
  data: Note[] | undefined;
}

interface EditingNote {
  id: number | null;
  data: NoteUpdateDto;
}

export function NoteSection({ clientId, data: notes }: Props) {
  const [editingNote, setEditingNote] = useState<EditingNote | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<Note | null>(null);
  const createMutation = useNotesCreate();
  const updateMutation = useNotesUpdate(editingNote?.id || 0);
  const deleteMutation = useNotesDelete(noteToDelete?.id || 0);

  // Handlers
  const handleEditClick = (note: Note) => {
    setEditingNote({
      id: note.id,
      data: {
        content: note.content,
      },
    });
  };

  const handleAddClick = () => {
    setShowAddDialog(true);
    setEditingNote({
      id: null,
      data: {
        content: "",
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

  const handleDeleteClick = (note: Note) => {
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
            [field]: e.target.value,
          },
        });
      }
    };

  const isEditing = (noteId: number) => editingNote?.id === noteId;

  const sortedNotes = [...(notes || [])].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <Stack>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 1,
        }}
      >
        <Typography variant="h6" color="white" fontWeight={600}>
          Notes ({notes ? notes.length : 0})
        </Typography>
        <IconButton
          onClick={handleAddClick}
          disabled={createMutation.isPending}
        >
          <Add sx={{ color: "white" }} />
        </IconButton>
      </Box>
      <Divider sx={{ backgroundColor: "#444" }} />
      {sortedNotes.length === 0 ? (
        <Box
          sx={{
            textAlign: "center",
            py: 4,
            pt: 5,
            color: "text.secondary",
          }}
        >
          <NoteIcon sx={{ fontSize: 60, mb: 2, color: "white" }} />
          <Typography variant="h6" color="white">
            No notes yet
          </Typography>
          <Typography variant="body1" sx={{ color: "white", mt: 1 }}>
            Add the first note for this client
          </Typography>
        </Box>
      ) : (
        <Stack spacing={1}>
          {sortedNotes.map((note) => (
            <Card
              key={note.id}
              variant="outlined"
              sx={{
                backgroundColor: "#191717ff",
                borderLeft: "2px solid",
                border: "1px solid #444",
                borderLeftColor: isEditing(note.id) ? "primary.main" : "white",
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
                    sx={textFieldStyles}
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
                      <Close sx={{ color: "red" }} />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={handleSaveEdit}
                      disabled={
                        updateMutation.isPending || !editingNote?.data.content
                      }
                    >
                      <Send />
                    </IconButton>
                  </Box>
                </Box>
              ) : (
                <>
                  <CardContent>
                    <Box sx={{ color: "white", whiteSpace: "pre-wrap" }}>
                      {note.content}
                    </Box>
                    <Divider sx={{ my: 1 }} />
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                      width="100%"
                    >
                      <Box
                        sx={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 2,
                          mt: 1,
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                            color: "white",
                          }}
                        >
                          <AccessTime fontSize="small" />
                          <Typography variant="caption">
                            Created: {formatDate(note.createdAt)}
                          </Typography>
                        </Box>
                        {note.updatedAt && (
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 0.5,
                              color: "white",
                            }}
                          >
                            <EditCalendar fontSize="small" />
                            <Typography variant="caption">
                              Updated: {formatDate(note.updatedAt)}
                            </Typography>
                          </Box>
                        )}
                      </Box>
                      <IconButton
                        size="small"
                        onClick={() => handleEditClick(note)}
                        sx={{ ml: "auto", color: "white" }}
                        disabled={!!editingNote}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDeleteClick(note)}
                        sx={{ ml: 1 }}
                        disabled={deleteMutation.isPending}
                      >
                        <Delete />
                      </IconButton>
                    </Stack>
                  </CardContent>
                </>
              )}
            </Card>
          ))}
        </Stack>
      )}
      <UniversalDialog
        open={showAddDialog}
        onClose={handleCancelEdit}
        title="Add New Note"
        footer={
          <Button
            variant="outlined"
            onClick={handleSaveEdit}
            sx={{ mx: 2, color: "#ccc", border: "1px solid #444" }}
            disabled={createMutation.isPending || !editingNote?.data.content}
          >
            Add
          </Button>
        }
      >
        <TextField
          value={editingNote?.data.content || ""}
          onChange={handleChange("content")}
          multiline
          rows={3}
          fullWidth
          required
          placeholder="Enter note content..."
          variant="outlined"
          sx={textFieldStyles}
          helperText={!editingNote?.data.content ? "Required" : ""}
        />
      </UniversalDialog>
      <UniversalDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        title="Delete Note"
        footer={
          <Button
            color="error"
            variant="outlined"
            onClick={handleConfirmDelete}
            sx={{ mx: 2 }}
          >
            Delete
          </Button>
        }
      >
        <Typography>
          Are you sure you want to delete this note? This action cannot be
          undone.
        </Typography>
      </UniversalDialog>
    </Stack>
  );
}
