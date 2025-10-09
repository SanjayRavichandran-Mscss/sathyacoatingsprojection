const db = require("../config/db");

// Fetch companies
exports.getCompanies = async (req, res) => {
  try {
    const [companies] = await db.query("SELECT company_id, company_name FROM company");
    res.status(200).json({ success: true, data: companies });
  } catch (error) {
    console.error("Error fetching companies:", error);
    res.status(500).json({ success: false, message: "Failed to fetch companies" });
  }
};

// Fetch projects by company ID
exports.getProjectsByCompany = async (req, res) => {
  const { companyId } = req.params;
  try {
    const [projects] = await db.query(
      "SELECT pd_id, project_name FROM project_details WHERE company_id = ?",
      [companyId]
    );
    res.status(200).json({ success: true, data: projects });
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ success: false, message: "Failed to fetch projects" });
  }
};

// Fetch sites by project ID
exports.getSitesByProject = async (req, res) => {
  const { projectId } = req.params;
  try {
    const [sites] = await db.query(
      "SELECT sd.site_id, sd.site_name, sd.po_number, sd.start_date, l.location_name " +
      "FROM site_details sd " +
      "LEFT JOIN location l ON sd.location_id = l.location_id " +
      "WHERE sd.pd_id = ?",
      [projectId]
    );
    res.status(200).json({ success: true, data: sites });
  } catch (error) {
    console.error("Error fetching sites:", error);
    res.status(500).json({ success: false, message: "Failed to fetch sites" });
  }
};

exports.getWorkDescriptions = async (req, res) => {
  const { siteId } = req.params;
  try {
    const [descriptions] = await db.query(
      `SELECT DISTINCT wd.desc_id, wd.desc_name
       FROM po_reckoner pr
       JOIN work_descriptions wd ON pr.desc_id = wd.desc_id
       WHERE pr.site_id = ?`,
      [siteId]
    );
    res.status(200).json({ success: true, data: descriptions });
  } catch (error) {
    console.error("Error fetching work descriptions:", error);
    res.status(500).json({ success: false, message: "Failed to fetch work descriptions" });
  }
};

// exports.getCompletionEntriesBySite = async (req, res) => {
//   const { siteId } = req.params;
//   const { start_date, end_date } = req.query;

//   try {
//     if (start_date && !/^\d{4}-\d{2}-\d{2}$/.test(start_date)) {
//       return res.status(400).json({
//         status: "error",
//         message: "start_date must be in YYYY-MM-DD format",
//       });
//     }
//     if (end_date && !/^\d{4}-\d{2}-\d{2}$/.test(end_date)) {
//       return res.status(400).json({
//         status: "error",
//         message: "end_date must be in YYYY-MM-DD format",
//       });
//     }
//     if (start_date && end_date && start_date > end_date) {
//       return res.status(400).json({
//         status: "error",
//         message: "start_date cannot be later than end_date",
//       });
//     }

//     let query = `
//       SELECT 
//         ic.category_id,
//         ic.category_name,
//         isc.subcategory_name,
//         DATE_FORMAT(ceh.entry_date, '%Y-%m-%d') as entry_date,
//         ceh.entry_id,
//         ceh.area_added,
//         ceh.rate,
//         ceh.value_added,
//         ceh.created_by,
//         pr.desc_id,
//         DATE_FORMAT(CONVERT_TZ(ceh.created_at, '+00:00', '+05:30'), '%Y-%m-%d') as created_date,
//         DATE_FORMAT(CONVERT_TZ(ceh.created_at, '+00:00', '+05:30'), '%H:%i:%s') as created_time
//       FROM completion_entries_history ceh
//       JOIN po_reckoner pr ON ceh.rec_id = pr.rec_id
//       JOIN item_category ic ON pr.category_id = ic.category_id
//       JOIN item_subcategory isc ON pr.subcategory_id = isc.subcategory_id
//       WHERE pr.site_id = ?
//     `;
//     const queryParams = [siteId];

//     if (start_date) {
//       query += ' AND ceh.entry_date >= ?';
//       queryParams.push(start_date);
//     }
//     if (end_date) {
//       query += ' AND ceh.entry_date <= ?';
//       queryParams.push(end_date);
//     }

//     query += ' ORDER BY ic.category_id, isc.subcategory_name, ceh.entry_date, ceh.created_at';

//     const [rows] = await db.query(query, queryParams);

//     const categoryMap = new Map();
//     rows.forEach(row => {
//       const { category_id, category_name, subcategory_name, entry_date, desc_id, created_date, created_time, ...entry } = row;

//       let category = categoryMap.get(category_id);
//       if (!category) {
//         category = { category_id, category_name, subcategories: new Map() };
//         categoryMap.set(category_id, category);
//       }

//       let subcategory = category.subcategories.get(subcategory_name);
//       if (!subcategory) {
//         subcategory = { subcategory_name, entries_by_date: new Map() };
//         category.subcategories.set(subcategory_name, subcategory);
//       }

