import { useNavigate } from 'react-router-dom';
import { citiesArray } from "../constants/citiesArray.js"
import { useState } from 'react';

const SearchComponent = () => {

    const navigate = useNavigate();

    const [searchQuery, setSearchQuery] = useState('');
    // State for the suggestions
    const [suggestions, setSuggestions] = useState([]);

    // Handler for handling search input changes
    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchQuery(value);
        if (value === "") {
            setSuggestions([]);
            return;
        }

        const filteredSuggestions = citiesArray.filter((city) =>
            city.toLowerCase().includes(value.toLowerCase())
        );
        setSuggestions(filteredSuggestions);
    };

    const handleSuggestionClick = (suggestion) => {
        setSearchQuery(suggestion);
        setSuggestions([]);
    };

    // Handler for handling form submission (you can modify this as needed)
    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle search functionality here
        console.log("Search query:", searchQuery);
        // if the query is not from the suggestions list, show error message
        if (!citiesArray.includes(searchQuery)) {
            navigate(`/search?city=${encodeURIComponent(searchQuery)}`);

            return;
        }
        // send the query to the search page
        navigate(`/search?query=${searchQuery}`);
    };



    return (
        <>
            <form onSubmit={handleSubmit} className="flex items-center justify-center">
                <input
                    type="text"
                    placeholder="Search for parking spots..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className=" w-[50%] text-black border border-gray-300 rounded-l px-4 py-2 focus:outline-none"
                />
                <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-r">
                    Search
                </button>
            </form>
            <div className="suggestions-container  p-5 ">
                <ul className="suggestions-list">
                    {suggestions.map((suggestion, index) => (
                        <li key={index} onClick={() => handleSuggestionClick(suggestion)} className="cursor-pointer pb-1">{suggestion}</li>
                    ))}
                </ul>
            </div>
        </>
    )
}

export default SearchComponent