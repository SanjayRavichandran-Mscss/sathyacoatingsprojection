const express = require("express");
const router = express.Router();
const financeController = require("../controllers/financeController");

router.get("/test", financeController.test);

// Creditor Client Routes
router.post("/create-creditors-client", financeController.createCreditorsClient);
router.get('/existing-invoice-numbers', financeController.getExistingInvoiceNumbers);
router.get("/view-creditors-client", financeController.viewCreditorsClient);
router.put("/update-creditors-client/:id", financeController.updateCreditorsClient);
router.delete("/delete-creditors-client/:id", financeController.deleteCreditorsClient);

// Creditor Routes
router.post("/create-creditors", financeController.createCreditors);
router.get("/view-creditors", financeController.viewCreditors);
router.get("/creditors/:id", financeController.getCreditorById);
router.put("/update-creditors", financeController.updateCreditors);
router.delete("/delete-creditors/:id", financeController.deleteCreditors);
router.get("/overall-creditors-balance", financeController.fetchOverallCreditorsBalance);

// New route line in financeRoutes.js
router.get("/companies-with-projects", financeController.getCompaniesWithProjects);
router.get("/site-incharges", financeController.getSiteInchargesByPdId);
router.post("/siteincharge-attendance", financeController.upsertSiteInchargeAttendance);
router.get("/siteincharge-attendance", financeController.getSiteInchargeAttendanceByDate);
router.get("/siteincharge-attendance-history", financeController.getSiteInchargeAttendanceHistory);
router.get("/salary-payables-summary-by-attendance", financeController.getSiteInchargeSalarySummaryByAttendance);




// Updated salary payables summary route ( manual paid_amount)
router.get("/salary-payables-summary", financeController.getSalaryPayablesSummary);
router.post("/update-salary-payable", financeController.updateSalaryPayable);



// Add these lines to financeRoutes.js

router.get("/cost-categories", financeController.getCostCategories);
router.post("/create-transport-payable", financeController.createTransportPayable);
router.get("/transport-payables", financeController.getTransportPayablesByPdId);
router.put("/update-transport-payable/:id", financeController.updateTransportPayable);
router.get('/existing-dc-numbers', financeController.getExistingMaterialDcNo);


router.post("/create-scaffolding-payable", financeController.createScaffoldingPayable);
router.put("/update-scaffolding-payable/:id", financeController.updateScaffoldingPayable);
router.get("/scaffolding-payables", financeController.getScaffoldingPayablesByPdId);

// Site Accommodation Payable Routes
router.post("/create-site-accommodation-payable", financeController.createSiteAccommodationPayable);
router.get("/site-accommodation-payables", financeController.getSiteAccommodationPayablesByPdId);
router.put("/update-site-accommodation-payable/:id", financeController.updateSiteAccommodationPayable);

// Commission Payable Routes

router.get("/marketing-persons", financeController.getMarketingPersons);
router.post("/create-commission-payable", financeController.createCommissionPayable);
router.get("/commission-payables", financeController.getCommissionPayablesByPdId);
router.put("/update-commission-payable/:id", financeController.updateCommissionPayable);


// TDS Payable Routes
router.post("/create-tds-payable", financeController.createTdsPayable);
// router.get("/tds-payables", financeController.getTdsPayablesByPdId);
router.get("/tds-payables", financeController.getAllTdsPayables);
router.put("/update-tds-payable/:id", financeController.updateTdsPayable);



// GST Payable Routes
router.get("/gst-companies", financeController.getGstCompanies);
router.post("/create-gst-company", financeController.createGstCompany);
router.post("/create-gst-payable", financeController.createOrUpdateGstPayable);
router.get("/gst-payables", financeController.getGstPayables);
router.put('/update-gst-payable/:id', financeController.updateGstPayable);



router.post("/create-credit-card-payable", financeController.createOrUpdateCreditCardPayable);
router.get("/credit-card-payables", financeController.getCreditCardPayablesByPdId); // name kept same for compatibility

router.put("/credit-card-payable/:id", financeController.updateCreditCardPayable); // New dedicated PUT

// Other Payables
router.post("/create-other-payable", financeController.createOrUpdateOtherPayable);
router.get("/other-payables", financeController.getOtherPayables);
router.get("/overall-payable", financeController.fetchOverallPayable);
router.get("/overall-receivable", financeController.fetchOverallReceivable);



// Billed Debtors Routes
router.get("/items", financeController.getItems);
router.post("/create-item", financeController.createItem);
router.get("/parties", financeController.getParties);
router.post("/create-party", financeController.createParty);
router.post("/create-billed-debtors", financeController.createBilledDebtors);
router.get("/view-billed-debtors", financeController.viewBilledDebtors);
router.put("/update-billed-debtors", financeController.updateBilledDebtors);
// Billed Debtors Routes (add this line if not already)
router.get("/uoms", financeController.getUoms);



// Bank Master Routes (CORRECT & SAFE)
router.get("/bank-masters", financeController.getBankMasters);
router.post("/create-bank-master", financeController.createBankMaster);
router.put("/update-bank-master", financeController.updateBankMaster); 

// CFS → Salary Payable - All Records (No Query Params)
router.get("/cfs-data", financeController.fetchCFSdata);
// routes/financeRoutes.js or similar
router.get("/cpe-data", financeController.fetchCPEdata);



module.exports = router;