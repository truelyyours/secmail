import { Button } from '@material-ui/core';
import React from 'react'
import CloseIcon from "@material-ui/icons/Close"
import "./SendMail.css";
import {useForm} from "react-hook-form";
import {useDispatch} from "react-redux";
import {closeSendMessage} from "./features/mailSlice";
import { db, getUserDetails, isRegistered} from './firebase';
import firebase from "firebase";
import { get_shared_secret,gen_keys, encrypt } from './stegCrypt';

function SendMail() {
    
    var passkey = {"shared_key":""};

    const { register , handleSubmit , watch , errors}=useForm();
    const dispatch = useDispatch();
    async function onSubmit(formData) {
        
        const email_id = getUserDetails().email;
        const from_db = db.collection(email_id); 
        const to_db = db.collection(formData.to);

        try {
            // Check if `to` is registered
            var check_reg = await to_db.get();
            if (check_reg.size == 0) {
                alert("User " + formData.to + " is not registed. Ask them to register!");
                dispatch(closeSendMessage());
                return;
            }

            // Check if there exists a shared key between `from` and `to`
            // Checking for shared key in either of the db is enough.
            const key_ref = await to_db.doc(email_id).get();
            if (!key_ref.exists) {
                // No mail exchanged. Generate shared_key and add to db of both the users.
                const u1 = await from_db.doc('mydata').get();
                const u2 = await to_db.doc('mydata').get();
                passkey.shared_key = get_shared_secret(u1.data().private_key,u2.data().private_key);
                
                // Put the shared key in respective collections
                await from_db.doc(formData.to).set(passkey);
                await to_db.doc(email_id).set(passkey);
            } else {
                // Simply get the shared key
                passkey.shared_key = key_ref.data().shared_key;
            }

            // Encrypt the message using iv as the shared_key
            const encrypted = encrypt(formData.message, passkey.shared_key);

            // Put this enc text in `to` collection
            to_db.doc('inbox').collection('all').add({
                to: formData.to,
                from: email_id,
                subject: formData.subject,
                message: encrypted.enc,
                iv: encrypted.iv,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            });

            // Put the enc text in `from` collection
            from_db.doc('sent').collection('sentsent').add({
                to: formData.to,
                from: email_id,
                subject: formData.subject,
                message: encrypted.enc,
                iv: encrypted.iv,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            });

            dispatch(closeSendMessage());
        } catch(error) {
            console.log(error);
            alert("Error onSubmit " + error);
        }
    };
    return (
        <div className="sendMail">
            <div className="sendMail__header">
                <h3>New Message</h3>
                <CloseIcon onClick={()=> dispatch(closeSendMessage())} className="sendMail__close"/>
            </div>
            <form id="sendMail__form" >
                <input name="to" type="email" placeholder="To" ref={register({required:true})}/>
                {errors.to && <p className="sendMail__error">To is required!</p>}
                <input name="subject" type="text" placeholder="Subject" ref={register({required:true})}/>
                {errors.subject && <p className="sendMail__error">Subject is required!</p>}
                <input name="message" type="text" placeholder="Message...." className="sendMail__message" ref={register({required:true})}/>
                {errors.message && <p className="sendMail__error">Message is required!</p>}
                <div className="sendMail__options">
                    <Button className="sendMail__send" variant="contained" color="primary" onClick={handleSubmit(onSubmit)}>Send</Button>
                </div>
            </form>
        </div>
    )
}

export default SendMail
