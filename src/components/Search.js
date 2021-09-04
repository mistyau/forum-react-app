import { FormControl } from "react-bootstrap";
import { useHistory } from "react-router";

export default function Search() {
    const history = useHistory();

    const doSearch = (e) => {
        history.push(`/search/${e.target.value}`);
    };

    return (
        <div className="search-bar">
            <FormControl 
                type="text" 
                placeholder="Search tag..." 
                className="mr-sm-2"
                onKeyUp={e => e.key === "Enter" ? doSearch(e) : null} />
        </div>
    );
}