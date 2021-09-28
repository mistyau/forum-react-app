import { instance } from "../services";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Tag({ tag, index }) {
    return (
        <Link to={`/search?tagged=${tag.id}`}>
            <p><b>#{index + 1}</b> {tag.id}</p>
        </Link>
    );
}

export default function TopTagsList() {
    
    const [tags, setTags] = useState([]);

    useEffect(() => {
        instance.get('/tags/top')
            .then((res) => {
                console.log(res);
                setTags(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    return (
        <div className="round-box">
            <div className="tags-box">
                <h6>Top Tags</h6>
                {tags.map((currentTag, index) => (
                    <Tag tag={currentTag} index={index} key={currentTag.id} />
                ))}
            </div>
        </div>
    );
}