// Settings Page:
// <h1>Header</h1>
// Content: Settings_menu_items
// Navbar: Search Page Icon -> Settings Page Icon <-
import {useState, useRef} from 'react';
import { unmountComponentAtNode } from 'react-dom';

import Header from "./modules/Header";
import Content from "./modules/Content";
import Navbar from "./modules/Navbar";

import SearchPageIcon from "./components/NavbarSearchPageIcon";
import SettingsPageIcon from "./components/NavbarSettingsPageIcon";
import QGuid from "./QGuid";


export default function SettingsPage(props) {
    const componentRef = useRef(null);
    const [layer, setLayer] = useState(false);

    function handleQGuid() {
        setLayer(true);
    }

    // write a handle function to unmount SettingsPage component when click on Close button
    function handleClose() {
        unmountComponentAtNode(componentRef.current);
    }

    return (
        <div>
            <h1>Settings</h1>

            <Content>
                <button onClick={handleQGuid}>Quick Guid</button>
                <button onClick={handleClose}>Close</button>
            </Content>
            
            <Navbar>
                <SearchPageIcon isChecked={false} onClick={props.onClick}/>
                <SettingsPageIcon isChecked={true} onClick={props.onClick}/>
            </Navbar>

            {layer && (<div ref={componentRef}><SettingsPage /></div>)}

        </div>
    );
}