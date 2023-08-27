import React from "react";
import Popup from "reactjs-popup";
const MainDashboard = () => {
  return (
    <div>
      <center>
        <p class='text-6xl font-semibold'>DineRetso</p>
        <Popup trigger={<button> Trigger</button>} position='right center'>
          <div>Popup content here !!</div>
        </Popup>
      </center>
    </div>
  );
};

export default MainDashboard;
