const db = require('../config/db');

exports.test = async (req, res) => {
  try {
    res.status(200).json({
      status: 'success',
      message: 'Finance Test API is working',
      data: null
    });
  } catch (error) {
    console.error('Error in test:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Create a new creditor client
exports.createCreditorsClient = async (req, res) => {
  try {
    const { client_name, created_by } = req.body;
    if (!client_name) {
      return res.status(400).json({
        status: 'error',
        message: 'client_name is required'
      });
    }

    const effectiveCreatedBy = created_by || null;

    const sql = 'INSERT INTO finance_creditors_client (client_name, created_by) VALUES (?, ?)';
    const [result] = await db.query(sql, [client_name, effectiveCreatedBy]);

    res.status(201).json({
      status: 'success',
      message: 'Creditor client created successfully',
      data: { id: result.insertId, client_name }
    });
  } catch (error) {
    console.error('Error in createCreditorsClient:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Get all existing invoice numbers
exports.getExistingInvoiceNumbers = async (req, res) => {
  try {
    const sql = 'SELECT DISTINCT inv_number FROM finance_creditors WHERE inv_number IS NOT NULL AND inv_number != "" ORDER BY inv_number';
    const [rows] = await db.query(sql);

    const invoiceNumbers = rows.map(row => row.inv_number);

    res.status(200).json({
      status: 'success',
      data: invoiceNumbers
    });
  } catch (error) {
    console.error('Error fetching invoice numbers:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch invoice numbers'
    });
  }
};

// View all creditor clients
exports.viewCreditorsClient = async (req, res) => {
  try {
    const sql = 'SELECT id, client_name, created_at, created_by, updated_at, updated_by FROM finance_creditors_client ORDER BY created_at DESC';
    const [rows] = await db.query(sql);

    res.status(200).json({
      status: 'success',
      message: 'Creditor clients retrieved successfully',
      data: rows
    });
  } catch (error) {
    console.error('Error in viewCreditorsClient:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Update a creditor client
exports.updateCreditorsClient = async (req, res) => {
  try {
    const { id } = req.params;
    const { client_name, updated_by } = req.body;
    if (!client_name || !updated_by) {
      return res.status(400).json({
        status: 'error',
        message: 'client_name and updated_by are required'
      });
    }

    const updateSql = 'UPDATE finance_creditors_client SET client_name = ?, updated_by = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
    const [result] = await db.query(updateSql, [client_name, updated_by, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Creditor client not found'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Creditor client updated successfully',
      data: { id, client_name }
    });
  } catch (error) {
    console.error('Error in updateCreditorsClient:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Delete a creditor client
exports.deleteCreditorsClient = async (req, res) => {
  try {
    const { id } = req.params;

    const deleteSql = 'DELETE FROM finance_creditors_client WHERE id = ?';
    const [result] = await db.query(deleteSql, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Creditor client not found'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Creditor client deleted successfully',
      data: { id }
    });
  } catch (error) {
    console.error('Error in deleteCreditorsClient:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      error: error.message
    });
  }
};


exports.createCreditors = async (req, res) => {
  try {
    const {
      client_id,
      finance_bank_id,        // ← NEW
      po_date,
      po_sent_through,
      inv_number,
      bill_date,
      pdc_date,
      item_code,
      qty,
      rate,
      sale_amount,
      gst_amount,
      total_payment_due,
      amount_paid,
      balance_amount,
      date_of_payment,
      due_date,
      remarks,
      is_gst,
      created_by
    } = req.body;

    if (!client_id || !created_by) {
      return res.status(400).json({
        status: 'error',
        message: 'client_id and created_by are required'
      });
    }

    const formattedPoDate = formatDate(po_date);
    const formattedBillDate = formatDate(bill_date);
    const formattedPdcDate = formatDate(pdc_date);
    const formattedDateOfPayment = formatDate(date_of_payment);
    const formattedDueDate = formatDate(due_date);

    const sql = `
      INSERT INTO finance_creditors (
        client_id, finance_bank_id, po_date, po_sent_through, inv_number, bill_date, pdc_date,
        item_code, qty, rate, sale_amount, gst_amount, total_payment_due,
        amount_paid, balance_amount, date_of_payment, due_date, remarks,
        is_gst, created_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
      client_id,
      finance_bank_id || null,                    // ← NEW: allow null
      formattedPoDate,
      po_sent_through || null,
      inv_number || null,
      formattedBillDate,
      formattedPdcDate,
      item_code || null,
      qty || null,
      rate || null,
      sale_amount || null,
      gst_amount || null,
      total_payment_due || null,
      amount_paid || null,
      balance_amount || null,
      formattedDateOfPayment,
      formattedDueDate,
      remarks || null,
      is_gst ?? null,
      created_by
    ];

    const [result] = await db.query(sql, params);

    res.status(201).json({
      status: 'success',
      message: 'Creditor created successfully',
      data: { id: result.insertId }
    });
  } catch (error) {
    console.error('Error in createCreditors:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      error: error.message
    });
  }
};
// Get creditor by ID
exports.getCreditorById = async (req, res) => {
  try {
    const { id } = req.params;
    const sql = `
      SELECT 
        fc.*,
        fcc.client_name
      FROM finance_creditors fc
      LEFT JOIN finance_creditors_client fcc ON fc.client_id = fcc.id
      WHERE fc.id = ?
    `;
    const [rows] = await db.query(sql, [id]);

    if (rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Creditor not found'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Creditor retrieved successfully',
      data: rows[0]
    });
  } catch (error) {
    console.error('Error in getCreditorById:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      error: error.message
    });
  }
};

// View creditors with optional filters
exports.viewCreditors = async (req, res) => {
  try {
    let sql = `
      SELECT 
        fc.*,
        fcc.client_name
      FROM finance_creditors fc
      LEFT JOIN finance_creditors_client fcc ON fc.client_id = fcc.id
      WHERE 1=1
    `;
    const params = [];

    if (req.query.client_id) {
      sql += ' AND fc.client_id = ?';
      params.push(req.query.client_id);
    }

    if (req.query.is_gst !== undefined) {
      sql += ' AND fc.is_gst = ?';
      params.push(req.query.is_gst);
    }

    sql += ' ORDER BY fc.created_at DESC';
    const [rows] = await db.query(sql, params);

    res.status(200).json({
      status: 'success',
      message: 'Creditors retrieved successfully',
      data: rows
    });
  } catch (error) {
    console.error('Error in viewCreditors:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      error: error.message
    });
  }
};


// Helper function to format date strings to YYYY-MM-DD
const formatDate = (dateStr) => {
  if (!dateStr) return null;
  if (typeof dateStr === 'string' && dateStr.includes('T')) {
    return dateStr.split('T')[0];
  }
  return dateStr;
};

exports.updateCreditors = async (req, res) => {
  try {
    const {
      id,
      finance_bank_id,        // ← NEW: allow update
      po_date,
      po_sent_through,
      inv_number,
      bill_date,
      pdc_date,
      item_code,
      qty,
      rate,
      sale_amount,
      gst_amount,
      total_payment_due,
      amount_paid,
      balance_amount,
      date_of_payment,
      due_date,
      remarks,
      is_gst,
      updated_by
    } = req.body;

    if (!id || !updated_by) {
      return res.status(400).json({
        status: 'error',
        message: 'id and updated_by are required'
      });
    }

    // Fetch current record
    const [currentRows] = await db.query('SELECT * FROM finance_creditors WHERE id = ?', [id]);
    if (currentRows.length === 0) {
      return res.status(404).json({ status: 'error', message: 'Creditor not found' });
    }
    const current = currentRows[0];

    // Save to history (including finance_bank_id)
    const historySql = `
      INSERT INTO finance_creditors_edit_history (
        finance_creditors_id, client_id, finance_bank_id, po_date, po_sent_through,
        inv_number, bill_date, pdc_date, item_code, qty, rate, sale_amount,
        gst_amount, total_payment_due, amount_paid, balance_amount, date_of_payment,
        due_date, remarks, is_gst, created_at, created_by, updated_at, updated_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await db.query(historySql, [
      id, current.client_id, current.finance_bank_id, current.po_date, current.po_sent_through,
      current.inv_number, current.bill_date, current.pdc_date, current.item_code,
      current.qty, current.rate, current.sale_amount, current.gst_amount,
      current.total_payment_due, current.amount_paid, current.balance_amount,
      current.date_of_payment, current.due_date, current.remarks, current.is_gst,
      current.created_at, current.created_by, current.updated_at, current.updated_by
    ]);

    // Format dates
    const formattedPoDate = formatDate(po_date);
    const formattedBillDate = formatDate(bill_date);
    const formattedPdcDate = formatDate(pdc_date);
    const formattedDateOfPayment = formatDate(date_of_payment);
    const formattedDueDate = formatDate(due_date);

    // Update main record
    const updateSql = `
      UPDATE finance_creditors SET
        finance_bank_id = ?,
        po_date = ?, po_sent_through = ?, inv_number = ?,
        bill_date = ?, pdc_date = ?, item_code = ?, qty = ?, rate = ?,
        sale_amount = ?, gst_amount = ?, total_payment_due = ?,
        amount_paid = ?, balance_amount = ?, date_of_payment = ?,
        due_date = ?, remarks = ?, is_gst = ?, updated_by = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;

    const params = [
      finance_bank_id || null,
      formattedPoDate, po_sent_through || null, inv_number || null,
      formattedBillDate, formattedPdcDate, item_code || null, qty || null, rate || null,
      sale_amount || null, gst_amount || null, total_payment_due || null,
      amount_paid || null, balance_amount || null, formattedDateOfPayment,
      formattedDueDate, remarks || null, is_gst ?? null, updated_by, id
    ];

    const [result] = await db.query(updateSql, params);

    if (result.affectedRows === 0) {
      return res.status(404).json({ status: 'error', message: 'Creditor not found' });
    }

    res.status(200).json({
      status: 'success',
      message: 'Creditor updated successfully (history saved)',
      data: { id }
    });
  } catch (error) {
    console.error('Error in updateCreditors:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      error: error.message
    });
  }
};
// Delete a creditor
exports.deleteCreditors = async (req, res) => {
  try {
    const { id } = req.params;

    const deleteSql = 'DELETE FROM finance_creditors WHERE id = ?';
    const [result] = await db.query(deleteSql, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Creditor not found'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Creditor deleted successfully',
      data: { id }
    });
  } catch (error) {
    console.error('Error in deleteCreditors:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Fetch overall creditors balance
exports.fetchOverallCreditorsBalance = async (req, res) => {
  try {
    const sql = `
      SELECT 
        COALESCE(SUM(CASE WHEN is_gst = 1 THEN balance_amount ELSE 0 END), 0) as gst_creditors_balance,
        COALESCE(SUM(CASE WHEN is_gst = 0 THEN balance_amount ELSE 0 END), 0) as other_creditors_balance,
        COALESCE(SUM(balance_amount), 0) as total_balance
      FROM finance_creditors
    `;
    const [rows] = await db.query(sql);

    res.status(200).json({
      status: 'success',
      message: 'Overall creditors balance retrieved successfully',
      data: {
        gst_creditors_balance: parseFloat(rows[0].gst_creditors_balance) || 0,
        other_creditors_balance: parseFloat(rows[0].other_creditors_balance) || 0,
        total_balance: parseFloat(rows[0].total_balance) || 0
      }
    });
  } catch (error) {
    console.error('Error in fetchOverallCreditorsBalance:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Updated controller function in financeController.js for getCompaniesWithProjects
exports.getCompaniesWithProjects = async (req, res) => {
  try {
    const sql = `
      SELECT 
        c.company_id,
        c.company_name,
        pd.pd_id as pd_id,
        pd.project_name
      FROM company c
      LEFT JOIN project_details pd ON c.company_id = pd.company_id
      ORDER BY c.company_id, pd.project_name
    `;
    const [rows] = await db.query(sql);

    // Group by company to include multiple projects with pd_id
    const grouped = rows.reduce((acc, row) => {
      if (!acc[row.company_id]) {
        acc[row.company_id] = {
          company_id: row.company_id,
          company_name: row.company_name,
          projects: []
        };
      }
      if (row.project_name && row.pd_id) {
        acc[row.company_id].projects.push({
          pd_id: row.pd_id,
          project_name: row.project_name
        });
      }
      return acc;
    }, {});

    const data = Object.values(grouped);

    res.status(200).json({
      status: 'success',
      message: 'Companies with projects retrieved successfully',
      data: data
    });
  } catch (error) {
    console.error('Error in getCompaniesWithProjects:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Updated controller function in financeController.js
exports.getSiteInchargesByPdId = async (req, res) => {
  try {
    const { pd_id } = req.query;
    if (!pd_id) {
      return res.status(400).json({
        status: 'error',
        message: 'pd_id is required'
      });
    }

    const sql = `
      SELECT 
        sia.id, sia.pd_id, sia.site_id, sia.desc_id, sia.emp_id, em.full_name,
        sia.from_date, sia.to_date, sia.created_by, sia.created_at, 
        sia.updated_by, sia.updated_at, em.approved_salary
      FROM siteincharge_assign sia
      LEFT JOIN employee_master em ON sia.emp_id = em.emp_id
      WHERE sia.pd_id = ?
      ORDER BY sia.created_at DESC
    `;
    const [rows] = await db.query(sql, [pd_id]);

    res.status(200).json({
      status: 'success',
      message: 'Site incharges retrieved successfully',
      data: rows
    });
  } catch (error) {
    console.error('Error in getSiteInchargesByPdId:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Updated controller function in financeController.js (replaces createSiteInchargeAttendance)
exports.upsertSiteInchargeAttendance = async (req, res) => {
  try {
    const { attendances, created_by } = req.body;

    if (!Array.isArray(attendances) || attendances.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'attendances array is required and must not be empty'
      });
    }

    if (!created_by) {
      return res.status(400).json({
        status: 'error',
        message: 'created_by is required'
      });
    }

    const results = [];
    for (const att of attendances) {
      const { siteincharge_assign_id, shift, entry_date, remarks } = att;

      if (!siteincharge_assign_id || !shift || !entry_date) {
        continue; // Skip invalid entries
      }

      const formattedEntryDate = formatDate(entry_date);

      // Check if entry already exists for this siteincharge_assign_id and entry_date
      const checkSql = `
        SELECT id FROM finance_siteincharge_attendance 
        WHERE siteincharge_assign_id = ? AND entry_date = ?
      `;
      const [existingRows] = await db.query(checkSql, [siteincharge_assign_id, formattedEntryDate]);

      if (existingRows.length > 0) {
        // Update existing (log to history first)
        const existingId = existingRows[0].id;

        // Fetch current record for history
        const fetchSql = 'SELECT * FROM finance_siteincharge_attendance WHERE id = ?';
        const [currentRows] = await db.query(fetchSql, [existingId]);
        const currentRecord = currentRows[0];

        // Insert into history
        const historySql = `
          INSERT INTO finance_siteincharge_attendance_history (
            finance_siteincharge_attendance_id, siteincharge_assign_id, entry_date, 
            shift, remarks, created_by, updated_by
          ) VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        const historyParams = [
          existingId, siteincharge_assign_id, formattedEntryDate, currentRecord.shift, 
          currentRecord.remarks, currentRecord.created_by, created_by
        ];
        await db.query(historySql, historyParams);

        // Update main record
        const updateSql = `
          UPDATE finance_siteincharge_attendance 
          SET shift = ?, remarks = ?, updated_by = ?, updated_at = CURRENT_TIMESTAMP 
          WHERE id = ?
        `;
        const updateParams = [shift, remarks || null, created_by, existingId];
        const [updateResult] = await db.query(updateSql, updateParams);

        if (updateResult.affectedRows > 0) {
          results.push({ id: existingId, siteincharge_assign_id, action: 'updated' });
        }
      } else {
        // Create new
        const sql = `
          INSERT INTO finance_siteincharge_attendance (
            siteincharge_assign_id, shift, created_by, entry_date, remarks
          ) VALUES (?, ?, ?, ?, ?)
        `;
        const params = [siteincharge_assign_id, shift, created_by, formattedEntryDate, remarks || null];
        const [result] = await db.query(sql, params);

        results.push({ id: result.insertId, siteincharge_assign_id, action: 'created' });
      }
    }

    if (results.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'No valid attendance entries to process'
      });
    }

    res.status(201).json({
      status: 'success',
      message: 'Site incharge attendance processed successfully',
      data: results
    });
  } catch (error) {
    console.error('Error in upsertSiteInchargeAttendance:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      error: error.message
    });
  }
};

// New controller function to fetch existing attendance for a date (for frontend prefill)
exports.getSiteInchargeAttendanceByDate = async (req, res) => {
  try {
    const { pd_id, entry_date } = req.query;
    if (!pd_id || !entry_date) {
      return res.status(400).json({
        status: 'error',
        message: 'pd_id and entry_date are required'
      });
    }

    const formattedEntryDate = formatDate(entry_date);

    const sql = `
      SELECT 
        fsa.id, fsa.siteincharge_assign_id, fsa.shift, fsa.remarks, fsa.entry_date
      FROM finance_siteincharge_attendance fsa
      INNER JOIN siteincharge_assign sia ON fsa.siteincharge_assign_id = sia.id
      WHERE sia.pd_id = ? AND fsa.entry_date = ?
      ORDER BY sia.created_at DESC
    `;
    const [rows] = await db.query(sql, [pd_id, formattedEntryDate]);

    res.status(200).json({
      status: 'success',
      message: 'Attendance retrieved successfully',
      data: rows
    });
  } catch (error) {
    console.error('Error in getSiteInchargeAttendanceByDate:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      error: error.message
    });
  }
};

// New controller function in financeController.js
exports.getSiteInchargeAttendanceHistory = async (req, res) => {
  try {
    const { siteincharge_assign_id, entry_date } = req.query;
    if (!siteincharge_assign_id || !entry_date) {
      return res.status(400).json({
        status: 'error',
        message: 'siteincharge_assign_id and entry_date are required'
      });
    }

    const formattedEntryDate = formatDate(entry_date);

    // Find current attendance record
    const checkSql = `
      SELECT id, shift, remarks, created_by, updated_by, created_at, updated_at
      FROM finance_siteincharge_attendance 
      WHERE siteincharge_assign_id = ? AND entry_date = ?
    `;
    const [currentRows] = await db.query(checkSql, [siteincharge_assign_id, formattedEntryDate]);

    let history = [];
    let current = null;

    if (currentRows.length > 0) {
      const attendanceId = currentRows[0].id;
      current = {
        type: 'current',
        shift: currentRows[0].shift,
        remarks: currentRows[0].remarks,
        by: currentRows[0].updated_by || currentRows[0].created_by,
        date: currentRows[0].updated_at || currentRows[0].created_at
      };

      // Fetch history
      const historySql = `
        SELECT shift, remarks, created_by, updated_by, created_at, updated_at
        FROM finance_siteincharge_attendance_history 
        WHERE finance_siteincharge_attendance_id = ?
        ORDER BY created_at DESC
      `;
      const [historyRows] = await db.query(historySql, [attendanceId]);

      history = historyRows.map(row => ({
        type: 'history',
        shift: row.shift,
        remarks: row.remarks,
        by: row.updated_by,
        date: row.updated_at || row.created_at
      }));
    }

    const allVersions = [...history, current].filter(Boolean); // Filter out null if no current

    res.status(200).json({
      status: 'success',
      message: 'Attendance history retrieved successfully',
      data: allVersions
    });
  } catch (error) {
    console.error('Error in getSiteInchargeAttendanceHistory:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      error: error.message
    });
  }
};


// New controller function in financeController.js
exports.getSiteInchargeSalarySummaryByAttendance = async (req, res) => {
  try {
    const { pd_id, month } = req.query;
    if (!pd_id || !month) {
      return res.status(400).json({
        status: 'error',
        message: 'pd_id and month (YYYY-MM) are required'
      });
    }

    const sql = `
      SELECT 
        em.emp_id,
        em.full_name,
        em.approved_salary,
        COALESCE(SUM(fsa.shift), 0) as total_shifts
      FROM employee_master em
      INNER JOIN siteincharge_assign sia ON em.emp_id = sia.emp_id
      LEFT JOIN finance_siteincharge_attendance fsa ON sia.id = fsa.siteincharge_assign_id 
        AND fsa.entry_date LIKE ?
      WHERE sia.pd_id = ?
      GROUP BY em.emp_id, em.full_name, em.approved_salary
      ORDER BY em.full_name
    `;
    const [rows] = await db.query(sql, [`${month}%`, pd_id]);

    const summaryData = rows.map(row => {
      const monthlySalary = parseFloat(row.approved_salary) || 0;
      const totalShifts = parseFloat(row.total_shifts) || 0;
      const dailyRate = monthlySalary / 30;
      const totalPaid = dailyRate * totalShifts;
      const balance = monthlySalary - totalPaid;

      return {
        emp_id: row.emp_id,
        full_name: row.full_name,
        approved_salary: monthlySalary,
        total_shifts: totalShifts,
        total_paid: parseFloat(totalPaid.toFixed(2)),
        balance: parseFloat(balance.toFixed(2))
      };
    });

    // Calculate overall totals
    const overallApproved = summaryData.reduce((sum, item) => sum + item.approved_salary, 0);
    const overallShifts = summaryData.reduce((sum, item) => sum + item.total_shifts, 0);
    const overallPaid = summaryData.reduce((sum, item) => sum + item.total_paid, 0);
    const overallBalance = summaryData.reduce((sum, item) => sum + item.balance, 0);

    const overall = {
      overall_approved_salary: parseFloat(overallApproved.toFixed(2)),
      overall_total_shifts: parseFloat(overallShifts.toFixed(2)),
      overall_total_paid: parseFloat(overallPaid.toFixed(2)),
      overall_balance: parseFloat(overallBalance.toFixed(2))
    };

    const finalData = [overall, ...summaryData];

    res.status(200).json({
      status: 'success',
      message: 'Site incharge salary summary retrieved successfully',
      data: finalData
    });
  } catch (error) {
    console.error('Error in getSiteInchargeSalarySummary:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      error: error.message
    });
  }
};

exports.getSalaryPayablesSummary = async (req, res) => {
  try {
    const { pd_id, month, bank_id } = req.query;

    if (!pd_id || !month || !bank_id) {
      return res.status(400).json({
        status: 'error',
        message: 'pd_id, month, and bank_id are required'
      });
    }

    // Accept both YYYYMM and YYYY-MM
    let cleanMonth = month.toString().replace('-', '');
    if (cleanMonth.length !== 6 || isNaN(cleanMonth)) {
      return res.status(400).json({ status: 'error', message: 'Invalid month format. Use YYYYMM or YYYY-MM' });
    }

    const year = cleanMonth.substring(0, 4);
    const mon = cleanMonth.substring(4, 6);

    // SAFEST WAY: Use LAST_DAY() function of MySQL
    const sql = `
      SELECT 
        em.emp_id,
        em.full_name,
        em.approved_salary,
        COALESCE(SUM(fsp.paid_amount), 0) AS total_paid
      FROM employee_master em
      INNER JOIN siteincharge_assign sia ON em.emp_id = sia.emp_id
      LEFT JOIN finance_salary_payable fsp 
        ON em.emp_id = fsp.emp_id 
        AND sia.pd_id = fsp.pd_id
        AND fsp.finance_bank_id = ?
        AND fsp.entry_date >= ?
        AND fsp.entry_date <= LAST_DAY(?)
      WHERE sia.pd_id = ?
      GROUP BY em.emp_id, em.full_name, em.approved_salary
      ORDER BY em.full_name ASC
    `;

    const startDate = `${year}-${mon}-01`;  // e.g., '2025-11-01'

    const [rows] = await db.query(sql, [bank_id, startDate, startDate, pd_id]);

    if (rows.length === 0) {
      return res.json({
        status: 'success',
        data: [{
          overall_approved_salary: 0,
          overall_total_paid: 0,
          overall_balance: 0
        }]
      });
    }

    const employees = rows.map(row => {
      const approved = parseFloat(row.approved_salary) || 0;
      const paid = parseFloat(row.total_paid) || 0;
      const balance = approved - paid;

      return {
        emp_id: row.emp_id,
        full_name: row.full_name,
        approved_salary: parseFloat(approved.toFixed(2)),
        total_paid: parseFloat(paid.toFixed(2)),
        balance: parseFloat(balance.toFixed(2))
      };
    });

    const overall = {
      overall_approved_salary: parseFloat(employees.reduce((s, e) => s + e.approved_salary, 0).toFixed(2)),
      overall_total_paid: parseFloat(employees.reduce((s, e) => s + e.total_paid, 0).toFixed(2)),
      overall_balance: parseFloat(employees.reduce((s, e) => s + e.balance, 0).toFixed(2))
    };

    res.json({
      status: 'success',
      message: 'Salary summary loaded successfully',
      data: [overall, ...employees]
    });

  } catch (error) {
    console.error('Error in getSalaryPayablesSummary:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error',
      error: error.message
    });
  }
};


// Update/upsert salary payable (manual paid_amount entry; calculates balance; logs previous to history on update)
exports.updateSalaryPayable = async (req, res) => {
  try {
    const { 
      emp_id, pd_id, entry_date, paid_amount, 
      finance_bank_id, created_by = 'admin', updated_by = 'admin' 
    } = req.body;

    if (!emp_id || !pd_id || !entry_date || paid_amount === undefined || !finance_bank_id) {
      return res.status(400).json({
        status: 'error',
        message: 'emp_id, pd_id, entry_date, paid_amount, and finance_bank_id are required'
      });
    }

    const [emRows] = await db.query('SELECT approved_salary FROM employee_master WHERE emp_id = ?', [emp_id]);
    if (emRows.length === 0) {
      return res.status(404).json({ status: 'error', message: 'Employee not found' });
    }
    const approvedSalary = parseFloat(emRows[0].approved_salary) || 0;
    const balance = approvedSalary - parseFloat(paid_amount);

    const [existingRows] = await db.query(
      'SELECT * FROM finance_salary_payable WHERE emp_id = ? AND pd_id = ? AND entry_date = ?',
      [emp_id, pd_id, entry_date]
    );

    if (existingRows.length > 0) {
      const existing = existingRows[0];
      // Log to history
      await db.query(
        'INSERT INTO finance_salary_payable_edit_history SET ?',
        {
          finance_salary_payable_id: existing.id,
          emp_id: existing.emp_id,
          pd_id: existing.pd_id,
          entry_date: existing.entry_date,
          paid_amount: existing.paid_amount,
          balance: existing.balance,
          finance_bank_id: existing.finance_bank_id,
          created_by: updated_by
        }
      );

      // Update main record
      await db.query(
        `UPDATE finance_salary_payable 
         SET paid_amount = ?, balance = ?, finance_bank_id = ?, updated_at = NOW(), updated_by = ? 
         WHERE id = ?`,
        [paid_amount, balance, finance_bank_id, updated_by, existing.id]
      );
    } else {
      // Insert new
      await db.query(
        `INSERT INTO finance_salary_payable 
         (emp_id, pd_id, entry_date, paid_amount, balance, finance_bank_id, created_by) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [emp_id, pd_id, entry_date, paid_amount, balance, finance_bank_id, created_by]
      );
    }

    res.status(200).json({
      status: 'success',
      message: 'Salary payable updated successfully'
    });
  } catch (error) {
    console.error('Error in updateSalaryPayable:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

// Get cost categories for dropdown
exports.getCostCategories = async (req, res) => {
  try {
    const sql = 'SELECT id, category_name FROM finance_cost_category ORDER BY category_name';
    const [rows] = await db.query(sql);
    res.status(200).json({
      status: 'success',
      data: rows
    });
  } catch (error) {
    console.error('Error in getCostCategories:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      error: error.message
    });
  }
};

// CREATE
exports.createTransportPayable = async (req, res) => {
  try {
    const {
      pd_id, cost_category_id, dc_number, item_name, description,
      sale_amount, total_payment_due, date_of_payment, paid_amount, finance_bank_id
    } = req.body;

    if (!pd_id || !cost_category_id || !item_name || !date_of_payment || !finance_bank_id) {
      return res.status(400).json({
        status: 'error',
        message: 'pd_id, cost_category_id, item_name, date_of_payment, finance_bank_id are required'
      });
    }

    const parsedDate = date_of_payment.split('T')[0];
    const sale = parseFloat(sale_amount) || 0;
    const total = parseFloat(total_payment_due) || sale;
    const paid = parseFloat(paid_amount) || 0;
    const balance = total - paid;

    const sql = `
      INSERT INTO finance_transport_payable 
      (pd_id, cost_category_id, dc_number, item_name, description, sale_amount, 
       total_payment_due, date_of_payment, paid_amount, balance_amount, finance_bank_id, created_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'admin')
    `;

    const [result] = await db.query(sql, [
      pd_id, cost_category_id, dc_number || null, item_name, description || null,
      sale, total, parsedDate, paid, balance, finance_bank_id
    ]);

    res.status(201).json({
      status: 'success',
      message: 'Transport payable created',
      data: { id: result.insertId }
    });

  } catch (error) {
    console.error('Create Error:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};


// Get all existing distinct DC numbers
exports.getExistingMaterialDcNo = async (req, res) => {
  try {
    const sql = `
      SELECT DISTINCT dc_no 
      FROM material_dispatch 
      WHERE dc_no IS NOT NULL AND dc_no != '' 
      ORDER BY dc_no DESC
    `;
    const [rows] = await db.query(sql);

    const dcNumbers = rows.map(row => row.dc_no);

    res.status(200).json({
      status: 'success',
      data: dcNumbers
    });
  } catch (error) {
    console.error('Error fetching DC numbers:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch DC numbers'
    });
  }
};

// UPDATE - with history logging
exports.updateTransportPayable = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      cost_category_id, dc_number, item_name, description,
      sale_amount, total_payment_due, date_of_payment, paid_amount, finance_bank_id
    } = req.body;

    if (!cost_category_id || !item_name || !date_of_payment || !finance_bank_id) {
      return res.status(400).json({ status: 'error', message: 'Required fields missing' });
    }

    // Fetch current record
    const [existing] = await db.query('SELECT * FROM finance_transport_payable WHERE id = ?', [id]);
    if (existing.length === 0) return res.status(404).json({ status: 'error', message: 'Not found' });

    // Save to history
    const oldData = existing[0];
    await db.query(
      `INSERT INTO finance_transport_payable_edit_history 
       (finance_transport_payable_id, pd_id, cost_category_id, dc_number, item_name, description,
        sale_amount, total_payment_due, date_of_payment, paid_amount, balance_amount, finance_bank_id, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'admin')`,
      [
        id, oldData.pd_id, oldData.cost_category_id, oldData.dc_number, oldData.item_name,
        oldData.description, oldData.sale_amount, oldData.total_payment_due,
        oldData.date_of_payment, oldData.paid_amount, oldData.balance_amount,
        oldData.finance_bank_id
      ]
    );

    // Update main table
    const sale = parseFloat(sale_amount) || oldData.sale_amount;
    const total = parseFloat(total_payment_due) || sale;
    const paid = parseFloat(paid_amount) || oldData.paid_amount;
    const balance = total - paid;

    await db.query(`
      UPDATE finance_transport_payable SET
        cost_category_id=?, dc_number=?, item_name=?, description=?,
        sale_amount=?, total_payment_due=?, date_of_payment=?,
        paid_amount=?, balance_amount=?, finance_bank_id=?, updated_by='admin', updated_at=NOW()
      WHERE id=?
    `, [
      cost_category_id, dc_number || null, item_name, description || null,
      sale, total, date_of_payment.split('T')[0], paid, balance, finance_bank_id, id
    ]);

    res.json({ status: 'success', message: 'Updated successfully' });

  } catch (error) {
    console.error('Update Error:', error);
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
};

// GET with bank filter
exports.getTransportPayablesByPdId = async (req, res) => {
  try {
    const { pd_id, bank_id } = req.query;
    if (!pd_id) return res.status(400).json({ status: 'error', message: 'pd_id required' });

    let sql = `
      SELECT ftp.*, fcc.category_name, fbm.bank_name,
             COALESCE(fbm.available_balance, 0) AS available_balance
      FROM finance_transport_payable ftp
      INNER JOIN finance_cost_category fcc ON ftp.cost_category_id = fcc.id
      LEFT JOIN finance_bank_master fbm ON ftp.finance_bank_id = fbm.id
      WHERE ftp.pd_id = ?
    `;
    const params = [pd_id];

    if (bank_id) {
      sql += ` AND ftp.finance_bank_id = ?`;
      params.push(bank_id);
    }

    sql += ` ORDER BY ftp.created_at DESC`;

    const [rows] = await db.query(sql, params);

    const overall = {
      overall_sale_amount: parseFloat(rows.reduce((s, r) => s + (parseFloat(r.sale_amount) || 0), 0).toFixed(2)),
      overall_total_payment_due: parseFloat(rows.reduce((s, r) => s + (parseFloat(r.total_payment_due) || 0), 0).toFixed(2)),
      overall_paid_amount: parseFloat(rows.reduce((s, r) => s + (parseFloat(r.paid_amount) || 0), 0).toFixed(2)),
      overall_balance_amount: parseFloat(rows.reduce((s, r) => s + (parseFloat(r.balance_amount) || 0), 0).toFixed(2))
    };

    res.json({ status: 'success', data: [overall, ...rows] });

  } catch (error) {
    console.error('Get Error:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};


exports.updateTransportPayable = async (req, res) => {
  let connection;
  try {
    const { id } = req.params;
    const {
      pd_id,
      cost_category_id,
      dc_number,
      item_name,
      description,
      sale_amount,
      gst = 0,
      total_payment_due,
      date_of_payment,
      paid_amount,
      finance_bank_id,
      updated_by = 'admin' // you can pass from frontend, fallback to 'admin'
    } = req.body;

    // Validation
    if (!cost_category_id || !item_name || !date_of_payment || !finance_bank_id) {
      return res.status(400).json({
        status: 'error',
        message: 'Required fields: cost_category_id, item_name, date_of_payment, finance_bank_id'
      });
    }

    connection = await db.getConnection();
    await connection.beginTransaction();

    // 1. Get current record
    const [rows] = await connection.query(
      'SELECT * FROM finance_transport_payable WHERE id = ? FOR UPDATE',
      [id]
    );

    if (rows.length === 0) {
      await connection.rollback();
      return res.status(404).json({ status: 'error', message: 'Record not found' });
    }

    const oldRecord = rows[0];

    // 2. Insert into history table (DO NOT copy `id`!)
    await connection.query(
      `INSERT INTO finance_transport_payable_edit_history 
        (finance_transport_payable_id, pd_id, cost_category_id, dc_number, item_name, description,
         sale_amount, gst, total_payment_due, date_of_payment, paid_amount, balance_amount,
         finance_bank_id, created_at, created_by, updated_at, updated_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        oldRecord.pd_id,
        oldRecord.cost_category_id,
        oldRecord.dc_number || null,
        oldRecord.item_name,
        oldRecord.description || null,
        oldRecord.sale_amount,
        oldRecord.gst || 0,
        oldRecord.total_payment_due,
        oldRecord.date_of_payment,
        oldRecord.paid_amount,
        oldRecord.balance_amount,
        oldRecord.finance_bank_id,
        oldRecord.created_at,
        oldRecord.created_by || 'admin',
        new Date(), // updated_at for history
        oldRecord.updated_by || 'admin'
      ]
    );

    // 3. Calculate new values
    const sale = parseFloat(sale_amount) || oldRecord.sale_amount || 0;
    const gstAmount = parseFloat(gst) || oldRecord.gst || 0;
    const totalDue = parseFloat(total_payment_due) || (sale + gstAmount);
    const paid = parseFloat(paid_amount) || oldRecord.paid_amount || 0;
    const balance = totalDue - paid;

    // 4. Update main record
    await connection.query(
      `UPDATE finance_transport_payable SET
         pd_id = ?,
         cost_category_id = ?,
         dc_number = ?,
         item_name = ?,
         description = ?,
         sale_amount = ?,
         gst = ?,
         total_payment_due = ?,
         date_of_payment = ?,
         paid_amount = ?,
         balance_amount = ?,
         finance_bank_id = ?,
         updated_by = ?,
         updated_at = NOW()
       WHERE id = ?`,
      [
        pd_id || oldRecord.pd_id,
        cost_category_id,
        dc_number || null,
        item_name,
        description || null,
        sale,
        gstAmount,
        totalDue,
        date_of_payment.split('T')[0],
        paid,
        balance,
        finance_bank_id,
        updated_by,
        id
      ]
    );

    await connection.commit();

    res.json({
      status: 'success',
      message: 'Transport payable updated successfully',
      data: { id, balance_amount: balance }
    });

  } catch (error) {
    if (connection) await connection.rollback();
    console.error('Error in updateTransportPayable:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error',
      details: error.message
    });
  } finally {
    if (connection) connection.release();
  }
};
// GET - Returns bank name
exports.getTransportPayablesByPdId = async (req, res) => {
  try {
    const { pd_id } = req.query;
    if (!pd_id) return res.status(400).json({ status: 'error', message: 'pd_id required' });

    const sql = `
      SELECT 
        ftp.*, 
        fcc.category_name,
        fbm.bank_name, 
        COALESCE(fbm.available_balance, 0) AS available_balance
      FROM finance_transport_payable ftp
      INNER JOIN finance_cost_category fcc ON ftp.cost_category_id = fcc.id
      LEFT JOIN finance_bank_master fbm ON ftp.finance_bank_id = fbm.id
      WHERE ftp.pd_id = ?
      ORDER BY ftp.created_at DESC
    `;

    const [rows] = await db.query(sql, [pd_id]);

    const overall = {
      overall_sale_amount: parseFloat(rows.reduce((s, r) => s + (parseFloat(r.sale_amount) || 0), 0).toFixed(2)),
      overall_total_payment_due: parseFloat(rows.reduce((s, r) => s + (parseFloat(r.total_payment_due) || 0), 0).toFixed(2)),
      overall_paid_amount: parseFloat(rows.reduce((s, r) => s + (parseFloat(r.paid_amount) || 0), 0).toFixed(2)),
      overall_balance_amount: parseFloat(rows.reduce((s, r) => s + (parseFloat(r.balance_amount) || 0), 0).toFixed(2))
    };

    res.json({ status: 'success', data: [overall, ...rows] });

  } catch (error) {
    console.error('Error in getTransportPayablesByPdId:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Server error' });
  }
};


