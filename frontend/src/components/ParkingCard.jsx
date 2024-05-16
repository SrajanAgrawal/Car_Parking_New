import { MdNotAccessible } from "react-icons/md";
import { AiFillStar, AiOutlineClockCircle, AiOutlineEnvironment } from 'react-icons/ai';
import { FaAccessibleIcon } from 'react-icons/fa';


const ParkingCard = ({ parking }) => {
    return (
        <div className="flex flex-col justify-between border border-gray-300 rounded p-4">
            <div className="right flex flex-col justify-between items-end">
                <div className="flex flex-row items-center mb-2">
                    <div className="flex flex-row text-center justify-center items-center">
                        <AiFillStar className="mr-1 ml-1 text-yellow-500" />
                        <p className="text-sm mb-0">{parking.ratings}</p>
                    </div>
                    <div className="flex flex-row  text-center justify-center items-center">
                        <AiFillStar className="mr-1 ml-1 text-yellow-500" />
                        <p className="text-sm mb-0">{parking.searchingSpaceRating}</p>
                    </div>
                    <div className="flex flex-row  text-center justify-center items-center">
                        <AiFillStar className="mr-1 ml-1 text-yellow-500" />
                        <p className="text-sm mb-0">{parking.securityRating
                        }</p>
                    </div>
                </div>
                
            </div>
            <div className="left flex flex-col items-end">
                <h2 className="text-lg font-semibold mb-2">{parking.spotName}</h2>
                <p className="text-sm mb-2">{parking.address}</p>
                <p className="text-sm mb-2">Spot Type: {parking.spotType}</p>
                <p className="text-sm mb-2">Availability: {parking.availability}</p>
                {/* <p className="text-sm mb-2">Accessibility: {parking.accessibility ? <FaAccessibleIcon size={24} color="green" /> : <MdNotAccessible size={24} color="green"/>}</p> */}
                <div className="mt-auto">
                    <p className="text-sm">Facilities: {parking.facilities.join(", ")}</p>
                </div>
            </div>
            <div className="right flex flex-col justify-between items-end">
            <div className="flex flex-row items-center mb-2">
                    <p className="text-sm mb-2"> {parking.accessibility ? <FaAccessibleIcon size={18} color="green" /> : <MdNotAccessible size={24} color="green" />}</p>

                </div>
                <div className="flex flex-row items-center mb-2">
                    <AiOutlineClockCircle className="mr-1" />
                    <p className="text-sm mb-0">{parking.operatingHours}</p>
                </div>
                <div className="flex flex-row items-center mb-2">
                    <p className="text-sm mb-0">₹ {parking.ratePerHour} / hour</p>
                </div>
                <div className="flex flex-row items-center mb-2">
                    <p className="text-sm mb-0">₹ {parking.rateOfPeakHour} / hour (Peak)</p>
                </div>

                <div className="flex flex-row items-center">
                    <AiOutlineEnvironment className="mr-1" />
                    <p className="text-sm mb-0">{parking.city}, {parking.state}</p>
                </div>
            </div>
        </div>
    )
}

export default ParkingCard