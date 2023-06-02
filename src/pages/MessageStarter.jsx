import React, { useEffect } from 'react';
import { Box, Button } from '@mui/material';
import { Field, Form, Formik } from 'formik';
import TextFormField from '../components/TextFormField';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setAuthor, setUsers } from '../features/user/userSlice';
const MessageStarter = ({ socket }) => {
  const dispatch = useDispatch();
  const navigator = useNavigate();
  const validationSchema = yup.object({
    name: yup.string().required(),
  });

  const handleSubmit = (values) => {
    dispatch(setAuthor(values?.name));
    socket.emit('send_user', values);
  };

  useEffect(() => {
    socket.on('get_allUsers', (data) => {
      if (data) {
        navigator('/messaging');
        dispatch(setUsers(data));
      }
    });
    return () => {
      socket.off('get_allUsers');
    };
  }, [socket, dispatch, navigator]);
  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
      }}>
      <Formik
        initialValues={{ name: '' }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}>
        {() => (
          <Form>
            <Field
              placeholder='Enter your name...'
              label='Full Name'
              name='name'
              component={TextFormField}
            />
            <Button type='submit' variant='contained'>
              Start messaging
            </Button>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default MessageStarter;
