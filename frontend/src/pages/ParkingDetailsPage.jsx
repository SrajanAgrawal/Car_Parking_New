// import axios from 'axios';
// import { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import { BASE_URL } from '../constants';
// import { Carousel } from 'flowbite-react';
// import { AiFillStar, AiOutlineClockCircle, AiOutlineEnvironment } from 'react-icons/ai';
// import { FaAccessibleIcon } from 'react-icons/fa';
// import { MdNotAccessible } from 'react-icons/md';
// // import { useHistory } from 'react-router-dom';




// const ParkingDetailsPage = () => {
//   const { id } = useParams(); // Get the id parameter from the URL
//   const [parking, setParking] = useState();

//   useEffect(() => {
//     async function fetchParkingDetails() {
//       try {
//         const response = await axios.post(`${BASE_URL}/api/v1/parking/searchParking?id=${id}`);
//         setParking(response.data.parkingSpots[0]);
//       } catch (error) {
//         console.error('Error fetching parking details:', error);
//       }
//     }
//     fetchParkingDetails();
//   }, [id]);



// const handleBookNow = () => {
//   // Redirect to the booking page with the parking data
//   // history.push(`/booking/${id}`, { parking });
//   console.log('Book Now Clicked');

//   window.location.href = `/booking/${id}`;
// }

//   return (
//     <>
//       {parking && (
//         <div className="flex flex-col md:flex-row mt-10 w-[100%] parking-card justify-around items-center rounded p-4 space-x-4 min-h-screen ">
//           <div className="h-56 sm:h-64 xl:h-80 2xl:h-96 w-[50%] max-w-xl">
//             <Carousel indicators={false} pauseOnHover>
//               {parking.images.map((image, index) => (
//                 <img key={index} src={image} alt="parking" className="w-full h-full object-cover" />
//               ))}
//             </Carousel>
//           </div>
//           <div className="flex flex-col justify-between w-[50%]">
//             <div className="flex flex-col justify-between border border-gray-300 rounded p-4">
//               <div className="flex flex-row items-center mb-4">
//                 <AiFillStar className="text-yellow-500" />
//                 <p className="text-sm ml-2">{parking.ratings}</p>
//                 <AiOutlineClockCircle className="text-xl ml-auto" />
//                 <p className="text-sm ml-2">{parking.operatingHours}</p>
//               </div>
//               <h2 className="text-lg font-semibold mb-2">{parking.spotName}</h2>
//               <p className="text-sm mb-2">{parking.address}</p>
//               <p className="text-sm mb-2">Spot Type: {parking.spotType}</p>
//               <p className="text-sm mb-2">Availability: {parking.availability}</p>
//               <div className="flex items-center mb-2">
//                 {parking.facilities.map((facility, index) => (
//                   <span key={index} className="text-sm bg-gray-200 text-gray-800 px-2 py-1 rounded mr-2">{facility}</span>
//                 ))}
//               </div>
//               <div className="flex items-center mb-2">
//                 {parking.accessibility ? <FaAccessibleIcon size={18} color="green" /> : <MdNotAccessible size={24} color="red" />}
//                 <p className="text-sm ml-2">{parking.accessibility ? 'Accessible' : 'Not Accessible'}</p>
//               </div>
//               <div className="flex flex-row items-center">
//                 <AiOutlineEnvironment className="text-xl mr-2" />
//                 <p className="text-sm">{parking.city}, {parking.state}</p>
//               </div>
//             </div>
//             <div>
//               <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4" onClick={handleBookNow}>Book Now</button>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default ParkingDetailsPage;



import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { BASE_URL } from '../constants';
import { Carousel } from 'flowbite-react';
import { AiFillStar, AiOutlineClockCircle, AiOutlineEnvironment } from 'react-icons/ai';
import { FaAccessibleIcon } from 'react-icons/fa';
import { MdNotAccessible } from 'react-icons/md';
// import { useHistory } from 'react-router-dom';

