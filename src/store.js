// Configuration du store Redux
import { configureStore } from '@reduxjs/toolkit';
import formReducer from './features/form/formSlice';

// Création du store Redux
const store = configureStore({
    reducer: {
        // Enregistrement du reducer du formulaire dans le store
        // 'form' sera la clé pour accéder à l'état du formulaire dans le store
        form: formReducer
    }
});

export default store;

// Ce store centralise l'état de l'application
// Il utilise le formReducer pour gérer les actions liées au formulaire