import { Box, Card, Divider, Stack, Typography } from "@mui/material";
import { Note } from "../../../types";
import { AccessTime, EditCalendar } from "@mui/icons-material";
import { DeleteNoteDialog } from "../DeleteNoteDialog";
import { EditNoteDialog } from "../EditNoteDialog";
import { formatDate } from "../../../utils";
import {
  cardStyles,
  dateContainerStyles,
  dateInnerContainerStyles,
  rowContainerStyles,
} from "./styles";

interface Props {
  note: Note;
}

export function NoteCard({ note }: Props) {
  return (
    <Card key={note.id} variant="outlined" sx={cardStyles}>
      <Box color="white" whiteSpace="pre-wrap">
        {note.content}
      </Box>
      <Stack sx={rowContainerStyles}>
        <Box sx={dateContainerStyles}>
          <Box sx={dateInnerContainerStyles}>
            <AccessTime fontSize="small" />
            <Typography variant="caption">
              Created: {formatDate(note.createdAt)}
            </Typography>
          </Box>
          {note.updatedAt && (
            <Box sx={dateInnerContainerStyles}>
              <EditCalendar fontSize="small" />
              <Typography variant="caption">
                Updated: {formatDate(note.updatedAt)}
              </Typography>
            </Box>
          )}
        </Box>
        <Stack direction="row" spacing={1}>
          <EditNoteDialog note={note} />
          <DeleteNoteDialog noteId={note.id} />
        </Stack>
      </Stack>
    </Card>
  );
}
