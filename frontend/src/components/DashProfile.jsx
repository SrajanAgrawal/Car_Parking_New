import { useSelector, useDispatch } from "react-redux";
import { Button, TextInput } from "flowbite-react";
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import {
  updateUserState
} from "../redux/user/userSlicer";
import { BASE_URL } from "../constants.js"
import {  toast } from "react-toastify";


export default function DashProfile() {

  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.currentUser);
    console.log("currentuser", user)
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  
  const [loading, setLoading] = useState(false);

  const [firstname, setFirstname] = useState(user.firstName);
  const [middlename, setMiddlename] = useState(user.middleName);
  const [lastname, setLastname] = useState( user.lastName);
  // const [phonenumber, setPhonenumber] = useState(user.phoneNumber);

  const filePickerRef = useRef();
  // const dispatch = useDispatch();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log("file selected")

      console.log(file);
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
      // toast("Image selected", { type: "success" });
    }
  };
  
  const handleUpdate = async (e) => {
    e.preventDefault(); 
    // dispatch(updateStart());
    setLoading(true);

    try {
      const res = await axios.patch(
        `${BASE_URL}/api/v1/user/update-user-account`,
        { firstName: firstname, middleName: middlename, lastName: lastname} , {withCredentials: true}
        // Send updated fullname and email
      );

      if (res.status === 200) {
        dispatch(updateUserState(res.data.data));
        toast.success('Update Successfully!', {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          });
        console.log(res.data);
      } else {
        // dispatch(updateFailure(res.message));
        toast.error('Failed to update profile', {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          });
        console.log(res.message)

      }
    } catch (error) {
      // dispatch(updateFailure(error.message));
      console.log(error.message);
    } finally {
      setLoading(false); // Set loading state back to false
    }
  };

  useEffect(() => {
    if (imageFile) {
      console.log("uploading image");
      toast.info('Uploading image', {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        });
      uploadImage();
    }
    
  }, [imageFile]);

  const uploadImage = async () => {
    // dispatch(updateStart());
    setLoading(true);
    const formData = new FormData();
    formData.append("avatar", imageFile);
    console.log("avatar")
    console.log(formData.get("avatar"))

    try {
      const res = await axios.patch(
        `${BASE_URL}/api/v1/user/update-user-avatar`,
        formData, 
        {withCredentials: true}
      );

      if (res.status === 200) {
        dispatch(updateUserState(res.data.data));
       
        toast.success('Avatar updated successfully', {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          });
        console.log(res.data);
      } else {
        toast.error('Failed to update avatar', {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          });
        console.log(res.message)
      }
    } catch (error) {
      toast.error('Failed to update avatar', {
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
    }finally {
      setLoading(false); // Set loading state back to false
    }
  };

  return (
    <div className="max-w-xl mx-auto  p-3 w-full flex flex-col">
      <h1
         className="my-7 text-center font-semibold text-3xl"
      >
        Profile
      </h1>
      <form className="flex flex-col gap-4" onSubmit={handleUpdate}>
        <input
          type="file"
          id="avatar"
          onChange={handleImageChange}
          ref={filePickerRef}
          hidden
        />
        <div
          className="w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full"
          onClick={() => filePickerRef.current.click()}
        >
          <img
            src={imageFileUrl ?? user.avatar}
            alt="avatarImg"
            className="rounded-full w-full h-full object-cover border-8 border-{lightgray}"
            disabled={loading} 
          />
        </div>
        <TextInput
          type="email"
          id="email"
          placeholder="email"
          defaultValue={user.email}
          disabled
        />
          <TextInput
            type="number"
            id="phoneNumber"
            placeholder="Phone Number"
            defaultValue={user.phoneNumber}
            disabled
          />
        <TextInput
          type="text"
          id="firstname"
          placeholder="First Name"
          defaultValue={user.firstName}
          onChange={(e) => setFirstname(e.target.value)}  
          
        />
        <TextInput
          type="text"
          id="middlename"
          placeholder="Middle Name"
          defaultValue={user.middleName}
          onChange={(e) => setMiddlename(e.target.value)}  
          
        />
        <TextInput
          type="text"
          id="lastname"
          placeholder="Last Name"
          defaultValue={user.lastName}
          onChange={(e) => setLastname(e.target.value)}  
        />
       <Button type="submit" gradientDuoTone="purpleToBlue" outline disabled={loading}>
          {loading ? 'Updating...' : 'Update'}
        </Button>
      </form>
    </div>
  );
}
