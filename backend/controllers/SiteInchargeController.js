const db = require('../config/db');


exports.getCompletionEntries = async (req, res) => {
  try {
    const { rec_id, date } = req.query;

    if (!rec_id || isNaN(rec_id)) {
      return res.status(400).json({
        status: 'error',
        message: 'rec_id is required and must be a number',
      });
    }

    // Fetch cumulative area up to the given date
    let cumulativeQuery = `
      SELECT COALESCE(SUM(area_added), 0) as cumulative_area
      FROM completion_entries_history
      WHERE rec_id = ? AND entry_date <= ?
    `;
    const [cumulativeResult] = await db.query(cumulativeQuery, [rec_id, date || new Date().toISOString().split('T')[0]]);

    // Fetch entries for the exact date
    let entriesQuery = `
      SELECT entry_id, area_added, rate, value_added, created_by, created_at
      FROM completion_entries_history
      WHERE rec_id = ? AND entry_date = ?
      ORDER BY created_at DESC
    `;
    const [entries] = await db.query(entriesQuery, [rec_id, date || new Date().toISOString().split('T')[0]]);

    res.status(200).json({
      status: 'success',
      data: {
        entries,
        cumulative_area: parseFloat(cumulativeResult[0].cumulative_area) || 0,
      },
    });
  } catch (error) {
    console.error('Error in getCompletionEntries:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      error: error.message,
    });
  }
};

exports.saveCompletionStatus = async (req, res) => {
  try {
    const { rec_id, area_added, rate, value, created_by, entry_date } = req.body;
    const today = new Date().toISOString().split('T')[0];

    // Validate inputs
    if (!rec_id || typeof rec_id !== 'number') {
      return res.status(400).json({ status: 'error', message: 'rec_id is required and must be a number' });
    }
    if (area_added === undefined || typeof area_added !== 'number' || area_added < 0) {
      return res.status(400).json({ status: 'error', message: 'area_added is required and must be a non-negative number' });
    }
    if (rate === undefined || typeof rate !== 'number' || rate < 0) {
      return res.status(400).json({ status: 'error', message: 'rate is required and must be a non-negative number' });
    }
    if (value === undefined || typeof value !== 'number' || value < 0) {
      return res.status(400).json({ status: 'error', message: 'value is required and must be a non-negative number' });
    }
    if (!created_by || typeof created_by !== 'number') {
      return res.status(400).json({ status: 'error', message: 'created_by is required and must be a number' });
    }
    if (!entry_date || !/^\d{4}-\d{2}-\d{2}$/.test(entry_date) || entry_date > today) {
      return res.status(400).json({ status: 'error', message: 'entry_date is required, must be in YYYY-MM-DD format, and cannot be in the future' });
    }

    // Check rec_id exists in po_reckoner and get po_quantity
    const [reckonerRecord] = await db.query(
      'SELECT rec_id, po_quantity FROM po_reckoner WHERE rec_id = ?',
      [rec_id]
    );
    if (reckonerRecord.length === 0) {
      return res.status(400).json({ status: 'error', message: `Invalid rec_id (${rec_id}): record does not exist in po_reckoner` });
    }
    const po_quantity = parseFloat(reckonerRecord[0].po_quantity);

    // Check created_by exists
    const [userRecord] = await db.query('SELECT user_id FROM users WHERE user_id = ?', [created_by]);
    if (userRecord.length === 0) {
      return res.status(400).json({ status: 'error', message: `Invalid created_by (${created_by}): user does not exist` });
    }

    // Calculate server-side value_added
    const calculatedValue = parseFloat(area_added) * parseFloat(rate);
    if (Math.abs(calculatedValue - value) > 0.01) {
      return res.status(400).json({
        status: 'error',
        message: `Invalid value: expected ${calculatedValue.toFixed(2)}, received ${value}`,
      });
    }

    // Check current completion_status
    const [completionRecord] = await db.query(
      'SELECT area_completed, rate, value, created_by FROM completion_status WHERE rec_id = ?',
      [rec_id]
    );

    // Insert new entry into completion_entries_history
    await db.query(
      `
        INSERT INTO completion_entries_history
        (rec_id, entry_date, area_added, rate, value_added, created_by, created_at)
        VALUES (?, ?, ?, ?, ?, ?, NOW())
      `,
      [rec_id, entry_date, parseFloat(area_added), parseFloat(rate), calculatedValue, created_by]
    );

    // Calculate new cumulative area
    const [currentCumulative] = await db.query(
      'SELECT COALESCE(SUM(area_added), 0) as current_area FROM completion_entries_history WHERE rec_id = ?',
      [rec_id]
    );
    const new_area = parseFloat(currentCumulative[0].current_area) || 0;
    if (new_area > po_quantity) {
      return res.status(400).json({ status: 'error', message: `Completed area cannot exceed PO quantity (${po_quantity})` });
    }

    // Prepare cumulative data
    const completionData = {
      rec_id,
      area_completed: new_area,
      rate: parseFloat(rate),
      value: parseFloat((new_area * rate).toFixed(2)),
      created_by,
      work_status: 'In Progress',
      billing_status: 'Not Billed',
    };

    // Update or insert into completion_status
    let result;
    if (completionRecord.length === 0) {
      // No existing completion_status record, insert new one
      [result] = await db.query(
        `
          INSERT INTO completion_status
          (rec_id, area_completed, rate, value, created_by, work_status, billing_status, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
        `,
        [
          completionData.rec_id,
          completionData.area_completed,
          completionData.rate,
          completionData.value,
          completionData.created_by,
          completionData.work_status,
          completionData.billing_status,
        ]
      );
      res.status(201).json({
        status: 'success',
        message: 'Completion entry created successfully',
        data: completionData,
      });
    } else {
      // Update completion_status
      [result] = await db.query(
        `
          UPDATE completion_status
          SET
            area_completed = ?,
            rate = ?,
            value = ?,
            created_by = ?,
            work_status = ?,
            billing_status = ?,
            updated_at = NOW()
          WHERE rec_id = ?
        `,
        [
          completionData.area_completed,
          completionData.rate,
          completionData.value,
          completionData.created_by,
          completionData.work_status,
          completionData.billing_status,
          completionData.rec_id,
        ]
      );
      res.status(200).json({
        status: 'success',
        message: 'Completion entry updated successfully',
        data: completionData,
      });
    }
  } catch (error) {
    console.error('Error in saveCompletionStatus:', error);
    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid rec_id or created_by: referenced record does not exist',
      });
    }
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      error: error.message,
    });
  }
};

