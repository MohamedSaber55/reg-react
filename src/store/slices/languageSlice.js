import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    currentLang: 'en',
    dir: 'ltr',
};

const languageSlice = createSlice({
    name: 'language',
    initialState,
    reducers: {
        setLanguage: (state, action) => {
            state.currentLang = action.payload;
            state.dir = action.payload === 'ar' ? 'rtl' : 'ltr';
        },
    },
});

export const { setLanguage } = languageSlice.actions;
export default languageSlice.reducer;