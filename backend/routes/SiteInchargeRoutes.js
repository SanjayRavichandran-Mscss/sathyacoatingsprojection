const express = require("express");
const router = express.Router();
const SiteInchargeController = require("../controllers/SiteInchargeController");

router.get("/completion-entries", SiteInchargeController.getCompletionEntries);
router.post("/completion-status", SiteInchargeController.saveCompletionStatus);
router.get("/completion-entries-by-site/:site_id", SiteInchargeController.getCompletionEntriesBySiteID);
router.post("/acknowledge-material", SiteInchargeController.saveMaterialAcknowledgement);
router.get("/acknowledgement-details", SiteInchargeController.getAcknowledgementDetails);
router.get("/material-usage-details", SiteInchargeController.getMaterialUsageDetails);
router.post("/save-material-usage", SiteInchargeController.saveMaterialUsage);
// Routes for labour assignment
router.get('/employees', SiteInchargeController.getEmployeesByDesignation);
router.post('/save-labour-assignment', SiteInchargeController.saveLabourAssignment);
router.get('/work-descriptions', SiteInchargeController.getWorkDescriptionsBySite);
router.get('/assigned-labours', SiteInchargeController.getAssignedLabours);
router.post('/save-labour-attendance', SiteInchargeController.saveLabourAttendance);
router.get('/labour-attendance', SiteInchargeController.getLabourAttendance);

// New routes for budget expense entry
router.get("/budget-details", SiteInchargeController.getBudgetDetails);
router.get("/budget-expense-details", SiteInchargeController.getBudgetExpenseDetails);
router.post("/save-budget-expense", SiteInchargeController.saveBudgetExpense);
// Add this route to SiteInchargeRoutes.js
router.get("/budget-work-descriptions/:site_id", SiteInchargeController.getBudgetWorkDescriptionsBySite);
router.get("/labours", SiteInchargeController.getLabours); // New route for getLabours

router.get("/calculate-labour-budget", SiteInchargeController.calculateLabourBudget);


module.exports = router;