//       let dateEntry = subcategory.entries_by_date.get(entry_date);
//       if (!dateEntry) {
//         dateEntry = { entry_date, entries: [] };
//         subcategory.entries_by_date.set(entry_date, dateEntry);
//       }

//       dateEntry.entries.push({
//         entry_id: row.entry_id,
//         area_added: parseFloat(row.area_added) || 0,
//         rate: parseFloat(row.rate) || 0,
//         value_added: parseFloat(row.value_added) || 0,
//         created_by: row.created_by,
//         desc_id,
//         created_date,
//         created_time
//       });
//     });

//     const groupedData = Array.from(categoryMap.values()).map(category => ({
//       category_id: category.category_id,
//       category_name: category.category_name,
//       subcategories: Array.from(category.subcategories.values()).map(subcategory => ({
//         subcategory_name: subcategory.subcategory_name,
//         entries_by_date: Array.from(subcategory.entries_by_date.values())
//       }))
//     }));

//     res.status(200).json({
//       status: "success",
//       data: groupedData
//     });
//   } catch (error) {
//     console.error("Error fetching completion entries:", error);
//     res.status(500).json({
//       status: "error",
//       message: "Failed to fetch completion entries",
//       error: error.message,
//     });
//   }
// };

// Fetch PO reckoner totals by site


exports.getCompletionEntriesBySite = async (req, res) => {
  const { siteId, descId } = req.params;
  const { start_date, end_date } = req.query;

  try {
    if (start_date && !/^\d{4}-\d{2}-\d{2}$/.test(start_date)) {
      return res.status(400).json({
        status: "error",
        message: "start_date must be in YYYY-MM-DD format",
      });
    }
    if (end_date && !/^\d{4}-\d{2}-\d{2}$/.test(end_date)) {
      return res.status(400).json({
        status: "error",
        message: "end_date must be in YYYY-MM-DD format",
      });
    }
    if (start_date && end_date && start_date > end_date) {
      return res.status(400).json({
        status: "error",
        message: "start_date cannot be later than end_date",
      });
    }

    let query = `
      SELECT 
        ic.category_id,
        ic.category_name,
        isc.subcategory_name,
        isc.billing,
        DATE_FORMAT(ceh.entry_date, '%Y-%m-%d') as entry_date,
        ceh.entry_id,
        ceh.area_added,
        ceh.rate,
        ceh.value_added,
        ceh.created_by,
        pr.desc_id,
        DATE_FORMAT(CONVERT_TZ(ceh.created_at, '+00:00', '+05:30'), '%Y-%m-%d') as created_date,
        DATE_FORMAT(CONVERT_TZ(ceh.created_at, '+00:00', '+05:30'), '%H:%i:%s') as created_time
      FROM completion_entries_history ceh
      JOIN po_reckoner pr ON ceh.rec_id = pr.rec_id
      JOIN item_category ic ON pr.category_id = ic.category_id
      JOIN item_subcategory isc ON pr.subcategory_id = isc.subcategory_id
      WHERE pr.site_id = ? AND pr.desc_id = ?
    `;
    const queryParams = [siteId, descId];

    if (start_date) {
      query += ' AND ceh.entry_date >= ?';
      queryParams.push(start_date);
    }
    if (end_date) {
      query += ' AND ceh.entry_date <= ?';
      queryParams.push(end_date);
    }

    query += ' ORDER BY ic.category_id, isc.subcategory_name, ceh.entry_date, ceh.created_at';

    const [rows] = await db.query(query, queryParams);

    let billing_area = 0;
    let billing_rate = 0;
    let billing_value = 0;

    const categoryMap = new Map();
    rows.forEach(row => {
      const { category_id, category_name, subcategory_name, billing, entry_date, desc_id, created_date, created_time, ...entry } = row;

      let category = categoryMap.get(category_id);
      if (!category) {
        category = { category_id, category_name, subcategories: new Map() };
        categoryMap.set(category_id, category);
      }

      let subcategory = category.subcategories.get(subcategory_name);
      if (!subcategory) {
        subcategory = { subcategory_name, billing, entries_by_date: new Map() };
        category.subcategories.set(subcategory_name, subcategory);
      }

      let dateEntry = subcategory.entries_by_date.get(entry_date);
      if (!dateEntry) {
        dateEntry = { entry_date, entries: [] };
        subcategory.entries_by_date.set(entry_date, dateEntry);
      }

      const entryData = {
        entry_id: row.entry_id,
        area_added: parseFloat(row.area_added) || 0,
        rate: parseFloat(row.rate) || 0,
        value_added: parseFloat(row.value_added) || 0,
        created_by: row.created_by,
        desc_id,
        created_date,
        created_time
      };

      dateEntry.entries.push(entryData);

      // Calculate billing totals for subcategories with billing = 1
      if (billing === 1) {
        billing_area += entryData.area_added;
        billing_rate += entryData.rate;
        billing_value += entryData.value_added;
      }
    });

    const groupedData = Array.from(categoryMap.values()).map(category => ({
      category_id: category.category_id,
      category_name: category.category_name,
      subcategories: Array.from(category.subcategories.values()).map(subcategory => ({
        subcategory_name: subcategory.subcategory_name,
        billing: subcategory.billing,
        entries_by_date: Array.from(subcategory.entries_by_date.values())
      }))
    }));

    res.status(200).json({
      status: "success",
      data: groupedData,
      billing_area: parseFloat(billing_area.toFixed(2)),
      billing_rate: parseFloat(billing_rate.toFixed(2)),
      billing_value: parseFloat(billing_value.toFixed(2))
    });
  } catch (error) {
    console.error("Error fetching completion entries:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch completion entries",
      error: error.message,
    });
  }
};







