import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

// Login component.
// Handles mobile number authentication through OTP verification.
function Login() {
  // Stores the user's mobile number and entered OTP.
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");

  // Controls whether the OTP input screen should be displayed.
  const [otpSent, setOtpSent] = useState(false);

  // Manages API loading state and displays authentication errors.
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Generates an OTP by sending the user's mobile number to the backend.
  const generateOTP = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.post("generateOTP", {
        mobile_number: mobile,
      });

      // Displays the OTP input field when the backend successfully generates an OTP.
      if (response.data.status) {
        setOtpSent(true);
      } else {
        setError(response.data.data || "Unable to generate OTP");
      }
    } catch {
      // Handles errors occurring during the OTP generation request.
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Verifies the entered OTP and authenticates the user.
  const verifyOTP = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.post("validateOTP", {
        mobile_number: mobile,
        otp,
      });

      // Checks whether OTP verification was successful.
      if (response.data.status) {
        const token = response.data.token || response.data.data?.token;

        if (!token) {
          setError(
            "Login succeeded, but the token was not found in the response.",
          );
          return;
        }

        // Stores the authentication token for subsequent API requests.
        localStorage.setItem("token", token);
        navigate("/dashboard");
      } else {
        setError(response.data.data || "Invalid OTP");
      }
    } catch {
      // Handles errors occurring during OTP verification.
      setError("OTP verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Login UI: Displays the mobile number form or OTP verification form
  // depending on the current authentication step.
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow">
        <h1 className="mb-2 text-2xl font-semibold text-gray-800">
          Document Management
        </h1>
        <p className="mb-6 text-sm text-gray-500">
          {otpSent
            ? "Enter the OTP sent to your mobile"
            : "Login using your mobile number"}
        </p>

        {/* Step 1: Collects the mobile number and requests an OTP. */}

        {!otpSent ? (
          <>
            <input
              type="tel"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              placeholder="Enter mobile number"
              className="w-full rounded-lg border p-3"
            />
            <button
              onClick={generateOTP}
              disabled={loading || !mobile.trim()}
              className="mt-4 w-full rounded-lg bg-blue-600 p-3 text-white disabled:opacity-50"
            >
              {loading ? "Sending..." : "Generate OTP"}
            </button>
          </>
        ) : (
          /* Step 2: Collects and verifies the OTP. */
          <>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              className="w-full rounded-lg border p-3"
            />
            <button
              onClick={verifyOTP}
              disabled={loading || !otp.trim()}
              className="mt-4 w-full rounded-lg bg-blue-600 p-3 text-white disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </>
        )}

        {/* Displays authentication errors to the user. */}
        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
      </div>
    </div>
  );
}

export default Login;
