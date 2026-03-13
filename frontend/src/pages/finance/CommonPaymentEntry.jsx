// // pages/finance/CommonPaymentEntry.jsx
// import React, { useState, useEffect } from 'react';
// import Select from 'react-select';
// import axios from 'axios';
// import {
//   ArrowDownCircle, Plus, Users, Truck, Wrench, Home, ScrollText, Calculator, CreditCard, FileText, Building2, DollarSign, Percent, X, Coins
// } from 'lucide-react';

// // All modals (for "Add Record")
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

// // Static Views (displayed below)
// import ViewCreditors from '../../components/FinanceComponents/CommonPaymentEntry/ViewCreditors';
// import ViewBilledDebtors from '../../components/FinanceComponents/CommonPaymentEntry/ViewBilledDebtors'; // ← Static view

// // === IMPORT THE NEW VIEW COMPONENT HERE ===
// import ViewPaymentEntry from '../../components/FinanceComponents/CommonPaymentEntry/ViewPaymentEntry';
// // ===========================================

// const themeColors = { primary: '#1e7a6f' };

// const customStyles = {
//   control: (p) => ({ 
//     ...p, 
//     borderRadius: '0.75rem', 
//     padding: '0.75rem', 
//     borderColor: '#dee2e6',
//     boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
//   }),
//   option: (p, s) => ({
//     ...p,
//     backgroundColor: s.isSelected ? themeColors.primary : s.isFocused ? '#ecfdf5' : 'white',
//     color: s.isSelected ? 'white' : '#212529',
//     transition: 'background-color 0.15s ease-in-out',
//   }),
// };

// const paymentOptions = [
//   { value: 'creditors', label: 'Creditors', icon: Building2 },
//   { value: 'siteincharge-attendance', label: 'SiteIncharge Attendance', icon: Users },
//   { value: 'salary-payables', label: 'Salary Payables', icon: DollarSign },
//   { value: 'transport', label: 'Transport', icon: Truck },
//   { value: 'scaffolding', label: 'Scaffolding', icon: Wrench },
//   { value: 'site-accommodation', label: 'Site Accommodation', icon: Home },
//   { value: 'commission', label: 'Commission', icon: Coins },
//   { value: 'gst', label: 'GST', icon: Calculator },
//   { value: 'tds', label: 'TDS', icon: ScrollText },
//   { value: 'credit-card', label: 'Credit Card', icon: CreditCard },
//   { value: 'billed-debtors', label: 'Billed Debtors', icon: FileText },
// ];

// const CommonPaymentEntry = () => {
//   const [selectedPayment, setSelectedPayment] = useState(null); 
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [createdBy, setCreatedBy] = useState('');
//   const [creditors, setCreditors] = useState([]);
//   const [loading, setLoading] = useState(false);

//   // Extract real user ID from URL: /payments/NA==
//   useEffect(() => {
//     const match = window.location.pathname.match(/\/payments\/([^/]+)$/);
//     if (match?.[1]) {
//       try {
//         setCreatedBy(atob(match[1]));
//       } catch {
//         setCreatedBy('1'); // Default fallback ID
//       }
//     }
//   }, []);

//   // Load creditors when selected
//   useEffect(() => {
//     if (selectedPayment?.value === 'creditors') {
//       loadCreditors();
//     }
//   }, [selectedPayment]);

//   const loadCreditors = async () => {
//     setLoading(true);
//     try {
//       const res = await axios.get('https://scpl.kggeniuslabs.com/api/finance/view-creditors');
//       setCreditors(res.data.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Determine which *detailed* view component to render 
//   const renderDetailView = () => {
//     switch (selectedPayment?.value) {
//       case 'creditors':
//         return (
//           <div className="mt-8">
//             <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">Creditors List</h2>
//             <ViewCreditors
//               creditors={creditors}
//               loading={loading}
//               onRefresh={loadCreditors}
//             />
//           </div>
//         );
//       case 'billed-debtors':
//         return (
//           <div className="mt-8">
//             <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">Billed Debtors List</h2>
//             <ViewBilledDebtors createdBy={createdBy} />
//           </div>
//         );
//       default:
//         return null;
//     }
//   };
  
//   // Determine which modal component to render
//   const renderModal = () => {
//     if (!isModalOpen || !selectedPayment) return null;

//     const commonProps = { createdBy, onClose: () => setIsModalOpen(false) };
//     const onSuccessProps = selectedPayment.value === 'creditors' ? { onSuccess: () => { setIsModalOpen(false); loadCreditors(); } } : commonProps;

