import { useState } from "react";
import pb from "../services/pocketbase";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [otpId, setOtpId] = useState("");

  const allowedDomain = "research.iiit.ac.in";

  const sendOtp = async () => {
    
    try{
        const tempPassword = Math.random().toString(36).slice(2) + Date.now();
           await pb.collection('users').create({
                "email": email,
                "emailVisibility": true,
                "password": tempPassword,
                "passwordConfirm": tempPassword
           });
    } catch (err){
        // User exists
    }
    const req = await pb.collection('users').requestOTP(email);
    setOtpSent(true);
    setOtpId(req.otpId);
    
  };

  const verifyOtp = async () => {
    const authData = await pb.collection('users').authWithOTP(otpId, otp);
    console.log(pb.authStore.record.id)
  };

  return (
    <div className="h-screen flex items-center justify-center bg-base-200">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Login with Email</h2>

          <input
            type="email"
            placeholder="you@iiit.ac.in"
            className="input input-bordered"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {otpSent && (
            <input
              type="text"
              placeholder="Enter OTP"
              className="input input-bordered mt-2"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
          )}

          <div className="card-actions justify-end mt-4">
            {!otpSent ? (
              <button className="btn btn-primary" onClick={sendOtp}>
                Send OTP
              </button>
            ) : (
              <button className="btn btn-success" onClick={verifyOtp}>
                Verify OTP
              </button>
            )}
          </div>

          {error && <div className="text-error mt-2">{error}</div>}
          {message && <div className="text-success mt-2">{message}</div>}
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
