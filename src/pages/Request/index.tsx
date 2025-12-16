import { Paper, Typography, Box, Stack, Card } from "@mui/material";
import { Assignment } from "@mui/icons-material";
import { useRequestsGetAll } from "../../hooks";
import { PageShell, RequestsTable } from "../../components";
import { statusLabels } from "./config";
import { cardStyles, paperStyles } from "./styles";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

export default function RequestsPage() {
  const { data: requests } = useRequestsGetAll();
  const sortedRequests = [...(requests || [])].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <PageShell title="Requests">
      <Box sx={{ p: 2 }}>
        <Stack direction="row" spacing={2} mb={2}>
          {statusLabels(sortedRequests).map((s) => (
            <Card key={s.label} sx={cardStyles}>
              <Typography fontSize={13} color="#aaa">
                {s.label}
              </Typography>
              <Typography variant="h5" color="white" mt={0.5}>
                {s.count}
              </Typography>
            </Card>
          ))}
        </Stack>
        <Paper sx={paperStyles}>
          {sortedRequests.length === 0 ? (
            <Box textAlign="center" py={6}>
              <Assignment sx={{ fontSize: 56, color: "#555" }} />
              <Typography sx={{ color: "#aaa", mt: 1 }}>
                No requests found
              </Typography>
            </Box>
          ) : (
            <RequestsTable requests={sortedRequests} />
          )}
        </Paper>
      </Box>
    </PageShell>
  );
}
