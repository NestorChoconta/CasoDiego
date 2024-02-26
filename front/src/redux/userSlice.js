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
            const { email, password, idRole, firstName, Surname, id } = action.payload;
            return {
                ...state,
                email: email,
                password: password,
                idRole: idRole,
                firstName: firstName,
                Surname: Surname,
                id: id
            };
        }
    }
});

export const { addUser } = userSlice.actions;
export default userSlice.reducer;
