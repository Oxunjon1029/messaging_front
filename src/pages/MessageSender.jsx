import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  TextField,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ClearIcon from '@mui/icons-material/Clear';
import { Field, Form, Formik } from 'formik';
import * as yup from 'yup';
import TextFormField from '../components/TextFormField';
import Messages from '../components/Messages';
import { useDispatch, useSelector } from 'react-redux';
import { selectAuthor, selectUsers } from '../features/user/userSlice';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
const filter = createFilterOptions();

const MessageSender = ({ socket, messages, setMessages }) => {
  const dispatch = useDispatch();
  const users = useSelector(selectUsers);
  const author = useSelector(selectAuthor);

  const validationSchema = yup.object({
    title: yup.string().required(),
    message: yup.string().required(),
  });
  let newFilteredUsers = [...new Set(users)];
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState(newFilteredUsers);
  const handleSubmit = async (values) => {
    await socket.emit('send_message', {
      author: author,
      title: values.title,
      message: values.message,
      reciepient:
        values.reciepient === inputValue ? values.reciepient : inputValue,
      room: 'chattingRoom',
    });
  };

  useEffect(() => {
    socket.on('recieve_message', (data) => {
      if (data) {
        setMessages((prev) => [...prev, data]);
      }
    });
  }, [socket, setMessages, dispatch]);

  const handleInputChange = (event, newInputValue) => {
    setInputValue(newInputValue);
  };

  const handleValueChange = (event, newValue) => {
    setInputValue(newValue);
  };

  const handleBlur = () => {
    const existingOption = options.find((option) => option.name === inputValue);
    if (!existingOption && inputValue) {
      setOptions((prev) => [...prev, { name: inputValue }]);
    }
  };
  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position='static'>
          <Toolbar>
            <IconButton
              size='large'
              edge='start'
              color='inherit'
              aria-label='open drawer'
              sx={{ mr: 2 }}>
              <MenuIcon />
            </IconButton>
            <Typography
              variant='h6'
              noWrap
              component='div'
              sx={{ flexGrow: 1, display: { sm: 'block' } }}>
              {author}
            </Typography>
          </Toolbar>
        </AppBar>
      </Box>
      <Box
        sx={{
          display: 'flex',
          width: '100%',
          height: '100%',
          alignItems: 'center',
          padding: '0 20px',
          gap: '20px',
        }}>
        <Box sx={{ flex: '1' }}>
          <Formik
            initialValues={{ title: '', message: '', reciepient: '' }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}>
            {({ values, setFieldValue }) => (
              <Form>
                <Field name='reciepient'>
                  {({ field }) => (
                    <Autocomplete
                      options={options}
                      getOptionLabel={(option) => {
                        if (typeof option === 'string') {
                          return option;
                        }
                        if (option.inputValue) {
                          return option.inputValue;
                        }
                        return option.name;
                      }}
                      filterOptions={(options, params) => {
                        const filtered = filter(options, params);

                        const { inputValue } = params;
                        const isExisting = options.some(
                          (option) => inputValue === option.name
                        );
                        if (inputValue !== '' && !isExisting) {
                          filtered.push({
                            inputValue,
                            title: `Add "${inputValue}"`,
                          });
                        }

                        return filtered;
                      }}
                      freeSolo
                      selectOnFocus
                      clearOnBlur
                      inputValue={inputValue}
                      onInputChange={handleInputChange}
                      onChange={handleValueChange}
                      onBlur={handleBlur}
                      clearIcon={<ClearIcon style={{ display: 'none' }} />}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label='Chat to...'
                          value={values.reciepient}
                          onChange={(event) => {
                            setFieldValue(field.name, event.target.value);
                            setInputValue(event.target.value);
                          }}
                        />
                      )}
                    />
                  )}
                </Field>
                <Field
                  label='Title'
                  placeholder='Enter title..'
                  name='title'
                  component={TextFormField}
                />
                <Field
                  multiline
                  label='Message'
                  name='message'
                  placeholder='Enter your message'
                  component={TextFormField}
                />
                <Button type='submit' variant='contained'>
                  Send a message
                </Button>
              </Form>
            )}
          </Formik>
        </Box>
        <Messages messages={messages} socket={socket} />
      </Box>
    </Box>
  );
};

export default MessageSender;
