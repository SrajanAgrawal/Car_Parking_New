import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

function DashBooking() {
  const [bookings, setBookings] = useState([]);
  const user = useSelector((state) => state.user.currentUser);

  useEffect(() => {
    const fetchBookings = async () => {
      if (user === null || user === undefined) {
        return (
          <h1 className="text-2xl font-semibold text-center">
            Please login to view bookings
          </h1>
        );
      }
      setBookings(user.bookingHistory);
    };

    fetchBookings();
  }, [user]);

  function getStatusColor(status) {
    switch (status) {
      case "Checked-out":
        return { textColor: "text-yellow-600", bgColor: "bg-yellow-100" };
      case "Booked":
        return { textColor: "text-green-600", bgColor: "bg-green-100" };
      case "Checked-in":
        return { textColor: "text-red-600", bgColor: "bg-red-100" };
      default:
        return { textColor: "text-gray-600", bgColor: "bg-gray-100" };
    }
  }

  function formatDateTime(dateTime) {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    };
    return new Date(dateTime).toLocaleString("en-US", options);
  }

  return (
    // <div className=" w-[700px] mx-auto p-3 flex flex-row items-center justify-center">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mx-auto p-3 justify-center items-center">
      {Array.isArray(bookings) && bookings.length > 0 ? (
        bookings.map((booking, index) => (
          <div
            key={index}
            className="max-w-md mx-auto bg-white rounded-lg overflow-hidden shadow-lg m-4"
          >
            <div className="px-6 py-4">
              <div className="flex justify-between">
                <div>
                  <h1 className="text-xl font-semibold">
                    {booking.parkingSpot.spotName}
                  </h1>
                  <p className="text-sm text-gray-600">
                    {booking.parkingSpot.city}, {booking.parkingSpot.state}
                  </p>
                </div>
                <p
                  className={`flex text-sm items-center px-4 py-1 ml-4 rounded-full ${getStatusColor(booking.status).textColor
                    } ${getStatusColor(booking.status).bgColor}`}
                >
                  {booking.status}
                </p>
              </div>

              <hr className="mt-1" />
              <div className="flex justify-between mt-2">
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Car:</span>{" "}
                  {booking.carID.model}
                </p>

                <span className="text-right text-sm font-bold text-gray-600">
                  {booking.carID.registrationNumber}
                </span>
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Type:</span>{" "}
                  {booking.carID.type}
                </p>
              </div>

              <div className="flex flex-col mt-2">
                <div className="flex justify-between">
                  <p className="text-sm font-semibold text-gray-600">
                    Check-in Time:
                  </p>
                  <p className="text-sm  text-gray-600">
                    {formatDateTime(booking.checkInTime)}
                  </p>
                </div>
                <div className="flex justify-between mt-2">
                  <p className="text-sm font-semibold text-gray-600">
                    Check-out Time:
                  </p>
                  <p className="text-sm text-gray-600">
                    {formatDateTime(booking.checkOutTime)}
                  </p>
                </div>
              </div>
              <hr className="mt-1" />
              <div className="flex justify-between mt-2">
                <p className="text-xs bg-gray-200 rounded-lg px-2 py-1">
                  Booking Time: {formatDateTime(booking.createdAt)}
                </p>

                <p className="text-sm font-bold text-black-600">
                  Rs. {booking.totalAmount}
                </p>
              </div>
              <div className="flex justify-between mt-2">
                {booking.parkingSpot && (
                  <p className="text-sm text-gray-600">
                    {/* Parking Spot: {booking.parkingSpot.spotName} */}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))
      ) : (
        <>
          <img src="https://visualpharm.com/assets/781/Nothing%20Found-595b40b85ba036ed117dc2eb.svg" alt="Nothing Found" width={200} height={200} />
          <p className="text-2xl ">No bookings found.</p>
        </>
      )
      }
    </div >
  );
}

export default DashBooking;
