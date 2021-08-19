import axios from "axios";
import { useReducer } from "react";

const baseURL = "http://localhost:8080/api/v1/users";

const formReducer = (state, event) => {

    return {
        ...state,
        [event.name]: event.value
    };
}

export default function CreateThread({ user }) {

    const [formData, setFormData] = useReducer(formReducer, {});

    const handleSubmit = (event) => {
        event.preventDefault();

        const newThread = {
            subject: formData.subject
        };

        console.log(newThread);

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}` 
        };

        axios.post(baseURL + `/${user.username}/threads`, newThread, {
            headers: headers
        }).then(response => console.log(response.data));
    };

    const handleChange = (e) => {
        e.preventDefault();

        setFormData({
            name: e.target.name,
            value: e.target.value
        });
    }

    return (
        <div className="thread-form">
            <h4>Create Thread</h4>
            <form onSubmit={handleSubmit}>
                <label>
                    <p>Thread Subject</p>
                    <input  name="subject" 
                            type="text"
                            onChange={handleChange}
                            value={formData.subject || ''} />
                </label>
                <div>
                    <button type="submit">Submit</button>
                </div>
            </form>
        </div>
    );
}