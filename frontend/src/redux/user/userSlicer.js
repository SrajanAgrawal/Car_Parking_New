import {createSlice} from '@reduxjs/toolkit'

// initial state 
const initialState = {
    currentUser : null
}

// create slice 

const userSlicer = createSlice({
    // slice name, initial state, reducers 
    name: 'user',
    initialState,
    reducers: {
        // all the reducers will take two arguments, state and action
        saveUserState: (state, action) => {
            state.currentUser = action.payload
        },
        removeUserState: (state) => {
            state.currentUser = null
        },
        updateUserState: (state, action) => {
            state.currentUser = action.payload
        }
    }
})


// export actions Or reducers
export  const {saveUserState, removeUserState, updateUserState} = userSlicer.actions

// export slice
export default userSlicer.reducer;
