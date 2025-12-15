import { Stack } from "@mui/material";
import TopBar from "./TopBar";
import SideBar from "./SideBar";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <Stack direction="column" sx={{ height: "90vh" }}>
      <TopBar />
      <Stack direction="row" sx={{ flex: 1 }}>
        <SideBar />
        <Stack sx={{ flex: 1 }}>
          <Outlet />
        </Stack>
      </Stack>
    </Stack>
  );
}
