import "./navbar.css";

export default function Navbar({children}) {
    return(
        <div className="navbar-module">
            {children}
        </div>
    );
}