exports.getPoReckonerTotals = async (req, res) => {
  const { siteId, descId } = req.params;
  try {
    // Fetch overall totals
    const [totals] = await db.query(
      `SELECT 
        MAX(po_quantity) AS total_po_quantity, 
        AVG(rate) AS total_rate,
        SUM(value) AS total_value
       FROM po_reckoner 
       WHERE site_id = ? AND desc_id = ?`,
      [siteId, descId]
    );

    if (totals.length === 0 || totals[0].total_po_quantity === null) {
      return res.status(200).json({
        success: true,
        data: { total_po_quantity: 0, total_rate: 0, total_value: 0, subcategory_totals: [] }
      });
    }

    const total_po_quantity = parseFloat(totals[0].total_po_quantity) || 0;
    const total_rate = parseFloat(totals[0].total_rate) || 0;
    const total_value = parseFloat(totals[0].total_value) || 0;

    // Fetch category, subcategory, and work description details
    const [records] = await db.query(
      `SELECT 
        ic.category_id,
        ic.category_name,
        isc.subcategory_name,
        pr.po_quantity,
        pr.rate,
        pr.value,
        pr.desc_id,
        wd.desc_name
       FROM po_reckoner pr
       JOIN item_subcategory isc ON pr.subcategory_id = isc.subcategory_id
       JOIN item_category ic ON pr.category_id = ic.category_id
       LEFT JOIN work_descriptions wd ON pr.desc_id = wd.desc_id
       WHERE pr.site_id = ? AND pr.desc_id = ?`,
      [siteId, descId]
    );

    // Group records by category, work description, and subcategory
    const categoryMap = new Map();
    records.forEach(record => {
      const { category_id, category_name, subcategory_name, po_quantity, rate, value, desc_id, desc_name } = record;
      if (!categoryMap.has(category_id)) {
        categoryMap.set(category_id, {
          category_id,
          category_name,
          descriptions: new Map()
        });
      }
      const category = categoryMap.get(category_id);
      if (!category.descriptions.has(desc_id)) {
        category.descriptions.set(desc_id, {
          desc_id,
          desc_name,
          subcategories: []
        });
      }
      category.descriptions.get(desc_id).subcategories.push({
        subcategory_name,
        po_quantity: parseFloat(po_quantity) || 0,
        rate: parseFloat(rate) || 0,
        value: parseFloat(value) || 0
      });
    });

    // Convert Map to array for response
    const subcategoryTotals = Array.from(categoryMap.values()).map(category => ({
      category_id: category.category_id,
      category_name: category.category_name,
      descriptions: Array.from(category.descriptions.values())
    }));

    // Prepare the response
    const responseData = {
      total_po_quantity,
      total_rate,
      total_value,
      subcategory_totals: subcategoryTotals
    };

    res.status(200).json({ success: true, data: responseData });
  } catch (error) {
    console.error("Error fetching po_reckoner totals:", error);
    res.status(500).json({ success: false, message: "Failed to fetch po_reckoner totals" });
  }
};

