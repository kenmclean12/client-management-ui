export const authMainContainerStyles = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  height: "100vh",
  width: "100vw",
  backgroundColor: "lightblue",
};

export const authInnerContainerStyles = {
  display: "flex",
  alignItems: "center",
  width: "50%",
  height: "50%",
  minHeight: "375px",
  minWidth: "400px",
  maxHeight: "400px",
  maxWidth: "500px",
  padding: 4,
  backgroundColor: "#1e1e1e",
  border: "2px solid #444",
  borderRadius: "16px",
  opacity: 0.9,
};

export const authInputStyles = {
  height: 40,
  padding: "0 12px",
  fontSize: 14,
  color: "white",
  backgroundColor: "black",
  lineHeight: "40px",
  borderRadius: 2,
  "&::placeholder": { opacity: 0.7 },
};

export const authButtonStyles = {
  backgroundColor: "white",
  color: "black",
  border: "1.5px solid black",
  boxShadow: "none",
  borderRadius: 2,
};
