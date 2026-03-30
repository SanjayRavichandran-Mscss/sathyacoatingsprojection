// // pages/finance/CommonPaymentEntry.jsx
// import React, { useState, useEffect } from 'react';
// import CreatableSelect from 'react-select/creatable';
// import axios from 'axios';
// import {
//   ArrowDownCircle, Plus, Users, Truck, Wrench, Home, ScrollText, Calculator, CreditCard, FileText,
//   Building2, DollarSign, Percent, X, Coins, MoreHorizontal, Trash2, Edit
// } from 'lucide-react';

// // ─── Existing Modals & Views ────────────────────────────────────────────────
// import CreateCreditors from '../../components/FinanceComponents/CommonPaymentEntry/CreateCreditors';
// import SiteInchargeAttendanceModal from '../../components/FinanceComponents/CommonPaymentEntry/SiteInchargeAttendanceModal';
// import SalaryPayablesModal from '../../components/FinanceComponents/CommonPaymentEntry/SalaryPayablesModal';
// import TransportPayablesModal from '../../components/FinanceComponents/CommonPaymentEntry/TransportPayablesModal';
// import ScaffoldingPayablesModal from '../../components/FinanceComponents/CommonPaymentEntry/ScaffoldingPayablesModal';
// import SiteAccommodationPayablesModal from '../../components/FinanceComponents/CommonPaymentEntry/SiteAccommodationPayablesModal';
// import CommissionPayablesModal from '../../components/FinanceComponents/CommonPaymentEntry/CommissionPayablesModal';
// import GstPayablesModal from '../../components/FinanceComponents/CommonPaymentEntry/GstPayablesModal';
// import TdsPayablesModal from '../../components/FinanceComponents/CommonPaymentEntry/TdsPayablesModal';
// import CreditCardPayablesModal from '../../components/FinanceComponents/CommonPaymentEntry/CreditCardPayablesModal';
// import BilledDebtorsModal from '../../components/FinanceComponents/CommonPaymentEntry/BilledDebtorsModal';

// import ViewCreditors from '../../components/FinanceComponents/CommonPaymentEntry/ViewCreditors';
// import ViewBilledDebtors from '../../components/FinanceComponents/CommonPaymentEntry/ViewBilledDebtors';
// import ViewPaymentEntry from '../../components/FinanceComponents/CommonPaymentEntry/ViewPaymentEntry';

// const themeColors = { primary: '#1e7a6f' };

// const customStyles = {
//   control: (base) => ({
//     ...base,
//     borderRadius: '0.75rem',
//     padding: '0.75rem',
//     borderColor: '#dee2e6',
//     boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
//   }),
//   option: (base, state) => ({
//     ...base,
//     backgroundColor: state.isSelected ? themeColors.primary : state.isFocused ? '#ecfdf5' : 'white',
//     color: state.isSelected ? 'white' : '#212529',
//   }),
// };

// const staticCategories = [
//   { value: 'creditors', label: 'Creditors', icon: Building2, isStatic: true },
//   { value: 'siteincharge-attendance', label: 'SiteIncharge Attendance', icon: Users, isStatic: true },
//   { value: 'salary-payables', label: 'Salary Payables', icon: DollarSign, isStatic: true },
//   { value: 'transport', label: 'Transport', icon: Truck, isStatic: true },
//   { value: 'scaffolding', label: 'Scaffolding', icon: Wrench, isStatic: true },
//   { value: 'site-accommodation', label: 'Site Accommodation', icon: Home, isStatic: true },
//   { value: 'commission', label: 'Commission', icon: Coins, isStatic: true },
//   { value: 'gst', label: 'GST', icon: Calculator, isStatic: true },
//   { value: 'tds', label: 'TDS', icon: ScrollText, isStatic: true },
//   { value: 'credit-card', label: 'Credit Card', icon: CreditCard, isStatic: true },
//   { value: 'billed-debtors', label: 'Billed Debtors', icon: FileText, isStatic: true },
// ];

// // ==================== NEW: Category Financial Summary Component ====================
// const CategoryFinancialSummary = ({ records = [], categoryLabel }) => {
//   if (!records || records.length === 0) return null;

//   let totalPaid = 0;
//   let totalReceived = 0;
//   let totalPayable = 0;
//   let totalReceivable = 0;

//   records.forEach(record => {
//     const amount = parseFloat(record.amount) || 0;
//     const cashAmount = parseFloat(record.cash) || 0;
//     const type = (record.payment_type || '').toLowerCase().trim();

//     if (type === 'payable') {
//       totalPayable += amount;                    // Outstanding Payable
//       if (cashAmount > 0) totalPaid += cashAmount; // Actual Paid from cash field
//     } 
//     else if (type === 'receivable') {
//       totalReceivable += amount;                 // Outstanding Receivable
//       if (cashAmount > 0) totalReceived += cashAmount; // Actual Received
//     }
//   });

//   const netPosition = (totalReceived + totalPaid) - (totalPayable + totalReceivable);

//   const formatINR = (amt) => 
//     '₹' + Number(amt || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 });

//   return (
//     <div className="mt-6 mb-8">
//       <div className="bg-white rounded-2xl shadow border p-6" style={{ borderColor: '#dee2e6' }}>
//         <h3 className="text-lg font-semibold text-gray-700 mb-5 flex items-center gap-2">
//           💰 Financial Summary — {categoryLabel}
//         </h3>

//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
//           {/* Total Paid */}
//           <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 text-center">
//             <p className="text-sm font-medium text-emerald-700">Total Paid</p>
//             <p className="text-2xl font-bold text-emerald-800 mt-2">{formatINR(totalPaid)}</p>
//           </div>

//           {/* Total Received */}
//           <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 text-center">
//             <p className="text-sm font-medium text-blue-700">Total Received</p>
//             <p className="text-2xl font-bold text-blue-800 mt-2">{formatINR(totalReceived)}</p>
//           </div>

//           {/* Total Payable */}
//           <div className="bg-red-50 border border-red-200 rounded-xl p-5 text-center">
//             <p className="text-sm font-medium text-red-700">Total Payable</p>
//             <p className="text-2xl font-bold text-red-800 mt-2">{formatINR(totalPayable)}</p>
//           </div>

