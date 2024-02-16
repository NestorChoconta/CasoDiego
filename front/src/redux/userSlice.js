import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    email:"",
    password:"",
    idRole:"",
    firstName:"",
    Surname:"",
    id:""
}

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers:{
        addUser: (state, action) =>{
            const {email,password,idRole,firstName,Surname,id} = action.payload;
            state.email = email;
            state.password = password;
            state.idRole = idRole;
            state.firstName = firstName;
            state.Surname = Surname;
            state.id = id;
        }
    }
});

export const { addUser } = userSlice.actions;
export default userSlice.reducer;