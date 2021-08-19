import NavBar from "./NavBar";
import ThreadList from "./ThreadList";

export default function Home() {

    return (
        <div className="homepage">
            <NavBar/>

            <ThreadList/>
        </div>
        
    );
};