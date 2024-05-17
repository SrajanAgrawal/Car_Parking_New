import { BrowserRouter, Routes, Route } from "react-router-dom"
import { useEffect } from "react"
import axios from "axios"

// components import 
import Home from "./pages/Home.jsx"
import { Header } from "./components/Header.jsx"
import { Login } from "./pages/Login.jsx"
import Register from "./pages/Register.jsx"
import VerifyEmail from "./pages/VerifyEmail.jsx"
import SearchPage from "./pages/SearchPage.jsx"
import ParkingDetailsPage from "./pages/ParkingDetailsPage.jsx"
import 'react-toastify/dist/ReactToastify.css';
import { toast, ToastContainer } from "react-toastify"
import Dashboard from "./pages/Dashboard.jsx"
import About from "./pages/About.jsx"
import Services from "./pages/Services.jsx"
import ContactUs from "./pages/ContactUs.jsx"
import BookingPage from "./pages/BookingPage.jsx"
import { useDispatch } from "react-redux"
import { removeUserState, saveUserState } from "./redux/user/userSlicer.js"
import { baseUrl } from "./constants/baseUrl.js"
import PaymentSuccess from "./pages/PaymentSuccess.jsx"
import PaymentFail from "./pages/PaymentFail.jsx"
import AdminDashboard from "./pages/AdminDashboard.jsx"

function App() {
  const dispatch = useDispatch();
  // const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.post(`${baseUrl}/api/v1/user/currentUser`, {}, { withCredentials: true });
        console.log('User Data:', response.data);
        dispatch(saveUserState(response.data.data))
        toast(`Welcome ${response.data.data.firstName}`, { type: "success" })
        // setUser(response.data.data);
        // Add any additional handling after API call
      } catch (error) {
        console.error('API Error:', error);
        // Handle API error
        dispatch(removeUserState())
      }
    }
    fetchUser();
  }, []);

  return (
    <BrowserRouter>
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/contact" element={<ContactUs />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/parking/:id" element={<ParkingDetailsPage />} />
        <Route path="/booking/:id" element={<BookingPage />} />

        <Route path="/paymentSuccess" element={<PaymentSuccess />} />
        <Route path="/paymentFail" element={<PaymentFail />} />
        <Route path="/admin" element={<AdminDashboard />} />

      </Routes>
      <ToastContainer />
    </BrowserRouter>

  )
}

export default App
