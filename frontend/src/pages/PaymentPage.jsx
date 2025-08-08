import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { API_ENDPOINTS } from "../config/api";

const PaymentPage = () => {
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [paymentDetails, setPaymentDetails] = useState({
    upiId: "",
    cardNumber: "",
    cardExpiry: "",
    cardCvv: "",
    accountNumber: "",
    ifscCode: "",
    accountHolderName: "",
  });
  const [processing, setProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const bookingData = location.state?.bookingData;

  if (!bookingData) {
    navigate("/");
    return null;
  }

  const handlePayment = async (e) => {
    e.preventDefault();
    setProcessing(true);

    try {
      const paymentRequest = {
        amount: bookingData.totalAmount,
        paymentMethod: paymentMethod,
        bookingIds: bookingData.bookings ? bookingData.bookings.map((booking) => booking.id) : [], // Use booking IDs from the bookings array
        userId: user.id,
        ...paymentDetails,
      };

      const response = await fetch(`${API_ENDPOINTS.PAYMENT}/process`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(paymentRequest),
      });

      const result = await response.json();

      if (result.success) {
        setPaymentStatus({
          success: true,
          message: "Payment successful! Your booking is confirmed.",
          transactionId: result.transactionId,
        });

        // Redirect to booking confirmation after 3 seconds
        setTimeout(() => {
          navigate("/my-bookings");
        }, 3000);
      } else {
        setPaymentStatus({
          success: false,
          message: result.message || "Payment failed. Please try again.",
        });
      }
    } catch (error) {
      setPaymentStatus({
        success: false,
        message: "Payment processing error. Please try again.",
      });
    } finally {
      setProcessing(false);
    }
  };

  const renderPaymentForm = () => {
    switch (paymentMethod) {
      case "upi":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">UPI ID</label>
              <input type="text" placeholder="example@upi" value={paymentDetails.upiId} onChange={(e) => setPaymentDetails({ ...paymentDetails, upiId: e.target.value })} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" required />
            </div>
          </div>
        );
      case "card":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
              <input type="text" placeholder="1234 5678 9012 3456" value={paymentDetails.cardNumber} onChange={(e) => setPaymentDetails({ ...paymentDetails, cardNumber: e.target.value })} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
                <input type="text" placeholder="MM/YY" value={paymentDetails.cardExpiry} onChange={(e) => setPaymentDetails({ ...paymentDetails, cardExpiry: e.target.value })} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                <input type="text" placeholder="123" value={paymentDetails.cardCvv} onChange={(e) => setPaymentDetails({ ...paymentDetails, cardCvv: e.target.value })} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" required />
              </div>
            </div>
          </div>
        );
      case "netbanking":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Account Number</label>
              <input type="text" placeholder="Enter account number" value={paymentDetails.accountNumber} onChange={(e) => setPaymentDetails({ ...paymentDetails, accountNumber: e.target.value })} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">IFSC Code</label>
              <input type="text" placeholder="Enter IFSC code" value={paymentDetails.ifscCode} onChange={(e) => setPaymentDetails({ ...paymentDetails, ifscCode: e.target.value })} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Account Holder Name</label>
              <input type="text" placeholder="Enter account holder name" value={paymentDetails.accountHolderName} onChange={(e) => setPaymentDetails({ ...paymentDetails, accountHolderName: e.target.value })} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" required />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Payment Gateway</h1>

          {/* Booking Summary */}
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <h2 className="text-lg font-semibold text-blue-800 mb-2">Booking Summary</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Bus:</span> {bookingData.busNumber}
              </div>
              <div>
                <span className="font-medium">Route:</span> {bookingData.source} → {bookingData.destination}
              </div>
              <div>
                <span className="font-medium">Date:</span> {new Date(bookingData.departureTime).toLocaleDateString()}
              </div>
              <div>
                <span className="font-medium">Seats:</span> {bookingData.selectedSeats ? bookingData.selectedSeats.join(", ") : "N/A"}
              </div>
              <div className="col-span-2">
                <span className="font-medium">Total Amount:</span> ₹{bookingData.totalAmount}
              </div>
            </div>
          </div>

          {paymentStatus ? (
            <div className={`rounded-lg p-4 mb-6 ${paymentStatus.success ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}>
              <h3 className="font-semibold mb-2">{paymentStatus.success ? "Payment Successful!" : "Payment Failed"}</h3>
              <p>{paymentStatus.message}</p>
              {paymentStatus.transactionId && <p className="text-sm mt-2">Transaction ID: {paymentStatus.transactionId}</p>}
            </div>
          ) : (
            <form onSubmit={handlePayment}>
              {/* Payment Method Selection */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Select Payment Method</h2>
                <div className="grid grid-cols-3 gap-4">
                  <button type="button" onClick={() => setPaymentMethod("upi")} className={`p-4 border rounded-lg text-center ${paymentMethod === "upi" ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-300 hover:border-gray-400"}`}>
                    <div className="text-2xl mb-2">📱</div>
                    <div className="font-medium">UPI</div>
                  </button>
                  <button type="button" onClick={() => setPaymentMethod("card")} className={`p-4 border rounded-lg text-center ${paymentMethod === "card" ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-300 hover:border-gray-400"}`}>
                    <div className="text-2xl mb-2">💳</div>
                    <div className="font-medium">Card</div>
                  </button>
                  <button type="button" onClick={() => setPaymentMethod("netbanking")} className={`p-4 border rounded-lg text-center ${paymentMethod === "netbanking" ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-300 hover:border-gray-400"}`}>
                    <div className="text-2xl mb-2">🏦</div>
                    <div className="font-medium">Net Banking</div>
                  </button>
                </div>
              </div>

              {/* Payment Form */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Payment Details</h2>
                {renderPaymentForm()}
              </div>

              {/* Total Amount */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium">Total Amount:</span>
                  <span className="text-2xl font-bold text-green-600">₹{bookingData.totalAmount}</span>
                </div>
              </div>

              {/* Submit Button */}
              <button type="submit" disabled={processing} className={`w-full py-3 px-4 rounded-lg font-medium text-white ${processing ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"}`}>
                {processing ? "Processing Payment..." : "Pay ₹" + bookingData.totalAmount}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