//           {/* Total Receivable */}
//           <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-5 text-center">
//             <p className="text-sm font-medium text-indigo-700">Total Receivable</p>
//             <p className="text-2xl font-bold text-indigo-800 mt-2">{formatINR(totalReceivable)}</p>
//           </div>

//           {/* Net Position - Centered & Highlighted */}
//           <div 
//             className={`border-2 rounded-2xl p-6 text-center flex flex-col justify-center items-center col-span-1 sm:col-span-2 lg:col-span-1 shadow-sm ${
//               netPosition >= 0 
//                 ? 'bg-green-50 border-green-400' 
//                 : 'bg-rose-50 border-rose-400'
//             }`}
//           >
//             <p className="text-sm font-medium text-gray-600">NET POSITION</p>
//             <p className={`text-4xl font-bold mt-3 ${netPosition >= 0 ? 'text-green-700' : 'text-red-700'}`}>
//               {formatINR(Math.abs(netPosition))}
//             </p>
//             <p className={`text-base font-semibold uppercase tracking-wider mt-2 ${
//               netPosition >= 0 ? 'text-green-600' : 'text-red-600'
//             }`}>
//               {netPosition >= 0 ? 'SURPLUS' : 'SHORTFALL'}
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };
// // =================================================================================

// const CommonPaymentEntry = () => {
//   const [selectedCategory, setSelectedCategory] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [createdBy, setCreatedBy] = useState('');
//   const [creditors, setCreditors] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const [allCategories, setAllCategories] = useState(staticCategories);

//   const [paymentForm, setPaymentForm] = useState({
//     id: null,
//     date: '',
//     amount: '',
//     receipt: '',
//     cash: '',
//     bank_name: '',
//     remarks: '',
//     payment_type: 'Payable',
//   });
//   const [formErrors, setFormErrors] = useState({});
//   const [isEditMode, setIsEditMode] = useState(false);

//   const [categoryRecords, setCategoryRecords] = useState([]);
//   const [recordsLoading, setRecordsLoading] = useState(false);
//   const [fetchError, setFetchError] = useState(null);

//   // Load user ID from URL
//   useEffect(() => {
//     const match = window.location.pathname.match(/\/payments\/([^/]+)$/);
//     if (match?.[1]) {
//       try {
//         setCreatedBy(atob(match[1]));
//       } catch {
//         setCreatedBy('1');
//       }
//     }
//   }, []);

//   // Load custom categories once
//   useEffect(() => {
//     const loadCustom = async () => {
//       try {
//         const res = await axios.get('http://localhost:5000/finance/custom-categories');
//         if (res.data?.status === 'success' && res.data.data) {
//           const custom = res.data.data.map(cat => ({
//             value: cat.category_name,
//             label: cat.category_name,
//             icon: MoreHorizontal,
//             isStatic: false,
//           }));

//           setAllCategories(prev => [
//             ...prev,
//             ...custom.filter(c => !prev.some(p => p.value === c.value))
//           ]);
//         }
//       } catch (err) {
//         console.error('Custom categories fetch failed:', err);
//       }
//     };
//     loadCustom();
//   }, []);

//   // Fetch data when category changes
//   useEffect(() => {
//     if (!selectedCategory) {
//       setCategoryRecords([]);
//       setCreditors([]);
//       setFetchError(null);
//       return;
//     }

//     setFetchError(null);

//     if (selectedCategory.isStatic) {
//       if (selectedCategory.value === 'creditors') {
//         loadCreditors();
//       }
//       setCategoryRecords([]);
//     } else {
//       fetchCategoryRecords(selectedCategory.value);
//     }
//   }, [selectedCategory]);

//   const loadCreditors = async () => {
//     setLoading(true);
//     try {
//       const res = await axios.get('http://localhost:5000/finance/view-creditors');
//       setCreditors(res.data?.data?.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)) || []);
//     } catch (err) {
//       console.error('Creditors fetch failed:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchCategoryRecords = async (categoryName) => {
//     if (!categoryName) return;

//     setRecordsLoading(true);
//     setCategoryRecords([]);
//     setFetchError(null);

//     try {
//       const res = await axios.get('http://localhost:5000/finance/custom-payments-by-category', {
//         params: { category_name: categoryName.trim() },
//       });

//       if (res.data?.status === 'success') {
//         setCategoryRecords(res.data.data || []);
//       } else {
//         setFetchError(res.data?.message || 'Unexpected response format');
//       }
//     } catch (err) {
//       console.error('Fetch records error:', err);
//       setFetchError(err.response?.data?.message || 'Failed to load records');
//       setCategoryRecords([]);
//     } finally {
//       setRecordsLoading(false);
//     }
//   };

//   const handleEditRecord = (record) => {
//     setPaymentForm({
//       id: record.id,
//       date: record.date ? new Date(record.date).toISOString().split('T')[0] : '',
//       amount: record.amount || '',
//       receipt: record.receipt || '',
//       cash: record.cash || '',
//       bank_name: record.bank_name || '',
//       remarks: record.remarks || '',
//       payment_type: record.payment_type || 'Payable',
//     });
//     setIsEditMode(true);
//     setIsModalOpen(true);
//   };

//   const handleDeleteRecord = async (id) => {
//     if (!window.confirm('Delete this record?')) return;

//     try {
//       await axios.delete(`http://localhost:5000/finance/delete-custom-payment/${id}`);
//       setCategoryRecords(prev => prev.filter(r => r.id !== id));
//       alert('Record deleted successfully');
//     } catch (err) {
//       alert('Delete failed: ' + (err.response?.data?.message || err.message));
//     }
//   };

//   const handleCreateCategory = async (inputValue) => {
//     if (!inputValue?.trim()) return;

//     const trimmed = inputValue.trim();

//     try {
//       const res = await axios.post('http://localhost:5000/finance/create-custom-category', {
//         category_name: trimmed,
//         created_by: createdBy,
//       });

