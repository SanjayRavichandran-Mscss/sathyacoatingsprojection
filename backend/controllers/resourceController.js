// supplyController.js
const db = require('../config/db');


exports.test = async (req, res) => {
  try {
    res.status(200).json({
      status: 'success',
      message: 'resource management Test API is working',
      data: null
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      error: error.message
    });
  }
};





exports.getAllConsumables = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        id,
        consumable_name AS name,
        is_multi_use,
        created_at AS createdAt
      FROM resource_consumables
      ORDER BY created_at DESC
    `);

    const data = rows.map(row => ({
      id: row.id,
      name: row.name,
      isMultiUse: row.is_multi_use === 1,
      consumableStatus: row.is_multi_use === 1 ? 'multi use' : 'single use',
      createdAt: row.createdAt
    }));

    res.status(200).json({
      status: 'success',
      message: 'Consumables retrieved successfully',
      count: data.length,
      data
    });
  } catch (error) {
    console.error('Error fetching consumables:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to load consumables',
      error: error.message
    });
  }
};


// controllers/resourceController.js (or supplyController.js)

exports.createConsumable = async (req, res) => {
  try {
    const { consumable_name, is_multi_use } = req.body;

    if (!consumable_name || typeof consumable_name !== 'string' || consumable_name.trim() === '') {
      return res.status(400).json({
        status: 'error',
        message: 'Valid consumable_name is required'
      });
    }

    // Normalize is_multi_use (accept boolean, number 0/1, string "true"/"false")
    let multiUse = 0;
    if (is_multi_use === true || is_multi_use === 1 || is_multi_use === 'true') {
      multiUse = 1;
    }

    const [result] = await db.query(
      `INSERT INTO resource_consumables 
       (consumable_name, is_multi_use, created_at) 
       VALUES (?, ?, NOW())`,
      [consumable_name.trim(), multiUse]
    );

    const insertId = result.insertId;

    // Return the newly created item in same format as GET
    const [rows] = await db.query(
      `SELECT 
         id,
         consumable_name AS name,
         is_multi_use,
         created_at AS createdAt
       FROM resource_consumables 
       WHERE id = ?`,
      [insertId]
    );

    const item = rows[0] || {};

    const responseItem = {
      id: item.id,
      name: item.name,
      isMultiUse: item.is_multi_use === 1,
      consumableStatus: item.is_multi_use === 1 ? 'multi use' : 'single use',
      createdAt: item.createdAt
    };

    res.status(201).json({
      status: 'success',
      message: 'Consumable created successfully',
      data: responseItem
    });
  } catch (error) {
    console.error('Error creating consumable:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to create consumable',
      error: error.message
    });
  }
};






// POST /resource/dispatches
exports.createDispatch = async (req, res) => {
  try {
    const {
      resource_consumable_id,
      quantity,
      dispatch_date,
      vehicle_name_model,
      vehicle_number,
      driver_name,
      driver_mobile,
      current_site,
      destination_site,
      transport_amount = 0
    } = req.body;

    if (!resource_consumable_id || !quantity || !dispatch_date || !current_site || !destination_site) {
      return res.status(400).json({ status: 'error', message: 'Missing required fields' });
    }

    const [result] = await db.query(
      `INSERT INTO resource_dispatches (
        resource_consumable_id, quantity, dispatch_date,
        vehicle_name_model, vehicle_number, driver_name, driver_mobile,
        current_site, destination_site, transport_amount,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        resource_consumable_id,
        quantity,
        dispatch_date,
        vehicle_name_model || null,
        vehicle_number || null,
        driver_name || null,
        driver_mobile || null,
        current_site,
        destination_site,
        parseFloat(transport_amount) || 0
      ]
    );

    res.status(201).json({
      status: 'success',
      message: 'Dispatch recorded',
      data: { id: result.insertId }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'error', message: 'Failed to save dispatch', error: err.message });
  }
};



exports.getDispatches = async (req, res) => {
  try {
    const { consumable_id } = req.query;

    let query = `
      SELECT 
        d.id,
        d.resource_consumable_id,
        d.quantity,
        d.dispatch_date,
        d.vehicle_name_model,
        d.vehicle_number,
        d.driver_name,
        d.driver_mobile,
        d.current_site,
        d.destination_site,
        d.transport_amount,
        d.created_at,
        d.updated_at,
        
        -- Joined fields from resource_consumables
        c.consumable_name,
        CASE 
          WHEN c.is_multi_use = 1 THEN 'multi use'
          ELSE 'single use'
        END AS usage_type
      FROM resource_dispatches d
      LEFT JOIN resource_consumables c 
        ON d.resource_consumable_id = c.id
    `;

    const params = [];

    if (consumable_id) {
      query += ` WHERE d.resource_consumable_id = ?`;
      params.push(parseInt(consumable_id));
    }

    query += ` ORDER BY d.dispatch_date DESC, d.created_at DESC`;

    const [rows] = await db.query(query, params);

    res.status(200).json({
      status: 'success',
      message: 'Dispatches retrieved successfully',
      count: rows.length,
      data: rows
    });
  } catch (error) {
    console.error('Error fetching dispatches:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch dispatch records',
      error: error.message
    });
  }
};