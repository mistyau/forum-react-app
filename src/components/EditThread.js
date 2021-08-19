import axios from "axios";
import { useEffect, useReducer } from "react";
import { useParams } from "react-router";

const formReducer = (state, event) => {
    return {
        ...state,
        [event.name]: event.value
    };
}

const baseURL = "http://localhost:8080/api/v1";

export default function EditThread({ user }) {
    const [formData, setFormData] = useReducer(formReducer, {});
    const { id } = useParams();

    const handleSubmit = e => {
        e.preventDefault();

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`
        }

        const editedThread = {
            subject: formData.subject
        };

        console.log(editedThread);

        axios.put(baseURL + `/users/${user.username}/threads/${id}`, editedThread, {
            headers: headers
        }).then(response => {
            console.log(response.data);
        }).catch(error => {
            console.log(error);
        });
    }

    const handleChange = e => {
        setFormData({
            name: e.target.name,
            value: e.target.value
        })
    }

    return (
        <div className="edit-thread-wrapper">
            <h3>Edit Thread</h3>
            <form onSubmit={handleSubmit}>
                <label>
                    <p>Thread Subject</p>
                    <input  name="subject" 
                            type="text"
                            onChange={handleChange}
                            value={formData.subject || ''}/>
                </label>
                <div>
                    <button type="submit">Submit</button>
                </div>
            </form>
        </div>   
    );
}