import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import ErrorIcon from "@material-ui/icons/Error";
import DeleteIcon from "@material-ui/icons/Delete";
import EmailIcon from "@material-ui/icons/Email";
import WatchLaterIcon from "@material-ui/icons/WatchLater";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import LabelImportantIcon from "@material-ui/icons/LabelImportant";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import MoveToInboxIcon from '@material-ui/icons/MoveToInbox';
import {Button, IconButton} from "@material-ui/core";
import React from 'react';
import "./Mail.css"
import {useHistory} from "react-router-dom";
import UnfoldMoreIcon from "@material-ui/icons/UnfoldMore";
import PrintIcon from "@material-ui/icons/Print";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import {selectOpenMail} from "./features/mailSlice";
import {useSelector} from "react-redux";
import { db, getUserDetails } from "./firebase";
import { decrypt } from "./stegCrypt";
import { https } from "follow-redirects";


function Mail() {
    const history=useHistory();
    const selectedMail = useSelector(selectOpenMail);
    // var img_data = "data:image/png;base64,";
    
    function dwnld_img() {
        console.log("inside dwnld_img: ", selectedMail?.img_url);
        var xhr = new XMLHttpRequest();
        xhr.responseType = 'text';
        xhr.onload = (idk) => {
            console.log(idk.message);
        }
        xhr.open('GET',selectedMail?.img_url);
        xhr.send();
        console.log(xhr)
        // https.request(selectedMail?.img_url, (resp) => {
        //     resp.on('data', (chunk) => img_data += chunk);
        //     resp.on('end', () => {
        //         document.getElementsByTagName('img')[1].src = img_data;
        //         console.log("image tag source set!");
        //     });
        // }).on('response', (resp) => console.log(resp))
    }
    
    async function decrypt_message() {
        const email_id = getUserDetails().email;
        // console.log(document.getElementsByClassName('message__enc')[0].textContent.split(': '))
        const enc_text = document.getElementsByClassName('message__enc')[0].textContent.split(': ')[1];
        var dec_data = {"shared_key":"", "iv":""};

        const mail_data = await db.collection(email_id).doc('inbox').collection('all').doc(selectedMail?.id).get();
        dec_data.iv = mail_data.data().iv;
        const key_ref = await db.collection(email_id).doc(selectedMail?.title).get();
        
        dec_data.shared_key = key_ref.data().shared_key;

        const text = decrypt(enc_text,dec_data.shared_key,dec_data.iv );

        alert("The message is: \n" + text);
    }

    return (
        <div className="mail" style={{overflow: "auto"}}>
            <div className="mail__tools">
                <div className="mail__toolsLeft">
                    <IconButton onClick={()=>history.push("/")}>
                        <ArrowBackIcon/>
                    </IconButton>
                    <IconButton>
                        <MoveToInboxIcon/>
                    </IconButton>
                    <IconButton>
                        <ErrorIcon/>
                    </IconButton>
                    <IconButton>
                        <DeleteIcon/>
                    </IconButton>
                    <IconButton>
                        <EmailIcon/>
                    </IconButton>
                    <IconButton>
                        <WatchLaterIcon/>
                    </IconButton>
                    <IconButton>
                        <CheckCircleIcon/>
                    </IconButton>
                    <IconButton>
                        <LabelImportantIcon/>
                    </IconButton>
                    <IconButton>
                        <MoreVertIcon/>
                    </IconButton>
   
                </div>
                <div className="mail__toolsRight">
                <IconButton>
                        <UnfoldMoreIcon/>
                    </IconButton>
                    <IconButton>
                        <PrintIcon/>
                    </IconButton>
                    <IconButton>
                        <ExitToAppIcon/>
                    </IconButton>
                </div>

            </div>
            <div className="mail__body">
                <div className="mail__bodyHeader">
                    <h2>{selectedMail?.subject}</h2>
                    <LabelImportantIcon className="mail__important"/>
                    <p>{selectedMail?.title}</p>
                    <p className="mail__time">{selectedMail?.time}</p>

                </div>
                <div className="mail__message">
                    <p className="message__enc">Encrypted Message: {selectedMail?.message}</p>
                    <h3>Mesasge is also hidden in this image :P</h3>
                    <img src={selectedMail?.img_url} alt = "" />
                </div>
                <div className="mail__decryption">
                    <Button className="mail_decrypt" variant="contained" color="primary" onClick={decrypt_message}>Decrypt Message</Button>
                </div>
            </div>
        </div>
    );
}

export default Mail;
