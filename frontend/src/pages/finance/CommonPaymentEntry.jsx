// import React, { useState, useEffect } from 'react';
// import Select from 'react-select';
// import axios from 'axios';
// import {
//   Calendar, FileText, DollarSign, Hash, Package, Percent, Clock,
//   MessageSquare, Building2, Plus, Banknote, ArrowDownCircle,
//   X, Edit2, Trash2, ChevronDown, ChevronUp,
//   Users, Truck, Wrench, Home, ScrollText, Calculator, CreditCard
// } from 'lucide-react';

// const themeColors = {
//   primary: '#1e7a6f',
//   accent: '#c79100',
//   lightBg: '#f8f9fa',
//   textPrimary: '#212529',
//   textSecondary: '#6c757d',
//   border: '#dee2e6',
//   lightBorder: '#e9ecef',
// };

// const inputStyle = {
//   base: 'w-full px-4 py-3 rounded-lg border bg-white text-sm transition-all duration-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-1',
//   normal: 'border-gray-300 focus:border-transparent',
//   focusRing: 'focus:ring-teal-500',
// };

// const labelStyle = 'block text-sm font-semibold mb-2';

// const paymentOptions = [
//   { value: 'creditors', label: 'Creditors', icon: Building2 },
//   { value: 'siteincharge-attendance', label: 'SiteIncharge Attendance', icon: Users },
//   { value: 'salary-payables', label: 'Salary Payables', icon: DollarSign },
//   { value: 'transport', label: 'Transport', icon: Truck },
//   { value: 'scaffolding', label: 'Scaffolding', icon: Wrench },
//   { value: 'site-accommodation', label: 'Site Accommodation', icon: Home },
//   { value: 'commission', label: 'Commission', icon: Percent },
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
//   const [expandedId, setExpandedId] = useState(null);

//   useEffect(() => {
//     const path = window.location.pathname;
//     const match = path.match(/\/payments\/([^/]+)$/);
//     if (match && match[1]) {
//       try {
//         setCreatedBy(atob(match[1]));
//       } catch (err) {
//         setCreatedBy('1');
//       }
//     }
//   }, []);

//   useEffect(() => {
//     if (selectedPayment?.value === 'creditors') {
//       loadCreditors();
//     }
//   }, [selectedPayment]);

//   const loadCreditors = async () => {
//     setLoading(true);
//     try {
//       const res = await axios.get('https://scpl.kggeniuslabs.com/api/finance/view-creditors');
//       const sorted = res.data.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
//       setCreditors(sorted);
//     } catch (err) {
//       console.error('Error loading creditors:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm('Are you sure you want to delete this creditor?')) return;
//     try {
//       await axios.delete(`https://scpl.kggeniuslabs.com/api/finance/delete-creditors/${id}`);
//       loadCreditors();
//       alert('Deleted successfully');
//     } catch (err) {
//       alert('Error deleting');
//     }
//   };

//   const toggleExpand = (id) => {
//     setExpandedId(expandedId === id ? null : id);
//   };

//   const formatDate = (d) => (d ? new Date(d).toLocaleDateString('en-IN') : 'N/A');

//   const customStyles = {
//     control: (p) => ({ ...p, borderRadius: '0.75rem', padding: '0.75rem', borderColor: themeColors.border }),
//     option: (p, s) => ({
//       ...p,
//       backgroundColor: s.isSelected ? themeColors.primary : s.isFocused ? '#ecfdf5' : 'white',
//       color: s.isSelected ? 'white' : themeColors.textPrimary,
//     }),
//   };

//   // Creditors Form Modal
//   const CreditorsForm = () => {
//     const [clients, setClients] = useState([]);
//     const [banks, setBanks] = useState([]);
//     const [clientInputValue, setClientInputValue] = useState('');
//     const [bankInputValue, setBankInputValue] = useState('');
//     const [showAddClient, setShowAddClient] = useState(false);
//     const [showAddBank, setShowAddBank] = useState(false);
//     const [creditorType, setCreditorType] = useState('gst');
//     const [loadingForm, setLoadingForm] = useState(false);