exports.getCompletionEntriesBySiteID = async (req, res) => {
  try {
    const { site_id } = req.params;
    const { start_date, end_date } = req.query;

  
    if (start_date && !/^\d{4}-\d{2}-\d{2}$/.test(start_date)) {
      return res.status(400).json({
        status: 'error',
        message: 'start_date must be in YYYY-MM-DD format',
      });
    }
    if (end_date && !/^\d{4}-\d{2}-\d{2}$/.test(end_date)) {
      return res.status(400).json({
        status: 'error',
        message: 'end_date must be in YYYY-MM-DD format',
      });
    }
    if (start_date && end_date && start_date > end_date) {
      return res.status(400).json({
        status: 'error',
        message: 'start_date cannot be later than end_date',
      });
    }

    // Build query with joins to fetch category_name and subcategory_name
    let query = `
      SELECT 
        ic.category_name,
        isc.subcategory_name,
        DATE_FORMAT(ceh.entry_date, '%Y-%m-%d') as entry_date,
        ceh.entry_id,
        ceh.area_added,
        ceh.rate,
        ceh.value_added,
        ceh.created_by,
        DATE_FORMAT(CONVERT_TZ(ceh.created_at, '+00:00', '+05:30'), '%Y-%m-%d') as created_date,
        DATE_FORMAT(CONVERT_TZ(ceh.created_at, '+00:00', '+05:30'), '%H:%i:%s') as created_time
      FROM completion_entries_history ceh
      JOIN po_reckoner pr ON ceh.rec_id = pr.rec_id
      JOIN item_category ic ON pr.category_id = ic.category_id
      JOIN item_subcategory isc ON pr.subcategory_id = isc.subcategory_id
      WHERE pr.site_id = ?
    `;
    const queryParams = [site_id];

    if (start_date) {
      query += ' AND ceh.entry_date >= ?';
      queryParams.push(start_date);
    }
    if (end_date) {
      query += ' AND ceh.entry_date <= ?';
      queryParams.push(end_date);
    }

    query += ' ORDER BY ic.category_name, isc.subcategory_name, ceh.entry_date, ceh.created_at';

    const [rows] = await db.query(query, queryParams);

    // Structure the data
    const groupedData = [];
    const categoryMap = new Map();

    rows.forEach(row => {
      const { category_name, subcategory_name, entry_date, created_date, created_time, ...entry } = row;

      // Find or create category
      let category = categoryMap.get(category_name);
      if (!category) {
        category = { category_name, subcategories: [] };
        categoryMap.set(category_name, category);
        groupedData.push(category);
      }

      // Find or create subcategory
      let subcategory = category.subcategories.find(sc => sc.subcategory_name === subcategory_name);
      if (!subcategory) {
        subcategory = { subcategory_name, entries_by_date: [] };
        category.subcategories.push(subcategory);
      }

      // Find or create date entry
      let dateEntry = subcategory.entries_by_date.find(de => de.entry_date === entry_date);
      if (!dateEntry) {
        dateEntry = { entry_date, entries: [] };
        subcategory.entries_by_date.push(dateEntry);
      }

      // Add entry with separate date and time fields
      dateEntry.entries.push({
        entry_id: row.entry_id,
        area_added: parseFloat(row.area_added),
        rate: parseFloat(row.rate),
        value_added: parseFloat(row.value_added),
        created_by: row.created_by,
        created_date: row.created_date,
        created_time: row.created_time
      });
    });

    res.status(200).json({
      status: 'success',
      data: groupedData
    });
  } catch (error) {
    console.error('Error in getCompletionEntriesByCategory:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      error: error.message,
    });
  }
};


