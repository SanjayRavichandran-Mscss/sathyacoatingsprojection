import React, { useState, useEffect } from 'react';

const ProjectProjection = () => {
  // State management
  const [poAmount, setPoAmount] = useState(5000);
  const [budgetPercentage, setBudgetPercentage] = useState(70);
  const [materials, setMaterials] = useState([
    { id: 1, name: '', uom: '', rate: 0, quantity: 0, cost: 0 }
  ]);
  const [labour, setLabour] = useState({
    type: 'labours',
    value: 0,
    rate: 0,
    total: 0
  });
  const [consumables, setConsumables] = useState(0);
  const [transportation, setTransportation] = useState(0);
  const [customOverheads, setCustomOverheads] = useState([]);
  
  // Calculated values
  const budgetedAmount = (poAmount * budgetPercentage) / 100;
  const totalMaterialCost = materials.reduce((sum, m) => sum + Number(m.cost), 0);
  const labourCost = labour.type === 'labours' 
    ? labour.value * labour.rate 
    : labour.value * labour.rate;
  const totalOverheadCost = totalMaterialCost + labourCost + consumables + transportation + 
    customOverheads.reduce((sum, oh) => sum + Number(oh.value), 0);
  const remainingBudget = budgetedAmount - totalOverheadCost;

  // Percentage calculations
  const getPercentage = (value) => ((value / budgetedAmount) * 100).toFixed(2);

  // Handlers
  const addMaterial = () => {
    setMaterials([...materials, {
      id: materials.length + 1,
      name: '',
      uom: '',
      rate: 0,
      quantity: 0,
      cost: 0
    }]);
  };

  const updateMaterial = (id, field, value) => {
    setMaterials(materials.map(m => {
      if (m.id === id) {
        const updated = { ...m, [field]: value };
        if (field === 'rate' || field === 'quantity') {
          updated.cost = updated.rate * updated.quantity;
        }
        return updated;
      }
      return m;
    }));
  };

  const addCustomOverhead = () => {
    setCustomOverheads([...customOverheads, {
      id: customOverheads.length + 1,
      name: `Overhead ${customOverheads.length + 1}`,
      value: 0
    }]);
  };

  const updateCustomOverhead = (id, value) => {
    setCustomOverheads(customOverheads.map(oh => 
      oh.id === id ? { ...oh, value } : oh
    ));
  };

  // Validation
  useEffect(() => {
    if (budgetPercentage > 100) {
      setBudgetPercentage(100);
      alert('Budget percentage cannot exceed 100%');
    }
    if (totalOverheadCost > budgetedAmount) {
      alert('Total allocated cost exceeds budgeted amount!');
    }
  }, [budgetPercentage, totalOverheadCost, budgetedAmount]);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6">Project Projection Calculator</h1>

      {/* PO Amount and Budget Percentage */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Overall PO Amount</label>
          <input
            type="number"
            value={poAmount}
            onChange={(e) => setPoAmount(Number(e.target.value))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Budget Percentage (%)</label>
          <input
            type="number"
            value={budgetPercentage}
            onChange={(e) => setBudgetPercentage(Number(e.target.value))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            max="100"
          />
        </div>
      </div>
      <div className="mb-6">
        <p className="text-lg font-semibold">Budgeted Amount: ${budgetedAmount.toFixed(2)}</p>
        <p className="text-lg font-semibold">Remaining Budget: ${remainingBudget.toFixed(2)}</p>
      </div>

      {/* Materials Overhead */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Materials</h2>
        {materials.map((material) => (
          <div key={material.id} className="grid grid-cols-5 gap-4 mb-4">
            <input
              type="text"
              placeholder="Material Name"
              value={material.name}
              onChange={(e) => updateMaterial(material.id, 'name', e.target.value)}
              className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            <input
              type="text"
              placeholder="UoM"
              value={material.uom}
              onChange={(e) => updateMaterial(material.id, 'uom', e.target.value)}
              className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            <input
              type="number"
              placeholder="Rate per UoM"
              value={material.rate}
              onChange={(e) => updateMaterial(material.id, 'rate', Number(e.target.value))}
              className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            <input
              type="number"
              placeholder="Quantity"
              value={material.quantity}
              onChange={(e) => updateMaterial(material.id, 'quantity', Number(e.target.value))}
              className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            <input
              type="number"
              placeholder="Cost"
              value={material.cost}
              readOnly
              className="rounded-md border-gray-300 bg-gray-100"
            />
          </div>
        ))}
        <button
          onClick={addMaterial}
          className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Add Material
        </button>
        <p className="mt-2">Total Material Cost: ${totalMaterialCost.toFixed(2)} ({getPercentage(totalMaterialCost)}%)</p>
      </div>

      {/* Labour Overhead */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Labour</h2>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <select
            value={labour.type}
            onChange={(e) => setLabour({ ...labour, type: e.target.value, value: 0 })}
            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="labours">No. of Labours</option>
            <option value="shifts">Total Estimated Shifts</option>
          </select>
          <input
            type="number"
            placeholder={labour.type === 'labours' ? 'No. of Labours' : 'Total Shifts'}
            value={labour.value}
            onChange={(e) => setLabour({ ...labour, value: Number(e.target.value) })}
            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          <input
            type="number"
            placeholder="Rate per Shift"
            value={labour.rate}
            onChange={(e) => setLabour({ ...labour, rate: Number(e.target.value) })}
            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        <p>Total Labour Cost: ${labourCost.toFixed(2)} ({getPercentage(labourCost)}%)</p>
      </div>

      {/* Consumables Overhead */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Consumables</h2>
        <input
          type="number"
          value={consumables}
          onChange={(e) => setConsumables(Number(e.target.value))}
          className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
        <p>Total Consumables Cost: ${consumables.toFixed(2)} ({getPercentage(consumables)}%)</p>
      </div>

      {/* Transportation Overhead */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Transportation</h2>
        <input
          type="number"
          value={transportation}
          onChange={(e) => setTransportation(Number(e.target.value))}
          className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
        <p>Total Transportation Cost: ${transportation.toFixed(2)} ({getPercentage(transportation)}%)</p>
      </div>

      {/* Custom Overheads */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Custom Overheads</h2>
        {customOverheads.map((oh) => (
          <div key={oh.id} className="grid grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              value={oh.name}
              onChange={(e) => setCustomOverheads(customOverheads.map(o => 
                o.id === oh.id ? { ...o, name: e.target.value } : o
              ))}
              className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            <input
              type="number"
              value={oh.value}
              onChange={(e) => updateCustomOverhead(oh.id, Number(e.target.value))}
              className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            <p>Cost: ${oh.value.toFixed(2)} ({getPercentage(oh.value)}%)</p>
          </div>
        ))}
        <button
          onClick={addCustomOverhead}
          className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Add Custom Overhead
        </button>
      </div>

      {/* Summary */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-4">Summary</h2>
        <p>Total Allocated Cost: ${totalOverheadCost.toFixed(2)}</p>
        <p>Total Budget Percentage Used: {((totalOverheadCost / budgetedAmount) * 100).toFixed(2)}%</p>
      </div>
    </div>
  );
};

export default ProjectProjection;