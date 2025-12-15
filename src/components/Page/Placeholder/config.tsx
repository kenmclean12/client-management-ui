import { Person, Public } from "@mui/icons-material";
import { PlaceholderConfig, PlaceholderType } from "./types"

export const PLACEHOLDER_CONFIG: Record<PlaceholderType, PlaceholderConfig> = {
  user: {
    icon: <Person sx={{ fontSize: 60 }} />,
    text: "Select a user from the side panel",
  },
  client: {
    icon: <Public sx={{ fontSize: 60 }} />,
    text: "Select a client from the side panel",
  },
};