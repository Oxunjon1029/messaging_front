import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Autocomplete,
  TextField,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Field, Form, Formik } from 'formik';
import * as yup from 'yup';
import TextFormField from '../components/TextFormField';
import Messages from '../components/Messages';
import { useDispatch, useSelector } from 'react-redux';
import { selectAuthor, selectUsers } from '../features/user/userSlice';

const MessageSender = ({ socket, messages, setMessages }) => {
  const [reciepient, setReciepient] = useState('');
  const dispatch = useDispatch();
  const users = useSelector(selectUsers);
  const author = useSelector(selectAuthor);
  const validationSchema = yup.object({
    title: yup.string().required(),
    message: yup.string().required(),
  });

  const handleSubmit = async (values) => {
    await socket.emit('send_message', {
      room: 'chattingRoom',
      author: author,
      reciepient: reciepient,
      ...values,
    });
  };
  const onAutoCompleteChange = (value) => {
    setReciepient(value?.name);
  };
  useEffect(() => {
    socket.on('recieve_messsage', (data) => {
      if (data) {
        setMessages((prev) => [...prev, data]);
      }
    });
  }, [socket, setMessages, dispatch]);

  let newFilteredUsers = [...new Set(users)];
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
              sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}>
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
            initialValues={{ title: '', message: '' }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}>
            {() => (
              <Form>
                <Autocomplete
                  disablePortal
                  id='combo-box-demo'
                  onChange={(e, value) => onAutoCompleteChange(value)}
                  options={newFilteredUsers}
                  fullWidth
                  getOptionLabel={(option) => option?.name}
                  isOptionEqualToValue={(option, value) =>
                    option.name === value
                  }
                  renderInput={(params) => (
                    <TextField
                      label='Chat to...'
                      value={receipient}
                      onChange={(e) => setReciepient(e.target.value)}
                      {...params}
                      inputProps={{ ...params.inputProps }}
                    />
                  )}
                />
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
