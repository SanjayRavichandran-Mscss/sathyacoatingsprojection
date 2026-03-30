// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Building2, IndianRupee, X, Edit3, Save, AlertCircle } from 'lucide-react';

// // Same theme as GstPayable component
// const themeColors = {
//   primary: '#1e7a6f',
//   accent: '#c79100',
//   lightBg: '#f8f9fa',
//   textPrimary: '#212529',
//   textSecondary: '#6c757d',
//   border: '#dee2e6',
//   lightBorder: '#e9ecef',
// };

// const Bank = () => {
//   const [banks, setBanks] = useState([]);
//   const [cfsData, setCfsData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [selectedBank, setSelectedBank] = useState(null);
//   const [showLedger, setShowLedger] = useState(false);
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [editingBank, setEditingBank] = useState(null);
//   const [editForm, setEditForm] = useState({ bank_name: '', available_balance: '', remarks: '' });

//   const userId = 1;

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [bankRes, cfsRes] = await Promise.all([
//           axios.get('https://scpl.kggeniuslabs.com/api/finance/bank-masters'),
//           axios.get('https://scpl.kggeniuslabs.com/api/finance/cfs-data')
//         ]);
//         if (bankRes.data.status === 'success') setBanks(bankRes.data.data);
//         setCfsData(cfsRes.data);
//       } catch (err) {
//         alert('Failed to load data');
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, []);

//   const getBankSummary = (bankId) => {
//     if (!cfsData || !bankId) return { available: 0, totalPayable: 0, totalReceivable: 0, payables: [], receivables: [] };

//     const bank = banks.find(b => b.id === bankId);
//     const available = parseFloat(bank?.available_balance || 0);

//     const payables = [
//       ...(cfsData.creditors_payable_data || []),
//       ...(cfsData.salary_payable_data || []),
//       ...(cfsData.transport_payable_data || []),
//       ...(cfsData.scaffolding_payable_data || []),
//       ...(cfsData.site_accommodation_payable_data || []),
//       ...(cfsData.commission_payable_data || []),
//       ...(cfsData.gst_payable_data || []).filter(g => parseFloat(g.net_gst_payable || 0) > 0),
//       ...(cfsData.tds_payable_data || []).filter(t => parseFloat(t.net_tds_due || 0) > 0),
//       ...(cfsData.creditcard_payable_data || [])
//     ].filter(t => t.finance_bank_id === bankId);

//     const receivables = [
//       ...(cfsData.billed_debtors_receivable_data || []),
//       ...(cfsData.tds_returnable_receivable_data || [])
//     ].filter(t => t.finance_bank_id === bankId);

//     const totalPayable = payables.reduce((sum, item) => sum + parseFloat(
//       item.balance_amount || item.amount_due || item.net_gst_payable || item.net_tds_due || 0
//     ), 0);

//     const totalReceivable = receivables.reduce((sum, item) => sum + parseFloat(
//       item.balance_amount || item.returnable || 0
//     ), 0);

//     return { available, totalPayable, totalReceivable, payables, receivables };
//   };

//   const getOverallSummary = () => {
//     let totalAvailable = 0, totalPayables = 0, totalReceivables = 0;
//     banks.forEach(bank => {
//       const s = getBankSummary(bank.id);
//       totalAvailable += s.available;
//       totalPayables += s.totalPayable;
//       totalReceivables += s.totalReceivable;
//     });
//     const net = totalAvailable + totalReceivables - totalPayables;
//     return { totalAvailable, totalPayables, totalReceivables, net };
//   };

//   const overall = getOverallSummary();

//   const openLedger = (bank) => { setSelectedBank(bank); setShowLedger(true); };

//   const openEditModal = (e, bank) => {
//     e.stopPropagation();
//     setEditingBank(bank);
//     setEditForm({ bank_name: bank.bank_name, available_balance: bank.available_balance || '', remarks: '' });
//     setShowEditModal(true);
//   };

//   const saveBankEdit = async () => {
//     if (!editForm.bank_name.trim()) return alert('Bank name required');
//     const oldBal = parseFloat(editingBank.available_balance || 0);
//     const newBal = parseFloat(editForm.available_balance || 0);
//     if (newBal !== oldBal && !editForm.remarks.trim()) return alert('Remarks required when balance changes');

//     try {
//       await axios.put('https://scpl.kggeniuslabs.com/api/finance/update-bank-master', {
//         bank_name: editForm.bank_name.trim(),
//         available_balance: newBal || null,
//         remarks: editForm.remarks.trim() || null,
//         updated_by: userId
//       }, { params: { id: editingBank.id } });

//       const res = await axios.get('https://scpl.kggeniuslabs.com/api/finance/bank-masters');
//       setBanks(res.data.data);
//       setShowEditModal(false);
//     } catch (err) {
//       alert(err.response?.data?.message || 'Update failed');
//     }
//   };

//   const formatINR = (amt) => '₹' + Number(amt || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 });

//   return (
//     <div className="min-h-screen p-4 sm:p-6 lg:p-8" style={{ backgroundColor: themeColors.lightBg }}>
//       <div className="max-w-7xl mx-auto">

//         {/* Header */}
//         <div className="bg-white rounded-xl shadow-sm border p-6 mb-6" style={{ borderColor: themeColors.border }}>
//           <div className="flex items-center gap-4">
//             <div className="p-3 rounded-lg" style={{ backgroundColor: themeColors.primary }}>
//               <Building2 className="w-8 h-8 text-white" />
//             </div>
//             <div>
//               <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: themeColors.textPrimary }}>
//                 Cash Flow Summary (CFS)
//               </h1>
//               <p className="text-sm mt-1" style={{ color: themeColors.textSecondary }}>
//                 Real-time bank-wise liquidity & net position
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Overall Summary Cards */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//           <div className="bg-white border rounded-xl p-6 shadow-sm" style={{ borderColor: themeColors.border }}>
//             <p className="text-sm font-medium" style={{ color: themeColors.textSecondary }}>Total Available</p>
//             <p className="text-2xl font-bold mt-2 text-green-700">{formatINR(overall.totalAvailable)}</p>
//           </div>
//           <div className="bg-white border rounded-xl p-6 shadow-sm" style={{ borderColor: themeColors.border }}>
//             <p className="text-sm font-medium" style={{ color: themeColors.textSecondary }}>Total Paid</p>
//             <p className="text-2xl font-bold mt-2 text-red-700">{formatINR(overall.totalPayables)}</p>
//           </div>
//           <div className="bg-white border rounded-xl p-6 shadow-sm" style={{ borderColor: themeColors.border }}>
//             <p className="text-sm font-medium" style={{ color: themeColors.textSecondary }}>Total Received</p>
//             <p className="text-2xl font-bold mt-2 text-blue-700">{formatINR(overall.totalReceivables)}</p>
//           </div>
//           <div className="bg-white border rounded-xl p-6 shadow-sm" style={{ borderColor: themeColors.border }}>
//             <p className="text-sm font-medium" style={{ color: themeColors.textSecondary }}>Net Position</p>
//             <p className={`text-3xl font-bold mt-2 ${overall.net >= 0 ? 'text-green-700' : 'text-red-700'}`}>
//               {formatINR(Math.abs(overall.net))}
//             </p>
//             <p className="text-sm font-medium mt-1" style={{ color: themeColors.textSecondary }}>
//               {overall.net >= 0 ? 'Surplus' : 'Shortfall'}
//             </p>
//           </div>
//         </div>

//         {/* Banks Table */}
//         {loading ? (
//           <div className="bg-white rounded-xl shadow-sm border p-16 text-center" style={{ borderColor: themeColors.border }}>
//             <p style={{ color: themeColors.textSecondary }}>Loading banks...</p>
//           </div>
//         ) : banks.length === 0 ? (
//           <div className="bg-white rounded-xl shadow-sm border p-16 text-center" style={{ borderColor: themeColors.border }}>
//             <p style={{ color: themeColors.textSecondary }}>No banks found</p>
//           </div>
//         ) : (
//           <div className="bg-white rounded-xl shadow-sm border overflow-hidden" style={{ borderColor: themeColors.border }}>
//             <table className="w-full">
//               <thead style={{ backgroundColor: themeColors.lightBg }}>
//                 <tr>
//                   <th className="px-6 py-4 text-left text-xs font-semibold uppercase" style={{ color: themeColors.textSecondary }}>Bank Name</th>
//                   <th className="px-6 py-4 text-right text-xs font-semibold uppercase" style={{ color: themeColors.textSecondary }}>Available</th>
//                   <th className="px-6 py-4 text-right text-xs font-semibold uppercase text-red-600">Payables</th>
//                   <th className="px-6 py-4 text-right text-xs font-semibold uppercase text-blue-600">Receivables</th>
//                   <th className="px-6 py-4 text-right text-xs font-semibold uppercase" style={{ color: themeColors.textSecondary }}>Net Position</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y" style={{ borderColor: themeColors.lightBorder }}>
//                 {banks.map(bank => {
//                   const { available, totalPayable, totalReceivable } = getBankSummary(bank.id);
//                   const net = available + totalReceivable - totalPayable;

//                   return (
//                     <tr key={bank.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => openLedger(bank)}>
//                       <td className="px-6 py-4">
//                         <button
//                           onClick={(e) => openEditModal(e, bank)}
//                           className="flex items-center gap-2 font-medium text-teal-700 hover:underline"
//                         >
//                           <Edit3 size={16} />
//                           {bank.bank_name}
//                         </button>
//                       </td>
//                       <td className="px-6 py-4 text-right font-medium text-green-700">{formatINR(available)}</td>
//                       <td className="px-6 py-4 text-right font-medium text-red-700">{formatINR(totalPayable)}</td>
//                       <td className="px-6 py-4 text-right font-medium text-blue-700">{formatINR(totalReceivable)}</td>
//                       <td className="px-6 py-4 text-right">
//                         <div className={`font-bold text-lg ${net >= 0 ? 'text-green-700' : 'text-red-700'}`}>
//                           {formatINR(Math.abs(net))}
//                         </div>
//                         <p className="text-xs" style={{ color: themeColors.textSecondary }}>
//                           {net >= 0 ? 'Surplus' : 'Shortfall'}
//                         </p>
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>
//         )}

//         {/* Edit Bank Modal */}
//     {/* Edit Bank Modal - Remarks Required on ANY Change */}
// {showEditModal && editingBank && (
//   <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//     <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
//       <div className="flex justify-between items-center mb-6 border-b pb-4" style={{ borderColor: themeColors.border }}>
//         <h3 className="text-xl font-bold" style={{ color: themeColors.textPrimary }}>
//           Edit Bank Details
//         </h3>
//         <button onClick={() => setShowEditModal(false)} className="text-gray-500 hover:text-gray-700">
//           <X size={24} />
//         </button>
//       </div>

//       <div className="space-y-5">
//         {/* Bank Name */}
//         <div>
//           <label className="block text-sm font-medium mb-2" style={{ color: themeColors.textSecondary }}>
//             Bank Name <span className="text-red-500">*</span>
//           </label>
//           <input
//             type="text"
//             value={editForm.bank_name}
//             onChange={(e) => setEditForm(prev => ({ ...prev, bank_name: e.target.value }))}
//             className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
//             style={{ borderColor: themeColors.border }}
//             placeholder="e.g., HDFC Bank"
//           />
//         </div>

//         {/* Available Balance */}
//         <div>
//           <label className="block text-sm font-medium mb-2" style={{ color: themeColors.textSecondary }}>
//             Available Balance
//           </label>
//           <input
//             type="number"
//             step="0.01"
//             value={editForm.available_balance}
//             onChange={(e) => setEditForm(prev => ({ ...prev, available_balance: e.target.value }))}
//             className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
//             style={{ borderColor: themeColors.border }}
//             placeholder="0.00"
//           />
//         </div>

//         {/* Remarks - Show if ANY field is changed */}
//         {(editForm.bank_name.trim() !== editingBank.bank_name.trim() ||
//           (editForm.available_balance !== '' && 
//            parseFloat(editForm.available_balance || 0) !== parseFloat(editingBank.available_balance || 0))
//         ) && (
//           <div>
//             <label className="block text-sm font-medium text-red-600 mb-2 flex items-center gap-2">
//               <AlertCircle size={18} />
//               Remarks <span className="text-red-500">*</span> (Required for any change)
//             </label>
//             <textarea
//               value={editForm.remarks}
//               onChange={(e) => setEditForm(prev => ({ ...prev, remarks: e.target.value }))}
//               className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
//               style={{ borderColor: '#fca5a5' }}
//               rows={4}
//               placeholder="Please explain the reason for changing bank name or balance..."
//               required
//             />
//           </div>
//         )}

//         {/* Action Buttons */}
//         <div className="flex gap-4 pt-6 border-t" style={{ borderColor: themeColors.border }}>
//           <button
//             onClick={() => setShowEditModal(false)}
//             className="flex-1 px-6 py-3 border rounded-lg font-medium hover:bg-gray-50 transition"
//             style={{ borderColor: themeColors.border }}
//           >
//             Cancel
//           </button>
//           <button
//             onClick={saveBankEdit}
//             disabled={
//               (editForm.bank_name.trim() !== editingBank.bank_name.trim() ||
//                (editForm.available_balance !== '' && 
//                 parseFloat(editForm.available_balance || 0) !== parseFloat(editingBank.available_balance || 0))
//               ) && !editForm.remarks.trim()
//             }
//             className="flex-1 px-6 py-3 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
//             style={{ 
//               backgroundColor: 
//                 (editForm.bank_name.trim() !== editingBank.bank_name.trim() ||
//                  (editForm.available_balance !== '' && 
//                   parseFloat(editForm.available_balance || 0) !== parseFloat(editingBank.available_balance || 0))
//                 ) && !editForm.remarks.trim()
//                 ? '#9ca3af' 
//                 : themeColors.primary 
//             }}
//           >
//             <Save size={18} />
//             Save Changes
//           </button>
//         </div>
//       </div>
//     </div>
//   </div>
// )}

//         {/* Full Detailed Ledger Modal */}
//         {showLedger && selectedBank && (
//           <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
//             <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
//               <div className="p-6 flex justify-between items-center border-b" style={{ backgroundColor: themeColors.primary, borderColor: themeColors.border }}>
//                 <h2 className="text-2xl font-bold text-white flex items-center gap-3">
//                   <Building2 className="w-8 h-8" />
//                   {selectedBank.bank_name} - Detailed Ledger
//                 </h2>
//                 <button onClick={() => setShowLedger(false)} className="text-white hover:bg-white/20 rounded-full p-2 transition">
//                   <X className="w-7 h-7" />
//                 </button>
//               </div>

//               <div className="flex-1 overflow-y-auto p-6">
//                 {(() => {
//                   const { available, totalPayable, totalReceivable, payables, receivables } = getBankSummary(selectedBank.id);
//                   const net = available + totalReceivable - totalPayable;

//                   return (
//                     <>
//                       {/* Summary Cards inside Ledger */}
//                       <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
//                         <div className="bg-green-50 border border-green-300 rounded-lg p-5 text-center">
//                           <p className="text-sm text-green-700 font-medium">Available Balance</p>
//                           <p className="text-xl font-bold text-green-800 mt-1">{formatINR(available)}</p>
//                         </div>
//                         <div className="bg-red-50 border border-red-300 rounded-lg p-5 text-center">
//                           <p className="text-sm text-red-700 font-medium">Total Payables</p>
//                           <p className="text-xl font-bold text-red-800 mt-1">{formatINR(totalPayable)}</p>
//                         </div>
//                         <div className="bg-blue-50 border border-blue-300 rounded-lg p-5 text-center">
//                           <p className="text-sm text-blue-700 font-medium">Total Receivables</p>
//                           <p className="text-xl font-bold text-blue-800 mt-1">{formatINR(totalReceivable)}</p>
//                         </div>
//                         <div className={`${net >= 0 ? 'bg-emerald-100 border-emerald-400' : 'bg-rose-100 border-rose-400'} border-2 rounded-lg p-6 text-center`}>
//                           <p className="text-sm font-bold">NET POSITION</p>
//                           <p className="text-2xl font-black mt-1">{formatINR(Math.abs(net))}</p>
//                           <p className={`text-sm font-bold mt-1 ${net >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
//                             {net >= 0 ? 'SURPLUS' : 'SHORTFALL'}
//                           </p>
//                         </div>
//                       </div>

//                       <div className="grid md:grid-cols-2 gap-8">
//                         {/* Pending Payments */}
//                         <div>
//                           <h3 className="text-lg font-bold text-red-700 mb-4">Pending Payments</h3>
//                           <div className="space-y-3">
//                             {payables.length === 0 ? (
//                               <p className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">No pending payments</p>
//                             ) : (
//                               payables.map((p, i) => (
//                                 <div key={i} className="bg-red-50 border border-red-200 rounded-lg p-4 flex justify-between">
//                                   <div>
//                                     <p className="font-medium text-gray-800">{p.client_name || p.employee_name || p.project_name || '—'}</p>
//                                     <p className="text-xs text-gray-600">{p.inv_number || p.description || p.month || '—'}</p>
//                                   </div>
//                                   <p className="font-bold text-red-700">
//                                     {formatINR(parseFloat(p.balance_amount || p.net_gst_payable || p.net_tds_due || 0))}
//                                   </p>
//                                 </div>
//                               ))
//                             )}
//                           </div>
//                         </div>

//                         {/* Expected Receipts */}
//                         <div>
//                           <h3 className="text-lg font-bold text-blue-700 mb-4">Expected Receipts</h3>
//                           <div className="space-y-3">
//                             {receivables.length === 0 ? (
//                               <p className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">No expected receipts</p>
//                             ) : (
//                               receivables.map((r, i) => (
//                                 <div key={i} className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex justify-between">
//                                   <div>
//                                     <p className="font-medium text-gray-800">{r.party_name || r.project_name || 'TDS Refund'}</p>
//                                     <p className="text-xs text-gray-600">{r.inv_no || r.month || '—'}</p>
//                                   </div>
//                                   <p className="font-bold text-blue-700">
//                                     {formatINR(parseFloat(r.balance_amount || r.returnable || 0))}
//                                   </p>
//                                 </div>
//                               ))
//                             )}
//                           </div>
//                         </div>
//                       </div>
//                     </>
//                   );
//                 })()}
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Bank;











import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Building2, IndianRupee, X, Edit3, Save, AlertCircle } from 'lucide-react';

