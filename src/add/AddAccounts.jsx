import React, { useState, useEffect } from 'react'
import Navbar from '../components/Navbar';
import AccountTable from '../components/AccountTable';
import { useFormik } from 'formik';
import { Link, useNavigate, } from 'react-router-dom';
import {  AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddDataAccounts = () => {
  const navigate = useNavigate();
  const [clientList, setClientList] = useState([]);
  // url base
  const umaxUrl = 'https://umaxx-1-v8834930.deta.app';

  // GET DATA CLIENT
  async function fetchClientData() {
    try {
      const token = localStorage.getItem('jwtToken');
      const response = await fetch(`${umaxUrl}/client-by-tenant`, {
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status} - ${response.statusText}`);
      }
  
      const data = await response.json();
  
      if (data && Array.isArray(data.Data)) {
        setClientList(data.Data);
      } else {
        console.error('Error: Unexpected data format for client list');
      }
    } catch (error) {
      console.error("Error fetching client data:", error.message);
    }
  }
  
  
  useEffect(() => {
    fetchClientData();
  }, []);
  
  // END GET DATA CLIENT

  // ADD DATA
  const [passwordMatch, setPasswordMatch] = useState(true);
  const formik = useFormik({
    initialValues: {
      username: '',
      client_id: '',
      platform: '',
      email: '',
      password: '',
      confirm_password: '',
      status: '',
      notes: '',
    },
   

    onSubmit: (values) => {
      if (values.password !== values.confirm_password) {
        setPasswordMatch(false);
        return;
    }
      const token = localStorage.getItem('jwtToken');
      if (
        values.username &&
        values.client_id &&
        values.platform &&
        values.email &&
        values.password &&
        values.confirm_password &&
        values.status &&
        values.notes
    ) {
      fetch(`${umaxUrl}/account-create`, {
          method: 'POST',
          headers: {
              'accept': 'application/json',
              'Content-Type': 'application/x-www-form-urlencoded',
              'Authorization': `Bearer ${token}`,
          },
          body: new URLSearchParams(values).toString(),
      })
          .then(response => response.json())
          .then(data => {
              console.log(data);
              if (data && data.success) {
                toast.success('Data added successfully!', {
                  position: toast.POSITION.TOP_CENTER,
                });
                navigate('/Accounts');
              } else {
                // Menampilkan toast ketika data berhasil ditambah
                toast.success('Data added successfully!', {
                  position: 'top-right',
                });
                // navigate('/Accounts');
              }
          })
          .catch(error => {
            console.error(error);
            toast.error('Terjadi kesalahan. Silakan coba lagi nanti.', {
              position: 'top-right',
            });
          }); 
        } else {
          toast.warning('Silakan isi semua field yang wajib diisi.', {
              position: 'top-right',
          });
        }
    },
  });
  // END ADD DATA
  
  // hide password
  const [showPassword, setShowPassword] = useState(false);
  const [showKonfirmasiPassword, setShowKonfirmasiPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const toggleKonfirmasiPasswordVisibility = () => {
    setShowKonfirmasiPassword(!showKonfirmasiPassword);
  };

  // close menggunakan esc
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        console.log("Esc key pressed");
        navigate(-1);
      };
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [navigate]);


  return (
    <main className='bg-slate-100 min-h-screen overflow-hidden'>
      <div>
        <Navbar />
        <div className='bg-white overflow-hidden h-screen w-auto m-2 border rounded-lg'>
          <span className='p-10 relative top-4 text-gray-600 font-medium text-2xl'>Accounts</span>
          <AccountTable />
        </div>
        <div className="fixed z-50 inset-0 flex items-center justify-center">
          <div className="fixed -z-10 inset-0 bg-black bg-opacity-50"></div>
          <form onSubmit={formik.handleSubmit} className=" bg-white p-5 rounded-lg shadow-lg  max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">Account</h2>
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="flex flex-col">
                <label className='pb-2 text-sm ' htmlFor=""><span className='text-red-600 text-lg'>*</span>Name</label>
                <input
                  type="text"
                  name='username'
                  id="username"
                  onChange={formik.handleChange}
                  value={formik.values.username}
                  className="p-2 h-9 w-56 border focus:border-blue-500 focus:outline-none  focus:border-2 bg-slate-100 border-slate-300 rounded-md"
                />
              </div>
              <div className="flex flex-col">
                <label className="pb-2 text-sm" htmlFor="client_name">
                <span className='text-red-600 text-lg'>*</span>Client
                </label>
                <select
                  name="client_id"
                  id="client_id"
                  onChange={formik.handleChange}
                  value={formik.values.client_id}
                  className="px-3 text-slate-500 h-9 w-full border focus:border-blue-500 focus:outline-none focus:border-2 bg-slate-100 border-slate-300 rounded-md select-custom-width"
                >
                  <option hidden>-Select Client-</option>   
                  {clientList.map((client) => ( 
                    <option key={client._id} value={client._id}>
                      {client.name}
                    </option>
                  ))}
                </select>

              </div>
            </div>
            {/* </div> */}

            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="flex flex-col">
                <label className='pb-2 text-sm ' htmlFor=""><span className='text-red-600 text-lg'>*</span>Platform</label>
                <select
                  name="platform"
                  id="platform"
                  onChange={formik.handleChange}
                  value={formik.values.platform}
                  className="px-3 text-slate-500 h-9 w-56 border  focus:border-blue-500 focus:outline-none  focus:border-2 bg-slate-100 border-slate-300 rounded-md "
                >
                  <option hidden>Select Platform...</option>
                  <option value="1">Meta Ads</option>
                  <option value="2">Google Ads</option>
                  <option value="3">Tiktok Ads</option>
                </select>
              </div>

              <div className='flex' >
                <div className="flex flex-col">
                  <label className='pb-2 text-sm ' htmlFor=""><span className='text-red-600 text-lg'>*</span>Email</label>
                  <input type="email"
                    name='email'
                    id="email"
                    onChange={formik.handleChange}
                    value={formik.values.email}
                    className="px-3 text-slate-500 rounded-md w-56 h-9 border focus:border-blue-500 focus:outline-none  focus:border-2 bg-slate-100 border-slate-300 "
                  />
                </div>
              </div>

            </div>

            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="flex flex-col">
                <label className="pb-2 text-sm" htmlFor="">
                <span className='text-red-600 text-lg'>*</span>Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name='password'
                    id="password"
                    onChange={formik.handleChange}
                    value={formik.values.password}
                    className="p-2 h-9 w-56 border  focus:border-blue-500 focus:outline-none  focus:border-2 bg-slate-100 border-slate-300 rounded-md pr-10"
                  />
                  <div
                    className="absolute top-3 right-2  cursor-pointer"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? (
                      <AiOutlineEyeInvisible size={15} />
                    ) : (
                      <AiOutlineEye size={15} />
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-col">
                <label className="pb-2 text-sm" htmlFor="">
                <span className='text-red-600 text-lg'>*</span>Confirm password 
                </label>
                <div className="relative">
                  <input
                    type={showKonfirmasiPassword ? 'text' : 'password'}
                    name='confirm_password'
                    id="confirm_password"
                    onChange={formik.handleChange}
                    value={formik.values.confirm_password }
                    className="p-2 h-9 w-56 border  focus:border-blue-500 focus:outline-none  focus:border-2 bg-slate-100 border-slate-300 rounded-md pr-10"
                  />
                 
                  <div
                    className="absolute top-3 right-2  cursor-pointer"
                    onClick={toggleKonfirmasiPasswordVisibility}
                  >
                    {showKonfirmasiPassword ? (
                      <AiOutlineEyeInvisible size={15} />
                    ) : (
                      <AiOutlineEye size={15} />
                    )}
                    
                  </div>
                  
                </div>
                {!passwordMatch && (
                    <span className="text-red-500 text-sm relative bottom-0 left-0 mb-2 ml-2">
                    Password tidak sama!
                    </span>
                    )}
                    
              </div>
    
            </div>



            <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex flex-col">
                <label className='pb-2 text-sm' htmlFor=""><span className='text-red-600 text-lg'>*</span>Status</label>
                <select
                  name="status"
                  id="status"
                  onChange={formik.handleChange}
                  value={formik.values.status}
                  className="px-3 text-slate-500 h-9 w-56 border focus:border-blue-500 focus:outline-none  focus:border-2 bg-slate-100 border-slate-300 rounded-md "
                >
                  <option hidden>Select Status...</option>
                  <option value="1">Active</option>
                  <option value="2">Deactive</option>
                </select>
              </div>


              <div className="flex flex-col">
                <label className='pb-2 text-sm ' htmlFor=""><span className='text-red-600 text-lg'>*</span>Notes</label>
                <textarea
                  name='notes'
                  id="notes"
                  onChange={formik.handleChange}
                  value={formik.values.notes}
                  className="p-2 max-h-md w-56 text-slate-500 border  focus:border-blue-500 focus:outline-none  focus:border-2 bg-slate-100 border-slate-300 rounded-md"
                ></textarea>
              </div>



            </div>


            <div className="flex justify-end">
              {/* Tombol Save */}
              <Link to="/Accounts">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="text-gray-500 mr-4"
                >
                  Cancel
                </button>
              </Link>
              <button
                type="submit"

                className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-4 rounded"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer />
    </main>
  )
}

export default AddDataAccounts