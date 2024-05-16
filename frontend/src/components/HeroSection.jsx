import { useEffect } from "react";

import SearchComponent from "./SearchComponent";

const HeroSection = () => {
    // Array of cities for suggestions
    
    useEffect(() => {
        const heroSection = document.querySelector(".hero-section");
        heroSection.classList.add("fade-in");
    }, []);

    return (
        <div className="hero-section h-screen overflow-hidden text-white flex justify-center items-center">
            <div className="text-center">
                <h1 className="text-4xl font-bold mb-2">Welcome to Parkopedia</h1>
                <p className="text-lg mb-4">Find parking spaces easily with our platform</p>
                <SearchComponent />
                <button className="bg-white text-blue-700 font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300">
                    Learn More &rarr;
                </button>
            </div>
        </div>
    );
};

export default HeroSection;
