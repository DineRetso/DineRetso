import React from "react";
import QRCode from "qrcode.react";

function QRCodeGenerator() {
  const currentURL = window.location.href;

  return (
    <div className='mt-32 flex justify-center items-center flex-col space-y-10'>
      <h2>QR Code for Current Page</h2>
      <QRCode value={currentURL} />
      {/* Add a button to trigger the download */}
      <div className='bg-ButtonColor flex justify-center w-60'>
        <button onClick={downloadQRCode}>Download QR Code</button>
      </div>
    </div>
  );
}

function downloadQRCode() {
  // Get the data URL of the QR code
  const qrCodeDataURL = document.querySelector("canvas").toDataURL("image/png");

  // Create an anchor element and set its attributes
  const link = document.createElement("a");
  link.href = qrCodeDataURL;
  link.download = "qrcode.png";

  // Trigger a click event to initiate the download
  link.click();
}

export default QRCodeGenerator;
