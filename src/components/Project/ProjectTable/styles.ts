export const topRowContainerStyles = {
  display: "flex",
  flex: 1,
  flexDirection: "row",
  gap: "16px",
  mb: 2,
};

export const countCardStyles = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  flex: 1,
  textAlign: "center",
  backgroundColor: "black",
  border: "1px solid #444",
};

export const projectPaperStyles = {
  backgroundColor: "black",
  border: "1px solid #444",
  color: "white",
};

export const noProjectsBoxStyles = {
  textAlign: "center",
  py: 6,
  color: "#aaa",
};

export const tableRowStyles = {
  "&:hover": { backgroundColor: "#111" },
};

export const textStyles = {
  color: "#aaa",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

export const descriptionBoxStyles = {
  display: "flex",
  alignItems: "center",
  gap: 1,
  cursor: "pointer",
  overflow: "hidden",
  "&:hover .desc": {
    color: "white",
    textDecoration: "underline",
  },
};

export const clientNameTextStyles = {
  color: "#aaa",
  textOverflow: "ellipsis",
  cursor: "pointer",
  overflow: "hidden",
  "&:hover": {
    color: "white",
    textDecoration: "underline",
  },
};
