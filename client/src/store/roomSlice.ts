import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface RoomInterface {
    id: string,
}

const initialState: RoomInterface = {
    id: ""
};

export const roomSlice = createSlice({
    name: "room",
    initialState,
    reducers: {
        setRoom: (_state, action: PayloadAction<RoomInterface>) => {
            return action.payload;
        },
        getRoom: (_state, action: PayloadAction<RoomInterface>) => {
            _state = action.payload
        },
        leaveRoom: () => initialState,
    }
});

export const { setRoom, getRoom, leaveRoom } = roomSlice.actions;
export default roomSlice.reducer;