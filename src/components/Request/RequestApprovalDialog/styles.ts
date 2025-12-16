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
