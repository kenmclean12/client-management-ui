import { useState } from "react";
import { Button, IconButton, TextField } from "@mui/material";
import { Edit } from "@mui/icons-material";
import { UniversalDialog } from "../../UniversalDialog";
import { dialogButtonStyles, textFieldStyles } from "../../../pages/styles";
import { useNotesUpdate } from "../../../hooks";
import { Note } from "../../../types";

interface Props {
  note: Note;
}

export function EditNoteDialog({ note }: Props) {
  const [open, setOpen] = useState<boolean>(false);
  const [content, setContent] = useState<string>(note.content);
  const { mutateAsync: update, isPending } = useNotesUpdate(note.id);

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
        onClick={() => setOpen(true)}
        sx={{ color: "white" }}
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
            disabled={!content || isPending}
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
          placeholder="Edit note content..."
          variant="outlined"
          sx={textFieldStyles}
        />
      </UniversalDialog>
    </>
  );
}