exports.saveMaterialAcknowledgement = async (req, res) => {
  try {
    const { material_dispatch_id, comp_a_qty, comp_b_qty, comp_c_qty, comp_a_remarks, comp_b_remarks, comp_c_remarks, overall_quantity, remarks } = req.body;

    // Log incoming request body for debugging
    console.log('Request body:', req.body);

    // Validate material_dispatch_id
    if (!material_dispatch_id || isNaN(material_dispatch_id)) {
      return res.status(400).json({ status: 'error', message: 'material_dispatch_id is required and must be a number' });
    }

    // Convert material_dispatch_id to integer
    const dispatchId = parseInt(material_dispatch_id);
    if (isNaN(dispatchId)) {
      return res.status(400).json({ status: 'error', message: 'material_dispatch_id must be a valid number' });
    }

    // Validate quantities if provided
    const validateQuantity = (qty, field) => {
      if (qty === null || qty === undefined) return null;
      const parsed = parseInt(qty);
      if (isNaN(parsed) || parsed < 0) {
        throw new Error(`${field} must be a non-negative number or null`);
      }
      return parsed;
    };

    const validatedCompAQty = validateQuantity(comp_a_qty, 'comp_a_qty');
    const validatedCompBQty = validateQuantity(comp_b_qty, 'comp_b_qty');
    const validatedCompCQty = validateQuantity(comp_c_qty, 'comp_c_qty');
    const validatedOverallQuantity = validateQuantity(overall_quantity, 'overall_quantity');

    // Validate remarks if provided
    if (comp_a_remarks && typeof comp_a_remarks !== 'string') {
      return res.status(400).json({ status: 'error', message: 'comp_a_remarks must be a string' });
    }
    if (comp_b_remarks && typeof comp_b_remarks !== 'string') {
      return res.status(400).json({ status: 'error', message: 'comp_b_remarks must be a string' });
    }
    if (comp_c_remarks && typeof comp_c_remarks !== 'string') {
      return res.status(400).json({ status: 'error', message: 'comp_c_remarks must be a string' });
    }
    if (remarks && typeof remarks !== 'string') {
      return res.status(400).json({ status: 'error', message: 'remarks must be a string' });
    }

    // Check database connection
    try {
      await db.query('SELECT 1');
    } catch (dbError) {
      console.error('Database connection error:', dbError);
      return res.status(500).json({ status: 'error', message: 'Database connection failed', error: dbError.message });
    }

    // Check if material_dispatch_id exists
    const [dispatchRecord] = await db.query('SELECT id FROM material_dispatch WHERE id = ?', [dispatchId]);
    if (dispatchRecord.length === 0) {
      return res.status(400).json({ status: 'error', message: `Invalid material_dispatch_id (${dispatchId}): record does not exist` });
    }

    // Check if acknowledgement already exists
    const [existingAck] = await db.query('SELECT id FROM material_acknowledgement WHERE material_dispatch_id = ?', [dispatchId]);
    if (existingAck.length > 0) {
      return res.status(400).json({ status: 'error', message: `Acknowledgement already exists for material_dispatch_id (${dispatchId})` });
    }

    // Insert into material_acknowledgement
    const [result] = await db.query(
      `
        INSERT INTO material_acknowledgement
        (material_dispatch_id, comp_a_qty, comp_b_qty, comp_c_qty, comp_a_remarks, comp_b_remarks, comp_c_remarks, overall_quantity, remarks, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
      `,
      [
        dispatchId,
        validatedCompAQty,
        validatedCompBQty,
        validatedCompCQty,
        comp_a_remarks || null,
        comp_b_remarks || null,
        comp_c_remarks || null,
        validatedOverallQuantity,
        remarks || null
      ]
    );

    res.status(201).json({
      status: 'success',
      message: 'Material acknowledgement saved successfully',
      data: {
        id: result.insertId,
        material_dispatch_id: dispatchId,
        comp_a_qty: validatedCompAQty,
        comp_b_qty: validatedCompBQty,
        comp_c_qty: validatedCompCQty,
        comp_a_remarks: comp_a_remarks || null,
        comp_b_remarks: comp_b_remarks || null,
        comp_c_remarks: comp_c_remarks || null,
        overall_quantity: validatedOverallQuantity,
        remarks: remarks || null
      }
    });
  } catch (error) {
    console.error('Error in saveMaterialAcknowledgement:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({
        status: 'error',
        message: 'Acknowledgement already exists for this material dispatch'
      });
    }
    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid material_dispatch_id: referenced record does not exist'
      });
    }
    if (error.code === 'ER_BAD_FIELD_ERROR') {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid data format in request',
        error: error.message
      });
    }
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      error: error.message
    });
  }
};


exports.getAcknowledgementDetails = async (req, res) => {
  try {
    const { material_dispatch_id } = req.query;

    if (!material_dispatch_id || isNaN(material_dispatch_id)) {
      return res.status(400).json({
        status: 'error',
        message: 'material_dispatch_id is required and must be a number',
      });
    }

    const dispatchId = parseInt(material_dispatch_id);
    if (isNaN(dispatchId)) {
      return res.status(400).json({
        status: 'error',
        message: 'material_dispatch_id must be a valid number',
      });
    }

    const query = `
      SELECT 
        id AS ack_id,
        material_dispatch_id,
        comp_a_qty AS ack_comp_a_qty,
        comp_b_qty AS ack_comp_b_qty,
        comp_c_qty AS ack_comp_c_qty,
        comp_a_remarks AS ack_comp_a_remarks,
        comp_b_remarks AS ack_comp_b_remarks,
        comp_c_remarks AS ack_comp_c_remarks,
        overall_quantity AS ack_overall_quantity,
        remarks AS ack_remarks,
        created_at AS ack_created_at,
        updated_at AS ack_updated_at
      FROM material_acknowledgement
      WHERE material_dispatch_id = ?
    `;

    const [rows] = await db.query(query, [dispatchId]);

    const data = rows.map(row => ({
      id: row.ack_id,
      material_dispatch_id: row.material_dispatch_id,
      acknowledgement: {
        id: row.ack_id,
        comp_a_qty: row.ack_comp_a_qty,
        comp_b_qty: row.ack_comp_b_qty,
        comp_c_qty: row.ack_comp_c_qty,
        comp_a_remarks: row.ack_comp_a_remarks,
        comp_b_remarks: row.ack_comp_b_remarks,
        comp_c_remarks: row.ack_comp_c_remarks,
        overall_quantity: row.ack_overall_quantity,
        remarks: row.ack_remarks,
        created_at: row.ack_created_at,
        updated_at: row.ack_updated_at
      }
    }));

    res.status(200).json({
      status: 'success',
      message: 'Acknowledgement details fetched successfully',
      data
    });
  } catch (error) {
    console.error('Error in getAcknowledgementDetails:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      error: error.message
    });
  }
};