//       if (res.data?.status === 'success') {
//         const newCat = {
//           value: trimmed,
//           label: trimmed,
//           icon: MoreHorizontal,
//           isStatic: false,
//         };
//         setAllCategories(prev => [...prev, newCat]);
//         setSelectedCategory(newCat);
//         fetchCategoryRecords(trimmed);
//       }
//     } catch (err) {
//       alert('Failed to create category: ' + (err.response?.data?.message || err.message));
//     }
//   };

//   const handlePaymentChange = (e) => {
//     const { name, value } = e.target;
//     setPaymentForm(prev => ({ ...prev, [name]: value }));
//     if (formErrors[name]) setFormErrors(prev => ({ ...prev, [name]: '' }));
//   };

//   const handlePaymentSubmit = async (e) => {
//     e.preventDefault();
//     const errors = {};

//     if (!selectedCategory) errors.category = 'No category selected';
//     if (!paymentForm.amount || isNaN(parseFloat(paymentForm.amount)) || parseFloat(paymentForm.amount) < 0) {
//       errors.amount = 'Valid amount required';
//     }
//     if (!paymentForm.payment_type) errors.payment_type = 'Payment type required';

//     if (Object.keys(errors).length > 0) {
//       setFormErrors(errors);
//       return;
//     }

//     try {
//       const payload = {
//         category_name: selectedCategory.value,
//         payment_type: paymentForm.payment_type,
//         date: paymentForm.date || null,
//         amount: parseFloat(paymentForm.amount),
//         receipt: paymentForm.receipt || null,
//         cash: paymentForm.cash ? parseFloat(paymentForm.cash) : null,
//         bank_name: paymentForm.bank_name || null,
//         remarks: paymentForm.remarks || null,
//         created_by: createdBy,
//       };

//       let res;
//       if (isEditMode && paymentForm.id) {
//         res = await axios.put(`http://localhost:5000/finance/update-custom-payment/${paymentForm.id}`, {
//           ...payload,
//           updated_by: createdBy,
//         });
//       } else {
//         res = await axios.post('http://localhost:5000/finance/create-custom-payment', payload);
//       }

//       if (res.data?.status === 'success') {
//         alert(isEditMode ? 'Record updated!' : 'Record saved!');
//         setPaymentForm({
//           id: null,
//           date: '',
//           amount: '',
//           receipt: '',
//           cash: '',
//           bank_name: '',
//           remarks: '',
//           payment_type: 'Payable',
//         });
//         setFormErrors({});
//         setIsEditMode(false);
//         setIsModalOpen(false);

//         if (!selectedCategory?.isStatic) {
//           fetchCategoryRecords(selectedCategory.value);
//         }
//       }
//     } catch (err) {
//       alert('Save failed: ' + (err.response?.data?.message || err.message));
//     }
//   };

//   const renderModal = () => {
//     if (!isModalOpen || !selectedCategory) return null;

//     if (!selectedCategory.isStatic) {
//       return (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
//             <div className="p-6 border-b flex justify-between items-center">
//               <h2 className="text-2xl font-bold text-gray-800">
//                 {isEditMode ? 'Edit' : 'Add'} Record: {selectedCategory.label}
//               </h2>
//               <button onClick={() => { setIsModalOpen(false); setIsEditMode(false); }}>
//                 <X size={24} className="text-gray-500 hover:text-gray-700" />
//               </button>
//             </div>

//             <form onSubmit={handlePaymentSubmit} className="p-6 space-y-5">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
//                 <div className="w-full px-4 py-2 border bg-gray-100 rounded-lg font-medium">
//                   {selectedCategory.label}
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Payment Type <span className="text-red-500">*</span>
//                 </label>
//                 <select
//                   name="payment_type"
//                   value={paymentForm.payment_type}
//                   onChange={handlePaymentChange}
//                   className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 ${
//                     formErrors.payment_type ? 'border-red-500' : 'border-gray-300'
//                   }`}
//                 >
//                   <option value="">Select type</option>
//                   <option value="Payable">Payable</option>
//                   <option value="Receivable">Receivable</option>
//                 </select>
//                 {formErrors.payment_type && <p className="text-red-600 text-sm mt-1">{formErrors.payment_type}</p>}
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
//                 <input
//                   type="date"
//                   name="date"
//                   value={paymentForm.date}
//                   onChange={handlePaymentChange}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Amount <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="number"
//                   name="amount"
//                   value={paymentForm.amount}
//                   onChange={handlePaymentChange}
//                   step="0.01"
//                   min="0"
//                   className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 ${
//                     formErrors.amount ? 'border-red-500' : 'border-gray-300'
//                   }`}
//                   placeholder="0.00"
//                 />
//                 {formErrors.amount && <p className="text-red-600 text-sm mt-1">{formErrors.amount}</p>}
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Receipt / Reference</label>
//                 <input
//                   type="text"
//                   name="receipt"
//                   value={paymentForm.receipt}
//                   onChange={handlePaymentChange}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
//                   placeholder="REC-001 / INV-456"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Cash Amount</label>
//                 <input
//                   type="number"
//                   name="cash"
//                   value={paymentForm.cash}
//                   onChange={handlePaymentChange}
//                   step="0.01"
//                   min="0"
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
//                   placeholder="0.00"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
//                 <input
//                   type="text"
//                   name="bank_name"
//                   value={paymentForm.bank_name}
//                   onChange={handlePaymentChange}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
//                   placeholder="HDFC / SBI / ICICI"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
//                 <textarea
//                   name="remarks"
//                   value={paymentForm.remarks}
//                   onChange={handlePaymentChange}
//                   rows={3}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
//                   placeholder="Any additional notes..."
//                 />
//               </div>

//               <div className="flex justify-end gap-4 pt-4 border-t">
//                 <button
//                   type="button"
//                   onClick={() => { setIsModalOpen(false); setIsEditMode(false); }}
//                   className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition"
//                 >
//                   {isEditMode ? 'Update Record' : 'Save Record'}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       );
//     }