const ParkingDetailsPage = () => {
  const { id } = useParams();
  const [parking, setParking] = useState();
  // const history = useHistory();

  useEffect(() => {
    async function fetchParkingDetails() {
      try {
        const response = await axios.post(`${BASE_URL}/api/v1/parking/searchParking?id=${id}`);
        setParking(response.data.parkingSpots[0]);
      } catch (error) {
        console.error('Error fetching parking details:', error);
      }
    }
    fetchParkingDetails();
  }, [id]);

  // const handleBookNow = () => {
  //   history.push({
  //     pathname: `/booking/${id}`,
  //       state: parking // your data array of objects
  //   })
  //   console.log('Book Now Clicked');
  // }    


  return (
    <>
      {parking && (

        <div className="flex flex-col lg:flex-row mt-10 w-[100%] parking-card justify-around items-center rounded p-4 space-x-4 min-h-screen mt-16 ">
          <div className="h-56 sm:h-64 xl:h-80 2xl:h-96 w-[80%] max-w-xl">
            <Carousel indicators={false} pauseOnHover>
              {parking.images.map((image, index) => (
                <img key={index} src={image} alt="parking" className="w-full h-full object-cover" />
              ))}
            </Carousel>
          </div>

          <div className="flex flex-col justify-between md:w-[50%]">
            <div className="flex flex-col justify-between border border-gray-300 rounded p-4">
              <div className="flex flex-row items-center mb-4">
                <AiFillStar className="text-yellow-500" />
                <p className="text-sm ml-2">{parking.ratings}</p>
                <AiOutlineClockCircle className="text-xl ml-auto" />
                <p className="text-sm ml-2">{parking.operatingHours}</p>
              </div>
              <h2 className="text-lg font-semibold mb-2">{parking.spotName}</h2>
              <p className="text-sm mb-2">{parking.address}</p>
              <p className="text-sm mb-2">Spot Type: {parking.spotType}</p>
              <p className="text-sm mb-2">Availability: {parking.availability}</p>
              <div className="flex items-center mb-2">
                {parking.facilities.map((facility, index) => (
                  <span key={index} className="text-sm bg-gray-200 text-gray-800 px-2 py-1 rounded mr-2">{facility}</span>
                ))}
              </div>
              <div className="flex items-center mb-2">
                {parking.accessibility ? <FaAccessibleIcon size={18} color="green" /> : <MdNotAccessible size={24} color="red" />}
                <p className="text-sm ml-2">{parking.accessibility ? 'Accessible' : 'Not Accessible'}</p>
              </div>
              <div className="flex flex-row items-center">
                <AiOutlineEnvironment className="text-xl mr-2" />
                <p className="text-sm">{parking.city}, {parking.state}</p>
              </div>
            </div>
            <div>

              <Link to={{
                pathname: `/booking/${id}`,
                search: `?spotName=${encodeURIComponent(parking.spotName)}&spotType=${encodeURIComponent(parking.spotType)}&availability=${encodeURIComponent(parking.availability)}&city=${encodeURIComponent(parking.city)}&state=${encodeURIComponent(parking.state)}&address=${encodeURIComponent(parking.address)}&ratings=${encodeURIComponent(parking.ratings)}&operatingHours=${encodeURIComponent(parking.operatingHours)}&images=${encodeURIComponent(parking.images)}&facilities=${encodeURIComponent(parking.facilities)}&accessibility=${encodeURIComponent(parking.accessibility)}&ratePerHour=${encodeURIComponent(parking.ratePerHour)}&rateOfPeakHour=${encodeURIComponent(parking.rateOfPeakHour)}&description=${encodeURIComponent(parking.description)}&levelOfParking=${encodeURIComponent(parking.levelOfParking)}&securityRating=${encodeURIComponent(parking.securityRating)}&searchingSpaceRating=${encodeURIComponent(parking.searchingSpaceRating)}`
              }}
              >
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4" >Book Now</button>

              </Link>


            </div>
          </div>
        </div >
      )}
    </>
  );
};

export default ParkingDetailsPage;
