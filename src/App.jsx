import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { Routes, Route } from 'react-router-dom';
import MessageStarter from './pages/MessageStarter';
import MessageSender from './pages/MessageSender';
import { io } from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';
import { selectHost } from './features/user/userSlice';
import ProtectedRoute from './components/ProtectedRoute';
const socket = io('http://localhost:8000');
function App() {
  const user = useSelector(selectHost);
  const dispatch = useDispatch();
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on('get_allMessages', (data) => {
      if (data) {
        setMessages(data);
      }
    });
  }, [dispatch]);

  return (
    <div className='App'>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}>
        <Routes>
          <Route path='/' element={<MessageStarter socket={socket} />} />
          <Route
            path='/messaging'
            element={
              <ProtectedRoute user={user}>
                <MessageSender
                  messages={messages}
                  socket={socket}
                  setMessages={setMessages}
                />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Box>
    </div>
  );
}

export default App;
