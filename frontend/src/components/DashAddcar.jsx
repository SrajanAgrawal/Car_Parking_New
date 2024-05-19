import { Button, Modal } from "flowbite-react";
import { useSelector } from "react-redux";
import { useState } from "react";
import Select from "react-select";
import { Label, TextInput } from "flowbite-react";
import { baseUrl } from "../constants/baseUrl";
import axios from "axios";
import {  toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { updateUserState } from "../redux/user/userSlicer";
import carTypeOptions from "../constants/carTypeOptions.js";

const DashAddcar = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.currentUser);
  console.log(user);

  const [isOpen, setIsOpen] = useState(false);

  const [carInfo, setCarInfo] = useState({
    vehicleNumber: "",
    registrationNumber: "",
    model: "",
    type: "",
    color: "",
  });

  // car type options

  const handleAddCar = () => {
    console.log("Add Car Clicked");
    setIsOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCarInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (selectedOption) => {
    setCarInfo((prev) => ({
      ...prev,
      type: selectedOption.value,
    }));
  };

  const handleCloseModal = () => {
    setIsOpen(false);
    // Reset carInfo state after closing modal
    setCarInfo({
      registrationNumber: "",
      model: "",
      type: "",
      color: "",
    });
  };

  const handleAddCarSubmit = (e) => {
    e.preventDefault();
    console.log("Car Info:", carInfo);
    if (
      !carInfo.type ||
      !carInfo.registrationNumber ||
      !carInfo.model ||
      !carInfo.color ||
      !carInfo.vehicleNumber
    ) {
      // toast("Please fill all the fields", { type: "error" });
      toast.error('Please Fill All The Fields', {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        });
      return;
    }
    // Add logic to submit car data to backend
    // You can dispatch an action here to add the car to the user's account
    axios
      .post(`${baseUrl}/api/v1/car/add`, carInfo, { withCredentials: true })
      .then((res) => {
        console.log(res.data);
        toast.success(res.data.message, {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          });
        // Update user's carsInfo with the new car
        const updatedCarsInfo = [...user.carsInfo, res.data.data];

        // Update the user state with the new carsInfo array
        dispatch(updateUserState({ ...user, carsInfo: updatedCarsInfo }));
      })
      .catch((err) => {
        toast.error(err.response.data.message , {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          });
        console.log(err);
      });

    handleCloseModal();
  };

  const handleDeleteCar = async (id) => {
    // Add logic to delete car from user's account
    await axios
      .delete(
        `${baseUrl}/api/v1/car/delete?carId=${id}`,
        {},
        { withCredentials: true }
      )
      .then((res) => {
        console.log(res.data);
        
          toast.success(res.data.message, {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            });
        console.log(user);
        const updatedCarsInfo = user.carsInfo.filter((car) => car._id !== id);

        // Update the user state with the filtered carsInfo array
        dispatch(updateUserState({ ...user, carsInfo: updatedCarsInfo }));
      })
      .catch((err) => {
        toast.error(err.response.data.message, {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          });
        console.log(err);
      });

    console.log("Delete Car Clicked");
  };

  return (
    <div className="mt-10 flex flex-col">
    <Button onClick={handleAddCar} className="flex justify-center items-center mx-auto ">
      Add Car
    </Button>
    <div className="flex flex-wrap items-center justify-center md:justify-start mt-10">
      {user.carsInfo.map((car, index) => (
        <div
          key={index}
          className="bg-white rounded-lg border border-gray-300 shadow-lg w-[300px] md:w-auto m-4"
        >
          <div className="p-6 mx-auto items-center w-[300px] ">
            <div className="flex justify-between">
            <h1 className="text-xl font-semibold mb-2">{car.model}</h1>
            <p className="text-gray-700 mb-2">
              {/* <span className="font-semibold">Registration Number:</span>{" "} */}
              {car.registrationNumber}
            </p>
            </div>
            <div className="flex justify-between">
            <p className="text-gray-700 mb-2">
              <span className="font-semibold">Type:</span> {car.type}
            </p>
            <p className="text-gray-700 mb-4">
              <span className="font-semibold">Color:</span> {car.color}
            </p>
            </div>
            <div className="flex justify-center bottom-0">
              <button
                className="px-4 py-2  bg-red-500 text-white rounded-full hover:bg-red-600 focus:outline-none focus:bg-red-600"
                onClick={() => handleDeleteCar(car._id)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  
    {isOpen && (
      <Modal
        show={isOpen}
        size="md"
        onClose={handleCloseModal}
        popup
        title="Add Car"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">
              Add Vehicle
            </h3>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="type" value="Car Type" />
              </div>
              <Select
                id="type"
                options={carTypeOptions}
                name="type"
                value={carTypeOptions.find(
                  (option) => option.value === carInfo.type
                )}
                onChange={handleSelectChange}
                required
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label
                  htmlFor="vehicleNumber"
                  value="Car vehicle Number"
                />
              </div>
              <TextInput
                id="vehicleNumber"
                placeholder="MH XX AB 1234"
                name="vehicleNumber"
                value={carInfo.vehicleNumber.toUpperCase()}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label
                  htmlFor="registrationNumber"
                  value="Car Registration Number"
                />
              </div>
              <TextInput
                id="registrationNumber"
                placeholder="MH XX AB 1234"
                name="registrationNumber"
                value={carInfo.registrationNumber.toUpperCase()}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="model" value="Car Model" />
              </div>
              <TextInput
                id="model"
                placeholder="Maruti Swift"
                name="model"
                value={carInfo.model.toUpperCase()}
                onChange={handleInputChange}
                required
              />
            </div>
  
            <div>
              <div className="mb-2 block">
                <Label htmlFor="color" value="Car Color" />
              </div>
              <TextInput
                id="color"
                placeholder="Red"
                name="color"
                value={carInfo.color.toUpperCase()}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button type="danger" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button onClick={handleAddCarSubmit}>Add Car</Button>
        </Modal.Footer>
      </Modal>
    )}
  
  </div>
  
  );
};

export default DashAddcar;
