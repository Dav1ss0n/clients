function OkButton({onClick}) {
    return <button onClick={onClick}>Let's start</button>;
}



export default function QGuid({onClick}) {
    return (
        <div>
            <h1>Welcome, Client!</h1>
            <h3>Have any business around you at your fingertip.</h3>

            <OkButton onClick={onClick}/>
        </div>
    );
}