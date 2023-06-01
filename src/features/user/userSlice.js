import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  users: [],
  author: '',
  host: {}
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUsers: (state, action) => {
      state.users = [...state.users, ...action.payload]
    },
    setHost: (state, action) => {
      state.host = action.payload
    },

    setAuthor: (state, action) => {
      state.author = action.payload
    },

  }
});

export const { setUsers, setAuthor, setHost } = userSlice.actions;
export const selectUsers = (state) => state.user.users;
export const selectRoom = (state) => state.user.room;
export const selectAuthor = (state) => state.user.author;
export const selectHost = (state) => state.user.host;


export default userSlice.reducer;
