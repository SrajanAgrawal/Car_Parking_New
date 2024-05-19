import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { BASE_URL } from "../constants.js";
import axios from "axios";
import SearchComponent from "../components/SearchComponent.jsx";
import { Carousel } from "flowbite-react"
import ParkingCard from "../components/ParkingCard.jsx";
import { useNavigate } from "react-router-dom"

const SearchPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const urlSearchParams = new URLSearchParams(location.search);
  const query = urlSearchParams.get("query");
  const city = urlSearchParams.get("city");

  console.log("Search query from URLSearchParams:", city)
  console.log("Search query from location state:", query);

  const [cityAllParkings, setCityAllParkings] = useState([]) // [parking1, parking2, ...
  const [parkings, setParkings] = useState([]);
  const [spotTypeFilter, setSpotTypeFilter] = useState("All");
  const [accessibilityFilter, setAccessibilityFilter] = useState("All");
  const [levelOfParkingFilter, setLevelOfParkingFilter] = useState("All");

  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        setMessage("Loading...");

        console.log("Query:", query);
        let response;
        if ( query !== null) {
          response = await axios.post(`${BASE_URL}/api/v1/parking/searchParking?city=${query}`);
        } else {
          response = await axios.post(`${BASE_URL}/api/v1/parking/searchParking?searchTerm=${city}`);
        }
        console.log("Search results:", response.data);
        setParkings(response.data.parkingSpots);
        setMessage(`Showing ${parkings.length} results`); // Total Parkings: {parkings.length}
        setCityAllParkings(response.data.parkingSpots);
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    };

    fetchSearchResults();
  }, [query, city]);


  useEffect(() => {
    const fetchParkings = async () => {
      const filteredParkings = cityAllParkings.filter((parking) => {
        if (spotTypeFilter !== "All" && parking.spotType !== spotTypeFilter) {
          return false;
        }
        // if (availabilityFilter !== "All" && parking.availability !== availabilityFilter) {
        //   return false;
        // }
        if (accessibilityFilter !== "All" && (parking.accessibility === false && accessibilityFilter === "Accessible") || (parking.accessibility === true && accessibilityFilter === "Not Accessible")) {
          return false;
        }
        if (levelOfParkingFilter !== "All" && parking.levelOfParking !== levelOfParkingFilter) {
          return false;
        }
        return true;
      });
      setParkings(filteredParkings);
    };
    fetchParkings();
  }, [spotTypeFilter, accessibilityFilter, levelOfParkingFilter]);


  const handleParkingCardClick = (id) => {
    // id of the parking
    console.log("Parking card clicked", id);
    console.log("Parking card clicked");
    navigate(`/parking/${id}`);

  }
  return (
    <div className="h-screen overflow-hidden mt-24 flex flex-col text-center justify-center">

      <div>
        <SearchComponent />
      </div>
      <div className="filters flex flex-col md:flex-row mb-2 justify-around m-auto ">
        <div className="flex items-center mb-2 md:mb-0">
          <label htmlFor="spotTypeFilter" className="mr-2">Spot Type:</label>
          <select id="spotTypeFilter" className="border border-gray-300 rounded px-3 py-1 focus:outline-none" onChange={(e) => setSpotTypeFilter(e.target.value)}>
            <option value="All">All</option>
            <option value="Indoor">Indoor</option>
            <option value="Outdoor">Outdoor</option>
            <option value="Covered">Covered</option>
            <option value="Uncovered">Uncovered</option>
          </select>
        </div>
        
        <div className="flex items-center mb-2 md:mb-0 ml-0 md:ml-4">
          <label htmlFor="accessibilityFilter" className="mr-2">Accessibility:</label>
          <select id="accessibilityFilter" className="border border-gray-300 rounded px-3 py-1 focus:outline-none" onChange={(e) => setAccessibilityFilter(e.target.value)}>
            <option value="All">All</option>
            <option value="Accessible">Accessible</option>
            <option value="Not Accessible">Not Accessible</option>
          </select>
        </div>
        <div className="flex items-center mb-2 md:mb-0 ml-0 md:ml-4">
          <label htmlFor="levelOfParkingFilter" className="mr-2">Level Of Parking:</label>
          <select id="levelOfParkingFilter" className="border border-gray-300 rounded px-3 py-1 focus:outline-none" onChange={(e) => setLevelOfParkingFilter(e.target.value)}>
            <option value="All">All</option>
            <option value="Basement">Basement</option>
            <option value="Ground">Ground</option>
            <option value="Multi-Level">Multi-Level</option>
          </select>
        </div>
      </div>
      <div className="h-screen overflow-hidden flex flex-col md:flex-row justify-around mt-2">

        <div className="hero-section hidden md:flex md:w-[50%] z-10 overflow-y-hidden">

        </div>


        <div className="parkings-card w-full lg:w-1/2 overflow-y-auto overflow-x-hidden hide-scrollbar grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-4 p-5">
          {
            message && <h1 className="text-2xl font-semibold mb-4">{message}</h1>
          }
          {parkings.map((parking) => (
            <div key={parking._id} className="flex flex-col md:flex-row lg:flex-row parking-card border border-gray-300 rounded p-4 space-x-4 h-full" onClick={() => handleParkingCardClick(parking._id)}>
              <div className="lg:w-1/2 md:w-1/2 h-56 sm:h-64 xl:h-80 2xl:h-96 max-w-xs">
                <Carousel indicators={false} pauseOnHover>
                  {parking.images.map((image, index) => (
                    <img key={index} src={image} alt="parking" className="w-full h-full object-cover" />
                  ))}
                </Carousel>
              </div>
              <div className="lg:w-1/2 flex flex-col justify-between">
                <ParkingCard parking={parking} />
              </div>
            </div>
          ))}
        </div>

      </div>

    </div>
  );
};

export default SearchPage;
