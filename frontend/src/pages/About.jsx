

const About = () => {
    return (
        <div className="bg-white min-h-screen flex flex-col md:flex-row justify-between w-[90%] m-auto items-center">
            <div className="h-96 w-96 md:p-10">
                <img src="/images/logo2.jpeg" alt="About Us" className="w-full h-full object-cover rounded-3xl" />
            </div>
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-4">About Car Parking Management System</h1>
                <p className="text-lg text-gray-800 mb-6">
                    Welcome to our car parking management system! We are dedicated to providing efficient and convenient parking solutions for our customers.
                </p>
                <p className="text-lg text-gray-800 mb-6">
                    Our system allows you to easily book parking spaces, manage your reservations, and make payments online. Say goodbye to the hassle of finding parking spots!
                </p>
                <p className="text-lg text-gray-800 mb-6">
                    Whether you&apos;re a business owner looking to optimize parking for your employees or a driver in need of a reliable parking solution, we&apos;ve got you covered.
                </p>
                <p className="text-lg text-gray-800">
                    Thank you for choosing our car parking management system. We look forward to serving you!
                </p>
            </div>
        </div>
    );
};

export default About;
