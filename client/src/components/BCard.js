import "./bcard.css";

export default function BCard({info}) {
    return (
        <div className="bcard">

            <div className="card-logo">
                <img src={info.logo} alt={info.name} />
            </div>

            <div className="card-names">
                <p className="card-name">{info.name}</p>
                <p className="card-type">{info.type}</p>
                <p className="card-info"></p>
            </div>
        </div>
    );
}