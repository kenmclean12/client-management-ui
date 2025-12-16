import { useState } from "react";
import { Button, IconButton, Typography } from "@mui/material";
import { Delete } from "@mui/icons-material";
import { UniversalDialog } from "../../UniversalDialog";
import { useNotesDelete } from "../../../hooks";
import { dialogButtonStyles } from "../../../pages/styles";

interface Props {
  noteId: number;
}

export function DeleteNoteDialog({ noteId }: Props) {
  const [open, setOpen] = useState<boolean>(false);
  const { mutateAsync: deleteNote } = useNotesDelete(noteId);

  return (
    <>
      <IconButton
        size="small"
        color="error"
        onClick={() => setOpen(true)}
        sx={{ ml: 1 }}
      >
        <Delete />
      </IconButton>
      <UniversalDialog
        open={open}
        onClose={() => setOpen(false)}
        title="Delete Note"
        footer={
          <Button
            variant="outlined"
            onClick={() => deleteNote()}
            sx={dialogButtonStyles}
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
    </>
  );
}
