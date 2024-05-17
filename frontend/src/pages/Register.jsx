import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Label, FileInput, TextInput } from "flowbite-react";
import { BASE_URL } from "../constants.js";
import "../styles.css";
import { toast, ToastContainer } from "react-toastify";


const Register = () => {
    const navigate = useNavigate();

    const [avatar, setAvatar] = useState(null);
    const [firstName, setFirstName] = useState('');
    const [middleName, setMiddleName] = useState('');
    const [lastName, setLastName] = useState('');
    const [gender, setGender] = useState('');
    const [dob, setDob] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (password !== confirmPassword) {
                setError('Passwords do not match');
                return;
            }
            setLoading(true);
            const formData = new FormData();
            formData.append('avatar', avatar);
            formData.append('firstName', firstName);
            formData.append('lastName', lastName);
            formData.append('middleName', middleName);

            formData.append('gender', gender);
            formData.append('dob', dob);


            formData.append('email', email);
            formData.append('password', password);
            formData.append('phoneNumber', phoneNumber);

            console.log(formData);
           

            const response = await axios.post(`${BASE_URL}/api/v1/user/register`, formData);
            console.log('API Response:', response.data);
            setError('');
            toast(response.data.message, { type: "success" });
            navigate("/verify-email");
        } catch (error) {
            // setError(error.response.data.message);
            console.error('API Error:', error);
        }
    };

    return (
        <div className="h-screen overflow-hidden flex flex-col md:flex-row justify-around mt-10">

            <div className="hero-section w-[100%] md:w-[50%] z-10">

            </div>
            <div className="w-[100%] md:w-[50%] overflow-y-auto hide-scrollbar flex flex-col  items-center py-12">
                <h1 className="text-3xl underline font-medium font-mono">Create Your Account</h1>
                <p className=" text-sm text-gray-600">(All fields marked with * are required.)</p>
                {error && <div className="text-red-500 mb-4">{error}</div>}
                <form className="w-[100%] flex flex-col items-center py-12" onSubmit={handleSubmit}>
                    {/* Upload Avatar */}
                    <div className="mb-4 w-3/5">
                        <div>
                            <Label htmlFor="avatar" value="Upload Your Avatar" />
                        </div>
                        <FileInput id="avatar" sizing="lg" onChange={(e) => setAvatar(e.target.files[0])} />
                    </div>

                    {/* First Name */}
                    <div className="w-3/5 mb-4">
                        <div className="mb-2 block">
                            <Label htmlFor="firstName" value="First Name *" />
                        </div>
                        <TextInput id="firstName" type="text" placeholder="John" required value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                    </div>
                    <div className="w-3/5 mb-4">
                        <div className="mb-2 block">
                            <Label htmlFor="middleName" value="Middle Name" />
                        </div>
                        <TextInput id="middleName" type="text" placeholder="Kumar" value={middleName} onChange={(e) => setMiddleName(e.target.value)} />
                    </div>

                    {/* Last Name */}
                    <div className="w-3/5 mb-4">
                        <div className="mb-2 block">
                            <Label htmlFor="lastName" value="Last Name *" />
                        </div>
                        <TextInput id="lastName" type="text" placeholder="Doe" required value={lastName} onChange={(e) => setLastName(e.target.value)} />
                    </div>

                    {/* Gender */}
                    <div className="w-3/5 mb-4">
                        <div className="mb-2 block">
                            <Label htmlFor="gender" value="Gender *" />
                        </div>
                        <select id="gender" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none" required value={gender} onChange={(e) => setGender(e.target.value)}>
                            <option value="">Select Gender</option>
                            <option value="MALE">Male</option>
                            <option value="FEMALE">Female</option>
                            <option value="OTHERS">Other</option>
                        </select>
                    </div>

                    {/* Date of Birth (DOB) */}
                    <div className="w-3/5 mb-4">
                        <div className="mb-2 block">
                            <Label htmlFor="dob" value="Date of Birth *" />
                        </div>
                        <TextInput id="dob" type="date" placeholder="Date of Birth" required value={dob} onChange={(e) => setDob(e.target.value)} />
                    </div>


                    {/* Email */}
                    <div className="w-3/5 mb-4">
                        <div className="mb-2 block">
                            <Label htmlFor="email" value="Email *" />
                        </div>
                        <TextInput id="email" type="email" placeholder="john.doe@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>

                    {/* Password */}
                    <div className="w-3/5 mb-4">
                        <div className="mb-2 block">
                            <Label htmlFor="password" value="Password *" />
                        </div>
                        <TextInput id="password" type="password" placeholder="Must Include (!@#$%^&*())" required value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>

                    {/* Confirm Password */}
                    <div className="w-3/5 mb-4">
                        <div className="mb-2 block">
                            <Label htmlFor="confirmPassword" value="Confirm Password *" />
                        </div>
                        <TextInput id="confirmPassword" type="password" placeholder="Confirm Password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                    </div>


                    {/* Phone Number */}
                    <div className="w-3/5 mb-4">
                        <div className="mb-2 block">
                            <Label htmlFor="phoneNumber" value="Phone Number *" />
                        </div>
                        <TextInput id="phoneNumber" type="tel" placeholder="123-456-7890" required value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
                    </div>

                    {/* Submit Button */}
                    {
                        loading ? (
                            <div className="w-3/5">
                                <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" disabled>
                                    Loading...
                                </button>
                            </div>
                        ) : (
                            <div className="w-3/5">
                                <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                    Register
                                </button>
                            </div>
                        )
                    }


                    {/* <div className="w-3/5">
                    <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        Register
                    </button>
                </div> */}
                </form>
            </div>
            <ToastContainer />
        </div>
    );
};

export default Register;