//     const [formData, setFormData] = useState({
//       client_id: '', finance_bank_id: '', po_date: '', po_sent_through: '', inv_number: '',
//       bill_date: '', pdc_date: '', item_code: '', qty: '', rate: '', sale_amount: '',
//       gst_amount: '', total_payment_due: '', amount_paid: '', balance_amount: '',
//       date_of_payment: '', due_date: '', remarks: '', is_gst: 1
//     });

//     useEffect(() => {
//       loadClients(); loadBanks();
//     }, []);

//     const loadClients = async () => {
//       try {
//         const res = await axios.get('https://scpl.kggeniuslabs.com/api/finance/view-creditors-client');
//         setClients(res.data.data.map(c => ({ value: c.id, label: c.client_name })));
//       } catch (err) { console.error(err); }
//     };

//     const loadBanks = async () => {
//       try {
//         const res = await axios.get('https://scpl.kggeniuslabs.com/api/finance/bank-masters');
//         if (res.data.status === 'success') {
//           setBanks(res.data.data.map(b => ({
//             value: b.id,
//             label: `${b.bank_name} (₹${parseFloat(b.available_balance || 0).toLocaleString('en-IN')})`
//           })));
//         }
//       } catch (err) { console.error(err); }
//     };

//     const handleSubmit = async (e) => {
//       e.preventDefault();
//       if (!formData.client_id) return alert('Client is required');
//       setLoadingForm(true);
//       try {
//         await axios.post('https://scpl.kggeniuslabs.com/api/finance/create-creditors', {
//           ...formData,
//           created_by: createdBy || '1'
//         });
//         alert('Creditor created successfully!');
//         setIsModalOpen(false);
//         loadCreditors();
//         setFormData(prev => ({ ...prev, client_id: '', inv_number: '', amount_paid: '', remarks: '' }));
//       } catch (err) {
//         alert(err.response?.data?.message || 'Error saving');
//       } finally {
//         setLoadingForm(false);
//       }
//     };

//     const clientOptions = [...clients, ...(showAddClient ? [{ value: 'add', label: `Add "${clientInputValue}"` }] : [])];
//     const bankOptions = [...banks, ...(showAddBank ? [{ value: 'add-bank', label: `Add Bank "${bankInputValue}"` }] : [])];

//     return (
//       <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-h-[75vh] overflow-y-auto px-2">
//         {/* Full form - same as your original */}
//         <div className="lg:col-span-4">
//           <label className={labelStyle}><Building2 size={16} className="inline mr-2" />Client Name *</label>
//           <Select options={clientOptions} onInputChange={(v) => { setClientInputValue(v); setShowAddClient(!!v && !clients.some(c => c.label.toLowerCase().includes(v.toLowerCase()))); }}
//             onChange={async (opt) => {
//               if (opt?.value === 'add') {
//                 const name = clientInputValue.trim();
//                 if (!name) return;
//                 try {
//                   const res = await axios.post('https://scpl.kggeniuslabs.com/api/finance/create-creditors-client', { client_name: name, created_by: createdBy || 1 });
//                   const newClient = { value: res.data.data.id, label: name };
//                   setClients(prev => [...prev, newClient]);
//                   setFormData(prev => ({ ...prev, client_id: newClient.value }));
//                 } catch (err) { alert('Failed to add client'); }
//               } else {
//                 setFormData(prev => ({ ...prev, client_id: opt?.value || '' }));
//               }
//             }} placeholder="Search or add client..." isSearchable styles={customStyles} />
//         </div>

