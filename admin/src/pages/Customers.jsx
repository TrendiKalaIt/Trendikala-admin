import React, { useState, useMemo, useEffect } from 'react';
import { Search, ArrowLeft, ArrowRight } from 'lucide-react';

// Placeholder data - In a real application, this would come from an API
const initialCustomersData = [
    { id: 1, name: 'Rakesh Mishra', email: 'rakesh@gmail.com', mobileNo: '9876567845' },
    { id: 2, name: 'Lakshman Singh', email: 'lakshman@gmail.com', mobileNo: '9876567845' },
    { id: 3, name: 'Dinanath Sah', email: 'dinanath@gmail.com', mobileNo: '9876567845' },
    { id: 4, name: 'Anmol Yadav', email: 'anmol@gmail.com', mobileNo: '9876567845' },
    { id: 5, name: 'Raushain Singh Rajput', email: 'raushain@gmail.com', mobileNo: '9876567845' },
    { id: 6, name: 'Lokesh Rahul', email: 'lokesh@gmail.com', mobileNo: '9876567845' },
    { id: 7, name: 'Randhir Kumar', email: 'randhir@gmail.com', mobileNo: '9876567845' },
    { id: 8, name: 'Khushi Kumari', email: 'khushi@gmail.com', mobileNo: '9876567845' },
    { id: 9, name: 'Pooja Kumari', email: 'pooja@gmail.com', mobileNo: '9876567845' },
    { id: 10, name: 'Ruhi Kumari', email: 'ruhi@gmail.com', mobileNo: '9876567845' },
    { id: 11, name: 'Amit Sharma', email: 'amit.s@gmail.com', mobileNo: '9123456789' },
    { id: 12, name: 'Priya Verma', email: 'priya.v@gmail.com', mobileNo: '8765432109' },
    { id: 13, name: 'Sanjay Gupta', email: 'sanjay.g@gmail.com', mobileNo: '7890123456' },
    { id: 14, name: 'Neha Singh', email: 'neha.s@gmail.com', mobileNo: '9988776655' },
    { id: 15, name: 'Rajesh Kumar', email: 'rajesh.k@gmail.com', mobileNo: '7766554433' },
    { id: 16, name: 'Kavita Devi', email: 'kavita.d@gmail.com', mobileNo: '9009887766' },
    { id: 17, name: 'Alok Ranjan', email: 'alok.r@gmail.com', mobileNo: '8121314151' },
    { id: 18, name: 'Divya Sharma', email: 'divya.s@gmail.com', mobileNo: '7001002003' },
    { id: 19, name: 'Vikas Mishra', email: 'vikas.m@gmail.com', mobileNo: '9554433221' },
    { id: 20, name: 'Swati Agarwal', email: 'swati.a@gmail.com', mobileNo: '8332211009' },
    { id: 21, name: 'Gaurav Dubey', email: 'gaurav.d@gmail.com', mobileNo: '9445566778' },
    { id: 22, name: 'Poonam Yadav', email: 'poonam.y@gmail.com', mobileNo: '8667788990' },
    { id: 23, name: 'Vivek Singh', email: 'vivek.s@gmail.com', mobileNo: '7554433221' },
    { id: 24, name: 'Aisha Khan', email: 'aisha.k@gmail.com', mobileNo: '9112233445' },
    { id: 25, name: 'Mohit Kumar', email: 'mohit.k@gmail.com', mobileNo: '8009988776' },
    { id: 26, name: 'Nisha Kumari', email: 'nisha.k@gmail.com', mobileNo: '7112233445' },
    { id: 27, name: 'Deepak Sharma', email: 'deepak.s@gmail.com', mobileNo: '9223344556' },
    { id: 28, name: 'Preeti Singh', email: 'preeti.s@gmail.com', mobileNo: '8445566778' },
    { id: 29, name: 'Siddharth Jain', email: 'siddharth.j@gmail.com', mobileNo: '7667788990' },
    { id: 30, name: 'Anjali Gupta', email: 'anjali.g@gmail.com', mobileNo: '9887766554' },
];

