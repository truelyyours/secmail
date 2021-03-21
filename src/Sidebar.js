import React from 'react';
import "./Sidebar.css";
import AddIcon from "@material-ui/icons/Add";
import { Button } from '@material-ui/core';
import InboxIcon from "@material-ui/icons/Inbox";
import StarIcon from "@material-ui/icons/Star";
import LabelImportantIcon from "@material-ui/icons/LabelImportant";
import NearMeIcon from "@material-ui/icons/NearMe";
import SidebarOption from './SidebarOption';
import {useDispatch} from "react-redux";
import {openSendMessage} from "./features/mailSlice";
function Sidebar() {
    const dispatch = useDispatch();
    return (<div className="sidebar" >
        <Button className="sidebar__compose" startIcon= {<AddIcon fontSize="large" />} onClick={()=>dispatch(openSendMessage())}>Compose</Button>
        <SidebarOption Icon={InboxIcon} title="Inbox" number={54} selected={true}/>
        <SidebarOption Icon={StarIcon} title="Starred" number={54} />
        <SidebarOption Icon={LabelImportantIcon} title="Important" number={54} />
        <SidebarOption Icon={NearMeIcon} title="Sent" number={54} />

    </div>
    );
}

export default Sidebar
