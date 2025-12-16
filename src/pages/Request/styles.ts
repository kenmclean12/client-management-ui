export const cardStyles = {
  display: "flex",
  flex: 1,
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  py: 1.5,
  bgcolor: "black",
  border: "1px solid #444",
};

export const paperStyles = {
  p: 3,
  bgcolor: "black",
  border: "1px solid #444",
};

export const ellipsisTextBoxStyles = {
  display: "flex",
  alignItems: "center",
  gap: 0.5,
  maxWidth: 200,
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

export const inputLabelStyles = {
  color: "white",
  "&.Mui-focused": {
    color: "white",
  },
  "&.Mui-disabled": {
    color: "white",
  },
};

export const textFieldStyles = {
  "& .MuiPickersInputBase-root": {
    backgroundColor: "#1e1e1e",
    color: "white",
    
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "#444 !important",
      borderWidth: "1px",
    },
    
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "#444 !important",
    },
    
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#444 !important",
      borderWidth: "1px !important",
    },
    
    "&.Mui-focused": {
      boxShadow: "none",
    },
  },

  "& .MuiInputBase-input": {
    color: "white",
  },

  "& .MuiInputLabel-root": {
    color: "white",
    "&.Mui-focused": {
      color: "white",
    },
  },

  "& .MuiSvgIcon-root": {
    color: "white",
  },
};