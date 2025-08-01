
// import React, { useState, useMemo, useEffect } from 'react';
// import axios from 'axios';
// import { Search, ArrowLeft, ArrowRight } from 'lucide-react';

// const CustomersPageContent = () => {
//     const [customers, setCustomers] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [currentPage, setCurrentPage] = useState(1);
//     const [itemsPerPage] = useState(10);
//     const [searchTerm, setSearchTerm] = useState('');

//     useEffect(() => {
//         const fetchCustomers = async () => {
//             try {
//                 const token = localStorage.getItem('token');
//                 if (!token) {
//                     setLoading(false);
//                     return;
//                 }

//                 const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/all`, {
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                     },
//                 });

//                 const mappedCustomers = res.data.map(user => ({
//                     id: user._id,
//                     name: user.name,
//                     email: user.email,
//                     mobile: user.mobile || 'N/A',
//                     customerType: user.isGuest ? 'Guest' : 'Registered',
//                 }));

//                 setCustomers(mappedCustomers);
//                 setLoading(false);
//             } catch (error) {
//                 console.error('Failed to fetch customers:', error);
//                 setLoading(false);
//             }
//         };

//         fetchCustomers();
//     }, []);

//     const filteredCustomers = useMemo(() => {
//         return customers.filter(customer =>
//             customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//             customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
//             customer.mobile.includes(searchTerm)
//         );
//     }, [customers, searchTerm]);

//     const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
//     const indexOfLastCustomer = currentPage * itemsPerPage;
//     const indexOfFirstCustomer = indexOfLastCustomer - itemsPerPage;
//     const currentCustomers = filteredCustomers.slice(indexOfFirstCustomer, indexOfLastCustomer);

//     useEffect(() => {
//         setCurrentPage(1);
//     }, [searchTerm]);

//     const handlePageChange = (pageNumber) => {
//         if (pageNumber >= 1 && pageNumber <= totalPages) {
//             setCurrentPage(pageNumber);
//         }
//     };

//     const handlePreviousPage = () => {
//         setCurrentPage(prev => Math.max(1, prev - 1));
//     };

//     const handleNextPage = () => {
//         setCurrentPage(prev => Math.min(totalPages, prev + 1));
//     };

//     const getPageNumbers = () => {
//         const pageNumbers = [];
//         const maxPageButtons = 7;

//         if (totalPages <= maxPageButtons) {
//             for (let i = 1; i <= totalPages; i++) {
//                 pageNumbers.push(i);
//             }
//         } else {
//             const left = Math.max(2, currentPage - 1);
//             const right = Math.min(totalPages - 1, currentPage + 1);

//             pageNumbers.push(1);
//             if (left > 2) pageNumbers.push('...');
//             for (let i = left; i <= right; i++) pageNumbers.push(i);
//             if (right < totalPages - 1) pageNumbers.push('...');
//             pageNumbers.push(totalPages);
//         }

//         return pageNumbers;
//     };

//     const getInitials = (name) => {
//         if (!name) return '';
//         const parts = name.trim().split(' ');
//         return parts.length === 1
//             ? parts[0].charAt(0).toUpperCase()
//             : (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
//     };

//     const handleExportCsv = () => {
//         if (filteredCustomers.length === 0) {
//             alert('No data to export.');
//             return;
//         }

//         const headers = ['Name', 'Customer Type', 'Email', 'Mobile No'];
//         const rows = filteredCustomers.map(customer => [
//             `"${customer.name.replace(/"/g, '""')}"`,
//             `"${customer.customerType}"`,
//             `"${customer.email.replace(/"/g, '""')}"`,
//             `"${customer.mobile}"`,
//         ]);

//         const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');

//         const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//         const url = URL.createObjectURL(blob);
//         const link = document.createElement('a');

//         link.setAttribute('href', url);
//         link.setAttribute('download', 'customers_data.csv');
//         link.style.visibility = 'hidden';
//         document.body.appendChild(link);
//         link.click();
//         document.body.removeChild(link);
//         URL.revokeObjectURL(url);
//     };

//     if (loading) return <div className="p-5 text-center">Loading customers...</div>;

//     return (
//         <div className="flex justify-center p-5 min-h-screen bg-[#f5f9ef]">
//             <div className="bg-white rounded-lg shadow-md w-full max-w-5xl p-6">
//                 {/* Header */}
//                 <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
//                     <h1 className="text-3xl font-semibold text-[#49951C]">Registered Users</h1>

//                     <div className="relative flex-grow max-w-xs w-full sm:w-auto">
//                         <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
//                         <input
//                             type="text"
//                             placeholder="Search by name, email, or mobile..."
//                             value={searchTerm}
//                             onChange={(e) => setSearchTerm(e.target.value)}
//                             className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm text-gray-700"
//                         />
//                     </div>

