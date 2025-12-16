import {
  Typography,
  Box,
  Stack,
  Divider,
  Card,
  CardContent,
} from "@mui/material";
import {
  AccessTime,
  EditCalendar,
  Note as NoteIcon,
} from "@mui/icons-material";
import { Note } from "../../../types";
import { formatDate } from "../../../utils";
import { AddNoteDialog, DeleteNoteDialog, EditNoteDialog } from "./components";

interface Props {
  clientId: number;
  data: Note[] | undefined;
}

export function NoteSection({ clientId, data: notes }: Props) {
  const sortedNotes = [...(notes || [])].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <Stack>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 1,
        }}
      >
        <Typography variant="h6" color="white" fontWeight={600}>
          Notes ({notes ? notes.length : 0})
        </Typography>
        <AddNoteDialog clientId={clientId} />
      </Box>
      <Divider sx={{ backgroundColor: "#444" }} />
      {sortedNotes.length === 0 ? (
        <Box
          sx={{
            textAlign: "center",
            py: 4,
            pt: 5,
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
                border: "1px solid #444",
                borderLeft: "2px solid white",
                transition: "all 0.2s",
              }}
            >
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
                  <Stack direction="row" spacing={1}>
                    <EditNoteDialog note={note} />
                    <DeleteNoteDialog noteId={note.id} />
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}
    </Stack>
  );
}
