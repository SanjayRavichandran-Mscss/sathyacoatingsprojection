const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Route to get all companies
router.get('/companies', adminController.getCompanies);

// Route to get projects by company ID
router.get('/projects/:companyId', adminController.getProjectsByCompany);

// Route to get sites by project ID
router.get('/sites/:projectId', adminController.getSitesByProject);

// Route to get work descriptions by site ID and category ID
router.get('/work-descriptions/:siteId', adminController.getWorkDescriptions);
// router.get('/completion-entries-by-site/:siteId', adminController.getCompletionEntriesBySite);

router.get('/completion-entries-by-site/:siteId/:descId', adminController.getCompletionEntriesBySite);
// Route to get PO reckoner totals by site ID
router.get('/po-reckoner-totals/:siteId/:descId', adminController.getPoReckonerTotals);
// Route to get expense details by site ID
router.get('/expense-details/:siteId/:descId', adminController.getExpenseDetailsBySite);

// Route to get work descriptions by site ID
router.get('/work-descriptions-by-site/:siteId', adminController.getWorkDescriptionsBySite);

// Route to get PO totals by site ID and desc ID
router.get('/po-total-budget/:siteId/:descId', adminController.getPoTotalBudget);


router.get('/po-budget', adminController.getPoBudget);

router.post('/save-po-budget', adminController.savePoBudget);

// Route to get overheads
router.get('/overheads', adminController.getOverheads);

// Route to save overhead
router.post('/save-overhead', adminController.saveOverhead);
router.post('/save-overhead-values', adminController.saveOverheadValue);

// Route to save actual budget entries
router.post('/save-actual-budget', adminController.saveActualBudget);

router.get('/actual-budget/:po_budget_id', adminController.getActualBudgetEntries);

// Add the new route for fetching material planning budget
router.get('/fetch-material-planning-budget', adminController.fetchMaterialPlanningBudget);


// Route to get contractors
router.get('/contractors', adminController.getContractors);

// Route to add labour
router.post('/add-labour', adminController.addLabour);

router.get("/labour", adminController.getLabourEmployees);
router.post("/save-labour-assignment", adminController.saveLabourAssignment);

// Updated route
router.get('/material-graph/:siteId/:descId', adminController.materialgraph);

router.post('/save-labour-overhead', async (req, res) => {
  console.log(`[${new Date().toISOString()}] Endpoint triggered`);
  const {
    site_id, desc_id, calculation_type, no_of_labours, total_shifts,
    rate_per_shift, total_cost, overhead_type, labourBudgetPercentage
  } = req.body;

  console.log(`[${new Date().toISOString()}] Request Body:`, req.body);

  if (!site_id || !desc_id || !calculation_type || !rate_per_shift || !total_cost) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  let connection;
  try {
    connection = await db.getConnection();
    await connection.beginTransaction();

    // Step 1: Get overhead_type_id
    console.log(`[${new Date().toISOString()}] Querying overhead for expense_name: ${overhead_type}`);
    const [overheadRows] = await connection.query(
      'SELECT id FROM overhead WHERE expense_name = ? LIMIT 1',
      [overhead_type]
    );
    console.log(`[${new Date().toISOString()}] Overhead query result:`, overheadRows);

    if (overheadRows.length === 0) {
      await connection.rollback();
      return res.status(400).json({ success: false, message: 'Invalid overhead type' });
    }
    const overhead_type_id = overheadRows[0].id;

    // Step 2: Insert into labour_overhead
    console.log(`[${new Date().toISOString()}] Inserting into labour_overhead`);
    await connection.query(
      'INSERT INTO labour_overhead (site_id, desc_id, calculation_type, no_of_labours, total_shifts, rate_per_shift, total_cost, overhead_type) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [site_id, desc_id, calculation_type, no_of_labours || null, total_shifts || null, rate_per_shift, total_cost, overhead_type_id]
    );
    console.log(`[${new Date().toISOString()}] Labour overhead inserted`);

    // Step 3: Find last projection_id
    console.log(`[${new Date().toISOString()}] Querying projection_allocated`);
    console.log(typeof site_id, typeof desc_id, typeof overhead_type_id);
    const [projectionRows] = await connection.query(
      'SELECT MAX(projection_id) AS lastProjectionId FROM projection_allocated WHERE site_id = ? AND desc_id = ? AND overhead_type_id = ?',
      [site_id, desc_id, overhead_type_id]
    );
    console.log(`[${new Date().toISOString()}] Projection query result:`, projectionRows);
    const nextProjectionId = (projectionRows[0]?.lastProjectionId || 0) + 1;

    // Step 4: Insert into projection_allocated
    console.log(`[${new Date().toISOString()}] Inserting into projection_allocated`);
    await connection.query(
      'INSERT INTO projection_allocated (site_id, desc_id, overhead_type_id, projection_id, total_cost, budget_percentage) VALUES (?, ?, ?, ?, ?, ?)',
      [site_id, desc_id, overhead_type_id, nextProjectionId, total_cost, labourBudgetPercentage || 0]
    );
    console.log(`[${new Date().toISOString()}] Projection allocated inserted`);

    await connection.commit();
    return res.json({ success: true, message: 'Labour overhead saved successfully' });
  } catch (err) {
    if (connection) await connection.rollback();
    console.error(`[${new Date().toISOString()}] Error saving labour overhead:`, err);
    return res.status(500).json({ success: false, message: 'Server error', error: err.message });
  } finally {
    if (connection) connection.release();
  }
});

module.exports = router;