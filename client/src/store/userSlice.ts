import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserInterface {
    _id: string,
    name: string,
    username: string,
    profile_img: string,
    bio: string,
    followers_count: number
    following_count: number,
}

const initialState: UserInterface = {
    _id: "",
    name: "",
    username: "",
    profile_img: "",
    bio: "",
    followers_count: 0,
    following_count: 0
};

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (_state, action: PayloadAction<UserInterface>) => {
            return action.payload;
        },
        getUser: (_state, action: PayloadAction<UserInterface>) => {
            _state = action.payload
        },
    }
});

export const { setUser, getUser } = userSlice.actions;
export default userSlice.reducer;