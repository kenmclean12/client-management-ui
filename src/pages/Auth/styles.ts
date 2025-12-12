export const authMainContainerStyles = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  height: "100vh",
  width: "100vw",
  backgroundColor: "black",
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
  color: "white",
  border: "2px solid lightblue",
  borderRadius: "16px",
  backgroundColor: "black",
  opacity: 0.9,
};

export const authInputStyles = {
  height: 40,
  padding: "0 12px",
  fontSize: 14,
  lineHeight: "40px",
  borderRadius: 2,
  color: "white",
  "&::placeholder": { opacity: 0.7 },
};

export const authButtonStyles = {
  backgroundColor: "black",
  color: "lightblue",
  border: "1.5px solid lightblue",
  borderRadius: 2,
};