//     switch (selectedPayment.value) {
//         case 'creditors': return <CreateCreditors {...onSuccessProps} onCancel={() => setIsModalOpen(false)} />;
//         case 'siteincharge-attendance': return <SiteInchargeAttendanceModal {...commonProps} />;
//         case 'salary-payables': return <SalaryPayablesModal {...commonProps} />;
//         case 'transport': return <TransportPayablesModal {...commonProps} />;
//         case 'scaffolding': return <ScaffoldingPayablesModal {...commonProps} />;
//         case 'site-accommodation': return <SiteAccommodationPayablesModal {...commonProps} />;
//         case 'commission': return <CommissionPayablesModal {...commonProps} />;
//         case 'gst': return <GstPayablesModal {...commonProps} />;
//         case 'tds': return <TdsPayablesModal {...commonProps} />;
//         case 'credit-card': return <CreditCardPayablesModal {...commonProps} />;
//         case 'billed-debtors': return <BilledDebtorsModal {...commonProps} />;
//         default: return null;
//     }
//   };


//   return (
//     <div className="min-h-screen bg-gray-50 py-8 px-4">
//       <div className="max-w-7xl mx-auto">

//         {/* 1. Header + Category Selector (Always at Top) */}
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
//               <label className="block text-lg font-semibold mb-3 text-gray-700">Payment For / Filter View</label>
//               <Select
//                 options={paymentOptions}
//                 value={selectedPayment}
//                 onChange={setSelectedPayment}
//                 placeholder="Select category to filter view..."
//                 isSearchable
//                 isClearable
//                 formatOptionLabel={(opt) => (
//                   <div className="flex items-center gap-3">
//                     <opt.icon size={20} className={'text-teal-600'} />
//                     <span>{opt.label}</span>
//                   </div>
//                 )}
//                 styles={customStyles}
//               />
//             </div>

//             {/* Enable Add Record button only when a specific category is selected */}
//             <button
//                 onClick={() => setIsModalOpen(true)}
//                 disabled={!selectedPayment}
//                 className={`w-full md:w-auto px-10 py-4 rounded-lg font-bold text-white flex justify-center items-center gap-3 transition-all transform shadow-md ${
//                     !selectedPayment ? 'bg-gray-400 cursor-not-allowed' : 'bg-teal-600 hover:bg-teal-700 hover:scale-[1.01] active:scale-[0.99]'
//                 }`}
//             >
//             <Plus size={22} /> Add Record
//             </button>
//           </div>
//         </div>

//         {/* 2. RENDER THE SPECIFIC DETAIL VIEW (if selected) */}
//         {renderDetailView()}

//         {/* 3. Add Record Modals */}
//         {renderModal()}
        
//         {/* --- 4. MAIN OVERVIEW COMPONENT DISPLAYED AT THE VERY BOTTOM --- */}
//         <div className="mt-12"> 
//             <ViewPaymentEntry />
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
  ArrowDownCircle, Plus, Users, Truck, Wrench, Home, ScrollText, Calculator, CreditCard, FileText,
  Building2, DollarSign, Percent, X, Coins, MoreHorizontal, Trash2, Edit
} from 'lucide-react';

// ─── Existing Modals & Views ────────────────────────────────────────────────
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

const paymentTypeOptions = [
  { value: 'Payable', label: 'Payable' },
  { value: 'Receivable', label: 'Receivable' },
];

