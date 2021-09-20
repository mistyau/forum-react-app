import ThreadList from "./ThreadList";

export default function Home({ user }) {

    return (
        <div className="homepage">
            <ThreadList user={user} />
        </div>
        
    );
};