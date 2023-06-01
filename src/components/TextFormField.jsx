import React from 'react';
import { getIn } from 'formik';
import TextField from '@mui/material/TextField';
const TextFormField = ({ field, form, ...props }) => {
  const errorText =
    getIn(form.touched, field.name) && getIn(form.errors, field.name);
  return (
    <TextField
      fullWidth
      margin='normal'
      helperText={errorText}
      error={!!errorText}
      {...field}
      {...props}
      sx={{
        backgroundColor: 'white',
        borderRadius: '1rem',
      }}
    />
  );
};

export default TextFormField;
