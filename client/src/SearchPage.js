// Search Page:
// Header -> Search Input - Filter - Categories
// Content -> Business Icons
// Navbar -> Search Page Icon - Settings Page

import Header from "./modules/Header";
import Content from "./modules/Content";
import Navbar from "./modules/Navbar";

import SearchInput from "./components/SearchInput";
import Categories from "./components/Categories";
import Filters from "./components/Filters";
import Bcard from "./components/BCard";
import SearchPageIcon from "./components/NavbarSearchPageIcon";
import SettingsPageIcon from "./components/NavbarSettingsPageIcon";

import binfos from "./b-cards.json";


export default function SearchPage(props) {
    
    //1. Fetcher of business card data from the server:
    async function fetchData() {
        await fetch('http://localhost:3000/api/userData', {
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {return data})
        .catch(error => console.error(error));
    }

    //2. Mapping fetched data into business cards:
    // const bcardsArr = binfos.map(b => <Bcard info={b} key={b.bid}/>)
    const bcardsArr = fetchData.map(b => <Bcard info={b} key={b.bid}/>)

    return (
        <div>

            <h1>Search</h1>

            <Header>
                <SearchInput />
                <Categories />
                <Filters />
            </Header>

            <Content>
                {bcardsArr}
            </Content>
            
            <Navbar>
                <SearchPageIcon isChecked={true} onClick={props.onClick}/>
                <SettingsPageIcon isChecked={false} onClick={props.onClick}/>
            </Navbar>



        </div>
    );
}