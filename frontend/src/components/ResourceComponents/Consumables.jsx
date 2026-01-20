// import React, { useState } from 'react';

// const initialConsumables = [
//   // Safety Gear
//   { id: 1, name: 'Safety Goggles', usageType: 'one-time', quantity: '12 nos', currentSite: 'Perundurai Site', history: [{ date: '2025-12-20', site: 'Head Office', details: 'Dispatched from HO' }], futureSite: null },
//   { id: 2, name: 'Safety Helmet', usageType: 'one-time', quantity: '8 nos', currentSite: 'Head Office', history: [], futureSite: null },
//   { id: 3, name: 'Nitrile Hand Gloves', usageType: 'one-time', quantity: '50 pairs', currentSite: 'Erode Site', history: [{ date: '2025-12-22', site: 'Perundurai Site' }], futureSite: 'Bhavani Site' },
//   { id: 4, name: 'Cotton Hand Gloves', usageType: 'reusable', quantity: '30 pairs', currentSite: 'Bhavani Site', history: [], futureSite: null },
//   { id: 5, name: 'Safety Shoes', usageType: 'reusable', quantity: '6 pairs', currentSite: 'Perundurai Site', history: [{ date: '2025-12-19', site: 'Head Office' }], futureSite: null },
  
//   // Painting Tools
//   { id: 6, name: '4 inch Paint Roller', usageType: 'one-time', quantity: '25 nos', currentSite: 'Erode Site', history: [{ date: '2025-12-21', site: 'Head Office' }], futureSite: null },
//   { id: 7, name: '2 inch Paint Brush', usageType: 'reusable', quantity: '40 nos', currentSite: 'Perundurai Site', history: [], futureSite: 'Bhavani Site' },
//   { id: 8, name: 'Roller Handle Set', usageType: 'reusable', quantity: '12 sets', currentSite: 'Bhavani Site', history: [{ date: '2025-12-23', site: 'Erode Site' }], futureSite: null },
//   { id: 9, name: 'Paint Tray', usageType: 'one-time', quantity: '8 nos', currentSite: 'Head Office', history: [], futureSite: null },
//   { id: 10, name: 'Paint Scraper', usageType: 'reusable', quantity: '15 nos', currentSite: 'Erode Site', history: [], futureSite: 'Perundurai Site' },
  
//   // Consumables & Materials
//   { id: 11, name: 'Emery Paper (120 grit)', usageType: 'one-time', quantity: '10 sheets', currentSite: 'Perundurai Site', history: [{ date: '2025-12-18', site: 'Head Office' }], futureSite: null },
//   { id: 12, name: 'Emery Paper (220 grit)', usageType: 'one-time', quantity: '8 sheets', currentSite: 'Bhavani Site', history: [], futureSite: null },
//   { id: 13, name: 'Masking Tape (2")', usageType: 'one-time', quantity: '20 rolls', currentSite: 'Head Office', history: [], futureSite: 'Erode Site' },
//   { id: 14, name: 'Drop Cloth (4x6m)', usageType: 'reusable', quantity: '5 nos', currentSite: 'Erode Site', history: [{ date: '2025-12-22', site: 'Perundurai Site' }], futureSite: null },
  
//   // Cleaning & Maintenance
//   { id: 15, name: 'Paint Thinner (1L)', usageType: 'one-time', quantity: '12 cans', currentSite: 'Perundurai Site', history: [], futureSite: null },
//   { id: 16, name: 'Paint Cleaner', usageType: 'one-time', quantity: '8 bottles', currentSite: 'Bhavani Site', history: [{ date: '2025-12-20', site: 'Head Office' }], futureSite: null },
//   { id: 17, name: 'Cleaning Rags', usageType: 'one-time', quantity: '100 nos', currentSite: 'Head Office', history: [], futureSite: 'Erode Site' },
  
//   // Safety & Misc
//   { id: 18, name: 'First Aid Kit Refill', usageType: 'one-time', quantity: '2 kits', currentSite: 'Erode Site', history: [], futureSite: null },
//   { id: 19, name: 'Warning Signs', usageType: 'reusable', quantity: '10 nos', currentSite: 'Perundurai Site', history: [{ date: '2025-12-21', site: 'Bhavani Site' }], futureSite: null },
//   { id: 20, name: 'PPE Inspection Checklist', usageType: 'one-time', quantity: '50 sheets', currentSite: 'Head Office', history: [], futureSite: null },
// ];

// const Consumables = () => {
//   const [consumables, setConsumables] = useState(initialConsumables.map(item => ({
//     ...item,
//     futureSite: item.tomorrowSite || item.futureSite || null
//   })));

//   const [selectedId, setSelectedId] = useState(null);
//   const [isDispatchOpen, setIsDispatchOpen] = useState(false);
//   const [isAddOpen, setIsAddOpen] = useState(false);

//   const today = '2025-12-23'; // Current date as provided

//   const [dispatchForm, setDispatchForm] = useState({
//     vehicleName: '',
//     vehicleNumber: '',
//     driverName: '',
//     driverMobile: '',
//     destinationSite: '',
//     amount: '',
//     dispatchDate: today // Default to today
//   });