//     const commonProps = { createdBy, onClose: () => setIsModalOpen(false) };
//     switch (selectedCategory.value) {
//       case 'creditors': return <CreateCreditors {...commonProps} onSuccess={() => { setIsModalOpen(false); loadCreditors(); }} />;
//       case 'siteincharge-attendance': return <SiteInchargeAttendanceModal {...commonProps} />;
//       case 'salary-payables': return <SalaryPayablesModal {...commonProps} />;
//       case 'transport': return <TransportPayablesModal {...commonProps} />;
//       case 'scaffolding': return <ScaffoldingPayablesModal {...commonProps} />;
//       case 'site-accommodation': return <SiteAccommodationPayablesModal {...commonProps} />;
//       case 'commission': return <CommissionPayablesModal {...commonProps} />;
//       case 'gst': return <GstPayablesModal {...commonProps} />;
//       case 'tds': return <TdsPayablesModal {...commonProps} />;
//       case 'credit-card': return <CreditCardPayablesModal {...commonProps} />;
//       case 'billed-debtors': return <BilledDebtorsModal {...commonProps} />;
//       default: return null;
//     }
//   };

//   const renderDetailView = () => {
//     if (!selectedCategory) return null;

//     if (selectedCategory.isStatic) {
//       switch (selectedCategory.value) {
//         case 'creditors':
//           return (
//             <div className="mt-8">
//               <h2 className="text-2xl font-bold mb-4 border-b pb-2">Creditors List</h2>
//               <ViewCreditors creditors={creditors} loading={loading} onRefresh={loadCreditors} />
//             </div>
//           );
//         case 'billed-debtors':
//           return (
//             <div className="mt-8">
//               <h2 className="text-2xl font-bold mb-4 border-b pb-2">Billed Debtors List</h2>
//               <ViewBilledDebtors createdBy={createdBy} />
//             </div>
//           );
//         default:
//           return <div className="mt-8 text-center text-gray-600 italic">No detailed view available</div>;
//       }
//     }

//     // Custom category records with Financial Summary
//     return (
//       <div className="mt-8">
//         <h2 className="text-2xl font-bold mb-4 border-b pb-2">
//           Records for: {selectedCategory.label}
//         </h2>

//         {/* Financial Summary for this category */}
//         <CategoryFinancialSummary 
//           records={categoryRecords} 
//           categoryLabel={selectedCategory.label} 
//         />

//         {recordsLoading ? (
//           <div className="text-center py-10 text-gray-500 animate-pulse">Loading records...</div>
//         ) : fetchError ? (
//           <div className="text-center py-10 text-red-600 bg-red-50 rounded-lg p-6 border border-red-200">
//             Error loading records: {fetchError}
//           </div>
//         ) : categoryRecords.length === 0 ? (
//           <div className="text-center py-12 text-gray-600 bg-white rounded-xl shadow border p-8">
//             <p className="text-lg font-medium mb-2">No records found</p>
//             <p className="text-sm">
//               There are no payment entries yet for <strong>"{selectedCategory.label}"</strong>.<br />
//               Click <strong>"Add Record"</strong> above to add your first entry.
//             </p>
//           </div>
//         ) : (
//           <div className="overflow-x-auto bg-white rounded-xl shadow border">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Receipt</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bank</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remarks</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
//                   <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-200">
//                 {categoryRecords.map((record) => (
//                   <tr key={record.id} className="hover:bg-gray-50 transition-colors">
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
//                       {record.date ? new Date(record.date).toLocaleDateString('en-GB') : '—'}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap font-medium text-green-700">
//                       ₹{Number(record.amount || 0).toFixed(2)}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span
//                         className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
//                           record.payment_type === 'Payable' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
//                         }`}
//                       >
//                         {record.payment_type || '—'}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{record.receipt || '—'}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{record.bank_name || '—'}</td>
//                     <td className="px-6 py-4 text-sm text-gray-700">{record.remarks || '—'}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                       {new Date(record.created_at).toLocaleDateString('en-GB')}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
//                       <div className="flex items-center justify-center gap-4">
//                         <button
//                           onClick={() => handleEditRecord(record)}
//                           className="text-blue-600 hover:text-blue-900 transition-colors"
//                           title="Edit record"
//                         >
//                           <Edit size={18} />
//                         </button>
//                         <button
//                           onClick={() => handleDeleteRecord(record.id)}
//                           className="text-red-600 hover:text-red-900 transition-colors"
//                           title="Delete record"
//                         >
//                           <Trash2 size={18} />
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//     );
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 py-8 px-4">
//       <div className="max-w-7xl mx-auto">
//         {/* Header + Selector */}
//         <div className="bg-white rounded-xl shadow-lg border p-8 mb-8">
//           <div className="flex items-center gap-4 mb-8">
//             <div className="p-4 rounded-xl shadow-xl" style={{ backgroundColor: themeColors.primary }}>
//               <ArrowDownCircle className="w-10 h-10 text-white" />
//             </div>
//             <div>
//               <h1 className="text-3xl font-bold text-gray-800">Fund Flow Statement</h1>
//               <p className="text-gray-600">Manage all payment records in one place</p>
//             </div>
//           </div>

//           <div className="flex flex-col md:flex-row items-end gap-6">
//             <div className="flex-1 w-full md:max-w-lg">
//               <label className="block text-lg font-semibold mb-3 text-gray-700">
//                 Payment For / Filter View
//               </label>
//               <CreatableSelect
//                 options={allCategories}
//                 value={selectedCategory}
//                 onChange={setSelectedCategory}
//                 onCreateOption={handleCreateCategory}
//                 placeholder="Search or create category..."
//                 formatCreateLabel={(input) => `Create new: "${input}"`}
//                 isSearchable
//                 isClearable
//                 formatOptionLabel={(opt) => (
//                   <div className="flex items-center gap-3">
//                     {opt.icon && <opt.icon size={20} className={opt.isStatic ? 'text-teal-600' : 'text-purple-600'} />}
//                     <span>{opt.label}</span>
//                   </div>
//                 )}
//                 styles={customStyles}
//               />
//             </div>