//         <div className="lg:col-span-4">
//           <label className={labelStyle}><Banknote size={16} className="inline mr-2" />Bank Account</label>
//           <Select options={bankOptions} onInputChange={(v) => { setBankInputValue(v); setShowAddBank(!!v && !banks.some(b => b.label.toLowerCase().includes(v.toLowerCase()))); }}
//             onChange={async (opt) => {
//               if (opt?.value === 'add-bank') {
//                 const name = bankInputValue.trim();
//                 if (!name) return;
//                 try {
//                   const res = await axios.post('https://scpl.kggeniuslabs.com/api/finance/create-bank-master', { bank_name: name, available_balance: 0, created_by: createdBy || 1 });
//                   const newBank = { value: res.data.data.id, label: `${name} (₹0.00)` };
//                   setBanks(prev => [...prev, newBank]);
//                   setFormData(prev => ({ ...prev, finance_bank_id: newBank.value }));
//                 } catch (err) { alert('Failed to add bank'); }
//               } else {
//                 setFormData(prev => ({ ...prev, finance_bank_id: opt?.value || '' }));
//               }
//             }} isClearable placeholder="Select bank..." styles={customStyles} />
//         </div>

//         <div className="lg:col-span-4">
//           <div className="flex gap-8">
//             {[{ value: 'gst', label: 'GST Creditors', icon: Percent }, { value: 'other', label: 'Other Creditors', icon: FileText }].map(item => (
//               <label key={item.value} className="flex items-center cursor-pointer">
//                 <input type="radio" name="type" value={item.value} checked={creditorType === item.value}
//                   onChange={(e) => { setCreditorType(e.target.value); setFormData(prev => ({ ...prev, is_gst: e.target.value === 'gst' ? 1 : 0 })); }}
//                   className="w-5 h-5 text-teal-600" style={{ accentColor: themeColors.primary }} />
//                 <span className="ml-3 flex items-center gap-2 font-medium"><item.icon size={18} />{item.label}</span>
//               </label>
//             ))}
//           </div>
//         </div>

//         {/* All Fields */}
//         <div><label><Calendar size={16} className="inline mr-2" />PDC Date</label><input type="date" name="pdc_date" value={formData.pdc_date} onChange={(e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))} className={`${inputStyle.base} ${inputStyle.normal}`} /></div>
//         <div><label><Package size={16} className="inline mr-2" />Item Code</label><input type="text" name="item_code" value={formData.item_code} onChange={(e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))} className={`${inputStyle.base} ${inputStyle.normal}`} /></div>
//         <div><label><Hash size={16} className="inline mr-2" />Quantity</label><input type="number" name="qty" value={formData.qty} onChange={(e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))} className={`${inputStyle.base} ${inputStyle.normal}`} /></div>
//         <div><label><DollarSign size={16} className="inline mr-2" />Rate</label><input type="number" step="0.01" name="rate" value={formData.rate} onChange={(e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))} className={`${inputStyle.base} ${inputStyle.normal}`} /></div>
//         <div><label><DollarSign size={16} className="inline mr-2" />Sale Amount</label><input type="number" step="0.01" name="sale_amount" value={formData.sale_amount} onChange={(e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))} className={`${inputStyle.base} ${inputStyle.normal}`} /></div>
//         <div><label><Percent size={16} className="inline mr-2" />GST Amount</label><input type="number" step="0.01" name="gst_amount" value={formData.gst_amount} onChange={(e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))} className={`${inputStyle.base} ${inputStyle.normal}`} /></div>
//         <div><label><DollarSign size={16} className="inline mr-2" />Total Payment Due</label><input type="number" step="0.01" name="total_payment_due" value={formData.total_payment_due} onChange={(e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))} className={`${inputStyle.base} ${inputStyle.normal}`} /></div>
//         <div><label><Calendar size={16} className="inline mr-2" />Date of Payment</label><input type="date" name="date_of_payment" value={formData.date_of_payment} onChange={(e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))} className={`${inputStyle.base} ${inputStyle.normal}`} /></div>
//         <div><label><DollarSign size={16} className="inline mr-2" />Amount Paid</label><input type="number" step="0.01" name="amount_paid" value={formData.amount_paid} onChange={(e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))} className={`${inputStyle.base} ${inputStyle.normal}`} /></div>
//         <div><label><DollarSign size={16} className="inline mr-2" />Balance Amount</label><input type="number" step="0.01" name="balance_amount" value={formData.balance_amount} onChange={(e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))} className={`${inputStyle.base} ${inputStyle.normal}`} /></div>

