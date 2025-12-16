import { Stack } from "@mui/material";
import TopBar from "./TopBar";
import SideBar from "./SideBar";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <Stack direction="column" minWidth="550px">
      <TopBar />
      <Stack
        direction="row"
        sx={{
          maxHeight: "calc(100vh - 60px)",
          maxWidth: "calc(100vw)",
          overflowX: "hidden",
        }}
      >
        <SideBar />
        <Stack sx={{ flex: 1 }}>
          <Outlet />
        </Stack>
      </Stack>
    </Stack>
  );
}