exports.getExpenseDetailsBySite = async (req, res) => {
  const { siteId, descId } = req.params;

  try {
    // Fetch total allocated amount from petty_cash
    let pettyCashQuery = `
      SELECT 
        SUM(amount) AS total_allocated
      FROM petty_cash
      WHERE site_id = ? AND desc_id = ?
    `;
    const pettyCashParams = [siteId, descId];

    const [pettyCashTotals] = await db.query(pettyCashQuery, pettyCashParams);
    const total_allocated = parseFloat(pettyCashTotals[0].total_allocated) || 0;

    // Fetch total spent amount from siteincharge_exp_entry
    let totalSpentQuery = `
      SELECT 
        SUM(siee.amount) AS total_spent
      FROM siteincharge_exp_entry siee
      JOIN petty_cash pc ON siee.petty_cash_id = pc.id
      WHERE pc.site_id = ? AND pc.desc_id = ?
    `;
    const totalSpentParams = [siteId, descId];

    const [totalSpentResult] = await db.query(totalSpentQuery, totalSpentParams);
    const total_spent = parseFloat(totalSpentResult[0].total_spent) || 0;

    // Fetch expenses grouped by work description
    let expensesByDescQuery = `
      SELECT 
        d.desc_name,
        SUM(siee.amount) AS total_expense,
        pc.desc_id
      FROM siteincharge_exp_entry siee
      JOIN petty_cash pc ON siee.petty_cash_id = pc.id
      JOIN work_descriptions d ON pc.desc_id = d.desc_id
      WHERE pc.site_id = ? AND pc.desc_id = ?
      GROUP BY d.desc_name, pc.desc_id
      ORDER BY d.desc_name
    `;
    const expensesByDescParams = [siteId, descId];

    const [expensesByDesc] = await db.query(expensesByDescQuery, expensesByDescParams);

    // Fetch expenses grouped by expense category
    let expensesByCategoryQuery = `
      SELECT 
        ec.exp_category AS expense_category_name,
        SUM(siee.amount) AS total_expense
      FROM siteincharge_exp_entry siee
      JOIN petty_cash pc ON siee.petty_cash_id = pc.id
      JOIN expense_category ec ON siee.expense_category_id = ec.id
      WHERE pc.site_id = ? AND pc.desc_id = ?
      GROUP BY ec.exp_category
      ORDER BY ec.exp_category
    `;
    const expensesByCategoryParams = [siteId, descId];

    const [expensesByCategory] = await db.query(expensesByCategoryQuery, expensesByCategoryParams);

    // Fetch date-wise expenses for line chart
    let expensesByDateQuery = `
      SELECT 
        DATE_FORMAT(siee.amount_created_at, '%Y-%m-%d') AS expense_date,
        SUM(siee.amount) AS total_expense
      FROM siteincharge_exp_entry siee
      JOIN petty_cash pc ON siee.petty_cash_id = pc.id
      WHERE pc.site_id = ? AND pc.desc_id = ?
      GROUP BY DATE_FORMAT(siee.amount_created_at, '%Y-%m-%d')
      ORDER BY expense_date
    `;
    const expensesByDateParams = [siteId, descId];

    const [expensesByDate] = await db.query(expensesByDateQuery, expensesByDateParams);

    res.status(200).json({
      success: true,
      data: {
        total_allocated,
        total_spent,
        expenses_by_work_description: expensesByDesc.map(record => ({
          desc_id: record.desc_id,
          desc_name: record.desc_name || "Unknown Description",
          total_expense: parseFloat(record.total_expense) || 0
        })),
        expenses_by_category: expensesByCategory.map(record => ({
          expense_category_name: record.expense_category_name || "Unknown Category",
          total_expense: parseFloat(record.total_expense) || 0
        })),
        expenses_by_date: expensesByDate.map(record => ({
          expense_date: record.expense_date,
          total_expense: parseFloat(record.total_expense) || 0
        }))
      }
    });
  } catch (error) {
    console.error("Error fetching expense details:", error);
    res.status(500).json({ success: false, message: "Failed to fetch expense details" });
  }
};

exports.getWorkDescriptionsBySite = async (req, res) => {
  const { siteId } = req.params;
  try {
    const [descriptions] = await db.query(
      `SELECT DISTINCT wd.desc_id, wd.desc_name
       FROM po_reckoner pr
       JOIN work_descriptions wd ON pr.desc_id = wd.desc_id
       WHERE pr.site_id = ?`,
      [siteId]
    );
    res.status(200).json({ success: true, data: descriptions });
  } catch (error) {
    console.error("Error fetching work descriptions by site:", error);
    res.status(500).json({ success: false, message: "Failed to fetch work descriptions by site" });
  }
};

// Fetch PO totals by site ID and desc ID
exports.getPoTotalBudget = async (req, res) => {
  const { siteId, descId } = req.params;
  try {
    // Fetch a single po_quantity (most frequent if multiple records)
    const [qtyResult] = await db.query(
      `SELECT pr.po_quantity, COUNT(*) as count 
       FROM po_reckoner pr
       WHERE pr.site_id = ? AND pr.desc_id = ? 
       GROUP BY pr.po_quantity 
       ORDER BY count DESC, pr.po_quantity DESC 
       LIMIT 1`,
      [siteId, descId]
    );

    const total_po_qty = qtyResult.length > 0 ? parseFloat(qtyResult[0].po_quantity) || 0 : 0;

    // Fetch sum of rate
    const [rateResult] = await db.query(
      `SELECT SUM(pr.rate) AS total_rate
       FROM po_reckoner pr
       WHERE pr.site_id = ? AND pr.desc_id = ?`,
      [siteId, descId]
    );

    const total_rate = rateResult.length > 0 ? parseFloat(rateResult[0].total_rate) || 0 : 0;

    // Calculate total_po_value
    const total_po_value = total_po_qty * total_rate;

    // Fetch the most frequent uom
    const [uomResult] = await db.query(
      `SELECT pr.uom, COUNT(*) as count 
       FROM po_reckoner pr
       WHERE pr.site_id = ? AND pr.desc_id = ? 
       GROUP BY pr.uom 
       ORDER BY count DESC 
       LIMIT 1`,
      [siteId, descId]
    );
    const uom = uomResult.length > 0 ? uomResult[0].uom : 'unknown';

    // Fetch desc_name
    const [descResult] = await db.query(
      `SELECT desc_name FROM work_descriptions WHERE desc_id = ?`,
      [descId]
    );
    const desc_name = descResult.length > 0 ? descResult[0].desc_name : 'Unknown';

    res.status(200).json({
      success: true,
      data: {
        total_po_qty,
        total_rate,
        total_po_value,
        uom,
        desc_name
      }
    });
  } catch (error) {
    console.error("Error fetching PO totals:", error);
    res.status(500).json({ success: false, message: "Failed to fetch PO totals" });
  }
};

