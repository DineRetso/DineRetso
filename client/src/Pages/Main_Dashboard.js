import React from "react";
import Popup from "reactjs-popup";
import { Helmet } from "react-helmet-async";
const MainDashboard = () => {
  return (
    <div className='mt-28'>
      <Helmet>
        <title>DineRetso Digital Marketing Solution</title>
      </Helmet>
      <center>
        <p className='text-6xl font-semibold'>DineRetso</p>
        <Popup trigger={<button> Trigger</button>} position='right center'>
          <div>Popup content here !!</div>
        </Popup>
      </center>
    </div>
  );
};

export default MainDashboard;
