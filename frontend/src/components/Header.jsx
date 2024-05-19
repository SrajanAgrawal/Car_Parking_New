import { Navbar, Dropdown, Avatar } from "flowbite-react"
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux' // 1st line

import "../styles.css"
import { Link, NavLink } from "react-router-dom"
import { removeUserState } from "../redux/user/userSlicer"
import { useDispatch } from "react-redux"
import { useLocation } from "react-router-dom"
import axios from "axios"
import { BASE_URL } from "../constants.js"
import {toast} from "react-toastify"
import { useNavigate } from "react-router-dom"

const Header = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch()
    const user = useSelector(state => state.user.currentUser) // 2nd line
    console.log(user);
    const [isLoggedin, setIsLoggedin] = useState(false)


    useEffect(() => {
        if (user !== null) {
            console.log("User is logged in")
            setIsLoggedin(true)
        }
    }, [user])

    const handleSignOut = async () => {
        try {
            const res = await axios.post(`${BASE_URL}/api/v1/user/logout`, {}, { withCredentials: true });
      
            if (res.status === 200) {
              // dispatch(signoutSuccess());
              dispatch(removeUserState());
              navigate("/")
              toast("Logged out successfully", { type: "success" })
              console.log(res.message);
            } else {
              toast("Something went wrong", { type: "error" })
              console.log(res.message);
            }
          } catch (error) {
            toast("Something went wrong", { type: "error" })
            console.log(error.message);
          }
    }

    return (
        <>
            <div className="shadow fixed w-full top-0 z-50">
                <Navbar fluid rounded >
                    <Navbar.Brand href="/" >
                        <img src="/images/logo2.jpeg" className="mr-3 h-6 sm:h-9" alt="Flowbite React Logo" />
                        <span className="self-center whitespace-nowrap text-xl font-bold dark:text-white">ParkingSpace</span>
                    </Navbar.Brand>

                    <div className="flex md:order-2 items-center">
                        {
                            isLoggedin && user !== null ?
                                (<Dropdown
                                    className="ml-4"
                                    arrowIcon={false}
                                    inline
                                    label={
                                        <Avatar alt="User settings" img={user.avatar} rounded />
                                    }
                                >
                                    <Dropdown.Header>
                                        <span className="block text-sm">{user.username}</span>
                                        <span className="block truncate text-sm font-medium">{user.email}</span>
                                    </Dropdown.Header>
                                    <Link to={"/dashboard?tab=profile"}>
                                        <Dropdown.Item>Dashboard</Dropdown.Item>
                                    </Link>

                                    <Dropdown.Divider />
                                    <Dropdown.Item onClick={handleSignOut}>Sign out</Dropdown.Item>
                                </Dropdown>) :
                                (
                                    // <a href="/login" > Login </a>
                                    <Link to="/login" > Login </Link>
                                )
                        }
                        <Navbar.Toggle />
                    </div>

                    {/* <div className="flex flex-row items-center justify-between"> */}
                    {/* <div className="flex justify-center text-center"> */}
                    <Navbar.Collapse className="mt-2">
                        <NavLink exact to="/" className={`block py-2 px-4 rounded-md focus:ring-indigo-500 focus:border-indigo-500  ${location.pathname === '/' ? 'bg-indigo-500 text-white font-semibold' : ''}`}>
                            Home
                        </NavLink>
                        <NavLink to="/about" className={`block py-2 px-4 rounded-md ${location.pathname === '/about' ? 'bg-indigo-500 text-white font-semibold' : ''}`}>
                            About
                        </NavLink>
                        <NavLink to="/services" className={`block py-2 px-4 rounded-md ${location.pathname === '/services' ? 'bg-indigo-500 text-white font-semibold' : ''}`}>
                            Services
                        </NavLink>
                        <NavLink to="/contact" className={`block py-2 px-4 rounded-md ${location.pathname === '/contact' ? 'bg-indigo-500 text-white font-semibold' : ''}`}>
                            Contact
                        </NavLink>
                        {
                            (user && user.role && user.role.includes("admin")) && (
                                <NavLink to="/admin" className={`block py-2 px-4 rounded-md ${location.pathname === '/admin' ? 'bg-indigo-500 text-white font-semibold' : ''}`}>
                                    Admin
                                </NavLink>
                            )
                        }
                    </Navbar.Collapse>

                    {/* </div> */}
                    {/* </div> */}


                </Navbar>
            </div>
            
        </>
    )
}

export { Header }