//   const [addForm, setAddForm] = useState({
//     name: '',
//     usageType: 'one-time',
//     quantity: '',
//     currentSite: 'Head Office'
//   });

//   const openDispatchModal = (id) => {
//     setDispatchForm({
//       vehicleName: '',
//       vehicleNumber: '',
//       driverName: '',
//       driverMobile: '',
//       destinationSite: '',
//       amount: '',
//       dispatchDate: today
//     });
//     setSelectedId(id);
//     setIsDispatchOpen(true);
//   };

//   const closeDispatchModal = () => {
//     setIsDispatchOpen(false);
//     setSelectedId(null);
//   };

//   const openAddModal = () => {
//     setAddForm({
//       name: '',
//       usageType: 'one-time',
//       quantity: '',
//       currentSite: 'Head Office'
//     });
//     setIsAddOpen(true);
//   };

//   const closeAddModal = () => {
//     setIsAddOpen(false);
//   };

//   const handleDispatch = (e) => {
//     e.preventDefault();
//     if (!selectedId || !dispatchForm.destinationSite.trim() || !dispatchForm.dispatchDate) return;

//     const consumable = consumables.find(c => c.id === selectedId);
//     if (!consumable) return;

//     const isFuture = dispatchForm.dispatchDate > today;

//     const transportDetails = [
//       `Vehicle: ${dispatchForm.vehicleName || 'N/A'}`,
//       `No: ${dispatchForm.vehicleNumber || 'N/A'}`,
//       `Driver: ${dispatchForm.driverName || 'N/A'} (${dispatchForm.driverMobile || 'N/A'})`,
//       `Amount: ₹${dispatchForm.amount || '0'}`,
//       `Dispatched on: ${dispatchForm.dispatchDate}`
//     ].join(' | ');

//     const historyEntry = {
//       date: dispatchForm.dispatchDate,
//       site: consumable.currentSite,
//       details: transportDetails
//     };

//     const updated = {
//       ...consumable,
//       history: [...consumable.history, historyEntry],
//       // Update currentSite only if dispatch is today or past
//       ...(isFuture 
//         ? { futureSite: dispatchForm.destinationSite }
//         : { currentSite: dispatchForm.destinationSite, futureSite: null }
//       )
//     };

//     setConsumables(prev => prev.map(c => c.id === selectedId ? updated : c));
//     closeDispatchModal();
//   };

//   const handleAddConsumable = (e) => {
//     e.preventDefault();
//     if (!addForm.name.trim() || !addForm.quantity.trim()) return;

//     const newId = Math.max(...consumables.map(c => c.id)) + 1;
//     const newConsumable = {
//       id: newId,
//       name: addForm.name.trim(),
//       usageType: addForm.usageType,
//       quantity: addForm.quantity.trim(),
//       currentSite: addForm.currentSite,
//       history: [],
//       futureSite: null
//     };

//     setConsumables(prev => [newConsumable, ...prev]);
//     closeAddModal();
//   };

//   const selectedItem = consumables.find(c => c.id === selectedId);
//   const sites = ['Head Office', 'Perundurai Site', 'Erode Site', 'Bhavani Site'];

//   const UsageBadge = ({ usageType }) => {
//     const isOneTime = usageType === 'one-time';
//     return (
//       <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ml-2 ${
//         isOneTime ? 'bg-red-100 text-red-800 border-red-200' : 'bg-green-100 text-green-800 border-green-200'
//       }`}>
//         {isOneTime ? '1x Use' : 'Multi Use'}
//       </span>
//     );
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-100 p-4 sm:p-6 lg:p-8">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="mb-8 flex justify-between items-center">
//           <div className="text-center flex-1">
//             <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 flex items-center justify-center gap-2">
//               <svg className="h-10 w-10 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-4L4 7m8 4v10M4 7v10l8 4" />
//               </svg>
//               Consumables Management
//             </h1>
//             <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
//               Track painting tools, safety gear and materials across Perundurai, Erode & Bhavani sites
//             </p>
//           </div>
//           <button
//             onClick={openAddModal}
//             className="ml-8 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white px-8 py-4 rounded-xl text-lg font-semibold shadow-lg focus:outline-none focus:ring-4 focus:ring-emerald-500/20 transition-all duration-300 flex items-center gap-2 whitespace-nowrap"
//           >
//             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
//             </svg>
//             Add Consumable
//           </button>
//         </div>

//         {/* Legend */}
//         <div className="mb-6 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
//           <div className="flex flex-wrap gap-3 text-sm">
//             <div className="flex items-center gap-2">
//               <UsageBadge usageType="one-time" />
//               <span className="text-gray-600">Disposable / Single use items</span>
//             </div>
//             <div className="flex items-center gap-2">
//               <UsageBadge usageType="reusable" />
//               <span className="text-gray-600">Reusable / Durable items</span>
//             </div>
//           </div>
//         </div>