exports.saveMaterialUsage = async (req, res) => {
  try {
    const { material_ack_id, entry_date, overall_qty, remarks, created_by } = req.body;

    // Log incoming request body for debugging
    console.log('Request body:', req.body);

    // Validate material_ack_id
    if (!material_ack_id || isNaN(material_ack_id)) {
      return res.status(400).json({ status: 'error', message: 'material_ack_id is required and must be a number' });
    }

    // Convert material_ack_id to integer
    const ackId = parseInt(material_ack_id);
    if (isNaN(ackId)) {
      return res.status(400).json({ status: 'error', message: 'material_ack_id must be a valid number' });
    }

    // Validate entry_date
    if (!entry_date || !/^\d{4}-\d{2}-\d{2}$/.test(entry_date)) {
      return res.status(400).json({ status: 'error', message: 'entry_date is required in YYYY-MM-DD format' });
    }

    // Validate overall_qty if provided
    const validateQuantity = (qty, field) => {
      if (qty === null || qty === undefined) return null;
      const parsed = parseInt(qty);
      if (isNaN(parsed) || parsed < 0) {
        throw new Error(`${field} must be a non-negative number or null`);
      }
      return parsed;
    };

    const validatedOverallQty = validateQuantity(overall_qty, 'overall_qty');

    // Validate remarks if provided
    if (remarks && typeof remarks !== 'string') {
      return res.status(400).json({ status: 'error', message: 'remarks must be a string' });
    }

    // Check database connection
    try {
      await db.query('SELECT 1');
    } catch (dbError) {
      console.error('Database connection error:', dbError);
      return res.status(500).json({ status: 'error', message: 'Database connection failed', error: dbError.message });
    }

    // Check if material_ack_id exists and get acknowledged quantities
    const [ackRecord] = await db.query('SELECT overall_quantity FROM material_acknowledgement WHERE id = ?', [ackId]);
    if (ackRecord.length === 0) {
      return res.status(400).json({ status: 'error', message: `Invalid material_ack_id (${ackId}): record does not exist` });
    }
    const ack = ackRecord[0];
    const sumAck = ack.overall_quantity || 0;

    // Validate new overall_qty won't exceed acknowledged sum
    const [currentUsage] = await db.query(
      `SELECT COALESCE(SUM(overall_qty), 0) AS overall_qty
       FROM material_usage_history 
       WHERE material_ack_id = ?`,
      [ackId]
    );
    const currOverall = parseInt(currentUsage[0].overall_qty) || 0;

    if (validatedOverallQty !== null && currOverall + validatedOverallQty > sumAck) {
      return res.status(400).json({ status: 'error', message: `Overall usage would exceed acknowledged quantity sum (${sumAck})` });
    }

    // Insert into material_usage_history
    await db.query(
      `INSERT INTO material_usage_history 
       (material_ack_id, entry_date, overall_qty, remarks, created_by, created_at)
       VALUES (?, ?, ?, ?, ?, NOW())`,
      [
        ackId,
        entry_date,
        validatedOverallQty,
        remarks || null,
        created_by ? parseInt(created_by) : null
      ]
    );

    // Update or insert into material_usage
    const [existingUsage] = await db.query('SELECT id FROM material_usage WHERE material_ack_id = ?', [ackId]);

    if (existingUsage.length === 0) {
      // Insert new record
      await db.query(
        `INSERT INTO material_usage 
         (material_ack_id, overall_qty, remarks, created_at, updated_at)
         VALUES (?, ?, ?, NOW(), NOW())`,
        [
          ackId,
          validatedOverallQty,
          remarks || null
        ]
      );
    } else {
      // Update existing record with cumulative quantities
      await db.query(
        `UPDATE material_usage 
         SET 
           overall_qty = COALESCE(overall_qty, 0) + ?,
           remarks = ?,
           updated_at = NOW()
         WHERE material_ack_id = ?`,
        [
          validatedOverallQty || 0,
          remarks || null,
          ackId
        ]
      );
    }

    res.status(201).json({
      status: 'success',
      message: 'Material usage saved successfully'
    });
  } catch (error) {
    console.error('Error in saveMaterialUsage:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({
        status: 'error',
        message: 'Duplicate entry error'
      });
    }
    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid material_ack_id: referenced record does not exist'
      });
    }
    if (error.code === 'ER_BAD_FIELD_ERROR') {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid data format in request',
        error: error.message
      });
    }
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      error: error.message
    });
  }
};

exports.getMaterialUsageDetails = async (req, res) => {
  try {
    const { material_ack_id, date } = req.query;

    if (!material_ack_id || isNaN(parseInt(material_ack_id))) {
      return res.status(400).json({ status: 'error', message: 'material_ack_id is required and must be a number' });
    }
    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({ status: 'error', message: 'date is required in YYYY-MM-DD format' });
    }

    const ackId = parseInt(material_ack_id);

    // Fetch entries for the specific date
    const [entries] = await db.query(
      `SELECT * FROM material_usage_history 
       WHERE material_ack_id = ? AND entry_date = ? 
       ORDER BY created_at DESC`,
      [ackId, date]
    );

    // Fetch cumulative usage up to the date
    const [cumulative] = await db.query(
      `SELECT 
         COALESCE(SUM(overall_qty), 0) AS overall_qty,
         COALESCE(SUM(comp_a_qty), 0) AS comp_a_qty,
         COALESCE(SUM(comp_b_qty), 0) AS comp_b_qty,
         COALESCE(SUM(comp_c_qty), 0) AS comp_c_qty
       FROM material_usage_history 
       WHERE material_ack_id = ? AND entry_date <= ?`,
      [ackId, date]
    );

    // Fetch total cumulative usage (all dates)
    const [totalCumulative] = await db.query(
      `SELECT 
         COALESCE(SUM(overall_qty), 0) AS overall_qty,
         COALESCE(SUM(comp_a_qty), 0) AS comp_a_qty,
         COALESCE(SUM(comp_b_qty), 0) AS comp_b_qty,
         COALESCE(SUM(comp_c_qty), 0) AS comp_c_qty
       FROM material_usage_history 
       WHERE material_ack_id = ?`,
      [ackId]
    );

    res.status(200).json({
      status: 'success',
      data: {
        cumulative: cumulative[0],
        total_cumulative: totalCumulative[0],
        entries
      }
    });
  } catch (error) {
    console.error('Error in getMaterialUsageDetails:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error', error: error.message });
  }
};


exports.getWorkDescriptionsBySite = async (req, res) => {
  try {
    const { site_id } = req.query;
    if (!site_id) {
      return res.status(400).json({ status: 'error', message: 'site_id is required' });
    }

    const [descIds] = await db.query(
      `SELECT DISTINCT desc_id 
       FROM po_reckoner 
       WHERE site_id = ?`,
      [site_id]
    );

    if (descIds.length === 0) {
      return res.status(200).json({
        status: 'success',
        data: []
      });
    }

    const descIdList = descIds.map(d => d.desc_id);
    const [descriptions] = await db.query(
      `SELECT desc_id, desc_name 
       FROM work_descriptions 
       WHERE desc_id IN (?)`,
      [descIdList]
    );

    res.status(200).json({
      status: 'success',
      data: descriptions || []
    });
  } catch (error) {
    console.error('Error in getWorkDescriptionsBySite:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      error: error.message
    });
  }
};

