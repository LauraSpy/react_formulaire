import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import store from './store'; // Importation du store Redux

sessionStorage.clear();
localStorage.clear();

// Création du point d'entrée de l'application React
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    {/* Le Provider Redux enveloppe l'application pour rendre le store accessible à tous les composants */}
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);

// Le Provider permet à tous les composants d'accéder au store Redux
// Cela facilite la gestion d'état global, notamment pour les données du formulaire