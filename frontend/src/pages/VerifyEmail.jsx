import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Label, TextInput } from "flowbite-react";
import { BASE_URL } from "../constants";
import { ToastContainer, toast } from "react-toastify";


const VerifyEmail = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(`${BASE_URL}/api/v1/user/verfiy-email`, { email, otp });
            console.log('API Response:', response.data);
            setError(response.data.message);
            toast("Email Verified Successfully", { type: "success" })
            navigate("/login");
        } catch (error) {
            setError(error.response.data.message);
            console.error('API Error:', error.response.data.message);
        }
    };

    return (
        <div className="w-[100%] flex flex-col items-center py-12">
            <h1 className="text-3xl font-bold mb-4">Verify Email</h1>
            {error && <div className="text-red-500 mb-4">{error}</div>}
            <form className="w-[100%] max-w-xs" onSubmit={handleSubmit}>
                {/* Email */}
                <div className="mb-4">
                    <Label htmlFor="email" value="Email" />
                    <TextInput id="email" type="email" placeholder="john.doe@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>

                {/* OTP */}
                <div className="mb-4">
                    <Label htmlFor="otp" value="OTP" />
                    <TextInput id="otp" type="text" placeholder="Enter OTP" required value={otp} onChange={(e) => setOtp(e.target.value)} />
                </div>

                {/* Submit Button */}
                <div>
                    <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        Verify Email
                    </button>
                </div>
            </form>
            <ToastContainer
                position="top-center"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
        </div>
    );
};

export default VerifyEmail;