const themeColors = {
  primary: '#1e7a6f',
  accent: '#c79100',
  lightBg: '#f8f9fa',
  textPrimary: '#212529',
  textSecondary: '#6c757d',
  border: '#dee2e6',
  lightBorder: '#e9ecef',
};

const Bank = () => {
  const [banks, setBanks] = useState([]);
  const [cfsData, setCfsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedBank, setSelectedBank] = useState(null);
  const [showLedger, setShowLedger] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingBank, setEditingBank] = useState(null);
  const [editForm, setEditForm] = useState({ bank_name: '', available_balance: '', remarks: '' });

  const userId = 1;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bankRes, cfsRes] = await Promise.all([
          axios.get('https://scpl.kggeniuslabs.com/api/finance/bank-masters'),
          axios.get('https://scpl.kggeniuslabs.com/api/finance/cfs-data')
        ]);
        if (bankRes.data.status === 'success') setBanks(bankRes.data.data);
        setCfsData(cfsRes.data);
      } catch (err) {
        alert('Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Improved Overall Summary with Total Paid
  const getOverallSummary = () => {
    if (!cfsData) return { totalAvailable: 0, totalPaid: 0, totalPayable: 0, totalReceivable: 0, net: 0 };

    let totalAvailable = 0;
    let totalPaid = 0;
    let totalPayable = 0;
    let totalReceivable = 0;

    banks.forEach(bank => {
      const bankSummary = getBankSummary(bank.id);
      totalAvailable += bankSummary.available;
      totalPaid += bankSummary.totalPaid || 0;
      totalPayable += bankSummary.totalPayable;
      totalReceivable += bankSummary.totalReceivable;
    });

    const net = totalAvailable + totalReceivable - totalPayable;

    return { totalAvailable, totalPaid, totalPayable, totalReceivable, net };
  };

  const getBankSummary = (bankId) => {
    if (!cfsData || !bankId) {
      return { available: 0, totalPaid: 0, totalPayable: 0, totalReceivable: 0, payables: [], receivables: [] };
    }

    const bank = banks.find(b => b.id === bankId);
    const available = parseFloat(bank?.available_balance || 0);

    // All payable-related data
    const allPayableItems = [
      ...(cfsData.creditors_payable_data || []),
      ...(cfsData.salary_payable_data || []),
      ...(cfsData.transport_payable_data || []),
      ...(cfsData.scaffolding_payable_data || []),
      ...(cfsData.site_accommodation_payable_data || []),
      ...(cfsData.commission_payable_data || []),
      ...(cfsData.gst_payable_data || []).filter(g => parseFloat(g.net_gst_payable || 0) > 0),
      ...(cfsData.tds_payable_data || []).filter(t => parseFloat(t.net_tds_due || 0) > 0),
      ...(cfsData.creditcard_payable_data || [])
    ].filter(item => item.finance_bank_id === bankId);

    // All receivable-related data
    const receivables = [
      ...(cfsData.billed_debtors_receivable_data || []),
      ...(cfsData.tds_returnable_receivable_data || [])
    ].filter(item => item.finance_bank_id === bankId);

    // Calculate Totals
    let totalPaid = 0;
    let totalPayable = 0;

    allPayableItems.forEach(item => {
      // Actual Paid Amount
      const paid = parseFloat(
        item.amount_paid || 
        item.paid_amount || 
        0
      );
      totalPaid += paid;

      // Outstanding Payable
      const payable = parseFloat(
        item.balance_amount || 
        item.amount_due || 
        item.net_gst_payable || 
        item.net_tds_due || 
        0
      );
      totalPayable += payable;
    });

    const totalReceivable = receivables.reduce((sum, item) => 
      sum + parseFloat(item.balance_amount || item.returnable || 0), 0
    );

    return {
      available,
      totalPaid,
      totalPayable,
      totalReceivable,
      payables: allPayableItems,
      receivables
    };
  };

  const overall = getOverallSummary();

  const openLedger = (bank) => { 
    setSelectedBank(bank); 
    setShowLedger(true); 
  };

  const openEditModal = (e, bank) => {
    e.stopPropagation();
    setEditingBank(bank);
    setEditForm({ 
      bank_name: bank.bank_name, 
      available_balance: bank.available_balance || '', 
      remarks: '' 
    });
    setShowEditModal(true);
  };

  const saveBankEdit = async () => {
    if (!editForm.bank_name.trim()) return alert('Bank name required');
    
    const oldBal = parseFloat(editingBank.available_balance || 0);
    const newBal = parseFloat(editForm.available_balance || 0);
    
    if (newBal !== oldBal && !editForm.remarks.trim()) {
      return alert('Remarks required when balance changes');
    }

    try {
      await axios.put('https://scpl.kggeniuslabs.com/api/finance/update-bank-master', {
        bank_name: editForm.bank_name.trim(),
        available_balance: newBal || null,
        remarks: editForm.remarks.trim() || null,
        updated_by: userId
      }, { params: { id: editingBank.id } });

      const res = await axios.get('https://scpl.kggeniuslabs.com/api/finance/bank-masters');
      setBanks(res.data.data);
      setShowEditModal(false);
    } catch (err) {
      alert(err.response?.data?.message || 'Update failed');
    }
  };

  const formatINR = (amt) => 
    '₹' + Number(amt || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 });

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8" style={{ backgroundColor: themeColors.lightBg }}>
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-6" style={{ borderColor: themeColors.border }}>
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg" style={{ backgroundColor: themeColors.primary }}>
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: themeColors.textPrimary }}>
                Cash Flow Summary (CFS)
              </h1>
              <p className="text-sm mt-1" style={{ color: themeColors.textSecondary }}>
                Real-time bank-wise liquidity & net position
              </p>
            </div>
          </div>
        </div>

        {/* Overall Summary Cards - Updated with Total Paid */}
   {/* Overall Summary Cards - With Total Paid + Centered Net Position */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
  
  {/* Total Available */}
  <div className="bg-white border rounded-xl p-6 shadow-sm" style={{ borderColor: themeColors.border }}>
    <p className="text-sm font-medium" style={{ color: themeColors.textSecondary }}>Total Available</p>
    <p className="text-2xl font-bold mt-2 text-green-700">{formatINR(overall.totalAvailable)}</p>
  </div>

  {/* Total Paid */}
  <div className="bg-white border rounded-xl p-6 shadow-sm" style={{ borderColor: themeColors.border }}>
    <p className="text-sm font-medium" style={{ color: themeColors.textSecondary }}>Total Paid</p>
    <p className="text-2xl font-bold mt-2 text-emerald-700">{formatINR(overall.totalPaid)}</p>
  </div>

  {/* Total Payable */}
  <div className="bg-white border rounded-xl p-6 shadow-sm" style={{ borderColor: themeColors.border }}>
    <p className="text-sm font-medium" style={{ color: themeColors.textSecondary }}>Total Payable</p>
    <p className="text-2xl font-bold mt-2 text-red-700">{formatINR(overall.totalPayable)}</p>
  </div>

  {/* Total Receivable */}
  <div className="bg-white border rounded-xl p-6 shadow-sm" style={{ borderColor: themeColors.border }}>
    <p className="text-sm font-medium" style={{ color: themeColors.textSecondary }}>Total Receivable</p>
    <p className="text-2xl font-bold mt-2 text-blue-700">{formatINR(overall.totalReceivable)}</p>
  </div>

  {/* Net Position - Centered & Highlighted */}
  <div className="bg-white border-2 rounded-2xl p-6 shadow-sm col-span-1 sm:col-span-2 lg:col-span-1 flex flex-col justify-center items-center text-center" 
       style={{ 
         borderColor: overall.net >= 0 ? '#16a34a' : '#dc2626',
         backgroundColor: overall.net >= 0 ? '#f0fdf4' : '#fef2f2'
       }}>
    <p className="text-sm font-medium" style={{ color: themeColors.textSecondary }}>NET POSITION</p>
    <p className={`text-4xl font-bold mt-3 ${overall.net >= 0 ? 'text-green-700' : 'text-red-700'}`}>
      {formatINR(Math.abs(overall.net))}
    </p>
    <p className={`text-base font-semibold mt-2 uppercase tracking-wider ${overall.net >= 0 ? 'text-green-600' : 'text-red-600'}`}>
      {overall.net >= 0 ? 'SURPLUS' : 'SHORTFALL'}
    </p>
  </div>

</div>

        {/* Banks Table - Rest remains same */}
        {loading ? (
          <div className="bg-white rounded-xl shadow-sm border p-16 text-center" style={{ borderColor: themeColors.border }}>
            <p style={{ color: themeColors.textSecondary }}>Loading banks...</p>
          </div>
        ) : banks.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border p-16 text-center" style={{ borderColor: themeColors.border }}>
            <p style={{ color: themeColors.textSecondary }}>No banks found</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden" style={{ borderColor: themeColors.border }}>
            <table className="w-full">
              <thead style={{ backgroundColor: themeColors.lightBg }}>
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase" style={{ color: themeColors.textSecondary }}>Bank Name</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase" style={{ color: themeColors.textSecondary }}>Available</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase text-emerald-600">Paid</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase text-red-600">Payable</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase text-blue-600">Receivable</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase" style={{ color: themeColors.textSecondary }}>Net Position</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: themeColors.lightBorder }}>
                {banks.map(bank => {
                  const { available, totalPaid, totalPayable, totalReceivable } = getBankSummary(bank.id);
                  const net = available + totalReceivable - totalPayable;

                  return (
                    <tr key={bank.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => openLedger(bank)}>
                      <td className="px-6 py-4">
                        <button
                          onClick={(e) => openEditModal(e, bank)}
                          className="flex items-center gap-2 font-medium text-teal-700 hover:underline"
                        >
                          <Edit3 size={16} />
                          {bank.bank_name}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-right font-medium text-green-700">{formatINR(available)}</td>
                      <td className="px-6 py-4 text-right font-medium text-emerald-700">{formatINR(totalPaid)}</td>
                      <td className="px-6 py-4 text-right font-medium text-red-700">{formatINR(totalPayable)}</td>
                      <td className="px-6 py-4 text-right font-medium text-blue-700">{formatINR(totalReceivable)}</td>
                      <td className="px-6 py-4 text-right">
                        <div className={`font-bold text-lg ${net >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                          {formatINR(Math.abs(net))}
                        </div>
                        <p className="text-xs" style={{ color: themeColors.textSecondary }}>
                          {net >= 0 ? 'Surplus' : 'Shortfall'}
                        </p>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Edit Bank Modal - Unchanged */}
        {showEditModal && editingBank && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-6 border-b pb-4" style={{ borderColor: themeColors.border }}>
                <h3 className="text-xl font-bold" style={{ color: themeColors.textPrimary }}>
                  Edit Bank Details
                </h3>
                <button onClick={() => setShowEditModal(false)} className="text-gray-500 hover:text-gray-700">
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: themeColors.textSecondary }}>
                    Bank Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={editForm.bank_name}
                    onChange={(e) => setEditForm(prev => ({ ...prev, bank_name: e.target.value }))}
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    style={{ borderColor: themeColors.border }}
                    placeholder="e.g., HDFC Bank"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: themeColors.textSecondary }}>
                    Available Balance
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={editForm.available_balance}
                    onChange={(e) => setEditForm(prev => ({ ...prev, available_balance: e.target.value }))}
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    style={{ borderColor: themeColors.border }}
                    placeholder="0.00"
                  />
                </div>

                {(editForm.bank_name.trim() !== editingBank.bank_name.trim() ||
                  (editForm.available_balance !== '' && 
                   parseFloat(editForm.available_balance || 0) !== parseFloat(editingBank.available_balance || 0))
                ) && (
                  <div>
                    <label className="block text-sm font-medium text-red-600 mb-2 flex items-center gap-2">
                      <AlertCircle size={18} />
                      Remarks <span className="text-red-500">*</span> (Required for any change)
                    </label>
                    <textarea
                      value={editForm.remarks}
                      onChange={(e) => setEditForm(prev => ({ ...prev, remarks: e.target.value }))}
                      className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                      style={{ borderColor: '#fca5a5' }}
                      rows={4}
                      placeholder="Please explain the reason for changing bank name or balance..."
                    />
                  </div>
                )}

                <div className="flex gap-4 pt-6 border-t" style={{ borderColor: themeColors.border }}>
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="flex-1 px-6 py-3 border rounded-lg font-medium hover:bg-gray-50 transition"
                    style={{ borderColor: themeColors.border }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveBankEdit}
                    disabled={
                      (editForm.bank_name.trim() !== editingBank.bank_name.trim() ||
                       (editForm.available_balance !== '' && 
                        parseFloat(editForm.available_balance || 0) !== parseFloat(editingBank.available_balance || 0))
                      ) && !editForm.remarks.trim()
                    }
                    className="flex-1 px-6 py-3 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ 
                      backgroundColor: themeColors.primary 
                    }}
                  >
                    <Save size={18} />
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Ledger Modal - You can also update it similarly if needed, but kept minimal change for now */}
        {showLedger && selectedBank && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
              <div className="p-6 flex justify-between items-center border-b" style={{ backgroundColor: themeColors.primary, borderColor: themeColors.border }}>
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  <Building2 className="w-8 h-8" />
                  {selectedBank.bank_name} - Detailed Ledger
                </h2>
                <button onClick={() => setShowLedger(false)} className="text-white hover:bg-white/20 rounded-full p-2 transition">
                  <X className="w-7 h-7" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                {(() => {
                  const summary = getBankSummary(selectedBank.id);
                  const net = summary.available + summary.totalReceivable - summary.totalPayable;

                  return (
                    <>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <div className="bg-green-50 border border-green-300 rounded-lg p-5 text-center">
                          <p className="text-sm text-green-700 font-medium">Available Balance</p>
                          <p className="text-xl font-bold text-green-800 mt-1">{formatINR(summary.available)}</p>
                        </div>
                        <div className="bg-emerald-50 border border-emerald-300 rounded-lg p-5 text-center">
                          <p className="text-sm text-emerald-700 font-medium">Total Paid</p>
                          <p className="text-xl font-bold text-emerald-800 mt-1">{formatINR(summary.totalPaid)}</p>
                        </div>
                        <div className="bg-red-50 border border-red-300 rounded-lg p-5 text-center">
                          <p className="text-sm text-red-700 font-medium">Total Payable</p>
                          <p className="text-xl font-bold text-red-800 mt-1">{formatINR(summary.totalPayable)}</p>
                        </div>
                        <div className="bg-blue-50 border border-blue-300 rounded-lg p-5 text-center">
                          <p className="text-sm text-blue-700 font-medium">Total Receivable</p>
                          <p className="text-xl font-bold text-blue-800 mt-1">{formatINR(summary.totalReceivable)}</p>
                        </div>
                      </div>

                      {/* Rest of ledger content remains same */}
                      <div className="grid md:grid-cols-2 gap-8">
                        <div>
                          <h3 className="text-lg font-bold text-red-700 mb-4">Pending Payments</h3>
                          <div className="space-y-3">
                            {summary.payables.length === 0 ? (
                              <p className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">No pending payments</p>
                            ) : (
                              summary.payables.map((p, i) => (
                                <div key={i} className="bg-red-50 border border-red-200 rounded-lg p-4 flex justify-between">
                                  <div>
                                    <p className="font-medium text-gray-800">{p.client_name || p.employee_name || p.project_name || '—'}</p>
                                    <p className="text-xs text-gray-600">{p.inv_number || p.description || p.month || '—'}</p>
                                  </div>
                                  <p className="font-bold text-red-700">
                                    {formatINR(parseFloat(p.balance_amount || p.net_gst_payable || p.net_tds_due || 0))}
                                  </p>
                                </div>
                              ))
                            )}
                          </div>
                        </div>

                        <div>
                          <h3 className="text-lg font-bold text-blue-700 mb-4">Expected Receipts</h3>
                          <div className="space-y-3">
                            {summary.receivables.length === 0 ? (
                              <p className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">No expected receipts</p>
                            ) : (
                              summary.receivables.map((r, i) => (
                                <div key={i} className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex justify-between">
                                  <div>
                                    <p className="font-medium text-gray-800">{r.party_name || r.project_name || 'TDS Refund'}</p>
                                    <p className="text-xs text-gray-600">{r.inv_no || r.month || '—'}</p>
                                  </div>
                                  <p className="font-bold text-blue-700">
                                    {formatINR(parseFloat(r.balance_amount || r.returnable || 0))}
                                  </p>
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Bank;