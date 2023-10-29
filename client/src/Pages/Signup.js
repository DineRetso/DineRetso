import React, { useContext, useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import bcrypt from "bcryptjs";
import LoadingSpinner from "../Components/LoadingSpinner";
import { toast } from "react-toastify";
import SignupTermsandConditions from "../Components/SignupTermsandConditions";

const Signup = () => {
  const [fName, setfName] = useState("");
  const [lName, setlName] = useState("");
  const [address, setAdd] = useState("");
  const [mobileNo, setMob] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const cofirm = useRef(null);
  const navigate = useNavigate();
  const [showTA, setShowTA] = useState(false);

  //showTermsandconditions
  const showTerms = () => {
    setShowTA(true);
  };
  const closeTerms = () => {
    setShowTA(false);
  };
  //generateOTP
  const generateOTP = () => {
    const digits = "0123456789";
    let otp = "";
    for (let i = 0; i < 6; i++) {
      otp += digits[Math.floor(Math.random() * 10)];
    }
    return otp;
  };
  const otp = generateOTP();
  //confirm password
  const isPasswordValid = (password) => {
    const passwordRegex =
      /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    return passwordRegex.test(password);
  };
  //confirm mobileNo
  const isValidMobileNo = (mobileNo) => {
    const regex = /^(?:\+639|\b09)[0-9]{9}$/;
    return regex.test(mobileNo);
  };
  const sendOTPEmail = async () => {
    try {
      setLoading(true);
      await axios.post(`/api/users/send-otp`, {
        email,
        otp,
      });
      setLoading(false);
      toast.info("OTP sent successfully to your email.");
      navigate("/verifyOTP");
    } catch (error) {
      console.error("Error sending OTP:", error);
      setLoading(false);
      toast.error("Error sending OTP. Please try again later.");
      navigate("/signup");
    }
  };
  const handleCheckBox = (e) => {
    setIsChecked(e.target.checked);
  };
  const signuphandler = async (e) => {
    e.preventDefault();

    if (!isPasswordValid(password)) {
      toast.error("Password must contain symbol, number and capital letter!");
      return;
    }
    if (!isValidMobileNo(mobileNo)) {
      toast.error("Please enter a valid Philippine mobile number.");
      return;
    }
    if (!isChecked) {
      toast.info("Please agree to the Terms and Conditions.");
      return;
    }
    if (password !== confirm) {
      toast.error("Password does not match!");
      setConfirm("");
      cofirm.current.focus();
      return;
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const hashedOTP = await bcrypt.hash(otp, 10);
    const expirationTime = new Date().getTime() + 60 * 60 * 1000;
    const userData = {
      fName,
      lName,
      address,
      mobileNo,
      email,
      password: hashedPassword,
      otp: hashedOTP,
      expiration: expirationTime,
    };
    localStorage.setItem("signupData", JSON.stringify(userData));
    if (email) {
      sendOTPEmail();
    } else {
      toast.error("Please enter a valid email address.");
    }
  };

  return (
    <div className='w-full bg-cover bg-neutrals-700 relative '>
      <div className='w-full flex font-sans justify-center items-center h-auto lg:p-10 md:p-8 sm:p-6 p-3'>
        {loading ? (
          <LoadingSpinner type='OTP' />
        ) : (
          <div className='flex justify-center items-center bg-opacity-30 w-full rounded-3xl lg:p-11'>
            <div className='flex w-full h-full rounded-md'>
              <div className='bg-signup-image hidden md:flex justify-center items-center md:w-7/12 w-5/12 h-auto'></div>
              <div className='w-full'>
                <form
                  onSubmit={signuphandler}
                  className='flex flex-col justify-center bg-TextColor p-5'
                >
                  <div className='flex justify-start items-start border-b border-orange-500 p-5'>
                    <h1 className='text-3xl text-orange-500 font-semibold'>
                      Sign Up
                    </h1>
                  </div>
                  <div className='flex justify-center items-center lg:flex-row md:flex-row flex-col mt-6 md:flex w-full space-x-2'>
                    <div className='flex  mb-4 lg:w-1/2 md:w-1/2 w-full'>
                      <input
                        className='p-3 w-full rounded-md text-sm border outline-orange-500'
                        id='fName'
                        type='text'
                        placeholder='First Name'
                        required
                        value={fName}
                        onChange={(e) => setfName(e.target.value)}
                      />
                    </div>
                    <div className='mb-4 lg:w-1/2 md:w-1/2 w-full'>
                      <input
                        className='p-3 w-full rounded-md text-sm border outline-orange-500'
                        id='lName'
                        type='text'
                        placeholder='Last Name'
                        required
                        value={lName}
                        onChange={(e) => setlName(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className='flex mb-4 w-full'>
                    <input
                      className='p-3 w-full rounded-md text-sm border outline-orange-500'
                      id='address'
                      type='text'
                      placeholder='Address'
                      required
                      value={address}
                      onChange={(e) => setAdd(e.target.value)}
                    />
                  </div>
                  <div className='flex w-full mb-4'>
                    <input
                      className='p-3 w-full rounded-md text-sm border outline-orange-500'
                      id='mobileNo'
                      type='number'
                      placeholder='Mobile No'
                      required
                      value={mobileNo}
                      onChange={(e) => setMob(e.target.value)}
                    />
                  </div>
                  <div className='flex w-full mb-4'>
                    <input
                      className='p-3 w-full rounded-md text-sm border outline-orange-500'
                      id='username'
                      type='email'
                      placeholder='Email'
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className='flex flex-col w-full mb-4'>
                    <input
                      className='p-3 w-full rounded-md text-sm border outline-orange-500'
                      id='password'
                      type='password'
                      placeholder='Password'
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    {password && isPasswordValid(password) && (
                      <span className='text-sm text-green-700'>
                        Password Valid!
                      </span>
                    )}
                    {password && !isPasswordValid(password) && (
                      <span className='text-sm text-red-500'>
                        Password must have at least 8 characters and contain a
                        symbol, number and Capital.
                      </span>
                    )}
                  </div>
                  <div className='flex w-full mb-6'>
                    <input
                      ref={cofirm}
                      className='p-3 w-full rounded-md text-sm border outline-orange-500'
                      id='confirm'
                      type='password'
                      placeholder='Confirm password'
                      required
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                    />
                  </div>
                  {/* ... (terms and conditions checkbox) */}
                  <label
                    className='block text-gray-700 mb-2'
                    onClick={showTA ? closeTerms : showTerms}
                  >
                    See{" "}
                    <span className='text-primary-700 hover:cursor-pointer'>
                      Terms and Conditions
                    </span>
                  </label>
                  <div className='flex w-full mb-6'>
                    <div className='text-sm text-gray-700 w-full'>
                      {showTA && (
                        <SignupTermsandConditions
                          handleCheckBox={handleCheckBox}
                        />
                      )}
                      {/* Checkbox */}

                      <div className='mt-2'>
                        <p>
                          Already have an Account? Go back to{" "}
                          <span>
                            <a
                              href='/login'
                              className='text-red-700 font-bold hover:text-md transition-all duration-100'
                            >
                              Login
                            </a>
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className='w-full flex justify-center items-center'>
                    <div className='border border-orange-500 bg-orange-500 flex justify-center items-center w-1/2 hover:bg-TextColor text-TextColor hover:text-orange-500 transition-all duration-300 p-2 rounded-md'>
                      <button
                        className='w-40 font-bold py-2 px-4  focus:outline-none focus:shadow-outline'
                        type='submit'
                      >
                        Signup
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Signup;
