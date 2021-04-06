import { Button } from '@material-ui/core';
import React from 'react'
import CloseIcon from "@material-ui/icons/Close"
import "./SendMail.css";
import {useForm} from "react-hook-form";
import {useDispatch} from "react-redux";
import {closeSendMessage} from "./features/mailSlice";
import { db, getUserDetails, storage} from './firebase';
import { get_shared_secret, encrypt } from './stegCrypt';
import { stego } from './lib/lsbtools';
import firebase from "firebase";
function SendMail() {
    
    var passkey = {"shared_key":""};
    const img_chunk = 1048400;
    const { register , handleSubmit , watch , errors}=useForm();

    function get_filename(length) {
        var result           = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
           result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
     }

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

            const hidden_img = stego(true, encrypted.enc); // In base64
            const img_ref = await storage.ref('msg_pics').child(get_filename(16)).putString(hidden_img,'base64',{'contentType':'image/png'});
            const img_url = await img_ref.ref.getDownloadURL();

            var mail_obj = {
                to: formData.to,
                from: email_id,
                subject: formData.subject,
                message: encrypted.enc,
                image_url: img_url,
                iv: encrypted.iv,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            };
            // mail_obj['img_length'] = img_parts.length;
            // for (var i=0;i<img_parts.length;i++) {
            //     mail_obj[i] = img_parts[i];
            // }

            // Put this enc text in `to` collection
            await to_db.doc('inbox').collection('all').add(mail_obj);

            // Put the enc text in `from` collection
            await from_db.doc('sent').collection('sentsent').add(mail_obj);

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
