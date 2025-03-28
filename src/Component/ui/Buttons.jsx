// src/components/ui/Button.jsx
import { Button } from "@mui/material";

const Buttons = ({ children, ...props }) => {
  return (
    <Button
      {...props}
      variant="contained"
      sx={{
        px: 2,
        py: 1,
        backgroundColor: "blue",
        color: "white",
        borderRadius: "8px",
        "&:hover": {
          backgroundColor: "darkblue",
        },
      }}
    >
      {children}
    </Button>
  );
};

export default Buttons;
