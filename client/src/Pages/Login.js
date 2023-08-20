import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import React, { useState } from "react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  return (
    <div className='relative bg-BackgroundGray flex flex-col lg:flex-row font-sans'>
      <div
        className='w-full lg:w-1/2 h-screen lg:h-auto bg-cover bg-left relative rounded-full transform -translate-x-1/2'
        style={{
          backgroundImage: 'url("../loginbg.jpg")',
          height: "800px",
          width: "100%",
          margin: "-100px 0px 0px 250px",
          zIndex: "-1",
        }}
      ></div>
      <div className='w-full h-full flex flex-col justify-center items-center space-y-5 mt-10 px-4'>
        <div className='rounded-full bg-white w-32 h-32 flex items-center justify-center border border-cyan-950'>
          <FontAwesomeIcon icon={faUser} className='text-cyan-950 text-6xl' />
        </div>
        <form>
          <input
            type='text'
            className='mt-2 p-2 border w-full md:w-3/4 bg-gray-200 rounded-xl'
            placeholder='Email'
            id='email'
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          <input
            type='password'
            className='mt-2 p-2 border w-full md:w-3/4 bg-gray-200 rounded-xl'
            placeholder='Password'
            id='password'
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <button className='mt-4 bg-cyan-950 text-white px-4 py-2 rounded-xl w-full lg:w-1/2'>
            Login
          </button>
          <div className='text-center'>
            <p className='mt-2'>Don't have an account?</p>
            <a href='/signup' className='text-blue-500'>
              <p>Sign up here!</p>
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
