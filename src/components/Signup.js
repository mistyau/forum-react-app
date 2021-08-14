import axios from 'axios';
import { useReducer, useState } from "react";

const formReducer = (state, event) => {
    if (event.reset) {
        return {
            username: '',
            password: ''
        };
    }

    return {
        ...state,
        [event.name]: event.value
    };
}

export default function SignUp() {
    const [formData, setFormData] = useReducer(formReducer, {});
    //const [user, setUser] = useState({username: '', password: ''});

    const handleSubmit = event => {
        event.preventDefault();

        const newUser = {
            username: formData.username,
            password: formData.password
        };

        console.log(newUser);

        axios.post("http://localhost:8080/api/v1/users/signup", newUser)
            .then(response => console.log(response.data));
        
        setFormData({reset: true});
    }

    const handleChange = event => {
        setFormData({
            name: event.target.name,
            value: event.target.value
        });
    }

    return (
        <div className="container">
            <h1>Sign Up</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    <p>Username</p>
                    <input
                        name="username"
                        type="text"
                        onChange={handleChange}
                        value={formData.username || ''}/>
                </label>
                <label>
                    <p>Password</p>
                    <input 
                        name="password"
                        type="password"
                        onChange={handleChange}
                        value={formData.password || ''}/>
                </label>
                <div>
                    <button type="submit">Submit</button>
                </div>
            </form>
        </div>
    );
}