//         {creditorType === 'gst' && (
//           <>
//             <div><label><Calendar size={16} className="inline mr-2" />PO Date</label><input type="date" name="po_date" value={formData.po_date} onChange={(e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))} className={`${inputStyle.base} ${inputStyle.normal}`} /></div>
//             <div><label><FileText size={16} className="inline mr-2" />PO Sent Through</label><input type="text" name="po_sent_through" value={formData.po_sent_through} onChange={(e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))} className={`${inputStyle.base} ${inputStyle.normal}`} /></div>
//             <div><label><FileText size={16} className="inline mr-2" />Invoice Number</label><input type="text" name="inv_number" value={formData.inv_number} onChange={(e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))} className={`${inputStyle.base} ${inputStyle.normal}`} /></div>
//             <div><label><Calendar size={16} className="inline mr-2" />Bill Date</label><input type="date" name="bill_date" value={formData.bill_date} onChange={(e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))} className={`${inputStyle.base} ${inputStyle.normal}`} /></div>
//             <div className="lg:col-span-2"><label><Clock size={16} className="inline mr-2" />Due Date</label><input type="date" name="due_date" value={formData.due_date} onChange={(e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))} className={`${inputStyle.base} ${inputStyle.normal}`} /></div>
//             <div className="lg:col-span-4"><label><MessageSquare size={16} className="inline mr-2" />Remarks</label><textarea name="remarks" value={formData.remarks} onChange={(e) => setFormData(prev => ({ ...prev, remarks: e.target.value }))} rows={4} className={`${inputStyle.base} ${inputStyle.normal} resize-none`} /></div>
//           </>
//         )}

//         <div className="lg:col-span-4 flex gap-4 mt-8">
//           <button type="submit" disabled={loadingForm} className="flex-1 py-4 bg-teal-600 text-white font-bold rounded-lg hover:bg-teal-700 transition flex items-center justify-center gap-3">
//             {loadingForm ? 'Saving...' : <>Create Creditor</>}
//           </button>
//           <button type="button" onClick={() => setIsModalOpen(false)} className="px-8 py-4 bg-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-400 transition">
//             Cancel
//           </button>
//         </div>
//       </form>
//     );
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 py-8 px-4">
//       <div className="max-w-7xl mx-auto">
//         {/* Header + Controls */}
//         <div className="bg-white rounded-xl shadow-sm border p-8 mb-8">
//           <div className="flex items-center gap-4 mb-8">
//             <div className="p-4 rounded-xl" style={{ backgroundColor: themeColors.primary }}>
//               <ArrowDownCircle className="w-10 h-10 text-white" />
//             </div>
//             <div>
//               <h1 className="text-3xl font-bold" style={{ color: themeColors.textPrimary }}>Common Payment Entry</h1>
//               <p className="text-gray-600">Manage all payment records in one place</p>
//             </div>
//           </div>

//           <div className="flex items-end gap-6">
//             <div className="flex-1 max-w-lg">
//               <label className="block text-lg font-semibold mb-3">Payment For</label>
//               <Select
//                 options={paymentOptions}
//                 value={selectedPayment}
//                 onChange={setSelectedPayment}
//                 placeholder="Select category..."
//                 isSearchable
//                 formatOptionLabel={(opt) => (
//                   <div className="flex items-center gap-3">
//                     <opt.icon size={20} />
//                     <span>{opt.label}</span>
//                   </div>
//                 )}
//                 styles={customStyles}
//               />
//             </div>

//             <button
//               onClick={() => setIsModalOpen(true)}
//               disabled={!selectedPayment || selectedPayment.value !== 'creditors'}
//               className={`px-10 py-4 rounded-lg font-bold text-white flex items-center gap-3 transition-all ${
//                 !selectedPayment || selectedPayment.value !== 'creditors'
//                   ? 'bg-gray-400 cursor-not-allowed'
//                   : 'bg-teal-600 hover:bg-teal-700'
//               }`}
//             >
//               <Plus size={22} /> Add Record
//             </button>
//           </div>
//         </div>

