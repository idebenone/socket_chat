import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Socket } from "socket.io-client";

interface SocketStateInterface {
    socket: Socket | undefined,
}

const initialState: SocketStateInterface = {
    socket: undefined
};

export const socketSlice = createSlice({
    name: "socket",
    initialState,
    reducers: {
        setSocket: (_state, action: PayloadAction<SocketStateInterface>) => {
            return { ..._state, ...action.payload };
        },
    }
});

export const { setSocket } = socketSlice.actions;
export default socketSlice.reducer;