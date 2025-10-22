import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import Swal from "sweetalert2";
import { Plus, PlusCircle, Trash2, Loader2, ChevronDown, ChevronUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import MaterialPlanning from "./MaterialPlanning";

const ProjectProjectionOld = () => {
  // Existing state variables
  const [companies, setCompanies] = useState([]);
  const [projects, setProjects] = useState([]);
  const [sites, setSites] = useState([]);
  const [workDescriptions, setWorkDescriptions] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  console.log("Selected Company:", selectedCompany);
  const [selectedProject, setSelectedProject] = useState(null);
  console.log("Selected Project:", selectedProject);
  const [selectedSite, setSelectedSite] = useState(null);
  console.log("Selected Site:", selectedSite);  
  const [selectedWorkDescription, setSelectedWorkDescription] = useState(null);
  console.log("Selected Work Description:", selectedWorkDescription);
  const [budgetData, setBudgetData] = useState(null);
  const [budgetPercentage, setBudgetPercentage] = useState("");
  const [budgetValue, setBudgetValue] = useState("");
  const [existingBudget, setExistingBudget] = useState(null);
  const [overheads, setOverheads] = useState([]);
  const [checkedExpenses, setCheckedExpenses] = useState({});
  const [actualBudgetEntries, setActualBudgetEntries] = useState({});
  const [isAllocated, setIsAllocated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [materialTotalCost, setMaterialTotalCost] = useState(0);
  const [materialBudgetPercentage, setMaterialBudgetPercentage] = useState(0);

  // New state for labour overhead
  const [labourCalculationType, setLabourCalculationType] = useState("");
  const [noOfLabours, setNoOfLabours] = useState("");
  const [totalShifts, setTotalShifts] = useState("");
  const [ratePerShift, setRatePerShift] = useState("");
  const [labourTotalCost, setLabourTotalCost] = useState(0);
  const [labourBudgetPercentage, setLabourBudgetPercentage] = useState(0);

  // Active overhead tab
  const [activeOverheadTab, setActiveOverheadTab] = useState("material");
  const [dynamicOverheads, setDynamicOverheads] = useState({});
  console.log("Dynamic Overheads:", dynamicOverheads);
  const [selectedDynamicOverheads, setSelectedDynamicOverheads] = useState([]);

  // New state for projection management
  const [projections, setProjections] = useState([
    {
      id: 1,
      name: "Projection 1",
      isOpen: true,
      budgetAllocated: false,
      materialTotalCost: 0,
      materialBudgetPercentage: 0,
      labourCalculationType: "",
      noOfLabours: "",
      totalShifts: "",
      ratePerShift: "",
      labourTotalCost: 0,
      labourBudgetPercentage: 0,
      selectedDynamicOverheads: [],
      dynamicOverheads: {},
      activeOverheadTab: "material"
    }
  ]);
  const [currentProjectionId, setCurrentProjectionId] = useState(1);

  // ALL EXISTING FUNCTIONS FROM ORIGINAL COMPONENT
  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/admin/companies");
      if (response.data.success) {
        const companyOptions = response.data.data.map((company) => ({
          value: company.company_id,
          label: company.company_name,
        }));
        setCompanies(companyOptions);
      } else {
        setError("Failed to fetch companies.");
      }
    } catch (error) {
      console.error("Error fetching companies:", error);
      setError("Failed to load companies. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchProjects = async (companyId) => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/admin/projects/${companyId}`);
      if (response.data.success) {
        const projectOptions = response.data.data.map((project) => ({
          value: project.pd_id,
          label: project.project_name,
        }));
        setProjects(projectOptions);
      } else {
        setError("Failed to fetch projects.");
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
      setError("Failed to load projects. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchSites = async (projectId) => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/admin/sites/${projectId}`);
      if (response.data.success) {
        const siteOptions = response.data.data.map((site) => ({
          value: site.site_id,
          label: `${site.site_name} (PO: ${site.po_number})`,
        }));
        setSites(siteOptions);
      } else {
        setError("Failed to fetch sites.");
      }
    } catch (error) {
      console.error("Error fetching sites:", error);
      setError("Failed to load sites. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchWorkDescriptions = async (siteId) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:5000/admin/work-descriptions-by-site/${siteId}`
      );
      if (response.data.success) {
        const descOptions = response.data.data.map((desc) => ({
          value: desc.desc_id,
          label: desc.desc_name,
        }));
        setWorkDescriptions(descOptions);
      } else {
        setError("Failed to fetch work descriptions.");
      }
    } catch (error) {
      console.error("Error fetching work descriptions:", error);
      setError("Failed to load work descriptions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchBudgetDetails = async (siteId, descId) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:5000/admin/po-total-budget/${siteId}/${descId}`
      );
      if (response.data.success) {
        setBudgetData({
          ...response.data.data,
          total_po_value: parseFloat(response.data.data.total_po_value) || 0,
          total_rate: parseFloat(response.data.data.total_rate) || 0,
        });
      } else {
        setError("Failed to fetch budget details.");
      }
    } catch (error) {
      console.error("Error fetching budget details:", error);
      setError("Failed to load budget details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const checkBudgetExists = async (siteId, descId) => {
    try {
      const response = await axios.get("http://localhost:5000/admin/po-budget", {
        params: { site_id: siteId, desc_id: descId },
      });
      if (response.data.success && response.data.data) {
        const budget = {
          ...response.data.data,
          total_po_value: parseFloat(response.data.data.total_po_value) || 0,
          total_budget_value: parseFloat(response.data.data.total_budget_value) || 0,
        };
        setExistingBudget(budget);
        if (budget.total_po_value && budget.total_budget_value) {
          const percentage = ((budget.total_budget_value / budget.total_po_value) * 100).toFixed(2);
          setBudgetPercentage(percentage);
          setBudgetValue(budget.total_budget_value.toFixed(2));
        } else {
          setBudgetPercentage("");
          setBudgetValue("");
        }
      } else {
        setExistingBudget(null);
        setBudgetPercentage("");
        setBudgetValue("");
      }
    } catch (error) {
      console.error("Error checking budget existence:", error);
      setError("Failed to check budget existence. Please try again.");
      setExistingBudget(null);
    }
  };

  const fetchOverheads = async (po_budget_id) => {
    try {
      const response = await axios.get("http://localhost:5000/admin/overheads", {
        params: po_budget_id ? { po_budget_id } : {},
      });
      if (response.data.success) {
        setOverheads(response.data.data);
        const initialChecked = {};
        const newEntries = {};
        const initialDynamicOverheads = {};
        response.data.data.forEach((overhead) => {
          initialChecked[overhead.id] = overhead.is_default === 1;
          newEntries[overhead.id] = {
            splitted_budget: null,
            percentage: null,
            actual_value: null,
            difference_value: null,
            remarks: "",
            edited: false,
          };
          if (overhead.is_default === 0) {
            initialDynamicOverheads[overhead.id] = {
              value: "",
              budgetPercentage: 0,
              expense_name: overhead.expense_name,
            };
          }
        });
        setCheckedExpenses(initialChecked);
        setActualBudgetEntries(newEntries);
        setDynamicOverheads(initialDynamicOverheads);
      } else {
        setError("Failed to fetch overheads.");
      }
    } catch (error) {
      console.error("Error fetching overheads:", error);
      setError("Failed to load overheads. Please try again.");
    }
  };

  const fetchActualBudgetEntries = async (po_budget_id) => {
    try {
      const response = await axios.get(`http://localhost:5000/admin/actual-budget/${po_budget_id}`);
      if (response.data.success) {
        const entries = response.data.data || {};
        const processedEntries = {};
        const selectedOverheads = [];
        Object.keys(entries).forEach((overheadId) => {
          const val = parseFloat(entries[overheadId].splitted_budget) || 0;
          const perc = existingBudget?.total_budget_value > 0 ? (val / existingBudget.total_budget_value * 100).toFixed(2) : "0.00";
          processedEntries[overheadId] = {
            ...entries[overheadId],
            percentage: perc,
            edited: true,
          };
          const overhead = overheads.find((oh) => oh.id === parseInt(overheadId));
          if (overhead && overhead.is_default === 0) {
            selectedOverheads.push(overhead);
            setDynamicOverheads((prev) => ({
              ...prev,
              [overheadId]: {
                value: val.toString(),
                budgetPercentage: parseFloat(perc),
                expense_name: overhead.expense_name,
              },
            }));
          }
        });
        setActualBudgetEntries(processedEntries);
        setSelectedDynamicOverheads(selectedOverheads);
        setIsAllocated(Object.keys(processedEntries).length > 0);
        if (Object.keys(processedEntries).length > 0) {
          const checked = {};
          Object.keys(processedEntries).forEach((id) => {
            checked[id] = true;
          });
          setCheckedExpenses(checked);
        }
      } else {
        setError(response.data.message || "Failed to fetch actual budget entries.");
      }
    } catch (error) {
      console.error("Error fetching actual budget entries:", error);
      setError("Failed to load actual budget entries. Please try again.");
    }
  };

  // Projection management functions
  const addNewProjection = () => {
    const newProjectionId = Math.max(...projections.map(p => p.id)) + 1;
    const newProjection = {
      id: newProjectionId,
      name: `Projection ${newProjectionId}`,
      isOpen: false,
      budgetAllocated: false,
      materialTotalCost: 0,
      materialBudgetPercentage: 0,
      labourCalculationType: "",
      noOfLabours: "",
      totalShifts: "",
      ratePerShift: "",
      labourTotalCost: 0,
      labourBudgetPercentage: 0,
      selectedDynamicOverheads: [],
      dynamicOverheads: {},
      activeOverheadTab: "material"
    };
    setProjections([...projections, newProjection]);
  };

  const toggleProjection = (projectionId) => {
    setProjections(projections.map(p => 
      p.id === projectionId ? { ...p, isOpen: !p.isOpen } : p
    ));
  };

  const updateProjectionField = (projectionId, field, value) => {
    setProjections(projections.map(p => 
      p.id === projectionId ? { ...p, [field]: value } : p
    ));
  };

  const getCurrentProjection = () => {
    return projections.find(p => p.id === currentProjectionId) || projections[0];
  };

  const handleTotalCostChange = (totalCost) => {
    console.log("Received total cost from MaterialPlanning:", totalCost);
    const currentProjection = getCurrentProjection();
    const costValue = Number(totalCost) || 0;
    
    updateProjectionField(currentProjection.id, 'materialTotalCost', costValue);
    
    if (existingBudget?.total_budget_value) {
      const percentage = (costValue / existingBudget.total_budget_value) * 100;
      updateProjectionField(currentProjection.id, 'materialBudgetPercentage', percentage);
    }
  };

  const calculateLabourTotalCost = (projection) => {
    let total = 0;
    const rate = parseFloat(projection.ratePerShift) || 0;

    if (projection.labourCalculationType === "no_of_labours") {
      const labours = parseFloat(projection.noOfLabours) || 0;
      total = labours * rate;
    } else if (projection.labourCalculationType === "total_shifts") {
      const shifts = parseFloat(projection.totalShifts) || 0;
      total = shifts * rate;
    }

    updateProjectionField(projection.id, 'labourTotalCost', total);
    
    if (existingBudget?.total_budget_value) {
      const percentage = (total / existingBudget.total_budget_value) * 100;
      updateProjectionField(projection.id, 'labourBudgetPercentage', percentage);
    }
  };

  const calculateDynamicOverheadBudgetPercentage = (projectionId, overheadId, value) => {
    const parsedValue = parseFloat(value) || 0;
    const projection = projections.find(p => p.id === projectionId);
    
    if (existingBudget?.total_budget_value && projection) {
      const percentage = (parsedValue / existingBudget.total_budget_value) * 100;
      const updatedDynamicOverheads = {
        ...projection.dynamicOverheads,
        [overheadId]: {
          ...projection.dynamicOverheads[overheadId],
          value: parsedValue,
          budgetPercentage: percentage,
        },
      };
      updateProjectionField(projectionId, 'dynamicOverheads', updatedDynamicOverheads);
    }
  };

  const calculateRemainingBudget = (projection) => {
    const dynamicOverheadTotal = Object.values(projection.dynamicOverheads || {}).reduce(
      (sum, overhead) => sum + (parseFloat(overhead.value) || 0),
      0
    );
    const totalAllocated = projection.materialTotalCost + projection.labourTotalCost + dynamicOverheadTotal;
    const budgetValue = existingBudget?.total_budget_value || 0;
    return budgetValue - totalAllocated;
  };

  // SAVE FUNCTIONS FOR NEW OVERHEADS
  const saveLabourOverhead = async (projectionId) => {
    const projection = projections.find(p => p.id === projectionId);
    if (!projection) return;

    try {
      const payload = {
        site_id: selectedSite.value,
        desc_id: selectedWorkDescription.value,
        calculation_type: projection.labourCalculationType,
        no_of_labours: projection.labourCalculationType === "no_of_labours" ? parseInt(projection.noOfLabours) : null,
        total_shifts: projection.labourCalculationType === "total_shifts" ? parseInt(projection.totalShifts) : null,
        rate_per_shift: parseFloat(projection.ratePerShift),
        total_cost: projection.labourTotalCost,
        overhead_type: "labours",
        labourBudgetPercentage: projection.labourBudgetPercentage,
        projection_id: projectionId
      };

      console.log("Labour Overhead Payload:", payload);

      const response = await axios.post("http://localhost:5000/admin/save-labour-overhead", payload);
      
      if (response.data.success) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Labour overhead saved successfully!",
          confirmButtonColor: "#4f46e5",
          timer: 3000,
          timerProgressBar: true,
        });
      }
    } catch (error) {
      console.error("Error saving labour overhead:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to save labour overhead. Please try again.",
        confirmButtonColor: "#4f46e5",
      });
    }
  };

  const saveDynamicOverhead = async (projectionId, overheadId, overheadName) => {
    const projection = projections.find(p => p.id === projectionId);
    if (!projection) return;

    try {
      if (!selectedSite?.value || !selectedWorkDescription?.value) {
        Swal.fire({
          icon: "warning",
          title: "Invalid Selection",
          text: "Please select a site and work description before saving.",
          confirmButtonColor: "#4f46e5",
        });
        return;
      }

      const overheadEntry = projection.dynamicOverheads[overheadId];
      if (!overheadEntry || typeof overheadEntry !== 'object') {
        console.warn(`No valid data for overhead ID: ${overheadId}`);
        Swal.fire({
          icon: "error",
          title: "Invalid Data",
          text: `${overheadName} data is missing or invalid.`,
          confirmButtonColor: "#4f46e5",
        });
        return;
      }

      const rawValue = overheadEntry.value ?? 0;
      const rawPercentage = overheadEntry.budgetPercentage ?? 0;
      const value = parseFloat(rawValue);
      const percentage = parseFloat(rawPercentage);

      if (isNaN(value) || isNaN(percentage)) {
        Swal.fire({
          icon: "error",
          title: "Invalid Numbers",
          text: `${overheadName} value or percentage is not a valid number.`,
          confirmButtonColor: "#4f46e5",
        });
        return;
      }

      const payload = {
        site_id: selectedSite.value,
        desc_id: selectedWorkDescription.value,
        value,
        percentage,
        overhead_type: overheadName,
        projection_id: projectionId,
      };

      const response = await axios.post("http://localhost:5000/admin/save-dynamic-overhead-values", payload);

      if (response.data.success) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: `${overheadName} overhead saved successfully!`,
          confirmButtonColor: "#4f46e5",
          timer: 3000,
          timerProgressBar: true,
        });
      } else {
        throw new Error(response.data.message || "Unknown error");
      }
    } catch (error) {
      console.error(`Error saving ${overheadName} overhead:`, error);

      let errorMessage = "Failed to save. Please try again.";
      if (error.response) {
        errorMessage = error.response.data.message || `Server error: ${error.response.status}`;
      } else if (error.request) {
        errorMessage = "Network error: Unable to reach server. Check if backend is running.";
      } else if (error.message.includes("Invalid")) {
        errorMessage = error.message;
      }

      Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMessage,
        confirmButtonColor: "#4f46e5",
      });
    }
  };

  const savePoBudget = async (projectionId) => {
    try {
      const response = await axios.post("http://localhost:5000/admin/save-po-budget", {
        site_id: selectedSite.value,
        desc_id: selectedWorkDescription.value,
        total_po_value: budgetData.total_po_value,
        total_budget_value: parseFloat(budgetValue) || 0,
        projection_id: projectionId,
      });
      if (response.data.success) {
        await Swal.fire({
          icon: "success",
          title: "Success",
          text: response.data.message,
          confirmButtonColor: "#4f46e5",
          timer: 3000,
          timerProgressBar: true,
        });
        await checkBudgetExists(selectedSite.value, selectedWorkDescription.value);
        updateProjectionField(projectionId, 'budgetAllocated', true);
      } else {
        await Swal.fire({
          icon: "error",
          title: "Error",
          text: response.data.message,
          confirmButtonColor: "#4f46e5",
          timer: 3000,
          timerProgressBar: true,
        });
      }
    } catch (error) {
      console.error("Error saving PO budget:", error);
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to save budget. Please try again.",
        confirmButtonColor: "#4f46e5",
        timer: 3000,
        timerProgressBar: true,
      });
    }
  };

  const finalSubmissionProjection = async (projectionId) => {
    const projection = projections.find(p => p.id === projectionId);
    if (!projection) return;

    try {
      const response = await axios.post("http://localhost:5000/admin/final-projection-submission", {
        site_id: selectedSite.value,
        desc_id: selectedWorkDescription.value,
        projection_id: projectionId,
        projection_data: {
          materialTotalCost: projection.materialTotalCost,
          materialBudgetPercentage: projection.materialBudgetPercentage,
          labourTotalCost: projection.labourTotalCost,
          labourBudgetPercentage: projection.labourBudgetPercentage,
          dynamicOverheads: projection.dynamicOverheads,
        }
      });

      if (response.data.success) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: `${projection.name} submitted successfully!`,
          confirmButtonColor: "#4f46e5",
          timer: 3000,
          timerProgressBar: true,
        });
      }
    } catch (error) {
      console.error("Error in final submission:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to submit projection. Please try again.",
        confirmButtonColor: "#4f46e5",
      });
    }
  };

  // ALL REMAINING EXISTING FUNCTIONS (saveOverhead, allocateBudget, etc.)
  const saveOverhead = async () => {
    const { value: expense_name } = await Swal.fire({
      title: "Add New Overhead",
      input: "text",
      inputLabel: "Expense Name",
      inputPlaceholder: "Enter expense name",
      showCancelButton: true,
      confirmButtonText: "Save",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#4f46e5",
      inputValidator: (value) => {
        if (!value) {
          return "Expense name is required!";
        }
      },
    });

    if (expense_name) {
      try {
        const response = await axios.post("http://localhost:5000/admin/save-overhead", {
          expense_name,
        });
        if (response.data.success) {
          await Swal.fire({
            icon: "success",
            title: "Success",
            text: response.data.message,
            confirmButtonColor: "#4f46e5",
            timer: 3000,
            timerProgressBar: true,
          });
          const newOverhead = { id: response.data.data.id, expense_name, is_default: 0 };
          setOverheads((prev) => [...prev, newOverhead]);
          setCheckedExpenses((prev) => ({
            ...prev,
            [newOverhead.id]: false,
          }));
          setActualBudgetEntries((prev) => ({
            ...prev,
            [newOverhead.id]: {
              splitted_budget: null,
              percentage: null,
              actual_value: null,
              difference_value: null,
              remarks: "",
              edited: false,
            },
          }));
        } else {
          await Swal.fire({
            icon: "error",
            title: "Error",
            text: response.data.message,
            confirmButtonColor: "#4f46e5",
            timer: 3000,
            timerProgressBar: true,
          });
        }
      } catch (error) {
        console.error("Error saving overhead:", error);
        await Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to save overhead. Please try again.",
          confirmButtonColor: "#4f46e5",
          timer: 3000,
          timerProgressBar: true,
        });
      }
    }
  };

  const allocateBudget = async () => {
    if (!existingBudget || !existingBudget.total_budget_value) {
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: "No valid budget exists to allocate expenses.",
        confirmButtonColor: "#4f46e5",
        timer: 3000,
        timerProgressBar: true,
      });
      return;
    }

    const checkedCount = Object.values(checkedExpenses).filter((checked) => checked).length;
    if (checkedCount === 0) {
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: "At least one expense must be checked.",
        confirmButtonColor: "#4f46e5",
        timer: 3000,
        timerProgressBar: true,
      });
      return;
    }

    const { sumPerc, sumBudget } = computeSums();
    if (Math.abs(sumPerc - 100) > 0.01) {
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: `Total budget percentage must equal 100%. Current total: ${sumPerc.toFixed(2)}%.`,
        confirmButtonColor: "#4f46e5",
        timer: 3000,
        timerProgressBar: true,
      });
      return;
    }

    const entries = Object.keys(checkedExpenses)
      .filter((id) => checkedExpenses[id])
      .map((id) => ({
        overhead_id: parseInt(id),
        splitted_budget: parseFloat(actualBudgetEntries[id]?.splitted_budget) || 0,
        actual_value: parseFloat(actualBudgetEntries[id]?.actual_value) || null,
        remarks: actualBudgetEntries[id]?.remarks || "",
      }));

    const totalSplitted = entries.reduce((sum, entry) => sum + parseFloat(entry.splitted_budget || 0), 0);
    if (Math.abs(totalSplitted - existingBudget.total_budget_value) > 0.01) {
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: `Sum of budgeted values (${totalSplitted.toFixed(2)}) must equal total budget value (Rs.${existingBudget.total_budget_value.toFixed(2)}).`,
        confirmButtonColor: "#4f46e5",
        timer: 3000,
        timerProgressBar: true,
      });
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/admin/save-actual-budget", {
        po_budget_id: existingBudget.id,
        actual_budget_entries: entries,
      });
      if (response.data.success) {
        await Swal.fire({
          icon: "success",
          title: "Success",
          text: response.data.message,
          confirmButtonColor: "#4f46e5",
          timer: 3000,
          timerProgressBar: true,
        });
        await fetchActualBudgetEntries(existingBudget.id);
        try {
          await axios.get("http://localhost:5000/site-incharge/calculate-labour-budget");
        } catch (error) {
          console.error("Error calling calculate-labour-budget API:", error.message);
        }
      } else {
        await Swal.fire({
          icon: "error",
          title: "Error",
          text: response.data.message,
          confirmButtonColor: "#4f46e5",
          timer: 3000,
          timerProgressBar: true,
        });
      }
    } catch (error) {
      console.error("Error allocating budget:", error);
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to allocate budget. Please try again.",
        confirmButtonColor: "#4f46e5",
        timer: 3000,
        timerProgressBar: true,
      });
    }
  };

  const addNewOverhead = async () => {
    const { value: expense_name } = await Swal.fire({
      title: "Add New Overhead",
      input: "text",
      inputLabel: "Expense Name",
      inputPlaceholder: "Enter expense name",
      showCancelButton: true,
      confirmButtonText: "Save",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#4f46e5",
      inputValidator: (value) => {
        if (!value) {
          return "Expense name is required!";
        }
        if (overheads.some((oh) => oh.expense_name.toLowerCase() === value.toLowerCase())) {
          return "Expense name already exists!";
        }
      },
    });

    if (expense_name) {
      try {
        const response = await axios.post("http://localhost:5000/admin/save-overhead", {
          expense_name,
        });
        if (response.data.success) {
          const newOverhead = response.data.data;
          setOverheads((prev) => [...prev, newOverhead]);
          setDynamicOverheads((prev) => ({
            ...prev,
            [newOverhead.id]: {
              value: "",
              budgetPercentage: 0,
              expense_name: newOverhead.expense_name,
            },
          }));
          setCheckedExpenses((prev) => ({
            ...prev,
            [newOverhead.id]: false,
          }));
          setActualBudgetEntries((prev) => ({
            ...prev,
            [newOverhead.id]: {
              splitted_budget: null,
              percentage: null,
              actual_value: null,
              difference_value: null,
              remarks: "",
              edited: false,
            },
          }));
          setSelectedDynamicOverheads((prev) => [...prev, newOverhead]);
          Swal.fire({
            icon: "success",
            title: "Success",
            text: "Overhead added successfully!",
            confirmButtonColor: "#4f46e5",
            timer: 3000,
            timerProgressBar: true,
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: response.data.message,
            confirmButtonColor: "#4f46e5",
          });
        }
      } catch (error) {
        console.error("Error adding new overhead:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to add overhead. Please try again.",
          confirmButtonColor: "#4f46e5",
        });
      }
    }
  };

  // ALL EXISTING HANDLERS
  const handleBudgetPercentageChange = (e) => {
    let percentage = e.target.value;
    if (percentage && parseFloat(percentage) > 100) {
      percentage = "100";
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Budget percentage cannot exceed 100%.",
        confirmButtonColor: "#4f46e5",
        timer: 3000,
        timerProgressBar: true,
      });
    }
    setBudgetPercentage(percentage);
    if (percentage && budgetData && budgetData.total_po_value) {
      const percentageValue = parseFloat(percentage);
      if (!isNaN(percentageValue) && percentageValue >= 0) {
        const calculatedValue = (percentageValue / 100) * budgetData.total_po_value;
        if (calculatedValue <= budgetData.total_po_value) {
          setBudgetValue(calculatedValue.toFixed(2));
        } else {
          setBudgetValue(budgetData.total_po_value.toFixed(2));
        }
      } else {
        setBudgetValue("");
      }
    } else {
      setBudgetValue("");
    }
  };

  const handleBudgetValueChange = (e) => {
    let value = e.target.value;
    if (
      value &&
      budgetData &&
      budgetData.total_po_value &&
      parseFloat(value) > budgetData.total_po_value
    ) {
      value = budgetData.total_po_value.toString();
      Swal.fire({
        icon: "error",
        title: "Error",
        text: `Budget value cannot exceed Rs.${budgetData.total_po_value.toFixed(2)}.`,
        confirmButtonColor: "#4f46e5",
        timer: 3000,
        timerProgressBar: true,
      });
    }
    setBudgetValue(value);
    if (value && budgetData && budgetData.total_po_value) {
      const valueNumber = parseFloat(value);
      if (!isNaN(valueNumber) && valueNumber >= 0 && budgetData.total_po_value > 0) {
        const calculatedPercentage = (valueNumber / budgetData.total_po_value) * 100;
        if (calculatedPercentage <= 100) {
          setBudgetPercentage(calculatedPercentage.toFixed(2));
        } else {
          setBudgetPercentage("100");
        }
      } else {
        setBudgetPercentage("");
      }
    } else {
      setBudgetPercentage("");
    }
  };

  const handleExpenseCheckboxChange = (id) => {
    setCheckedExpenses((prev) => {
      const newChecked = { ...prev, [id]: !prev[id] };
      const checkedCount = Object.values(newChecked).filter((checked) => checked).length;
      if (checkedCount === 0) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "At least one expense must be checked.",
          confirmButtonColor: "#4f46e5",
          timer: 3000,
          timerProgressBar: true,
        });
        return prev;
      }
      if (!newChecked[id]) {
        setActualBudgetEntries((prevEntries) => ({
          ...prevEntries,
          [id]: {
            ...prevEntries[id],
            splitted_budget: null,
            percentage: null,
            edited: false,
          },
        }));
      }
      return newChecked;
    });
  };

  const handlePercentageChange = (id, value) => {
    let perc = value === "" ? "" : parseFloat(value);
    if (value === "" || isNaN(perc) || perc < 0) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Percentage cannot be negative or invalid.",
        confirmButtonColor: "#4f46e5",
        timer: 3000,
        timerProgressBar: true,
      });
      return;
    }
    if (perc > 100) {
      perc = 100;
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Percentage cannot exceed 100%.",
        confirmButtonColor: "#4f46e5",
        timer: 3000,
        timerProgressBar: true,
      });
    }
    const total = existingBudget.total_budget_value;
    const newValue = ((perc / 100) * total).toFixed(2);
    setActualBudgetEntries((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        percentage: value,
        splitted_budget: newValue,
        edited: true,
      },
    }));
  };

  const handleSplittedBudgetChange = (id, value) => {
    let val = parseFloat(value);
    if (isNaN(val) || val < 0) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Budget value cannot be negative.",
        confirmButtonColor: "#4f46e5",
        timer: 3000,
        timerProgressBar: true,
      });
      return;
    }
    const total = existingBudget.total_budget_value;
    if (val > total) {
      val = total;
      Swal.fire({
        icon: "error",
        title: "Error",
        text: `Budget value cannot exceed Rs.${total.toFixed(2)}.`,
        confirmButtonColor: "#4f46e5",
        timer: 3000,
        timerProgressBar: true,
      });
    }
    const perc = (val / total * 100).toFixed(2);
    setActualBudgetEntries((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        splitted_budget: val.toFixed(2),
        percentage: perc.includes(".") ? perc : parseInt(perc).toString(),
        edited: true,
      },
    }));
  };

  const handleSelectOverhead = (overhead, projectionId) => {
    const projection = projections.find(p => p.id === projectionId);
    if (!projection.selectedDynamicOverheads.some((oh) => oh.id === overhead.id)) {
      const updatedSelectedOverheads = [...projection.selectedDynamicOverheads, overhead];
      updateProjectionField(projectionId, 'selectedDynamicOverheads', updatedSelectedOverheads);
    }
  };

  const handleRemoveOverhead = (overheadId, projectionId) => {
    const projection = projections.find(p => p.id === projectionId);
    const updatedSelectedOverheads = projection.selectedDynamicOverheads.filter((oh) => oh.id !== overheadId);
    updateProjectionField(projectionId, 'selectedDynamicOverheads', updatedSelectedOverheads);
    
    const updatedDynamicOverheads = { ...projection.dynamicOverheads };
    updatedDynamicOverheads[overheadId] = {
      ...updatedDynamicOverheads[overheadId],
      value: "",
      budgetPercentage: 0,
    };
    updateProjectionField(projectionId, 'dynamicOverheads', updatedDynamicOverheads);
  };

  const computeSums = () => {
    let sumPerc = 0;
    let sumBudget = 0;
    Object.keys(checkedExpenses).forEach((id) => {
      if (checkedExpenses[id]) {
        sumPerc += parseFloat(actualBudgetEntries[id]?.percentage || 0);
        sumBudget += parseFloat(actualBudgetEntries[id]?.splitted_budget || 0);
      }
    });
    return { sumPerc, sumBudget };
  };

  const handleSubmit = async () => {
    if (
      selectedCompany &&
      selectedProject &&
      selectedSite &&
      selectedWorkDescription &&
      budgetPercentage &&
      budgetValue
    ) {
      await savePoBudget(1);
    } else {
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: "Please select all fields and enter budget details before submitting.",
        confirmButtonColor: "#4f46e5",
        timer: 3000,
        timerProgressBar: true,
      });
    }
  };

  // ALL EXISTING USEEFFECTS PLUS NEW ONES
  useEffect(() => {
    fetchCompanies();
  }, []);

  useEffect(() => {
    projections.forEach(projection => {
      calculateLabourTotalCost(projection);
    });
  }, [projections.map(p => p.labourCalculationType + p.noOfLabours + p.totalShifts + p.ratePerShift).join(','), existingBudget]);

  useEffect(() => {
    if (selectedCompany) {
      fetchProjects(selectedCompany.value);
      setProjects([]);
      setSites([]);
      setWorkDescriptions([]);
      setSelectedProject(null);
      setSelectedSite(null);
      setSelectedWorkDescription(null);
      setBudgetData(null);
      setExistingBudget(null);
      setBudgetPercentage("");
      setBudgetValue("");
      setOverheads([]);
      setCheckedExpenses({});
      setActualBudgetEntries({});
      setIsAllocated(false);
    } else {
      setProjects([]);
      setSites([]);
      setWorkDescriptions([]);
      setSelectedProject(null);
      setSelectedSite(null);
      setSelectedWorkDescription(null);
      setBudgetData(null);
      setExistingBudget(null);
      setBudgetPercentage("");
      setBudgetValue("");
      setOverheads([]);
      setCheckedExpenses({});
      setActualBudgetEntries({});
      setIsAllocated(false);
    }
  }, [selectedCompany]);

  useEffect(() => {
    if (selectedProject) {
      fetchSites(selectedProject.value);
      setSites([]);
      setWorkDescriptions([]);
      setSelectedSite(null);
      setSelectedWorkDescription(null);
      setBudgetData(null);
      setExistingBudget(null);
      setBudgetPercentage("");
      setBudgetValue("");
      setOverheads([]);
      setCheckedExpenses({});
      setActualBudgetEntries({});
      setIsAllocated(false);
    } else {
      setSites([]);
      setWorkDescriptions([]);
      setSelectedSite(null);
      setSelectedWorkDescription(null);
      setBudgetData(null);
      setExistingBudget(null);
      setBudgetPercentage("");
      setBudgetValue("");
      setOverheads([]);
      setCheckedExpenses({});
      setActualBudgetEntries({});
      setIsAllocated(false);
    }
  }, [selectedProject]);

  useEffect(() => {
    if (selectedSite) {
      fetchWorkDescriptions(selectedSite.value);
      setWorkDescriptions([]);
      setSelectedWorkDescription(null);
      setBudgetData(null);
      setExistingBudget(null);
      setBudgetPercentage("");
      setBudgetValue("");
      setOverheads([]);
      setCheckedExpenses({});
      setActualBudgetEntries({});
      setIsAllocated(false);
    } else {
      setWorkDescriptions([]);
      setSelectedWorkDescription(null);
      setBudgetData(null);
      setExistingBudget(null);
      setBudgetPercentage("");
      setBudgetValue("");
      setOverheads([]);
      setCheckedExpenses({});
      setActualBudgetEntries({});
      setIsAllocated(false);
    }
  }, [selectedSite]);

  useEffect(() => {
    if (selectedSite && selectedWorkDescription) {
      fetchBudgetDetails(selectedSite.value, selectedWorkDescription.value);
      checkBudgetExists(selectedSite.value, selectedWorkDescription.value);
    } else {
      setBudgetData(null);
      setExistingBudget(null);
      setBudgetPercentage("");
      setBudgetValue("");
      setOverheads([]);
      setCheckedExpenses({});
      setActualBudgetEntries({});
      setIsAllocated(false);
    }
  }, [selectedSite, selectedWorkDescription]);

  useEffect(() => {
    if (existingBudget && existingBudget.id) {
      fetchOverheads(existingBudget.id);
      fetchActualBudgetEntries(existingBudget.id);
    } else {
      setOverheads([]);
      setCheckedExpenses({});
      setActualBudgetEntries({});
      setDynamicOverheads({});
      setSelectedDynamicOverheads([]);
      setIsAllocated(false);
    }
  }, [existingBudget]);

  // CHART CALCULATIONS
  const chartData = existingBudget && actualBudgetEntries ? (() => {
    const budgetedValue = Object.values(actualBudgetEntries)
      .filter((entry) => entry.splitted_budget !== null)
      .reduce((sum, entry) => sum + parseFloat(entry.splitted_budget || 0), 0);
    const actualValue = Object.values(actualBudgetEntries)
      .filter((entry) => entry.actual_value !== null)
      .reduce((sum, entry) => sum + parseFloat(entry.actual_value || 0), 0);
    const balanceValue = budgetedValue - actualValue;
    return [
      { name: "Budgeted Value", value: budgetedValue, fill: "#92c352" },
      { name: "Actual Value", value: actualValue, fill: "#40A4DF" },
      { name: "Balance", value: Math.abs(balanceValue), fill: balanceValue < 0 ? "#C84D4D" : "#f0af0a" },
    ];
  })() : [];

  const expenseChartData = overheads
    .filter((overhead) => isAllocated ? actualBudgetEntries[overhead.id]?.splitted_budget !== null : true )
    .map((overhead) => {
      const budgeted = parseFloat(actualBudgetEntries[overhead.id]?.splitted_budget) || 0;
      const actual = parseFloat(actualBudgetEntries[overhead.id]?.actual_value) || 0;
      const actualExceedsBudget = actual > budgeted;
      return {
        name: overhead.expense_name,
        budgeted: budgeted,
        actual: actual,
        actualFill: actualExceedsBudget ? "#C84D4D" : "#40A4DF",
      };
    });

  const { sumPerc, sumBudget } = computeSums();
  const total = existingBudget?.total_budget_value || 0;
  const percDiff = sumPerc - 100;
  const budgetDiff = sumBudget - total;
  const percError = percDiff > 0.01 ? `Excess by ${percDiff.toFixed(2)}%` : percDiff < -0.01 ? `Short by ${Math.abs(percDiff).toFixed(2)}%` : "";
  const budgetError = budgetDiff > 0.01 ? `Excess by Rs.${budgetDiff.toFixed(2)}` : budgetDiff < -0.01 ? `Short by Rs.${Math.abs(budgetDiff).toFixed(2)}` : "";
  const isValid = Math.abs(sumPerc - 100) <= 0.01 && Math.abs(budgetDiff) <= 0.01;
  const successMessage = isValid ? "100% of budgeted value allocated successfully!" : "";

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Project Budget Allocation</h1>

        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Company, Project, Site, Work Description Selection */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Project Selection</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company
              </label>
              <Select
                value={selectedCompany}
                onChange={setSelectedCompany}
                options={companies}
                placeholder="Select a company..."
                isLoading={loading}
                isClearable
                className="text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project
              </label>
              <Select
                value={selectedProject}
                onChange={setSelectedProject}
                options={projects}
                placeholder="Select a project..."
                isLoading={loading}
                isDisabled={!selectedCompany}
                isClearable
                className="text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Site
              </label>
              <Select
                value={selectedSite}
                onChange={setSelectedSite}
                options={sites}
                placeholder="Select a site..."
                isLoading={loading}
                isDisabled={!selectedProject}
                isClearable
                className="text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Work Description
              </label>
              <Select
                value={selectedWorkDescription}
                onChange={setSelectedWorkDescription}
                options={workDescriptions}
                placeholder="Select work description..."
                isLoading={loading}
                isDisabled={!selectedSite}
                isClearable
                className="text-sm"
              />
            </div>
          </div>
        </div>

        {/* Budget Details */}
        {budgetData && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">PO Budget Details</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto border-collapse border border-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="border border-gray-300 px-4 py-2 text-left">
                      Total PO Quantity
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left">
                      Unit of Measure
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left">
                      Total Rate
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">
                      {budgetData.total_po_qty}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {budgetData.uom}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      Rs.{budgetData.total_rate.toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="mt-4">
              <span className="text-lg font-semibold text-indigo-600">
                Total PO Value: Rs.{budgetData.total_po_value.toFixed(2)}
              </span>
            </div>

            {/* Current Selection, Budget Info, Allocation Status */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
                  Current Selection
                </h4>
                <p className="text-sm">
                  Company: {selectedCompany?.label || "Not selected"}
                </p>
                <p className="text-sm">
                  Project: {selectedProject?.label || "Not selected"}
                </p>
                <p className="text-sm">Site: {selectedSite?.label || "Not selected"}</p>
                <p className="text-sm">
                  Work Description: {selectedWorkDescription?.label || "Not selected"}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
                  Budget Information
                </h4>
                <p className="text-sm">
                  PO Value: {budgetData ? `Rs.${budgetData.total_po_value.toFixed(2)}` : "Not available"}
                </p>
                <p className="text-sm">
                  Budget Value: {existingBudget ? `Rs.${existingBudget.total_budget_value.toFixed(2)}` : "Not set"}
                </p>
                <p className="text-sm">
                  Budget Percentage: {existingBudget ? `${budgetPercentage}%` : "Not set"}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
                  Allocation Status
                </h4>
                <p className="text-sm">
                  Status: {isAllocated ? "Budget Allocated" : "Pending Allocation"}
                </p>
                <p className="text-sm">
                  Total Overheads: {overheads.length}
                </p>
                <p className="text-sm">
                  Selected Overheads: {Object.values(checkedExpenses).filter(Boolean).length}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* New Overhead Allocation Section - Projection-wise */}
        {existingBudget && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">New Overhead Allocation Section</h2>
              <button
                onClick={addNewProjection}
                className="flex items-center px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700"
              >
                <PlusCircle className="mr-2" size={16} />
                Add Projection
              </button>
            </div>

            {/* Projection Accordions */}
            {projections.map((projection) => (
              <div key={projection.id} className="border border-gray-200 rounded-lg mb-4">
                <div
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
                  onClick={() => toggleProjection(projection.id)}
                >
                  <h3 className="text-lg font-medium">{projection.name}</h3>
                  <div className="flex items-center space-x-2">
                    {projection.budgetAllocated && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        Budget Allocated
                      </span>
                    )}
                    {projection.isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                </div>

                {projection.isOpen && (
                  <div className="p-4 border-t border-gray-200">
                    {/* Budget Allocation for this projection */}
                    {!projection.budgetAllocated && (
                      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                        <h4 className="text-lg font-medium mb-3">Budget Allocation</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Budget Percentage (%)
                            </label>
                            <input
                              type="number"
                              step="0.01"
                              max="100"
                              min="0"
                              value={budgetPercentage}
                              onChange={handleBudgetPercentageChange}
                              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                              placeholder="Enter percentage"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Budget Value (Rs.)
                            </label>
                            <input
                              type="number"
                              step="0.01"
                              min="0"
                              value={budgetValue}
                              onChange={handleBudgetValueChange}
                              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                              placeholder="Enter budget value"
                            />
                          </div>

                          <div className="flex items-end">
                            <button
                              onClick={() => savePoBudget(projection.id)}
                              className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                              disabled={loading}
                            >
                              {loading ? (
                                <Loader2 className="animate-spin inline-block mr-2" size={16} />
                              ) : null}
                              Save Budget
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Overhead Allocation Tabs */}
                    {projection.budgetAllocated && (
                      <>
                        <div className="flex space-x-2 mb-6 border-b overflow-x-auto">
                          {[
                            { key: "material", label: "Material" },
                            { key: "labour", label: "Labour" },
                            ...projection.selectedDynamicOverheads.map((overhead) => ({
                              key: `overhead-${overhead.id}`,
                              label: overhead.expense_name,
                            })),
                          ].map((tab) => (
                            <button
                              key={tab.key}
                              className={`px-4 py-2 font-medium whitespace-nowrap ${
                                projection.activeOverheadTab === tab.key
                                  ? "text-indigo-600 border-b-2 border-indigo-600"
                                  : "text-gray-600 hover:text-indigo-600"
                              }`}
                              onClick={() => updateProjectionField(projection.id, 'activeOverheadTab', tab.key)}
                            >
                              {tab.label}
                            </button>
                          ))}
                          <button
                            onClick={() => {
                              Swal.fire({
                                title: "Select Overhead",
                                input: "select",
                                inputOptions: overheads
                                  .filter((oh) => oh.is_default === 0)
                                  .filter((oh) => !projection.selectedDynamicOverheads.some((selected) => selected.id === oh.id))
                                  .reduce((options, overhead) => {
                                    options[overhead.id] = overhead.expense_name;
                                    return options;
                                  }, {}),
                                inputPlaceholder: "Select an overhead",
                                showCancelButton: true,
                                confirmButtonText: "Add",
                                confirmButtonColor: "#4f46e5",
                                showDenyButton: true,
                                denyButtonText: "Add New Overhead",
                                denyButtonColor: "#22c55e",
                                inputValidator: (value) => {
                                  if (!value) {
                                    return "Please select an overhead!";
                                  }
                                },
                              }).then((result) => {
                                if (result.isConfirmed) {
                                  const selectedOverhead = overheads.find((oh) => oh.id === parseInt(result.value));
                                  handleSelectOverhead(selectedOverhead, projection.id);
                                  updateProjectionField(projection.id, 'activeOverheadTab', `overhead-${selectedOverhead.id}`);
                                } else if (result.isDenied) {
                                  addNewOverhead();
                                }
                              });
                            }}
                            className="flex items-center px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700"
                          >
                            <PlusCircle className="mr-2" size={16} />
                            Add Overhead
                          </button>
                        </div>

                        {/* Material Overhead Tab */}
                        {projection.activeOverheadTab === "material" && (
                          <div>
                            <h4 className="text-lg font-medium mb-4">Material Overhead</h4>
                            <MaterialPlanning
                              selectedCompany={selectedCompany}
                              selectedProject={selectedProject}
                              selectedSite={selectedSite}
                              selectedWorkDesc={selectedWorkDescription}
                              existingBudget={existingBudget}
                              onTotalCostChange={handleTotalCostChange}
                            />
                          </div>
                        )}

                        {/* Labour Overhead Tab */}
                        {projection.activeOverheadTab === "labour" && (
                          <div>
                            <h4 className="text-lg font-medium mb-4">Labour Overhead</h4>
                            <div className="grid grid-cols-2 gap-4 mb-4">
                              <div>
                                <label className="block text-sm font-medium mb-2">Calculation Type</label>
                                <select
                                  value={projection.labourCalculationType}
                                  onChange={(e) => updateProjectionField(projection.id, 'labourCalculationType', e.target.value)}
                                  className="w-full p-2 border border-gray-300 rounded-lg"
                                >
                                  <option value="">Select Type</option>
                                  <option value="no_of_labours">No of Labours</option>
                                  <option value="total_shifts">Total Estimated Shifts</option>
                                </select>
                              </div>
                            </div>
                            {projection.labourCalculationType && (
                              <div className="grid grid-cols-3 gap-4 mb-4">
                                {projection.labourCalculationType === "no_of_labours" && (
                                  <div>
                                    <label className="block text-sm font-medium mb-2">No of Labours</label>
                                    <input
                                      type="number"
                                      value={projection.noOfLabours}
                                      onChange={(e) => updateProjectionField(projection.id, 'noOfLabours', e.target.value)}
                                      className="w-full p-2 border border-gray-300 rounded-lg"
                                      placeholder="Enter number of labours"
                                    />
                                  </div>
                                )}
                                {projection.labourCalculationType === "total_shifts" && (
                                  <div>
                                    <label className="block text-sm font-medium mb-2">Total Estimated Shifts</label>
                                    <input
                                      type="number"
                                      value={projection.totalShifts}
                                      onChange={(e) => updateProjectionField(projection.id, 'totalShifts', e.target.value)}
                                      className="w-full p-2 border border-gray-300 rounded-lg"
                                      placeholder="Enter total shifts"
                                    />
                                  </div>
                                )}
                                <div>
                                  <label className="block text-sm font-medium mb-2">Rate per Shift</label>
                                  <input
                                    type="number"
                                    value={projection.ratePerShift}
                                    onChange={(e) => updateProjectionField(projection.id, 'ratePerShift', e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-lg"
                                    placeholder="Enter rate per shift"
                                  />
                                </div>
                              </div>
                            )}
                            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                              <div className="flex justify-between items-center mb-2">
                                <span className="font-medium">Total Labour Cost:</span>
                                <span className="text-lg font-semibold">Rs. {projection.labourTotalCost.toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="font-medium">Budget Percentage:</span>
                                <span className="text-lg font-semibold">{projection.labourBudgetPercentage.toFixed(2)}%</span>
                              </div>
                            </div>
                            <button
                              onClick={() => saveLabourOverhead(projection.id)}
                              className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                            >
                              Save Labour Overhead
                            </button>
                          </div>
                        )}

                        {/* Dynamic Overhead Tabs */}
                        {projection.selectedDynamicOverheads.map((overhead) => (
                          projection.activeOverheadTab === `overhead-${overhead.id}` && (
                            <div key={overhead.id} className="relative">
                              <h4 className="text-lg font-medium mb-4">{overhead.expense_name} Overhead</h4>
                              <button
                                onClick={() => handleRemoveOverhead(overhead.id, projection.id)}
                                className="absolute top-2 right-2 text-red-600 hover:text-red-800"
                                title={`Remove ${overhead.expense_name}`}
                              >
                                <Trash2 size={16} />
                              </button>
                              <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                  <label className="block text-sm font-medium mb-2">
                                    {overhead.expense_name} Value
                                  </label>
                                  <input
                                    type="number"
                                    value={projection.dynamicOverheads[overhead.id]?.value || ""}
                                    onChange={(e) =>
                                      calculateDynamicOverheadBudgetPercentage(projection.id, overhead.id, e.target.value)
                                    }
                                    max={calculateRemainingBudget(projection)}
                                    className="w-full p-2 border border-gray-300 rounded-lg"
                                    placeholder={`Enter ${overhead.expense_name} value`}
                                  />
                                  <p className="text-sm text-gray-600 mt-1">
                                    Remaining Budget: Rs. {calculateRemainingBudget(projection).toFixed(2)}
                                  </p>
                                </div>
                                <div>
                                  <label className="block text-sm font-medium mb-2">Budget Percentage</label>
                                  <input
                                    type="text"
                                    value={`${(projection.dynamicOverheads[overhead.id]?.budgetPercentage || 0).toFixed(2)}%`}
                                    readOnly
                                    className="w-full p-2 border border-gray-300 rounded-lg bg-gray-50"
                                  />
                                </div>
                              </div>
                              <button
                                onClick={() => saveDynamicOverhead(projection.id, overhead.id, overhead.expense_name)}
                                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                              >
                                Save {overhead.expense_name} Overhead
                              </button>
                            </div>
                          )
                        ))}

                        {/* Budget Allocation Summary for Projection 1 */}
                        {projection.id === 1 && (
                          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                            <h4 className="text-lg font-medium mb-3">Budget Allocation Summary</h4>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p>Material: Rs. {projection.materialTotalCost.toFixed(2)} ({projection.materialBudgetPercentage.toFixed(2)}%)</p>
                                <p>Labour: Rs. {projection.labourTotalCost.toFixed(2)} ({projection.labourBudgetPercentage.toFixed(2)}%)</p>
                              </div>
                              <div>
                                {projection.selectedDynamicOverheads.map((overhead) => (
                                  <p key={overhead.id}>
                                    {overhead.expense_name}: Rs. {(parseFloat(projection.dynamicOverheads[overhead.id]?.value) || 0).toFixed(2)} (
                                    {(projection.dynamicOverheads[overhead.id]?.budgetPercentage || 0).toFixed(2)}%)
                                  </p>
                                ))}
                              </div>
                            </div>
                            <div className="mt-3 pt-3 border-t">
                              <p className="font-semibold">
                                Total Allocated: Rs.{' '}
                                {(projection.materialTotalCost +
                                  projection.labourTotalCost +
                                  Object.values(projection.dynamicOverheads || {}).reduce(
                                    (sum, overhead) => sum + (parseFloat(overhead.value) || 0),
                                    0
                                  )).toFixed(2)}
                              </p>
                              <p className="font-semibold">Remaining Budget: Rs. {calculateRemainingBudget(projection).toFixed(2)}</p>
                            </div>
                            <div className="mt-4">
                              <button
                                onClick={() => finalSubmissionProjection(projection.id)}
                                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                              >
                                Final Submission (Save Projection 1)
                              </button>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        
        {/* Existing Overhead Allocation Section */}
        {existingBudget && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">
                {isAllocated ? "Budget Allocated" : "Allocate Budget"}
              </h2>
              {!isAllocated && (
                <button
                  onClick={saveOverhead}
                  className="flex items-center px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400"
                >
                  <Plus className="mr-2" size={16} />
                  Add New Overhead
                </button>
              )}
            </div>
            {overheads.length > 0 ? (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full table-auto border-collapse border border-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="border border-gray-300 px-4 py-2 text-left">
                          S.No
                        </th>
                        {!isAllocated && (
                          <th className="border border-gray-300 px-4 py-2 text-left">
                            Select
                          </th>
                        )}
                        <th className="border border-gray-300 px-4 py-2 text-left">
                          List of Expense{" "}
                          {!isAllocated && (
                            <button
                              onClick={saveOverhead}
                              className="ml-2 text-green-600 hover:text-green-800"
                              title="Add new overhead"
                            >
                              <Plus size={16} />
                            </button>
                          )}
                        </th>
                        <th className="border border-gray-300 px-4 py-2 text-left">
                          Budget Percentage (%){" "}
                          {successMessage && (
                            <span className="text-green-600 text-sm">
                              {successMessage}
                            </span>
                          )}
                          {percError && !successMessage && (
                            <span className="text-red-600 text-sm">
                              {percError}
                            </span>
                          )}
                        </th>
                        <th className="border border-gray-300 px-4 py-2 text-left">
                          Budgeted Value (Rs.){" "}
                          {successMessage && (
                            <span className="text-green-600 text-sm">
                              {successMessage}
                            </span>
                          )}
                          {budgetError && !successMessage && (
                            <span className="text-red-600 text-sm">
                              {budgetError}
                            </span>
                          )}
                        </th>
                        <th className="border border-gray-300 px-4 py-2 text-left">
                          Actual Value (Rs.)
                        </th>
                        <th className="border border-gray-300 px-4 py-2 text-left">
                          Balance (Rs.)
                        </th>
                        <th className="border border-gray-300 px-4 py-2 text-left">
                          Remarks
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {overheads.map((overhead, index) => {
                        const balance =
                          actualBudgetEntries[overhead.id]?.splitted_budget &&
                          actualBudgetEntries[overhead.id]?.actual_value
                            ? parseFloat(
                                actualBudgetEntries[overhead.id].splitted_budget
                              ) - parseFloat(actualBudgetEntries[overhead.id].actual_value)
                            : null;

                        return (
                          <tr key={overhead.id}>
                            <td className="border border-gray-300 px-4 py-2">
                              {index + 1}
                            </td>
                            {!isAllocated && (
                              <td className="border border-gray-300 px-4 py-2 text-center">
                                <input
                                  type="checkbox"
                                  checked={checkedExpenses[overhead.id] || false}
                                  onChange={() =>
                                    handleExpenseCheckboxChange(overhead.id)
                                  }
                                  disabled={overhead.is_default === 1}
                                />
                              </td>
                            )}
                            <td className="border border-gray-300 px-4 py-2">
                              {overhead.expense_name}
                            </td>
                            <td className="border border-gray-300 px-4 py-2">
                              {isAllocated ? (
                                actualBudgetEntries[overhead.id]?.percentage || "N/A"
                              ) : checkedExpenses[overhead.id] ? (
                                <input
                                  type="number"
                                  step="0.01"
                                  min="0"
                                  max="100"
                                  value={
                                    actualBudgetEntries[overhead.id]?.percentage || ""
                                  }
                                  onChange={(e) =>
                                    handlePercentageChange(overhead.id, e.target.value)
                                  }
                                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                />
                              ) : (
                                "N/A"
                              )}
                            </td>
                            <td className="border border-gray-300 px-4 py-2">
                              {isAllocated ? (
                                actualBudgetEntries[overhead.id]?.splitted_budget || "N/A"
                              ) : checkedExpenses[overhead.id] ? (
                                <input
                                  type="number"
                                  step="0.01"
                                  min="0"
                                  value={
                                    actualBudgetEntries[overhead.id]?.splitted_budget || ""
                                  }
                                  onChange={(e) =>
                                    handleSplittedBudgetChange(overhead.id, e.target.value)
                                  }
                                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                />
                              ) : (
                                "N/A"
                              )}
                            </td>
                            <td className="border border-gray-300 px-4 py-2">
                              {actualBudgetEntries[overhead.id]?.actual_value || "N/A"}
                            </td>
                            <td className="border border-gray-300 px-4 py-2">
                              {balance !== null ? (
                                <span
                                  className={
                                    balance >= 0 ? "text-green-600" : "text-red-600"
                                  }
                                >
                                  {balance.toFixed(2)}
                                </span>
                              ) : (
                                "N/A"
                              )}
                            </td>
                            <td className="border border-gray-300 px-4 py-2">
                              {actualBudgetEntries[overhead.id]?.remarks || "N/A"}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Total Row */}
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <span className="font-medium">Total Percentage:</span>
                      <span
                        className={`ml-2 font-semibold ${
                          Math.abs(sumPerc - 100) <= 0.01
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {sumPerc.toFixed(2)}%
                      </span>
                    </div>
                    <div>
                      <span className="font-medium">Total Budget:</span>
                      <span
                        className={`ml-2 font-semibold ${
                          Math.abs(sumBudget - total) <= 0.01
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        Rs.{sumBudget.toFixed(2)}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium">Target Budget:</span>
                      <span className="ml-2 font-semibold text-indigo-600">
                        Rs.{total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                  {successMessage && (
                    <div className="mt-2 text-green-600 font-medium">
                      {successMessage}
                    </div>
                  )}
                  {!successMessage && (percError || budgetError) && (
                    <div className="mt-2 text-red-600 font-medium">
                      {percError && <div>{percError}</div>}
                      {budgetError && <div>{budgetError}</div>}
                    </div>
                  )}
                </div>

                {/* Allocate Button */}
                {!isAllocated && (
                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={allocateBudget}
                      className={`px-6 py-3 font-semibold rounded-lg focus:outline-none focus:ring-2 ${
                        isValid
                          ? "bg-green-600 text-white hover:bg-green-700 focus:ring-green-400"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                      disabled={!isValid || loading}
                    >
                      {loading ? (
                        <Loader2 className="animate-spin inline-block mr-2" size={16} />
                      ) : null}
                      Allocate Budget
                    </button>
                  </div>
                )}
              </>
            ) : (

              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">
                  No overheads found. Add some overheads to begin budget allocation.
                </p>
                <button
                  onClick={saveOverhead}
                  className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                >
                  Add New Overhead
                </button>
              </div>
            )}
          </div>
        )}

        {/* Charts Section */}
        {isAllocated && chartData.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Total Budget Chart */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4">
                Budget Overview (Budgeted vs Actual vs Balance)
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip
                      formatter={(value) => [`Rs.${value.toFixed(2)}`, "Amount"]}
                    />

                    <Bar dataKey="value">
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Individual Expenses Chart */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4">
                Expense-wise Allocation (Budgeted vs Actual)
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={expenseChartData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip
                      formatter={(value) => [`Rs.${value.toFixed(2)}`, "Amount"]}
                    />
                    <Bar dataKey="budgeted" fill="#92c352" name="Budgeted" />
                    <Bar dataKey="actual" name="Actual">
                      {expenseChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.actualFill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
        
      </div>
    </div>
  );
};

export default ProjectProjectionOld;