//         {/* Creditors Table - Full View */}
//         {selectedPayment?.value === 'creditors' && (
//           <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
//             <div className="p-6 border-b flex items-center gap-4" style={{ backgroundColor: themeColors.lightBg, borderColor: themeColors.lightBorder }}>
//               <DollarSign className="w-8 h-8 text-teal-600" />
//               <h2 className="text-2xl font-bold" style={{ color: themeColors.textPrimary }}>All Creditors</h2>
//               <span className="ml-auto text-sm font-medium" style={{ color: themeColors.textSecondary }}>
//                 Total: {creditors.length} entries
//               </span>
//             </div>

//             {loading ? (
//               <div className="p-20 text-center">Loading creditors...</div>
//             ) : creditors.length === 0 ? (
//               <div className="p-20 text-center text-gray-500">
//                 <FileText size={64} className="mx-auto mb-4 opacity-30" />
//                 <p className="text-xl">No creditor entries found</p>
//               </div>
//             ) : (
//               <div className="overflow-x-auto">
//                 <table className="w-full">
//                   <thead className="bg-gray-50 border-b">
//                     <tr>
//                       <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">ID</th>
//                       <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Client</th>
//                       <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Type</th>
//                       <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Invoice</th>
//                       <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider">Total Due</th>
//                       <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider">Paid</th>
//                       <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider">Balance</th>
//                       <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Due Date</th>
//                       <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider">Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y">
//                     {creditors.map(c => (
//                       <React.Fragment key={c.id}>
//                         <tr className="hover:bg-gray-50 cursor-pointer transition" onClick={() => toggleExpand(c.id)}>
//                           <td className="px-6 py-4 text-sm font-medium text-teal-600">{c.id}</td>
//                           <td className="px-6 py-4 text-sm font-medium">{c.client_name}</td>
//                           <td className="px-6 py-4">
//                             <span className={`px-3 py-1 rounded-full text-xs font-bold ${c.is_gst === 1 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
//                               {c.is_gst === 1 ? 'GST' : 'Other'}
//                             </span>
//                           </td>
//                           <td className="px-6 py-4 text-sm">{c.inv_number || 'N/A'}</td>
//                           <td className="px-6 py-4 text-sm text-right font-medium">₹{parseFloat(c.total_payment_due || 0).toLocaleString('en-IN')}</td>
//                           <td className="px-6 py-4 text-sm text-right">₹{parseFloat(c.amount_paid || 0).toLocaleString('en-IN')}</td>
//                           <td className={`px-6 py-4 text-sm font-bold text-right ${parseFloat(c.balance_amount || 0) > 0 ? 'text-red-600' : 'text-green-600'}`}>
//                             ₹{parseFloat(c.balance_amount || 0).toLocaleString('en-IN')}
//                           </td>
//                           <td className="px-6 py-4 text-sm">{formatDate(c.due_date)}</td>
//                           <td className="px-6 py-4 text-center">
//                             <button className="p-2 hover:bg-gray-200 rounded-lg transition">
//                               {expandedId === c.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
//                             </button>
//                           </td>
//                         </tr>