// Check if budget exists for site_id and desc_id
exports.getPoBudget = async (req, res) => {
  const { site_id, desc_id } = req.query;

  // Validate query parameters
  if (!site_id || !desc_id) {
    return res.status(400).json({
      success: false,
      message: "site_id and desc_id are required query parameters",
    });
  }

  try {
    const [budget] = await db.query(
      `SELECT id, site_id, desc_id, total_po_value, total_budget_value, created_at, updated_at 
       FROM po_budget 
       WHERE site_id = ? AND desc_id = ?`,
      [site_id, desc_id]
    );
    res.status(200).json({
      success: true,
      data: budget.length > 0 ? budget[0] : null,
    });
  } catch (error) {
    console.error("Error searching PO budget:", error);
    res.status(500).json({
      success: false,
      message: "Failed to search PO budget",
      error: error.message,
    });
  }
};

// Save budget details to po_budget table
exports.savePoBudget = async (req, res) => {
  const { site_id, desc_id, total_po_value, total_budget_value } = req.body;

  // Validate input
  if (!site_id || !desc_id || !total_po_value || !total_budget_value) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields: site_id, desc_id, total_po_value, total_budget_value",
    });
  }

  try {
    // Check if a record already exists for the site_id and desc_id
    const [existing] = await db.query(
      `SELECT id FROM po_budget WHERE site_id = ? AND desc_id = ?`,
      [site_id, desc_id]
    );

    if (existing.length > 0) {
      // Update existing record
      await db.query(
        `UPDATE po_budget 
         SET total_po_value = ?, total_budget_value = ?, updated_at = CURRENT_TIMESTAMP 
         WHERE site_id = ? AND desc_id = ?`,
        [total_po_value, total_budget_value, site_id, desc_id]
      );
      return res.status(200).json({
        success: true,
        message: "Budget updated successfully",
      });
    } else {
      // Insert new record
      await db.query(
        `INSERT INTO po_budget (site_id, desc_id, total_po_value, total_budget_value) 
         VALUES (?, ?, ?, ?)`,
        [site_id, desc_id, total_po_value, total_budget_value]
      );
      return res.status(201).json({
        success: true,
        message: "Budget saved successfully",
      });
    }
  } catch (error) {
    console.error("Error saving PO budget:", error);
    res.status(500).json({
      success: false,
      message: "Failed to save budget",
      error: error.message,
    });
  }
};

exports.getOverheads = async (req, res) => {
  const { po_budget_id } = req.query;

  try {
    let query = `
      SELECT DISTINCT o.id, o.expense_name, o.is_default
      FROM overhead o
    `;
    let params = [];

    if (po_budget_id) {
      query = `
        SELECT DISTINCT o.id, o.expense_name, o.is_default
        FROM overhead o
        LEFT JOIN actual_budget ab ON o.id = ab.overhead_id AND ab.po_budget_id = ?
      `;
      params = [po_budget_id];
    }

    const [overheads] = await db.query(query, params);
    res.status(200).json({
      success: true,
      data: overheads,
    });
  } catch (error) {
    console.error("Error fetching overheads:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch overheads",
      error: error.message,
    });
  }
};

// Save a new overhead
exports.saveOverhead = async (req, res) => {
  const { expense_name } = req.body;

  if (!expense_name) {
    return res.status(400).json({
      success: false,
      message: "Expense name is required",
    });
  }

  try {
    const [result] = await db.query(
      `INSERT INTO overhead (expense_name, is_default) VALUES (?, 0)`,
      [expense_name]
    );

    res.status(200).json({
      success: true,
      message: "Overhead saved successfully",
      data: { id: result.insertId, expense_name, is_default: 0 },
    });
  } catch (error) {
    console.error("Error saving overhead:", error);
    res.status(500).json({
      success: false,
      message: "Failed to save overhead",
      error: error.message,
    });
  }
};

