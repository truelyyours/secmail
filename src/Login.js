import { Button } from '@material-ui/core';
import React from 'react'
import { db,auth, provider, getUserDetails, auth_state } from './firebase';
import "./Login.css";
import { login } from './features/userSlice';
import {useDispatch } from "react-redux";
import { gen_keys } from './stegCrypt';
import { useForm } from 'react-hook-form';

function Login() {
    // Handle Email registration and login. 

    const { register , handleSubmit , watch , errors} = useForm();

    const dispatch = useDispatch();
    const signin = (formData)=>{
        auth.setPersistence(auth_state).then(() => {

        // Sign In using email&passwd
        auth.signInWithEmailAndPassword(formData.email_id, formData.passwd).then((userCred) => {
            const user = userCred.user;
            dispatch(login({
                displayName:user.displayName,
                email:user.email,
                photoUrl: user.photoURL
            }));
        }).catch((error) => {alert(error.message);});
        });
    }
    
    const signup = (formData) => {
        auth.setPersistence(auth_state).then(() => {
            auth.createUserWithEmailAndPassword(formData.email_id, formData.passwd).then((userCred) => {
                const user = userCred.user;
                const keys = gen_keys();
                db.collection(user.email).doc('mydata').set(keys);

                dispatch(login({
                    displayName:user.displayName,
                    email:user.email,
                    photoUrl: user.photoURL
                }));
            }).catch((error) => {alert(error.message);});
        });
    }

    return (
        <div className="login">
			<div className="login-form">	
				<div className="logo_avtar">
					<img src="http://localhost:3000/avtar.jpg" alt=""/>
		    	</div>             
			    
                <input name="email_id" className="text_field" id="text3" type="email" placeholder="Your Email Id" ref={register({required:true})}/><br/><br/>
				
			    {errors.email_id && <p className="login__error">Email Id is required and in correct format!</p>}
				
                <input name="passwd" class="password_field" type="password"  placeholder="Password" ref={register({required:true})}/><br/><br/>
                {errors.passwd && <p className="login__error">Password is Required!</p>}

				 <div className="login__options">
					<Button  variant="contained" class="login_field" onClick={handleSubmit(signin)}>Login</Button><br/><br/>
                    Not registered yet?
                    <Button variant="contained" class="register_field"  onClick={handleSubmit(signup)}> Register</Button><p/>
                 </div>  
              
            </div> 
                
                   
            
            
        </div>
    )
}

export default Login
