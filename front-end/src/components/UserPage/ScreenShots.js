import React from "react";
import { Box, Grid, Paper } from "@mui/material";
import { makeStyles } from "@mui/styles";
import Activity from "./Activity";

const useStyles = makeStyles((theme) => ({}));

export default function ScreenShots({ isInternal }) {
  const classes = useStyles();

  return (
    <Box component="div" sx={{}}>
      {/* map the time ranges from user data for the particular date */}
      <Activity />
      <hr />
      <Activity />
      <hr />
      <Activity />
      <hr />
    </Box>
  );
}
