import { FormControl } from "react-bootstrap";
import { useHistory } from "react-router";
import { useState } from "react";

export default function Search() {
    const history = useHistory();
    const [searchField, setSearchField] = useState("");

    const onChange = (e) => {
        setSearchField(e.target.value);
    }

    const doSearch = (e) => {
        history.push(`/search?tagged=${e.target.value}`);
    };

    return (
        <div className="search-bar">
            <FormControl 
                type="text" 
                placeholder="Search tag..." 
                className="mr-sm-2"
                value={searchField}
                onChange={(e) => onChange(e)}
                onKeyUp={e => e.key === "Enter" ? doSearch(e) : null} />
        </div>
    );
}