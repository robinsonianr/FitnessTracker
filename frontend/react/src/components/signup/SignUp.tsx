import React, {useState} from "react";
import "./signup.scss"
import {useNavigate} from "react-router-dom";
import {createCustomer} from "../../services/client";

export const SignUp = () => {
    const generateAgeOptions = () => {
        const options = [];
        for (let age = 18; age <= 80; age++) {
            options.push(
                <option key={age} value={age}>
                    {age}
                </option>
            );
        }
        return options;
    };


    const [formData, setFormData] = useState({
        "name": "",
        "email": "",
        "password": "",
        "username": "",
        "age": "",
        "gender": ""
    });

    const navigate = useNavigate();

    const handleChange = (event: { target: { name: any; value: any; }; }) => {
        const {name, value} = event.target;
        setFormData((prevFormData) => ({...prevFormData, [name]: value}))
    };
    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();

        await createCustomer(formData).then(() => {
            navigate("/");
            window.location.reload();
        });
    };


    return (
        <div className="signup-form">
            <div className="signup-form-container">
                <h2>Create a Fitness account</h2>
                <form onSubmit={handleSubmit}>
                    {/* Form fields go here */}
                    <div className="form-group">
                        <label htmlFor="name">Full Name</label>
                        <input type="text" id="name" name="name" value={formData.name} onChange={handleChange}/>
                        <label htmlFor="email">Email</label>
                        <input type="text" id="email" name="email" value={formData.username = formData.email}
                               onChange={handleChange}/>
                        <label htmlFor="password">Password</label>
                        <input type="password" id="password" name="password" value={formData.password}
                               onChange={handleChange}/>
                    </div>
                    <div className="form-group inline">
                        <div className="form-subgroup">
                            <label htmlFor="age">Age</label>
                            <select id="age" name="age" value={formData.age} onChange={handleChange}>
                                <option value="">Select age</option>
                                {generateAgeOptions()}
                            </select>
                        </div>
                        <div className="form-subgroup">
                            <label htmlFor="gender">Gender</label>
                            <select id="gender" name="gender" value={formData.gender} onChange={handleChange}>
                                <option value="">Select gender</option>
                                <option value="MALE">Male</option>
                                <option value="FEMALE">Female</option>
                                <option value="FORBIDDEN">Forbidden</option>
                            </select>
                        </div>
                    </div>
                    {/* Other form fields */}
                    <button type="submit">Create Account</button>
                </form>
                <a href="/login">Already have an account? Login</a>
            </div>
        </div>
    );
};

export default SignUp;