import { createSlice } from '@reduxjs/toolkit';

// État initial du formulaire
const initialState = {
    //fait en sorte que la session storage soit prise en compte comme un tableau, et si non, il l'initialise comme un tableau vide ( [] )
    formData: Array.isArray(JSON.parse(sessionStorage.getItem('formData'))) ? JSON.parse(sessionStorage.getItem('formData')) : []
};

// Création d'un "slice" Redux pour le formulaire
const formSlice = createSlice({
    name: 'form', // Nom du slice, utilisé dans les types d'action
    initialState, // État initial défini ci-dessus
    reducers: {
        // Action pour sauvegarder les données du formulaire
        saveFormData: (state, action) => {
            console.log("Current state:", state);// Pour le débogage
            console.log("Action payload:", action.payload);// Pour le débogage
            if (!state) state = initialState;
            if (!state.formData) state.formData = [];
            //ajoute les nouvelles données au tableau (en stockant les précédentes)
            state.formData.push(action.payload);
            // Sauvegarde dans sessionStorage
            sessionStorage.setItem('formData', JSON.stringify(state.formData));
            console.log("Updated state:", state);// Pour le débogage
        }
    }
});

// Export de l'action creator
export const { saveFormData } = formSlice.actions;

// Export du reducer
export default formSlice.reducer;

// Ce slice gère la logique d'état spécifique au formulaire
// Il définit comment l'état du formulaire change en réponse aux actions