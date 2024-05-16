import { useState } from "react";

const ParkingSpotDetails = ({ spotName, spotType, availability, city }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className={`flex flex-col gap-4 items-center justify-center border w-[100%] border-gray-300 rounded-lg`}
            onClick={() => setIsHovered(!isHovered)}
        // onMouseLeave={() => setIsHovered(false)}
        >

            <h2 className="text-xl font-medium mb-4">Parking Spot Details 🔽</h2>
            {
                isHovered &&
                <div className="">
                    <div className="mb-2 block">
                        <p className="text-xl font-medium">{spotName}</p>
                        <p className="text-xl font-medium">{spotType}</p>
                        <p className="text-xl font-medium">{availability}</p>
                        <p className="text-xl font-medium">{city}</p>
                    </div>
                </div>
            }
        </div>
    );
};

export default ParkingSpotDetails;
