import { Stack } from "@mui/material";
import TopBar from "./TopBar";
import SideBar from "./SideBar";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <>
      <TopBar />
      <Stack>
        <SideBar />
        <Stack>
          <Outlet />
        </Stack>
      </Stack>
    </>
  );
}