const CommonPaymentEntry = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [createdBy, setCreatedBy] = useState('');
  const [creditors, setCreditors] = useState([]);
  const [loading, setLoading] = useState(false);

  const [allCategories, setAllCategories] = useState(staticCategories);

  const [paymentForm, setPaymentForm] = useState({
    id: null,
    date: '',
    amount: '',
    receipt: '',
    cash: '',
    bank_name: '',
    remarks: '',
    payment_type: 'Payable',
  });
  const [formErrors, setFormErrors] = useState({});
  const [isEditMode, setIsEditMode] = useState(false);

  const [categoryRecords, setCategoryRecords] = useState([]);
  const [recordsLoading, setRecordsLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  // Load user ID from URL
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

  // Load custom categories once
  useEffect(() => {
    const loadCustom = async () => {
      try {
        const res = await axios.get('https://scpl.kggeniuslabs.com/api/finance/custom-categories');
        if (res.data?.status === 'success' && res.data.data) {
          const custom = res.data.data.map(cat => ({
            value: cat.category_name,
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

  // Fetch data when category changes
  useEffect(() => {
    if (!selectedCategory) {
      setCategoryRecords([]);
      setCreditors([]);
      setFetchError(null);
      return;
    }

    setFetchError(null);

    if (selectedCategory.isStatic) {
      if (selectedCategory.value === 'creditors') {
        loadCreditors();
      }
      setCategoryRecords([]);
    } else {
      fetchCategoryRecords(selectedCategory.value);
    }
  }, [selectedCategory]);

  const loadCreditors = async () => {
    setLoading(true);
    try {
      const res = await axios.get('https://scpl.kggeniuslabs.com/api/finance/view-creditors');
      setCreditors(res.data?.data?.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)) || []);
    } catch (err) {
      console.error('Creditors fetch failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategoryRecords = async (categoryName) => {
    if (!categoryName) return;

    setRecordsLoading(true);
    setCategoryRecords([]);
    setFetchError(null);

    try {
      const res = await axios.get('https://scpl.kggeniuslabs.com/api/finance/custom-payments-by-category', {
        params: { category_name: categoryName.trim() },
      });

      if (res.data?.status === 'success') {
        setCategoryRecords(res.data.data || []);
      } else {
        setFetchError(res.data?.message || 'Unexpected response format');
      }
    } catch (err) {
      console.error('Fetch records error:', err);
      setFetchError(err.response?.data?.message || 'Failed to load records');
      setCategoryRecords([]);
    } finally {
      setRecordsLoading(false);
    }
  };

  const handleEditRecord = (record) => {
    setPaymentForm({
      id: record.id,
      date: record.date ? new Date(record.date).toISOString().split('T')[0] : '',
      amount: record.amount || '',
      receipt: record.receipt || '',
      cash: record.cash || '',
      bank_name: record.bank_name || '',
      remarks: record.remarks || '',
      payment_type: record.payment_type || 'Payable',
    });
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleDeleteRecord = async (id) => {
    if (!window.confirm('Delete this record?')) return;

    try {
      await axios.delete(`https://scpl.kggeniuslabs.com/api/finance/delete-custom-payment/${id}`);
      setCategoryRecords(prev => prev.filter(r => r.id !== id));
      alert('Record deleted successfully');
    } catch (err) {
      alert('Delete failed: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleCreateCategory = async (inputValue) => {
    if (!inputValue?.trim()) return;

    const trimmed = inputValue.trim();

    try {
      const res = await axios.post('https://scpl.kggeniuslabs.com/api/finance/create-custom-category', {
        category_name: trimmed,
        created_by: createdBy,
      });

      if (res.data?.status === 'success') {
        const newCat = {
          value: trimmed,
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
    if (formErrors[name]) setFormErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    const errors = {};

    if (!selectedCategory) errors.category = 'No category selected';
    if (!paymentForm.amount || isNaN(parseFloat(paymentForm.amount)) || parseFloat(paymentForm.amount) < 0) {
      errors.amount = 'Valid amount required';
    }
    if (!paymentForm.payment_type) errors.payment_type = 'Payment type required';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      const payload = {
        category_name: selectedCategory.value,
        payment_type: paymentForm.payment_type,
        date: paymentForm.date || null,
        amount: parseFloat(paymentForm.amount),
        receipt: paymentForm.receipt || null,
        cash: paymentForm.cash ? parseFloat(paymentForm.cash) : null,
        bank_name: paymentForm.bank_name || null,
        remarks: paymentForm.remarks || null,
        created_by: createdBy,
      };

      let res;
      if (isEditMode && paymentForm.id) {
        res = await axios.put(`https://scpl.kggeniuslabs.com/api/finance/update-custom-payment/${paymentForm.id}`, {
          ...payload,
          updated_by: createdBy,
        });
      } else {
        res = await axios.post('https://scpl.kggeniuslabs.com/api/finance/create-custom-payment', payload);
      }

      if (res.data?.status === 'success') {
        alert(isEditMode ? 'Record updated!' : 'Record saved!');
        setPaymentForm({
          id: null,
          date: '',
          amount: '',
          receipt: '',
          cash: '',
          bank_name: '',
          remarks: '',
          payment_type: 'Payable',
        });
        setFormErrors({});
        setIsEditMode(false);
        setIsModalOpen(false);

        if (!selectedCategory?.isStatic) {
          fetchCategoryRecords(selectedCategory.value);
        }
      }
    } catch (err) {
      alert('Save failed: ' + (err.response?.data?.message || err.message));
    }
  };

  const renderModal = () => {
    if (!isModalOpen || !selectedCategory) return null;

    if (!selectedCategory.isStatic) {
      return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">
                {isEditMode ? 'Edit' : 'Add'} Record: {selectedCategory.label}
              </h2>
              <button onClick={() => { setIsModalOpen(false); setIsEditMode(false); }}>
                <X size={24} className="text-gray-500 hover:text-gray-700" />
              </button>
            </div>

            <form onSubmit={handlePaymentSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <div className="w-full px-4 py-2 border bg-gray-100 rounded-lg font-medium">
                  {selectedCategory.label}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="payment_type"
                  value={paymentForm.payment_type}
                  onChange={handlePaymentChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 ${
                    formErrors.payment_type ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select type</option>
                  <option value="Payable">Payable</option>
                  <option value="Receivable">Receivable</option>
                </select>
                {formErrors.payment_type && <p className="text-red-600 text-sm mt-1">{formErrors.payment_type}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  name="date"
                  value={paymentForm.date}
                  onChange={handlePaymentChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="amount"
                  value={paymentForm.amount}
                  onChange={handlePaymentChange}
                  step="0.01"
                  min="0"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 ${
                    formErrors.amount ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="0.00"
                />
                {formErrors.amount && <p className="text-red-600 text-sm mt-1">{formErrors.amount}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Receipt / Reference</label>
                <input
                  type="text"
                  name="receipt"
                  value={paymentForm.receipt}
                  onChange={handlePaymentChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                  placeholder="REC-001 / INV-456"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cash Amount</label>
                <input
                  type="number"
                  name="cash"
                  value={paymentForm.cash}
                  onChange={handlePaymentChange}
                  step="0.01"
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
                <input
                  type="text"
                  name="bank_name"
                  value={paymentForm.bank_name}
                  onChange={handlePaymentChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                  placeholder="HDFC / SBI / ICICI"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
                <textarea
                  name="remarks"
                  value={paymentForm.remarks}
                  onChange={handlePaymentChange}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                  placeholder="Any additional notes..."
                />
              </div>

              <div className="flex justify-end gap-4 pt-4 border-t">
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
                  {isEditMode ? 'Update Record' : 'Save Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      );
    }

    const commonProps = { createdBy, onClose: () => setIsModalOpen(false) };
    switch (selectedCategory.value) {
      case 'creditors': return <CreateCreditors {...commonProps} onSuccess={() => { setIsModalOpen(false); loadCreditors(); }} />;
      case 'siteincharge-attendance': return <SiteInchargeAttendanceModal {...commonProps} />;
      case 'salary-payables': return <SalaryPayablesModal {...commonProps} />;
      case 'transport': return <TransportPayablesModal {...commonProps} />;
      case 'scaffolding': return <ScaffoldingPayablesModal {...commonProps} />;
      case 'site-accommodation': return <SiteAccommodationPayablesModal {...commonProps} />;
      case 'commission': return <CommissionPayablesModal {...commonProps} />;
      case 'gst': return <GstPayablesModal {...commonProps} />;
      case 'tds': return <TdsPayablesModal {...commonProps} />;
      case 'credit-card': return <CreditCardPayablesModal {...commonProps} />;
      case 'billed-debtors': return <BilledDebtorsModal {...commonProps} />;
      default: return null;
    }
  };

  const renderDetailView = () => {
    if (!selectedCategory) return null;

    if (selectedCategory.isStatic) {
      switch (selectedCategory.value) {
        case 'creditors':
          return (
            <div className="mt-8">
              <h2 className="text-2xl font-bold mb-4 border-b pb-2">Creditors List</h2>
              <ViewCreditors creditors={creditors} loading={loading} onRefresh={loadCreditors} />
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

    // Custom category records
    return (
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4 border-b pb-2">
          Records for: {selectedCategory.label}
        </h2>

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
              There are no payment entries yet for <strong>"{selectedCategory.label}"</strong>.<br />
              Click <strong>"Add Record"</strong> above to add your first entry.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto bg-white rounded-xl shadow border">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Receipt</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bank</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remarks</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {categoryRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {record.date ? new Date(record.date).toLocaleDateString('en-GB') : '—'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-green-700">
                      ₹{Number(record.amount || 0).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          record.payment_type === 'Payable' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {record.payment_type || '—'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{record.receipt || '—'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{record.bank_name || '—'}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{record.remarks || '—'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(record.created_at).toLocaleDateString('en-GB')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                      <div className="flex items-center justify-center gap-4">
                        <button
                          onClick={() => handleEditRecord(record)}
                          className="text-blue-600 hover:text-blue-900 transition-colors"
                          title="Edit record"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteRecord(record.id)}
                          className="text-red-600 hover:text-red-900 transition-colors"
                          title="Delete record"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
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
        {/* Header + Selector */}
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
                placeholder="Search or create category..."
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

        {/* Records / Views */}
        {renderDetailView()}

        {/* Modal */}
        {renderModal()}

        {/* Global Overview */}
        <div className="mt-12">
          <ViewPaymentEntry />
        </div>
      </div>
    </div>
  );
};

export default CommonPaymentEntry;