//             <button
//               onClick={() => setIsModalOpen(true)}
//               disabled={!selectedCategory}
//               className={`w-full md:w-auto px-10 py-4 rounded-lg font-bold text-white flex justify-center items-center gap-3 transition-all transform shadow-md ${
//                 !selectedCategory ? 'bg-gray-400 cursor-not-allowed' : 'bg-teal-600 hover:bg-teal-700 hover:scale-105'
//               }`}
//             >
//               <Plus size={22} /> Add Record
//             </button>
//           </div>
//         </div>

//         {/* Records / Views */}
//         {renderDetailView()}

//         {/* Modal */}
//         {renderModal()}

//         {/* Global Overview */}
//         <div className="mt-12">
//           <ViewPaymentEntry />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CommonPaymentEntry;















// pages/finance/CommonPaymentEntry.jsx
import React, { useState, useEffect } from 'react';
import CreatableSelect from 'react-select/creatable';
import axios from 'axios';
import {
  ArrowDownCircle, Plus, X, MoreHorizontal, Trash2, Edit,
  Building2, Users, DollarSign, Truck, Wrench, Home, Coins,
  Calculator, ScrollText, CreditCard, FileText,
  ChevronDown, ChevronUp
} from 'lucide-react';

// ─── Modals & Views ────────────────────────────────────────────────
import CreateCreditors from '../../components/FinanceComponents/CommonPaymentEntry/CreateCreditors';
import SiteInchargeAttendanceModal from '../../components/FinanceComponents/CommonPaymentEntry/SiteInchargeAttendanceModal';
import SalaryPayablesModal from '../../components/FinanceComponents/CommonPaymentEntry/SalaryPayablesModal';
import TransportPayablesModal from '../../components/FinanceComponents/CommonPaymentEntry/TransportPayablesModal';
import ScaffoldingPayablesModal from '../../components/FinanceComponents/CommonPaymentEntry/ScaffoldingPayablesModal';
import SiteAccommodationPayablesModal from '../../components/FinanceComponents/CommonPaymentEntry/SiteAccommodationPayablesModal';
import CommissionPayablesModal from '../../components/FinanceComponents/CommonPaymentEntry/CommissionPayablesModal';
import GstPayablesModal from '../../components/FinanceComponents/CommonPaymentEntry/GstPayablesModal';
import TdsPayablesModal from '../../components/FinanceComponents/CommonPaymentEntry/TdsPayablesModal';
import CreditCardPayablesModal from '../../components/FinanceComponents/CommonPaymentEntry/CreditCardPayablesModal';
import BilledDebtorsModal from '../../components/FinanceComponents/CommonPaymentEntry/BilledDebtorsModal';

import ViewCreditors from '../../components/FinanceComponents/CommonPaymentEntry/ViewCreditors';
import ViewBilledDebtors from '../../components/FinanceComponents/CommonPaymentEntry/ViewBilledDebtors';
import ViewPaymentEntry from '../../components/FinanceComponents/CommonPaymentEntry/ViewPaymentEntry';

const themeColors = { primary: '#1e7a6f' };

const customStyles = {
  control: (base) => ({
    ...base,
    borderRadius: '0.75rem',
    padding: '0.75rem',
    borderColor: '#dee2e6',
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected ? themeColors.primary : state.isFocused ? '#ecfdf5' : 'white',
    color: state.isSelected ? 'white' : '#212529',
  }),
};

const staticCategories = [
  { value: 'creditors', label: 'Creditors', icon: Building2, isStatic: true },
  { value: 'siteincharge-attendance', label: 'SiteIncharge Attendance', icon: Users, isStatic: true },
  { value: 'salary-payables', label: 'Salary Payables', icon: DollarSign, isStatic: true },
  { value: 'transport', label: 'Transport', icon: Truck, isStatic: true },
  { value: 'scaffolding', label: 'Scaffolding', icon: Wrench, isStatic: true },
  { value: 'site-accommodation', label: 'Site Accommodation', icon: Home, isStatic: true },
  { value: 'commission', label: 'Commission', icon: Coins, isStatic: true },
  { value: 'gst', label: 'GST', icon: Calculator, isStatic: true },
  { value: 'tds', label: 'TDS', icon: ScrollText, isStatic: true },
  { value: 'credit-card', label: 'Credit Card', icon: CreditCard, isStatic: true },
  { value: 'billed-debtors', label: 'Billed Debtors', icon: FileText, isStatic: true },
];

