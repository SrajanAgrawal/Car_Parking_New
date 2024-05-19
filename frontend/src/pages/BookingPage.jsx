import { useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Modal, Button, Label, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import Select from "react-select";
import carTypeOptions from "../constants/carTypeOptions.js";
import axios from "axios";
import { baseUrl } from "../constants/baseUrl.js";
import { updateUserState } from "../redux/user/userSlicer.js";
import {  toast } from "react-toastify";
import { useDispatch } from "react-redux";
import ParkingSpotDetails from "../components/ParkingSpotDetails.jsx";


const BookingPage = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    console.log("Location:", location)

    const queryParams = new URLSearchParams(location.search);
    console.log("Query Params:", queryParams.get("spotName"))

    const currentTimePlus1Hour = new Date();
    currentTimePlus1Hour.setHours(currentTimePlus1Hour.getHours() + 1);

    const currentDate = new Date();
    const maxDate = new Date(currentDate.setDate(currentDate.getDate() + 7)); // 7 days from the current date

    const currentYear1Plus = new Date();
    currentYear1Plus.setFullYear(currentYear1Plus.getFullYear() + 1);
    const spotName = queryParams.get("spotName");
    const spotType = queryParams.get("spotType");
    const availability = queryParams.get("availability");
    const city = queryParams.get("city");
    const ratePerHour = queryParams.get("ratePerHour");

    const user = useSelector(state => state.user.currentUser)
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    // const [bookingId, setBookingId] = useState("");


    // var yourCarOptions = [];
    useEffect(() => {
        console.log("User:", user)
        if (user === null || user === undefined) {

            navigate("/")
            toast.error('Please login to continue', {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                });
        }
        console.log("User:", user);
    }, [user, navigate]);

    const { id } = useParams();

    console.log("id", id)
    let yourCarOptions = [];

    if (user && user.carsInfo) {
        yourCarOptions = user.carsInfo.map((car) => ({
            value: car._id,
            label: `${car.vehicleNumber} - ${car.model}`,
        }));
    }
    const [bookingDetailsInfo, setBookingDetailsInfo] = useState({
        parkingSpot: id,
        carID: "",
        checkInTime: "",
        checkOutTime: "",
        totalAmount: "",
    });

    var bookingId;

    const [carInfo, setCarInfo] = useState({
        vehicleNumber: "",
        registrationNumber: "",
        model: "",
        type: "",
        color: "",
    });




    const handleAddCar = () => {
        console.log("Add Car Clicked");
        if (!user) {
            toast.error('Please login to Add Car', {
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
        setIsOpen(true);
    }

    const handleSelectChange = (selectedOption) => {
        setCarInfo((prev) => ({
            ...prev,
            type: selectedOption.value,
        }));
    };

    const handleInputChangeBooking = (e) => {
        const { name, value } = e.target;

        // Calculate the current time plus 1 hour


        if (name === "checkInTime") {
            if (new Date(value) >= new Date(bookingDetailsInfo.checkOutTime)) {
               
                toast.error('Check-In time must be before Check-Out time', {
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
            } else if (name === "checkInTime") {
                if (new Date(value) <= new Date()) {
                    
                    toast.error('Check-In time must be after current time', {
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
            }

        }
        else if (name === "checkOutTime") {
            if (new Date(value) <= new Date(bookingDetailsInfo.checkInTime)) {
                toast.error('Check-Out time must be after Check-In time', {
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

        }

        const checkInDateTime = new Date(bookingDetailsInfo.checkInTime);
        const checkOutDateTime = new Date(bookingDetailsInfo.checkOutTime);
        const hoursDifference = Math.abs(checkOutDateTime - checkInDateTime) / 36e5;
        console.log("Hours Difference:", hoursDifference)
        const totalAmount = hoursDifference * ratePerHour;

        setBookingDetailsInfo((prev) => ({
            ...prev,
            [name]: value,
            totalAmount: totalAmount.toFixed(2), // Assuming ratePerHour is in currency units
        }));
    };



    const handleSelectChangeBooking = (selectedOption) => {
        console.log("Selected Option:", selectedOption)
        setBookingDetailsInfo((prev) => ({
            ...prev,
            carID: selectedOption.value,
        }));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCarInfo((prev) => ({
            ...prev,
            [name]: value,
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
        if (!carInfo.type || !carInfo.model || !carInfo.color || !carInfo.vehicleNumber) {
            
            toast.error('Please fill all the fields', {
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
        if (carInfo.registrationNumber === "") {
            carInfo.registrationNumber = "NA";
        }
        // Add logic to submit car data to backend
        // You can dispatch an action here to add the car to the user's account
        axios.post(`${baseUrl}/api/v1/car/add`, carInfo, { withCredentials: true }).then((res) => {

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

        }).catch((err) => {
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
        handleCloseModal();
    };

    const handleMakePayment = async () => {
        try {
            if (!bookingDetailsInfo.carID || !bookingDetailsInfo.checkInTime || !bookingDetailsInfo.checkOutTime || !bookingDetailsInfo.totalAmount) {
               
                toast.error('Please fill all the fields', {
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

            await axios.post(`${baseUrl}/api/v1/booking/makeBooking`, { ...bookingDetailsInfo }, { withCredentials: true }).then((res) => {
                console.log(res.data);
                console.log("Booking ID" + res.data.data.booking._id)

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
                // Update user's bookingHistory with the new booking
                const updatedBookingHistory = [...user.bookingHistory, res.data.data];
                dispatch(updateUserState({ ...user, bookingHistory: updatedBookingHistory }))

                bookingId = res.data.data.booking._id.toString(); // Get the booking ID from the response

                console.log("Booking ID:", bookingId)

            }).catch((err) => {
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
                return err;
            });
            console.log("Booking Details:", bookingDetailsInfo);

            razorpayPayment();


        } catch (error) {
            console.log(error);
        }
    }

    const razorpayPayment = async () => {

        try {

            const { data: { key } } = await axios.get(`${baseUrl}/api/getKey`);
            const { data: { order } } = await axios.post(`${baseUrl}/api/checkout`, { "amount": bookingDetailsInfo.totalAmount })
            var options = {
                key, // Enter the Key ID generated from the Dashboard
                amount: order.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
                currency: "INR",
                name: "ParkingSpace", //your business name
                description: "Test Transaction",
                image: "https://thumbs.dreamstime.com/b/vector-logo-car-bicycle-parking-area-zone-156033342.jpg",
                order_id: order.id, //This is a sample Order ID. Pass the `id` obtained in the response of
                callback_url: `${baseUrl}/api/paymentVerification?bookingId=${bookingId}`,
                prefill: { //We recommend using the prefill parameter to auto-fill customer's contact information especially their phone number
                    "name": user.firstName + " " + user.lastName, //your customer's name
                    "email": user.email,
                    "contact": user.phoneNumber //Provide the customer's phone number for better conversion rates 
                },
                notes: {
                    "address": "Razorpay Corporate Office"
                },
                theme: {
                    "color": "#403f3f"
                }
            };

            console.log(window);
            var razor = new window.Razorpay(options);
            razor.open();
        } catch (error) {
            console.log("error in razorpay payment" + error)
        }

        // Add logic to make payment and booking

    }


    console.log(new Date());


    return (
        <>
            <div className="mt-16 p-2 w-[50%] mx-auto">
                <div className="flex items-center flex-col">
                    <h1 className="text-2xl font-bold mb-4">Booking Page</h1>
                    <ParkingSpotDetails spotName={spotName} spotType={spotType} availability={availability} city={city} />

                </div>


                {/* check in time */}
                <div className="flex flex-col gap-4 items-center p-6 ">
                    <div className="w-10/12">
                        <div className="mb-2 block">
                            <Label htmlFor="checkInTime" color="success" value="Check-In Time" />
                        </div>

                        <TextInput
                            id="checkInTime"
                            type="datetime-local"
                            placeholder="Today"
                            name="checkInTime"
                            value={bookingDetailsInfo.checkInTime}
                            datepicker-title="Select Check-In Time"
                            // min={new Date().toISOString().split("Z")[0]}
                            min={currentTimePlus1Hour.toISOString().slice(0, -8)} // Slice to remove milliseconds and seconds
                            max={maxDate.toISOString().slice(0, -8)} // Slice to remove milliseconds and seconds

                            onChange={handleInputChangeBooking}
                            required
                        />
                    </div>
                    <div className="w-10/12">
                        <div className="mb-2 block">
                            <Label htmlFor="checkOutTime" color="success" value="Check-Out Time" />
                        </div>
                        <TextInput
                            id="checkOutTime"
                            type="datetime-local"
                            datepicker-title="Select Check-Out Time"
                            placeholder="Yesterday"
                            name="checkOutTime"
                            value={bookingDetailsInfo.checkOutTime}
                            // value="2018-06-12T19:30"
                            min={currentTimePlus1Hour.toISOString().slice(0, -8)} // Slice to remove milliseconds and seconds
                            max={currentYear1Plus.toISOString().slice(0, -8)} // Slice to remove milliseconds and seconds

                            onChange={handleInputChangeBooking}
                            required
                        />
                    </div>
                    <div className="w-10/12">
                        <div className="mb-2 block">
                            <Label htmlFor="totalAmount" color="success" value="Total Amount" />
                        </div>
                        <TextInput
                            id="totalAmount"
                            type="number"
                            placeholder={ratePerHour}
                            name="totalAmount"
                            value={bookingDetailsInfo.totalAmount}
                            onChange={handleInputChangeBooking}
                            required

                        />
                    </div>
                    {
                        user && user.carsInfo &&
                        <Select
                            className="w-10/12"
                            id="carID"
                            options={yourCarOptions}
                            placeholder="Select a car"
                            name="carID"
                            value={yourCarOptions.find((option) => option.value === bookingDetailsInfo.carID)}
                            // value={carTypeOptions.find((option) => option.value === carInfo.type)}
                            onChange={handleSelectChangeBooking}
                            required

                        />
                    }
                </div>

                {/* all cars info added by user */}
                <div>




                    <Button onClick={handleAddCar} className="w-[50%] mx-auto ">Add Car</Button>
                    {
                        isOpen && (
                            <Modal
                                show={isOpen} size="md" onClose={handleCloseModal} popup

                                title="Add Car"

                            >
                                <Modal.Header />
                                <Modal.Body>
                                    <div className="space-y-6">
                                        <h3 className="text-xl font-medium text-gray-900 dark:text-white">Add Vehicle </h3>
                                        <p className="text-green-500">Registration Number is not required !</p>
                                        <div>
                                            <div className="mb-2 block">
                                                <Label htmlFor="type" value="Car Type" />
                                            </div>
                                            <Select
                                                id="type"
                                                options={carTypeOptions}
                                                name="type"
                                                value={carTypeOptions.find((option) => option.value === carInfo.type)}
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
                                                <Label htmlFor="registrationNumber" value="Car Registration Number" />
                                            </div>
                                            <TextInput
                                                id="registrationNumber"
                                                placeholder="MH XX AB 1234"
                                                name="registrationNumber"
                                                value={carInfo.registrationNumber.toUpperCase()}
                                                onChange={handleInputChange}

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
                                    <Button type="danger" onClick={handleCloseModal}>Cancel</Button>
                                    <Button onClick={handleAddCarSubmit}>Add Car</Button>
                                </Modal.Footer>
                            </Modal>
                        )
                    }
                </div>

                <div>
                    <Button className="w-[50%] mx-auto mt-4" onClick={handleMakePayment}>Make Payment</Button>
                </div>
            </div>
            
        </>
    );
};

export default BookingPage;
