import { Box, Paper, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import React from 'react';
import { useSelector } from 'react-redux';
import { selectAuthor } from '../features/user/userSlice';
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: '#1976D2',
  padding: theme.spacing(1),
  display: 'flex',
}));
const Messages = ({ messages }) => {
  let authorOrReciepient = useSelector(selectAuthor);
  let newFilteredMessages = [
    ...new Set(
      messages.filter((message) => message.reciepient === authorOrReciepient)
    ),
  ];
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        gap: '30px',
        flex: '1',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          border: '1px solid grey',
          borderRadius: '12px',
          width: '100%',
          height: '50%',
          overflowY: 'scroll',
          padding: '10px 20px',
        }}>
        {newFilteredMessages &&
          newFilteredMessages?.map((message, index) => {
            return (
              <Item key={index}>
                <Box
                  sx={{
                    display: 'flex',
                    width: '100%',
                    alignItems: 'flex-start',
                    justifyContent: 'center',
                  }}>
                  <Box
                    sx={{
                      display: 'flex',
                      width: '100%',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                    }}>
                    <Typography>Title: {message?.title}</Typography>
                    <Typography>by {message?.author}</Typography>
                  </Box>
                  <Box sx={{ textAlign: 'right', color: 'white' }}>
                    <Typography
                      sx={{
                        fontWeight: '400',
                        display: 'inline',
                        wordBreak: 'normal',
                      }}>
                      {message?.message}
                    </Typography>
                  </Box>
                </Box>
              </Item>
            );
          })}
      </Box>
    </Box>
  );
};

export default Messages;
