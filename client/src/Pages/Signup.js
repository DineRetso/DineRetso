import React, { useContext, useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Store } from "../Store";
import bcrypt from "bcryptjs";
import LoadingSpinner from "../Components/LoadingSpinner";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

const Signup = () => {
  const { state, dispatch: ctxDispatch } = useContext(Store);
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
    const expirationTime = new Date().getTime() + 2 * 60 * 1000;
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
    ctxDispatch({ type: "USER_SIGNIN", payload: userData });
    localStorage.setItem("userInfo", JSON.stringify(userData));
    if (email) {
      sendOTPEmail();
    } else {
      toast.error("Please enter a valid email address.");
    }
  };

  return (
    <div
      className='w-full bg-cover relative bg-opacity-25'
      style={{
        backgroundImage: 'url("../bgsignup.png")',
      }}
    >
      <div className='flex font-sans justify-center items-center h-auto'>
        {loading ? (
          <LoadingSpinner type='OTP' />
        ) : (
          <div className='flex justify-center items-center mt-24 mb-8 bg-TextColor bg-opacity-30 lg:w-1/2 md:w-1/2 sm:w-3/4 w-full rounded-3xl p-11'>
            <form
              onSubmit={signuphandler}
              className='flex flex-col justify-center items-center'
            >
              <div className='rounded-full bg-white w-32 h-32 flex items-center justify-center border border-cyan-950'>
                <FontAwesomeIcon
                  icon={faUser}
                  className='text-cyan-950 text-6xl'
                />
              </div>

              <div className='flex justify-center items-center lg:flex mt-6 md:flex w-full space-x-2'>
                <div className='mb-4 lg:w-1/2 md:w-1/2'>
                  <input
                    className='shadow appearance-none border rounded-3xl w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                    id='fName'
                    type='text'
                    placeholder='First Name'
                    required
                    value={fName}
                    onChange={(e) => setfName(e.target.value)}
                  />
                </div>
                <div className='mb-4 lg:w-1/2 md:w-1/2'>
                  <input
                    className='shadow appearance-none border rounded-3xl w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
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
                  className='shadow appearance-none border rounded-3xl w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
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
                  className='shadow appearance-none border rounded-3xl w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
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
                  className='shadow appearance-none border rounded-3xl w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
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
                  className='shadow appearance-none border rounded-3xl w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                  id='password'
                  type='password'
                  placeholder='Password'
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {password && isPasswordValid(password) && (
                  <span className='text-sm text-green'>Password Valid!</span>
                )}
                {password && !isPasswordValid(password) && (
                  <span className='text-sm text-warning'>
                    Password must have at least 8 characters and contain a
                    symbol, number and Capital.
                  </span>
                )}
              </div>
              <div className='flex w-full mb-6'>
                <input
                  ref={cofirm}
                  className='shadow appearance-none border rounded-3xl w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                  id='confirm'
                  type='password'
                  placeholder='Confirm password'
                  required
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                />
              </div>
              {/* ... (terms and conditions checkbox) */}
              <label className='block text-gray-700 font-bold mb-2 text-BlackColor'>
                Terms and Conditions
              </label>
              <div className='flex w-full mb-6'>
                <div className='text-sm text-gray-700 w-full'>
                  <div
                    className='overflow-y-scroll max-h-40 border bg-TextColor border-gray-300 p-2 rounded'
                    style={{ maxHeight: "160px" }}
                  >
                    <p>
                      <strong>Terms and Conditions for Using DineRetso</strong>
                    </p>
                    <p>
                      Welcome to DineRetso! By signing up and using our website,
                      you agree to the following terms and conditions regarding
                      the collection, use, and protection of your user
                      information:
                    </p>
                    <ol>
                      <li>
                        <strong>User Information</strong>
                        <ol>
                          <li>
                            1.1. Upon signing up for DineRetso to use its
                            services, you may be required to provide certain
                            personal information such as your name, email
                            address, and contact details.
                          </li>
                          <li>
                            1.2. You are responsible for ensuring the accuracy
                            and completeness of the information you provide
                            during sign-up to successfully use DineRetso.
                          </li>
                        </ol>
                      </li>
                      <li>
                        <strong>Use of User Information:</strong>
                        <ol>
                          <li>
                            2.1. We may use the information you provide to
                            personalize your experience on DineRetso, provide
                            relevant recommendations, and improve our services.
                          </li>
                          <li>
                            2.2. Your email information may be used to
                            communicate with you about updates, promotions, and
                            important announcements related to DineRetso.
                          </li>
                          <li>
                            2.3. We will not share, sell, or rent your personal
                            information to third parties without your explicit
                            consent, except as required by law or to fulfill our
                            services.
                          </li>
                          <li>
                            2.4 We use collected data to enhance our website's
                            functionality, and improve user experience.
                          </li>
                        </ol>
                      </li>
                      <li>
                        <strong>Identification and Security:</strong>
                        <ol>
                          <li>
                            3.1. DineRetso may employ identification measures,
                            including but not limited to email verification to
                            secure your account and prevent unauthorized access.
                          </li>
                          <li>
                            3.2. You are responsible for maintaining the
                            confidentiality of your account credentials and for
                            any activities that occur under your account.
                          </li>
                        </ol>
                      </li>
                      <li>
                        <strong>Data Protection:</strong>
                        <ol>
                          <li>
                            4.1. We are committed to protecting your data.
                            However, we cannot guarantee absolute security.
                          </li>
                          <li>
                            4.2 We only protect your personal information
                            internally but you are responsible for protecting
                            your password and personal information outside the
                            website. We are not held liable when a third party
                            has access to it.
                          </li>
                        </ol>
                      </li>
                      <li>
                        <strong>Third Party:</strong>
                        <ol>
                          <li>
                            5.1. DineRetso may contain links to third-party like
                            social media platform. We are not responsible for
                            the privacy practices or content of these social
                            media platform. Please review their respective
                            privacy policies.
                          </li>
                          <li>
                            5.2 We are not responsible in any data breach that
                            might happen when you are using third parties
                            platform.
                          </li>
                        </ol>
                      </li>
                      <li>
                        <strong>Changes to Terms:</strong>
                        <ol>
                          <li>
                            6.1. These terms and conditions may be updated from
                            time to time. We will notify you of any significant
                            changes.
                          </li>
                          <li>
                            6.2. Your continued use of DineRetso after changes
                            to the terms signifies your acceptance of the
                            updated terms.
                          </li>
                        </ol>
                      </li>
                      <li>
                        <strong>Termination:</strong>
                        <ol>
                          <li>
                            7.1. We reserve the right to terminate or suspend
                            your account if you violate these terms or engage in
                            activities harmful to DineRetso or its users.
                          </li>
                          <li>
                            7.2 You have the right to access, modify, or delete
                            your personal information.
                          </li>
                        </ol>
                      </li>
                    </ol>
                  </div>
                  {/* Checkbox */}
                  <div className='mt-2'>
                    <input
                      className='mr-1'
                      type='checkbox'
                      id='terms'
                      onChange={handleCheckBox}
                      required
                    />
                    <label htmlFor='terms' className='text-BlackColor'>
                      I agree to the Terms and Conditions.
                    </label>
                  </div>
                </div>
              </div>
              <div className='flex items-center justify-center rounded-2xl bg-green w-40 '>
                <button
                  className='w-40 text-TextColor font-bold py-2 px-4  focus:outline-none focus:shadow-outline'
                  type='submit'
                >
                  Signup
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Signup;