exports.createScaffoldingPayable = async (req, res) => {
  try {
    const { 
      finance_creditors_client_id, 
      pd_id, 
      cost_category_id, 
      period, 
      qty, 
      rate, 
      sale_amount = 0, 
      gst = 0, 
      total_payment_due,
      date_of_payment, 
      paid_amount = 0,
      finance_bank_id,
      created_by   // Must come from authenticated frontend (decoded from URL)
    } = req.body;

    // Critical: Validate created_by
    if (!created_by || isNaN(created_by) || parseInt(created_by) <= 0) {
      return res.status(401).json({
        status: 'error',
        message: 'Unauthorized: Invalid or missing user ID (created_by)'
      });
    }

    // Validate required fields
    if (!finance_creditors_client_id || !pd_id || !cost_category_id || !date_of_payment) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing required fields: client, project, category, or payment date'
      });
    }

    let parsedDate = date_of_payment;
    if (typeof date_of_payment === 'string' && date_of_payment.includes('T')) {
      parsedDate = date_of_payment.split('T')[0];
    }

    const sale = parseFloat(sale_amount) || 0;
    const g = parseFloat(gst) || 0;
    const totalDue = total_payment_due ? parseFloat(total_payment_due) : (sale + g);
    const paid = parseFloat(paid_amount) || 0;
    const balance = totalDue - paid;

    const sql = `
      INSERT INTO finance_scaffolding_payable (
        finance_creditors_client_id, pd_id, cost_category_id, period, qty, rate,
        sale_amount, gst, total_payment_due, date_of_payment, paid_amount, balance_amount,
        finance_bank_id, created_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await db.query(sql, [
      finance_creditors_client_id, pd_id, cost_category_id, period || null, qty || null, rate || null,
      sale, g, totalDue, parsedDate, paid, balance,
      finance_bank_id || null, created_by
    ]);

    res.status(201).json({
      status: 'success',
      message: 'Scaffolding payable created successfully',
      data: { id: result.insertId }
    });
  } catch (error) {
    console.error('Error creating scaffolding payable:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Server error',
      details: error.message 
    });
  }
};
// updateScaffoldingPayable
exports.updateScaffoldingPayable = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      finance_creditors_client_id, cost_category_id, period, qty, rate,
      sale_amount, gst, total_payment_due, date_of_payment, paid_amount,
      finance_bank_id,
      updated_by   // ← Real decoded user ID from frontend
    } = req.body;

    if (!updated_by) {
      return res.status(400).json({ status: 'error', message: 'User ID is required for update' });
    }

    // Fetch old record
    const [rows] = await db.query('SELECT * FROM finance_scaffolding_payable WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ status: 'error', message: 'Record not found' });
    const old = rows[0];

    // Save to history
    await db.query(`
      INSERT INTO finance_scaffolding_payable_edit_history (
        finance_scaffolding_payable_id, finance_creditors_client_id, pd_id, cost_category_id,
        period, qty, rate, sale_amount, gst, total_payment_due, date_of_payment,
        paid_amount, balance_amount, finance_bank_id, created_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      old.id, old.finance_creditors_client_id, old.pd_id, old.cost_category_id,
      old.period, old.qty, old.rate, old.sale_amount, old.gst, old.total_payment_due,
      old.date_of_payment, old.paid_amount, old.balance_amount,
      old.finance_bank_id, updated_by
    ]);

    // Calculate new values
    const sale = parseFloat(sale_amount) || old.sale_amount;
    const g = parseFloat(gst) || old.gst;
    const totalDue = total_payment_due ? parseFloat(total_payment_due) : (sale + g);
    const paid = parseFloat(paid_amount) || old.paid_amount;
    const balance = totalDue - paid;

    let parsedDate = date_of_payment || old.date_of_payment;
    if (typeof parsedDate === 'string' && parsedDate.includes('T')) {
      parsedDate = parsedDate.split('T')[0];
    }

    await db.query(`
      UPDATE finance_scaffolding_payable SET
        finance_creditors_client_id = ?, cost_category_id = ?, period = ?, qty = ?, rate = ?,
        sale_amount = ?, gst = ?, total_payment_due = ?, date_of_payment = ?,
        paid_amount = ?, balance_amount = ?, finance_bank_id = ?, updated_by = ?, updated_at = NOW()
      WHERE id = ?
    `, [
      finance_creditors_client_id || old.finance_creditors_client_id,
      cost_category_id || old.cost_category_id,
      period || old.period,
      qty || old.qty,
      rate || old.rate,
      sale, g, totalDue, parsedDate, paid, balance,
      finance_bank_id !== undefined ? finance_bank_id : old.finance_bank_id,
      updated_by, id
    ]);

    res.json({ status: 'success', message: 'Updated successfully' });
  } catch (error) {
    console.error('Error updating scaffolding payable:', error);
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
};

