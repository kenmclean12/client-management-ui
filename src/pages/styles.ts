export const textFieldStyles = {
  "& .MuiOutlinedInput-root": {
    backgroundColor: "#1e1e1e",

    "& fieldset": {
      borderColor: "#444",
    },
    "&:hover fieldset": {
      borderColor: "#444",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#444",
    },
  },

  "& .MuiInputBase-input": {
    color: "white",
  },

  "& .MuiInputBase-inputMultiline": {
    color: "white",
  },

  "& .MuiInputLabel-root": {
    color: "white",
  },

  "& .MuiInputLabel-root.Mui-focused": {
    color: "white",
  },
};

export const dialogButtonStyles = {
  color: "white",
  border: "1px solid #444",
  mx: 1.5,
  "&.Mui-disabled": {
    color: "white",
    borderColor: "#444",
    opacity: 0.5,
  },
};

export const selectStyles = {
  color: "white",
  backgroundColor: "#1e1e1e",
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "#444",
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "#444",
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "#444",
  },
  "& .MuiSvgIcon-root": {
    color: "white",
  },
};
