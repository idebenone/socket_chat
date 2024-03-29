import { configureStore } from "@reduxjs/toolkit";

import userReducer from "./userSlice";
import directParticipantsReducer from "./directParticipantsSlice";
import roomReducer from "./roomSlice";

export const store = configureStore({
    reducer: {
        user: userReducer,
        directParticipants: directParticipantsReducer,
        room: roomReducer,
    }
});

export type RootState = ReturnType<typeof store.getState>;