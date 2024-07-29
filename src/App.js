import './App.css';
import React from 'react';
import { useForm, Controller } from "react-hook-form";
import { TextField } from "@mui/material";

function App() {
  const {
    register, // utilisation de register, fonction de React-Hook-Form, qui permet d'enregister un champ de formulaire.
    handleSubmit, //permet de gérer toutes les actions liées à l'envoi du formulaire
    formState: { errors }, //va être utilisé pour gérer plusieurs erreurs dans les champs, notamment ceux liés au MDP
    watch, //va être utilisé par le système pour vérifier la valeur entrer dans le champ de l'âge
    trigger, //fonction pour déclencher manuellement la validation
    control, //Utilisé pour les composants contrôlés comme Controller
    formState, //gère l'état global du formulaire
    clearErrors //va gérer l'effacement des erreurs
  } = useForm({ mode: "all" }); //"mode : all" -> mettre à "all" permet de mettre plusieurs erreur sur le même type "d'action"
  const onSubmit = (data) => console.log(data);

  const age = watch("age");


  return (
    <div className="App">
      <header className="App-header">
        <h1>React Form</h1>
      </header>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='input'>
          <input
            // Le spread operator {...} est utilisé pour que les propriétés de la fonction s'étale sur tout l'élément "input". 
            // utiliser la fonction register permet entre autre de gérer les erreurs. 
            {...register("firstName", { required: "First Name is required", maxLength: 20 })}
            aria-invalid={errors.firstName ? "true" : "false"} //on vérifie s'il y a des erreurs
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
              valueAsNumber: true //converti automatiquement la valeur en nombre
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
                required: true //champ requis
              }}
              render={({ field, fieldState: { error } }) => {
                const { ref, onChange, ...restField } = field; //fonction de rendu personnalisé pour le champ
                return (
                  <TextField
                    {...restField} // autre propriétés
                    fullWidth //prend toute la largeur dispo
                    label="password" //l'étiquette, qui va se réduire au-dessus du champ lorsqu'on commence à écrire
                    size="small" // la taille de l'étiquette
                    className='textFieldStyle' //une classe pour personnalisé le CSS
                    helperText={formState?.errors?.password?.message} //si erreur = message affiché
                    error={error !== undefined} //indique si le champ est en 'erreur'
                    onChange={(e) => {
                      clearErrors("password"); //efface les erreurs si elles existent
                      if (formState.dirtyFields.passwordConfirm) { //si champ modifié
                        trigger("passwordConfirm"); //déclenche la validation du champ
                      }
                      onChange(e); //appelle la fonction onChange de départ
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
                  return value === formValues.password; //vérifie que la confirmation correspond au mot de passe noté plus haut
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
                    helperText={
                      formState.errors.passwordConfirm?.type === "validate"
                        ? "Password does not match."
                        : formState.errors.passwordConfirm?.message //autre message d'erreur (que 'les mots de passe ne correspondent pas') s'il en existe
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
    </div>
  );
}

export default App;
