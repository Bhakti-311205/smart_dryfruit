import React from "react";
import { Box, IconButton, TextField } from "@mui/material";
import { Add, Remove } from "@mui/icons-material";

const QuantitySelector = ({ value, onChange, min = 1, max = 100 }) => {
  const handleIncrement = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  const handleDecrement = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  const handleChange = (e) => {
    const newValue = parseInt(e.target.value) || min;
    if (newValue >= min && newValue <= max) {
      onChange(newValue);
    }
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <IconButton
        onClick={handleDecrement}
        disabled={value <= min}
        sx={{
          border: "1px solid #ddd",
          borderRadius: 2,
          "&:hover": {
            bgcolor: "#f5f5f5",
          },
        }}
      >
        <Remove />
      </IconButton>
      <TextField
        type="number"
        value={value}
        onChange={handleChange}
        inputProps={{
          min,
          max,
          style: { textAlign: "center", fontWeight: 600 },
        }}
        sx={{
          width: "80px",
          "& .MuiOutlinedInput-root": {
            borderRadius: 2,
          },
        }}
      />
      <IconButton
        onClick={handleIncrement}
        disabled={value >= max}
        sx={{
          border: "1px solid #ddd",
          borderRadius: 2,
          "&:hover": {
            bgcolor: "#f5f5f5",
          },
        }}
      >
        <Add />
      </IconButton>
    </Box>
  );
};

export default QuantitySelector;
