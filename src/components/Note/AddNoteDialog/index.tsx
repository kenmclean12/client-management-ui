import { useState } from "react";
import { Button, IconButton, TextField } from "@mui/material";
import { Add } from "@mui/icons-material";
import { UniversalDialog } from "../../UniversalDialog";
import { textFieldStyles } from "../../../pages/styles";
import { useNotesCreate } from "../../../hooks";
import { useAuth } from "../../../context";
import { UserRole } from "../../../types";
import { addButtonStyles } from "./styles";

interface Props {
  clientId: number;
}

export function AddNoteDialog({ clientId }: Props) {
  const { user } = useAuth();
  const [open, setOpen] = useState<boolean>(false);
  const [note, setNote] = useState<string>("");
  const { mutateAsync: create } = useNotesCreate();
  const isAdmin = user?.role === UserRole.Admin;

  const handleAddClick = async () => {
    await create({
      content: note,
      clientId,
      userId: user?.id as number,
    });
    setOpen(false);
  };

  return (
    <>
      <IconButton onClick={() => setOpen(true)} disabled={!isAdmin}>
        <Add sx={{ color: "white" }} />
      </IconButton>
      <UniversalDialog
        open={open}
        onClose={() => setOpen(false)}
        title="Add New Note"
        footer={
          <Button
            variant="outlined"
            onClick={handleAddClick}
            sx={addButtonStyles}
          >
            Add
          </Button>
        }
      >
        <TextField
          value={note}
          onChange={(e) => setNote(e.target.value)}
          multiline
          rows={3}
          fullWidth
          required
          placeholder="Enter note content..."
          variant="outlined"
          sx={textFieldStyles}
        />
      </UniversalDialog>
    </>
  );
}
