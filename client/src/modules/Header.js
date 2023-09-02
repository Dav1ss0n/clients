import "./header.css";

export default function Header({children}) {
    return(
        <div className="header-module">
            {children}
        </div>
    );
}