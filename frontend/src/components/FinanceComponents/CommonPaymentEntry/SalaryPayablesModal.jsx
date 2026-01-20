// components/FinanceComponents/CommonPaymentEntry/SalaryPayablesModal.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, Calendar, Building2, Search, Banknote, Edit, Check, X } from 'lucide-react';

const themeColors = {
  primary: '#1e7a6f',
  textPrimary: '#212529',
  textSecondary: '#6c757d',
  border: '#dee2e6',
  lightBorder: '#e9ecef',
  lightBg: '#f8f9fa',
};

const SalaryPayablesModal = ({ onClose, createdBy }) => {
  const [companies, setCompanies] = useState([]);
  const [banks, setBanks] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState('');
  const [selectedProject, setSelectedProject] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [selectedBank, setSelectedBank] = useState('');
  const [employees, setEmployees] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [compRes, bankRes] = await Promise.all([
          axios.get('https://scpl.kggeniuslabs.com/api/finance/companies-with-projects'),
          axios.get('https://scpl.kggeniuslabs.com/api/finance/bank-masters')
        ]);

        if (compRes.data.status === 'success') {
          setCompanies(compRes.data.data);
          if (compRes.data.data.length > 0) setSelectedCompany(compRes.data.data[0].company_id);
        }

        if (bankRes.data.status === 'success') {
          setBanks(bankRes.data.data.map(b => ({
            value: b.id,
            label: `${b.bank_name} - ${b.account_number || 'N/A'} (₹${parseFloat(b.available_balance || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })})`
          })));
        }
      } catch (err) {
        setError('Failed to load companies/banks');
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const company = companies.find(c => c.company_id === selectedCompany);
    if (company?.projects?.length > 0 && !selectedProject) {
      setSelectedProject(company.projects[0].pd_id);
    }
  }, [selectedCompany, companies]);

  useEffect(() => {
    if (!selectedProject || !selectedMonth || !selectedBank) {
      setEmployees([]);
      return;
    }

    const fetchSalaryData = async () => {
      setLoading(true);
      try {
        const month = selectedMonth.replace('-', '');
        const res = await axios.get(
          `https://scpl.kggeniuslabs.com/api/finance/salary-payables-summary?pd_id=${selectedProject}&month=${month}&bank_id=${selectedBank}`
        );

        if (res.data.status === 'success' && res.data.data?.length > 1) {
          const list = res.data.data.slice(1).map(emp => ({
            ...emp,
            original_total_paid: emp.total_paid
          }));
          setEmployees(list);
        } else {
          setEmployees([]);
        }
      } catch (err) {
        setError('No records found for selected filters');
        setEmployees([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSalaryData();
  }, [selectedProject, selectedMonth, selectedBank]);

  const handleSave = async (emp_id) => {
    const emp = employees.find(e => e.emp_id === emp_id);
    if (!emp) return;

    try {
      await axios.post('https://scpl.kggeniuslabs.com/api/finance/update-salary-payable', {
        emp_id,
        pd_id: selectedProject,
        entry_date: `${selectedMonth}-01`,
        paid_amount: emp.total_paid,
        finance_bank_id: selectedBank,
        created_by: createdBy,
        updated_by: createdBy
      });

      setEmployees(prev => prev.map(e =>
        e.emp_id === emp_id ? { ...e, original_total_paid: emp.total_paid } : e
      ));
      setEditingId(null);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save');
    }
  };

  const handleCancel = (emp_id) => {
    setEmployees(prev => prev.map(e =>
      e.emp_id === emp_id
        ? { ...e, total_paid: e.original_total_paid, balance: e.approved_salary - e.original_total_paid }
        : e
    ));
    setEditingId(null);
  };

  const handlePaidChange = (emp_id, value) => {
    const paid = parseFloat(value) || 0;
    setEmployees(prev => prev.map(e =>
      e.emp_id === emp_id
        ? { ...e, total_paid: paid, balance: e.approved_salary - paid }
        : e
    ));
  };

  const totals = employees.reduce((acc, e) => ({
    approved: acc.approved + (e.approved_salary || 0),
    paid: acc.paid + (e.total_paid || 0),
    balance: acc.balance + (e.balance || 0)
  }), { approved: 0, paid: 0, balance: 0 });

  const filtered = employees.filter(e => e.full_name?.toLowerCase().includes(searchTerm.toLowerCase()));
  const formatINR = (amt) => '₹' + Number(amt || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 });

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl border max-w-7xl w-full max-h-[95vh] overflow-hidden" style={{ borderColor: themeColors.border }} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="p-6 border-b sticky top-0 bg-white flex justify-between items-center" style={{ borderColor: themeColors.lightBorder }}>
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg" style={{ backgroundColor: themeColors.primary }}>
              <Users className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold" style={{ color: themeColors.textPrimary }}>Salary Payables – Bank Wise</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-lg transition">
            <X size={28} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto max-h-[80vh]">
          {/* Filters */}
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-semibold mb-2"><Building2 size={16} className="inline mr-2" />Company</label>
                <select value={selectedCompany} onChange={e => { setSelectedCompany(e.target.value); setSelectedProject(''); }}
                  className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2"
                  style={{ borderColor: themeColors.border, '--tw-ring-color': themeColors.primary }}>
                  <option value="">Select Company</option>
                  {companies.map(c => <option key={c.company_id} value={c.company_id}>{c.company_name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Project</label>
                <select value={selectedProject} onChange={e => setSelectedProject(e.target.value)} disabled={!selectedCompany}
                  className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 disabled:bg-gray-100"
                  style={{ borderColor: themeColors.border, '--tw-ring-color': themeColors.primary }}>
                  <option value="">Select Project</option>
                  {companies.find(c => c.company_id === selectedCompany)?.projects?.map(p => (
                    <option key={p.pd_id} value={p.pd_id}>{p.project_name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2"><Calendar size={16} className="inline mr-2" />Month</label>
                <input type="month" value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2"
                  style={{ borderColor: themeColors.border, '--tw-ring-color': themeColors.primary }} />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 flex items-center gap-2"><Banknote className="w-4 h-4" />Bank Account *</label>
                <select value={selectedBank} onChange={e => setSelectedBank(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2"
                  style={{ borderColor: selectedBank ? themeColors.primary : '#ef4444', '--tw-ring-color': themeColors.primary }}>
                  <option value="">-- Select Bank --</option>
                  {banks.map(b => <option key={b.value} value={b.value}>{b.label}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Search */}
          {selectedBank && (
            <div className="mb-6 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input type="text" placeholder="Search employee..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-lg border bg-gray-50 focus:outline-none focus:ring-2"
                style={{ borderColor: themeColors.border, '--tw-ring-color': themeColors.primary }} />
            </div>
          )}

          {/* Table */}
          <div className="bg-white rounded-lg border overflow-hidden" style={{ borderColor: themeColors.border }}>
            {loading ? (
              <div className="p-20 text-center">Loading salary data...</div>
            ) : !selectedBank ? (
              <div className="p-12 text-center text-gray-500">Please select a Bank Account</div>
            ) : filtered.length === 0 ? (
              <div className="p-12 text-center text-gray-500">No employees found</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead style={{ backgroundColor: themeColors.lightBg }}>
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Employee</th>
                      <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider">Approved</th>
                      <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider">Paid</th>
                      <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider">Balance</th>
                      <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filtered.map(emp => (
                      <tr key={emp.emp_id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium">{emp.full_name}</td>
                        <td className="px-6 py-4 text-right font-mono">{formatINR(emp.approved_salary)}</td>
                        <td className="px-6 py-4 text-right">
                          {editingId === emp.emp_id ? (
                            <input type="number" value={emp.total_paid} onChange={e => handlePaidChange(emp.emp_id, e.target.value)}
                              className="w-32 text-right px-3 py-2 border rounded focus:outline-none focus:ring-2"
                              style={{ borderColor: themeColors.border, '--tw-ring-color': themeColors.primary }} autoFocus />
                          ) : (
                            <span className="font-mono">{formatINR(emp.total_paid)}</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right font-mono">
                          <span className={emp.balance > 0 ? 'text-red-600 font-bold' : 'text-green-600'}>
                            {formatINR(emp.balance)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          {editingId === emp.emp_id ? (
                            <div className="flex justify-center gap-3">
                              <button onClick={() => handleSave(emp.emp_id)} className="p-2 hover:bg-green-100 rounded-lg text-green-600"><Check size={20} /></button>
                              <button onClick={() => handleCancel(emp.emp_id)} className="p-2 hover:bg-red-100 rounded-lg text-red-600"><X size={20} /></button>
                            </div>
                          ) : (
                            <button onClick={() => setEditingId(emp.emp_id)} className="p-2 hover:bg-gray-100 rounded-lg text-gray-600"><Edit size={18} /></button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-gradient-to-r from-gray-100 to-gray-50 font-bold text-sm" style={{ borderTop: `3px solid ${themeColors.primary}` }}>
                      <td className="px-6 py-5">GRAND TOTAL</td>
                      <td className="px-6 py-5 text-right font-mono">{formatINR(totals.approved)}</td>
                      <td className="px-6 py-5 text-right font-mono">{formatINR(totals.paid)}</td>
                      <td className="px-6 py-5 text-right font-mono">
                        <span className={totals.balance > 0 ? 'text-red-600' : 'text-green-600'}>{formatINR(totals.balance)}</span>
                      </td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalaryPayablesModal;