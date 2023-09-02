import "./navbarSettingsPageIcon.css";

export default function SettingsPageIcon({isChecked, onClick}) {
    return (<>
        <input type="radio" id="nav-settings" name="navbar-item" value="SettingsPage" onClick={onClick} defaultChecked={isChecked}/>
        <label htmlFor="nav-settings" className="radio-navbar-settings"></label>
        </>
    );
}
