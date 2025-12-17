import { Outlet } from "react-router-dom";
import { Stack } from "@mui/material";
import TopBar from "./TopBar";
import SideBar from "./SideBar";
import { mainSectionContainerStyles } from "./styles";

export default function Layout() {
  return (
    <Stack direction="column" minWidth="550px">
      <TopBar />
      <Stack sx={mainSectionContainerStyles}>
        <SideBar />
        <Stack sx={{ flex: 1 }}>
          <Outlet />
        </Stack>
      </Stack>
    </Stack>
  );
}