// ==================== FINANCIAL SUMMARY ====================
const CategoryFinancialSummary = ({ records = [], categoryLabel }) => {
  if (!records || records.length === 0) return null;

  let totalPaid = 0;
  let totalReceived = 0;
  let totalPayable = 0;
  let totalReceivable = 0;

  records.forEach(record => {
    const amount = parseFloat(record.amount) || 0;
    const paidReceive = parseFloat(record.paid_receive_amount) || 0;
    const type = (record.payment_type || record.type_name || '').toLowerCase().trim();

    if (type === 'payable' || record.payment_type_id === 1) {
      totalPayable += amount;
      totalPaid += paidReceive;
    } else if (type === 'receivable' || record.payment_type_id === 2) {
      totalReceivable += amount;
      totalReceived += paidReceive;
    }
  });

  const netPosition = totalReceived + totalPaid - totalPayable - totalReceivable;
  const formatINR = (amt) => '₹' + Number(amt || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 });

  return (
    <div className="mt-6 mb-8">
      <div className="bg-white rounded-2xl shadow border p-6" style={{ borderColor: '#dee2e6' }}>
        <h3 className="text-lg font-semibold text-gray-700 mb-5 flex items-center gap-2">
          💰 Financial Summary — {categoryLabel}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 text-center">
            <p className="text-sm font-medium text-emerald-700">Total Paid</p>
            <p className="text-2xl font-bold text-emerald-800 mt-2">{formatINR(totalPaid)}</p>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 text-center">
            <p className="text-sm font-medium text-blue-700">Total Received</p>
            <p className="text-2xl font-bold text-blue-800 mt-2">{formatINR(totalReceived)}</p>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-xl p-5 text-center">
            <p className="text-sm font-medium text-red-700">Total Payable</p>
            <p className="text-2xl font-bold text-red-800 mt-2">{formatINR(totalPayable)}</p>
          </div>
          <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-5 text-center">
            <p className="text-sm font-medium text-indigo-700">Total Receivable</p>
            <p className="text-2xl font-bold text-indigo-800 mt-2">{formatINR(totalReceivable)}</p>
          </div>
          <div className={`border-2 rounded-2xl p-6 text-center flex flex-col justify-center items-center col-span-1 sm:col-span-2 lg:col-span-1 shadow-sm ${
            netPosition >= 0 ? 'bg-green-50 border-green-400' : 'bg-rose-50 border-rose-400'
          }`}>
            <p className="text-sm font-medium text-gray-600">NET POSITION</p>
            <p className={`text-4xl font-bold mt-3 ${netPosition >= 0 ? 'text-green-700' : 'text-red-700'}`}>
              {formatINR(Math.abs(netPosition))}
            </p>
            <p className={`text-base font-semibold uppercase tracking-wider mt-2 ${
              netPosition >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {netPosition >= 0 ? 'SURPLUS' : 'SHORTFALL'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==================== MAIN COMPONENT ====================
const CommonPaymentEntry = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [createdBy, setCreatedBy] = useState('');
  const [creditors, setCreditors] = useState([]);
  const [banks, setBanks] = useState([]);

  const [allCategories, setAllCategories] = useState(staticCategories);
  const [expandedRows, setExpandedRows] = useState({});

  const [paymentForm, setPaymentForm] = useState({
    id: null,
    category_id: '',
    date: '',
    amount: '',
    payment_type_id: '',
    remarks: '',
    paymentLines: []
  });

  const [isEditMode, setIsEditMode] = useState(false);
  const [categoryRecords, setCategoryRecords] = useState([]);
  const [recordsLoading, setRecordsLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  // Load createdBy from URL
  useEffect(() => {
    const match = window.location.pathname.match(/\/payments\/([^/]+)$/);
    if (match?.[1]) {
      try {
        setCreatedBy(atob(match[1]));
      } catch {
        setCreatedBy('1');
      }
    }
  }, []);

  // Load Banks
  useEffect(() => {
    axios.get('http://localhost:5000/finance/bank-masters')
      .then(res => {
        if (res.data?.status === 'success') setBanks(res.data.data || []);
      })
      .catch(err => console.error('Failed to load banks', err));
  }, []);

  // Load Custom Categories
  useEffect(() => {
    const loadCustom = async () => {
      try {
        const res = await axios.get('http://localhost:5000/finance/custom-categories');
        if (res.data?.status === 'success' && res.data.data) {
          const custom = res.data.data.map(cat => ({
            value: cat.id,
            label: cat.category_name,
            icon: MoreHorizontal,
            isStatic: false,
          }));
          setAllCategories(prev => [
            ...prev,
            ...custom.filter(c => !prev.some(p => p.value === c.value))
          ]);
        }
      } catch (err) {
        console.error('Custom categories fetch failed:', err);
      }
    };
    loadCustom();
  }, []);

  // Fetch records when category changes
  useEffect(() => {
    if (!selectedCategory) {
      setCategoryRecords([]);
      setCreditors([]);
      return;
    }

    if (selectedCategory.isStatic) {
      if (selectedCategory.value === 'creditors') loadCreditors();
      setCategoryRecords([]);
    } else {
      fetchCategoryRecords(selectedCategory.label);
    }
  }, [selectedCategory]);

  const loadCreditors = async () => {
    try {
      const res = await axios.get('http://localhost:5000/finance/view-creditors');
      setCreditors(res.data?.data?.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)) || []);
    } catch (err) {
      console.error('Creditors fetch failed:', err);
    }
  };

  const fetchCategoryRecords = async (categoryName) => {
    if (!categoryName) return;
    setRecordsLoading(true);
    setFetchError(null);

    try {
      const res = await axios.get('http://localhost:5000/finance/custom-payments-by-category', {
        params: { category_name: categoryName.trim() },
      });
      setCategoryRecords(res.data?.data || []);
    } catch (err) {
      setFetchError(err.response?.data?.message || 'Failed to load records');
      setCategoryRecords([]);
    } finally {
      setRecordsLoading(false);
    }
  };

  const handleCreateCategory = async (inputValue) => {
    if (!inputValue?.trim()) return;
    const trimmed = inputValue.trim();

    try {
      const res = await axios.post('http://localhost:5000/finance/create-custom-category', {
        category_name: trimmed,
        created_by: createdBy,
      });

      if (res.data?.status === 'success') {
        const newCat = {
          value: res.data.data.id,
          label: trimmed,
          icon: MoreHorizontal,
          isStatic: false,
        };
        setAllCategories(prev => [...prev, newCat]);
        setSelectedCategory(newCat);
        fetchCategoryRecords(trimmed);
      }
    } catch (err) {
      alert('Failed to create category: ' + (err.response?.data?.message || err.message));
    }
  };

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setPaymentForm(prev => ({ ...prev, [name]: value }));
  };

  const addPaymentLine = () => {
    setPaymentForm(prev => ({
      ...prev,
      paymentLines: [...prev.paymentLines, {
        paid_receive_amount: '',
        paid_receive_date: '',
        bank_id: '',
        receipt: ''
      }]
    }));
  };

  const updatePaymentLine = (index, field, value) => {
    setPaymentForm(prev => {
      const lines = [...prev.paymentLines];
      lines[index] = { ...lines[index], [field]: value };
      return { ...prev, paymentLines: lines };
    });
  };

  const removePaymentLine = (index) => {
    setPaymentForm(prev => ({
      ...prev,
      paymentLines: prev.paymentLines.filter((_, i) => i !== index)
    }));
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();

    if (!selectedCategory || !selectedCategory.value) return alert("Please select a category first");
    if (!paymentForm.payment_type_id) return alert("Please select Payment Type");
    if (!paymentForm.amount || parseFloat(paymentForm.amount) <= 0) {
      return alert("Main Amount is required and must be greater than 0");
    }

    const mainAmount = parseFloat(paymentForm.amount);
    const totalLines = paymentForm.paymentLines.reduce((sum, line) => 
      sum + (parseFloat(line.paid_receive_amount) || 0), 0);

    if (totalLines > mainAmount) {
      return alert(`Total paid/received (${totalLines}) cannot exceed main amount (${mainAmount})`);
    }

    try {
      const payload = {
        category_id: parseInt(selectedCategory.value),
        payment_type_id: parseInt(paymentForm.payment_type_id),
        date: paymentForm.date || null,
        amount: mainAmount,
        remarks: paymentForm.remarks?.trim() || null,
        created_by: createdBy,
        paymentLines: paymentForm.paymentLines
      };

      let res;
      if (isEditMode && paymentForm.id) {
        res = await axios.put(`http://localhost:5000/finance/update-custom-payment/${paymentForm.id}`, {
          ...payload,
          updated_by: createdBy,
        });
      } else {
        res = await axios.post('http://localhost:5000/finance/create-custom-payment', payload);
      }

      if (res.data?.status === 'success') {
        alert(isEditMode ? 'Record updated successfully!' : 'Record saved successfully!');

        setPaymentForm({
          id: null,
          category_id: selectedCategory.value,
          date: '',
          amount: '',
          payment_type_id: paymentForm.payment_type_id,
          remarks: '',
          paymentLines: []
        });

        setIsEditMode(false);
        fetchCategoryRecords(selectedCategory.label);
      }
    } catch (err) {
      alert('Save failed: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleEditRecord = (record) => {
    setPaymentForm({
      id: record.id,
      category_id: record.category_id,
      date: record.date ? new Date(record.date).toISOString().split('T')[0] : '',
      amount: record.amount || '',
      payment_type_id: record.payment_type_id || '',
      remarks: record.remarks || '',
      paymentLines: record.paid_receive_amount ? [{
        paid_receive_amount: record.paid_receive_amount,
        paid_receive_date: record.paid_receive_date ? new Date(record.paid_receive_date).toISOString().split('T')[0] : '',
        bank_id: record.bank_id || '',
        receipt: record.receipt || ''
      }] : []
    });
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleDeleteRecord = async (id) => {
    if (!window.confirm('Delete this record?')) return;
    try {
      await axios.delete(`http://localhost:5000/finance/delete-custom-payment/${id}`);
      setCategoryRecords(prev => prev.filter(r => r.id !== id));
      alert('Record deleted successfully');
    } catch (err) {
      alert('Delete failed: ' + (err.response?.data?.message || err.message));
    }
  };

  const toggleRow = (id) => {
    setExpandedRows(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const renderModal = () => {
    if (!isModalOpen || !selectedCategory || selectedCategory.isStatic) return null;

    const isPayable = paymentForm.payment_type_id === "1" || paymentForm.payment_type_id === 1;
    const mainLabel = isPayable ? "Payable Amount" : "Receivable Amount";
    const paidLabel = isPayable ? "Paid Amount" : "Received Amount";

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[95vh] overflow-y-auto">
          <div className="p-6 border-b flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">
              {isEditMode ? 'Edit' : 'Add'} Record — {selectedCategory.label}
            </h2>
            <button onClick={() => { setIsModalOpen(false); setIsEditMode(false); }}>
              <X size={24} className="text-gray-500 hover:text-gray-700" />
            </button>
          </div>

          <form onSubmit={handlePaymentSubmit} className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Payment Type <span className="text-red-500">*</span></label>
              <select
                name="payment_type_id"
                value={paymentForm.payment_type_id}
                onChange={handlePaymentChange}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500"
                required
              >
                <option value="">Select Type</option>
                <option value="1">Payable</option>
                <option value="2">Receivable</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {mainLabel} <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="amount"
                value={paymentForm.amount}
                onChange={handlePaymentChange}
                step="0.01"
                min="0"
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500"
                placeholder="0.00"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {isPayable ? "Payable Date" : "Receivable Date"}
              </label>
              <input
                type="date"
                name="date"
                value={paymentForm.date}
                onChange={handlePaymentChange}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500"
              />
            </div>

            {/* Multiple Payment Lines */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <label className="text-sm font-medium text-gray-700">{paidLabel} Entries</label>
                <button
                  type="button"
                  onClick={addPaymentLine}
                  className="flex items-center gap-2 px-5 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 text-sm"
                >
                  <Plus size={18} /> Add {paidLabel} Entry
                </button>
              </div>

              {paymentForm.paymentLines.map((line, index) => (
                <div key={index} className="border border-gray-200 rounded-xl p-5 mb-4 bg-gray-50">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">{paidLabel}</label>
                      <input
                        type="number"
                        value={line.paid_receive_amount}
                        onChange={(e) => updatePaymentLine(index, 'paid_receive_amount', e.target.value)}
                        step="0.01"
                        min="0"
                        className="w-full px-4 py-2 border rounded-lg"
                        placeholder="0.00"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Date</label>
                      <input
                        type="date"
                        value={line.paid_receive_date}
                        onChange={(e) => updatePaymentLine(index, 'paid_receive_date', e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Bank</label>
                      <select
                        value={line.bank_id}
                        onChange={(e) => updatePaymentLine(index, 'bank_id', e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg"
                      >
                        <option value="">Select Bank</option>
                        {banks.map(bank => (
                          <option key={bank.id} value={bank.id}>{bank.bank_name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Receipt / Reference</label>
                      <input
                        type="text"
                        value={line.receipt}
                        onChange={(e) => updatePaymentLine(index, 'receipt', e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg"
                        placeholder="REC-001"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removePaymentLine(index)}
                    className="mt-3 text-red-600 hover:text-red-800 text-sm flex items-center gap-1"
                  >
                    <Trash2 size={16} /> Remove Entry
                  </button>
                </div>
              ))}

              {paymentForm.paymentLines.length === 0 && (
                <p className="text-gray-500 italic text-sm">Click "Add {paidLabel} Entry" to add partial payments</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
              <textarea
                name="remarks"
                value={paymentForm.remarks}
                onChange={handlePaymentChange}
                rows={3}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500"
                placeholder="Any additional notes..."
              />
            </div>

            <div className="flex justify-end gap-4 pt-6 border-t">
              <button
                type="button"
                onClick={() => { setIsModalOpen(false); setIsEditMode(false); }}
                className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition"
              >
                {isEditMode ? 'Update Record' : 'Save & Add Another'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const renderDetailView = () => {
    if (!selectedCategory) return null;

    if (selectedCategory.isStatic) {
      switch (selectedCategory.value) {
        case 'creditors':
          return (
            <div className="mt-8">
              <h2 className="text-2xl font-bold mb-4 border-b pb-2">Creditors List</h2>
              <ViewCreditors creditors={creditors} loading={false} onRefresh={loadCreditors} />
            </div>
          );
        case 'billed-debtors':
          return (
            <div className="mt-8">
              <h2 className="text-2xl font-bold mb-4 border-b pb-2">Billed Debtors List</h2>
              <ViewBilledDebtors createdBy={createdBy} />
            </div>
          );
        default:
          return <div className="mt-8 text-center text-gray-600 italic">No detailed view available</div>;
      }
    }

    return (
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4 border-b pb-2">
          Records for: {selectedCategory.label}
        </h2>

        <CategoryFinancialSummary records={categoryRecords} categoryLabel={selectedCategory.label} />

        {recordsLoading ? (
          <div className="text-center py-10 text-gray-500 animate-pulse">Loading records...</div>
        ) : fetchError ? (
          <div className="text-center py-10 text-red-600 bg-red-50 rounded-lg p-6 border border-red-200">
            Error loading records: {fetchError}
          </div>
        ) : categoryRecords.length === 0 ? (
          <div className="text-center py-12 text-gray-600 bg-white rounded-xl shadow border p-8">
            <p className="text-lg font-medium mb-2">No records found</p>
            <p className="text-sm">
              No payment entries yet for <strong>"{selectedCategory.label}"</strong>.<br />
              Click <strong>"Add Record"</strong> to start.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow border overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="w-10 px-4"></th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Paid/Received</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remarks</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {categoryRecords.map((record) => {
                  const isExpanded = expandedRows[record.id] || false;
                  const totalPaidReceived = Number(record.paid_receive_amount || 0);

                  return (
                    <React.Fragment key={record.id}>
                      {/* Main Row - Shown once per unique main record */}
                      <tr 
                        className="hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => toggleRow(record.id)}
                      >
                        <td className="px-4 py-4">
                          {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {record.date ? new Date(record.date).toLocaleDateString('en-GB') : '—'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap font-medium text-green-700">
                          ₹{Number(record.amount || 0).toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            (record.payment_type || '').toLowerCase() === 'payable' 
                              ? 'bg-red-100 text-red-800' 
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {record.payment_type || record.type_name || '—'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap font-medium text-emerald-700">
                          ₹{totalPaidReceived.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700 max-w-xs truncate">{record.remarks || '—'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-center" onClick={e => e.stopPropagation()}>
                          <div className="flex items-center justify-center gap-4">
                            <button 
                              onClick={() => handleEditRecord(record)} 
                              className="text-blue-600 hover:text-blue-900 transition-colors"
                            >
                              <Edit size={18} />
                            </button>
                            <button 
                              onClick={() => handleDeleteRecord(record.id)} 
                              className="text-red-600 hover:text-red-900 transition-colors"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* Expanded Transaction Details */}
                      {isExpanded && (
                        <tr>
                          <td colSpan="7" className="bg-gray-50 px-8 py-5">
                            <div className="font-medium text-gray-700 mb-3">Payment Transactions:</div>
                            {record.paid_receive_amount ? (
                              <div className="bg-white border rounded-lg p-4 grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                                <div><strong>Amount:</strong> ₹{Number(record.paid_receive_amount).toFixed(2)}</div>
                                <div><strong>Date:</strong> {record.paid_receive_date ? new Date(record.paid_receive_date).toLocaleDateString('en-GB') : '—'}</div>
                                <div><strong>Bank:</strong> {record.bank_name || '—'}</div>
                                <div><strong>Receipt:</strong> {record.receipt || '—'}</div>
                              </div>
                            ) : (
                              <p className="text-gray-500 italic">No transactions recorded yet.</p>
                            )}
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg border p-8 mb-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-4 rounded-xl shadow-xl" style={{ backgroundColor: themeColors.primary }}>
              <ArrowDownCircle className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Fund Flow Statement</h1>
              <p className="text-gray-600">Manage all payment records in one place</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-end gap-6">
            <div className="flex-1 w-full md:max-w-lg">
              <label className="block text-lg font-semibold mb-3 text-gray-700">
                Payment For / Filter View
              </label>
              <CreatableSelect
                options={allCategories}
                value={selectedCategory}
                onChange={setSelectedCategory}
                onCreateOption={handleCreateCategory}
                placeholder="Search or create new category..."
                formatCreateLabel={(input) => `Create new: "${input}"`}
                isSearchable
                isClearable
                formatOptionLabel={(opt) => (
                  <div className="flex items-center gap-3">
                    {opt.icon && <opt.icon size={20} className={opt.isStatic ? 'text-teal-600' : 'text-purple-600'} />}
                    <span>{opt.label}</span>
                  </div>
                )}
                styles={customStyles}
              />
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              disabled={!selectedCategory}
              className={`w-full md:w-auto px-10 py-4 rounded-lg font-bold text-white flex justify-center items-center gap-3 transition-all transform shadow-md ${
                !selectedCategory ? 'bg-gray-400 cursor-not-allowed' : 'bg-teal-600 hover:bg-teal-700 hover:scale-105'
              }`}
            >
              <Plus size={22} /> Add Record
            </button>
          </div>
        </div>

        {renderDetailView()}
        {renderModal()}

        <div className="mt-12">
          <ViewPaymentEntry />
        </div>
      </div>
    </div>
  );
};

export default CommonPaymentEntry;