exports.getEmployeesByDesignation = async (req, res) => {
  try {
    const designationId = 7; // Fixed designation_id for labour
    const [employees] = await db.query(
      `SELECT emp_id, full_name 
       FROM employee_master 
       WHERE designation_id = ?`,
      [designationId]
    );

    res.status(200).json({
      status: 'success',
      data: employees || []
    });
  } catch (error) {
    console.error('Error in getEmployeesByDesignation:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      error: error.message
    });
  }
};



exports.getAssignedLabours = async (req, res) => {
  try {
    const { project_id, site_id, desc_id } = req.query;

    if (!project_id || !site_id || !desc_id || isNaN(desc_id)) {
      return res.status(400).json({ status: 'error', message: 'project_id, site_id, and desc_id are required' });
    }

    const [labours] = await db.query(
      `SELECT la.id, la.emp_id, em.full_name 
       FROM labour_assignment la 
       JOIN employee_master em ON la.emp_id = em.emp_id 
       WHERE la.project_id = ? AND la.site_id = ? AND la.desc_id = ?`,
      [project_id, site_id, desc_id]
    );

    res.status(200).json({
      status: 'success',
      data: labours || []
    });
  } catch (error) {
    console.error('Error in getAssignedLabours:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      error: error.message
    });
  }
};

exports.saveLabourAttendance = async (req, res) => {
  try {
    const { attendance_data, created_by } = req.body;
    console.log('Received payload:', req.body); // Debug log

    if (!attendance_data || !Array.isArray(attendance_data) || attendance_data.length === 0) {
      console.log('Validation failed: attendance_data missing, not an array, or empty');
      return res.status(400).json({ status: 'error', message: 'attendance_data is required and must be a non-empty array' });
    }
    if (!created_by || isNaN(created_by)) {
      console.log('Validation failed: created_by missing or not a number');
      return res.status(400).json({ status: 'error', message: 'created_by is required and must be a number' });
    }

    for (const data of attendance_data) {
      const { labour_assignment_id, entry_date, shift } = data;

      if (!labour_assignment_id || isNaN(labour_assignment_id)) {
        console.log('Validation failed: labour_assignment_id missing or not a number');
        return res.status(400).json({ status: 'error', message: 'labour_assignment_id is required and must be a number for each attendance entry' });
      }
      if (!entry_date || !/^\d{4}-\d{2}-\d{2}$/.test(entry_date)) {
        console.log('Validation failed: entry_date missing or invalid format');
        return res.status(400).json({ status: 'error', message: 'entry_date is required in YYYY-MM-DD format for each attendance entry' });
      }
      if (shift === undefined || isNaN(shift)) {
        console.log('Validation failed: shift missing or not a number');
        return res.status(400).json({ status: 'error', message: 'shift is required and must be a number for each attendance entry' });
      }

      const [assignment] = await db.query('SELECT id FROM labour_assignment WHERE id = ?', [labour_assignment_id]);
      if (assignment.length === 0) {
        console.log('Validation failed: Invalid labour_assignment_id', labour_assignment_id);
        return res.status(400).json({ status: 'error', message: 'Invalid labour_assignment_id' });
      }

      await db.query(
        `INSERT INTO labour_attendance 
         (labour_assignment_id, shift, created_by, created_at, entry_date)
         VALUES (?, ?, ?, NOW(), ?)`,
        [labour_assignment_id, shift, created_by, entry_date]
      );
    }

    res.status(201).json({
      status: 'success',
      message: 'Labour attendance saved successfully'
    });
  } catch (error) {
    console.error('Error in saveLabourAttendance:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({
        status: 'error',
        message: 'Duplicate attendance entry'
      });
    }
    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid foreign key reference'
      });
    }
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      error: error.message
    });
  }
};

exports.saveLabourAssignment = async (req, res) => {
  try {
    const { project_id, site_id, desc_id, labour_ids, from_date, to_date, created_by } = req.body;
    console.log("Received payload:", req.body); // Debug log

    // Basic input validation
    if (!project_id) {
      console.log("Validation failed: project_id missing");
      return res.status(400).json({ status: "error", message: "project_id is required" });
    }
    if (!site_id) {
      console.log("Validation failed: site_id missing");
      return res.status(400).json({ status: "error", message: "site_id is required" });
    }
    if (!desc_id || isNaN(desc_id)) {
      console.log("Validation failed: desc_id missing or not a number");
      return res.status(400).json({ status: "error", message: "desc_id is required and must be a number" });
    }
    if (!labour_ids || !Array.isArray(labour_ids) || labour_ids.length === 0) {
      console.log("Validation failed: labour_ids missing, not an array, or empty");
      return res.status(400).json({ status: "error", message: "labour_ids is required and must be a non-empty array" });
    }
    if (!from_date || !/^\d{4}-\d{2}-\d{2}$/.test(from_date)) {
      console.log("Validation failed: from_date missing or invalid format");
      return res.status(400).json({ status: "error", message: "from_date is required in YYYY-MM-DD format" });
    }
    if (!to_date || !/^\d{4}-\d{2}-\d{2}$/.test(to_date)) {
      console.log("Validation failed: to_date missing or invalid format");
      return res.status(400).json({ status: "error", message: "to_date is required in YYYY-MM-DD format" });
    }
    if (!created_by || isNaN(created_by)) {
      console.log("Validation failed: created_by missing or not a number");
      return res.status(400).json({ status: "error", message: "created_by is required and must be a number" });
    }

    // Validate date range
    if (new Date(from_date) > new Date(to_date)) {
      console.log("Validation failed: from_date later than to_date");
      return res.status(400).json({ status: "error", message: "from_date cannot be later than to_date" });
    }

    // Check foreign key existence
    const [project] = await db.query("SELECT pd_id FROM project_details WHERE pd_id = ?", [project_id]);
    if (project.length === 0) {
      console.log("Validation failed: Invalid project_id", project_id);
      return res.status(400).json({ status: "error", message: "Invalid project_id" });
    }
    const [site] = await db.query("SELECT site_id FROM site_details WHERE site_id = ?", [site_id]);
    if (site.length === 0) {
      console.log("Validation failed: Invalid site_id", site_id);
      return res.status(400).json({ status: "error", message: "Invalid site_id" });
    }
    const [workDesc] = await db.query("SELECT desc_id FROM work_descriptions WHERE desc_id = ?", [desc_id]);
    if (workDesc.length === 0) {
      console.log("Validation failed: Invalid desc_id", desc_id);
      return res.status(400).json({ status: "error", message: "Invalid desc_id" });
    }
    const [labours] = await db.query("SELECT id FROM labour WHERE id IN (?)", [labour_ids]);
    if (labours.length !== labour_ids.length) {
      console.log("Validation failed: Invalid labour_ids", labour_ids);
      return res.status(400).json({ status: "error", message: "One or more labour_ids are invalid" });
    }
    const [user] = await db.query("SELECT user_id FROM users WHERE user_id = ?", [created_by]);
    if (user.length === 0) {
      console.log("Validation failed: Invalid created_by", created_by);
      return res.status(400).json({ status: "error", message: "Invalid created_by user_id" });
    }

    // Insert a row for each labour_id
    for (const labour_id of labour_ids) {
      await db.query(
        `INSERT INTO labour_assignment 
         (project_id, site_id, desc_id, labour_id, from_date, to_date, created_by, created_at, salary)
         VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NULL)`,
        [project_id, site_id, desc_id, labour_id, from_date, to_date, created_by]
      );
    }

    res.status(201).json({
      status: "success",
      message: "Labour assignments saved successfully",
    });
  } catch (error) {
    console.error("Error in saveLabourAssignment:", {
      error: error.message,
      stack: error.stack,
    });
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(400).json({
        status: "error",
        message: "Duplicate labour assignment",
      });
    }
    if (error.code === "ER_NO_REFERENCED_ROW_2") {
      return res.status(400).json({
        status: "error",
        message: "Invalid foreign key reference",
      });
    }
    res.status(500).json({
      status: "error",
      message: "Internal server error",
      error: error.message,
    });
  }
};




