import { FormControl, InputGroup } from "react-bootstrap";

function Tag({ tag, index, removeTag}) {
    return (
        <li className="tag">
            <span className="tag-title">{tag}</span>
            <span className="tag-close-icon" onClick={() => removeTag(index)} >x</span>
        </li>
    );  
}

export function TagClickable({ tag, findTag }) {
    return (
        <li className="tag" onClick={() => findTag(tag)}>
            <span className="tag-title">{tag}</span>
        </li>
    );  
}
 
export default function Tags({tags, setTags}) {

    const removeTag = (id) => {
        setTags([...tags.filter((tag, index) => index !== id)]);
    };

    const addTag = (event) => {
        if (event.target.value !== "") {
            setTags([...tags, event.target.value]);
            event.target.value = "";
        }
    };

    return (
        <div className="tags-input">
            <ul id="tags">
                {tags.map((tag, index) => (
                    <Tag tag={tag} index={index} removeTag={removeTag} key={index} />
                ))}
            </ul>
            <InputGroup className="mb-3">
                <FormControl
                    type="text"
                    onKeyUp={e => e.key === "Enter" ? addTag(e) : null}
                    placeholder="Press enter to add tags"
                />
            </InputGroup>       
        </div>
    );
}