const CustomersPageContent = () => {
    const [customers] = useState(initialCustomersData);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredCustomers = useMemo(() => {
        return customers.filter(customer =>
            customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.mobileNo.includes(searchTerm)
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
            const leftEllipsisThreshold = Math.floor(maxPageButtons / 2);
            const rightEllipsisThreshold = totalPages - Math.floor((maxPageButtons - 1) / 2);

            if (currentPage <= leftEllipsisThreshold) {
                for (let i = 1; i <= maxPageButtons - 2; i++) {
                    pageNumbers.push(i);
                }
                pageNumbers.push('...');
                pageNumbers.push(totalPages);
            } else if (currentPage >= rightEllipsisThreshold) {
                pageNumbers.push(1);
                pageNumbers.push('...');
                for (let i = totalPages - (maxPageButtons - 3); i <= totalPages; i++) {
                    pageNumbers.push(i);
                }
            } else {
                pageNumbers.push(1);
                if (currentPage > 2 + 1) {
                    pageNumbers.push('...');
                }
                const startPage = currentPage - Math.floor((maxPageButtons - 5) / 2);
                const endPage = currentPage + Math.floor((maxPageButtons - 5) / 2);

                for (let i = Math.max(2, startPage); i <= Math.min(totalPages - 1, endPage); i++) {
                    pageNumbers.push(i);
                }
                if (currentPage < totalPages - 2) {
                    pageNumbers.push('...');
                }
                pageNumbers.push(totalPages);
            }
        }
        return Array.from(new Set(pageNumbers));
    };

    const getInitials = (name) => {
        if (!name) return '';
        const parts = name.split(' ');
        if (parts.length === 1) {
            return parts[0].charAt(0).toUpperCase();
        }
        return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
    };

    // --- Export Functionality ---
    const handleExportCsv = () => {
        if (filteredCustomers.length === 0) {
            alert("No data to export.");
            return;
        }

        // Define CSV headers
        const headers = ["Name", "Email", "Mobile No"];
        // Map customer data to CSV rows
        const rows = filteredCustomers.map(customer => [
            `"${customer.name.replace(/"/g, '""')}"`, 
            `"${customer.email.replace(/"/g, '""')}"`,
            `"${customer.mobileNo}"` 
        ]);

        // Combine headers and rows
        const csvContent = [
            headers.join(','), 
            ...rows.map(row => row.join(',')) 
        ].join('\n'); 

        // Create a Blob from the CSV content
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

        // Create a temporary URL for the Blob and trigger download
        const link = document.createElement('a');
        if (link.download !== undefined) { // Feature detection for download attribute
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', 'customers_data.csv');
            link.style.visibility = 'hidden'; // Hide the link
            document.body.appendChild(link);
            link.click(); 
            document.body.removeChild(link); 
            URL.revokeObjectURL(url); 
        } else {
            alert("Your browser does not support downloading files directly. Please copy the data manually.");
        }
    };
   

    return (
        
        <div className="flex justify-center p-5 min-h-screen bg-[#f5f9ef]">
            <div className="bg-white rounded-lg shadow-md w-full max-w-5xl p-6">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                    <h1 className="text-3xl font-semibold text-[#49951C]">All Customers</h1>
                    <div className="relative flex-grow max-w-xs w-full sm:w-auto">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                            type="text"
                            placeholder="Search by name, email, or mobile..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm text-gray-700"
                        />
                    </div>
                    <button
                        onClick={handleExportCsv} // Attach the export function here
                        className="px-5 py-2.5 bg-green-500 text-white rounded-md text-sm font-medium hover:bg-green-600 transition-colors duration-200"
                    >
                        Export
                    </button>
                </div>

                {/* Customer Table */}
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Name
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Email
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Mobile No
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {currentCustomers.length > 0 ? (
                                currentCustomers.map(customer => (
                                    <tr key={customer.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10 bg-gray-300 rounded-full flex items-center justify-center text-gray-700 text-sm font-semibold">
                                                    {getInitials(customer.name)}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                            {customer.email}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                            {customer.mobileNo}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3" className="px-6 py-4 text-center text-gray-500">
                                        No customers found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 0 && (
                    <div className="flex justify-center items-center mt-8 space-x-2">
                        <button
                            onClick={handlePreviousPage}
                            disabled={currentPage === 1}
                            className={`p-2 rounded-md transition-colors duration-200 ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-200'}`}
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </button>

                        {getPageNumbers().map((pageNumber, index) => (
                            pageNumber === '...' ? (
                                <span key={`ellipsis-${index}`} className="px-2 py-2 text-sm text-gray-500">...</span>
                            ) : (
                                <button
                                    key={pageNumber}
                                    onClick={() => handlePageChange(pageNumber)}
                                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200
                                        ${currentPage === pageNumber
                                            ? 'text-white bg-green-500 hover:bg-green-600'
                                            : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-100'
                                        }`}
                                >
                                    {pageNumber}
                                </button>
                            )
                        ))}

                        <button
                            onClick={handleNextPage}
                            disabled={currentPage === totalPages}
                            className={`p-2 rounded-md transition-colors duration-200 ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-200'}`}
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