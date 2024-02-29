import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface DirectParticipantsInterface {
    senderId: string,
    receiverId: string,
}

const initialState: DirectParticipantsInterface = {
    senderId: "", receiverId: ""
};

export const directParticipantsSlice = createSlice({
    name: "users",
    initialState,
    reducers: {
        startConversation: (_state, action: PayloadAction<DirectParticipantsInterface>) => {
            return action.payload;
        },
        getConversation: (_state, action: PayloadAction<DirectParticipantsInterface>) => {
            _state = action.payload
        },
        leaveConverSation: () => initialState,
    }
});

export const { startConversation, getConversation, leaveConverSation } = directParticipantsSlice.actions;
export default directParticipantsSlice.reducer;