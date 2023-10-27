import React, { useRef, useState } from "react";
import { getError } from "../../../utils";
import { toast } from "react-toastify";
import axios from "axios";

export default function ChangePass({ userInfo, userData, closeChangePass }) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [password, setPassword] = useState("");
  const cofirm = useRef(null);

  const isPasswordValid = (password) => {
    const passwordRegex =
      /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    return passwordRegex.test(password);
  };

  const handleChangePass = async (e) => {
    e.preventDefault();
    try {
      if (!isPasswordValid(newPassword)) {
        toast.error("Password must contain symbol, number and capital letter!");
        return;
      }
      if (newPassword !== confirmPass) {
        toast.error("Password does not match!");
        setConfirmPass("");
        cofirm.current.focus();
        return;
      }
      const response = await axios.put(
        `/api/owner/changePassword/${userData._id}`,
        {
          newPassword,
          password,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      if (response.status === 200) {
        toast.success("Password Updated");
        closeChangePass();
      } else if (response.status === 400) {
        toast.error("Invalid Password");
      } else {
        toast.error("User Unavailable.");
      }
    } catch (error) {
      console.error(getError(error));
      toast.error(getError(error));
    }
  };

  return (
    <div className='fixed flex inset-0 items-center justify-center z-50 top-0 left-0 sm:left-auto w-full sm:w-3/4 h-screen'>
      <div className='flex justify-center items-center h-96 sm:w-1/2 bg-orange-500 rounded-xl bg-opacity-70'>
        <form onSubmit={handleChangePass}>
          <div className='w-full flex flex-col'>
            <div className='w-full p-2'>
              <label>New Password</label>
              <input
                className='border-b p-2 w-full'
                placeholder='Enter password save.'
                type='password'
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              {newPassword && isPasswordValid(newPassword) && (
                <span className='text-sm text-green-700'>Password Valid!</span>
              )}
              {newPassword && !isPasswordValid(newPassword) && (
                <span className='text-sm text-red-500'>
                  Password must have at least 8 characters and contain a symbol,
                  number and Capital.
                </span>
              )}
            </div>
            <div className='w-full p-2'>
              <label>Confirm Password</label>
              <input
                ref={cofirm}
                className='border-b p-2 w-full'
                placeholder='Enter password save.'
                type='password'
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
                required
              />
            </div>
            <div className='w-full p-2'>
              <label>Old Password</label>
              <input
                className='border-b p-2 w-full'
                placeholder='Enter password save.'
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className='flex w-full justify-center items-center space-x-2'>
              <div className='border border-red-200 flex justify-center items-center w-40 hover:bg-red-200 text-red-200 hover:text-TextColor transition-all duration-300 p-2 rounded-md'>
                <button type='submit'>Save</button>
              </div>
              <div
                className='border border-red-200 flex justify-center items-center w-40 hover:bg-red-200 text-red-200 hover:text-TextColor transition-all duration-300 p-2 rounded-md'
                onClick={closeChangePass}
              >
                <h1>Cancel</h1>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