//                     <button
//                         onClick={handleExportCsv}
//                         className="px-5 py-2.5 bg-green-500 text-white rounded-md text-sm font-medium hover:bg-green-600 transition-colors duration-200"
//                     >
//                         Export
//                     </button>
//                 </div>

//                 {/* Table */}
//                 <div className="overflow-x-auto">
//                     <table className="min-w-full divide-y divide-gray-200">
//                         <thead className="bg-gray-50">
//                             <tr>
//                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
//                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Users Type</th>
//                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
//                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mobile No</th>
//                             </tr>
//                         </thead>
//                         <tbody className="bg-white divide-y divide-gray-200">
//                             {currentCustomers.length > 0 ? (
//                                 currentCustomers.map(customer => (
//                                     <tr key={customer.id}>
//                                         <td className="px-6 py-4 whitespace-nowrap">
//                                             <div className="flex items-center">
//                                                 <div className="h-10 w-10 bg-gray-300 rounded-full flex items-center justify-center text-gray-700 text-sm font-semibold">
//                                                     {getInitials(customer.name)}
//                                                 </div>
//                                                 <div className="ml-4 text-sm font-medium text-gray-900">
//                                                     {customer.name}
//                                                 </div>
//                                             </div>
//                                         </td>
//                                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
//                                             {customer.customerType}
//                                         </td>
//                                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
//                                             {customer.email}
//                                         </td>
//                                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
//                                             {customer.mobile}
//                                         </td>

//                                     </tr>
//                                 ))
//                             ) : (
//                                 <tr>
//                                     <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
//                                         No customers found.
//                                     </td>
//                                 </tr>
//                             )}
//                         </tbody>
//                     </table>
//                 </div>

//                 {/* Pagination */}
//                 {totalPages > 1 && (
//                     <div className="flex justify-center items-center mt-8 space-x-2">
//                         <button
//                             onClick={handlePreviousPage}
//                             disabled={currentPage === 1}
//                             className={`p-2 rounded-md ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-200'}`}
//                         >
//                             <ArrowLeft className="h-4 w-4" />
//                         </button>

//                         {getPageNumbers().map((page, index) =>
//                             page === '...' ? (
//                                 <span key={index} className="px-2 py-2 text-sm text-gray-500">...</span>
//                             ) : (
//                                 <button
//                                     key={page}
//                                     onClick={() => handlePageChange(page)}
//                                     className={`px-4 py-2 text-sm font-medium rounded-md ${currentPage === page
//                                             ? 'text-white bg-green-500 hover:bg-green-600'
//                                             : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-100'
//                                         }`}
//                                 >
//                                     {page}
//                                 </button>
//                             )
//                         )}

//                         <button
//                             onClick={handleNextPage}
//                             disabled={currentPage === totalPages}
//                             className={`p-2 rounded-md ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-200'}`}
//                         >
//                             <ArrowRight className="h-4 w-4" />
//                         </button>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default CustomersPageContent;



import React, { useState, useMemo, useEffect } from 'react';

import axios from 'axios';

import { Search, ArrowLeft, ArrowRight } from 'lucide-react';

