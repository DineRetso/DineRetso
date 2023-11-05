import React, { useEffect, useState } from "react";
import { getError } from "../../utils";
import axios from "axios";
import ViewCustomers from "../../Components/Dine/ViewCustomers";

export default function DineCustomers() {
  const dineInfo = JSON.parse(localStorage.getItem("dineInfo"));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCustomerData, setSelectedCustomerData] = useState(null);

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const response = await axios.get("/api/admin/getCustomers", {
          headers: { Authorization: `Bearer ${dineInfo.token}` },
        });
        if (response.status === 200) {
          setCustomers(response.data);
        } else {
          console.error("No Customers");
        }
      } catch (error) {
        setError(getError(error));
      } finally {
        setLoading(false);
      }
    };
    fetchCustomer();
  }, [dineInfo.token]);

  const filteredCustomers = customers.filter((customer) => {
    const searchLower = searchQuery.toLowerCase();

    return (
      customer.fName.toLowerCase().includes(searchLower) ||
      customer.lName.toLowerCase().includes(searchLower) ||
      customer.email.toLowerCase().includes(searchLower) ||
      customer.mobileNo.toLowerCase().includes(searchLower) ||
      customer.address.toLowerCase().includes(searchLower)
    );
  });

  const openModal = (customerData) => {
    setSelectedCustomerData(customerData);
    setModalOpen(true);
  };
  const closeModal = (e) => {
    e.preventDefault();
    setModalOpen(false);
  };
  return (
    <div className='lg:ml-72 md:ml-72  sm:ml-72  p-5 font-inter'>
      <div>
        <div className='flex justify-between p-2 border-b'>
          <div>
            <h1 className='text-3xl font-semibold mb-4'>List of Customers</h1>
          </div>
          <div className='border-b p-2 flex justify-center items-center'>
            <i className='material-icons'>search</i>
            <input
              type='text'
              placeholder='Search here...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className='overflow-x-auto mt-2'>
          <table className='w-full'>
            <thead className='bg-orange-500 '>
              <tr className='hidden lg:table-row text-left text-TextColor'>
                <th className='p-2'>Photo</th>
                <th className='p-2'>Name</th>
                <th className='p-2'>Email</th>
                <th className='p-2'>Contact</th>
                <th className='p-2'>Status</th>
                <th className='p-2'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((customer) => (
                <tr
                  key={customer._id}
                  className='text-start border-b hover:cursor-pointer'
                  onClick={() => openModal(customer)}
                >
                  <td className='p-2'>
                    {customer.image ? (
                      <img
                        src={customer.image}
                        className='w-12 h-12 rounded-full mx-auto'
                        alt='customer'
                      />
                    ) : (
                      <img
                        src='/userIcon.png'
                        className='w-12 h-12 rounded-full mx-auto'
                        alt='user-profile'
                      />
                    )}
                  </td>
                  <td className='p-2'>
                    {customer.fName} {customer.lName}
                  </td>
                  <td className='hidden lg:table-cell p-2'>{customer.email}</td>
                  <td className='hidden lg:table-cell p-2'>
                    {customer.mobileNo}
                  </td>
                  <td className='p-2'>
                    {customer.isOwner ? (
                      <div>
                        <h1>Owner</h1>
                      </div>
                    ) : (
                      <div>
                        <h1>Customer</h1>
                      </div>
                    )}
                  </td>
                  <td className='p-2'>
                    <div>
                      <button>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {modalOpen && (
        <ViewCustomers
          closeModal={closeModal}
          customerData={selectedCustomerData}
        />
      )}
    </div>
  );
}