// exports.getLabourAttendance = async (req, res) => {
//   try {
//     const { project_id, site_id, desc_id, entry_date } = req.query;

//     if (!project_id || !site_id || !desc_id || isNaN(desc_id)) {
//       console.log('Validation failed: Missing or invalid project_id, site_id, or desc_id');
//       return res.status(400).json({ status: 'error', message: 'project_id, site_id, and desc_id are required' });
//     }
//     if (!entry_date || !/^\d{4}-\d{2}-\d{2}$/.test(entry_date)) {
//       console.log('Validation failed: entry_date missing or invalid format');
//       return res.status(400).json({ status: 'error', message: 'entry_date is required in YYYY-MM-DD format' });
//     }

//     const [labours] = await db.query(
//       `SELECT la.id, la.emp_id, em.full_name, lat.shift
//        FROM labour_assignment la 
//        JOIN employee_master em ON la.emp_id = em.emp_id 
//        LEFT JOIN labour_attendance lat ON la.id = lat.labour_assignment_id AND lat.entry_date = ?
//        WHERE la.project_id = ? AND la.site_id = ? AND la.desc_id = ?`,
//       [entry_date, project_id, site_id, desc_id]
//     );

//     res.status(200).json({
//       status: 'success',
//       data: labours || []
//     });
//   } catch (error) {
//     console.error('Error in getLabourAttendance:', error);
//     res.status(500).json({
//       status: 'error',
//       message: 'Internal server error',
//       error: error.message
//     });
//   }
// };

exports.getLabourAttendance = async (req, res) => {
  try {
    const { project_id, site_id, desc_id, entry_date } = req.query;

    // Input validation
    if (!project_id || !site_id || !desc_id || isNaN(desc_id)) {
      console.log(
        `Validation failed: Missing or invalid parameters - project_id: ${project_id}, site_id: ${site_id}, desc_id: ${desc_id}`
      );
      return res.status(400).json({
        status: "error",
        message: "project_id, site_id, and desc_id are required and must be valid",
      });
    }

    if (!entry_date || !/^\d{4}-\d{2}-\d{2}$/.test(entry_date)) {
      console.log(`Validation failed: Invalid entry_date - ${entry_date}`);
      return res.status(400).json({
        status: "error",
        message: "entry_date is required in YYYY-MM-DD format",
      });
    }

    // Query with DISTINCT to avoid duplicate rows
    const [labours] = await db.query(
      `SELECT DISTINCT la.id, la.labour_id, l.full_name, lat.shift
       FROM labour_assignment la 
       JOIN labour l ON la.labour_id = l.id 
       LEFT JOIN labour_attendance lat ON la.id = lat.labour_assignment_id AND lat.entry_date = ?
       WHERE la.project_id = ? AND la.site_id = ? AND la.desc_id = ?`,
      [entry_date, project_id, site_id, desc_id]
    );

    // Log the number of records returned for debugging
    console.log(
      `getLabourAttendance: Retrieved ${labours.length} records for project_id: ${project_id}, site_id: ${site_id}, desc_id: ${desc_id}, entry_date: ${entry_date}`
    );

    // Return response
    res.status(200).json({
      status: "success",
      data: labours || [],
    });
  } catch (error) {
    console.error("Error in getLabourAttendance:", {
      error: error.message,
      stack: error.stack,
    });
    res.status(500).json({
      status: "error",
      message: "Internal server error",
      error: error.message,
    });
  }
};