// Get scaffolding payables by project ID + bank filter (with bank name)
exports.getScaffoldingPayablesByPdId = async (req, res) => {
  try {
    const { pd_id, finance_bank_id } = req.query;

    if (!pd_id) {
      return res.status(400).json({
        status: 'error',
        message: 'pd_id is required'
      });
    }

    let sql = `
      SELECT 
        fsp.*,
        fcc.category_name,
        fcc2.client_name,
        fbm.bank_name
      FROM finance_scaffolding_payable fsp
      INNER JOIN finance_cost_category fcc ON fsp.cost_category_id = fcc.id
      LEFT JOIN finance_creditors_client fcc2 ON fsp.finance_creditors_client_id = fcc2.id
      LEFT JOIN finance_bank_master fbm ON fsp.finance_bank_id = fbm.id
      WHERE fsp.pd_id = ?
    `;

    const params = [pd_id];

    // Add bank filter if provided
    if (finance_bank_id && finance_bank_id !== 'null' && finance_bank_id !== 'undefined') {
      sql += ` AND fsp.finance_bank_id = ?`;
      params.push(finance_bank_id);
    } else {
      // Optional: allow showing entries with no bank too
      sql += ` AND (fsp.finance_bank_id IS NULL OR fsp.finance_bank_id = 0)`;
    }

    sql += ` ORDER BY fsp.created_at DESC`;

    const [rows] = await db.query(sql, params);

    // Calculate overall totals
    const overallSale = rows.reduce((sum, row) => sum + parseFloat(row.sale_amount || 0), 0);
    const overallTotalDue = rows.reduce((sum, row) => sum + parseFloat(row.total_payment_due || 0), 0);
    const overallPaid = rows.reduce((sum, row) => sum + parseFloat(row.paid_amount || 0), 0);
    const overallBalance = rows.reduce((sum, row) => sum + parseFloat(row.balance_amount || 0), 0);

    const overall = {
      overall_sale_amount: parseFloat(overallSale.toFixed(2)),
      overall_total_payment_due: parseFloat(overallTotalDue.toFixed(2)),
      overall_paid_amount: parseFloat(overallPaid.toFixed(2)),
      overall_balance_amount: parseFloat(overallBalance.toFixed(2)),
      bank_name: rows.length > 0 ? rows[0].bank_name || '—' : '—'
    };

    const finalData = [overall, ...rows];

    res.status(200).json({
      status: 'success',
      data: finalData
    });
  } catch (error) {
    console.error('Error in getScaffoldingPayablesByPdId:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      error: error.message
    });
  }
};


// ==================== SITE ACCOMMODATION PAYABLE ====================

