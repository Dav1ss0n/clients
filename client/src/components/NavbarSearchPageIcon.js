import "./navbarSearchPageIcon.css";

export default function SearchPageIcon({isChecked, onClick}) {
    return (<>
        <input type="radio" id="nav-search" name="navbar-item" value="SearchPage" onClick={onClick} defaultChecked={isChecked}/>
        <label htmlFor="nav-search" className="radio-navbar-search"></label>
        </>
    );
}