exports.getBudgetDetails = async (req, res) => {
  try {
    const { site_id } = req.query;

    if (!site_id) {
      return res.status(400).json({
        status: 'error',
        message: 'site_id is required',
      });
    }

    // Fetch po_budget for the site with desc_id
    const [poBudgets] = await db.query(
      `SELECT id, total_budget_value, desc_id 
       FROM po_budget 
       WHERE site_id = ?`,
      [site_id]
    );

    if (poBudgets.length === 0) {
      return res.status(200).json({
        status: 'success',
        data: []
      });
    }

    const poBudgetIds = poBudgets.map(pb => pb.id);

    // Fetch actual_budget entries with overhead details and work description
    const [actualBudgets] = await db.query(
      `SELECT 
         ab.id, 
         ab.overhead_id, 
         ab.po_budget_id, 
         ab.splitted_budget, 
         ab.actual_value, 
         ab.difference_value, 
         ab.remarks,
         o.expense_name,
         wd.desc_name AS work_descriptions
       FROM actual_budget ab
       JOIN overhead o ON ab.overhead_id = o.id
       LEFT JOIN po_budget pb ON ab.po_budget_id = pb.id
       LEFT JOIN work_descriptions wd ON pb.desc_id = wd.desc_id
       WHERE ab.po_budget_id IN (?)`,
      [poBudgetIds]
    );

    res.status(200).json({
      status: 'success',
      data: actualBudgets
    });
  } catch (error) {
    console.error('Error in getBudgetDetails:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      error: error.message
    });
  }
};
exports.getBudgetExpenseDetails = async (req, res) => {
  try {
    const { actual_budget_id, date } = req.query;

    if (!actual_budget_id || isNaN(parseInt(actual_budget_id))) {
      return res.status(400).json({ status: 'error', message: 'actual_budget_id is required and must be a number' });
    }
    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({ status: 'error', message: 'date is required in YYYY-MM-DD format' });
    }

    const budgetId = parseInt(actual_budget_id);

    // Fetch entries for the specific date
    const [entries] = await db.query(
      `SELECT * FROM actual_budget_history 
       WHERE actual_budget_id = ? AND entry_date = ? 
       ORDER BY created_at DESC`,
      [budgetId, date]
    );

    // Fetch cumulative actual_value up to the date
    const [cumulative] = await db.query(
      `SELECT COALESCE(SUM(actual_value), 0) AS actual_value
       FROM actual_budget_history 
       WHERE actual_budget_id = ? AND entry_date <= ?`,
      [budgetId, date]
    );

    // Fetch total cumulative actual_value (all dates)
    const [totalCumulative] = await db.query(
      `SELECT COALESCE(SUM(actual_value), 0) AS actual_value
       FROM actual_budget_history 
       WHERE actual_budget_id = ?`,
      [budgetId]
    );

    res.status(200).json({
      status: 'success',
      data: {
        cumulative: cumulative[0],
        total_cumulative: totalCumulative[0],
        entries
      }
    });
  } catch (error) {
    console.error('Error in getBudgetExpenseDetails:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error', error: error.message });
  }
};

// Updated saveBudgetExpense - removed the exceeding check
exports.saveBudgetExpense = async (req, res) => {
  try {
    const { actual_budget_id, entry_date, actual_value, remarks, created_by } = req.body;

    // Validate actual_budget_id
    if (!actual_budget_id || isNaN(actual_budget_id)) {
      return res.status(400).json({ status: 'error', message: 'actual_budget_id is required and must be a number' });
    }

    const budgetId = parseInt(actual_budget_id);

    // Validate entry_date
    if (!entry_date || !/^\d{4}-\d{2}-\d{2}$/.test(entry_date)) {
      return res.status(400).json({ status: 'error', message: 'entry_date is required in YYYY-MM-DD format' });
    }

    // Validate actual_value if provided
    const validateValue = (val, field) => {
      if (val === null || val === undefined) return null;
      const parsed = parseFloat(val);
      if (isNaN(parsed) || parsed < 0) {
        throw new Error(`${field} must be a non-negative number or null`);
      }
      return parsed;
    };

    const validatedActualValue = validateValue(actual_value, 'actual_value');

    // Validate remarks if provided
    if (remarks && typeof remarks !== 'string') {
      return res.status(400).json({ status: 'error', message: 'remarks must be a string' });
    }

    // Check if actual_budget_id exists and get splitted_budget
    const [budgetRecord] = await db.query('SELECT splitted_budget FROM actual_budget WHERE id = ?', [budgetId]);
    if (budgetRecord.length === 0) {
      return res.status(400).json({ status: 'error', message: `Invalid actual_budget_id (${budgetId}): record does not exist` });
    }
    const splittedBudget = parseFloat(budgetRecord[0].splitted_budget) || 0;

    // Get current actual
    const [currentActual] = await db.query(
      `SELECT COALESCE(SUM(actual_value), 0) AS actual_value
       FROM actual_budget_history 
       WHERE actual_budget_id = ?`,
      [budgetId]
    );
    const currActual = parseFloat(currentActual[0].actual_value) || 0;

    // Insert into actual_budget_history
    await db.query(
      `INSERT INTO actual_budget_history 
       (actual_budget_id, entry_date, actual_value, remarks, created_at)
       VALUES (?, ?, ?, ?, NOW())`,
      [
        budgetId,
        entry_date,
        validatedActualValue,
        remarks || null
      ]
    );

    // Update actual_budget with cumulative
    const newActual = currActual + (validatedActualValue || 0);
    const newDifference = splittedBudget - newActual; // Can be negative

    await db.query(
      `UPDATE actual_budget 
       SET 
         actual_value = ?,
         difference_value = ?,
         remarks = ?,
         created_at = NOW()
       WHERE id = ?`,
      [
        newActual,
        newDifference,
        remarks || null,
        budgetId
      ]
    );

    res.status(201).json({
      status: 'success',
      message: 'Budget expense saved successfully'
    });
  } catch (error) {
    console.error('Error in saveBudgetExpense:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({
        status: 'error',
        message: 'Duplicate entry error'
      });
    }
    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid actual_budget_id: referenced record does not exist'
      });
    }
    if (error.code === 'ER_BAD_FIELD_ERROR') {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid data format in request',
        error: error.message
      });
    }
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      error: error.message
    });
  }
};