// Save or update actual budget entries (updated to allocate only once, no updates)
exports.saveActualBudget = async (req, res) => {
  const { po_budget_id, actual_budget_entries } = req.body;

  if (!po_budget_id || !Array.isArray(actual_budget_entries) || actual_budget_entries.length === 0) {
    return res.status(400).json({
      success: false,
      message: "po_budget_id and actual_budget_entries array are required",
    });
  }

  try {
    // Check if already allocated
    const [existing] = await db.query(
      `SELECT id FROM actual_budget WHERE po_budget_id = ?`,
      [po_budget_id]
    );
    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Budget already allocated and cannot be re-allocated",
      });
    }

    // Fetch total_budget_value from po_budget
    const [poBudget] = await db.query(
      `SELECT total_budget_value FROM po_budget WHERE id = ?`,
      [po_budget_id]
    );
    if (!poBudget.length) {
      return res.status(404).json({
        success: false,
        message: "PO budget not found",
      });
    }
    const total_budget_value = parseFloat(poBudget[0].total_budget_value);

    // Validate sum of splitted_budget values
    const total_splitted = actual_budget_entries.reduce((sum, entry) => {
      return entry.splitted_budget ? sum + parseFloat(entry.splitted_budget) : sum;
    }, 0);
    if (Math.abs(total_splitted - total_budget_value) > 0.01) {
      return res.status(400).json({
        success: false,
        message: `Sum of splitted budget values (${total_splitted.toFixed(2)}) must equal total budget value (${total_budget_value.toFixed(2)})`,
      });
    }

    // Insert new entries (no update)
    for (const entry of actual_budget_entries) {
      const { overhead_id, splitted_budget, actual_value, remarks } = entry;
      const difference_value = actual_value !== null && splitted_budget !== null
        ? parseFloat(splitted_budget) - parseFloat(actual_value)
        : null;

      await db.query(
        `INSERT INTO actual_budget (overhead_id, po_budget_id, splitted_budget, actual_value, difference_value, remarks)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [overhead_id, po_budget_id, splitted_budget, actual_value, difference_value, remarks]
      );
    }

    res.status(200).json({
      success: true,
      message: "Budget allocated successfully",
    });
  } catch (error) {
    console.error("Error allocating budget:", error);
    res.status(500).json({
      success: false,
      message: "Failed to allocate budget",
      error: error.message,
    });
  }
};

exports.getActualBudgetEntries = async (req, res) => {
  const { po_budget_id } = req.params;

  if (!po_budget_id) {
    return res.status(400).json({
      success: false,
      message: "po_budget_id is required",
    });
  }

  try {
    const [rows] = await db.query(
      `SELECT ab.overhead_id, o.expense_name, ab.splitted_budget, ab.actual_value, ab.difference_value, ab.remarks, pb.site_id, pb.desc_id
       FROM actual_budget ab
       JOIN po_budget pb ON ab.po_budget_id = pb.id
       JOIN overhead o ON ab.overhead_id = o.id
       WHERE ab.po_budget_id = ?`,
      [po_budget_id]
    );
    
    const entries = {};
    rows.forEach((row) => {
      entries[row.overhead_id] = {
        expense_name: row.expense_name || "Unknown Expense",
        splitted_budget: row.splitted_budget !== null ? parseFloat(row.splitted_budget).toFixed(2) : null,
        actual_value: row.actual_value !== null ? parseFloat(row.actual_value).toFixed(2) : null,
        difference_value: row.difference_value !== null ? parseFloat(row.difference_value).toFixed(2) : null,
        remarks: row.remarks || "",
        site_id: row.site_id,
        desc_id: row.desc_id,
      };
    });

    res.status(200).json({
      success: true,
      data: entries,
    });
  } catch (error) {
    console.error("Error fetching actual budget entries:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch actual budget entries",
      error: error.message,
    });
  }
};


exports.getActualBudget = async (req, res) => {
  const { po_budget_id } = req.params;

  try {
    const [entries] = await db.query(
      `SELECT overhead_id, po_budget_id, splitted_budget, actual_value, difference_value, remarks
       FROM actual_budget
       WHERE po_budget_id = ?`,
      [po_budget_id]
    );

    const formattedEntries = {};
    entries.forEach(entry => {
      formattedEntries[entry.overhead_id] = {
        overhead_id: entry.overhead_id,
        po_budget_id: entry.po_budget_id,
        splitted_budget: entry.splitted_budget ? parseFloat(entry.splitted_budget).toFixed(2) : null,
        actual_value: entry.actual_value ? parseFloat(entry.actual_value).toFixed(2) : null,
        difference_value: entry.difference_value ? parseFloat(entry.difference_value).toFixed(2) : null,
        remarks: entry.remarks || null,
      };
    });

    res.status(200).json({
      success: true,
      data: formattedEntries,
    });
  } catch (error) {
    console.error("Error fetching actual budget entries:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch actual budget entries",
      error: error.message,
    });
  }
};

exports.fetchMaterialPlanningBudget = async (req, res) => {
  const { site_id, desc_id } = req.query;

  if (!site_id || !desc_id) {
    return res.status(400).json({
      success: false,
      message: "site_id and desc_id are required",
    });
  }

  try {
    // Step 1: Find po_budget_id from po_budget table
    const [poBudgetRows] = await db.query(
      `SELECT id FROM po_budget WHERE site_id = ? AND desc_id = ?`,
      [site_id, desc_id]
    );

    if (poBudgetRows.length === 0) {
      return res.status(200).json({
        success: true,
        splitted_budget: null,
        assigned_budget: "0.00",
        balance_budget: null,
      });
    }

    const po_budget_id = poBudgetRows[0].id;

    // Step 2: Fetch splitted_budget from actual_budget where overhead_id = 1
    const [budgetRows] = await db.query(
      `SELECT splitted_budget
       FROM actual_budget
       WHERE po_budget_id = ? AND overhead_id = 1`,
      [po_budget_id]
    );

    const splitted_budget = budgetRows.length > 0 && budgetRows[0].splitted_budget !== null
      ? parseFloat(budgetRows[0].splitted_budget).toFixed(2)
      : null;

    // Step 3: Fetch assigned_budget as sum(quantity * rate) from material_assign
    const [assignedRows] = await db.query(
      `SELECT IFNULL(SUM(quantity * rate), 0) AS assigned_budget
       FROM material_assign
       WHERE site_id = ? AND desc_id = ?`,
      [site_id, desc_id]
    );

    const assigned_budget = parseFloat(assignedRows[0].assigned_budget).toFixed(2);

    // Step 4: Calculate balance_budget
    const balance_budget = splitted_budget !== null
      ? (parseFloat(splitted_budget) - parseFloat(assigned_budget)).toFixed(2)
      : null;

    res.status(200).json({
      success: true,
      splitted_budget,
      assigned_budget,
      balance_budget,
    });
  } catch (error) {
    console.error("Error fetching material planning budget:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch material planning budget",
      error: error.message,
    });
  }
};



// Fetch contractors
exports.getContractors = async (req, res) => {
  try {
    const [contractors] = await db.query("SELECT id, contractor_name FROM contractor");
    res.status(200).json({ success: true, data: contractors });
  } catch (error) {
    console.error("Error fetching contractors:", error);
    res.status(500).json({ success: false, message: "Failed to fetch contractors" });
  }
};

// Save labour data
exports.addLabour = async (req, res) => {
  const {
    full_name, date_of_birth, date_of_joining, company, branch, mobile, company_email,
    current_address, permanent_address, gender_id, dept_id, emp_type_id, designation_id,
    status_id, esic_number, pf_number, contractor_id, approved_salary
  } = req.body;

  // Validate required fields
  if (!full_name || !date_of_birth || !date_of_joining || !company || !branch || !mobile ||
      !company_email || !current_address || !permanent_address || !gender_id || !dept_id ||
      !emp_type_id || !designation_id || !status_id) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields"
    });
  }

  try {
    // Insert into labour table
    const [result] = await db.query(
      `INSERT INTO labour (
        full_name, date_of_birth, date_of_joining, company, branch, mobile, company_email,
        current_address, permanent_address, gender_id, dept_id, emp_type_id, designation_id,
        status_id, esic_number, pf_number, contractor_id, approved_salary, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        full_name, date_of_birth, date_of_joining, company, branch, mobile, company_email,
        current_address, permanent_address, gender_id, dept_id, emp_type_id, designation_id,
        status_id, esic_number || null, pf_number || null, contractor_id || null,
        approved_salary || null
      ]
    );

    res.status(201).json({
      success: true,
      message: "Labour added successfully",
      data: { id: result.insertId, ...req.body }
    });
  } catch (error) {
    console.error("Error adding labour:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add labour",
      error: error.message
    });
  }
};


