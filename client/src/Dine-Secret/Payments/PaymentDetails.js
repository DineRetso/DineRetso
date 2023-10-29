import React from "react";

export default function PaymentDetails({
  payments,
  closePayment,
  formatDate,
  formatMoney,
}) {
  return (
    <div className='fixed inset-0 max-h-screen flex justify-center items-center font-inter text-neutrals-700'>
      <div className=' flex justify-start w-1/4 h-3/5 ml-32 rounded-xl bg-neutrals-200  flex-col p-5'>
        <div className='p-1 '>
          <label className='text-BlackColor'>Date: </label>
          <span className='text-orange-500'>
            {" "}
            {formatDate(payments.createdAt)}
          </span>
        </div>
        <div className='p-1 '>
          <label className='text-BlackColor'>Restaurant ID: </label>
          <span className='text-orange-500'> {payments.payeeResId}</span>
        </div>
        <div className='p-1 '>
          <label className='text-BlackColor'>Payee Name: </label>
          <span className='text-orange-500'> {payments.payeeName}</span>
        </div>
        <div className='p-1 '>
          <label className='text-BlackColor'>Status: </label>
          <span className='text-orange-500'>
            {" "}
            {payments.status === "subscribed" || payments.status === "expired"
              ? "Paid"
              : payments.status}
          </span>
        </div>
        <div className='p-1 '>
          <label className='text-BlackColor'>Date Paid: </label>
          <span className='text-orange-500'>
            {" "}
            {payments.startDate ? formatDate(payments.startDate) : "Not Paid"}
          </span>
        </div>
        <div className='p-1 '>
          <label className='text-BlackColor'>Payment Mode: </label>
          <span className='text-orange-500'> {payments.paymentMode}</span>
        </div>
        <div className='p-1 '>
          <label className='text-BlackColor'>Amount: </label>
          <span className='text-orange-500'>
            {" "}
            {formatMoney(payments.amount)}
          </span>
        </div>
        <div className='p-1 '>
          <label className='text-BlackColor'>Income: </label>
          <span className='text-orange-500'>
            {" "}
            {formatMoney(payments.totalAmount)}
          </span>
        </div>
        <div className='border flex justify-center items-center px-3 rounded-lg border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-TextColor transition-all'>
          <button className='w-full' onClick={closePayment}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