exports.getBudgetWorkDescriptionsBySite = async (req, res) => {
  try {
    const { site_id } = req.params;

    if (!site_id) {
      return res.status(400).json({ 
        status: 'error', 
        message: 'site_id is required' 
      });
    }

    // First, get unique desc_id from po_reckoner for the given site_id
    const [descIds] = await db.query(
      `SELECT DISTINCT desc_id 
       FROM po_reckoner 
       WHERE site_id = ?`,
      [site_id]
    );

    if (descIds.length === 0) {
      return res.status(200).json({
        status: 'success',
        data: []
      });
    }

    // Get the corresponding desc_name from work_descriptions table
    const descIdList = descIds.map(d => d.desc_id);
    const [descriptions] = await db.query(
      `SELECT desc_id, desc_name 
       FROM work_descriptions 
       WHERE desc_id IN (?) 
       ORDER BY desc_name`,
      [descIdList]
    );

    res.status(200).json({
      status: 'success',
      data: descriptions || []
    });
  } catch (error) {
    console.error('Error in getBudgetWorkDescriptionsBySite:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      error: error.message
    });
  }
};




exports.getLabours = async (req, res) => {
  try {
    // Query to fetch id and full_name from the labour table
    const [labours] = await db.query(
      `SELECT id, full_name 
       FROM labour`
    );

    // Log the number of records retrieved for debugging
    console.log(`getLabours: Retrieved ${labours.length} labour records`);

    // Return response
    res.status(200).json({
      status: "success",
      data: labours || [],
    });
  } catch (error) {
    console.error("Error in getLabours:", {
      error: error.message,
      stack: error.stack,
    });
    res.status(500).json({
      status: "error",
      message: "Internal server error",
      error: error.message,
    });
  }
};




exports.calculateLabourBudget = async (req, res) => {
  try {
    // Step 1: Fetch all labour assignments with labour_id, full_name, desc_id, and desc_name
    const [assignments] = await db.query(
      `SELECT la.id, la.project_id, la.site_id, la.desc_id, la.salary, la.labour_id, l.full_name, wd.desc_name 
       FROM labour_assignment la
       JOIN labour l ON la.labour_id = l.id
       JOIN work_descriptions wd ON la.desc_id = wd.desc_id`
    );

    if (assignments.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "No labour assignments found.",
      });
    }

    // Step 2: Group assignments by po_budget_id for efficient processing
    const budgetMap = new Map(); // Map<po_budget_id, { total_salary, total_shifts, desc_id, desc_name, labour_assignments }>

    for (const assignment of assignments) {
      // Find po_budget_id for the assignment's site_id and desc_id
      const [poBudgetRows] = await db.query(
        `SELECT id FROM po_budget WHERE site_id = ? AND desc_id = ?`,
        [assignment.site_id, assignment.desc_id]
      );

      if (poBudgetRows.length === 0) {
        console.log(
          `No po_budget record found for site_id: ${assignment.site_id}, desc_id: ${assignment.desc_id}`
        );
        continue; // Skip if no matching po_budget record
      }

      const po_budget_id = poBudgetRows[0].id;

      // Fetch attendances for this labour_assignment with shift and entry_date
      const [attendances] = await db.query(
        `SELECT shift, entry_date FROM labour_attendance WHERE labour_assignment_id = ?`,
        [assignment.id]
      );

      let total_salary = 0;
      let total_shifts = 0;
      const shifts_by_date = [];

      for (const attendance of attendances) {
        const shift = parseFloat(attendance.shift) || 0; // Convert shift to number
        total_salary += shift * (parseFloat(assignment.salary) || 0);
        total_shifts += shift;
        shifts_by_date.push({
          entry_date: attendance.entry_date,
          shift, // Store as number
        });
      }

      // Format total_shifts to one decimal place
      total_shifts = parseFloat(total_shifts.toFixed(1));

      // Aggregate total_salary and total_shifts by po_budget_id
      if (!budgetMap.has(po_budget_id)) {
        budgetMap.set(po_budget_id, { 
          total_salary: 0, 
          total_shifts: 0, 
          desc_id: assignment.desc_id, 
          desc_name: assignment.desc_name, 
          labour_assignments: [] 
        });
      }
      const budget = budgetMap.get(po_budget_id);
      budget.total_salary += total_salary;
      budget.total_shifts += total_shifts;
      budget.labour_assignments.push({
        labour_assignment_id: assignment.id,
        labour_id: assignment.labour_id,
        full_name: assignment.full_name,
        salary: total_salary,
        shifts_by_date,
        total_shifts,
      });
    }

    // Step 3: Store or update in actual_budget
    for (const [po_budget_id, { total_salary }] of budgetMap) {
      // Check if actual_budget record exists for po_budget_id and overhead_id = 2
      const [actualBudgetRows] = await db.query(
        `SELECT id, splitted_budget FROM actual_budget WHERE po_budget_id = ? AND overhead_id = 2`,
        [po_budget_id]
      );

      const difference_value = actualBudgetRows.length > 0
        ? (parseFloat(actualBudgetRows[0].splitted_budget) || 0) - total_salary
        : 0 - total_salary; // Assume splitted_budget = 0 if new

      if (actualBudgetRows.length > 0) {
        // Update existing record
        await db.query(
          `UPDATE actual_budget SET actual_value = ?, difference_value = ? WHERE id = ?`,
          [total_salary, difference_value, actualBudgetRows[0].id]
        );
      } else {
        // Insert new record
        await db.query(
          `INSERT INTO actual_budget (po_budget_id, overhead_id, splitted_budget, actual_value, difference_value, remarks)
           VALUES (?, 2, 0, ?, ?, NULL)`,
          [po_budget_id, total_salary, difference_value]
        );
      }
    }

    res.status(200).json({
      status: "success",
      message: "Labour budget calculated and stored/updated successfully.",
      processed_po_budgets: Array.from(budgetMap.entries()).map(([po_budget_id, { total_salary, total_shifts, desc_id, desc_name, labour_assignments }]) => ({
        po_budget_id,
        desc_id,
        desc_name,
        total_salary, // overall_salary
        total_shifts, // overall_shifts
        labour_assignments,
      })),
    });
  } catch (error) {
    console.error("Error in calculateLabourBudget:", {
      error: error.message,
      stack: error.stack,
    });
    res.status(500).json({
      status: "error",
      message: "Internal server error",
      error: error.message,
    });
  }
};