//         {/* Table */}
//         <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
//           <div className="p-6 bg-gradient-to-r from-teal-600 to-teal-700">
//             <h2 className="text-xl font-semibold text-white">Painting Consumables Inventory</h2>
//           </div>
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead>
//                 <tr>
//                   <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Item Name & Usage Type</th>
//                   <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Quantity</th>
//                   <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Current Site</th>
//                   <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">History</th>
//                   <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Future</th>
//                   <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {consumables.map((item) => (
//                   <tr key={item.id} className="hover:bg-teal-50 transition-colors duration-200">
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 max-w-xs">
//                       <div className="flex items-center">
//                         {item.name}
//                         <UsageBadge usageType={item.usageType} />
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
//                       <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-bold bg-teal-100 text-teal-800">
//                         {item.quantity}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border border-blue-200">
//                         {item.currentSite}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 text-sm text-gray-600 max-w-xs">
//                       {item.history.length === 0 ? (
//                         <span className="text-gray-400 italic">No movement history</span>
//                       ) : (
//                         <div className="space-y-1 max-h-20 overflow-y-auto">
//                           {item.history.slice(-3).map((hist, idx) => (
//                             <div key={idx} className="text-xs break-words bg-gray-50 p-2 rounded mb-1">
//                               <div className="font-medium">{hist.date}: <span className="font-normal">{hist.site}</span></div>
//                               {hist.details && (
//                                 <div className="text-gray-500 mt-1 text-xs truncate" title={hist.details}>
//                                   {hist.details}
//                                 </div>
//                               )}
//                             </div>
//                           ))}
//                           {item.history.length > 3 && (
//                             <span className="text-xs text-gray-400 block mt-1">+{item.history.length - 3} more</span>
//                           )}
//                         </div>
//                       )}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
//                       {item.futureSite ? (
//                         <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-gradient-to-r from-orange-100 to-orange-200 text-orange-800 border border-orange-200">
//                           {item.futureSite} <span className="ml-1 opacity-75">(Scheduled)</span>
//                         </span>
//                       ) : (
//                         <span className="text-gray-400 italic">Not Scheduled</span>
//                       )}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                       <button
//                         onClick={() => openDispatchModal(item.id)}
//                         className="inline-flex items-center px-4 py-2 border border-transparent text-xs font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-200"
//                       >
//                         <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
//                         </svg>
//                         Dispatch
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>

//       {/* Dispatch Modal with Date */}
//       {isDispatchOpen && selectedItem && (
//         <div className="backdrop-blur-xl fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={closeDispatchModal}>
//           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-8 relative max-h-[95vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
//             <button onClick={closeDispatchModal} className="absolute top-6 right-6 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 rounded-full p-2 transition-all hover:bg-gray-100">
//               <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//               </svg>
//             </button>

//             <div className="text-center mb-8">
//               <h3 className="text-3xl font-bold text-gray-900 mb-3">Dispatch Consumable</h3>
//               <div className="bg-gradient-to-r from-teal-50 to-blue-50 p-6 rounded-2xl mx-auto max-w-md">
//                 <div className="flex items-center justify-center gap-2 mb-2">
//                   <div className="font-bold text-xl text-gray-900">{selectedItem.name}</div>
//                   <UsageBadge usageType={selectedItem.usageType} />
//                 </div>
//                 <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
//                   <span>Quantity: {selectedItem.quantity}</span>
//                   <span className="font-medium text-teal-800">Current: {selectedItem.currentSite}</span>
//                 </div>
//               </div>
//             </div>

