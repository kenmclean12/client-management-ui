export const ellipsisTextBoxStyles = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 0.5,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  cursor: "default",
};

export const tableCellStyles = {
  maxWidth: 200,
  color: "#aaa",
  textOverflow: "ellipsis",
  textAlign: "center",
  whiteSpace: "nowrap",
  overflow: "hidden",
};

export const descriptionBoxStyles = {
  ...ellipsisTextBoxStyles,
  cursor: "pointer",
  "&:hover .desc": {
    color: "white",
    textDecoration: "underline",
  },
};

export const priorityChipStyles = {
  color: "white",
  borderColor: "#444",
  "& .MuiChip-icon": { color: "#888" },
};
