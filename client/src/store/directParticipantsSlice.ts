import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface DirectParticipantsInterface {
    sender: {
        id: string,
        username: string,
        name: string,
    },
    receiver: {
        id: string,
        username: string,
        name: string,
    },
}

const initialState: DirectParticipantsInterface = {
    sender: { id: "", username: "", name: "" },
    receiver: { id: "", username: "", name: "" }
};

export const directParticipantsSlice = createSlice({
    name: "directParticipants",
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