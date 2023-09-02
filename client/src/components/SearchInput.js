import "./searchInput.css";

export default function SearchInput() {
    return (
        <div className="search-wrapper">
            <input type="text" className="search-input" placeholder="Business name..."/>
            <button className="search-icon">Find</button>
        </div>
    );
}