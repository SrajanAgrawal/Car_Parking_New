import { Button, Sidebar } from 'flowbite-react';
import {
  HiArrowSmRight,
  HiOutlineUserGroup,
} from 'react-icons/hi';
import { FaCar } from "react-icons/fa";
import { BiSolidUserCircle } from "react-icons/bi";
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { BASE_URL } from "../constants.js"
import { toast } from 'react-toastify';
import { removeUserState } from '../redux/user/userSlicer.js';
import { useNavigate } from 'react-router-dom';


export default function DashSidebar() {

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const user = useSelector(state => state.user.currentUser);
  const [tab, setTab] = useState('');
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);
  const handleSignout = async () => {
    try {
      const res = await axios.post(`${BASE_URL}/api/v1/user/logout`, {}, { withCredentials: true });

      if (res.status === 200) {
        // dispatch(signoutSuccess());
        dispatch(removeUserState());
        navigate("/")
        toast.success('Logged out Successfully', {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          });
        console.log(res.message);
      } else {
        toast.error('something went wrong', {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          });
        console.log(res.message);
      }
    } catch (error) {
      toast.error('Something went wrong', {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        });
      console.log(error.message);
    }
  };
  const [isOpen, setIsOpen] = useState(true);
  const handleCloseButton = () => {
    setIsOpen(false);
  };
  return (
    <>
      <div>
        {
          isOpen ?
          (
            <>
              
              <Sidebar className='w-[70%] md:w-56 fixed'>
                <Sidebar.Items>
                  <Button onClick={handleCloseButton}>X</Button>
                  <Sidebar.ItemGroup className='flex flex-col gap-1'>
                    <Link to='/dashboard?tab=profile'>
                      <Sidebar.Item
                        active={tab === 'profile'}
                        icon={BiSolidUserCircle}
                        // label={currentuser.role.includes["admin"] ? 'Admin' : 'User'}
                        labelColor='dark'
                        as='div'
                      >
                        Profile
                      </Sidebar.Item>
                    </Link>
                    {user && (
                      <Link to='/dashboard?tab=bookings'>
                        <Sidebar.Item
                          active={tab === 'bookings'}
                          icon={FaCar}
                          as='div'
                        >
                          Bookings
                        </Sidebar.Item>
                      </Link>
                    )}
                    {user && (
                      <>
                        <Link to='/dashboard?tab=addcar'>
                          <Sidebar.Item
                            active={tab === 'addcar'}
                            icon={HiOutlineUserGroup}
                            as='div'
                          >
                            Add Vehicle
                          </Sidebar.Item>
                        </Link>

                      </>
                    )}
                    <Sidebar.Item
                      icon={HiArrowSmRight}
                      className='cursor-pointer'
                      onClick={handleSignout}
                    >
                      Sign Out
                    </Sidebar.Item>
                  </Sidebar.ItemGroup>
                </Sidebar.Items>
              </Sidebar>
            </>
          )
          : 
          (
            <Button onClick={() => setIsOpen(true)} className='fixed'>Open</Button>
          )
        }
      </div>
    </>
  );
}