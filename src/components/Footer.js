import { AiFillGithub, AiFillLinkedin } from "react-icons/ai";

export default function Footer() {

    return (
        <footer className="footer">
            <div className="container">
                <span className="text-muted">&copy; 2021</span>
                <AiFillGithub className="github-icon" onClick={() => window.open('https://github.com/mistyau', '_blank').focus()} />
                <AiFillLinkedin className="linkedin-icon" onClick={() => alert("i don't have a linkedin")} />
            </div>
        </footer>
    );
}