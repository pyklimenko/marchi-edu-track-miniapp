// src/components/common/Loading.js
import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

function Loading({ message = 'Загрузка...' }) {
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      bgcolor="background.default"
    >
      <CircularProgress color="primary" size={60} />
      <Typography variant="h6" mt={2}>
        {message}
      </Typography>
    </Box>
  );
}

export default Loading;