// Fetch all labour employees
exports.getLabourEmployees = async (req, res) => {
  try {
    const [labourEmployees] = await db.query(
      "SELECT id, full_name, approved_salary FROM labour WHERE status_id = 1"
    );
    res.status(200).json({ success: true, data: labourEmployees });
  } catch (error) {
    console.error("Error fetching labour employees:", error);
    res.status(500).json({ success: false, message: "Failed to fetch labour employees" });
  }
};

// Save labour assignments
exports.saveLabourAssignment = async (req, res) => {
  const {
    project_id,
    site_id,
    desc_id,
    labour_ids,
    from_date,
    to_date,
    created_by
  } = req.body;

  if (!project_id || !site_id || !desc_id || !labour_ids || !from_date || !to_date || !created_by) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields"
    });
  }

  try {
    // Get approved_salary for each labour_id
    const labourIdsString = labour_ids.join(",");
    const [labourData] = await db.query(
      `SELECT id, approved_salary FROM labour WHERE id IN (${labourIdsString})`
    );

    // Create assignment entries
    const assignments = labourData.map(labour => ({
      project_id,
      site_id,
      desc_id,
      labour_id: labour.id,
      salary: labour.approved_salary,
      from_date,
      to_date,
      created_by
    }));

    // Insert assignments
    for (const assignment of assignments) {
      await db.query(
        `INSERT INTO labour_assignment 
         (project_id, site_id, desc_id, labour_id, salary, from_date, to_date, created_by, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
        [
          assignment.project_id,
          assignment.site_id,
          assignment.desc_id,
          assignment.labour_id,
          assignment.salary,
          assignment.from_date,
          assignment.to_date,
          assignment.created_by
        ]
      );
    }

    res.status(201).json({
      success: true,
      message: "Labour assignments saved successfully"
    });
  } catch (error) {
    console.error("Error saving labour assignments:", error);
    res.status(500).json({
      success: false,
      message: "Failed to save labour assignments",
      error: error.message
    });
  }
};


// Fetch material graph with item names from material_master, dispatched quantities, acknowledged quantities, and used quantities
exports.materialgraph = async (req, res) => {
  const { siteId, descId } = req.params;

  try {
    const [planningRows] = await db.query(
      `SELECT 
         ma.item_id, 
         mm.item_name, 
         SUM(ma.quantity) AS total_planning,
         (SELECT SUM(md.dispatch_qty) 
          FROM material_dispatch md 
          WHERE md.material_assign_id IN 
            (SELECT ma2.id FROM material_assign ma2 
             WHERE ma2.item_id = ma.item_id 
             AND ma2.site_id = ? AND ma2.desc_id = ?)
         ) AS total_dispatched,
         (SELECT SUM(ma_ack.comp_a_qty + ma_ack.comp_b_qty + ma_ack.comp_c_qty) 
          FROM material_acknowledgement ma_ack
          JOIN material_dispatch md ON ma_ack.material_dispatch_id = md.id
          WHERE md.material_assign_id IN 
            (SELECT ma2.id FROM material_assign ma2 
             WHERE ma2.item_id = ma.item_id 
             AND ma2.site_id = ? AND ma2.desc_id = ?)
         ) AS total_acknowledged,
         (SELECT SUM(mu.overall_qty) 
          FROM material_usage mu
          JOIN material_acknowledgement ma_ack ON mu.material_ack_id = ma_ack.id
          JOIN material_dispatch md ON ma_ack.material_dispatch_id = md.id
          WHERE md.material_assign_id IN 
            (SELECT ma2.id FROM material_assign ma2 
             WHERE ma2.item_id = ma.item_id 
             AND ma2.site_id = ? AND ma2.desc_id = ?)
         ) AS total_used
       FROM material_assign ma
       JOIN material_master mm ON ma.item_id = mm.item_id
       WHERE ma.site_id = ? AND ma.desc_id = ?
       GROUP BY ma.item_id, mm.item_name`,
      [siteId, descId, siteId, descId, siteId, descId, siteId, descId]
    );

    const materialPlanning = planningRows.map(row => ({
      item_id: row.item_id,
      item_name: row.item_name || 'Unknown',
      total_planning: row.total_planning ? parseFloat(parseFloat(row.total_planning).toFixed(2)) : 0,
      total_dispatched: row.total_dispatched ? parseFloat(parseFloat(row.total_dispatched).toFixed(2)) : 0,
      total_acknowledged: row.total_acknowledged ? parseFloat(parseFloat(row.total_acknowledged).toFixed(2)) : 0,
      total_used: row.total_used ? parseFloat(parseFloat(row.total_used).toFixed(2)) : 0
    }));

    // Additional query for usage history, grouped by entry_date
    const [historyRows] = await db.query(
      `SELECT 
         muh.entry_date,
         ma.item_id,
         mm.item_name,
         SUM(muh.overall_qty) AS overall_qty
       FROM material_usage_history muh
       JOIN material_acknowledgement mack ON muh.material_ack_id = mack.id
       JOIN material_dispatch md ON mack.material_dispatch_id = md.id
       JOIN material_assign ma ON md.material_assign_id = ma.id
       JOIN material_master mm ON ma.item_id = mm.item_id
       WHERE ma.site_id = ? AND ma.desc_id = ?
       GROUP BY muh.entry_date, ma.item_id, mm.item_name
       ORDER BY muh.entry_date`,
      [siteId, descId]
    );

    const usageHistory = historyRows.map(row => ({
      entry_date: row.entry_date,
      item_id: row.item_id,
      item_name: row.item_name || 'Unknown',
      overall_qty: row.overall_qty ? parseFloat(parseFloat(row.overall_qty).toFixed(2)) : 0
    }));

    res.status(200).json({
      success: true,
      data: {
        material_planning: materialPlanning,
        usage_history: usageHistory
      }
    });
  } catch (error) {
    console.error("Error fetching material graph:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch material graph"
    });
  }
};

module.exports = exports;