const CustomersPageContent = () => {

    const [customers, setCustomers] = useState([]);

    const [loading, setLoading] = useState(true);

    const [currentPage, setCurrentPage] = useState(1);

    const [itemsPerPage] = useState(10);

    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {

        const fetchCustomers = async () => {

            try {

                const token = localStorage.getItem('token');

                if (!token) {

                    setLoading(false);

                    return;

                }

                const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/all`, {

                    headers: {

                        Authorization: `Bearer ${token}`,

                    },

                });

                const mappedCustomers = res.data.map(user => ({

                    id: user._id,

                    name: user.name,

                    email: user.email,

                    mobile: user.mobile || 'N/A',

                    customerType: user.isGuest ? 'Guest' : 'Registered',

                }));

                setCustomers(mappedCustomers);

                setLoading(false);

            } catch (error) {

                console.error('Failed to fetch customers:', error);

                setLoading(false);

            }

        };

        fetchCustomers();

    }, []);

    const filteredCustomers = useMemo(() => {

        return customers.filter(customer =>

            customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||

            customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||

            customer.mobile.includes(searchTerm)

        );

    }, [customers, searchTerm]);

    const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);

    const indexOfLastCustomer = currentPage * itemsPerPage;

    const indexOfFirstCustomer = indexOfLastCustomer - itemsPerPage;

    const currentCustomers = filteredCustomers.slice(indexOfFirstCustomer, indexOfLastCustomer);

    useEffect(() => {

        setCurrentPage(1);

    }, [searchTerm]);

    const handlePageChange = (pageNumber) => {

        if (pageNumber >= 1 && pageNumber <= totalPages) {

            setCurrentPage(pageNumber);

        }

    };

    const handlePreviousPage = () => {

        setCurrentPage(prev => Math.max(1, prev - 1));

    };

    const handleNextPage = () => {

        setCurrentPage(prev => Math.min(totalPages, prev + 1));

    };

    const getPageNumbers = () => {

        const pageNumbers = [];

        const maxPageButtons = 7;

        if (totalPages <= maxPageButtons) {

            for (let i = 1; i <= totalPages; i++) {

                pageNumbers.push(i);

            }

        } else {

            const left = Math.max(2, currentPage - 1);

            const right = Math.min(totalPages - 1, currentPage + 1);

            pageNumbers.push(1);

            if (left > 2) pageNumbers.push('...');

            for (let i = left; i <= right; i++) pageNumbers.push(i);

            if (right < totalPages - 1) pageNumbers.push('...');

            pageNumbers.push(totalPages);

        }

        return pageNumbers;

    };

    const getInitials = (name) => {

        if (!name) return '';

        const parts = name.trim().split(' ');

        return parts.length === 1

            ? parts[0].charAt(0).toUpperCase()

            : (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();

    };

    const handleExportCsv = () => {

        if (filteredCustomers.length === 0) {

            alert('No data to export.');

            return;

        }

        const headers = ['Name', 'Customer Type', 'Email', 'Mobile No'];

        const rows = filteredCustomers.map(customer => [

            `"${customer.name.replace(/"/g, '""')}"`,

            `"${customer.customerType}"`,

            `"${customer.email.replace(/"/g, '""')}"`,

            `"${customer.mobile}"`,

        ]);

        const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');

        link.setAttribute('href', url);

        link.setAttribute('download', 'customers_data.csv');

        link.style.visibility = 'hidden';

        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);

        URL.revokeObjectURL(url);

    };

    if (loading) return <div className="p-5 text-center">Loading customers...</div>;

    return (
        <div className="flex justify-center p-5 min-h-screen bg-[#f5f9ef]">
            <div className="bg-white rounded-lg shadow-md w-full max-w-5xl p-6">

                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                    <h1 className="text-3xl font-semibold text-[#49951C]">Registered Users</h1>

                    <div className="relative flex-grow max-w-xs w-full sm:w-auto">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input

                            type="text"

                            placeholder="Search by name, email, or mobile..."

                            value={searchTerm}

                            onChange={(e) => setSearchTerm(e.target.value)}

                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm text-gray-700"

                        />
                    </div>

                    <button

                        onClick={handleExportCsv}

                        className="px-5 py-2.5 bg-green-500 text-white rounded-md text-sm font-medium hover:bg-green-600 transition-colors duration-200"
                    >

                        Export
                    </button>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User Type</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mobile No</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">

                            {currentCustomers.length > 0 ? (

                                currentCustomers.map(customer => (
                                    <tr key={customer.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 bg-gray-300 rounded-full flex items-center justify-center text-gray-700 text-sm font-semibold">

                                                    {getInitials(customer.name)}
                                                </div>
                                                <div className="ml-4 text-sm font-medium text-gray-900">

                                                    {customer.name}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">

                                            {customer.customerType}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">

                                            {customer.email}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">

                                            {customer.mobile}
                                        </td>
                                    </tr>

                                ))

                            ) : (
                                <tr>
                                    <td colSpan="4" className="px-6 py-4 text-center text-gray-500">

                                        No customers found.
                                    </td>
                                </tr>

                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}

                {totalPages >= 1 && (
                    <div className="flex justify-center items-center mt-8 space-x-2">
                        <button

                            onClick={handlePreviousPage}

                            disabled={currentPage === 1}

                            className={`p-2 rounded-md ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-200'}`}
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </button>

                        {getPageNumbers().map((page, index) =>

                            page === '...' ? (
                                <span key={index} className="px-2 py-2 text-sm text-gray-500">...</span>

                            ) : (
                                <button

                                    key={page}

                                    onClick={() => handlePageChange(page)}

                                    className={`px-4 py-2 text-sm font-medium rounded-md ${currentPage === page

                                        ? 'text-white bg-green-500 hover:bg-green-600'

                                        : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-100'

                                        }`}
                                >

                                    {page}
                                </button>

                            )

                        )}

                        <button

                            onClick={handleNextPage}

                            disabled={currentPage === totalPages}

                            className={`p-2 rounded-md ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-200'}`}
                        >
                            <ArrowRight className="h-4 w-4" />
                        </button>
                    </div>

                )}
            </div>
        </div>

    );

};

export default CustomersPageContent;
