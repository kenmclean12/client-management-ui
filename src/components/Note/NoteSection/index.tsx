import { Typography, Box, Stack, Divider } from "@mui/material";
import { Note as NoteIcon } from "@mui/icons-material";
import { Note } from "../../../types";
import { AddNoteDialog } from "../AddNoteDialog";
import { NoteCard } from "../NoteCard";
import {
  boxStyles,
  noContentContainerStyles,
  noteContainerStyles,
  noteIconStyles,
} from "./styles";

interface Props {
  clientId: number;
  data: Note[];
}

export function NoteSection({ clientId, data: notes = [] }: Props) {
  const sortedNotes = [...(notes || [])].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <Stack>
      <Box sx={boxStyles}>
        <Typography variant="h6" color="white" fontWeight={600}>
          Notes ({notes ? notes.length : 0})
        </Typography>
        <AddNoteDialog clientId={clientId} />
      </Box>
      <Divider sx={{ backgroundColor: "#444" }} />
      {sortedNotes.length === 0 ? (
        <Box sx={noContentContainerStyles}>
          <NoteIcon sx={noteIconStyles} />
          <Typography variant="h6" color="white">
            No notes yet
          </Typography>
          <Typography variant="body1" color="white" mt={1}>
            Add the first note for this client
          </Typography>
        </Box>
      ) : (
        <Stack sx={noteContainerStyles}>
          {sortedNotes.map((note) => (
            <NoteCard note={note} />
          ))}
        </Stack>
      )}
    </Stack>
  );
}