//             <form onSubmit={handleDispatch} className="space-y-8">
//               <div>
//                 <h4 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
//                   <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                   </svg>
//                   Dispatch & Transport Details
//                 </h4>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div className="md:col-span-2">
//                     <label className="block text-sm font-semibold text-gray-700 mb-3">
//                       Dispatch Date <span className="text-red-500">*</span>
//                     </label>
//                     <input
//                       type="date"
//                       value={dispatchForm.dispatchDate}
//                       onChange={(e) => setDispatchForm({ ...dispatchForm, dispatchDate: e.target.value })}
//                       min={today}
//                       className="w-full px-5 py-4 border border-gray-200 rounded-xl focus:ring-3 focus:ring-teal-500/20 focus:border-teal-500 transition-all duration-300 text-lg shadow-sm"
//                       required
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 mb-3">Vehicle Name/Model <span className="text-red-500">*</span></label>
//                     <input type="text" value={dispatchForm.vehicleName} onChange={(e) => setDispatchForm({ ...dispatchForm, vehicleName: e.target.value })} placeholder="Tata Ace / Eicher" className="w-full px-5 py-4 border border-gray-200 rounded-xl focus:ring-3 focus:ring-teal-500/20 focus:border-teal-500 transition-all text-lg placeholder-gray-400 shadow-sm" required />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 mb-3">Vehicle Number <span className="text-red-500">*</span></label>
//                     <input type="text" value={dispatchForm.vehicleNumber} onChange={(e) => setDispatchForm({ ...dispatchForm, vehicleNumber: e.target.value.toUpperCase() })} placeholder="TN 37 AB 1234" className="w-full px-5 py-4 border border-gray-200 rounded-xl focus:ring-3 focus:ring-teal-500/20 focus:border-teal-500 transition-all text-lg placeholder-gray-400 shadow-sm uppercase tracking-wider" required />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 mb-3">Driver Name <span className="text-red-500">*</span></label>
//                     <input type="text" value={dispatchForm.driverName} onChange={(e) => setDispatchForm({ ...dispatchForm, driverName: e.target.value })} placeholder="Ravi Kumar" className="w-full px-5 py-4 border border-gray-200 rounded-xl focus:ring-3 focus:ring-teal-500/20 focus:border-teal-500 transition-all text-lg placeholder-gray-400 shadow-sm" required />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 mb-3">Driver Mobile <span className="text-red-500">*</span></label>
//                     <input type="tel" value={dispatchForm.driverMobile} onChange={(e) => setDispatchForm({ ...dispatchForm, driverMobile: e.target.value })} placeholder="+91 98765 43210" className="w-full px-5 py-4 border border-gray-200 rounded-xl focus:ring-3 focus:ring-teal-500/20 focus:border-teal-500 transition-all text-lg placeholder-gray-400 shadow-sm" required />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 mb-3">Destination Site <span className="text-red-500">*</span></label>
//                     <input type="text" value={dispatchForm.destinationSite} onChange={(e) => setDispatchForm({ ...dispatchForm, destinationSite: e.target.value })} placeholder="Perundurai Site" className="w-full px-5 py-4 border border-gray-200 rounded-xl focus:ring-3 focus:ring-green-500/20 focus:border-green-500 transition-all text-lg placeholder-gray-400 shadow-sm" required />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 mb-3">Transport Amount <span className="text-red-500">*</span></label>
//                     <div className="relative">
//                       <span className="absolute left-5 top-1/2 -translate-y-1/2 text-2xl font-semibold text-gray-500">₹</span>
//                       <input type="number" step="0.01" min="0" value={dispatchForm.amount} onChange={(e) => setDispatchForm({ ...dispatchForm, amount: e.target.value })} placeholder="2500" className="w-full pl-16 pr-5 py-4 border border-gray-200 rounded-xl focus:ring-3 focus:ring-teal-500/20 focus:border-teal-500 transition-all text-lg placeholder-gray-400 shadow-sm" required />
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               <div className="flex flex-col sm:flex-row gap-4 pt-6">
//                 <button type="button" onClick={closeDispatchModal} className="flex-1 px-8 py-4 bg-gray-200 text-gray-800 rounded-xl text-lg font-semibold shadow-sm hover:bg-gray-300 transition-all">
//                   Cancel
//                 </button>
//                 <button type="submit" className="flex-1 px-8 py-4 bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-xl text-lg font-semibold shadow-lg hover:from-teal-700 hover:to-teal-800 transition-all flex items-center justify-center gap-3">
//                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
//                   </svg>
//                   Schedule Dispatch
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* Add Consumable Modal */}
//       {isAddOpen && (
//         <div className="backdrop-blur-xl fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={closeAddModal}>
//           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 relative max-h-[95vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
//             <button onClick={closeAddModal} className="absolute top-6 right-6 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-full p-2 transition-all hover:bg-gray-100">
//               <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//               </svg>
//             </button>

//             <div className="text-center mb-8">
//               <h3 className="text-3xl font-bold text-gray-900 mb-3">Add New Consumable</h3>
//               <div className="bg-gradient-to-r from-emerald-50 to-green-50 p-6 rounded-2xl mx-auto">
//                 <div className="text-lg text-gray-700">Add a new item to your inventory</div>
//               </div>
//             </div>

//             <form onSubmit={handleAddConsumable} className="space-y-6">
//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-3">Consumable Name <span className="text-red-500">*</span></label>
//                 <input type="text" value={addForm.name} onChange={(e) => setAddForm({ ...addForm, name: e.target.value })} placeholder="e.g., Paint Brush" className="w-full px-5 py-4 border border-gray-200 rounded-xl focus:ring-3 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-lg placeholder-gray-400 shadow-sm" required />
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div>
//                   <label className="block text-sm font-semibold text-gray-700 mb-3">Usage Type <span className="text-red-500">*</span></label>
//                   <select value={addForm.usageType} onChange={(e) => setAddForm({ ...addForm, usageType: e.target.value })} className="w-full px-5 py-4 border border-gray-200 rounded-xl focus:ring-3 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-lg shadow-sm" required>
//                     <option value="one-time">1x Use (Disposable)</option>
//                     <option value="reusable">Multi Use (Reusable)</option>
//                   </select>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-semibold text-gray-700 mb-3">Quantity <span className="text-red-500">*</span></label>
//                   <input type="text" value={addForm.quantity} onChange={(e) => setAddForm({ ...addForm, quantity: e.target.value })} placeholder="e.g., 12 nos" className="w-full px-5 py-4 border border-gray-200 rounded-xl focus:ring-3 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-lg placeholder-gray-400 shadow-sm" required />
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-3">Current Location <span className="text-red-500">*</span></label>
//                 <select value={addForm.currentSite} onChange={(e) => setAddForm({ ...addForm, currentSite: e.target.value })} className="w-full px-5 py-4 border border-gray-200 rounded-xl focus:ring-3 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-lg shadow-sm" required>
//                   {sites.map(site => <option key={site} value={site}>{site}</option>)}
//                 </select>
//               </div>