//                         {expandedId === c.id && (
//                           <tr>
//                             <td colSpan={9} className="p-6 bg-gray-50 border-t">
//                               <div className="flex justify-between items-start mb-4">
//                                 <h4 className="font-semibold text-lg flex items-center gap-2"><FileText size={18} /> Detailed Information</h4>
//                                 <div className="flex gap-3">
//                                   <button className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 flex items-center gap-2 text-sm font-medium">
//                                     <Edit2 size={16} /> Edit
//                                   </button>
//                                   <button onClick={(e) => { e.stopPropagation(); handleDelete(c.id); }} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2 text-sm font-medium">
//                                     <Trash2 size={16} /> Delete
//                                   </button>
//                                 </div>
//                               </div>
//                               <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 text-sm">
//                                 {[
//                                   { label: 'PO Date', value: formatDate(c.po_date) },
//                                   { label: 'Bill Date', value: formatDate(c.bill_date) },
//                                   { label: 'PDC Date', value: formatDate(c.pdc_date) },
//                                   { label: 'Item Code', value: c.item_code || 'N/A' },
//                                   { label: 'Quantity', value: c.qty || 'N/A' },
//                                   { label: 'Rate', value: `₹${c.rate || 0}` },
//                                   { label: 'Sale Amount', value: `₹${parseFloat(c.sale_amount || 0).toLocaleString('en-IN')}` },
//                                   { label: 'GST Amount', value: `₹${parseFloat(c.gst_amount || 0).toLocaleString('en-IN')}` },
//                                   { label: 'Date of Payment', value: formatDate(c.date_of_payment) },
//                                   { label: 'Due Date', value: formatDate(c.due_date) },
//                                   { label: 'Remarks', value: c.remarks || 'None' },
//                                   { label: 'Created At', value: new Date(c.created_at).toLocaleString('en-IN') },
//                                 ].map((item, i) => (
//                                   <div key={i} className="bg-white p-4 rounded-lg border shadow-sm">
//                                     <div className="text-xs font-medium text-gray-500">{item.label}</div>
//                                     <div className="font-medium mt-1">{item.value}</div>
//                                   </div>
//                                 ))}
//                               </div>
//                             </td>
//                           </tr>
//                         )}
//                       </React.Fragment>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             )}
//           </div>
//         )}

//         {/* Modal */}
//         {isModalOpen && selectedPayment?.value === 'creditors' && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
//             <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
//               <div className="p-6 border-b flex items-center justify-between bg-gray-50">
//                 <h2 className="text-2xl font-bold flex items-center gap-3">
//                   <Building2 className="text-teal-600" />
//                   Create New Creditor Entry
//                 </h2>
//                 <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-200 rounded-lg transition">
//                   <X size={28} />
//                 </button>
//               </div>
//               <div className="p-8">
//                 <CreditorsForm />
//               </div>
//             </div>
//           </div>
//         )}

//         {!selectedPayment && (
//           <div className="text-center py-32 text-gray-500">
//             <ArrowDownCircle size={80} className="mx-auto mb-6 opacity-20" />
//             <p className="text-2xl font-medium">Select a payment category to begin</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default CommonPaymentEntry;




// pages/finance/CommonPaymentEntry.jsx
import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import axios from 'axios';
import {
  ArrowDownCircle, Plus, Users, Truck, Wrench, Home, ScrollText, Calculator, CreditCard, FileText, Building2, DollarSign, Percent, X, Coins
} from 'lucide-react';

// All modals (for "Add Record")
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

// Static Views (displayed below)
import ViewCreditors from '../../components/FinanceComponents/CommonPaymentEntry/ViewCreditors';
import ViewBilledDebtors from '../../components/FinanceComponents/CommonPaymentEntry/ViewBilledDebtors'; // ← Static view

// === IMPORT THE NEW VIEW COMPONENT HERE ===
import ViewPaymentEntry from '../../components/FinanceComponents/CommonPaymentEntry/ViewPaymentEntry';
// ===========================================

const themeColors = { primary: '#1e7a6f' };

const customStyles = {
  control: (p) => ({ 
    ...p, 
    borderRadius: '0.75rem', 
    padding: '0.75rem', 
    borderColor: '#dee2e6',
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  }),
  option: (p, s) => ({
    ...p,
    backgroundColor: s.isSelected ? themeColors.primary : s.isFocused ? '#ecfdf5' : 'white',
    color: s.isSelected ? 'white' : '#212529',
    transition: 'background-color 0.15s ease-in-out',
  }),
};

const paymentOptions = [
  { value: 'creditors', label: 'Creditors', icon: Building2 },
  { value: 'siteincharge-attendance', label: 'SiteIncharge Attendance', icon: Users },
  { value: 'salary-payables', label: 'Salary Payables', icon: DollarSign },
  { value: 'transport', label: 'Transport', icon: Truck },
  { value: 'scaffolding', label: 'Scaffolding', icon: Wrench },
  { value: 'site-accommodation', label: 'Site Accommodation', icon: Home },
  { value: 'commission', label: 'Commission', icon: Coins },
  { value: 'gst', label: 'GST', icon: Calculator },
  { value: 'tds', label: 'TDS', icon: ScrollText },
  { value: 'credit-card', label: 'Credit Card', icon: CreditCard },
  { value: 'billed-debtors', label: 'Billed Debtors', icon: FileText },
];

