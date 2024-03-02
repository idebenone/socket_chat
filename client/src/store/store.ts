import { configureStore } from "@reduxjs/toolkit";

import socketReducer from "./socketSlice";
import userReducer from "./userSlice";
import directParticipantsReducer from "./directParticipantsSlice";
import roomReducer from "./roomSlice";

export const store = configureStore({
    reducer: {
        socket: socketReducer,
        user: userReducer,
        directParticipants: directParticipantsReducer,
        room: roomReducer,
    }
});

export type RootState = ReturnType<typeof store.getState>;