//               <div className="flex flex-col sm:flex-row gap-4 pt-6">
//                 <button type="button" onClick={closeAddModal} className="flex-1 px-8 py-4 bg-gray-200 text-gray-800 rounded-xl text-lg font-semibold shadow-sm hover:bg-gray-300 transition-all">
//                   Cancel
//                 </button>
//                 <button type="submit" className="flex-1 px-8 py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl text-lg font-semibold shadow-lg hover:from-emerald-700 hover:to-emerald-800 transition-all flex items-center justify-center gap-2">
//                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                   </svg>
//                   Add Consumable
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Consumables;










import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import { Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { format } from 'date-fns';
import Swal from 'sweetalert2';

const Consumables = () => {
  const [masterConsumables, setMasterConsumables] = useState([]);
  const [filteredConsumables, setFilteredConsumables] = useState([]);
  const [dispatches, setDispatches] = useState([]);
  const [filteredDispatches, setFilteredDispatches] = useState([]);
  const [viewMode, setViewMode] = useState('master');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [usageFilter, setUsageFilter] = useState('all');
  const [dispatchStartDate, setDispatchStartDate] = useState('');
  const [dispatchEndDate, setDispatchEndDate] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Add modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addForm, setAddForm] = useState({
    name: '',
    usageType: 'single use',
  });
  const [adding, setAdding] = useState(false);

  // Dispatch modal + selection
  const [selectedConsumable, setSelectedConsumable] = useState(null);
  const [isDispatchModalOpen, setIsDispatchModalOpen] = useState(false);
  const [dispatchForm, setDispatchForm] = useState({
    quantity: '',
    currentSite: '',
    vehicleName: '',
    vehicleNumber: '',
    driverName: '',
    driverMobile: '',
    destinationSite: '',
    amount: '',
    dispatchDate: new Date().toISOString().split('T')[0],
  });
  const [dispatchLoading, setDispatchLoading] = useState(false);

  // Expanded dispatch row
  const [expandedDispatchId, setExpandedDispatchId] = useState(null);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const consRes = await axios.get('http://localhost:5000/resource/consumables');
        if (consRes.data?.status === 'success') {
          setMasterConsumables(consRes.data.data || []);
          setFilteredConsumables(consRes.data.data || []);
        }

        const dispRes = await axios.get('http://localhost:5000/resource/dispatches');
        if (dispRes.data?.status === 'success') {
          setDispatches(dispRes.data.data || []);
          setFilteredDispatches(dispRes.data.data || []);
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter consumables
  useEffect(() => {
    let result = [...masterConsumables];

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(item => item.name.toLowerCase().includes(term));
    }

    if (usageFilter !== 'all') {
      result = result.filter(item => item.consumableStatus === usageFilter);
    }

    setFilteredConsumables(result);
  }, [searchTerm, usageFilter, masterConsumables]);

  // Filter dispatches
  useEffect(() => {
    let result = [...dispatches];

    if (dispatchStartDate) {
      const start = new Date(dispatchStartDate);
      result = result.filter(d => new Date(d.dispatch_date) >= start);
    }

    if (dispatchEndDate) {
      const end = new Date(dispatchEndDate);
      end.setHours(23, 59, 59, 999);
      result = result.filter(d => new Date(d.dispatch_date) <= end);
    }

    setFilteredDispatches(result);
  }, [dispatchStartDate, dispatchEndDate, dispatches]);

  const consumableOptions = filteredConsumables.map(item => ({
    value: item.id,
    label: `${item.name} (${item.consumableStatus})`,
    data: item,
  }));

  const openAddModal = () => {
    setAddForm({ name: '', usageType: 'single use' });
    setIsAddModalOpen(true);
  };

  const closeAddModal = () => setIsAddModalOpen(false);

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!addForm.name.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Required',
        text: 'Consumable name is required',
        timer: 2000,
        showConfirmButton: false,
      });
      return;
    }

    setAdding(true);
    try {
      const payload = {
        consumable_name: addForm.name.trim(),
        is_multi_use: addForm.usageType === 'multi use' ? 1 : 0,
      };

      await axios.post('http://localhost:5000/resource/consumables', payload);

      const refresh = await axios.get('http://localhost:5000/resource/consumables');
      if (refresh.data?.status === 'success') {
        setMasterConsumables(refresh.data.data || []);
      }

      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Consumable added successfully',
        timer: 2000,
        showConfirmButton: false,
        toast: true,
        position: 'top-end',
      });

      closeAddModal();
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.response?.data?.message || 'Failed to add consumable',
      });
    } finally {
      setAdding(false);
    }
  };

  const openDispatchModal = () => {
    if (!selectedConsumable) {
      Swal.fire({
        icon: 'warning',
        title: 'Select Item',
        text: 'Please select a consumable first',
        timer: 2000,
        showConfirmButton: false,
      });
      return;
    }
    setDispatchForm({
      quantity: '',
      currentSite: '',
      vehicleName: '',
      vehicleNumber: '',
      driverName: '',
      driverMobile: '',
      destinationSite: '',
      amount: '',
      dispatchDate: new Date().toISOString().split('T')[0],
    });
    setIsDispatchModalOpen(true);
  };

  const closeDispatchModal = () => setIsDispatchModalOpen(false);

  const handleDispatchSubmit = async (e) => {
    e.preventDefault();

    if (!dispatchForm.quantity.trim() || !dispatchForm.currentSite.trim() ||
        !dispatchForm.destinationSite.trim() || !dispatchForm.dispatchDate) {
      Swal.fire({
        icon: 'warning',
        title: 'Required Fields',
        text: 'Quantity, current site, destination and date are required',
        timer: 2000,
        showConfirmButton: false,
      });
      return;
    }

    setDispatchLoading(true);

    try {
      const payload = {
        resource_consumable_id: selectedConsumable.value,
        quantity: dispatchForm.quantity.trim(),
        current_site: dispatchForm.currentSite.trim(),
        dispatch_date: dispatchForm.dispatchDate,
        vehicle_name_model: dispatchForm.vehicleName.trim() || null,
        vehicle_number: dispatchForm.vehicleNumber.trim() || null,
        driver_name: dispatchForm.driverName.trim() || null,
        driver_mobile: dispatchForm.driverMobile.trim() || null,
        destination_site: dispatchForm.destinationSite.trim(),
        transport_amount: dispatchForm.amount ? Number(dispatchForm.amount) : 0,
      };

      const res = await axios.post('http://localhost:5000/resource/dispatches', payload);

      if (res.data.status === 'success') {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Dispatch recorded successfully!',
          timer: 2000,
          showConfirmButton: false,
          toast: true,
          position: 'top-end',
        });

        closeDispatchModal();

        // Refresh dispatches
        const dispRes = await axios.get('http://localhost:5000/resource/dispatches');
        if (dispRes.data?.status === 'success') {
          setDispatches(dispRes.data.data || []);
        }
      }
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.response?.data?.message || 'Failed to record dispatch',
      });
    } finally {
      setDispatchLoading(false);
    }
  };

  const toggleExpandDispatch = (id) => {
    setExpandedDispatchId(prev => prev === id ? null : id);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-emerald-700 animate-pulse">Loading...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-600">{error}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50 p-5 sm:p-8">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-center sm:text-left">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 flex items-center gap-3">
              <span className="text-emerald-600">📦</span>
              Consumables Master
            </h1>
            <p className="text-gray-600 mt-1">
              Total items: <strong>{masterConsumables.length}</strong>
            </p>
          </div>

          <button
            onClick={openAddModal}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium shadow-md transition flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Consumable
          </button>
        </div>

        {/* Toggle + Filter Icon */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
          <div className="flex gap-4">
            <button
              onClick={() => setViewMode('master')}
              className={`px-8 py-3 rounded-full font-semibold transition-all shadow-sm ${
                viewMode === 'master' ? 'bg-emerald-600 text-white shadow-emerald-200' : 'bg-white border text-gray-700 hover:bg-gray-50'
              }`}
            >
              Master List
            </button>
            <button
              onClick={() => setViewMode('inventory')}
              className={`px-8 py-3 rounded-full font-semibold transition-all shadow-sm ${
                viewMode === 'inventory' ? 'bg-emerald-600 text-white shadow-emerald-200' : 'bg-white border text-gray-700 hover:bg-gray-50'
              }`}
            >
              Inventory & Dispatch
            </button>
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="p-3 bg-gray-100 hover:bg-gray-200 rounded-full transition"
            title="Filters"
          >
            <Filter size={20} className="text-emerald-700" />
          </button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 mb-8 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Search */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  placeholder="Search name..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              {/* Usage Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Usage Type</label>
                <div className="flex gap-3">
                  <button
                    onClick={() => setUsageFilter('all')}
                    className={`flex-1 py-2 px-4 rounded-lg font-medium transition ${
                      usageFilter === 'all' ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setUsageFilter('single use')}
                    className={`flex-1 py-2 px-4 rounded-lg font-medium transition ${
                      usageFilter === 'single use' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Single Use
                  </button>
                  <button
                    onClick={() => setUsageFilter('multi use')}
                    className={`flex-1 py-2 px-4 rounded-lg font-medium transition ${
                      usageFilter === 'multi use' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Multi Use
                  </button>
                </div>
              </div>

              {/* Dispatch Date Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Dispatch Date Range</label>
                <div className="flex gap-3">
                  <input
                    type="date"
                    value={dispatchStartDate}
                    onChange={e => setDispatchStartDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500"
                  />
                  <input
                    type="date"
                    value={dispatchEndDate}
                    onChange={e => setDispatchEndDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Master View */}
        {viewMode === 'master' && (
          <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-emerald-100">
            <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 px-6 py-5 text-white">
              <h2 className="text-xl font-semibold">All Consumables</h2>
            </div>

            {filteredConsumables.length === 0 ? (
              <div className="p-12 text-center text-gray-500">No matching consumables</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-emerald-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-emerald-800 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-emerald-800 uppercase tracking-wider w-48">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredConsumables.map(item => (
                      <tr key={item.id} className="hover:bg-emerald-50/40">
                        <td className="px-6 py-4 text-gray-800 font-medium">{item.name}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-4 py-1.5 text-sm font-medium rounded-full ${
                            item.consumableStatus === 'multi use' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-amber-100 text-amber-800 border border-amber-200'
                          }`}>
                            {item.consumableStatus}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Inventory & Dispatch View */}
        {viewMode === 'inventory' && (
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-emerald-100">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-800">Dispatch Consumable</h2>
              <button
                onClick={openDispatchModal}
                disabled={!selectedConsumable || dispatchLoading}
                className={`px-8 py-3.5 rounded-xl font-semibold shadow-lg transition-all flex items-center gap-2 ${
                  !selectedConsumable || dispatchLoading ? 'bg-gray-400 cursor-not-allowed text-white' : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                }`}
              >
                {dispatchLoading ? 'Saving...' : 'Dispatch'}
              </button>
            </div>

            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-3">Select Consumable</label>
              <Select
                options={consumableOptions}
                value={selectedConsumable}
                onChange={setSelectedConsumable}
                placeholder="Search consumable name..."
                isSearchable
                isClearable
                className="text-base"
                styles={{
                  control: (base) => ({ ...base, borderRadius: '0.75rem', borderColor: '#d1d5db', padding: '0.3rem', boxShadow: 'none', '&:hover': { borderColor: '#10b981' } }),
                  option: (base, state) => ({ ...base, backgroundColor: state.isSelected ? '#10b981' : state.isFocused ? '#ecfdf5' : 'white', color: state.isSelected ? 'white' : '#111827' }),
                }}
              />
            </div>

            {selectedConsumable && (
              <div className="bg-emerald-50 p-6 rounded-xl border border-emerald-200 mb-10">
                <h3 className="text-xl font-semibold text-emerald-800 mb-3">
                  Selected: {selectedConsumable.label}
                </h3>
                <p className="text-gray-700">Fill the form and click Dispatch to record.</p>
              </div>
            )}

            {!selectedConsumable && (
              <div className="text-center py-12 text-gray-500">Select a consumable to dispatch</div>
            )}

            {/* All Dispatched Items */}
            <div className="mt-12">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">All Dispatched Items</h3>

              {filteredDispatches.length === 0 ? (
                <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-xl">
                  No dispatch records found
                </div>
              ) : (
                <div className="overflow-x-auto border border-gray-200 rounded-xl">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Consumable</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Usage</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Qty</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Current</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Destination</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredDispatches.map(d => (
                        <React.Fragment key={d.id}>
                          <tr
                            onClick={() => toggleExpandDispatch(d.id)}
                            className="hover:bg-gray-50 cursor-pointer"
                          >
                            <td className="px-6 py-4 font-medium">{d.consumable_name}</td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex px-3 py-1 text-xs rounded-full ${
                                d.usage_type === 'multi use' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {d.usage_type}
                              </span>
                            </td>
                            <td className="px-6 py-4">{d.quantity}</td>
                            <td className="px-6 py-4">{d.current_site}</td>
                            <td className="px-6 py-4">{d.destination_site}</td>
                            <td className="px-6 py-4">
                              {format(new Date(d.dispatch_date), 'dd MMM yyyy')}
                              <span className="ml-2">
                                {expandedDispatchId === d.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                              </span>
                            </td>
                          </tr>

                          {expandedDispatchId === d.id && (
                            <tr>
                              <td colSpan={6} className="px-6 py-4 bg-gray-50">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <strong>Driver:</strong> {d.driver_name || '—'} ({d.driver_mobile || '—'})
                                  </div>
                                  <div>
                                    <strong>Vehicle:</strong> {d.vehicle_name_model || '—'} ({d.vehicle_number || '—'})
                                  </div>
                                  <div>
                                    <strong>Amount:</strong> ₹{Number(d.transport_amount).toLocaleString()}
                                  </div>
                                  <div>
                                    <strong>Recorded:</strong> {format(new Date(d.created_at), 'dd MMM yyyy HH:mm')}
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Add Modal – NO currentSite field */}
        {isAddModalOpen && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={closeAddModal}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
              <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 px-6 py-5 text-white rounded-t-2xl">
                <h3 className="text-xl font-semibold">Add New Consumable</h3>
              </div>

              <form onSubmit={handleAddSubmit} className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Consumable Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={addForm.name}
                    onChange={e => setAddForm({...addForm, name: e.target.value})}
                    placeholder="e.g. Safety Helmet - 5 nos"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                    required
                    disabled={adding}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Usage Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={addForm.usageType}
                    onChange={e => setAddForm({...addForm, usageType: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white"
                    required
                    disabled={adding}
                  >
                    <option value="single use">Single use (disposable)</option>
                    <option value="multi use">Multi use (reusable)</option>
                  </select>
                </div>

                <div className="flex gap-4 pt-4">
                  <button type="button" onClick={closeAddModal} disabled={adding} className="flex-1 py-3 bg-gray-200 rounded-xl hover:bg-gray-300 disabled:opacity-50">
                    Cancel
                  </button>
                  <button type="submit" disabled={adding} className="flex-1 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 disabled:opacity-50">
                    {adding ? 'Adding...' : 'Add Consumable'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Dispatch Modal */}
        {isDispatchModalOpen && selectedConsumable && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={closeDispatchModal}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <div className="p-8 relative">
                <button onClick={closeDispatchModal} disabled={dispatchLoading} className="absolute top-6 right-6 text-gray-500 hover:text-gray-800 disabled:opacity-50">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                <h3 className="text-3xl font-bold text-center mb-8">
                  Dispatch: {selectedConsumable.label}
                </h3>

                <form onSubmit={handleDispatchSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold mb-2">Dispatch Date *</label>
                      <input
                        type="date"
                        value={dispatchForm.dispatchDate}
                        min={dispatchForm.dispatchDate}
                        onChange={e => setDispatchForm({...dispatchForm, dispatchDate: e.target.value})}
                        className="w-full px-4 py-3 border rounded-lg focus:ring-emerald-500"
                        required
                        disabled={dispatchLoading}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2">Quantity *</label>
                      <input
                        type="text"
                        value={dispatchForm.quantity}
                        onChange={e => setDispatchForm({...dispatchForm, quantity: e.target.value})}
                        placeholder="e.g. 5 nos / 10 pairs"
                        className="w-full px-4 py-3 border rounded-lg focus:ring-emerald-500"
                        required
                        disabled={dispatchLoading}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2">Current Site *</label>
                      <input
                        type="text"
                        value={dispatchForm.currentSite}
                        onChange={e => setDispatchForm({...dispatchForm, currentSite: e.target.value})}
                        placeholder="e.g. Head Office"
                        className="w-full px-4 py-3 border rounded-lg focus:ring-emerald-500"
                        required
                        disabled={dispatchLoading}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2">Vehicle Name/Model</label>
                      <input
                        type="text"
                        value={dispatchForm.vehicleName}
                        onChange={e => setDispatchForm({...dispatchForm, vehicleName: e.target.value})}
                        placeholder="Tata Ace / Eicher"
                        className="w-full px-4 py-3 border rounded-lg"
                        disabled={dispatchLoading}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2">Vehicle Number</label>
                      <input
                        type="text"
                        value={dispatchForm.vehicleNumber}
                        onChange={e => setDispatchForm({...dispatchForm, vehicleNumber: e.target.value.toUpperCase()})}
                        placeholder="TN37AB1234"
                        className="w-full px-4 py-3 border rounded-lg uppercase"
                        disabled={dispatchLoading}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2">Driver Name</label>
                      <input
                        type="text"
                        value={dispatchForm.driverName}
                        onChange={e => setDispatchForm({...dispatchForm, driverName: e.target.value})}
                        placeholder="Ravi Kumar"
                        className="w-full px-4 py-3 border rounded-lg"
                        disabled={dispatchLoading}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2">Driver Mobile</label>
                      <input
                        type="tel"
                        value={dispatchForm.driverMobile}
                        onChange={e => setDispatchForm({...dispatchForm, driverMobile: e.target.value})}
                        placeholder="9876543210"
                        className="w-full px-4 py-3 border rounded-lg"
                        disabled={dispatchLoading}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2">Destination Site *</label>
                      <input
                        type="text"
                        value={dispatchForm.destinationSite}
                        onChange={e => setDispatchForm({...dispatchForm, destinationSite: e.target.value})}
                        placeholder="Perundurai Site"
                        className="w-full px-4 py-3 border rounded-lg"
                        required
                        disabled={dispatchLoading}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2">Transport Amount (₹)</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={dispatchForm.amount}
                        onChange={e => setDispatchForm({...dispatchForm, amount: e.target.value})}
                        placeholder="2500"
                        className="w-full px-4 py-3 border rounded-lg"
                        disabled={dispatchLoading}
                      />
                    </div>
                  </div>

                  <div className="flex gap-4 pt-8">
                    <button type="button" onClick={closeDispatchModal} disabled={dispatchLoading} className="flex-1 py-3.5 bg-gray-200 rounded-xl hover:bg-gray-300 disabled:opacity-50">
                      Cancel
                    </button>
                    <button type="submit" disabled={dispatchLoading} className="flex-1 py-3.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 disabled:opacity-50 flex items-center justify-center gap-2">
                      {dispatchLoading ? 'Saving...' : 'Record Dispatch'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Consumables;