import React from "react";

export default function Audit({ auditData }) {
  function formatDate(dateString) {
    const options = { year: "numeric", month: "long", day: "numeric" };
    const formattedDate = new Date(dateString).toLocaleDateString(
      undefined,
      options
    );
    return formattedDate;
  }
  return (
    <div className='w-full max-h-screen font-inter'>
      <div className='text-md font-semibold p-2 border-b border-orange-500 rounded-xl text-orange-500'>
        <div className='overflow-x-auto'>
          <table className='min-w-full'>
            <thead>
              <tr className='bg-orange-200 text-TextColor'>
                <th className='p-2 sm:w-40'>Date</th>
                <th className='p-2'>Action</th>
              </tr>
            </thead>
            <tbody>
              {auditData.length > 0 ? (
                auditData.map((audit) => (
                  <tr
                    key={audit._id}
                    className='text-neutrals-500 lg:text-md md:text-md sm-text-md text-sm font-normal border-b'
                  >
                    <td className='p-2 w-40'>{formatDate(audit.createdAt)}</td>
                    <td className='p-2'>{audit.action}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan='2' className='p-2'>
                    No Audit Available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
