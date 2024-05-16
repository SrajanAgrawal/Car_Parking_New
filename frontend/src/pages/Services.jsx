const Services = () => {
  return (
    <div className="bg-white min-h-screen flex items-center mt-10">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4 text-center">Our Services</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Service 1: Book Car Park */}
          <div className="bg-gray-100 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-2">Book Car Park</h2>
            <p className="text-gray-800">
              Easily book your parking space in advance using our intuitive booking system.
            </p>
          </div>

          {/* Service 2: Easy Parking */}
          <div className="bg-gray-100 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-2">Easy Parking</h2>
            <p className="text-gray-800">
              Our system makes parking hassle-free, allowing you to find available spots quickly.
            </p>
          </div>

          {/* Service 3: Secure Parking */}
          <div className="bg-gray-100 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-2">Secure Parking</h2>
            <p className="text-gray-800">
              Rest assured that your vehicle is safe and secure in our monitored parking facilities.
            </p>
          </div>

          {/* Service 4: Car Washing */}
          <div className="bg-gray-100 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-2">Car Washing</h2>
            <p className="text-gray-800">
              Treat your car to a cleaning session while you park, ensuring it looks its best.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;
