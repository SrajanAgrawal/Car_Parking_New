import { TextInput, Label, Button } from "flowbite-react"
import { useState } from 'react'
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { saveUserState } from "../redux/user/userSlicer.js"
import { BASE_URL } from "../constants.js"
import { ToastContainer, toast } from 'react-toastify';

const Login = () => {

    const dispatch = useDispatch();

    const navigate = useNavigate()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const [loading, setLoading] = useState(false)

    const handleLoginUser = async (e) => {
        e.preventDefault()
        if (email === "" || password === "") {
            toast("Please fill all the fields", { type: "error" })
        }
        else {
            const user = {
                email: email,
                password: password
            }
            setLoading(true)
            axios.defaults.withCredentials = true;
            // main login (api call to login user)
            await axios.post(`${BASE_URL}/api/v1/user/login`, user).then((res) => {
                console.log(res.data)
                // to dispatch the global state
                dispatch(saveUserState(res.data.data))
                
                toast(`${res.data.message}`, { type: "success" })
                console.log(res.data.data)
                if(res.data.data.isVerified === false) {
                    
                    navigate("/verify-email")
                    return;
                } 
                navigate("/")
                // window.location.href = "/"

            }).catch((err) => {
                console.log(err)
                toast(`${err.response.data.message}`, { type: "error" })
                setLoading(false);
                
            })
        }
    }

    return (
        <>
            <div className="h-screen overflow-hidden flex flex-col md:flex-row justify-around mt-10">

                <div className="hero-section w-[100%] md:w-[50%] z-10">

                </div>
                <div className="w-[100%] md:w-[50%] overflow-y-auto flex flex-col items-center justify-center">
                    <h1 className="text-3xl underline font-medium font-mono">Login </h1>
                    <p className=" text-sm text-gray-600">(All fields marked with * are required.)</p>
                    
                    <form className="w-[100%] flex flex-col items-center py-12">
                        {/* email */}

                        <div className="w-3/5 mb-4">
                            <div className="mb-2 block">
                                <Label htmlFor="email" value="Your Email" />
                            </div>
                            <TextInput id="email" type="email" placeholder="abc@abc.com" required onChange={(e) => {
                                setEmail(e.target.value)
                            }} />
                        </div>

                        {/* Password */}
                        <div className="w-3/5 mb-4">
                            <div className="mb-2 block">
                                <Label htmlFor="password" value="Your Password" />
                            </div>
                            <TextInput id="password" type="password" placeholder="Must Include (!@#$%^&*())" required onChange={(e) => { setPassword(e.target.value) }} />
                        </div>

                        {/* Submit Button */}
                        {
                            loading ? 
                            (
                                <div className="w-3/5">
                                    <Button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" type="submit" disabled>
                                        Loading...
                                    </Button>
                                </div>
                            ) : 
                            (
                                <div className="w-3/5">
                                    <Button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" type="submit" onClick={handleLoginUser}>
                                        Login
                                    </Button>
                                </div>
                            )
                        
                        }
                        <div className="text-xl" >
                            Don&apos;t have an account? <a href="/register" className="text-blue-500">Register Here</a>
                        </div>
                        
                    </form>
                </div>
            </div>
            <ToastContainer />
        </>
    )
}

export { Login }