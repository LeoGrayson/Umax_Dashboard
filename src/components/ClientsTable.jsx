import React, { useState, useEffect, useRef } from 'react';
import { useTable, useGlobalFilter, usePagination } from 'react-table';
// import data from './DataClient';
import { Link, useNavigate, useParams, } from 'react-router-dom';
import jsPDF from "jspdf";
import 'jspdf-autotable';
import { BsTrash3, BsPlus } from 'react-icons/bs';
import { CiSearch } from 'react-icons/ci';
import { AiOutlineEdit, AiOutlineFilePdf } from 'react-icons/ai';
import { RiFileExcel2Line } from 'react-icons/ri';
import { useDownloadExcel } from "react-export-table-to-excel";
import { useReactToPrint } from 'react-to-print';
import '../styles.css';
import axios from 'axios';
import { useFormik } from 'formik';



function ClientsTable() {
  const [tableData, setTableData] = useState([]);
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const tableRef = useRef(null);
  const [showAddPopup, setShowAddPopup] = useState(false);
  const navigate = useNavigate();


  // DELETE
  // Make a DELETE request to the FastAPI endpoint
  const handleDelete = async (_id) => {
    try {
      const token = localStorage.getItem('jwtToken');
      const response = await axios.delete(
        `https://umax-1-z7228928.deta.app/clients/${_id}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200) {
        // Client deleted successfully, you can update your UI or perform any necessary actions.
        fetchData(); // Assuming fetchData is a function to refresh the client list.
      } else {
        // Handle error if necessary
        console.error('Error deleting client:', response.data);
      }
    } catch (error) {
      // Handle any network or other errors
      console.error('Error deleting client:', error);
    }
  };
  // END DELETE

  // ADD DATA
  const formik = useFormik({
    initialValues: {
      name: '',
      address: '',
      contact: '',
      notes: '',
      status: '',
      is_admin: false,
    },

    onSubmit: (values) => {
      const token = localStorage.getItem('jwtToken');
      // Send a POST request to your FastAPI backend with form data
      fetch('https://umax-1-z7228928.deta.app/clients', {
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
          // Handle the response from the backend (e.g., success message or error)
          console.log(data);
          if (data.message === 'data berhasil ditambah') {
            // Redirect to the dashboard page
            navigate('/clients');
          }
        })
        .catch(error => {
          // Handle errors, e.g., network errors
          console.error(error);
        });

    },
  });
  // END ADD DATA

  // GET DATA
  async function fetchData() {
    try {
      const response = await fetch("https://umax-1-z7228928.deta.app/clients");
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status} - ${response.statusText}`);
      }
      const data = await response.json();
      setTableData(data);
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  }
  useEffect(() => {
    fetchData();
  }, []);
  // END GET DATA

  // UPDATE DATA
  const handleUpdate = async (_id) => {
    // Find the client data to update
    const clientToUpdate = tableData.find(client => client._id === _id);
  
    if (!clientToUpdate) {
      console.error('Client not found for update');
      return;
    }
  
    try {
      // Send a PATCH request to update the client data
      const token = localStorage.getItem('jwtToken');
      const response = await axios.patch(
        `https://umax-1-z7228928.deta.app/clients/${_id}`,
        clientToUpdate, // Send the client data to update
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
  
      if (response.status === 200) {
        console.log('Client data updated successfully:', response.data);
        // You can handle the success as needed, e.g., show a success message
      } else {
        // Handle error if necessary
        console.error('Error updating client data:', response.data);
      }
    } catch (error) {
      // Handle any network or other errors
      console.error('Error updating client data:', error);
    }
  };
  // END UPDATE DATA

  // PAGINATION
  const paginationStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'end',
    marginTop: '20px',
  };

  const buttonStyle = {
    backgroundColor: '#007BFF',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    padding: '5px 10px',
    cursor: 'pointer',
    fontSize: '16px',
    margin: '0 5px',
  };

  const disabledButtonStyle = {
    backgroundColor: '#ccc',
    cursor: 'not-allowed',
  };

  const pageInfoStyle = {
    fontSize: '16px',
    margin: '0 10px',
    color: '#333',
  };
  // END PAGINATION





  const getStatusString = (status) => {
    switch (status) {
      case 1:
        return "Active";
      case 2:
        return "Deactive";
      default:
        return "Unknown";
    }
  };


  const columns = React.useMemo(
    () => [
      // {
      //   Header: 'Id',
      //   accessor: '_id'
      // },
      {
        Header: 'Name',
        accessor: 'name',
      },
      {
        Header: 'Address',
        accessor: 'address',
      },
      {
        Header: 'Contact',
        accessor: 'contact',
      },
      {
        Header: 'Status',
        accessor: 'status',
        Cell: ({ row }) => (
          <div className="flex justify-center">
            {getStatusString(row.original.status)}
          </div>
        ),
      },
      {
        Header: 'Action',
        accessor: 'action',
        Cell: ({ row }) => (
          <div className="flex space-x-2 justify-center">
            <button
              onClick={() => handleDelete(row.original._id)}
              className="bg-red-200 hover:bg-red-300 text-red-600 py-1 px-1 rounded"
            >
              <BsTrash3 />
            </button>
            <button
              onClick={() => {
                handleUpdate(row.origina._id)
              }}
              className="bg-blue-200 hover:bg-blue-300 text-blue-600 py-1 px-1 rounded"
            >
              <AiOutlineEdit />
            </button>
          </div>
        ),
        headerClassName: 'action-column header',
        className: 'action-column',
      },

    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page, // Replace 'rows' with 'page' for paginated data
    state: { pageIndex, pageSize, globalFilter }, // Add these state properties
    setGlobalFilter, // Add this function
    gotoPage, // Add this function
    nextPage, // Add this function
    previousPage, // Add this function
    canNextPage, // Add this function
    canPreviousPage, // Add this function
    pageOptions, // Add this function
    pageCount,
  } = useTable(
    {
      columns,
      data: tableData,
      initialState: { pageIndex: 0, pageSize: 5 },
    },
    useGlobalFilter,
    usePagination
  );

  // const { globalFilter } = state;

  // const handleEdit = (rowId) => {
  //   console.log('Editing row with ID:', rowId);
  // };

  // const handleDelete = (rowId) => {
  //   const updatedData = tableData.filter((row) => row.id !== rowId);
  //   setTableData(updatedData);
  // };

  useEffect(() => {
    const filteredData = tableData.filter((row) => {
      return selectedPlatform === "" || row.platform === selectedPlatform;
    });
    setTableData(filteredData);
  }, [selectedPlatform]);

  const toggleAddPopup = () => {
    setShowAddPopup(!showAddPopup);
  };


  useEffect(() => {
    const closePopupOnEscape = (e) => {
      if (e.key === "Escape") {
        toggleAddPopup();
      }
    };

    if (showAddPopup) {
      window.addEventListener("keydown", closePopupOnEscape);
    }

    return () => {
      window.removeEventListener("keydown", closePopupOnEscape);
    };
  }, [showAddPopup]);

  //export table ke excel
  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: "DataClients",
    sheet: "DataClients",
  });

  const componentPDF = useRef();

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text('Client Data', 14, 15);

    const filteredData = tableData.map((row) => ({
      Name: row.name,
      Address: row.address,
      Contact: row.contact,
      Status: getStatusString(row.status),
    }));

    const tableColumnNames = Object.keys(filteredData[0]);
    const tableColumnValues = filteredData.map((row) => Object.values(row));

    doc.autoTable({
      head: [tableColumnNames],
      body: tableColumnValues,
      startY: 20,
    });

    doc.save('Client.pdf');
  };



  return (
    <div className="border-2 border-slate-200 bg-white p-0 lg:p-5 m-2 lg:m-10 mt-10 rounded-lg relative">
      <div className="container mx-auto p-4 px-0">
        <div className="grid grid-cols-12 gap-2 px-2 md:px-0 -mt-5 mb-2">
          {/* Search bar */}
          <div className="relative col-span-12 lg:col-span-3">
            <input
              type="text"
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              placeholder="Search"
              className="p-2 w-full min-w-0 h-9 pl-8 text-xs border focus:border-gray-500 focus:outline-none focus:ring-0 border-slate-300 rounded-lg"
            />
            <span className="absolute left-2 top-1/2 transform -translate-y-1/2">
              <CiSearch style={{ color: '#9BA0A8' }} />
            </span>
          </div>
          {/* End */}

          {/* bagian status */}
          <div className="relative col-span-12 lg:col-span-3">
            <select
              className="w-full min-w-0 px-1 h-9 text-xs font-medium border focus:border-gray-500 focus:outline-none focus:ring-0 border-slate-300 rounded-lg"
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value)}
            >
              <option hidden>Status</option>
              <option value="Facebook">Active</option>
              <option value="Instagram">Deactive</option>
            </select>
          </div>
          {/* End */}

          {/* div kosong untuk memberi jarak */}
          <div className="hidden lg:block col-span-2"></div>

          {/* Button add data */}
          <button
            type="button"
            data-te-ripple-init
            data-te-ripple-color="light"
            data-te-ripple-centered="true"
            className="col-span-8 lg:col-span-2 flex items-center gap-2 border border-slate-300 h-9 rounded-md focus:border-gray-500 focus:outline-none focus:ring-0 bg-white p-2 text-xs font-medium leading-normal text-gray-800 hover:bg-gray-50"
            onClick={toggleAddPopup} // Memanggil fungsi toggleAddPopup saat tombol "Add" diklik
          >
            <BsPlus className="font-medium text-lg" />
            <span>Add</span>
          </button>

          {/* menu add data */}




          {/* Pop-up menu */}
          {showAddPopup && (
            <div className="fixed z-50 inset-0 flex items-center justify-center">
              <div className="fixed -z-10 inset-0 bg-black bg-opacity-50"></div>
              <form onSubmit={formik.handleSubmit} className="bg-white p-5 rounded-lg shadow-lg max-h-[80vh] overflow-y-auto">
                <h2 className="text-xl font-semibold mb-4" >Client</h2>
                <div className="flex flex-col md:flex-row gap-4 mb-4">
                  <div className="flex flex-col">
                    <label className='pb-2 text-sm ' htmlFor="name">Name</label>
                    <input
                      type="text"
                      name='name'
                      id="name"
                      onChange={formik.handleChange}
                      value={formik.values.name}
                      className="p-2 h-9 w-full border focus:border-blue-500 focus:outline-none focus:border-2 bg-slate-100 border-slate-300 rounded-md"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className='pb-2 text-sm ' htmlFor="address">Address</label>
                    <input
                      type="text"
                      name='address'
                      id="address"
                      onChange={formik.handleChange}
                      value={formik.values.address}
                      className="p-2 h-9 w-full border focus:border-blue-500 focus:outline-none focus:border-2 bg-slate-100 border-slate-300 rounded-md"
                    />
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-4 mb-4">
                  <div className="flex flex-col">
                    <label className='pb-2 text-sm ' htmlFor="contact">Contact</label>
                    <input
                      type="number"
                      id="contact"
                      name='contact'
                      onChange={formik.handleChange}
                      value={formik.values.contact}
                      className="p-2 h-9 w-full border focus:border-blue-500 focus:outline-none focus:border-2 bg-slate-100 border-slate-300 rounded-md"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className='pb-2 text-sm' htmlFor="status">Status</label>
                    <select
                      name='status'
                      id="status"
                      onChange={formik.handleChange}
                      value={formik.values.status}
                      className="px-3 text-slate-500 h-9 w-full border focus:border-blue-500 focus:outline-none focus:border-2 bg-slate-100 border-slate-300 rounded-md select-custom-width"
                    >
                      <option value="1">Active</option>
                      <option value="2">Deactive</option>
                    </select>
                  </div>


                </div>

                <div className="flex flex-col md:flex-row gap-4 mb-4">
                  <div className="flex flex-col">
                    <label className='pb-2 text-sm ' htmlFor="notes">Notes</label>
                    <textarea
                      type='text'
                      name='notes'
                      id="notes"
                      onChange={formik.handleChange}
                      value={formik.values.notes}
                      className="p-2 max-h-md select-custom-width text-slate-500 border focus:border-blue-500 focus:outline-none focus:border-2 bg-slate-100 border-slate-300 rounded-md"
                    ></textarea>
                  </div>
                </div>

                <div className="flex justify-end">
                  {/* Tombol Save */}
                  <button
                    type="button"
                    onClick={toggleAddPopup}
                    className="text-gray-500 mr-4"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    onClick={onsubmit}
                    className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-4 rounded"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          )}



          {/* end */}

          {/* Button export excel */}
          <button
            type="button"
            className="col-span-2 lg:col-span-1 grid place-items-center border border-slate-300 h-9 rounded-md bg-white p-2 hover:bg-gray-50"
            onClick={onDownload}
          >
            <RiFileExcel2Line className="relative font-medium text-lg" />
          </button>
          {/* End */}

          {/* Button export pdf */}
          {/* Button export pdf */}
          {/* End */}

          {/* End */}
          <button
            type="button"
            className="col-span-2 lg:col-span-1 grid place-items-center border border-slate-300 h-9 rounded-md bg-white p-2 hover:bg-gray-50"
            onClick={generatePDF}
          >
            <AiOutlineFilePdf className="relative font-medium text-lg" />
          </button>
        </div>

        <div className="w-full bg-white max-md:overflow-x-scroll" ref={componentPDF}>

          <table
            {...getTableProps()}
            ref={tableRef}
            className="table-auto border-collapse border w-full"
          >
            <thead>
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <th
                      {...column.getHeaderProps()}
                      className={`p-2 text-white bg-sky-700 font-medium border-slate-300 border ${column.id === 'action' || column.id === 'status'
                        ? 'text-center' // Untuk rata tengah
                        : 'text-left' // Untuk kolom lainnya
                        }`}
                    >
                      {column.render('Header')}
                    </th>

                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {page.map((row, i) => {
                prepareRow(row);
                return (
                  <tr
                    {...row.getRowProps()}
                    className={`border border-slate-300 text-gray-600 hover:bg-blue-300 hover:text-gray-700 ${i % 2 === 0 ? 'bg-gray-100' : 'bg-white' // Memberikan latar belakang selang-seling
                      }`}                  >
                    {row.cells.map((cell) => {
                      return (
                        <td

                          {...cell.getCellProps()}

                          {...cell.getCellProps()}

                          className={`p-2 border border-slate-300 ${cell.column.id === 'status' || cell.column.id === 'action'
                            ? 'text-center action-column' // Terapkan kelas CSS khusus
                            : 'text-left'
                            }`}
                        >
                          {cell.render('Cell')}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <div style={paginationStyle}>
          <button
            onClick={() => gotoPage(0)}
            disabled={!canPreviousPage}
            style={{
              ...buttonStyle,
              ...(canPreviousPage ? {} : disabledButtonStyle),
            }}
          >
            {'<<'}
          </button>{' '}
          <button
            onClick={() => previousPage()}
            disabled={!canPreviousPage}
            style={{
              ...buttonStyle,
              ...(canPreviousPage ? {} : disabledButtonStyle),
            }}
          >
            {'<'}
          </button>{' '}
          <span style={pageInfoStyle}>
            Page{' '}
            <strong>
              {pageIndex + 1} of {pageOptions.length}
            </strong>{' '}
          </span>
          <button
            onClick={() => nextPage()}
            disabled={!canNextPage}
            style={{
              ...buttonStyle,
              ...(canNextPage ? {} : disabledButtonStyle),
            }}
          >
            {'>'}
          </button>{' '}
          <button
            onClick={() => gotoPage(pageCount - 1)}
            disabled={!canNextPage}
            style={{
              ...buttonStyle,
              ...(canNextPage ? {} : disabledButtonStyle),
            }}
          >
            {'>>'}
          </button>{' '}
        </div>
        {/* End Pagination */}
      </div>
    </div>
  );
}

export default ClientsTable;
