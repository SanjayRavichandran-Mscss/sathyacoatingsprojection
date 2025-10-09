const db = require('../config/db');


exports.test = async (req, res) => {
  try {
    res.status(200).json({
      status: 'success',
      message: 'supply management Test API is working',
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


exports.assignMaterial = async (req, res) => {
  try {
    const assignments = req.body;
    if (!Array.isArray(assignments) || assignments.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid payload: must be a non-empty array',
      });
    }

    const values = assignments.map(assignment => [
      assignment.pd_id,
      assignment.site_id,
      assignment.item_id,
      assignment.uom_id,
      assignment.quantity,
      assignment.production_cost_per_uom,
      assignment.production_cost,
      assignment.supply_cost_per_uom,
      assignment.supply_cost,
      assignment.created_by || null
    ]);

    const query = `
      INSERT INTO supply_material_assign 
      (pd_id, site_id, item_id, uom_id, quantity, production_cost_per_uom, production_cost, supply_cost_per_uom, supply_cost, created_by) 
      VALUES ?
    `;

    const [result] = await db.query(query, [values]);

    res.status(200).json({
      status: 'success',
      message: 'Materials assigned successfully',
      data: { affectedRows: result.affectedRows }
    });
  } catch (error) {
    console.error('Error assigning materials:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to assign materials',
      error: error.message
    });
  }
};

exports.getAssignedMaterials = async (req, res) => {
  try {
    const { site_id } = req.query;
    if (!site_id) {
      return res.status(400).json({
        status: 'error',
        message: 'site_id is required',
      });
    }

    const query = `
      SELECT sma.*, m.item_name, u.uom_name 
      FROM supply_material_assign sma
      LEFT JOIN material_master m ON sma.item_id = m.item_id
      LEFT JOIN uom_master u ON sma.uom_id = u.uom_id
      WHERE sma.site_id = ?
      ORDER BY sma.created_at DESC
    `;

    const [rows] = await db.query(query, [site_id]);

    res.status(200).json({
      status: 'success',
      data: rows
    });
  } catch (error) {
    console.error('Error fetching assigned materials:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch assigned materials',
      error: error.message
    });
  }
};