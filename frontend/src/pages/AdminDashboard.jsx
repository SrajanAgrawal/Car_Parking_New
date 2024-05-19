


import  { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { baseUrl } from "../constants/baseUrl";
import {toast, ToastContainer} from "react-toastify";

const AdminDashboard = () => {
    const user = useSelector((state) => state.user.currentUser);

    // const [something, setSomething] = useState(0);
    const [parking, setParking] = useState(null);

    
    const getParkingInfo = async () => {
        // API call to get parking info
        try {
            
            const parkingInfo = await axios.get(`${baseUrl}/api/v1/admin/getParkingInfo`, { withCredentials: true });
            console.log(parkingInfo.data);
            setParking(parkingInfo.data.parking)
            console.log(parking);
            console.log(parkingInfo);
            console.log("value")
            // setParkingInfo(parkingInfo.data);
            
        } catch (error) {
            console.log(`Error in Admin Page ${error.response.data.message}`)
        }
    };
    
    useEffect(() => {
        if (!user || !user.role || !user.role.includes("admin")) {
            window.location.href = "/login";
        }
        getParkingInfo();
    }, [user, setParking]);

    const handleSpotChange = async (id, isOccupied) => {
        try {
            const changeSpot = await axios.post(`${baseUrl}/api/v1/admin/changeSpotAvailability`, {spotId: id, isOccupied}, { withCredentials: true });
            console.log(changeSpot.data)
            // document.getElementById('spotOccupied').innerHTML = isOccupied ? "True" : "False";
            
            toast.success(changeSpot.data.message, {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                });
            setParking(changeSpot.data.data.parkingId)
        } catch (error) {

            console.log(error.response.data.message)
        }
    }

    return (
        <>
        <div className="mt-16">
            {parking && parking !== null ? (
                <div>
                    <h1 className="text-2xl mb-4 text-center">Parking Details - {parking.spotName}</h1>

                    <div className="overflow-x-auto">
                        <table className="table-auto w-full border-collapse border border-gray-500">
                            <thead>
                                <tr className="bg-gray-200">
                                    <th className="border border-gray-500 px-4 py-2">Building Name</th>
                                    <th className="border border-gray-500 px-4 py-2">Number of Floors</th>
                                    <th className="border border-gray-500 px-4 py-2">Building Address</th>
                                    <th className="border border-gray-500 px-4 py-2">Building Latitude</th>
                                    <th className="border border-gray-500 px-4 py-2">Building Longitude</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="bg-gray-100">
                                    <td className="border border-gray-500 px-4 py-2">{parking.spotName}</td>
                                    <td className="border border-gray-500 px-4 py-2">{parking.city}</td>
                                    <td className="border border-gray-500 px-4 py-2">{parking.state}</td>
                                    <td className="border border-gray-500 px-4 py-2">{parking.country}</td>
                                    <td className="border border-gray-500 px-4 py-2">{parking.address}</td>
                                </tr>
                            </tbody>

                            <tbody>
                                {parking.buildings.map((building, index) => (
                                    <tr key={index} className={index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}>
                                        <td className="border border-gray-500 px-4 py-2">{building.buildingName}</td>
                                        <td className="border border-gray-500 px-4 py-2">{building.floors.length}</td>

                                    </tr>
                                ))}
                            </tbody>
                            {
                                parking.buildings[0].floors[0].spots.map((spot, index) => (
                                    <tbody key={index}>
                                        <tr className={index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}>
                                            <td className="border border-gray-500 px-4 py-2">{spot.parkingSpotNumber}</td>
                                            <td className="border border-gray-500 px-4 py-2">{spot.isOccupied ? "True" : "False"}</td>
                                            <td className="border border-gray-500 px-4 py-2 text-blue-500" onClick={() => handleSpotChange(spot._id, !spot.isOccupied)}>Change</td>  
                                        </tr>
                                    </tbody>
                                ))
                                
                            }
                        </table>
                    </div>
                </div>
            ) : (
                <h1>You are not authorized to access this route</h1>
            )}
        </div>
        <ToastContainer />
        </>
    );
};

export default AdminDashboard;
