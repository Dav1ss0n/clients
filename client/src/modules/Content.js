import "./content.css";


export default function Content({children}) {
    return (
        <div className="content-area">
            {children}
        </div>
    );
}