const CommonPaymentEntry = () => {
  const [selectedPayment, setSelectedPayment] = useState(null); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [createdBy, setCreatedBy] = useState('');
  const [creditors, setCreditors] = useState([]);
  const [loading, setLoading] = useState(false);

  // Extract real user ID from URL: /payments/NA==
  useEffect(() => {
    const match = window.location.pathname.match(/\/payments\/([^/]+)$/);
    if (match?.[1]) {
      try {
        setCreatedBy(atob(match[1]));
      } catch {
        setCreatedBy('1'); // Default fallback ID
      }
    }
  }, []);

  // Load creditors when selected
  useEffect(() => {
    if (selectedPayment?.value === 'creditors') {
      loadCreditors();
    }
  }, [selectedPayment]);

  const loadCreditors = async () => {
    setLoading(true);
    try {
      const res = await axios.get('https://scpl.kggeniuslabs.com/api/finance/view-creditors');
      setCreditors(res.data.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Determine which *detailed* view component to render 
  const renderDetailView = () => {
    switch (selectedPayment?.value) {
      case 'creditors':
        return (
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">Creditors List</h2>
            <ViewCreditors
              creditors={creditors}
              loading={loading}
              onRefresh={loadCreditors}
            />
          </div>
        );
      case 'billed-debtors':
        return (
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">Billed Debtors List</h2>
            <ViewBilledDebtors createdBy={createdBy} />
          </div>
        );
      default:
        return null;
    }
  };
  
  // Determine which modal component to render
  const renderModal = () => {
    if (!isModalOpen || !selectedPayment) return null;

    const commonProps = { createdBy, onClose: () => setIsModalOpen(false) };
    const onSuccessProps = selectedPayment.value === 'creditors' ? { onSuccess: () => { setIsModalOpen(false); loadCreditors(); } } : commonProps;

    switch (selectedPayment.value) {
        case 'creditors': return <CreateCreditors {...onSuccessProps} onCancel={() => setIsModalOpen(false)} />;
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


  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">

        {/* 1. Header + Category Selector (Always at Top) */}
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
              <label className="block text-lg font-semibold mb-3 text-gray-700">Payment For / Filter View</label>
              <Select
                options={paymentOptions}
                value={selectedPayment}
                onChange={setSelectedPayment}
                placeholder="Select category to filter view..."
                isSearchable
                isClearable
                formatOptionLabel={(opt) => (
                  <div className="flex items-center gap-3">
                    <opt.icon size={20} className={'text-teal-600'} />
                    <span>{opt.label}</span>
                  </div>
                )}
                styles={customStyles}
              />
            </div>

            {/* Enable Add Record button only when a specific category is selected */}
            <button
                onClick={() => setIsModalOpen(true)}
                disabled={!selectedPayment}
                className={`w-full md:w-auto px-10 py-4 rounded-lg font-bold text-white flex justify-center items-center gap-3 transition-all transform shadow-md ${
                    !selectedPayment ? 'bg-gray-400 cursor-not-allowed' : 'bg-teal-600 hover:bg-teal-700 hover:scale-[1.01] active:scale-[0.99]'
                }`}
            >
            <Plus size={22} /> Add Record
            </button>
          </div>
        </div>

        {/* 2. RENDER THE SPECIFIC DETAIL VIEW (if selected) */}
        {renderDetailView()}

        {/* 3. Add Record Modals */}
        {renderModal()}
        
        {/* --- 4. MAIN OVERVIEW COMPONENT DISPLAYED AT THE VERY BOTTOM --- */}
        <div className="mt-12"> 
            <ViewPaymentEntry />
        </div>
        
      </div>
    </div>
  );
};

export default CommonPaymentEntry;  