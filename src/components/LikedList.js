import { useEffect, useState } from "react";
import { instance } from "../services";
import { getDateAgo } from "../util";
import { AiFillHeart } from "react-icons/ai";
import { IconContext } from "react-icons/lib";
import { Link } from "react-router-dom";

function Like({ like, unlike }) {
    return (
        <div className="thread-wrapper">
            <p>{like.threadAuthor}</p>
            <Link to={`/thread/${like.threadId}`}>
                <h6>{like.threadSubject}</h6>
            </Link>
            <p className="text-muted">
                <IconContext.Provider value={{ className: 'heart-icon-liked' }}>
                    <AiFillHeart onClick={() => unlike(like.threadId)} />
                </IconContext.Provider> Liked {getDateAgo(like.createdAt)} ago
            </p>
        </div>
    );
}

export default function LikedList({ user }) {

    const [likes, setLikes] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        instance.get(`/users/${user.username}/liked`)
            .then((res) => {
                console.log(res.data);
                setLikes(res.data);
            })
            .catch((err) => {
                console.log(err);
                setError(err);
            });
    }, [user.username]);

    function unlike(threadId) {
        instance.delete(`/users/${user.username}/liked/${threadId}`)
            .then((res) => {
                console.log(res.data);
                setLikes([...likes.filter(el => el.threadId !== threadId)]);
            })
            .catch((err) => {
                console.log(err);
                setError(err);
            });
    }

    return (
        <div>
            {likes.map((currentLike) => (
                <Like like={currentLike} unlike={unlike} key={currentLike.id} />
            ))}
        </div>
    );
}