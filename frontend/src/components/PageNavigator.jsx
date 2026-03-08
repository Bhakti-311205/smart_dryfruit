import React from "react";
import { Box, Button } from "@mui/material";
import { ArrowBack, ArrowForward } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const PageNavigator = ({
  backTo,
  backLabel = "Back",
  nextTo,
  nextLabel = "Next",
  sx,
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (backTo) {
      navigate(backTo);
    } else {
      navigate(-1);
    }
  };

  const handleNext = () => {
    if (nextTo) {
      navigate(nextTo);
    }
  };

  return (
    <Box
      sx={{
        mt: 4,
        display: "flex",
        justifyContent: "space-between",
        ...sx,
      }}
    >
      <Button
        variant="outlined"
        startIcon={<ArrowBack />}
        onClick={handleBack}
      >
        {backLabel}
      </Button>

      {nextTo && (
        <Button
          variant="contained"
          endIcon={<ArrowForward />}
          onClick={handleNext}
          sx={{
            bgcolor: "#6B3E26",
            "&:hover": { bgcolor: "#3E2723" },
          }}
        >
          {nextLabel}
        </Button>
      )}
    </Box>
  );
};

export default PageNavigator;

