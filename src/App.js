// src/App.js
import './App.css';
import React, { useState } from 'react';
import { useForm, Controller } from "react-hook-form";
import { TextField, Alert, Snackbar } from "@mui/material";
import { useDispatch } from 'react-redux';
import { saveFormData } from './features/form/formSlice';

function App() {
  const {
    register, // utilisation de register, fonction de React-Hook-Form, qui permet d'enregistrer un champ de formulaire.
    handleSubmit, // permet de gérer toutes les actions liées à l'envoi du formulaire
    formState: { errors }, // va être utilisé pour gérer plusieurs erreurs dans les champs, notamment ceux liés au MDP
    watch, // va être utilisé par le système pour vérifier la valeur entrée dans le champ de l'âge
    trigger, // fonction pour déclencher manuellement la validation
    control, // Utilisé pour les composants contrôlés comme Controller
    formState, // gère l'état global du formulaire
    clearErrors, // va gérer l'effacement des erreurs
    reset // fonction pour réinitialiser le formulaire (après l'envoi)
  } = useForm({ mode: "all" }); // "mode : all" -> mettre à "all" permet de mettre plusieurs erreurs sur le même type "d'action"

  const dispatch = useDispatch(); // Initialisation du dispatch pour envoyer des actions au store Redux
  const [openSnackbar, setOpenSnackbar] = useState(false); // État pour contrôler l'affichage du Snackbar

  const onSubmit = (data) => {
    console.log("Submitting data:", data); // Pour le débogage
    dispatch(saveFormData(data)); // Enregistrer les données dans le store
    setOpenSnackbar(true); // Afficher le Snackbar
    reset(); // Réinitialiser le formulaire
  };

  const age = watch("age"); // Observer la valeur du champ d'âge

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>React Form</h1>
      </header>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='input'>
          <input
            // Le spread operator {...} est utilisé pour que les propriétés de la fonction s'étalent sur tout l'élément "input". 
            // utiliser la fonction register permet entre autres de gérer les erreurs. 
            {...register("firstName", { required: "First Name is required", maxLength: 20 })}
            aria-invalid={errors.firstName ? "true" : "false"} // on vérifie s'il y a des erreurs
            placeholder='first name' />
          <p>*</p>
        </div>
        {/* et on affiche s'il y a des erreurs */}
        {errors.firstName && <p role="alert">{errors.firstName.message}</p>}
        <div className='input'>
          <input
            {...register("lastName", { required: "Last Name is required", pattern: /^[A-Za-z]+$/i })}
            aria-invalid={errors.lastName ? "true" : "false"}
            placeholder='last name' />
          <p>*</p>
        </div>
        {errors.lastName && <p role="alert">{errors.lastName.message}</p>}
        <div className='input'>
          <input
            type="number"
            {...register("age", {
              required: "Age is required",
              min: { value: 18, message: "Minimum age is 18" },
              valueAsNumber: true // converti automatiquement la valeur en nombre
            })}
            placeholder='age' />
          <p>*</p>
        </div>
        {errors.age && <p role="alert">{errors.age.message}</p>}
        <div className='input'>
          <input
            {...register("mail",
              {
                required: "Email Address is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "invalid email address"
                }
              }
            )}
            aria-invalid={errors.mail ? "true" : "false"}
            placeholder='your@mail.odd'
          />
          <p>*</p>
        </div>
        {errors.mail && <p role="alert">{errors.mail.message}</p>}
        <div className='password'>
          <div className='input'>
            <Controller
              // Utilisation du composant Controller de react-hook-form pour gérer un champ contrôlé
              control={control} // Lie le contrôleur au formulaire
              name="password"
              defaultValue=""
              rules={{
                required: true // champ requis
              }}
              render={({ field, fieldState: { error } }) => {
                const { ref, onChange, ...restField } = field; // fonction de rendu personnalisé pour le champ
                return (
                  <TextField
                    {...restField} // autres propriétés
                    fullWidth // prend toute la largeur dispo
                    label="password" // l'étiquette, qui va se réduire au-dessus du champ lorsqu'on commence à écrire
                    size="small" // la taille de l'étiquette
                    className='textFieldStyle' // une classe pour personnaliser le CSS
                    helperText={formState?.errors?.password?.message} // si erreur = message affiché
                    error={error !== undefined} // indique si le champ est en 'erreur'
                    type="password" // Masquer le mot de passe (met des étoiles)
                    onChange={(e) => {
                      clearErrors("password"); // efface les erreurs si elles existent
                      if (formState.dirtyFields.passwordConfirm) { // si champ modifié
                        trigger("passwordConfirm"); // déclenche la validation du champ
                      }
                      onChange(e); // appelle la fonction onChange de départ
                    }}
                  />
                );
              }}
            />
            <p>*</p>
          </div>
          <div className='input'>
            <Controller
              control={control}
              name="passwordConfirm"
              defaultValue=""
              rules={{
                required: true,
                validate: (value, formValues) => {
                  return value === formValues.password; // vérifie que la confirmation correspond au mot de passe noté plus haut
                }
              }}
              render={({ field, fieldState: { error } }) => {
                const { ref, onChange, ...restField } = field;
                return (
                  <TextField
                    {...restField}
                    fullWidth
                    label="password validation"
                    size="small"
                    className='textFieldStyle'
                    type="password" // Masquer le mot de passe
                    helperText={
                      formState.errors.passwordConfirm?.type === "validate"
                        ? "Password does not match."
                        : formState.errors.passwordConfirm?.message // autre message d'erreur (que 'les mots de passe ne correspondent pas') s'il en existe
                    }
                    onChange={(event) => {
                      onChange(event);
                    }}
                    error={error !== undefined}
                  />
                );
              }}
            />
            <p>*</p>
          </div>
        </div>
        <input type="submit" />
      </form>
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        {/* ajout de snackbar pour l'alert, qui s'ouvre une fois le formulaire envoyé */}
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          Le formulaire a été envoyé avec succès !
        </Alert>
      </Snackbar>
    </div>
  );
}

export default App;