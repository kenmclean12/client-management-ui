import { useState, useMemo } from "react";
import { Button, IconButton, TextField } from "@mui/material";
import { Edit } from "@mui/icons-material";
import { UniversalDialog } from "../../UniversalDialog";
import { dialogButtonStyles, textFieldStyles } from "../../../pages/styles";
import { useNotesUpdate } from "../../../hooks";
import { Note, UserRole } from "../../../types";
import { useAuth } from "../../../context";

interface Props {
  note: Note;
}

export function EditNoteDialog({ note }: Props) {
  const { user } = useAuth();
  const [open, setOpen] = useState<boolean>(false);
  const [content, setContent] = useState<string>(note.content);
  const { mutateAsync: update } = useNotesUpdate(note.id);
  const isAdmin = user?.role === UserRole.Admin;
  const isSelf = user?.id === note.userId;
  const isOwner = isAdmin && isSelf;

  const isDirty = useMemo(() => {
    return content.trim() !== note.content.trim();
  }, [content, note.content]);

  const handleOpen = () => {
    setContent(note.content);
    setOpen(true);
  };

  const handleSave = async () => {
    await update({
      id: note.id,
      dto: { content },
    });
    setOpen(false);
  };

  return (
    <>
      <IconButton
        size="small"
        onClick={handleOpen}
        sx={{ color: "white" }}
        disabled={!isOwner}
      >
        <Edit />
      </IconButton>
      <UniversalDialog
        open={open}
        onClose={() => setOpen(false)}
        title="Edit Note"
        footer={
          <Button
            variant="outlined"
            onClick={handleSave}
            sx={dialogButtonStyles}
            disabled={!isDirty || !content}
          >
            Save
          </Button>
        }
      >
        <TextField
          value={content}
          onChange={(e) => setContent(e.target.value)}
          multiline
          rows={3}
          fullWidth
          required
          inputProps={{ maxLength: 1000 }}
          placeholder="Edit note content..."
          variant="outlined"
          sx={textFieldStyles}
        />
      </UniversalDialog>
    </>
  );
}
