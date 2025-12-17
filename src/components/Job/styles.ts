export const darkMenuProps = {
  PaperProps: {
    sx: {
      backgroundColor: "#121212",
      color: "white",
      border: "1px solid #2a2a2a",
    },
  },
  MenuListProps: {
    sx: {
      padding: 0,
      "& .MuiMenuItem-root": {
        color: "white",
        "&:hover": {
          backgroundColor: "#1e1e1e",
        },
        "&.Mui-selected": {
          backgroundColor: "#2a2a2a",
        },
        "&.Mui-selected:hover": {
          backgroundColor: "#333",
        },
      },
    },
  },
};
