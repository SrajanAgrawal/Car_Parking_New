import { useLocation } from 'react-router-dom'

const PaymentSuccess = () => {
    const location = useLocation()
    const queryParams = new URLSearchParams(location.search);
    console.log("Query Params:", queryParams.get("reference"))
    const reference = queryParams.get("reference")

    // reference
    return (
        <>

            <div className='flex flex-col items-center justify-center h-screen'>
                <img src="https://craftizen.org/wp-content/uploads/2019/02/successful_payment_388054.png" alt="Payment Success" className='w-20 h-20' />
                <h1 className='text-2xl'>Payment Success</h1>
                <h2>Transaction ID: {reference}</h2>
            </div>
        </>
    )
}

export default PaymentSuccess