// Create Site Accommodation Payable + Bank
exports.createSiteAccommodationPayable = async (req, res) => {
  try {
    const {
      pd_id,
      finance_creditors_client_id,
      finance_bank_id,        // NEW
      advance_amount,
      due_date,
      due_period,
      due_amount,
      payment,
      payment_date,
      balance_due,
      created_by
    } = req.body;

    if (!pd_id || !finance_creditors_client_id || !finance_bank_id || !due_period || !created_by) {
      return res.status(400).json({
        status: 'error',
        message: 'pd_id, client, bank, due_period and created_by are required'
      });
    }

    const formattedDueDate = formatDate(due_date);
    const formattedPaymentDate = formatDate(payment_date);

    const sql = `
      INSERT INTO finance_site_accomodation_payable (
        pd_id, finance_creditors_client_id, finance_bank_id,
        advance_amount, due_date, due_period, due_amount, payment,
        payment_date, balance_due, created_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
      pd_id, finance_creditors_client_id, finance_bank_id,
      advance_amount || null, formattedDueDate, due_period,
      due_amount || null, payment || null, formattedPaymentDate,
      balance_due || null, created_by
    ];

    const [result] = await db.query(sql, params);

    res.status(201).json({
      status: 'success',
      message: 'Site accommodation payable created successfully',
      data: { id: result.insertId }
    });
  } catch (error) {
    console.error('Error in createSiteAccommodationPayable:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error', error: error.message });
  }
};

exports.getSiteAccommodationPayablesByPdId = async (req, res) => {
  try {
    const { pd_id, finance_bank_id } = req.query;
    if (!pd_id) return res.status(400).json({ status: 'error', message: 'pd_id is required' });

    let sql = `
      SELECT 
        fsa.*,
        pd.project_name,
        fcc.client_name,
        fbm.bank_name
      FROM finance_site_accomodation_payable fsa
      LEFT JOIN project_details pd ON fsa.pd_id = pd.pd_id
      LEFT JOIN finance_creditors_client fcc ON fsa.finance_creditors_client_id = fcc.id
      LEFT JOIN finance_bank_master fbm ON fsa.finance_bank_id = fbm.id
      WHERE fsa.pd_id = ?
    `;

    const params = [pd_id];

    if (finance_bank_id && finance_bank_id !== 'null') {
      sql += ` AND fsa.finance_bank_id = ?`;
      params.push(finance_bank_id);
    }

    sql += ` ORDER BY fsa.created_at DESC`;

    const [rows] = await db.query(sql, params);

    // Overall totals
    const overall = {
      overall_advance: rows.reduce((s, r) => s + parseFloat(r.advance_amount || 0), 0).toFixed(2),
      overall_due: rows.reduce((s, r) => s + parseFloat(r.due_amount || 0), 0).toFixed(2),
      overall_payment: rows.reduce((s, r) => s + parseFloat(r.payment || 0), 0).toFixed(2),
      overall_balance: rows.reduce((s, r) => s + parseFloat(r.balance_due || 0), 0).toFixed(2),
      bank_name: rows.length > 0 ? (rows[0].bank_name || '—') : '—'
    };

    res.status(200).json({
      status: 'success',
      data: [overall, ...rows]
    });
  } catch (error) {
    console.error('Error in getSiteAccommodationPayablesByPdId:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error', error: error.message });
  }
};

// Update with Bank + History
exports.updateSiteAccommodationPayable = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      finance_bank_id,
      advance_amount, due_date, due_period, due_amount,
      payment, payment_date, balance_due, updated_by
    } = req.body;

    if (!due_period || !updated_by) {
      return res.status(400).json({ status: 'error', message: 'due_period and updated_by are required' });
    }

    const [current] = await db.query('SELECT * FROM finance_site_accomodation_payable WHERE id = ?', [id]);
    if (current.length === 0) return res.status(404).json({ status: 'error', message: 'Record not found' });

    // Save to history (include bank)
    const historySql = `
      INSERT INTO finance_site_accomodation_payable_history (
        finance_site_accomodation_payable_id, pd_id, finance_creditors_client_id, finance_bank_id,
        advance_amount, due_date, due_period, due_amount, payment, payment_date,
        balance_due, created_at, created_by, updated_at, updated_by, changed_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    await db.query(historySql, [
      id, current[0].pd_id, current[0].finance_creditors_client_id, current[0].finance_bank_id,
      current[0].advance_amount, current[0].due_date, current[0].due_period,
      current[0].due_amount, current[0].payment, current[0].payment_date,
      current[0].balance_due, current[0].created_at, current[0].created_by,
      current[0].updated_at, current[0].updated_by, updated_by
    ]);

    const formattedDueDate = formatDate(due_date);
    const formattedPaymentDate = formatDate(payment_date);

    const updateSql = `
      UPDATE finance_site_accomodation_payable SET
        finance_bank_id = ?, advance_amount = ?, due_date = ?, due_period = ?, 
        due_amount = ?, payment = ?, payment_date = ?, balance_due = ?, 
        updated_by = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;

    await db.query(updateSql, [
      finance_bank_id || null, advance_amount || null, formattedDueDate, due_period,
      due_amount || null, payment || null, formattedPaymentDate, balance_due || null,
      updated_by, id
    ]);

    res.status(200).json({
      status: 'success',
      message: 'Updated successfully (history saved)'
    });
  } catch (error) {
    console.error('Error in updateSiteAccommodationPayable:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error', error: error.message });
  }
};



// ==================== COMMISSION PAYABLE ====================
// Get all marketing persons for dropdown
exports.getMarketingPersons = async (req, res) => {
  try {
    const sql = 'SELECT id, person_name FROM finance_marketing_persons ORDER BY person_name';
    const [rows] = await db.query(sql);

    res.status(200).json({
      status: 'success',
      data: rows
    });
  } catch (error) {
    console.error('Error in getMarketingPersons:', error);
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
};

exports.createCommissionPayable = async (req, res) => {
  try {
    const {
      pd_id,
      finance_bank_id,
      cost_category_id,
      marketing_person_id,
      commission_amount_due,
      date_of_payment,
      paid_amount,
      created_by
    } = req.body;

    if (!pd_id || !finance_bank_id || !cost_category_id || !marketing_person_id) {
      return res.status(400).json({ status: 'error', message: 'Project, Bank, Category & Person required' });
    }

    const balance = (parseFloat(commission_amount_due || 0) - parseFloat(paid_amount || 0)).toFixed(2);

    const sql = `
      INSERT INTO finance_commission_payable 
      (pd_id, finance_bank_id, cost_category_id, marketing_person_id, 
       commission_amount_due, date_of_payment, paid_amount, balance_amount, created_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await db.query(sql, [
      pd_id, finance_bank_id, cost_category_id, marketing_person_id,
      commission_amount_due || null, date_of_payment || null,
      paid_amount || null, balance, created_by
    ]);

    res.status(201).json({ status: 'success', data: { id: result.insertId } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
};

exports.getCommissionPayablesByPdId = async (req, res) => {
  try {
    const { pd_id, bank_id } = req.query;
    if (!pd_id || !bank_id) {
      return res.status(400).json({ status: 'error', message: 'pd_id and bank_id required' });
    }

    const sql = `
      SELECT fcp.*, fcc.category_name, fmp.person_name, fb.bank_name
      FROM finance_commission_payable fcp
      LEFT JOIN finance_cost_category fcc ON fcp.cost_category_id = fcc.id
      LEFT JOIN finance_marketing_persons fmp ON fcp.marketing_person_id = fmp.id
      LEFT JOIN finance_bank_master fb ON fcp.finance_bank_id = fb.id
      WHERE fcp.pd_id = ? AND fcp.finance_bank_id = ?
      ORDER BY fcp.created_at DESC
    `;

    const [rows] = await db.query(sql, [pd_id, bank_id]);

    const overall = {
      overall_commission_due: rows.reduce((s, r) => s + parseFloat(r.commission_amount_due || 0), 0).toFixed(2),
      overall_paid: rows.reduce((s, r) => s + parseFloat(r.paid_amount || 0), 0).toFixed(2),
      overall_balance: rows.reduce((s, r) => s + parseFloat(r.balance_amount || 0), 0).toFixed(2)
    };

    res.json({ status: 'success', data: [overall, ...rows] });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
};

exports.updateCommissionPayable = async (req, res) => {
  const connection = await db.getConnection();
  await connection.beginTransaction();

  try {
    const { id } = req.params;
    const {
      cost_category_id,
      marketing_person_id,
      commission_amount_due,
      date_of_payment,
      paid_amount,
      finance_bank_id,
      updated_by = 'unknown'
    } = req.body;

    const formattedDate = date_of_payment ? date_of_payment.split('T')[0] : null;
    const balance_amount = (parseFloat(commission_amount_due || 0) - parseFloat(paid_amount || 0)).toFixed(2);

    // Fetch old record with lock
    const [currentRows] = await connection.query(
      `SELECT * FROM finance_commission_payable WHERE id = ? FOR UPDATE`, [id]
    );

    if (currentRows.length === 0) {
      await connection.rollback();
      return res.status(404).json({ status: 'error', message: 'Record not found' });
    }

    const oldRecord = currentRows[0];

    // Insert into history - NOW 16 columns + 16 values
    const historySql = `
      INSERT INTO finance_commission_payable_edit_history 
      (
        finance_commission_payable_id,
        finance_bank_id,
        pd_id,
        cost_category_id,
        marketing_person_id,
        commission_amount_due,
        date_of_payment,
        paid_amount,
        balance_amount,
        created_at,
        created_by,
        updated_at,
        updated_by,
        changed_at,
        changed_by
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?)
    `;

    await connection.query(historySql, [
      oldRecord.id,
      oldRecord.finance_bank_id,
      oldRecord.pd_id,
      oldRecord.cost_category_id,
      oldRecord.marketing_person_id,
      oldRecord.commission_amount_due,
      oldRecord.date_of_payment,
      oldRecord.paid_amount,
      oldRecord.balance_amount,
      oldRecord.created_at,
      oldRecord.created_by,
      oldRecord.updated_at,
      oldRecord.updated_by,
      updated_by  // ← This is changed_by
    ]);

    // Update main table
    const updateSql = `
      UPDATE finance_commission_payable SET
        finance_bank_id = ?,
        cost_category_id = ?,
        marketing_person_id = ?,
        commission_amount_due = ?,
        date_of_payment = ?,
        paid_amount = ?,
        balance_amount = ?,
        updated_by = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;

    const [updateResult] = await connection.query(updateSql, [
      finance_bank_id || null,
      cost_category_id || null,
      marketing_person_id || null,
      commission_amount_due ? parseFloat(commission_amount_due) : null,
      formattedDate,
      paid_amount ? parseFloat(paid_amount) : null,
      balance_amount,
      updated_by,
      id
    ]);

    if (updateResult.affectedRows === 0) {
      await connection.rollback();
      return res.status(500).json({ status: 'error', message: 'Failed to update record' });
    }

    await connection.commit();
    res.json({ status: 'success', message: 'Commission updated and history logged successfully' });

  } catch (error) {
    await connection.rollback();
    console.error('Error in updateCommissionPayable:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Server error', 
      details: error.message 
    });
  } finally {
    if (connection) connection.release();
  }
};


// exports.createTdsPayable = async (req, res) => {
//   try {
//     const { pd_id, month, payable, returnable, non_returnable, finance_bank_id, created_by = 'admin' } = req.body;
    
//     if (!pd_id || !month) {
//       return res.status(400).json({ status: 'error', message: 'pd_id and month required' });
//     }

//     const sql = `INSERT INTO finance_tds_payable 
//       (pd_id, month, payable, returnable, non_returnable, finance_bank_id, created_by) 
//       VALUES (?, ?, ?, ?, ?, ?, ?)`;
    
//     const [result] = await db.query(sql, [
//       pd_id, month, payable || 0, returnable || 0, non_returnable || 0, finance_bank_id || null, created_by
//     ]);

//     res.status(201).json({ status: 'success', message: 'TDS record created', data: { id: result.insertId } });
//   } catch (error) {
//     console.error('Error in createTdsPayable:', error);
//     res.status(500).json({ status: 'error', message: 'Server error' });
//   }
// };


exports.createTdsPayable = async (req, res) => {
  try {
    const { month, payable, returnable, non_returnable, finance_bank_id, created_by = 'admin' } = req.body;
    
    if (!month) {
      return res.status(400).json({ status: 'error', message: 'month required' });
    }

    const pd_id = null; // Set to null to avoid foreign key constraint

    const sql = `INSERT INTO finance_tds_payable 
      (pd_id, month, payable, returnable, non_returnable, finance_bank_id, created_by) 
      VALUES (?, ?, ?, ?, ?, ?, ?)`;
    
    const [result] = await db.query(sql, [
      pd_id, month, payable || 0, returnable || 0, non_returnable || 0, finance_bank_id || null, created_by
    ]);

    res.status(201).json({ status: 'success', message: 'TDS record created', data: { id: result.insertId } });
  } catch (error) {
    console.error('Error in createTdsPayable:', error);
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
};


// exports.getTdsPayablesByPdId = async (req, res) => {
//   try {
//     const { pd_id } = req.query;
//     if (!pd_id) return res.status(400).json({ status: 'error', message: 'pd_id required' });

//     const sql = `
//       SELECT ftp.*, pd.project_name, fbm.bank_name AS bank_name
//       FROM finance_tds_payable ftp
//       LEFT JOIN project_details pd ON ftp.pd_id = pd.pd_id
//       LEFT JOIN finance_bank_master fbm ON ftp.finance_bank_id = fbm.id
//       WHERE ftp.pd_id = ?
//       ORDER BY ftp.month DESC
//     `;
//     const [rows] = await db.query(sql, [pd_id]);

//     const overall = {
//       overall_payable: rows.reduce((s, r) => s + parseFloat(r.payable || 0), 0).toFixed(2),
//       overall_returnable: rows.reduce((s, r) => s + parseFloat(r.returnable || 0), 0).toFixed(2),
//       overall_non_returnable: rows.reduce((s, r) => s + parseFloat(r.non_returnable || 0), 0).toFixed(2)
//     };

//     res.status(200).json({ status: 'success', data: [overall, ...rows] });
//   } catch (error) {
//     console.error('Error in getTdsPayablesByPdId:', error);
//     res.status(500).json({ status: 'error', message: 'Server error' });
//   }
// };





exports.getAllTdsPayables = async (req, res) => {
  try {
    const { finance_bank_id } = req.query; // Optional filter by bank

    let sql = `
      SELECT ftp.*, pd.project_name, fbm.bank_name AS bank_name
      FROM finance_tds_payable ftp
      LEFT JOIN project_details pd ON ftp.pd_id = pd.pd_id
      LEFT JOIN finance_bank_master fbm ON ftp.finance_bank_id = fbm.id
    `;
    const params = [];

    if (finance_bank_id) {
      sql += ` WHERE ftp.finance_bank_id = ?`;
      params.push(finance_bank_id);
    }

    sql += ` ORDER BY ftp.month DESC`;

    const [rows] = await db.query(sql, params);

    const overall = {
      overall_payable: rows.reduce((s, r) => s + parseFloat(r.payable || 0), 0).toFixed(2),
      overall_returnable: rows.reduce((s, r) => s + parseFloat(r.returnable || 0), 0).toFixed(2),
      overall_non_returnable: rows.reduce((s, r) => s + parseFloat(r.non_returnable || 0), 0).toFixed(2)
    };

    res.status(200).json({ status: 'success', data: [overall, ...rows] });
  } catch (error) {
    console.error('Error in getAllTdsPayables:', error);
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
};
exports.updateTdsPayable = async (req, res) => {
  try {
    const { id } = req.params;
    const { payable, returnable, non_returnable, finance_bank_id, updated_by = 'admin' } = req.body;

    const [current] = await db.query('SELECT * FROM finance_tds_payable WHERE id = ?', [id]);
    if (current.length === 0) return res.status(404).json({ status: 'error', message: 'Record not found' });

    // Save history
    const historySql = `INSERT INTO finance_tds_payable_edit_history 
      (finance_tds_payable_id, pd_id, month, payable, returnable, non_returnable, finance_bank_id,
       created_at, created_by, updated_at, updated_by, changed_at, changed_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, ?)`;
    
    await db.query(historySql, [
      id, current[0].pd_id, current[0].month, current[0].payable, current[0].returnable, current[0].non_returnable,
      current[0].finance_bank_id, current[0].created_at, current[0].created_by, current[0].updated_at, current[0].updated_by, updated_by
    ]);

    const updateSql = `UPDATE finance_tds_payable 
      SET payable = ?, returnable = ?, non_returnable = ?, finance_bank_id = ?, updated_by = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?`;
    
    await db.query(updateSql, [
      payable || 0, returnable || 0, non_returnable || 0, finance_bank_id || null, updated_by, id
    ]);

    res.status(200).json({ status: 'success', message: 'TDS updated' });
  } catch (error) {
    console.error('Error in updateTdsPayable:', error);
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
};


// GET: Fetch GST Payables with optional bank filter
exports.getGstPayables = async (req, res) => {
  try {
    const { finance_bank_id } = req.query;

    // Base query with all needed fields including bank info
    let detailSql = `
      SELECT 
        fgp.id,
        fgp.finance_gst_company_id,
        fgp.month,
        fgp.entry_type_id,
        fgp.input_amount,
        fgp.output_amount,
        fgp.finance_bank_id,
        COALESCE(fbm.bank_name, '—') AS bank_name,
        fgp.created_at,
        fgc.company_name,
        fget.type_name AS entry_type_name
      FROM finance_gst_payable fgp
      LEFT JOIN finance_gst_company fgc ON fgp.finance_gst_company_id = fgc.id
      LEFT JOIN finance_gst_entry_type fget ON fgp.entry_type_id = fget.id
      LEFT JOIN finance_bank_master fbm ON fgp.finance_bank_id = fbm.id
    `;

    const params = [];

    // Apply filter only if finance_bank_id is provided and not "null" or empty
    if (finance_bank_id && finance_bank_id !== 'null' && finance_bank_id !== '') {
      detailSql += ` WHERE fgp.finance_bank_id = ?`;
      params.push(finance_bank_id);
    }

    detailSql += ` ORDER BY fgp.month DESC, fgc.company_name, fget.type_name`;

    // Summary query (filtered by bank if needed)
    let summarySql = `
      SELECT 
        COALESCE(SUM(input_amount), 0) AS overall_input_amount,
        COALESCE(SUM(output_amount), 0) AS overall_output_amount
      FROM finance_gst_payable
    `;

    const summaryParams = [];
    if (finance_bank_id && finance_bank_id !== 'null' && finance_bank_id !== '') {
      summarySql += ` WHERE finance_bank_id = ?`;
      summaryParams.push(finance_bank_id);
    }

    const [details] = await db.query(detailSql, params);
    const [summaryRows] = await db.query(summarySql, summaryParams);

    const overall = {
      overall_input_amount: parseFloat(summaryRows[0].overall_input_amount || 0).toFixed(2),
      overall_output_amount: parseFloat(summaryRows[0].overall_output_amount || 0).toFixed(2)
    };

    // Return: [overall, ...individual_records]
    res.status(200).json({
      status: 'success',
      data: [overall, ...details]
    });

  } catch (error) {
    console.error('Error in getGstPayables:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error',
      error: error.message
    });
  }
};


// PUT: Update GST Payable + Save History
exports.updateGstPayable = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      input_amount,
      output_amount,
      finance_bank_id,
      updated_by = 1,
      change_reason = 'Updated via UI'
    } = req.body;

    if (!id) {
      return res.status(400).json({ status: 'error', message: 'ID is required' });
    }

    // Fetch current record
    const [currentRows] = await db.query(
      'SELECT * FROM finance_gst_payable WHERE id = ?',
      [id]
    );

    if (currentRows.length === 0) {
      return res.status(404).json({ status: 'error', message: 'Record not found' });
    }

    const oldData = currentRows[0];

    // Save old data to history
    await db.query(`
      INSERT INTO finance_gst_payable_edit_history 
      (finance_gst_payable_id, finance_gst_company_id, month, entry_type_id, 
       input_amount, output_amount, finance_bank_id, changed_by, change_reason)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      oldData.id,
      oldData.finance_gst_company_id,
      oldData.month,
      oldData.entry_type_id,
      oldData.input_amount,
      oldData.output_amount,
      oldData.finance_bank_id,
      updated_by,
      change_reason
    ]);

    // Update main record
    await db.query(`
      UPDATE finance_gst_payable 
      SET input_amount = ?, output_amount = ?, finance_bank_id = ?, 
          updated_by = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [input_amount, output_amount, finance_bank_id || null, updated_by, id]);

    res.status(200).json({
      status: 'success',
      message: 'GST record updated successfully'
    });

  } catch (error) {
    console.error('Error updating GST payable:', error);
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
};

// CREATE / UPDATE GST Payable (with bank_id)
exports.createOrUpdateGstPayable = async (req, res) => {
  try {
    const {
      finance_gst_company_id,
      month,
      entry_type_id,
      input_amount = 0,
      output_amount = 0,
      finance_bank_id,
      created_by = 1,
      updated_by = 1
    } = req.body;

    if (!finance_gst_company_id || !month || !entry_type_id || !finance_bank_id) {
      return res.status(400).json({
        status: 'error',
        message: 'Company, Month, Entry Type, and Bank are required'
      });
    }

    const checkSql = `
      SELECT id FROM finance_gst_payable 
      WHERE finance_gst_company_id = ? AND month = ? AND entry_type_id = ? AND finance_bank_id = ?
    `;
    const [existing] = await db.query(checkSql, [finance_gst_company_id, month, entry_type_id, finance_bank_id]);

    if (existing.length > 0) {
      const oldId = existing[0].id;
      const [oldRow] = await db.query('SELECT * FROM finance_gst_payable WHERE id = ?', [oldId]);
      const oldData = oldRow[0];

      // Save to history
      await db.query(`
        INSERT INTO finance_gst_payable_edit_history 
        (finance_gst_payable_id, finance_gst_company_id, month, entry_type_id, input_amount, output_amount, finance_bank_id, changed_by)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        oldId, oldData.finance_gst_company_id, oldData.month, oldData.entry_type_id,
        oldData.input_amount, oldData.output_amount, oldData.finance_bank_id, updated_by
      ]);

      // Update
      await db.query(`
        UPDATE finance_gst_payable SET
          input_amount = ?, output_amount = ?, finance_bank_id = ?, updated_by = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `, [input_amount, output_amount, finance_bank_id, updated_by, oldId]);

      return res.status(200).json({ status: 'success', message: 'GST updated', data: { id: oldId } });
    } else {
      // Insert new
      const insertSql = `
        INSERT INTO finance_gst_payable 
        (finance_gst_company_id, month, entry_type_id, input_amount, output_amount, finance_bank_id, created_by)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
      const [result] = await db.query(insertSql, [
        finance_gst_company_id, month, entry_type_id, input_amount, output_amount, finance_bank_id, created_by
      ]);

      return res.status(201).json({ status: 'success', message: 'GST created', data: { id: result.insertId } });
    }
  } catch (error) {
    console.error('Error in createOrUpdateGstPayable:', error);
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
};

// Get all companies (for dropdown)
exports.getGstCompanies = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id, company_name FROM finance_gst_company ORDER BY company_name');
    res.status(200).json({ status: 'success', data: rows });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
};

// Create new company from frontend (called when "Add New" clicked)
exports.createGstCompany = async (req, res) => {
  try {
    const { company_name, created_by = 1 } = req.body;
    if (!company_name) return res.status(400).json({ status: 'error', message: 'company_name required' });

    const [result] = await db.query(
      'INSERT INTO finance_gst_company (company_name, created_by) VALUES (?, ?)',
      [company_name, created_by]
    );

    res.status(201).json({
      status: 'success',
      message: 'Company added',
      data: { id: result.insertId, company_name }
    });
  } catch (error) {
    console.error('Error creating GST company:', error);
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
};


// exports.getCreditCardPayablesByPdId = async (req, res) => {
//   try {
//     const { pd_id, finance_bank_id } = req.query;
//     if (!pd_id) return res.status(400).json({ status: 'error', message: 'pd_id required' });

//     let sql = `
//       SELECT 
//         fcp.id,
//         fcp.pd_id,
//         fcp.cost_category_id,
//         fcp.due_date,
//         fcp.bill_date,
//         fcp.particulars,
//         fcp.amount_due,
//         fcp.finance_bank_id,
//         fbm.bank_name,
//         fcc.category_name
//       FROM finance_creditcard_payable fcp
//       LEFT JOIN finance_cost_category fcc ON fcp.cost_category_id = fcc.id
//       LEFT JOIN finance_bank_master fbm ON fcp.finance_bank_id = fbm.id
//       WHERE fcp.pd_id = ?
//     `;

//     const params = [pd_id];
//     if (finance_bank_id) {
//       sql += ` AND fcp.finance_bank_id = ?`;
//       params.push(finance_bank_id);
//     }

//     sql += ` ORDER BY fcp.due_date DESC, fcp.created_at DESC`;

//     const [rows] = await db.query(sql, params);

//     const overall = {
//       overall_amount_due: rows.reduce((sum, r) => sum + parseFloat(r.amount_due || 0), 0).toFixed(2)
//     };

//     res.status(200).json({
//       status: 'success',
//       data: [overall, ...rows]
//     });
//   } catch (error) {
//     console.error('Error in getCreditCardPayablesByPdId:', error);
//     res.status(500).json({ status: 'error', message: 'Server error' });
//   }
// };

// controllers/financeController.js

exports.getCreditCardPayablesByPdId = async (req, res) => {
  try {
    const { finance_bank_id } = req.query;

    if (!finance_bank_id) {
      return res.status(400).json({ status: 'error', message: 'finance_bank_id required' });
    }

    let sql = `
      SELECT 
        fcp.id,
        fcp.cost_category_id,
        fcp.due_date,
        fcp.bill_date,
        fcp.particulars,
        fcp.amount_due,
        fcp.finance_bank_id,
        fbm.bank_name,
        fcc.category_name
      FROM finance_creditcard_payable fcp
      LEFT JOIN finance_cost_category fcc ON fcp.cost_category_id = fcc.id
      LEFT JOIN finance_bank_master fbm ON fcp.finance_bank_id = fbm.id
      WHERE fcp.finance_bank_id = ?
      ORDER BY fcp.due_date DESC, fcp.created_at DESC
    `;

    const [rows] = await db.query(sql, [finance_bank_id]);

    const overall = {
      overall_amount_due: rows.reduce((sum, r) => sum + parseFloat(r.amount_due || 0), 0).toFixed(2)
    };

    res.status(200).json({
      status: 'success',
      data: [overall, ...rows]
    });
  } catch (error) {
    console.error('Error in getCreditCardPayablesByBank:', error);
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
};



exports.createOrUpdateCreditCardPayable = async (req, res) => {
  try {
    const {
      id,
      cost_category_id,
      due_date,
      bill_date,
      particulars,
      amount_due,
      finance_bank_id,
      created_by = '1',
      updated_by = '1'
    } = req.body;

    if (!cost_category_id || !particulars || !amount_due || !finance_bank_id) {
      return res.status(400).json({
        status: 'error',
        message: 'All fields including Bank are required'
      });
    }

    const amountDueFloat = parseFloat(amount_due);
    if (isNaN(amountDueFloat) || amountDueFloat < 0) {
      return res.status(400).json({ status: 'error', message: 'Valid amount is required' });
    }

    if (id) {
      // UPDATE + Save History
      const [old] = await db.query('SELECT * FROM finance_creditcard_payable WHERE id = ?', [id]);
      if (old.length === 0) return res.status(404).json({ status: 'error', message: 'Not found' });

      await db.query(`
        INSERT INTO finance_creditcard_payable_edit_history 
        (finance_creditcard_payable_id, cost_category_id, due_date, bill_date, particulars, amount_due, finance_bank_id, changed_by)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `, [id, old[0].cost_category_id, old[0].due_date, old[0].bill_date, old[0].particulars, old[0].amount_due, old[0].finance_bank_id, updated_by]);

      await db.query(`
        UPDATE finance_creditcard_payable 
        SET cost_category_id=?, due_date=?, bill_date=?, particulars=?, amount_due=?, finance_bank_id=?, updated_by=?, updated_at=CURRENT_TIMESTAMP
        WHERE id=?
      `, [cost_category_id, due_date || null, bill_date || null, particulars.trim(), amountDueFloat, finance_bank_id, updated_by, id]);

      return res.status(200).json({ status: 'success', message: 'Updated' });
    } else {
      // CREATE – pd_id is NOT sent, so it will be NULL
      const [result] = await db.query(`
        INSERT INTO finance_creditcard_payable 
        (cost_category_id, due_date, bill_date, particulars, amount_due, finance_bank_id, created_by)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `, [cost_category_id, due_date || null, bill_date || null, particulars.trim(), amountDueFloat, finance_bank_id, created_by]);

      return res.status(201).json({ status: 'success', message: 'Created', data: { id: result.insertId } });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
};

// controllers/financeController.js

exports.updateCreditCardPayable = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      cost_category_id,
      due_date,
      bill_date,
      particulars,
      amount_due,
      finance_bank_id,
      updated_by = '1'
    } = req.body;

    if (!cost_category_id || !particulars || !amount_due || !finance_bank_id) {
      return res.status(400).json({
        status: 'error',
        message: 'All fields including Bank are required'
      });
    }

    const amountDueFloat = parseFloat(amount_due);
    if (isNaN(amountDueFloat) || amountDueFloat < 0) {
      return res.status(400).json({ status: 'error', message: 'Valid amount required' });
    }

    // Fetch old record
    const [oldRows] = await db.query(
      'SELECT * FROM finance_creditcard_payable WHERE id = ?',
      [id]
    );

    if (oldRows.length === 0) {
      return res.status(404).json({ status: 'error', message: 'Record not found' });
    }

    const old = oldRows[0];

    // Save to history
    await db.query(`
      INSERT INTO finance_creditcard_payable_edit_history 
      (finance_creditcard_payable_id, pd_id, cost_category_id, due_date, bill_date, particulars, amount_due, finance_bank_id, changed_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      id, old.pd_id, old.cost_category_id, old.due_date, old.bill_date,
      old.particulars, old.amount_due, old.finance_bank_id, updated_by
    ]);

    // Update main record
    await db.query(`
      UPDATE finance_creditcard_payable 
      SET 
        cost_category_id = ?, 
        due_date = ?, 
        bill_date = ?, 
        particulars = ?, 
        amount_due = ?, 
        finance_bank_id = ?, 
        updated_by = ?, 
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [
      cost_category_id,
      due_date || null,
      bill_date || null,
      particulars.trim(),
      amountDueFloat,
      finance_bank_id,
      updated_by,
      id
    ]);

    res.status(200).json({
      status: 'success',
      message: 'Credit card entry updated successfully'
    });

  } catch (error) {
    console.error('Error updating credit card payable:', error);
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
};

// Create or Update Other Payable (Upsert)
exports.createOrUpdateOtherPayable = async (req, res) => {
  try {
    const {
      payable_name,
      payable_amount = 0,
      created_by = '1',
      updated_by = '1'
    } = req.body;

    if (!payable_name || !payable_name.trim()) {
      return res.status(400).json({
        status: 'error',
        message: 'payable_name is required'
      });
    }

    const name = payable_name.trim();
    const amount = parseFloat(payable_amount) || 0;

    // Check if exists (case-insensitive unique name)
    const [existing] = await db.query(
      'SELECT id FROM finance_other_payables WHERE LOWER(payable_name) = LOWER(?)',
      [name]
    );

    if (existing.length > 0) {
      const recordId = existing[0].id;

      // Fetch old record for history
      const [oldRows] = await db.query('SELECT * FROM finance_other_payables WHERE id = ?', [recordId]);
      const old = oldRows[0];

      // Save to history
      await db.query(`
        INSERT INTO finance_other_payables_edit_history 
        (finance_other_payables_id, payable_name, payable_amount, changed_by)
        VALUES (?, ?, ?, ?)
      `, [recordId, old.payable_name, old.payable_amount, updated_by]);

      // Update main record
      await db.query(`
        UPDATE finance_other_payables 
        SET payable_amount = ?, updated_by = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `, [amount, updated_by, recordId]);

      return res.status(200).json({
        status: 'success',
        message: 'Other payable updated',
        data: { id: recordId, payable_name: name, payable_amount: amount }
      });
    } else {
      // Insert new
      const [result] = await db.query(`
        INSERT INTO finance_other_payables 
        (payable_name, payable_amount, created_by)
        VALUES (?, ?, ?)
      `, [name, amount, created_by]);

      return res.status(201).json({
        status: 'success',
        message: 'Other payable created',
        data: { id: result.insertId, payable_name: name, payable_amount: amount }
      });
    }
  } catch (error) {
    console.error('Error in createOrUpdateOtherPayable:', error);
    res.status(500).json({ status: 'error', message: 'Server error', error: error.message });
  }
};

// Get all Other Payables with overall total
exports.getOtherPayables = async (req, res) => {
  try {
    const sql = `
      SELECT 
        id,
        payable_name,
        payable_amount,
        created_at,
        created_by,
        updated_at,
        updated_by
      FROM finance_other_payables
      ORDER BY payable_name
    `;
    const [rows] = await db.query(sql);

    const overall = {
      overall_payable_amount: rows.reduce((sum, r) => sum + parseFloat(r.payable_amount || 0), 0).toFixed(2)
    };

    res.status(200).json({
      status: 'success',
      data: [overall, ...rows]
    });
  } catch (error) {
    console.error('Error in getOtherPayables:', error);
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
};

// Fetch overall payables summary (global sum across all projects and months)
exports.fetchOverallPayable = async (req, res) => {
  try {
    // Salary Balance (sum of all balances across all records)
    const salarySql = `
      SELECT COALESCE(SUM(balance), 0) as total_balance
      FROM finance_salary_payable
    `;
    const [salaryRows] = await db.query(salarySql);
    const salaryBalance = parseFloat(salaryRows[0].total_balance || 0);

    // Transport Balance (global)
    const transportSql = `
      SELECT COALESCE(SUM(balance_amount), 0) as overall_balance_amount
      FROM finance_transport_payable
    `;
    const [transportRows] = await db.query(transportSql);
    const transportBalance = parseFloat(transportRows[0].overall_balance_amount || 0);

    // Scaffolding Balance (global)
    const scaffoldingSql = `
      SELECT COALESCE(SUM(balance_amount), 0) as overall_balance_amount
      FROM finance_scaffolding_payable
    `;
    const [scaffRows] = await db.query(scaffoldingSql);
    const scaffoldingBalance = parseFloat(scaffRows[0].overall_balance_amount || 0);

    // Site Accommodation Balance (global)
    const accSql = `
      SELECT COALESCE(SUM(balance_due), 0) as overall_balance
      FROM finance_site_accomodation_payable
    `;
    const [accRows] = await db.query(accSql);
    const accommodationBalance = parseFloat(accRows[0].overall_balance || 0);

    // Commission Balance (global)
    const commSql = `
      SELECT COALESCE(SUM(balance_amount), 0) as overall_balance
      FROM finance_commission_payable
    `;
    const [commRows] = await db.query(commSql);
    const commissionBalance = parseFloat(commRows[0].overall_balance || 0);

    // TDS Payable Balance (global sum of all payable)
    const tdsSql = `
      SELECT COALESCE(SUM(payable), 0) as overall_payable
      FROM finance_tds_payable
    `;
    const [tdsRows] = await db.query(tdsSql);
    const tdsPayableBalance = parseFloat(tdsRows[0].overall_payable || 0);

    // GST Input Credit (global)
    const gstSql = `
      SELECT COALESCE(SUM(input_amount), 0) as overall_input_amount
      FROM finance_gst_payable
    `;
    const [gstRows] = await db.query(gstSql);
    const gstInputCredit = parseFloat(gstRows[0].overall_input_amount || 0);

    // Other Payables Total (global)
    const otherSql = `
      SELECT COALESCE(SUM(payable_amount), 0) as overall_payable_amount
      FROM finance_other_payables
    `;
    const [otherRows] = await db.query(otherSql);
    const otherPayablesTotal = parseFloat(otherRows[0].overall_payable_amount || 0);

    // Grand Total Payable (sum of all project-specific payables: salary + transport + scaffolding + accommodation + commission + tds)
    const totalPayable = salaryBalance + transportBalance + scaffoldingBalance + accommodationBalance + commissionBalance + tdsPayableBalance;

    const data = {
      salary_balance: parseFloat(salaryBalance.toFixed(2)),
      transport_balance: parseFloat(transportBalance.toFixed(2)),
      scaffolding_balance: parseFloat(scaffoldingBalance.toFixed(2)),
      accommodation_balance: parseFloat(accommodationBalance.toFixed(2)),
      commission_balance: parseFloat(commissionBalance.toFixed(2)),
      tds_payable_balance: parseFloat(tdsPayableBalance.toFixed(2)),
      gst_input_credit: parseFloat(gstInputCredit.toFixed(2)),
      other_payables_total: parseFloat(otherPayablesTotal.toFixed(2)),
      total_payable: parseFloat(totalPayable.toFixed(2))
    };

    res.status(200).json({
      status: 'success',
      message: 'Overall payables summary retrieved successfully',
      data
    });
  } catch (error) {
    console.error('Error in fetchOverallPayable:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      error: error.message
    });
  }
};


exports.fetchOverallReceivable = async (req, res) => {
  try {
    // Billed Debtors Receivables Balance (global sum of all balances)
    const billedSql = `
      SELECT COALESCE(SUM(balance_amount), 0) as total_balance
      FROM finance_billed_debtors_receivables
    `;
    const [billedRows] = await db.query(billedSql);
    const billedDebtorsBalance = parseFloat(billedRows[0].total_balance || 0);

    // TDS Returnable (global sum of all returnable)
    const tdsSql = `
      SELECT COALESCE(SUM(returnable), 0) as total_returnable
      FROM finance_tds_payable
    `;
    const [tdsRows] = await db.query(tdsSql);
    const tdsReturnable = parseFloat(tdsRows[0].total_returnable || 0);

    const data = {
      billed_debtors_balance: parseFloat(billedDebtorsBalance.toFixed(2)),
      tds_returnable: parseFloat(tdsReturnable.toFixed(2))
    };

    res.status(200).json({
      status: 'success',
      message: 'Overall receivables summary retrieved successfully',
      data
    });
  } catch (error) {
    console.error('Error in fetchOverallReceivable:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      error: error.message
    });
  }
};



// Get all finance items for dropdown
exports.getItems = async (req, res) => {
  try {
    const sql = 'SELECT id, item_name FROM finance_items ORDER BY item_name';
    const [rows] = await db.query(sql);
    res.status(200).json({
      status: 'success',
      data: rows
    });
  } catch (error) {
    console.error('Error in getItems:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error', error: error.message });
  }
};

// Create new finance item (for "Add" in dropdown)
exports.createItem = async (req, res) => {
  try {
    const { item_name, created_by } = req.body;
    if (!item_name || !created_by) {
      return res.status(400).json({ status: 'error', message: 'item_name and created_by are required' });
    }
    const sql = 'INSERT INTO finance_items (item_name, created_by) VALUES (?, ?)';
    const [result] = await db.query(sql, [item_name, created_by]);
    res.status(201).json({
      status: 'success',
      message: 'Item created successfully',
      data: { id: result.insertId, item_name }
    });
  } catch (error) {
    console.error('Error in createItem:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error', error: error.message });
  }
};

// Get all finance parties for dropdown
exports.getParties = async (req, res) => {
  try {
    const sql = 'SELECT id, party_name FROM finance_party ORDER BY party_name';
    const [rows] = await db.query(sql);
    res.status(200).json({
      status: 'success',
      data: rows
    });
  } catch (error) {
    console.error('Error in getParties:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error', error: error.message });
  }
};

// Create new finance party (for "Add" in dropdown)
exports.createParty = async (req, res) => {
  try {
    const { party_name, created_by } = req.body;
    if (!party_name || !created_by) {
      return res.status(400).json({ status: 'error', message: 'party_name and created_by are required' });
    }
    const sql = 'INSERT INTO finance_party (party_name) VALUES (?)';
    const [result] = await db.query(sql, [party_name]);
    res.status(201).json({
      status: 'success',
      message: 'Party created successfully',
      data: { id: result.insertId, party_name }
    });
  } catch (error) {
    console.error('Error in createParty:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error', error: error.message });
  }
};

exports.getUoms = async (req, res) => {
  try {
    const sql = 'SELECT uom_id as id, uom_name as name FROM uom_master ORDER BY uom_name';
    const [rows] = await db.query(sql);
    res.status(200).json({
      status: 'success',
      data: rows  // Will return: [{id:1, name:'LIT'}, {id:2, name:'KGS'}, ...]
    });
  } catch (error) {
    console.error('Error in getUoms:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error', error: error.message });
  }
};
// Helper for UOM ID (unchanged)
const getUomIdByName = async (uomName) => {
  if (!uomName) return null;
  const sql = 'SELECT uom_id FROM uom_master WHERE uom_name = ?';
  const [rows] = await db.query(sql, [uomName]);
  return rows.length > 0 ? rows[0].uom_id : null;
};

exports.createBilledDebtors = async (req, res) => {
  try {
    const {
      finance_party_id,
      finance_bank_id, // NEW
      po_details,
      inv_no,
      bill_date,
      due_date,
      finance_item_id,
      quantity,
      uom,
      rate,
      sale_amount,
      gst_amount,
      total_payment_due,
      date_of_receipt,
      amount_received,
      expected_dates,
      created_by
    } = req.body;

    if (!finance_party_id || !finance_bank_id || !created_by) {
      return res.status(400).json({ status: 'error', message: 'Party, Bank and created_by are required' });
    }
    if (!total_payment_due || parseFloat(total_payment_due) <= 0) {
      return res.status(400).json({ status: 'error', message: 'Total payment due must be positive' });
    }

    const parsedTotalDue = parseFloat(total_payment_due);
    const parsedReceived = parseFloat(amount_received) || 0;
    const balance = parsedTotalDue - parsedReceived;

    const sql = `
      INSERT INTO finance_billed_debtors_receivables (
        finance_party_id, finance_bank_id, po_details, inv_no, bill_date, due_date,
        finance_item_id, quantity, uom, rate, sale_amount, gst_amount,
        total_payment_due, date_of_receipt, amount_received, balance_amount, created_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
      finance_party_id, finance_bank_id, po_details || null, inv_no || null,
      bill_date || null, due_date, finance_item_id || null,
      parseFloat(quantity) || 0, uom || null, parseFloat(rate) || 0,
      parseFloat(sale_amount) || 0, parseFloat(gst_amount) || 0,
      parsedTotalDue, date_of_receipt || null, parsedReceived > 0 ? parsedReceived : null,
      balance, created_by
    ];

    const [result] = await db.query(sql, params);
    const id = result.insertId;

    // Insert expected dates
    if (Array.isArray(expected_dates) && expected_dates.length > 0) {
      const expSql = `INSERT INTO finance_expected_date_of_receipt 
        (finance_billed_debtors_receivables_id, expected_from_date, expected_to_date, amount, created_by) 
        VALUES (?, ?, ?, ?, ?)`;
      for (const e of expected_dates) {
        if (e.expected_from_date && e.expected_to_date && e.amount) {
          await db.query(expSql, [id, e.expected_from_date, e.expected_to_date, parseFloat(e.amount), created_by]);
        }
      }
    }

    res.status(201).json({ status: 'success', message: 'Created successfully', data: { id } });
  } catch (error) {
    console.error('Create error:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};
// View all billed debtors receivables — NOW WORKS EVEN WITHOUT finance_uom TABLE
exports.viewBilledDebtors = async (req, res) => {
  try {
    const sql = `
      SELECT 
        fbdr.id,
        fp.party_name,
        fbm.bank_name,
        fbdr.finance_bank_id,
        fbdr.po_details,
        fbdr.inv_no,
        fbdr.bill_date,
        fbdr.due_date,
        fi.item_name,
        fbdr.quantity,
        fbdr.uom,                    -- Keep as ID (no join if table missing)
        fbdr.rate,
        fbdr.sale_amount,
        fbdr.gst_amount,
        fbdr.total_payment_due,
        fbdr.date_of_receipt,
        fbdr.amount_received,
        fbdr.balance_amount,
        fbdr.created_at,
        fbdr.created_by
      FROM finance_billed_debtors_receivables fbdr
      LEFT JOIN finance_party fp ON fbdr.finance_party_id = fp.id
      LEFT JOIN finance_bank_master fbm ON fbdr.finance_bank_id = fbm.id
      LEFT JOIN finance_items fi ON fbdr.finance_item_id = fi.id
      ORDER BY fbdr.created_at DESC
    `;

    const [rows] = await db.query(sql);

    // Fetch expected dates safely
    for (let row of rows) {
      try {
        const expSql = `
          SELECT expected_from_date, expected_to_date, amount
          FROM finance_expected_date_of_receipt
          WHERE finance_billed_debtors_receivables_id = ?
          ORDER BY expected_from_date ASC
        `;
        const [expRows] = await db.query(expSql, [row.id]);
        row.expected_dates = expRows || [];
      } catch (expErr) {
        console.warn(`Expected dates not found for ID ${row.id}`);
        row.expected_dates = [];
      }
    }

    res.status(200).json({
      status: 'success',
      message: 'Billed debtors receivables retrieved successfully',
      data: rows
    });
  } catch (error) {
    console.error('Error in viewBilledDebtors:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error',
      error: error.message
    });
  }
};  

// financeController.js
exports.updateBilledDebtors = async (req, res) => {
  try {
    const {
      id, // Now coming from body
      finance_bank_id,
      po_details, inv_no, bill_date, due_date, finance_item_id,
      quantity, uom, rate, sale_amount, gst_amount, total_payment_due,
      date_of_receipt, amount_received, expected_dates = [], updated_by = 1
    } = req.body;

    if (!id) {
      return res.status(400).json({ status: 'error', message: 'ID is required in request body' });
    }

    // Check if record exists
    const [current] = await db.query('SELECT * FROM finance_billed_debtors_receivables WHERE id = ?', [id]);
    if (current.length === 0) {
      return res.status(404).json({ status: 'error', message: 'Record not found' });
    }

    const old = current[0];

    // Save edit history
    await db.query(`
      INSERT INTO finance_billed_debtors_receivables_edit_history 
      (finance_billed_debtors_receivables_id, finance_party_id, finance_bank_id, po_details, inv_no, bill_date, due_date,
       finance_item_id, quantity, uom, rate, sale_amount, gst_amount, total_payment_due,
       date_of_receipt, amount_received, balance_amount, created_at, created_by, changed_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      id, old.finance_party_id, old.finance_bank_id, old.po_details, old.inv_no,
      old.bill_date, old.due_date, old.finance_item_id, old.quantity,
      old.uom, old.rate, old.sale_amount, old.gst_amount,
      old.total_payment_due, old.date_of_receipt, old.amount_received,
      old.balance_amount, old.created_at, old.created_by, updated_by
    ]);

    const balance_amount = parseFloat(total_payment_due || 0) - parseFloat(amount_received || 0);

    // Update main record
    await db.query(`
      UPDATE finance_billed_debtors_receivables SET
        finance_bank_id = ?, po_details = ?, inv_no = ?, bill_date = ?, due_date = ?,
        finance_item_id = ?, quantity = ?, uom = ?, rate = ?, sale_amount = ?,
        gst_amount = ?, total_payment_due = ?, date_of_receipt = ?, amount_received = ?,
        balance_amount = ?, updated_by = ?, updated_at = NOW()
      WHERE id = ?
    `, [
      finance_bank_id || null,
      po_details || null,
      inv_no || null,
      bill_date || null,
      due_date || null,
      finance_item_id || null,
      quantity ? parseFloat(quantity) : 0,
      uom || null,
      rate ? parseFloat(rate) : 0,
      sale_amount ? parseFloat(sale_amount) : 0,
      gst_amount ? parseFloat(gst_amount) : 0,
      parseFloat(total_payment_due) || 0,
      date_of_receipt || null,
      amount_received ? parseFloat(amount_received) : null,
      balance_amount,
      updated_by,
      id
    ]);

    // Delete old expected dates
    await db.query('DELETE FROM finance_expected_date_of_receipt WHERE finance_billed_debtors_receivables_id = ?', [id]);

    // Insert new expected dates
    if (Array.isArray(expected_dates) && expected_dates.length > 0) {
      const validDates = expected_dates.filter(e =>
        e.expected_from_date && e.expected_to_date && e.amount && parseFloat(e.amount) > 0
      );

      if (validDates.length > 0) {
        const values = validDates.map(e => [
          id,
          e.expected_from_date,
          e.expected_to_date,
          parseFloat(e.amount),
          updated_by
        ]);

        await db.query(`
          INSERT INTO finance_expected_date_of_receipt 
          (finance_billed_debtors_receivables_id, expected_from_date, expected_to_date, amount, updated_by)
          VALUES ?
        `, [values]);
      }
    }

    res.json({ status: 'success', message: 'Updated successfully' });
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Server error' });
  }
};

exports.getBankMasters = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT id, bank_name, available_balance, remarks, created_at, created_by, updated_at, updated_by 
      FROM finance_bank_master 
      ORDER BY bank_name
    `);
    res.status(200).json({ status: 'success', data: rows });
  } catch (error) {
    console.error('Error in getBankMasters:', error);
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
};

// CREATE bank
exports.createBankMaster = async (req, res) => {
  try {
    const { bank_name, available_balance = 0, remarks, created_by } = req.body;

    if (!bank_name?.trim() || !created_by) {
      return res.status(400).json({ status: 'error', message: 'bank_name and created_by are required' });
    }

    // If balance > 0, remarks required
    const balance = parseFloat(available_balance) || 0;
    if (balance > 0 && !remarks?.trim()) {
      return res.status(400).json({ status: 'error', message: 'Remarks is required when adding balance' });
    }

    const [result] = await db.query(
      `INSERT INTO finance_bank_master 
       (bank_name, available_balance, remarks, created_by) 
       VALUES (?, ?, ?, ?)`,
      [bank_name.trim(), balance, remarks?.trim() || null, created_by]
    );

    res.status(201).json({
      status: 'success',
      message: 'Bank created successfully',
      data: { id: result.insertId, bank_name: bank_name.trim() }
    });
  } catch (error) {
    console.error('Error in createBankMaster:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ status: 'error', message: 'Bank name already exists' });
    }
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
};

// UPDATE bank + Save old data to history table
exports.updateBankMaster = async (req, res) => {
  try {
    const { id } = req.query;
    const { bank_name, available_balance, remarks, updated_by } = req.body;

    if (!id) return res.status(400).json({ status: 'error', message: 'id is required' });
    if (!bank_name?.trim() || !updated_by) {
      return res.status(400).json({ status: 'error', message: 'bank_name and updated_by are required' });
    }

    // Fetch current record first
    const [current] = await db.query(
      `SELECT bank_name, available_balance, remarks FROM finance_bank_master WHERE id = ?`,
      [id]
    );

    if (current.length === 0) {
      return res.status(404).json({ status: 'error', message: 'Bank not found' });
    }

    const oldData = current[0];
    const newBalance = available_balance !== undefined ? parseFloat(available_balance) || 0 : oldData.available_balance;

    // Validation: If balance is entered or changed → remarks required
    const oldBalance = parseFloat(oldData.available_balance) || 0;
    const balanceChanged = newBalance !== oldBalance;
    const balanceExists = newBalance > 0;

    if ((balanceExists || balanceChanged) && !remarks?.trim()) {
      return res.status(400).json({
        status: 'error',
        message: 'Remarks is required when balance is added or modified'
      });
    }

    // Step 1: Save old data to history table
    await db.query(
      `INSERT INTO finance_bank_master_edit_history 
       (finance_bank_master_id, bank_name, available_balance, remarks, created_by, updated_by)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        id,
        oldData.bank_name,
        oldData.available_balance,
        oldData.remarks,
        oldData.created_by || updated_by,
        updated_by
      ]
    );

    // Step 2: Update current record
    const [result] = await db.query(
      `UPDATE finance_bank_master 
       SET bank_name = ?, available_balance = ?, remarks = ?, updated_by = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [bank_name.trim(), newBalance, remarks?.trim() || null, updated_by, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ status: 'error', message: 'Bank not found' });
    }

    res.status(200).json({ status: 'success', message: 'Bank updated successfully' });
  } catch (error) {
    console.error('Error in updateBankMaster:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ status: 'error', message: 'Bank name already exists' });
    }
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
};


// financeController.js → Final CFS Data with Commission Payable Added
exports.fetchCFSdata = async (req, res) => {
  try {
    // ────── 1. SALARY PAYABLE ──────
    const salarySql = `
      SELECT 
        fsp.id,
        fsp.emp_id,
        em.full_name AS employee_name,
        COALESCE(pd.project_name, '—') AS project_name,
        fsp.entry_date,
        fsp.paid_amount,
        fsp.balance AS balance_amount,
        fsp.finance_bank_id,
        COALESCE(fbm.bank_name, '—') AS bank_name,
        fsp.created_by AS created_by_id,
        COALESCE(u.user_name, 'Unknown User') AS created_by_name,
        COALESCE(u.user_email, '-') AS created_by_email,
        fsp.created_at
      FROM finance_salary_payable fsp
      INNER JOIN employee_master em ON fsp.emp_id = em.emp_id
      LEFT JOIN project_details pd ON fsp.pd_id = pd.pd_id
      LEFT JOIN finance_bank_master fbm ON fsp.finance_bank_id = fbm.id
      LEFT JOIN users u ON fsp.created_by = u.user_id
      ORDER BY fsp.entry_date DESC
    `;

    // ────── 2. TRANSPORT PAYABLE ──────
    const transportSql = `
      SELECT 
        ftp.id,
        ftp.pd_id,
        COALESCE(pd.project_name, '—') AS project_name,
        ftp.cost_category_id,
        COALESCE(fcc.category_name, '—') AS cost_category_name,
        ftp.description,
        ftp.paid_amount,
        ftp.balance_amount,
        ftp.finance_bank_id,
        COALESCE(fbm.bank_name, '—') AS bank_name,
        ftp.created_by AS created_by_id,
        COALESCE(u.user_name, 'Unknown User') AS created_by_name,
        COALESCE(u.user_email, '-') AS created_by_email,
        ftp.created_at
      FROM finance_transport_payable ftp
      LEFT JOIN project_details pd ON ftp.pd_id = pd.pd_id
      LEFT JOIN finance_cost_category fcc ON ftp.cost_category_id = fcc.id
      LEFT JOIN finance_bank_master fbm ON ftp.finance_bank_id = fbm.id
      LEFT JOIN users u ON ftp.created_by = u.user_id
      ORDER BY ftp.created_at DESC
    `;

    // ────── 3. SCAFFOLDING PAYABLE ──────
    const scaffoldingSql = `
      SELECT 
        fsp.id,
        fsp.pd_id,
        COALESCE(pd.project_name, '—') AS project_name,
        fsp.cost_category_id,
        COALESCE(fcc.category_name, '—') AS cost_category_name,
        fsp.paid_amount,
        fsp.balance_amount,
        fsp.finance_bank_id,
        COALESCE(fbm.bank_name, '—') AS bank_name,
        fsp.created_by AS created_by_id,
        COALESCE(u.user_name, 'Unknown User') AS created_by_name,
        COALESCE(u.user_email, '-') AS created_by_email,
        fsp.created_at
      FROM finance_scaffolding_payable fsp
      LEFT JOIN project_details pd ON fsp.pd_id = pd.pd_id
      LEFT JOIN finance_cost_category fcc ON fsp.cost_category_id = fcc.id
      LEFT JOIN finance_bank_master fbm ON fsp.finance_bank_id = fbm.id
      LEFT JOIN users u ON fsp.created_by = u.user_id
      ORDER BY fsp.created_at DESC
    `;

    // ────── 4. SITE ACCOMMODATION PAYABLE ──────
    const siteAccommodationSql = `
      SELECT 
        sap.id,
        sap.pd_id,
        COALESCE(pd.project_name, '—') AS project_name,
        sap.finance_creditors_client_id,
        COALESCE(fcc.client_name, '—') AS creditor_client_name,
        sap.advance_amount,
        sap.due_date,
        sap.due_period,
        sap.due_amount,
        sap.payment AS paid_amount,
        sap.payment_date,
        sap.balance_due AS balance_amount,
        sap.finance_bank_id,
        COALESCE(fbm.bank_name, '—') AS bank_name,
        sap.created_by AS created_by_id,
        COALESCE(u.user_name, 'Unknown User') AS created_by_name,
        COALESCE(u.user_email, '-') AS created_by_email,
        sap.created_at
      FROM finance_site_accomodation_payable sap
      LEFT JOIN project_details pd ON sap.pd_id = pd.pd_id
      LEFT JOIN finance_creditors_client fcc ON sap.finance_creditors_client_id = fcc.id
      LEFT JOIN finance_bank_master fbm ON sap.finance_bank_id = fbm.id
      LEFT JOIN users u ON sap.created_by = u.user_id
      ORDER BY sap.created_at DESC
    `;

    // ────── 5. COMMISSION PAYABLE (NEW & PERFECT) ──────
    const commissionSql = `
      SELECT 
        fcp.id,
        fcp.pd_id,
        COALESCE(pd.project_name, '—') AS project_name,
        fcp.cost_category_id,
        COALESCE(fcc.category_name, '—') AS cost_category_name,
        fcp.marketing_person_id,
        COALESCE(fmp.person_name, '—') AS marketing_person_name,
        fcp.commission_amount_due,
        fcp.date_of_payment,
        fcp.paid_amount,
        fcp.balance_amount,
        fcp.finance_bank_id,
        COALESCE(fbm.bank_name, '—') AS bank_name,
        fcp.created_by AS created_by_id,
        COALESCE(u.user_name, 'Unknown User') AS created_by_name,
        COALESCE(u.user_email, '-') AS created_by_email,
        fcp.created_at
      FROM finance_commission_payable fcp
      LEFT JOIN project_details pd ON fcp.pd_id = pd.pd_id
      LEFT JOIN finance_cost_category fcc ON fcp.cost_category_id = fcc.id
      LEFT JOIN finance_marketing_persons fmp ON fcp.marketing_person_id = fmp.id
      LEFT JOIN finance_bank_master fbm ON fcp.finance_bank_id = fbm.id
      LEFT JOIN users u ON fcp.created_by = u.user_id
      ORDER BY fcp.date_of_payment DESC, fcp.id DESC
    `;



    const gstSql = `
      SELECT 
        fgp.id,
        fgp.finance_gst_company_id,
        COALESCE(fgc.company_name, '—') AS company_name,
        fgp.month,
        fgp.entry_type_id,
        COALESCE(fget.type_name, '—') AS type_name,
        fgp.input_amount,
        fgp.output_amount,
        (fgp.input_amount - fgp.output_amount) AS net_gst_payable,
        fgp.finance_bank_id,
        COALESCE(fbm.bank_name, '—') AS bank_name,
        fgp.created_at,
        fgp.created_by AS created_by_id,
        COALESCE(u.user_name, 'Unknown User') AS created_by_name,
        COALESCE(u.user_email, '-') AS created_by_email
      FROM finance_gst_payable fgp
      LEFT JOIN finance_gst_company fgc ON fgp.finance_gst_company_id = fgc.id
      LEFT JOIN finance_gst_entry_type fget ON fgp.entry_type_id = fget.id
      LEFT JOIN finance_bank_master fbm ON fgp.finance_bank_id = fbm.id
      LEFT JOIN users u ON fgp.created_by = u.user_id
      ORDER BY fgp.month DESC, fgp.created_at DESC
    `;



    const tdsSql = `
      SELECT 
        ftp.id,
        ftp.pd_id,
        COALESCE(pd.project_name, '—') AS project_name,
        ftp.month,
        ftp.payable,
        ftp.returnable,
        ftp.non_returnable,
        (ftp.payable - COALESCE(ftp.returnable, 0)) AS net_tds_due,
        ftp.finance_bank_id,
        COALESCE(fbm.bank_name, '—') AS bank_name,
        ftp.created_at,
        ftp.created_by AS created_by_id,
        COALESCE(u.user_name, 'Unknown User') AS created_by_name,
        COALESCE(u.user_email, '-') AS created_by_email
      FROM finance_tds_payable ftp
      LEFT JOIN project_details pd ON ftp.pd_id = pd.pd_id
      LEFT JOIN finance_bank_master fbm ON ftp.finance_bank_id = fbm.id
      LEFT JOIN users u ON ftp.created_by = u.user_id
      ORDER BY ftp.month DESC, ftp.created_at DESC
    `;



    const creditCardSql = `
      SELECT 
        fcc.id,
        fcc.pd_id,
        COALESCE(pd.project_name, '—') AS project_name,
        fcc.cost_category_id,
        COALESCE(fcat.category_name, '—') AS cost_category_name,
        fcc.due_date,
        fcc.bill_date,
        fcc.particulars,
        fcc.amount_due,
        fcc.finance_bank_id,
        COALESCE(fbm.bank_name, '—') AS bank_name,
        fcc.created_at,
        fcc.created_by AS created_by_id,
        COALESCE(u.user_name, 'Unknown User') AS created_by_name,
        COALESCE(u.user_email, '-') AS created_by_email
      FROM finance_creditcard_payable fcc
      LEFT JOIN project_details pd ON fcc.pd_id = pd.pd_id
      LEFT JOIN finance_cost_category fcat ON fcc.cost_category_id = fcat.id
      LEFT JOIN finance_bank_master fbm ON fcc.finance_bank_id = fbm.id
      LEFT JOIN users u ON fcc.created_by = u.user_id
      ORDER BY fcc.due_date ASC, fcc.created_at DESC
    `;


    const debtorsSql = `
      SELECT 
        fbdr.id,
        fbdr.finance_party_id,
        COALESCE(fp.party_name, '—') AS party_name,
        fbdr.inv_no,
        fbdr.finance_bank_id,
        COALESCE(fbm.bank_name, '—') AS bank_name,
        fbdr.date_of_receipt,
        fbdr.amount_received,
        fbdr.balance_amount,
        fbdr.created_at,
        fbdr.created_by AS created_by_id,
        COALESCE(u.user_name, 'Unknown User') AS created_by_name,
        COALESCE(u.user_email, '-') AS created_by_email
      FROM finance_billed_debtors_receivables fbdr
      LEFT JOIN finance_party fp ON fbdr.finance_party_id = fp.id
      LEFT JOIN finance_bank_master fbm ON fbdr.finance_bank_id = fbm.id
      LEFT JOIN users u ON fbdr.created_by = u.user_id
      WHERE fbdr.balance_amount > 0  -- Only show pending receivables
      ORDER BY fbdr.due_date ASC, fbdr.created_at DESC
    `;

    const tdsReturnableSql = `
      SELECT 
        ftp.id,
        ftp.pd_id,
        COALESCE(pd.project_name, '—') AS project_name,
        ftp.month,
        ftp.returnable,
        ftp.finance_bank_id,
        COALESCE(fbm.bank_name, '—') AS bank_name,
        ftp.created_at,
        ftp.created_by AS created_by_id,
        COALESCE(u.user_name, 'Unknown User') AS created_by_name,
        COALESCE(u.user_email, '-') AS created_by_email
      FROM finance_tds_payable ftp
      LEFT JOIN project_details pd ON ftp.pd_id = pd.pd_id
      LEFT JOIN finance_bank_master fbm ON ftp.finance_bank_id = fbm.id
      LEFT JOIN users u ON ftp.created_by = u.user_id
      WHERE ftp.returnable > 0
      ORDER BY ftp.month DESC, ftp.created_at DESC
    `;


    const creditorsSql = `
      SELECT 
        fc.id,
        fc.client_id,
        COALESCE(fcc.client_name, '—') AS client_name,
        fc.finance_bank_id,
        COALESCE(fbm.bank_name, '—') AS bank_name,
        fc.inv_number,
        fc.amount_paid,
        fc.date_of_payment,
        fc.remarks,
        fc.is_gst,
        CASE 
          WHEN fc.is_gst = 1 THEN 'GST'
          ELSE 'Others'
        END AS payable_type,
        fc.balance_amount,
        fc.created_at,
        fc.created_by AS created_by_id,
        COALESCE(u.user_name, 'Unknown User') AS created_by_name,
        COALESCE(u.user_email, '-') AS created_by_email
      FROM finance_creditors fc
      LEFT JOIN finance_creditors_client fcc ON fc.client_id = fcc.id
      LEFT JOIN finance_bank_master fbm ON fc.finance_bank_id = fbm.id
      LEFT JOIN users u ON fc.created_by = u.user_id
      WHERE fc.balance_amount > 0
      ORDER BY fc.due_date ASC, fc.created_at DESC
    `;
    
// ────── EXECUTE ALL QUERIES ──────
    const [
      [salaryRows],
      [transportRows],
      [scaffoldingRows],
      [siteAccommodationRows],
      [commissionRows],
      [gstRows],
      [tdsRows],
      [tdsReturnableRows],
      [creditCardRows],
      [debtorsRows],
      [creditorsRows]
    ] = await Promise.all([
      db.query(salarySql),
      db.query(transportSql),
      db.query(scaffoldingSql),
      db.query(siteAccommodationSql),
      db.query(commissionSql),
      db.query(gstSql),
      db.query(tdsSql),
      db.query(tdsReturnableSql),
      db.query(creditCardSql),
      db.query(debtorsSql),
      db.query(creditorsSql)
    ]);
    // ────── TOTAL PAID (Money we have already paid out) ──────
 const totalPaid = 
      salaryRows.reduce((s, r) => s + (parseFloat(r.paid_amount) || 0), 0) +
      transportRows.reduce((s, r) => s + (parseFloat(r.paid_amount) || 0), 0) +
      scaffoldingRows.reduce((s, r) => s + (parseFloat(r.paid_amount) || 0), 0) +
      siteAccommodationRows.reduce((s, r) => s + (parseFloat(r.payment || r.paid_amount) || 0), 0) +
      commissionRows.reduce((s, r) => s + (parseFloat(r.paid_amount) || 0), 0) +
      gstRows.reduce((s, r) => s + (parseFloat(r.output_amount) || 0), 0) +
      tdsRows.reduce((s, r) => s + (parseFloat(r.returnable) || 0), 0) +
      creditCardRows.reduce(() => 0, 0) +
      creditorsRows.reduce((s, r) => s + (parseFloat(r.amount_paid) || 0), 0) +
      debtorsRows.reduce((s, r) => s + (parseFloat(r.amount_received) || 0), 0);

    // ────── TOTAL PAYABLE BALANCE (Updated with Creditors) ──────
    const totalPayableBalance = 
      salaryRows.reduce((s, r) => s + (parseFloat(r.balance_amount || r.balance) || 0), 0) +
      transportRows.reduce((s, r) => s + (parseFloat(r.balance_amount) || 0), 0) +
      scaffoldingRows.reduce((s, r) => s + (parseFloat(r.balance_amount) || 0), 0) +
      siteAccommodationRows.reduce((s, r) => s + (parseFloat(r.balance_due || r.balance_amount) || 0), 0) +
      commissionRows.reduce((s, r) => s + (parseFloat(r.balance_amount) || 0), 0) +
      gstRows.reduce((s, r) => s + (parseFloat(r.net_gst_payable) || 0), 0) +
      tdsRows.reduce((s, r) => s + (parseFloat(r.net_tds_due) || 0), 0) +
      creditCardRows.reduce((s, r) => s + (parseFloat(r.amount_due) || 0), 0) +
      creditorsRows.reduce((s, r) => s + (parseFloat(r.balance_amount) || 0), 0);  // ← NEW

    // ────── TOTAL RECEIVABLE BALANCE ──────
    const totalReceivableBalance = 
      debtorsRows.reduce((s, r) => s + (parseFloat(r.balance_amount) || 0), 0) +
      tdsReturnableRows.reduce((s, r) => s + (parseFloat(r.returnable) || 0), 0);

    // ────── OVERALL SUMMARY ──────
    const overall = {
      overall_paid: totalPaid.toFixed(2),
      overall_payable_balance: totalPayableBalance.toFixed(2),
      overall_receivable_balance: totalReceivableBalance.toFixed(2),
      net_cash_position: (totalReceivableBalance - totalPayableBalance).toFixed(2)
    };

      // ────── FINAL RESPONSE – ORGANIZED AS PER YOUR REQUIREMENT ──────
    res.status(200).json({
      // ────── 1. CREDITORS FIRST (Most Important Payable) ──────
      creditors_payable_data: creditorsRows,

      // ────── 2. ALL OTHER PAYABLES (In logical order) ──────
      salary_payable_data: salaryRows,
      transport_payable_data: transportRows,
      scaffolding_payable_data: scaffoldingRows,
      site_accommodation_payable_data: siteAccommodationRows,
      commission_payable_data: commissionRows,
      gst_payable_data: gstRows,
      tds_payable_data: tdsRows,
      creditcard_payable_data: creditCardRows,

      // ────── 3. RECEIVABLES – LAST (As Requested) ──────
      tds_returnable_receivable_data: tdsReturnableRows,     // Refundable TDS from Govt
      billed_debtors_receivable_data: debtorsRows,           // Client Dues

      // ────── OVERALL SUMMARY (Always at the end) ──────
      overall
    });

  } catch (error) {
    console.error('Error in fetchCFSdata:', error);
    res.status(500).json({
      salary_payable_data: [],
      transport_payable_data: [],
      scaffolding_payable_data: [],
      site_accommodation_payable_data: [],
      commission_payable_data: [],
      gst_payable_data: [],
      tds_payable_data: [],
      tds_returnable_receivable_data: [],
      creditcard_payable_data: [],
      billed_debtors_receivable_data: [],
      creditors_payable_data: [],
      overall: {
        overall_paid: "0.00",
        overall_payable_balance: "0.00",
        overall_receivable_balance: "0.00",
        net_cash_position: "0.00"
      }
    });
  }
};





// financeController.js → Final CPE Data (Clean, No IDs Exposed)
exports.fetchCPEdata = async (req, res) => {
  try {
    // ────── 1. SALARY PAYABLE ──────
    const salarySql = `
      SELECT 
        em.full_name AS employee_name,
        COALESCE(pd.project_name, '—') AS project_name,
        fsp.entry_date,
        fsp.paid_amount,
        fsp.balance AS balance_amount,
        COALESCE(fbm.bank_name, '—') AS bank_name,
        COALESCE(u.user_name, 'Unknown User') AS created_by_name,
        fsp.created_at
      FROM finance_salary_payable fsp
      INNER JOIN employee_master em ON fsp.emp_id = em.emp_id
      LEFT JOIN project_details pd ON fsp.pd_id = pd.pd_id
      LEFT JOIN finance_bank_master fbm ON fsp.finance_bank_id = fbm.id
      LEFT JOIN users u ON fsp.created_by = u.user_id
      ORDER BY fsp.entry_date DESC
    `;

    // ────── 2. TRANSPORT PAYABLE ──────
    const transportSql = `
      SELECT 
        COALESCE(pd.project_name, '—') AS project_name,
        COALESCE(fcc.category_name, '—') AS cost_category_name,
        ftp.description,
        ftp.paid_amount,
        ftp.balance_amount,
        COALESCE(fbm.bank_name, '—') AS bank_name,
        COALESCE(u.user_name, 'Unknown User') AS created_by_name,
        ftp.created_at
      FROM finance_transport_payable ftp
      LEFT JOIN project_details pd ON ftp.pd_id = pd.pd_id
      LEFT JOIN finance_cost_category fcc ON ftp.cost_category_id = fcc.id
      LEFT JOIN finance_bank_master fbm ON ftp.finance_bank_id = fbm.id
      LEFT JOIN users u ON ftp.created_by = u.user_id
      ORDER BY ftp.created_at DESC
    `;

    // ────── 3. SCAFFOLDING PAYABLE ──────
    const scaffoldingSql = `
      SELECT 
        COALESCE(pd.project_name, '—') AS project_name,
        COALESCE(fcc.category_name, '—') AS cost_category_name,
        fsp.paid_amount,
        fsp.balance_amount,
        COALESCE(fbm.bank_name, '—') AS bank_name,
        COALESCE(u.user_name, 'Unknown User') AS created_by_name,
        fsp.created_at
      FROM finance_scaffolding_payable fsp
      LEFT JOIN project_details pd ON fsp.pd_id = pd.pd_id
      LEFT JOIN finance_cost_category fcc ON fsp.cost_category_id = fcc.id
      LEFT JOIN finance_bank_master fbm ON fsp.finance_bank_id = fbm.id
      LEFT JOIN users u ON fsp.created_by = u.user_id
      ORDER BY fsp.created_at DESC
    `;

    // ────── 4. SITE ACCOMMODATION PAYABLE ──────
    const siteAccommodationSql = `
      SELECT 
        COALESCE(pd.project_name, '—') AS project_name,
        COALESCE(fcc.client_name, '—') AS creditor_client_name,
        sap.advance_amount,
        sap.due_date,
        sap.due_period,
        sap.due_amount,
        sap.payment AS paid_amount,
        sap.payment_date,
        sap.balance_due AS balance_amount,
        COALESCE(fbm.bank_name, '—') AS bank_name,
        COALESCE(u.user_name, 'Unknown User') AS created_by_name,
        sap.created_at
      FROM finance_site_accomodation_payable sap
      LEFT JOIN project_details pd ON sap.pd_id = pd.pd_id
      LEFT JOIN finance_creditors_client fcc ON sap.finance_creditors_client_id = fcc.id
      LEFT JOIN finance_bank_master fbm ON sap.finance_bank_id = fbm.id
      LEFT JOIN users u ON sap.created_by = u.user_id
      ORDER BY sap.created_at DESC
    `;

    // ────── 5. COMMISSION PAYABLE ──────
    const commissionSql = `
      SELECT 
        COALESCE(pd.project_name, '—') AS project_name,
        COALESCE(fcc.category_name, '—') AS cost_category_name,
        COALESCE(fmp.person_name, '—') AS marketing_person_name,
        fcp.commission_amount_due,
        fcp.date_of_payment,
        fcp.paid_amount,
        fcp.balance_amount,
        COALESCE(fbm.bank_name, '—') AS bank_name,
        COALESCE(u.user_name, 'Unknown User') AS created_by_name,
        fcp.created_at
      FROM finance_commission_payable fcp
      LEFT JOIN project_details pd ON fcp.pd_id = pd.pd_id
      LEFT JOIN finance_cost_category fcc ON fcp.cost_category_id = fcc.id
      LEFT JOIN finance_marketing_persons fmp ON fcp.marketing_person_id = fmp.id
      LEFT JOIN finance_bank_master fbm ON fcp.finance_bank_id = fbm.id
      LEFT JOIN users u ON fcp.created_by = u.user_id
      ORDER BY fcp.date_of_payment DESC, fcp.created_at DESC
    `;

    // ────── 6. GST PAYABLE ──────
    const gstSql = `
      SELECT 
        COALESCE(fgc.company_name, '—') AS company_name,
        fgp.month,
        COALESCE(fget.type_name, '—') AS type_name,
        fgp.input_amount,
        fgp.output_amount,
        (fgp.input_amount - fgp.output_amount) AS net_gst_payable,
        COALESCE(fbm.bank_name, '—') AS bank_name,
        COALESCE(u.user_name, 'Unknown User') AS created_by_name,
        fgp.created_at
      FROM finance_gst_payable fgp
      LEFT JOIN finance_gst_company fgc ON fgp.finance_gst_company_id = fgc.id
      LEFT JOIN finance_gst_entry_type fget ON fgp.entry_type_id = fget.id
      LEFT JOIN finance_bank_master fbm ON fgp.finance_bank_id = fbm.id
      LEFT JOIN users u ON fgp.created_by = u.user_id
      ORDER BY fgp.month DESC
    `;

    // ────── 7. TDS PAYABLE ──────
    const tdsSql = `
      SELECT 
        COALESCE(pd.project_name, '—') AS project_name,
        ftp.month,
        ftp.payable,
        ftp.returnable,
        ftp.non_returnable,
        (ftp.payable - COALESCE(ftp.returnable, 0)) AS net_tds_due,
        COALESCE(fbm.bank_name, '—') AS bank_name,
        COALESCE(u.user_name, 'Unknown User') AS created_by_name,
        ftp.created_at
      FROM finance_tds_payable ftp
      LEFT JOIN project_details pd ON ftp.pd_id = pd.pd_id
      LEFT JOIN finance_bank_master fbm ON ftp.finance_bank_id = fbm.id
      LEFT JOIN users u ON ftp.created_by = u.user_id
      ORDER BY ftp.month DESC
    `;

    // ────── 8. CREDIT CARD PAYABLE ──────
    const creditCardSql = `
      SELECT 
        COALESCE(pd.project_name, '—') AS project_name,
        COALESCE(fcat.category_name, '—') AS cost_category_name,
        fcc.due_date,
        fcc.bill_date,
        fcc.particulars,
        fcc.amount_due,
        COALESCE(fbm.bank_name, '—') AS bank_name,
        COALESCE(u.user_name, 'Unknown User') AS created_by_name,
        fcc.created_at
      FROM finance_creditcard_payable fcc
      LEFT JOIN project_details pd ON fcc.pd_id = pd.pd_id
      LEFT JOIN finance_cost_category fcat ON fcc.cost_category_id = fcat.id
      LEFT JOIN finance_bank_master fbm ON fcc.finance_bank_id = fbm.id
      LEFT JOIN users u ON fcc.created_by = u.user_id
      ORDER BY fcc.due_date ASC
    `;

    // ────── 9. BILLED DEBTORS (RECEIVABLES) ──────
    const debtorsSql = `
      SELECT 
        COALESCE(fp.party_name, '—') AS party_name,
        fbdr.inv_no,
        COALESCE(fbm.bank_name, '—') AS bank_name,
        fbdr.date_of_receipt,
        fbdr.amount_received,
        fbdr.balance_amount,
        COALESCE(u.user_name, 'Unknown User') AS created_by_name,
        fbdr.created_at
      FROM finance_billed_debtors_receivables fbdr
      LEFT JOIN finance_party fp ON fbdr.finance_party_id = fp.id
      LEFT JOIN finance_bank_master fbm ON fbdr.finance_bank_id = fbm.id
      LEFT JOIN users u ON fbdr.created_by = u.user_id
      WHERE fbdr.balance_amount > 0
      ORDER BY fbdr.due_date ASC, fbdr.created_at DESC
    `;

    // ────── 10. TDS RETURNABLE (RECEIVABLE FROM GOVT) ──────
    const tdsReturnableSql = `
      SELECT 
        COALESCE(pd.project_name, '—') AS project_name,
        ftp.month,
        ftp.returnable,
        COALESCE(fbm.bank_name, '—') AS bank_name,
        COALESCE(u.user_name, 'Unknown User') AS created_by_name,
        ftp.created_at
      FROM finance_tds_payable ftp
      LEFT JOIN project_details pd ON ftp.pd_id = pd.pd_id
      LEFT JOIN finance_bank_master fbm ON ftp.finance_bank_id = fbm.id
      LEFT JOIN users u ON ftp.created_by = u.user_id
      WHERE ftp.returnable > 0
      ORDER BY ftp.month DESC
    `;

    // ────── 11. CREDITORS PAYABLE (MOST IMPORTANT) ──────
    const creditorsSql = `
      SELECT 
        COALESCE(fcc.client_name, '—') AS client_name,
        COALESCE(fbm.bank_name, '—') AS bank_name,
        fc.inv_number,
        fc.amount_paid,
        fc.date_of_payment,
        fc.remarks,
        CASE WHEN fc.is_gst = 1 THEN 'GST' ELSE 'Others' END AS payable_type,
        fc.balance_amount,
        COALESCE(u.user_name, 'Unknown User') AS created_by_name,
        fc.created_at
      FROM finance_creditors fc
      LEFT JOIN finance_creditors_client fcc ON fc.client_id = fcc.id
      LEFT JOIN finance_bank_master fbm ON fc.finance_bank_id = fbm.id
      LEFT JOIN users u ON fc.created_by = u.user_id
      WHERE fc.balance_amount > 0
      ORDER BY fc.due_date ASC, fc.created_at DESC
    `;

    // ────── EXECUTE ALL QUERIES IN PARALLEL ──────
    const [
      [salaryRows],
      [transportRows],
      [scaffoldingRows],
      [siteAccommodationRows],
      [commissionRows],
      [gstRows],
      [tdsRows],
      [tdsReturnableRows],
      [creditCardRows],
      [debtorsRows],
      [creditorsRows]
    ] = await Promise.all([
      db.query(salarySql),
      db.query(transportSql),
      db.query(scaffoldingSql),
      db.query(siteAccommodationSql),
      db.query(commissionSql),
      db.query(gstSql),
      db.query(tdsSql),
      db.query(tdsReturnableSql),
      db.query(creditCardSql),
      db.query(debtorsSql),
      db.query(creditorsSql)
    ]);

    // ────── CALCULATE TOTALS (No IDs involved) ──────
    const totalPaid = 
      salaryRows.reduce((s, r) => s + (parseFloat(r.paid_amount) || 0), 0) +
      transportRows.reduce((s, r) => s + (parseFloat(r.paid_amount) || 0), 0) +
      scaffoldingRows.reduce((s, r) => s + (parseFloat(r.paid_amount) || 0), 0) +
      siteAccommodationRows.reduce((s, r) => s + (parseFloat(r.paid_amount) || 0), 0) +
      commissionRows.reduce((s, r) => s + (parseFloat(r.paid_amount) || 0), 0) +
      gstRows.reduce((s, r) => s + (parseFloat(r.output_amount) || 0), 0) +
      tdsRows.reduce((s, r) => s + (parseFloat(r.returnable) || 0), 0) +
      creditorsRows.reduce((s, r) => s + (parseFloat(r.amount_paid) || 0), 0) +
      debtorsRows.reduce((s, r) => s + (parseFloat(r.amount_received) || 0), 0);

    const totalPayableBalance = 
      salaryRows.reduce((s, r) => s + (parseFloat(r.balance_amount || r.balance) || 0), 0) +
      transportRows.reduce((s, r) => s + (parseFloat(r.balance_amount) || 0), 0) +
      scaffoldingRows.reduce((s, r) => s + (parseFloat(r.balance_amount) || 0), 0) +
      siteAccommodationRows.reduce((s, r) => s + (parseFloat(r.balance_due || r.balance_amount) || 0), 0) +
      commissionRows.reduce((s, r) => s + (parseFloat(r.balance_amount) || 0), 0) +
      gstRows.reduce((s, r) => s + (parseFloat(r.net_gst_payable) || 0), 0) +
      tdsRows.reduce((s, r) => s + (parseFloat(r.net_tds_due) || 0), 0) +
      creditCardRows.reduce((s, r) => s + (parseFloat(r.amount_due) || 0), 0) +
      creditorsRows.reduce((s, r) => s + (parseFloat(r.balance_amount) || 0), 0);

    const totalReceivableBalance = 
      debtorsRows.reduce((s, r) => s + (parseFloat(r.balance_amount) || 0), 0) +
      tdsReturnableRows.reduce((s, r) => s + (parseFloat(r.returnable) || 0), 0);

    const overall = {
      overall_paid: totalPaid.toFixed(2),
      overall_payable_balance: totalPayableBalance.toFixed(2),
      overall_receivable_balance: totalReceivableBalance.toFixed(2),
      net_cash_position: (totalReceivableBalance - totalPayableBalance).toFixed(2)
    };

    // ────── FINAL CLEAN RESPONSE (No IDs Exposed) ──────
    res.status(200).json({
      creditors_payable_data: creditorsRows,

      salary_payable_data: salaryRows,
      transport_payable_data: transportRows,
      scaffolding_payable_data: scaffoldingRows,
      site_accommodation_payable_data: siteAccommodationRows,
      commission_payable_data: commissionRows,
      gst_payable_data: gstRows,
      tds_payable_data: tdsRows,
      creditcard_payable_data: creditCardRows,

      tds_returnable_receivable_data: tdsReturnableRows,
      billed_debtors_receivable_data: debtorsRows,

      overall
    });

  } catch (error) {
    console.error('Error in fetchCPEdata:', error);
    res.status(500).json({
      creditors_payable_data: [],
      salary_payable_data: [],
      transport_payable_data: [],
      scaffolding_payable_data: [],
      site_accommodation_payable_data: [],
      commission_payable_data: [],
      gst_payable_data: [],
      tds_payable_data: [],
      creditcard_payable_data: [],
      tds_returnable_receivable_data: [],
      billed_debtors_receivable_data: [],
      overall: {
        overall_paid: "0.00",
        overall_payable_balance: "0.00",
        overall_receivable_balance: "0.00",
        net_cash_position: "0.00"
      }
    });
  }
};