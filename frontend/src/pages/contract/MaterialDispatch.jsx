// import React, { useState, useEffect, useRef, useMemo } from "react";
// import axios from "axios";
// import Select from "react-select";
// import CreatableSelect from 'react-select/creatable';
// import { Loader2, Package, FileText, X, Truck, ChevronDown } from "lucide-react";
// import Swal from "sweetalert2";

// const SearchableDropdown = ({ options, selectedValue, onSelect, placeholder, searchKeys, label, disabled, loading }) => {
//   // Memoize options to prevent unnecessary re-renders
//   const selectOptions = useMemo(
//     () =>
//       options.map((option) => ({
//         value: option.id,
//         label: option[searchKeys[0]]?.toString() || "",
//         subLabel: searchKeys[1] ? option[searchKeys[1]]?.toString() || "" : null,
//       })),
//     [options, searchKeys]
//   );

//   // Find the selected option or set to null if not found
//   const selectedOption = useMemo(
//     () => selectOptions.find((opt) => opt.value === selectedValue) || null,
//     [selectOptions, selectedValue]
//   );

//   // Handle selection change
//   const handleChange = (selected) => {
//     onSelect(selected ? selected.value : "");
//   };

//   // Custom filter function for searching both label and subLabel
//   const customFilter = (option, searchText) => {
//     if (!searchText) return true;
//     return (
//       option.data.label?.toLowerCase().includes(searchText.toLowerCase()) ||
//       option.data.subLabel?.toLowerCase().includes(searchText.toLowerCase())
//     );
//   };

//   // Custom Option component for displaying label and subLabel
//   const CustomOption = ({ innerProps, data }) => (
//     <div
//       {...innerProps}
//       className={`px-4 py-3 text-sm cursor-pointer hover:bg-teal-50 transition-colors ${
//         selectedValue === data.value ? "bg-teal-100 text-teal-800" : "text-gray-700"
//       }`}
//     >
//       <div className="font-medium">{data.label}</div>
//       {data.subLabel && <div className="text-xs text-gray-500">{data.subLabel}</div>}
//     </div>
//   );

//   // Custom SingleValue component for displaying selected option
//   const CustomSingleValue = ({ innerProps, data }) => (
//     <div {...innerProps}>
//       <div className="font-medium text-gray-900 text-sm">{data.label}</div>
//       {data.subLabel && <div className="text-xs text-gray-500">{data.subLabel}</div>}
//     </div>
//   );

//   // Automatically select the first option if only one is available
//   useEffect(() => {
//     if (options.length === 1 && !selectedValue) {
//       onSelect(options[0].id);
//     }
//   }, [options, selectedValue, onSelect]);

//   return (
//     <Select
//       options={selectOptions}
//       value={selectedOption}
//       onChange={handleChange}
//       placeholder={placeholder}
//       isDisabled={disabled || loading}
//       isLoading={loading}
//       filterOption={customFilter}
//       components={{ Option: CustomOption, SingleValue: CustomSingleValue }}
//       isClearable
//       className="text-sm"
//       classNamePrefix="select"
//       styles={{
//         control: (provided, state) => ({
//           ...provided,
//           minHeight: "38px",
//           borderColor: state.isFocused ? "#14b8a6" : "#d1d5db",
//           boxShadow: state.isFocused ? "0 0 0 2px rgba(20, 184, 166, 0.2)" : "none",
//           backgroundColor: "white",
//         }),
//         singleValue: (provided) => ({
//           ...provided,
//           margin: 0,
//           padding: 0,
//         }),
//         menu: (provided) => ({
//           ...provided,
//           zIndex: 10,
//         }),
//       }}
//     />
//   );
// };




// const MaterialDispatch = () => {
//   const [allProjects, setAllProjects] = useState([]);
//   const [projects, setProjects] = useState([]);
//   const [companies, setCompanies] = useState([]);
//   const [sites, setSites] = useState([]);
//   const [workDescriptions, setWorkDescriptions] = useState([]);
//   const [selectedCompany, setSelectedCompany] = useState("");
//   const [selectedProject, setSelectedProject] = useState("");
//   const [selectedSite, setSelectedSite] = useState("");
//   const [selectedWorkDesc, setSelectedWorkDesc] = useState("");
//   const [nextDcNo, setNextDcNo] = useState("");
//   const [masterDcNo, setMasterDcNo] = useState("");
//   const [isMasterDcNoEditable, setIsMasterDcNoEditable] = useState(true);
//   const [assignedMaterials, setAssignedMaterials] = useState([]);
//   const [loading, setLoading] = useState({
//     companies: false,
//     projects: false,
//     sites: false,
//     dcNo: false,
//     masterDcNo: false,
//     materials: false,
//     workDescriptions: false,
//     transportTypes: false,
//     providers: false,
//     vehicles: false,
//     drivers: false,
//     submitting: false,
//   });
//   const [error, setError] = useState(null);
//   const [dispatchData, setDispatchData] = useState({
//     dc_no: "",
//     dispatch_date: "",
//     order_no: "",
//     vendor_code: "",
//   });
//   const [transportData, setTransportData] = useState({
//     transport_type_id: "",
//     provider_id: "",
//     vehicle_id: "",
//     driver_id: "",
//     destination: "",
//     booking_expense: "",
//     travel_expense: "",
//   });
//   const [newEntryData, setNewEntryData] = useState({
//     vehicle_model: "",
//     vehicle_number: "",
//     driver_mobile: "",
//     driver_address: "",
//     provider_address: "",
//     provider_mobile: "",
//   });
//   const [transportTypes, setTransportTypes] = useState([]);
//   const [providers, setProviders] = useState([]);
//   const [vehicles, setVehicles] = useState([]);
//   const [drivers, setDrivers] = useState([]);
//   const [dispatchQuantities, setDispatchQuantities] = useState({});
//   const [remarks, setRemarks] = useState({});
//   const [isTransportModalOpen, setIsTransportModalOpen] = useState(false);

//   // Fetch companies
//   const fetchCompanies = async () => {
//     try {
//       setLoading((prev) => ({ ...prev, companies: true }));
//       const response = await axios.get("http://103.118.158.127/api/project/companies");
//       setCompanies(Array.isArray(response.data) ? response.data : []);
//     } catch (error) {
//       console.error("Error fetching companies:", error);
//       setError("Failed to load companies. Please try again.");
//     } finally {
//       setLoading((prev) => ({ ...prev, companies: false }));
//     }
//   };

//   // Fetch master_dc_no for selected company
//   const fetchMasterDcNo = async () => {
//     if (!selectedCompany) {
//       setMasterDcNo("");
//       setIsMasterDcNoEditable(true);
//       return;
//     }
//     try {
//       setLoading((prev) => ({ ...prev, masterDcNo: true }));
//       const response = await axios.get("http://103.118.158.127/api/material/master-dc-no", {
//         params: { company_id: selectedCompany },
//       });
//       const masterDcNoData = response.data.data?.dc_no || "";
//       setMasterDcNo(masterDcNoData);
//       setIsMasterDcNoEditable(!masterDcNoData);
//     } catch (error) {
//       console.error("Error fetching master DC No:", error);
//       setError("Failed to load Master DC No. Please try again.");
//       setMasterDcNo("");
//       setIsMasterDcNoEditable(true);
//     } finally {
//       setLoading((prev) => ({ ...prev, masterDcNo: false }));
//     }
//   };

//   // Save master_dc_no
//   const saveMasterDcNo = async () => {
//     if (!selectedCompany || !masterDcNo || !isMasterDcNoEditable) return;
//     try {
//       await axios.post("http://103.118.158.127/api/material/master-dc-no", {
//         company_id: selectedCompany,
//         dc_no: masterDcNo,
//       });
//       setIsMasterDcNoEditable(false);
//       Swal.fire({
//         position: "top-end",
//         icon: "success",
//         title: "Master DC No saved successfully!",
//         showConfirmButton: false,
//         timer: 1500,
//         toast: true,
//         background: "#ecfdf5",
//         iconColor: "#10b981",
//       });
//     } catch (error) {
//       console.error("Error saving master DC No:", error);
//       setError("Failed to save Master DC No. Please try again.");
//     }
//   };

//   // Fetch projects with sites
//   const fetchProjects = async () => {
//     try {
//       setLoading((prev) => ({ ...prev, projects: true }));
//       const response = await axios.get("http://103.118.158.127/api/project/projects-with-sites");
//       const projectsData = Array.isArray(response.data) ? response.data : [];
//       setAllProjects(projectsData);
//       if (projectsData.length > 0 && selectedCompany) {
//         const filteredProjects = projectsData.filter((project) => project.company_id === selectedCompany);
//         setProjects(filteredProjects);
//         if (filteredProjects.length > 0 && !selectedProject) {
//           setSelectedProject(filteredProjects[0].project_id);
//         }
//       }
//     } catch (error) {
//       console.error("Error fetching projects:", error);
//       setError("Failed to load projects. Please try again.");
//     } finally {
//       setLoading((prev) => ({ ...prev, projects: false }));
//     }
//   };

//   // Fetch next DC No based on site_id
//   const fetchNextDcNo = async () => {
//     if (!selectedSite) return;
//     try {
//       setLoading((prev) => ({ ...prev, dcNo: true }));
//       const response = await axios.get("http://103.118.158.127/api/material/next-dc-no", {
//         params: { site_id: selectedSite },
//       });
//       if (response.data.status === "success" && response.data.data) {
//         const nextDcNoValue = response.data.data.next_dc_no != null ? response.data.data.next_dc_no.toString() : "N/A";
//         setNextDcNo(nextDcNoValue);
//         setDispatchData((prev) => ({
//           ...prev,
//           dc_no: nextDcNoValue,
//         }));
//       } else {
//         setNextDcNo("N/A");
//         setDispatchData((prev) => ({ ...prev, dc_no: "N/A" }));
//       }
//     } catch (error) {
//       console.error("Error fetching next DC No:", error);
//       setError(error.response?.data?.message || "Failed to load next DC No. Please try again.");
//       setNextDcNo("N/A");
//       setDispatchData((prev) => ({ ...prev, dc_no: "N/A" }));
//     } finally {
//       setLoading((prev) => ({ ...prev, dcNo: false }));
//     }
//   };

//   // Fetch work descriptions for selected site
//   const fetchWorkDescriptions = async (site_id) => {
//     try {
//       setLoading((prev) => ({ ...prev, workDescriptions: true }));
//       const response = await axios.get(`http://103.118.158.127/api/material/work-descriptions?site_id=${site_id}`);
//       const descriptions = Array.isArray(response.data?.data) ? response.data.data : [];
//       const uniqueDescs = Array.from(new Map(descriptions.map((desc) => [desc.desc_id, desc])).values());
//       setWorkDescriptions(uniqueDescs);
//       setSelectedWorkDesc("");
//     } catch (error) {
//       console.error("Error fetching work descriptions:", error);
//       setError("Failed to load work descriptions. Please try again.");
//       setWorkDescriptions([]);
//       setSelectedWorkDesc("");
//     } finally {
//       setLoading((prev) => ({ ...prev, workDescriptions: false }));
//     }
//   };

//   // Fetch assigned materials with dispatch details
//   const fetchAssignedMaterials = async () => {
//     if (!selectedProject || !selectedSite) return;
//     try {
//       setLoading((prev) => ({ ...prev, materials: true }));
//       setError(null);
//       const response = await axios.get("http://103.118.158.127/api/material/assignments-with-dispatch", {
//         params: { pd_id: selectedProject, site_id: selectedSite },
//       });
//       const materials = response.data.data || [];
//       setAssignedMaterials(materials);

//       // Initialize dispatch quantities and remarks
//       const newDispatchQuantities = {};
//       const newRemarks = {};
//       materials.forEach((assignment) => {
//         newDispatchQuantities[assignment.id] = {
//           dispatch_qty: 0,
//         };
//         newRemarks[assignment.id] = {
//           comp_a_remarks: "",
//           comp_b_remarks: "",
//           comp_c_remarks: "",
//         };
//       });
//       setDispatchQuantities(newDispatchQuantities);
//       setRemarks(newRemarks);
//     } catch (error) {
//       console.error("Error fetching material assignments:", error);
//       setError(
//         error.response?.data?.message ||
//         error.response?.data?.sqlMessage ||
//         "Failed to load material assignments. Please try again."
//       );
//     } finally {
//       setLoading((prev) => ({ ...prev, materials: false }));
//     }
//   };

//   // Fetch transport types
//   const fetchTransportTypes = async () => {
//     try {
//       setLoading((prev) => ({ ...prev, transportTypes: true }));
//       const response = await axios.get("http://103.118.158.127/api/material/transport-types");
//       setTransportTypes(response.data.data || []);
//     } catch (error) {
//       console.error("Error fetching transport types:", error);
//       setError("Failed to load transport types. Please try again.");
//     } finally {
//       setLoading((prev) => ({ ...prev, transportTypes: false }));
//     }
//   };

//   // Fetch providers
//   const fetchProviders = async (transport_type_id) => {
//     try {
//       setLoading((prev) => ({ ...prev, providers: true }));
//       const response = await axios.get("http://103.118.158.127/api/material/providers", {
//         params: { transport_type_id: Number.isInteger(parseInt(transport_type_id)) ? transport_type_id : undefined },
//       });
//       setProviders(response.data.data || []);
//     } catch (error) {
//       console.error("Error fetching providers:", error);
//       setError("Failed to load providers. Please try again.");
//     } finally {
//       setLoading((prev) => ({ ...prev, providers: false }));
//     }
//   };

//   // Fetch vehicles
//   const fetchVehicles = async () => {
//     try {
//       setLoading((prev) => ({ ...prev, vehicles: true }));
//       const response = await axios.get("http://103.118.158.127/api/material/vehicles");
//       setVehicles(response.data.data || []);
//     } catch (error) {
//       console.error("Error fetching vehicles:", error);
//       setError("Failed to load vehicles. Please try again.");
//     } finally {
//       setLoading((prev) => ({ ...prev, vehicles: false }));
//     }
//   };

//   // Fetch drivers
//   const fetchDrivers = async () => {
//     try {
//       setLoading((prev) => ({ ...prev, drivers: true }));
//       const response = await axios.get("http://103.118.158.127/api/material/drivers");
//       setDrivers(response.data.data || []);
//     } catch (error) {
//       console.error("Error fetching drivers:", error);
//       setError("Failed to load drivers. Please try again.");
//     } finally {
//       setLoading((prev) => ({ ...prev, drivers: false }));
//     }
//   };

//   // Handle company selection
//   const handleCompanyChange = (e) => {
//     const company_id = e.target.value;
//     setSelectedCompany(company_id);
//     setSelectedProject("");
//     setSelectedSite("");
//     setSelectedWorkDesc("");
//     setSites([]);
//     setWorkDescriptions([]);
//     setAssignedMaterials([]);
//     setDispatchQuantities({});
//     setRemarks({});
//     setNextDcNo("");
//     setMasterDcNo("");
//     setIsMasterDcNoEditable(true);
//     const selectedCompanyData = companies.find((company) => company.company_id === company_id);
//     setDispatchData({
//       dc_no: "",
//       dispatch_date: "",
//       order_no: "",
//       vendor_code: selectedCompanyData ? selectedCompanyData.vendor_code || "" : "",
//     });
//     setTransportData({
//       transport_type_id: "",
//       provider_id: "",
//       vehicle_id: "",
//       driver_id: "",
//       destination: "",
//       booking_expense: "",
//       travel_expense: "",
//     });
//     setNewEntryData({
//       vehicle_model: "",
//       vehicle_number: "",
//       driver_mobile: "",
//       driver_address: "",
//       provider_address: "",
//       provider_mobile: "",
//     });
//     setError(null);
//     setIsTransportModalOpen(false);
//   };

//   // Handle project selection
//   const handleProjectChange = (e) => {
//     const project_id = e.target.value;
//     setSelectedProject(project_id);
//     setSelectedSite("");
//     setSelectedWorkDesc("");
//     setSites([]);
//     setWorkDescriptions([]);
//     setAssignedMaterials([]);
//     setDispatchQuantities({});
//     setRemarks({});
//     setNextDcNo("");
//     setTransportData({
//       transport_type_id: "",
//       provider_id: "",
//       vehicle_id: "",
//       driver_id: "",
//       destination: "",
//       booking_expense: "",
//       travel_expense: "",
//     });
//     setNewEntryData({
//       vehicle_model: "",
//       vehicle_number: "",
//       driver_mobile: "",
//       driver_address: "",
//       provider_address: "",
//       provider_mobile: "",
//     });
//     setError(null);
//     setIsTransportModalOpen(false);
//     if (project_id) {
//       const selectedProj = allProjects.find((project) => project.project_id === project_id);
//       const company_id = selectedProj?.company_id;
//       const selectedCompanyData = companies.find((company) => company.company_id === company_id);
//       const projectSites = selectedProj && Array.isArray(selectedProj.sites) ? selectedProj.sites : [];
//       setSites(projectSites);
//       if (projectSites.length > 0) {
//         setSelectedSite(projectSites[0].site_id);
//         setDispatchData({
//           dc_no: "",
//           dispatch_date: "",
//           order_no: projectSites[0].po_number || "",
//           vendor_code: selectedCompanyData ? selectedCompanyData.vendor_code || "" : "",
//         });
//       } else {
//         setDispatchData({
//           dc_no: "",
//           dispatch_date: "",
//           order_no: "",
//           vendor_code: selectedCompanyData ? selectedCompanyData.vendor_code || "" : "",
//         });
//       }
//     } else {
//       setDispatchData({
//         dc_no: "",
//         dispatch_date: "",
//         order_no: "",
//         vendor_code: selectedCompany ? companies.find((company) => company.company_id === selectedCompany)?.vendor_code || "" : "",
//       });
//     }
//   };

//   // Handle site selection
//   const handleSiteChange = (e) => {
//     const site_id = e.target.value;
//     setSelectedSite(site_id);
//     setSelectedWorkDesc("");
//     setWorkDescriptions([]);
//     setAssignedMaterials([]);
//     setDispatchQuantities({});
//     setRemarks({});
//     setNextDcNo("");
//     const selectedSiteData = sites.find((site) => site.site_id === site_id);
//     setDispatchData((prev) => ({
//       ...prev,
//       order_no: selectedSiteData ? selectedSiteData.po_number || "" : "",
//       dc_no: "",
//     }));
//     setTransportData({
//       transport_type_id: "",
//       provider_id: "",
//       vehicle_id: "",
//       driver_id: "",
//       destination: "",
//       booking_expense: "",
//       travel_expense: "",
//     });
//     setNewEntryData({
//       vehicle_model: "",
//       vehicle_number: "",
//       driver_mobile: "",
//       driver_address: "",
//       provider_address: "",
//       provider_mobile: "",
//     });
//     setError(null);
//     setIsTransportModalOpen(false);
//     if (site_id) {
//       fetchWorkDescriptions(site_id);
//       fetchAssignedMaterials();
//       fetchNextDcNo();
//     }
//   };

//   // Handle work description selection
//   const handleWorkDescChange = (selectedOption) => {
//     const desc_id = selectedOption ? selectedOption.value : "";
//     setSelectedWorkDesc(desc_id);
//     setError(null);
//   };

//   // Handle dispatch form input changes
//   const handleDispatchChange = (field, value) => {
//     setDispatchData((prev) => ({
//       ...prev,
//       [field]: value,
//     }));
//   };

//   // Handle master_dc_no change
//   const handleMasterDcNoChange = (value) => {
//     setMasterDcNo(value);
//   };

//   // Handle transport form input changes
//   const handleTransportChange = (field, value) => {
//     setTransportData((prev) => ({
//       ...prev,
//       [field]: value,
//     }));
//     if (field === "transport_type_id") {
//       setProviders([]);
//       setTransportData((prev) => ({
//         ...prev,
//         provider_id: "",
//         vehicle_id: "",
//         driver_id: "",
//         destination: "",
//         booking_expense: "",
//         travel_expense: "",
//       }));
//       setNewEntryData({
//         vehicle_model: "",
//         vehicle_number: "",
//         driver_mobile: "",
//         driver_address: "",
//         provider_address: "",
//         provider_mobile: "",
//       });
//       if (value && Number.isInteger(parseInt(value))) {
//         fetchProviders(value);
//       }
//     }
//   };

//   // Handle new entry input changes
//   const handleNewEntryChange = (field, value) => {
//     setNewEntryData((prev) => ({
//       ...prev,
//       [field]: value,
//     }));
//   };

//   // Handle new entry for searchable dropdowns
//   const handleNewEntryDropdown = (field, value) => {
//     if (field === "vehicle_id") {
//       setNewEntryData((prev) => ({
//         ...prev,
//         vehicle_model: value,
//         vehicle_number: "",
//       }));
//     } else if (field === "driver_id") {
//       setNewEntryData((prev) => ({
//         ...prev,
//         driver_mobile: "",
//         driver_address: "",
//       }));
//     } else if (field === "provider_id") {
//       setNewEntryData((prev) => ({
//         ...prev,
//         provider_address: "",
//         provider_mobile: "",
//       }));
//     }
//   };

//   // Handle dispatch quantity change
//   const handleQuantityChange = (assignmentId, value) => {
//     const assignment = assignedMaterials.find((a) => a.id === assignmentId);
//     const maxQty = assignment.remaining_quantity || 0;
//     const dispatchQty = value ? Math.min(parseInt(value), maxQty) : 0;

//     setDispatchQuantities((prev) => ({
//       ...prev,
//       [assignmentId]: {
//         dispatch_qty: dispatchQty,
//       },
//     }));
//   };

//   // Handle remarks input changes
//   const handleRemarksChange = (assignmentId, field, value) => {
//     setRemarks((prev) => ({
//       ...prev,
//       [assignmentId]: {
//         ...prev[assignmentId],
//         [field]: value,
//       },
//     }));
//   };

//   // Calculate component quantities based on ratios
//   const calculateComponentQuantities = (assignment, dispatchQty) => {
//     const totalRatio =
//       (assignment.comp_ratio_a || 0) +
//       (assignment.comp_ratio_b || 0) +
//       (assignment.comp_ratio_c || 0);
//     if (totalRatio === 0 || !dispatchQty) {
//       return { comp_a_qty: null, comp_b_qty: null, comp_c_qty: null };
//     }

//     let comp_a_qty = null,
//       comp_b_qty = null,
//       comp_c_qty = null;
//     let remaining = dispatchQty;

//     if (assignment.comp_ratio_a !== null) {
//       comp_a_qty = Math.floor((assignment.comp_ratio_a / totalRatio) * dispatchQty);
//       remaining -= comp_a_qty;
//     }
//     if (assignment.comp_ratio_b !== null) {
//       comp_b_qty = Math.floor((assignment.comp_ratio_b / totalRatio) * dispatchQty);
//       remaining -= comp_b_qty;
//     }
//     if (assignment.comp_ratio_c !== null) {
//       comp_c_qty = Math.floor((assignment.comp_ratio_c / totalRatio) * dispatchQty);
//       remaining -= comp_c_qty;
//     }

//     if (remaining > 0) {
//       if (assignment.comp_ratio_a !== null && comp_a_qty !== null) {
//         comp_a_qty += remaining;
//       } else if (assignment.comp_ratio_b !== null && comp_b_qty !== null) {
//         comp_b_qty += remaining;
//       } else if (assignment.comp_ratio_c !== null && comp_c_qty !== null) {
//         comp_c_qty += remaining;
//       }
//     }

//     return { comp_a_qty, comp_b_qty, comp_c_qty };
//   };

//   // Validate dispatch and remarks for enabling Dispatch button
//   const isDispatchEnabled = () => {
//     if (!dispatchData.dc_no || !dispatchData.dispatch_date || !dispatchData.order_no || !dispatchData.vendor_code || !selectedWorkDesc) {
//       return false;
//     }
//     const filteredMaterials = assignedMaterials.filter((assignment) => assignment.desc_id === selectedWorkDesc && assignment.dispatch_status === "not-dispatched");
//     for (const assignment of filteredMaterials) {
//       const assignmentId = assignment.id;
//       const dispatchQty = dispatchQuantities[assignmentId]?.dispatch_qty || 0;
//       const assignmentRemarks = remarks[assignmentId];
//       const { comp_a_qty, comp_b_qty, comp_c_qty } = calculateComponentQuantities(assignment, dispatchQty);
//       if (comp_a_qty !== null && !assignmentRemarks?.comp_a_remarks) {
//         return false;
//       }
//       if (comp_b_qty !== null && !assignmentRemarks?.comp_b_remarks) {
//         return false;
//       }
//       if (comp_c_qty !== null && !assignmentRemarks?.comp_c_remarks) {
//         return false;
//       }
//       if (dispatchQty <= 0) {
//         return false;
//       }
//     }
//     return filteredMaterials.length > 0;
//   };

//   // Handle dispatch form submission
//   const handleDispatchSubmit = async () => {
//     try {
//       setLoading((prev) => ({ ...prev, submitting: true }));
//       setError(null);

//       await saveMasterDcNo();

//       const requiredFields = [
//         transportData.transport_type_id,
//         transportData.provider_id,
//         transportData.vehicle_id,
//         transportData.driver_id,
//         transportData.destination,
//         transportData.travel_expense,
//       ];
//       if (transportData.transport_type_id === "2") {
//         requiredFields.push(transportData.booking_expense);
//       }
//       if (requiredFields.some((field) => !field)) {
//         setError("Please fill all required transport fields.");
//         Swal.fire({
//           position: "top-end",
//           icon: "error",
//           title: "Please fill all required transport fields",
//           showConfirmButton: false,
//           timer: 1500,
//           toast: true,
//         });
//         return;
//       }

//       const dispatchPayload = assignedMaterials
//         .filter((assignment) => assignment.desc_id === selectedWorkDesc && assignment.dispatch_status === "not-dispatched")
//         .map((assignment) => {
//           const dispatchQty = dispatchQuantities[assignment.id]?.dispatch_qty || 0;
//           const { comp_a_qty, comp_b_qty, comp_c_qty } = calculateComponentQuantities(assignment, dispatchQty);
//           return {
//             material_assign_id: assignment.id,
//             desc_id: assignment.desc_id,
//             dc_no: parseInt(dispatchData.dc_no),
//             dispatch_date: dispatchData.dispatch_date,
//             order_no: dispatchData.order_no,
//             vendor_code: dispatchData.vendor_code,
//             dispatch_qty: dispatchQty,
//             comp_a_qty,
//             comp_b_qty,
//             comp_c_qty,
//             comp_a_remarks: comp_a_qty !== null ? remarks[assignment.id]?.comp_a_remarks || null : null,
//             comp_b_remarks: comp_b_qty !== null ? remarks[assignment.id]?.comp_b_remarks || null : null,
//             comp_c_remarks: comp_c_qty !== null ? remarks[assignment.id]?.comp_c_remarks || null : null,
//             master_dc_no: masterDcNo || null,
//           };
//         })
//         .filter((payload) => payload.dispatch_qty > 0);

//       const transportPayload = {
//         transport_type_id: parseInt(transportData.transport_type_id),
//         provider_id: transportData.provider_id,
//         vehicle_id: transportData.vehicle_id,
//         driver_id: transportData.driver_id,
//         destination: transportData.destination,
//         booking_expense: transportData.booking_expense ? parseFloat(transportData.booking_expense) : null,
//         travel_expense: parseFloat(transportData.travel_expense),
//         provider_address: newEntryData.provider_address || null,
//         provider_mobile: newEntryData.provider_mobile || null,
//         vehicle_model: newEntryData.vehicle_model || null,
//         vehicle_number: newEntryData.vehicle_number || null,
//         driver_mobile: newEntryData.driver_mobile || null,
//         driver_address: newEntryData.driver_address || null,
//       };

//       const payload = {
//         assignments: dispatchPayload,
//         transport: transportPayload,
//       };

//       const response = await axios.post("http://103.118.158.127/api/material/add-dispatch", payload);

//       if (response.data.status === "already_dispatched") {
//         const conflicts = response.data.conflicts
//           .map((conflict) => `Material: ${conflict.item_name} (ID: ${conflict.material_assign_id})`)
//           .join(", ");
//         setError(`Cannot dispatch the following materials as they would exceed assigned quantity: ${conflicts}`);
//         Swal.fire({
//           position: "top-end",
//           icon: "error",
//           title: "Some materials would exceed assigned quantity",
//           text: conflicts,
//           showConfirmButton: false,
//           timer: 2000,
//           toast: true,
//         });
//         return;
//       }

//       Swal.fire({
//         position: "top-end",
//         icon: "success",
//         title: "Materials dispatched and transport details saved successfully!",
//         showConfirmButton: false,
//         timer: 2000,
//         toast: true,
//         background: "#ecfdf5",
//         iconColor: "#10b981",
//       });

//       setDispatchData({ dc_no: "", dispatch_date: "", order_no: "", vendor_code: "" });
//       setTransportData({
//         transport_type_id: "",
//         provider_id: "",
//         vehicle_id: "",
//         driver_id: "",
//         destination: "",
//         booking_expense: "",
//         travel_expense: "",
//       });
//       setNewEntryData({
//         vehicle_model: "",
//         vehicle_number: "",
//         driver_mobile: "",
//         driver_address: "",
//         provider_address: "",
//         provider_mobile: "",
//       });
//       setDispatchQuantities({});
//       setRemarks({});
//       setSelectedWorkDesc("");
//       setIsTransportModalOpen(false);
//       await fetchAssignedMaterials();
//       await fetchWorkDescriptions(selectedSite);
//       await fetchTransportTypes();
//       await fetchVehicles();
//       await fetchDrivers();
//       if (Number.isInteger(parseInt(transportData.transport_type_id))) {
//         await fetchProviders(transportData.transport_type_id);
//       }
//       await fetchNextDcNo();
//     } catch (error) {
//       console.error("Error dispatching materials or saving transport:", error);
//       const errorMessage =
//         error.response?.data?.message ||
//         error.response?.data?.sqlMessage ||
//         "Failed to dispatch materials or save transport details. Please try again.";
//       setError(errorMessage);
//       Swal.fire({
//         position: "top-end",
//         icon: "error",
//         title: errorMessage,
//         showConfirmButton: false,
//         timer: 2000,
//         toast: true,
//       });
//     } finally {
//       setLoading((prev) => ({ ...prev, submitting: false }));
//     }
//   };

//   // Helper function to format ratio string
//   const getRatioString = (assignment) => {
//     const ratios = [];
//     if (assignment.comp_ratio_a !== null) ratios.push(assignment.comp_ratio_a);
//     if (assignment.comp_ratio_b !== null) ratios.push(assignment.comp_ratio_b);
//     if (assignment.comp_ratio_c !== null) ratios.push(assignment.comp_ratio_c);
//     return ratios.length > 0 ? `(${ratios.join(":")})` : "";
//   };

//   // Effect hooks
//   useEffect(() => {
//     fetchCompanies();
//     fetchProjects();
//     fetchTransportTypes();
//     fetchVehicles();
//     fetchDrivers();
//   }, []);

//   useEffect(() => {
//     if (selectedCompany) {
//       fetchMasterDcNo();
//       const filteredProjects = allProjects.filter((project) => project.company_id === selectedCompany);
//       setProjects(filteredProjects);
//       if (filteredProjects.length > 0 && !selectedProject) {
//         setSelectedProject(filteredProjects[0].project_id);
//       } else if (!filteredProjects.some((project) => project.project_id === selectedProject)) {
//         setSelectedProject("");
//         setSites([]);
//         setSelectedSite("");
//         setSelectedWorkDesc("");
//         setWorkDescriptions([]);
//       }
//     } else {
//       setProjects([]);
//       setSelectedProject("");
//       setSites([]);
//       setSelectedSite("");
//       setSelectedWorkDesc("");
//       setWorkDescriptions([]);
//       setMasterDcNo("");
//       setIsMasterDcNoEditable(true);
//     }
//   }, [selectedCompany, allProjects]);

//   useEffect(() => {
//     if (selectedProject) {
//       const selectedProj = allProjects.find((project) => project.project_id === selectedProject);
//       const projectSites = selectedProj && Array.isArray(selectedProj.sites) ? selectedProj.sites : [];
//       setSites(projectSites);
//       if (projectSites.length > 0 && !selectedSite) {
//         setSelectedSite(projectSites[0].site_id);
//         setDispatchData((prev) => ({
//           ...prev,
//           order_no: projectSites[0].po_number || "",
//         }));
//       } else if (!projectSites.some((site) => site.site_id === selectedSite)) {
//         setSelectedSite("");
//         setSelectedWorkDesc("");
//         setWorkDescriptions([]);
//         setDispatchData((prev) => ({
//           ...prev,
//           order_no: "",
//         }));
//       }
//     } else {
//       setSites([]);
//       setSelectedSite("");
//       setSelectedWorkDesc("");
//       setWorkDescriptions([]);
//       setDispatchData((prev) => ({
//         ...prev,
//         order_no: "",
//       }));
//     }
//   }, [selectedProject, allProjects]);

//   useEffect(() => {
//     if (selectedSite) {
//       fetchWorkDescriptions(selectedSite);
//     }
//     if (selectedProject && selectedSite) {
//       fetchAssignedMaterials();
//       fetchNextDcNo();
//     }
//   }, [selectedProject, selectedSite]);

//   useEffect(() => {
//     if (transportData.transport_type_id && Number.isInteger(parseInt(transportData.transport_type_id))) {
//       fetchProviders(transportData.transport_type_id);
//     } else {
//       setProviders([]);
//       setTransportData((prev) => ({
//         ...prev,
//         provider_id: "",
//         vehicle_id: "",
//         driver_id: "",
//         destination: "",
//         booking_expense: "",
//         travel_expense: "",
//       }));
//     }
//   }, [transportData.transport_type_id]);

//   useEffect(() => {
//     if (providers.length === 1 && !transportData.provider_id) {
//       setTransportData(prev => ({ ...prev, provider_id: providers[0].id }));
//     }
//   }, [providers, transportData.provider_id]);

//   useEffect(() => {
//     if (vehicles.length === 1 && !transportData.vehicle_id) {
//       setTransportData(prev => ({ ...prev, vehicle_id: vehicles[0].id }));
//     }
//   }, [vehicles, transportData.vehicle_id]);

//   useEffect(() => {
//     if (drivers.length === 1 && !transportData.driver_id) {
//       setTransportData(prev => ({ ...prev, driver_id: drivers[0].id }));
//     }
//   }, [drivers, transportData.driver_id]);

//   useEffect(() => {
//     if (workDescriptions.length === 1 && !selectedWorkDesc) {
//       setSelectedWorkDesc(workDescriptions[0].desc_id);
//     }
//   }, [workDescriptions, selectedWorkDesc]);

//   const isOwnVehicle = transportData.transport_type_id === "1";

//   const workOptions = workDescriptions.map((desc) => ({
//     value: desc.desc_id,
//     label: desc.desc_name || "Unknown Work Description",
//   }));

//   const selectedWorkOption = workOptions.find((opt) => opt.value === selectedWorkDesc);

//   const filteredMaterials = assignedMaterials.filter(
//     (assignment) => assignment.desc_id === selectedWorkDesc && assignment.dispatch_status === "not-dispatched"
//   );

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-100 p-4 sm:p-6 lg:p-8">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="mb-8 text-center">
//           <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 flex items-center justify-center gap-2">
//             <Package className="h-8 w-8 text-teal-600" aria-hidden="true" />
//             Material Dispatch
//           </h2>
//           <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
//             Dispatch non-dispatched materials to your project sites
//           </p>
//         </div>

//         {/* Company, Project, and Site Selection */}
//         <div className="mb-6 sm:mb-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="company">
//               Select Company
//             </label>
//             <select
//               id="company"
//               value={selectedCompany}
//               onChange={handleCompanyChange}
//               className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm bg-white shadow-sm transition-all duration-200"
//               disabled={loading.companies}
//             >
//               <option value="">Select Company</option>
//               {companies.map((company) => (
//                 <option key={company.company_id} value={company.company_id}>
//                   {company.company_name || "Unknown Company"}
//                 </option>
//               ))}
//             </select>
//             {loading.companies && <Loader2 className="h-5 w-5 text-teal-500 animate-spin mt-2" />}
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="project">
//               Select Cost Center
//             </label>
//             <select
//               id="project"
//               value={selectedProject}
//               onChange={handleProjectChange}
//               className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm bg-white shadow-sm transition-all duration-200"
//               disabled={loading.projects || !selectedCompany}
//             >
//               <option value="">Select Cost Center</option>
//               {projects.map((project) => (
//                 <option key={project.project_id} value={project.project_id}>
//                   {project.project_name || "Unknown Project"}
//                 </option>
//               ))}
//             </select>
//             {loading.projects && <Loader2 className="h-5 w-5 text-teal-500 animate-spin mt-2" />}
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="site">
//               Select Site
//             </label>
//             <select
//               id="site"
//               value={selectedSite}
//               onChange={handleSiteChange}
//               className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm bg-white shadow-sm transition-all duration-200"
//               disabled={loading.sites || !selectedProject}
//             >
//               <option value="">Select Site</option>
//               {sites.map((site) => (
//                 <option key={site.site_id} value={site.site_id}>
//                   {site.site_name} (PO: {site.po_number || "N/A"})
//                 </option>
//               ))}
//             </select>
//             {loading.sites && selectedProject && <Loader2 className="h-5 w-5 text-teal-500 animate-spin mt-2" />}
//           </div>
//         </div>

//         {/* Work Description Selection */}
//         {selectedCompany && selectedProject && selectedSite && (
//           <div className="mb-6">
//             <label className="block text-sm font-medium text-gray-700 mb-2">Select Work Description</label>
//             <Select
//               options={workOptions}
//               value={selectedWorkOption}
//               onChange={handleWorkDescChange}
//               placeholder="Select Work Description"
//               isSearchable
//               isClearable
//               isDisabled={loading.workDescriptions}
//               className="text-sm"
//               classNamePrefix="select"
//               styles={{
//                 control: (provided, state) => ({
//                   ...provided,
//                   minHeight: '38px',
//                   borderColor: state.isFocused ? '#3b82f6' : '#d1d5db',
//                   boxShadow: state.isFocused ? '0 0 0 2px rgba(59, 130, 246, 0.2)' : 'none',
//                 }),
//                 menu: (provided) => ({
//                   ...provided,
//                   zIndex: 10,
//                 }),
//               }}
//             />
//             {loading.workDescriptions && <Loader2 className="h-5 w-5 text-teal-500 animate-spin mt-2" />}
//           </div>
//         )}

//         {/* Dispatch Details */}
//         {selectedCompany && selectedProject && selectedSite && selectedWorkDesc && (
//           <div className="mb-6 bg-white p-6 rounded-xl shadow-lg">
//             <h3 className="text-lg font-semibold text-gray-900 mb-4">Dispatch Details</h3>
//             <div className="flex flex-col sm:flex-row justify-center gap-4">
//               <div className="w-full sm:w-1/5">
//                 <label className="block text-xs font-medium text-gray-600" htmlFor="master_dc_no">
//                   Master DC No <span className="text-red-500">*</span>
//                 </label>
//                 {loading.masterDcNo ? (
//                   <Loader2 className="h-5 w-5 text-teal-500 animate-spin mt-2" />
//                 ) : isMasterDcNoEditable ? (
//                   <input
//                     type="text"
//                     id="master_dc_no"
//                     value={masterDcNo}
//                     onChange={(e) => handleMasterDcNoChange(e.target.value)}
//                     className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm transition-all duration-200"
//                     placeholder="Enter Master DC No"
//                     aria-required="true"
//                   />
//                 ) : (
//                   <div className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-100 text-gray-700">
//                     {masterDcNo || "N/A"}
//                   </div>
//                 )}
//               </div>
//               <div className="w-full sm:w-1/5">
//                 <label className="block text-xs font-medium text-gray-600" htmlFor="dc_no">
//                   PO DC No <span className="text-red-500">*</span>
//                 </label>
//                 <div className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-100 text-gray-700">
//                   {loading.dcNo ? (
//                     <Loader2 className="h-5 w-5 text-teal-500 animate-spin inline-block" />
//                   ) : (
//                     nextDcNo || "N/A"
//                   )}
//                 </div>
//               </div>
//               <div className="w-full sm:w-1/5">
//                 <label className="block text-xs font-medium text-gray-600" htmlFor="dispatch_date">
//                   Dispatch Date <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="date"
//                   id="dispatch_date"
//                   value={dispatchData.dispatch_date}
//                   onChange={(e) => handleDispatchChange("dispatch_date", e.target.value)}
//                   className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm transition-all duration-200"
//                   aria-required="true"
//                 />
//               </div>
//               <div className="w-full sm:w-1/5">
//                 <label className="block text-xs font-medium text-gray-600" htmlFor="order_no">
//                   Order No <span className="text-red-500">*</span>
//                 </label>
//                 <div className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-100 text-gray-700">
//                   {dispatchData.order_no || "N/A"}
//                 </div>
//               </div>
//               <div className="w-full sm:w-1/5">
//                 <label className="block text-xs font-medium text-gray-600" htmlFor="vendor_code">
//                   Vendor Code <span className="text-red-500">*</span>
//                 </label>
//                 <div className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-100 text-gray-700">
//                   {dispatchData.vendor_code || "N/A"}
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Error Alert */}
//         {error && (
//           <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg shadow-md flex items-center justify-between transition-all duration-300">
//             <div className="flex items-center gap-2">
//               <FileText className="h-5 w-5 text-red-500" aria-hidden="true" />
//               <span>{error}</span>
//             </div>
//             <button
//               onClick={() => setError(null)}
//               className="text-red-500 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 rounded-full"
//               aria-label="Close error message"
//             >
//               <X className="h-5 w-5" />
//             </button>
//           </div>
//         )}

//         {/* Loading State */}
//         {loading.materials || loading.workDescriptions ? (
//           <div className="flex justify-center items-center py-16">
//             <div className="flex flex-col items-center space-y-4">
//               <Loader2 className="h-12 w-12 text-teal-600 animate-spin" aria-hidden="true" />
//               <p className="text-gray-600 text-lg font-medium">Loading material assignments...</p>
//             </div>
//           </div>
//         ) : !selectedCompany || !selectedProject || !selectedSite ? (
//           <div className="text-center py-16 bg-white rounded-xl shadow-lg border border-gray-200">
//             <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" aria-hidden="true" />
//             <p className="text-gray-600 text-lg font-medium">Please select a company, project, and site.</p>
//           </div>
//         ) : !selectedWorkDesc ? (
//           <div className="text-center py-16 bg-white rounded-xl shadow-lg border border-gray-200">
//             <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" aria-hidden="true" />
//             <p className="text-gray-600 text-lg font-medium">Please select a work description.</p>
//           </div>
//         ) : filteredMaterials.length === 0 ? (
//           <div className="text-center py-16 bg-white rounded-xl shadow-lg border border-gray-200">
//             <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" aria-hidden="true" />
//             <p className="text-gray-600 text-lg font-medium">No non-dispatched material assignments found for this work description.</p>
//             <p className="text-gray-500 mt-2">Assign materials to this work description to dispatch them.</p>
//           </div>
//         ) : (
//           <>
//             {/* Desktop View with Table */}
//             <div className="hidden md:block bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden mb-6">
//               <div className="p-4 overflow-x-auto">
//                 <table className="min-w-full divide-y divide-gray-200">
//                   <thead className="bg-gradient-to-r from-teal-600 to-teal-700 text-white">
//                     <tr>
//                       <th className="px-6 py-4 text-left text-sm font-semibold tracking-wider">#</th>
//                       <th className="px-6 py-4 text-left text-sm font-semibold tracking-wider">Material Details</th>
//                       <th className="px-6 py-4 text-left text-sm font-semibold tracking-wider">Assigned Quantity</th>
//                       <th className="px-6 py-4 text-left text-sm font-semibold tracking-wider">Remaining Quantity & UOM</th>
//                       <th className="px-6 py-4 text-left text-sm font-semibold tracking-wider">Dispatch Quantity</th>
//                       <th className="px-6 py-4 text-left text-sm font-semibold tracking-wider">Component Quantities</th>
//                       <th className="px-6 py-4 text-left text-sm font-semibold tracking-wider">Remarks</th>
//                     </tr>
//                   </thead>
//                   <tbody className="bg-white divide-y divide-gray-200">
//                     {filteredMaterials.map((assignment, index) => {
//                       const dispatchQty = dispatchQuantities[assignment.id]?.dispatch_qty || 0;
//                       const { comp_a_qty, comp_b_qty, comp_c_qty } = calculateComponentQuantities(assignment, dispatchQty);
//                       return (
//                         <tr key={assignment.id} className="hover:bg-teal-50 transition-colors duration-200">
//                           <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{index + 1}</td>
//                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
//                             <div className="space-y-1">
//                               <p className="font-medium">{assignment.item_name || "N/A"} {getRatioString(assignment)}</p>
//                             </div>
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
//                             <span className="inline-flex items-center px-2.5 py-0.5 text-md font-bold">
//                               {assignment.quantity || "N/A"} | {assignment.uom_name || "N/A"}
//                             </span>
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
//                             <span className="inline-flex items-center px-2.5 py-0.5 text-md font-bold">
//                               {assignment.remaining_quantity || "N/A"} | {assignment.uom_name || "N/A"}
//                             </span>
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
//                             <div className="space-y-1">
//                               <input
//                                 type="number"
//                                 value={dispatchQty}
//                                 onChange={(e) => handleQuantityChange(assignment.id, e.target.value)}
//                                 className="w-full px-2 py-1 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 shadow-sm"
//                                 placeholder="Dispatch Qty"
//                                 min="0"
//                                 max={assignment.remaining_quantity}
//                               />
//                             </div>
//                           </td>
//                           <td className="px-6 py-4 text-sm text-gray-700">
//                             <div className="space-y-4">
//                               {assignment.comp_ratio_a !== null && (
//                                 <div className="flex items-center gap-4">
//                                   <label className="w-24 text-sm font-medium text-gray-700">Comp A:</label>
//                                   <span className="text-sm bg-teal-50 px-3 py-1 rounded-md">{comp_a_qty ?? "N/A"}</span>
//                                 </div>
//                               )}
//                               {assignment.comp_ratio_b !== null && (
//                                 <div className="flex items-center gap-4">
//                                   <label className="w-24 text-sm font-medium text-gray-700">Comp B:</label>
//                                   <span className="text-sm bg-teal-50 px-3 py-1 rounded-md">{comp_b_qty ?? "N/A"}</span>
//                                 </div>
//                               )}
//                               {assignment.comp_ratio_c !== null && (
//                                 <div className="flex items-center gap-4">
//                                   <label className="w-24 text-sm font-medium text-gray-700">Comp C:</label>
//                                   <span className="text-sm bg-teal-50 px-3 py-1 rounded-md">{comp_c_qty ?? "N/A"}</span>
//                                 </div>
//                               )}
//                             </div>
//                           </td>
//                           <td className="px-6 py-4 text-sm text-gray-700">
//                             <div className="space-y-4">
//                               {assignment.comp_ratio_a !== null && (
//                                 <div className="flex items-center gap-4">
//                                   <input
//                                     type="text"
//                                     value={remarks[assignment.id]?.comp_a_remarks ?? ""}
//                                     onChange={(e) => handleRemarksChange(assignment.id, "comp_a_remarks", e.target.value)}
//                                     className="w-full px-2 py-1 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 shadow-sm"
//                                     placeholder="Remarks for Component A"
//                                     required={comp_a_qty !== null}
//                                   />
//                                 </div>
//                               )}
//                               {assignment.comp_ratio_b !== null && (
//                                 <div className="flex items-center gap-4">
//                                   <input
//                                     type="text"
//                                     value={remarks[assignment.id]?.comp_b_remarks ?? ""}
//                                     onChange={(e) => handleRemarksChange(assignment.id, "comp_b_remarks", e.target.value)}
//                                     className="w-full px-2 py-1 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 shadow-sm"
//                                     placeholder="Remarks for Component B"
//                                     required={comp_b_qty !== null}
//                                   />
//                                 </div>
//                               )}
//                               {assignment.comp_ratio_c !== null && (
//                                 <div className="flex items-center gap-4">
//                                   <input
//                                     type="text"
//                                     value={remarks[assignment.id]?.comp_c_remarks ?? ""}
//                                     onChange={(e) => handleRemarksChange(assignment.id, "comp_c_remarks", e.target.value)}
//                                     className="w-full px-2 py-1 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 shadow-sm"
//                                     placeholder="Remarks for Component C"
//                                     required={comp_c_qty !== null}
//                                   />
//                                 </div>
//                               )}
//                             </div>
//                           </td>
//                         </tr>
//                       );
//                     })}
//                   </tbody>
//                 </table>
//               </div>
//               <div className="p-4 flex justify-end">
//                 <button
//                   onClick={() => setIsTransportModalOpen(true)}
//                   className={`px-4 py-2 text-white rounded-lg text-sm font-medium shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 ${
//                     isDispatchEnabled() ? "bg-teal-600 hover:bg-teal-700" : "bg-gray-400 cursor-not-allowed"
//                   }`}
//                   disabled={!isDispatchEnabled()}
//                 >
//                   <Truck className="h-4 w-4 inline-block mr-2" />
//                   Assign Transport
//                 </button>
//               </div>
//             </div>

//             {/* Mobile Card View */}
//             <div className="md:hidden space-y-6 mb-6">
//               {filteredMaterials.map((assignment, index) => {
//                 const dispatchQty = dispatchQuantities[assignment.id]?.dispatch_qty || 0;
//                 const { comp_a_qty, comp_b_qty, comp_c_qty } = calculateComponentQuantities(assignment, dispatchQty);
//                 return (
//                   <div key={assignment.id} className="bg-white rounded-xl shadow-lg border border-gray-100 p-5 space-y-6">
//                     <div className="flex justify-between items-center">
//                       <span className="text-sm font-medium text-gray-900">#{index + 1}</span>
//                     </div>
//                     <div>
//                       <p className="text-sm font-medium text-gray-700">Material Details</p>
//                       <p className="text-sm text-gray-600">{assignment.item_name || "N/A"} {getRatioString(assignment)}</p>
//                     </div>
//                     <div>
//                       <p className="text-sm font-medium text-gray-700">Assigned Quantity</p>
//                       <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800">
//                         {assignment.quantity || "N/A"} {assignment.uom_name || "N/A"}
//                       </span>
//                     </div>
//                     <div>
//                       <p className="text-sm font-medium text-gray-700">Remaining Quantity & UOM</p>
//                       <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800">
//                         {assignment.remaining_quantity || "N/A"} {assignment.uom_name || "N/A"}
//                       </span>
//                     </div>
//                     <div>
//                       <p className="text-sm font-medium text-gray-700">Dispatch Quantity</p>
//                       <input
//                         type="number"
//                         value={dispatchQty}
//                         onChange={(e) => handleQuantityChange(assignment.id, e.target.value)}
//                         className="w-full px-2 py-1 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 shadow-sm"
//                         placeholder="Dispatch Qty"
//                         min="0"
//                         max={assignment.remaining_quantity}
//                       />
//                     </div>
//                     <div>
//                       <p className="text-sm font-medium text-gray-700">Component Quantities</p>
//                       <div className="space-y-4 mt-2">
//                         {assignment.comp_ratio_a !== null && (
//                           <div className="flex items-center gap-4">
//                             <label className="w-24 text-sm font-medium text-gray-700">Component A:</label>
//                             <span className="text-sm bg-teal-50 px-3 py-1 rounded-md">{comp_a_qty ?? "N/A"}</span>
//                           </div>
//                         )}
//                         {assignment.comp_ratio_b !== null && (
//                           <div className="flex items-center gap-4">
//                             <label className="w-24 text-sm font-medium text-gray-700">Component B:</label>
//                             <span className="text-sm bg-teal-50 px-3 py-1 rounded-md">{comp_b_qty ?? "N/A"}</span>
//                           </div>
//                         )}
//                         {assignment.comp_ratio_c !== null && (
//                           <div className="flex items-center gap-4">
//                             <label className="w-24 text-sm font-medium text-gray-700">Component C:</label>
//                             <span className="text-sm bg-teal-50 px-3 py-1 rounded-md">{comp_c_qty ?? "N/A"}</span>
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                     <div>
//                       <p className="text-sm font-medium text-gray-700">Remarks</p>
//                       <div className="space-y-4 mt-2">
//                         {assignment.comp_ratio_a !== null && (
//                           <div className="space-y-1">
//                             <label className="text-xs font-medium text-gray-700">Component A</label>
//                             <input
//                               type="text"
//                               value={remarks[assignment.id]?.comp_a_remarks ?? ""}
//                               onChange={(e) => handleRemarksChange(assignment.id, "comp_a_remarks", e.target.value)}
//                               className="w-full px-2 py-1 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 shadow-sm"
//                               placeholder="Remarks for Component A"
//                               required={comp_a_qty !== null}
//                             />
//                           </div>
//                         )}
//                         {assignment.comp_ratio_b !== null && (
//                           <div className="space-y-1">
//                             <label className="text-xs font-medium text-gray-700">Component B</label>
//                             <input
//                               type="text"
//                               value={remarks[assignment.id]?.comp_b_remarks ?? ""}
//                               onChange={(e) => handleRemarksChange(assignment.id, "comp_b_remarks", e.target.value)}
//                               className="w-full px-2 py-1 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 shadow-sm"
//                               placeholder="Remarks for Component B"
//                               required={comp_b_qty !== null}
//                             />
//                           </div>
//                         )}
//                         {assignment.comp_ratio_c !== null && (
//                           <div className="space-y-1">
//                             <label className="text-xs font-medium text-gray-700">Component C</label>
//                             <input
//                               type="text"
//                               value={remarks[assignment.id]?.comp_c_remarks ?? ""}
//                               onChange={(e) => handleRemarksChange(assignment.id, "comp_c_remarks", e.target.value)}
//                               className="w-full px-2 py-1 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 shadow-sm"
//                               placeholder="Remarks for Component C"
//                               required={comp_c_qty !== null}
//                             />
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}
//               <div className="p-4 flex justify-end">
//                 <button
//                   onClick={() => setIsTransportModalOpen(true)}
//                   className={`px-4 py-2 text-white rounded-lg text-sm font-medium shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 ${
//                     isDispatchEnabled() ? "bg-teal-600 hover:bg-teal-700" : "bg-gray-400 cursor-not-allowed"
//                   }`}
//                   disabled={!isDispatchEnabled()}
//                 >
//                   <Truck className="h-4 w-4 inline-block mr-2" />
//                   Dispatch Materials
//                 </button>
//               </div>
//             </div>

//             {/* Transport Modal */}
//             {isTransportModalOpen && (
//               <div
//                 className="backdrop-blur-xl fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 p-4"
//                 onClick={() => setIsTransportModalOpen(false)}
//               >
//                 <div
//                   className="bg-white rounded-2xl shadow-2xl w-full max-w-lg sm:max-w-xl lg:max-w-4xl p-6 relative max-h-[90vh] overflow-y-auto"
//                   onClick={(e) => e.stopPropagation()}
//                 >
//                   <button
//                     onClick={() => setIsTransportModalOpen(false)}
//                     className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 rounded-full"
//                     aria-label="Close transport modal"
//                   >
//                     <X className="h-6 w-6" />
//                   </button>
//                   <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">Dispatch Materials</h3>
//                   <div className="space-y-6">
//                     {/* Transport Details */}
//                     <div>
//                       <h4 className="text-lg font-medium text-gray-800 mb-4">Transport Details</h4>
//                       <div className="space-y-4">
//                         <div>
//                           <label className="block text-xs font-medium text-gray-600 mb-2">
//                             Transport Type <span className="text-red-500">*</span>
//                           </label>
//                           <select
//                             value={transportData.transport_type_id}
//                             onChange={(e) => handleTransportChange("transport_type_id", e.target.value)}
//                             className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm bg-white shadow-sm transition-all duration-200"
//                             disabled={loading.transportTypes}
//                             required
//                           >
//                             <option value="">Select Transport Type</option>
//                             {transportTypes.map((type) => (
//                               <option key={type.id} value={type.id}>
//                                 {type.type}
//                               </option>
//                             ))}
//                           </select>
//                           {loading.transportTypes && <Loader2 className="h-5 w-5 text-teal-500 animate-spin mt-2" />}
//                         </div>

//                         {transportData.transport_type_id && (
//                           <>
//                             <div>
//                               <label className="block text-xs font-medium text-gray-600 mb-2">
//                                 {isOwnVehicle ? "Contract Provider" : "Logistics Provider"} <span className="text-red-500">*</span>
//                               </label>
//                               <SearchableDropdown
//                                 options={providers}
//                                 selectedValue={transportData.provider_id}
//                                 onSelect={(value) => handleTransportChange("provider_id", value)}
//                                 placeholder={`Select or enter ${isOwnVehicle ? "Contract" : "Logistics"} Provider`}
//                                 searchKeys={["provider_name"]}
//                                 label="Provider"
//                                 disabled={!transportData.transport_type_id}
//                                 loading={loading.providers}
//                                 allowNew={true}
//                                 onNewEntryChange={(value) => handleNewEntryDropdown("provider_id", value)}
//                               />
//                               {transportData.provider_id && !providers.some((p) => p.id === transportData.provider_id) && (
//                                 <div className="mt-4 space-y-4">
//                                   <div>
//                                     <label className="block text-xs font-medium text-gray-600 mb-2">
//                                       Provider Address
//                                     </label>
//                                     <input
//                                       type="text"
//                                       value={newEntryData.provider_address}
//                                       onChange={(e) => handleNewEntryChange("provider_address", e.target.value)}
//                                       className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm"
//                                       placeholder="Enter Provider Address"
//                                     />
//                                   </div>
//                                   <div>
//                                     <label className="block text-xs font-medium text-gray-600 mb-2">
//                                       Provider Mobile
//                                     </label>
//                                     <input
//                                       type="text"
//                                       value={newEntryData.provider_mobile}
//                                       onChange={(e) => handleNewEntryChange("provider_mobile", e.target.value)}
//                                       className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm"
//                                       placeholder="Enter Provider Mobile"
//                                     />
//                                   </div>
//                                 </div>
//                               )}
//                             </div>

//                             <div>
//                               <label className="block text-xs font-medium text-gray-600 mb-2">
//                                 Vehicle <span className="text-red-500">*</span>
//                               </label>
//                               <SearchableDropdown
//                                 options={vehicles}
//                                 selectedValue={transportData.vehicle_id}
//                                 onSelect={(value) => handleTransportChange("vehicle_id", value)}
//                                 placeholder="Select or enter Vehicle"
//                                 searchKeys={["vehicle_name", "vehicle_number"]}
//                                 label="Vehicle"
//                                 loading={loading.vehicles}
//                                 allowNew={true}
//                                 onNewEntryChange={(value) => handleNewEntryDropdown("vehicle_id", value)}
//                               />
//                               {transportData.vehicle_id && !vehicles.some((v) => v.id === transportData.vehicle_id) && (
//                                 <div className="mt-4 space-y-4">
//                                   <div>
//                                     <label className="block text-xs font-medium text-gray-600 mb-2">
//                                       Vehicle Model
//                                     </label>
//                                     <input
//                                       type="text"
//                                       value={newEntryData.vehicle_model}
//                                       onChange={(e) => handleNewEntryChange("vehicle_model", e.target.value)}
//                                       className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm"
//                                       placeholder="Enter Vehicle Model"
//                                     />
//                                   </div>
//                                   <div>
//                                     <label className="block text-xs font-medium text-gray-600 mb-2">
//                                       Vehicle Number
//                                     </label>
//                                     <input
//                                       type="text"
//                                       value={newEntryData.vehicle_number}
//                                       onChange={(e) => handleNewEntryChange("vehicle_number", e.target.value)}
//                                       className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm"
//                                       placeholder="Enter Vehicle Number"
//                                     />
//                                   </div>
//                                 </div>
//                               )}
//                             </div>

//                             <div>
//                               <label className="block text-xs font-medium text-gray-600 mb-2">
//                                 Driver <span className="text-red-500">*</span>
//                               </label>
//                               <SearchableDropdown
//                                 options={drivers}
//                                 selectedValue={transportData.driver_id}
//                                 onSelect={(value) => handleTransportChange("driver_id", value)}
//                                 placeholder="Select or enter Driver"
//                                 searchKeys={["driver_name", "driver_mobile"]}
//                                 label="Driver"
//                                 loading={loading.drivers}
//                                 allowNew={true}
//                                 onNewEntryChange={(value) => handleNewEntryDropdown("driver_id", value)}
//                               />
//                               {transportData.driver_id && !drivers.some((d) => d.id === transportData.driver_id) && (
//                                 <div className="mt-4 space-y-4">
//                                   <div>
//                                     <label className="block text-xs font-medium text-gray-600 mb-2">
//                                       Driver Mobile
//                                     </label>
//                                     <input
//                                       type="text"
//                                       value={newEntryData.driver_mobile}
//                                       onChange={(e) => handleNewEntryChange("driver_mobile", e.target.value)}
//                                       className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm"
//                                       placeholder="Enter Driver Mobile"
//                                     />
//                                   </div>
//                                   <div>
//                                     <label className="block text-xs font-medium text-gray-600 mb-2">
//                                       Driver Address
//                                     </label>
//                                     <input
//                                       type="text"
//                                       value={newEntryData.driver_address}
//                                       onChange={(e) => handleNewEntryChange("driver_address", e.target.value)}
//                                       className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm"
//                                       placeholder="Enter Driver Address"
//                                     />
//                                   </div>
//                                 </div>
//                               )}
//                             </div>

//                             <div>
//                               <label className="block text-xs font-medium text-gray-600 mb-2">
//                                 Destination <span className="text-red-500">*</span>
//                               </label>
//                               <input
//                                 type="text"
//                                 id="destination"
//                                 placeholder="Enter Destination"
//                                 value={transportData.destination}
//                                 onChange={(e) => handleTransportChange("destination", e.target.value)}
//                                 className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm"
//                                 required
//                               />
//                             </div>

//                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                               {!isOwnVehicle && (
//                                 <div>
//                                   <label className="block text-xs font-medium text-gray-600 mb-2">
//                                     Booking Expense <span className="text-red-500">*</span>
//                                   </label>
//                                   <input
//                                     type="number"
//                                     id="booking_expense"
//                                     placeholder="Enter Booking Expense"
//                                     value={transportData.booking_expense}
//                                     onChange={(e) => handleTransportChange("booking_expense", e.target.value)}
//                                     className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm"
//                                     step="0.01"
//                                     min="0"
//                                     required
//                                   />
//                                 </div>
//                               )}
//                               <div>
//                                 <label className="block text-xs font-medium text-gray-600 mb-2">
//                                   Travel Expense <span className="text-red-500">*</span>
//                                 </label>
//                                 <input
//                                   type="number"
//                                   id="travel_expense"
//                                   placeholder="Enter Travel Expense"
//                                   value={transportData.travel_expense}
//                                   onChange={(e) => handleTransportChange("travel_expense", e.target.value)}
//                                   className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm"
//                                   step="0.01"
//                                   min="0"
//                                   required
//                                 />
//                               </div>
//                             </div>
//                           </>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                   <div className="mt-6 flex justify-center space-x-4">
//                     <button
//                       onClick={() => setIsTransportModalOpen(false)}
//                       className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg text-base font-medium shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
//                     >
//                       Cancel
//                     </button>
//                     <button
//                       onClick={handleDispatchSubmit}
//                       className="px-6 py-3 bg-teal-600 text-white rounded-lg text-base font-medium shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
//                       disabled={loading.submitting}
//                     >
//                       {loading.submitting ? (
//                         <>
//                           <Loader2 className="h-5 w-5 animate-spin inline-block mr-2" />
//                           Dispatching...
//                         </>
//                       ) : (
//                         <>
//                           <Truck className="h-5 w-5 inline-block mr-2" />
//                           Dispatch Material
//                         </>
//                       )}
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </>
//         )}
//       </div>

//       <style>{`
//         .select__control {
//           border-color: #d1d5db;
//           min-height: 38px;
//         }
//         .select__control--is-focused {
//           border-color: #3b82f6;
//           box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
//         }
//         .select__menu {
//           z-index: 10;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default MaterialDispatch;




















import React, { useState, useEffect, useRef, useMemo } from "react";
import axios from "axios";
import Select from "react-select";
import CreatableSelect from 'react-select/creatable';
import { Loader2, Package, FileText, X, Truck, ChevronDown } from "lucide-react";
import Swal from "sweetalert2";

const SearchableDropdown = ({ options, selectedValue, onSelect, placeholder, searchKeys, label, disabled, loading, allowNew = false, onNewEntryChange }) => {
  // Memoize options to prevent unnecessary re-renders
  const selectOptions = useMemo(
    () =>
      options.map((option) => ({
        value: option.id,
        label: option[searchKeys[0]]?.toString() || "",
        subLabel: searchKeys[1] ? option[searchKeys[1]]?.toString() || "" : null,
      })),
    [options, searchKeys]
  );

  // Find the selected option or set to null if not found
  const selectedOption = useMemo(
    () => selectOptions.find((opt) => opt.value === selectedValue) || null,
    [selectOptions, selectedValue]
  );

  // Handle selection change
  const handleChange = (selected, action) => {
    if (action?.action === 'create-option') {
      onNewEntryChange?.(selected.value);
    }
    onSelect(selected ? selected.value : "");
  };

  // Custom filter function for searching both label and subLabel
  const customFilter = (option, searchText) => {
    if (!searchText) return true;
    return (
      option.data.label?.toLowerCase().includes(searchText.toLowerCase()) ||
      option.data.subLabel?.toLowerCase().includes(searchText.toLowerCase())
    );
  };

  // Custom Option component for displaying label and subLabel
  const CustomOption = ({ innerProps, data }) => (
    <div
      {...innerProps}
      className={`px-4 py-3 text-sm cursor-pointer hover:bg-teal-50 transition-colors ${
        selectedValue === data.value ? "bg-teal-100 text-teal-800" : "text-gray-700"
      }`}
    >
      <div className="font-medium">{data.label}</div>
      {data.subLabel && <div className="text-xs text-gray-500">{data.subLabel}</div>}
    </div>
  );

  // Custom SingleValue component for displaying selected option
  const CustomSingleValue = ({ innerProps, data }) => (
    <div {...innerProps}>
      <div className="font-medium text-gray-900 text-sm">{data.label}</div>
      {data.subLabel && <div className="text-xs text-gray-500">{data.subLabel}</div>}
    </div>
  );

  // Automatically select the first option if only one is available
  useEffect(() => {
    if (options.length === 1 && !selectedValue) {
      onSelect(options[0].id);
    }
  }, [options.length, selectedValue, onSelect]); // Changed deps to prevent potential loops

  const SelectComponent = allowNew ? CreatableSelect : Select;

  return (
    <SelectComponent
      options={selectOptions}
      value={selectedOption}
      onChange={handleChange}
      placeholder={placeholder}
      isDisabled={disabled || loading}
      isLoading={loading}
      filterOption={customFilter}
      components={{ Option: CustomOption, SingleValue: CustomSingleValue }}
      isClearable
      formatCreateLabel={(inputValue) => `Create "${inputValue}"`}
      className="text-sm"
      classNamePrefix="select"
      styles={{
        control: (provided, state) => ({
          ...provided,
          minHeight: "38px",
          borderColor: state.isFocused ? "#14b8a6" : "#d1d5db",
          boxShadow: state.isFocused ? "0 0 0 2px rgba(20, 184, 166, 0.2)" : "none",
          backgroundColor: "white",
        }),
        singleValue: (provided) => ({
          ...provided,
          margin: 0,
          padding: 0,
        }),
        menu: (provided) => ({
          ...provided,
          zIndex: 10,
        }),
      }}
    />
  );
};

const MaterialDispatch = () => {
  const [allProjects, setAllProjects] = useState([]);
  const [projects, setProjects] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [sites, setSites] = useState([]);
  const [workDescriptions, setWorkDescriptions] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedSite, setSelectedSite] = useState("");
  const [selectedWorkDesc, setSelectedWorkDesc] = useState("");
  const [nextDcNo, setNextDcNo] = useState("");
  const [masterDcNo, setMasterDcNo] = useState("");
  const [isMasterDcNoEditable, setIsMasterDcNoEditable] = useState(true);
  const [assignedMaterials, setAssignedMaterials] = useState([]);
  const [loading, setLoading] = useState({
    companies: false,
    projects: false,
    sites: false,
    dcNo: false,
    masterDcNo: false,
    materials: false,
    workDescriptions: false,
    transportTypes: false,
    providers: false,
    vehicles: false,
    drivers: false,
    submitting: false,
  });
  const [error, setError] = useState(null);
  const [dispatchData, setDispatchData] = useState({
    dc_no: "",
    dispatch_date: "",
    order_no: "",
    vendor_code: "",
  });
  const [transportData, setTransportData] = useState({
    transport_type_id: "",
    provider_id: "",
    vehicle_id: "",
    driver_id: "",
    destination: "",
    booking_expense: "",
    travel_expense: "",
  });
  const [newEntryData, setNewEntryData] = useState({
    vehicle_model: "",
    vehicle_number: "",
    driver_mobile: "",
    driver_address: "",
    provider_address: "",
    provider_mobile: "",
  });
  const [transportTypes, setTransportTypes] = useState([]);
  const [providers, setProviders] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [dispatchQuantities, setDispatchQuantities] = useState({});
  const [remarks, setRemarks] = useState({});
  const [isTransportModalOpen, setIsTransportModalOpen] = useState(false);
  const [createdBy, setCreatedBy] = useState("");

  // Extract createdBy from URL
  useEffect(() => {
    const pathname = window.location.pathname;
    const segments = pathname.split('/');
    const encoded = segments[segments.length - 1];
    if (encoded && encoded !== 'material-dispatch') {
      try {
        const decoded = atob(encoded);
        setCreatedBy(decoded);
      } catch (e) {
        console.error('Failed to decode user ID from URL:', e);
        setError('Failed to decode user ID. Please check the URL.');
      }
    }
  }, []);

  // Fetch companies
  const fetchCompanies = async () => {
    try {
      setLoading((prev) => ({ ...prev, companies: true }));
      const response = await axios.get("http://103.118.158.127/api/project/companies");
      setCompanies(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching companies:", error);
      setError("Failed to load companies. Please try again.");
    } finally {
      setLoading((prev) => ({ ...prev, companies: false }));
    }
  };

  // Fetch master_dc_no for selected company
  const fetchMasterDcNo = async () => {
    if (!selectedCompany) {
      setMasterDcNo("");
      setIsMasterDcNoEditable(true);
      return;
    }
    try {
      setLoading((prev) => ({ ...prev, masterDcNo: true }));
      const response = await axios.get("http://103.118.158.127/api/material/master-dc-no", {
        params: { company_id: selectedCompany },
      });
      const masterDcNoData = response.data.data?.dc_no || "";
      setMasterDcNo(masterDcNoData);
      setIsMasterDcNoEditable(!masterDcNoData);
    } catch (error) {
      console.error("Error fetching master DC No:", error);
      setError("Failed to load Master DC No. Please try again.");
      setMasterDcNo("");
      setIsMasterDcNoEditable(true);
    } finally {
      setLoading((prev) => ({ ...prev, masterDcNo: false }));
    }
  };

  // Save master_dc_no
  const saveMasterDcNo = async () => {
    if (!selectedCompany || !masterDcNo || !isMasterDcNoEditable) return;
    try {
      await axios.post("http://103.118.158.127/api/material/master-dc-no", {
        company_id: selectedCompany,
        dc_no: masterDcNo,
      });
      setIsMasterDcNoEditable(false);
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Master DC No saved successfully!",
        showConfirmButton: false,
        timer: 1500,
        toast: true,
        background: "#ecfdf5",
        iconColor: "#10b981",
      });
    } catch (error) {
      console.error("Error saving master DC No:", error);
      setError("Failed to save Master DC No. Please try again.");
    }
  };

  // Fetch projects with sites
  const fetchProjects = async () => {
    try {
      setLoading((prev) => ({ ...prev, projects: true }));
      const response = await axios.get("http://103.118.158.127/api/project/projects-with-sites");
      const projectsData = Array.isArray(response.data) ? response.data : [];
      setAllProjects(projectsData);
      if (projectsData.length > 0 && selectedCompany) {
        const filteredProjects = projectsData.filter((project) => project.company_id === selectedCompany);
        setProjects(filteredProjects);
        if (filteredProjects.length > 0 && !selectedProject) {
          setSelectedProject(filteredProjects[0].project_id);
        }
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
      setError("Failed to load projects. Please try again.");
    } finally {
      setLoading((prev) => ({ ...prev, projects: false }));
    }
  };

  // Fetch next DC No based on site_id
  const fetchNextDcNo = async () => {
    if (!selectedSite) return;
    try {
      setLoading((prev) => ({ ...prev, dcNo: true }));
      const response = await axios.get("http://103.118.158.127/api/material/next-dc-no", {
        params: { site_id: selectedSite },
      });
      if (response.data.status === "success" && response.data.data) {
        const nextDcNoValue = response.data.data.next_dc_no != null ? response.data.data.next_dc_no.toString() : "N/A";
        setNextDcNo(nextDcNoValue);
        setDispatchData((prev) => ({
          ...prev,
          dc_no: nextDcNoValue,
        }));
      } else {
        setNextDcNo("N/A");
        setDispatchData((prev) => ({ ...prev, dc_no: "N/A" }));
      }
    } catch (error) {
      console.error("Error fetching next DC No:", error);
      setError(error.response?.data?.message || "Failed to load next DC No. Please try again.");
      setNextDcNo("N/A");
      setDispatchData((prev) => ({ ...prev, dc_no: "N/A" }));
    } finally {
      setLoading((prev) => ({ ...prev, dcNo: false }));
    }
  };

  // Fetch work descriptions for selected site
  const fetchWorkDescriptions = async (site_id) => {
    try {
      setLoading((prev) => ({ ...prev, workDescriptions: true }));
      const response = await axios.get(`http://103.118.158.127/api/material/work-descriptions?site_id=${site_id}`);
      const descriptions = Array.isArray(response.data?.data) ? response.data.data : [];
      const uniqueDescs = Array.from(new Map(descriptions.map((desc) => [desc.desc_id, desc])).values());
      setWorkDescriptions(uniqueDescs);
      setSelectedWorkDesc("");
    } catch (error) {
      console.error("Error fetching work descriptions:", error);
      setError("Failed to load work descriptions. Please try again.");
      setWorkDescriptions([]);
      setSelectedWorkDesc("");
    } finally {
      setLoading((prev) => ({ ...prev, workDescriptions: false }));
    }
  };

  // Fetch assigned materials with dispatch details
  const fetchAssignedMaterials = async () => {
    if (!selectedProject || !selectedSite) return;
    try {
      setLoading((prev) => ({ ...prev, materials: true }));
      setError(null);
      const response = await axios.get("http://103.118.158.127/api/material/assignments-with-dispatch", {
        params: { pd_id: selectedProject, site_id: selectedSite },
      });
      const materials = response.data.data || [];
      setAssignedMaterials(materials);

      // Initialize dispatch quantities and remarks
      const newDispatchQuantities = {};
      const newRemarks = {};
      materials.forEach((assignment) => {
        newDispatchQuantities[assignment.id] = {
          dispatch_qty: 0,
        };
        newRemarks[assignment.id] = {
          comp_a_remarks: "",
          comp_b_remarks: "",
          comp_c_remarks: "",
        };
      });
      setDispatchQuantities(newDispatchQuantities);
      setRemarks(newRemarks);
    } catch (error) {
      console.error("Error fetching material assignments:", error);
      setError(
        error.response?.data?.message ||
        error.response?.data?.sqlMessage ||
        "Failed to load material assignments. Please try again."
      );
    } finally {
      setLoading((prev) => ({ ...prev, materials: false }));
    }
  };

  // Fetch transport types
  const fetchTransportTypes = async () => {
    try {
      setLoading((prev) => ({ ...prev, transportTypes: true }));
      const response = await axios.get("http://103.118.158.127/api/material/transport-types");
      setTransportTypes(response.data.data || []);
    } catch (error) {
      console.error("Error fetching transport types:", error);
      setError("Failed to load transport types. Please try again.");
    } finally {
      setLoading((prev) => ({ ...prev, transportTypes: false }));
    }
  };

  // Fetch providers
  const fetchProviders = async (transport_type_id) => {
    try {
      setLoading((prev) => ({ ...prev, providers: true }));
      const response = await axios.get("http://103.118.158.127/api/material/providers", {
        params: { transport_type_id: Number.isInteger(parseInt(transport_type_id)) ? transport_type_id : undefined },
      });
      setProviders(response.data.data || []);
    } catch (error) {
      console.error("Error fetching providers:", error);
      setError("Failed to load providers. Please try again.");
    } finally {
      setLoading((prev) => ({ ...prev, providers: false }));
    }
  };

  // Fetch vehicles
  const fetchVehicles = async () => {
    try {
      setLoading((prev) => ({ ...prev, vehicles: true }));
      const response = await axios.get("http://103.118.158.127/api/material/vehicles");
      setVehicles(response.data.data || []);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
      setError("Failed to load vehicles. Please try again.");
    } finally {
      setLoading((prev) => ({ ...prev, vehicles: false }));
    }
  };

  // Fetch drivers
  const fetchDrivers = async () => {
    try {
      setLoading((prev) => ({ ...prev, drivers: true }));
      const response = await axios.get("http://103.118.158.127/api/material/drivers");
      setDrivers(response.data.data || []);
    } catch (error) {
      console.error("Error fetching drivers:", error);
      setError("Failed to load drivers. Please try again.");
    } finally {
      setLoading((prev) => ({ ...prev, drivers: false }));
    }
  };

  // Handle company selection
  const handleCompanyChange = (e) => {
    const company_id = e.target.value;
    setSelectedCompany(company_id);
    setSelectedProject("");
    setSelectedSite("");
    setSelectedWorkDesc("");
    setSites([]);
    setWorkDescriptions([]);
    setAssignedMaterials([]);
    setDispatchQuantities({});
    setRemarks({});
    setNextDcNo("");
    setMasterDcNo("");
    setIsMasterDcNoEditable(true);
    const selectedCompanyData = companies.find((company) => company.company_id === company_id);
    setDispatchData({
      dc_no: "",
      dispatch_date: "",
      order_no: "",
      vendor_code: selectedCompanyData ? selectedCompanyData.vendor_code || "" : "",
    });
    setTransportData({
      transport_type_id: "",
      provider_id: "",
      vehicle_id: "",
      driver_id: "",
      destination: "",
      booking_expense: "",
      travel_expense: "",
    });
    setNewEntryData({
      vehicle_model: "",
      vehicle_number: "",
      driver_mobile: "",
      driver_address: "",
      provider_address: "",
      provider_mobile: "",
    });
    setError(null);
    setIsTransportModalOpen(false);
  };

  // Handle project selection
  const handleProjectChange = (e) => {
    const project_id = e.target.value;
    setSelectedProject(project_id);
    setSelectedSite("");
    setSelectedWorkDesc("");
    setSites([]);
    setWorkDescriptions([]);
    setAssignedMaterials([]);
    setDispatchQuantities({});
    setRemarks({});
    setNextDcNo("");
    setTransportData({
      transport_type_id: "",
      provider_id: "",
      vehicle_id: "",
      driver_id: "",
      destination: "",
      booking_expense: "",
      travel_expense: "",
    });
    setNewEntryData({
      vehicle_model: "",
      vehicle_number: "",
      driver_mobile: "",
      driver_address: "",
      provider_address: "",
      provider_mobile: "",
    });
    setError(null);
    setIsTransportModalOpen(false);
    if (project_id) {
      const selectedProj = allProjects.find((project) => project.project_id === project_id);
      const company_id = selectedProj?.company_id;
      const selectedCompanyData = companies.find((company) => company.company_id === company_id);
      const projectSites = selectedProj && Array.isArray(selectedProj.sites) ? selectedProj.sites : [];
      setSites(projectSites);
      if (projectSites.length > 0) {
        setSelectedSite(projectSites[0].site_id);
        setDispatchData({
          dc_no: "",
          dispatch_date: "",
          order_no: projectSites[0].po_number || "",
          vendor_code: selectedCompanyData ? selectedCompanyData.vendor_code || "" : "",
        });
      } else {
        setDispatchData({
          dc_no: "",
          dispatch_date: "",
          order_no: "",
          vendor_code: selectedCompanyData ? selectedCompanyData.vendor_code || "" : "",
        });
      }
    } else {
      setDispatchData({
        dc_no: "",
        dispatch_date: "",
        order_no: "",
        vendor_code: selectedCompany ? companies.find((company) => company.company_id === selectedCompany)?.vendor_code || "" : "",
      });
    }
  };

  // Handle site selection
  const handleSiteChange = (e) => {
    const site_id = e.target.value;
    setSelectedSite(site_id);
    setSelectedWorkDesc("");
    setWorkDescriptions([]);
    setAssignedMaterials([]);
    setDispatchQuantities({});
    setRemarks({});
    setNextDcNo("");
    const selectedSiteData = sites.find((site) => site.site_id === site_id);
    setDispatchData((prev) => ({
      ...prev,
      order_no: selectedSiteData ? selectedSiteData.po_number || "" : "",
      dc_no: "",
    }));
    setTransportData({
      transport_type_id: "",
      provider_id: "",
      vehicle_id: "",
      driver_id: "",
      destination: "",
      booking_expense: "",
      travel_expense: "",
    });
    setNewEntryData({
      vehicle_model: "",
      vehicle_number: "",
      driver_mobile: "",
      driver_address: "",
      provider_address: "",
      provider_mobile: "",
    });
    setError(null);
    setIsTransportModalOpen(false);
    if (site_id) {
      fetchWorkDescriptions(site_id);
      fetchAssignedMaterials();
      fetchNextDcNo();
    }
  };

  // Handle work description selection
  const handleWorkDescChange = (selectedOption) => {
    const desc_id = selectedOption ? selectedOption.value : "";
    setSelectedWorkDesc(desc_id);
    setError(null);
  };

  // Handle dispatch form input changes
  const handleDispatchChange = (field, value) => {
    setDispatchData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle master_dc_no change
  const handleMasterDcNoChange = (value) => {
    setMasterDcNo(value);
  };

  // Handle transport form input changes
  const handleTransportChange = (field, value) => {
    setTransportData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (field === "transport_type_id") {
      setProviders([]);
      setTransportData((prev) => ({
        ...prev,
        provider_id: "",
        vehicle_id: "",
        driver_id: "",
        destination: "",
        booking_expense: "",
        travel_expense: "",
      }));
      setNewEntryData({
        vehicle_model: "",
        vehicle_number: "",
        driver_mobile: "",
        driver_address: "",
        provider_address: "",
        provider_mobile: "",
      });
      if (value && Number.isInteger(parseInt(value))) {
        fetchProviders(value);
      }
    }
  };

  // Handle new entry input changes
  const handleNewEntryChange = (field, value) => {
    setNewEntryData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle new entry for searchable dropdowns
  const handleNewEntryDropdown = (field, value) => {
    if (field === "vehicle_id") {
      setNewEntryData((prev) => ({
        ...prev,
        vehicle_model: value,
        vehicle_number: "",
      }));
    } else if (field === "driver_id") {
      setNewEntryData((prev) => ({
        ...prev,
        driver_mobile: "",
        driver_address: "",
      }));
    } else if (field === "provider_id") {
      setNewEntryData((prev) => ({
        ...prev,
        provider_address: "",
        provider_mobile: "",
      }));
    }
  };

  // Handle dispatch quantity change
  const handleQuantityChange = (assignmentId, value) => {
    const assignment = assignedMaterials.find((a) => a.id === assignmentId);
    const maxQty = assignment.remaining_quantity || 0;
    const dispatchQty = value ? Math.min(parseInt(value), maxQty) : 0;

    setDispatchQuantities((prev) => ({
      ...prev,
      [assignmentId]: {
        dispatch_qty: dispatchQty,
      },
    }));
  };

  // Handle remarks input changes
  const handleRemarksChange = (assignmentId, field, value) => {
    setRemarks((prev) => ({
      ...prev,
      [assignmentId]: {
        ...prev[assignmentId],
        [field]: value,
      },
    }));
  };

  // Calculate component quantities based on ratios
  const calculateComponentQuantities = (assignment, dispatchQty) => {
    const totalRatio =
      (assignment.comp_ratio_a || 0) +
      (assignment.comp_ratio_b || 0) +
      (assignment.comp_ratio_c || 0);
    if (totalRatio === 0 || !dispatchQty) {
      return { comp_a_qty: null, comp_b_qty: null, comp_c_qty: null };
    }

    let comp_a_qty = null,
      comp_b_qty = null,
      comp_c_qty = null;
    let remaining = dispatchQty;

    if (assignment.comp_ratio_a !== null) {
      comp_a_qty = Math.floor((assignment.comp_ratio_a / totalRatio) * dispatchQty);
      remaining -= comp_a_qty;
    }
    if (assignment.comp_ratio_b !== null) {
      comp_b_qty = Math.floor((assignment.comp_ratio_b / totalRatio) * dispatchQty);
      remaining -= comp_b_qty;
    }
    if (assignment.comp_ratio_c !== null) {
      comp_c_qty = Math.floor((assignment.comp_ratio_c / totalRatio) * dispatchQty);
      remaining -= comp_c_qty;
    }

    if (remaining > 0) {
      if (assignment.comp_ratio_a !== null && comp_a_qty !== null) {
        comp_a_qty += remaining;
      } else if (assignment.comp_ratio_b !== null && comp_b_qty !== null) {
        comp_b_qty += remaining;
      } else if (assignment.comp_ratio_c !== null && comp_c_qty !== null) {
        comp_c_qty += remaining;
      }
    }

    return { comp_a_qty, comp_b_qty, comp_c_qty };
  };

  // Validate dispatch and remarks for enabling Dispatch button
  const isDispatchEnabled = () => {
    if (!dispatchData.dc_no || !dispatchData.dispatch_date || !dispatchData.order_no || !dispatchData.vendor_code || !selectedWorkDesc || !createdBy) {
      return false;
    }
    const filteredMaterials = assignedMaterials.filter((assignment) => assignment.desc_id === selectedWorkDesc && assignment.dispatch_status === "not-dispatched");
    for (const assignment of filteredMaterials) {
      const assignmentId = assignment.id;
      const dispatchQty = dispatchQuantities[assignmentId]?.dispatch_qty || 0;
      const assignmentRemarks = remarks[assignmentId];
      const { comp_a_qty, comp_b_qty, comp_c_qty } = calculateComponentQuantities(assignment, dispatchQty);
      if (comp_a_qty !== null && !assignmentRemarks?.comp_a_remarks) {
        return false;
      }
      if (comp_b_qty !== null && !assignmentRemarks?.comp_b_remarks) {
        return false;
      }
      if (comp_c_qty !== null && !assignmentRemarks?.comp_c_remarks) {
        return false;
      }
      if (dispatchQty <= 0) {
        return false;
      }
    }
    return filteredMaterials.length > 0;
  };

  // Handle dispatch form submission
  const handleDispatchSubmit = async () => {
    if (!createdBy) {
      setError("User ID not available. Please refresh the page.");
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: "User ID not available",
        showConfirmButton: false,
        timer: 1500,
        toast: true,
      });
      return;
    }
    try {
      setLoading((prev) => ({ ...prev, submitting: true }));
      setError(null);

      await saveMasterDcNo();

      const requiredFields = [
        transportData.transport_type_id,
        transportData.provider_id,
        transportData.vehicle_id,
        transportData.driver_id,
        transportData.destination,
        transportData.travel_expense,
      ];
      if (transportData.transport_type_id === "2") {
        requiredFields.push(transportData.booking_expense);
      }
      if (requiredFields.some((field) => !field)) {
        setError("Please fill all required transport fields.");
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: "Please fill all required transport fields",
          showConfirmButton: false,
          timer: 1500,
          toast: true,
        });
        return;
      }

      const dispatchPayload = assignedMaterials
        .filter((assignment) => assignment.desc_id === selectedWorkDesc && assignment.dispatch_status === "not-dispatched")
        .map((assignment) => {
          const dispatchQty = dispatchQuantities[assignment.id]?.dispatch_qty || 0;
          const { comp_a_qty, comp_b_qty, comp_c_qty } = calculateComponentQuantities(assignment, dispatchQty);
          return {
            material_assign_id: assignment.id,
            desc_id: assignment.desc_id,
            dc_no: parseInt(dispatchData.dc_no),
            dispatch_date: dispatchData.dispatch_date,
            order_no: dispatchData.order_no,
            vendor_code: dispatchData.vendor_code,
            dispatch_qty: dispatchQty,
            comp_a_qty,
            comp_b_qty,
            comp_c_qty,
            comp_a_remarks: comp_a_qty !== null ? remarks[assignment.id]?.comp_a_remarks || null : null,
            comp_b_remarks: comp_b_qty !== null ? remarks[assignment.id]?.comp_b_remarks || null : null,
            comp_c_remarks: comp_c_qty !== null ? remarks[assignment.id]?.comp_c_remarks || null : null,
            master_dc_no: masterDcNo || null,
          };
        })
        .filter((payload) => payload.dispatch_qty > 0);

      const transportPayload = {
        transport_type_id: parseInt(transportData.transport_type_id),
        provider_id: transportData.provider_id,
        vehicle_id: transportData.vehicle_id,
        driver_id: transportData.driver_id,
        destination: transportData.destination,
        booking_expense: transportData.booking_expense ? parseFloat(transportData.booking_expense) : null,
        travel_expense: parseFloat(transportData.travel_expense),
        provider_address: newEntryData.provider_address || null,
        provider_mobile: newEntryData.provider_mobile || null,
        vehicle_model: newEntryData.vehicle_model || null,
        vehicle_number: newEntryData.vehicle_number || null,
        driver_mobile: newEntryData.driver_mobile || null,
        driver_address: newEntryData.driver_address || null,
      };

      const payload = {
        assignments: dispatchPayload,
        transport: transportPayload,
        created_by: createdBy,
      };

      const response = await axios.post("http://103.118.158.127/api/material/add-dispatch", payload);

      if (response.data.status === "already_dispatched") {
        const conflicts = response.data.conflicts
          .map((conflict) => `Material: ${conflict.item_name} (ID: ${conflict.material_assign_id})`)
          .join(", ");
        setError(`Cannot dispatch the following materials as they would exceed assigned quantity: ${conflicts}`);
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: "Some materials would exceed assigned quantity",
          text: conflicts,
          showConfirmButton: false,
          timer: 2000,
          toast: true,
        });
        return;
      }

      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Materials dispatched and transport details saved successfully!",
        showConfirmButton: false,
        timer: 2000,
        toast: true,
        background: "#ecfdf5",
        iconColor: "#10b981",
      });

      setDispatchData({ dc_no: "", dispatch_date: "", order_no: "", vendor_code: "" });
      setTransportData({
        transport_type_id: "",
        provider_id: "",
        vehicle_id: "",
        driver_id: "",
        destination: "",
        booking_expense: "",
        travel_expense: "",
      });
      setNewEntryData({
        vehicle_model: "",
        vehicle_number: "",
        driver_mobile: "",
        driver_address: "",
        provider_address: "",
        provider_mobile: "",
      });
      setDispatchQuantities({});
      setRemarks({});
      setSelectedWorkDesc("");
      setIsTransportModalOpen(false);
      await fetchAssignedMaterials();
      await fetchWorkDescriptions(selectedSite);
      await fetchTransportTypes();
      await fetchVehicles();
      await fetchDrivers();
      if (Number.isInteger(parseInt(transportData.transport_type_id))) {
        await fetchProviders(transportData.transport_type_id);
      }
      await fetchNextDcNo();
    } catch (error) {
      console.error("Error dispatching materials or saving transport:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.sqlMessage ||
        "Failed to dispatch materials or save transport details. Please try again.";
      setError(errorMessage);
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: errorMessage,
        showConfirmButton: false,
        timer: 2000,
        toast: true,
      });
    } finally {
      setLoading((prev) => ({ ...prev, submitting: false }));
    }
  };

  // Helper function to format ratio string
  const getRatioString = (assignment) => {
    const ratios = [];
    if (assignment.comp_ratio_a !== null) ratios.push(assignment.comp_ratio_a);
    if (assignment.comp_ratio_b !== null) ratios.push(assignment.comp_ratio_b);
    if (assignment.comp_ratio_c !== null) ratios.push(assignment.comp_ratio_c);
    return ratios.length > 0 ? `(${ratios.join(":")})` : "";
  };

  // Effect hooks
  useEffect(() => {
    fetchCompanies();
    fetchProjects();
    fetchTransportTypes();
    fetchVehicles();
    fetchDrivers();
  }, []);

  useEffect(() => {
    if (selectedCompany) {
      fetchMasterDcNo();
      const filteredProjects = allProjects.filter((project) => project.company_id === selectedCompany);
      setProjects(filteredProjects);
      if (filteredProjects.length > 0 && !selectedProject) {
        setSelectedProject(filteredProjects[0].project_id);
      } else if (!filteredProjects.some((project) => project.project_id === selectedProject)) {
        setSelectedProject("");
        setSites([]);
        setSelectedSite("");
        setSelectedWorkDesc("");
        setWorkDescriptions([]);
      }
    } else {
      setProjects([]);
      setSelectedProject("");
      setSites([]);
      setSelectedSite("");
      setSelectedWorkDesc("");
      setWorkDescriptions([]);
      setMasterDcNo("");
      setIsMasterDcNoEditable(true);
    }
  }, [selectedCompany, allProjects]);

  useEffect(() => {
    if (selectedProject) {
      const selectedProj = allProjects.find((project) => project.project_id === selectedProject);
      const projectSites = selectedProj && Array.isArray(selectedProj.sites) ? selectedProj.sites : [];
      setSites(projectSites);
      if (projectSites.length > 0 && !selectedSite) {
        setSelectedSite(projectSites[0].site_id);
        setDispatchData((prev) => ({
          ...prev,
          order_no: projectSites[0].po_number || "",
        }));
      } else if (!projectSites.some((site) => site.site_id === selectedSite)) {
        setSelectedSite("");
        setSelectedWorkDesc("");
        setWorkDescriptions([]);
        setDispatchData((prev) => ({
          ...prev,
          order_no: "",
        }));
      }
    } else {
      setSites([]);
      setSelectedSite("");
      setSelectedWorkDesc("");
      setWorkDescriptions([]);
      setDispatchData((prev) => ({
        ...prev,
        order_no: "",
      }));
    }
  }, [selectedProject, allProjects]);

  useEffect(() => {
    if (selectedSite) {
      fetchWorkDescriptions(selectedSite);
    }
    if (selectedProject && selectedSite) {
      fetchAssignedMaterials();
      fetchNextDcNo();
    }
  }, [selectedProject, selectedSite]);

  useEffect(() => {
    if (transportData.transport_type_id && Number.isInteger(parseInt(transportData.transport_type_id))) {
      fetchProviders(transportData.transport_type_id);
    } else {
      setProviders([]);
      setTransportData((prev) => ({
        ...prev,
        provider_id: "",
        vehicle_id: "",
        driver_id: "",
        destination: "",
        booking_expense: "",
        travel_expense: "",
      }));
    }
  }, [transportData.transport_type_id]);

  useEffect(() => {
    if (providers.length === 1 && !transportData.provider_id) {
      setTransportData(prev => ({ ...prev, provider_id: providers[0].id }));
    }
  }, [providers.length, transportData.provider_id]); // Changed deps to prevent potential loops

  useEffect(() => {
    if (vehicles.length === 1 && !transportData.vehicle_id) {
      setTransportData(prev => ({ ...prev, vehicle_id: vehicles[0].id }));
    }
  }, [vehicles.length, transportData.vehicle_id]); // Changed deps

  useEffect(() => {
    if (drivers.length === 1 && !transportData.driver_id) {
      setTransportData(prev => ({ ...prev, driver_id: drivers[0].id }));
    }
  }, [drivers.length, transportData.driver_id]); // Changed deps

  useEffect(() => {
    if (workDescriptions.length === 1 && !selectedWorkDesc) {
      setSelectedWorkDesc(workDescriptions[0].desc_id);
    }
  }, [workDescriptions.length, selectedWorkDesc]); // Changed deps

  const isOwnVehicle = transportData.transport_type_id === "1";

  const workOptions = workDescriptions.map((desc) => ({
    value: desc.desc_id,
    label: desc.desc_name || "Unknown Work Description",
  }));

  const selectedWorkOption = workOptions.find((opt) => opt.value === selectedWorkDesc);

  const filteredMaterials = assignedMaterials.filter(
    (assignment) => assignment.desc_id === selectedWorkDesc && assignment.dispatch_status === "not-dispatched"
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 flex items-center justify-center gap-2">
            <Package className="h-8 w-8 text-teal-600" aria-hidden="true" />
            Material Dispatch
          </h2>
          <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
            Dispatch non-dispatched materials to your project sites
          </p>
        </div>

        {/* Company, Project, and Site Selection */}
        <div className="mb-6 sm:mb-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="company">
              Select Company
            </label>
            <select
              id="company"
              value={selectedCompany}
              onChange={handleCompanyChange}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm bg-white shadow-sm transition-all duration-200"
              disabled={loading.companies}
            >
              <option value="">Select Company</option>
              {companies.map((company) => (
                <option key={company.company_id} value={company.company_id}>
                  {company.company_name || "Unknown Company"}
                </option>
              ))}
            </select>
            {loading.companies && <Loader2 className="h-5 w-5 text-teal-500 animate-spin mt-2" />}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="project">
              Select Cost Center
            </label>
            <select
              id="project"
              value={selectedProject}
              onChange={handleProjectChange}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm bg-white shadow-sm transition-all duration-200"
              disabled={loading.projects || !selectedCompany}
            >
              <option value="">Select Cost Center</option>
              {projects.map((project) => (
                <option key={project.project_id} value={project.project_id}>
                  {project.project_name || "Unknown Project"}
                </option>
              ))}
            </select>
            {loading.projects && <Loader2 className="h-5 w-5 text-teal-500 animate-spin mt-2" />}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="site">
              Select Site
            </label>
            <select
              id="site"
              value={selectedSite}
              onChange={handleSiteChange}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm bg-white shadow-sm transition-all duration-200"
              disabled={loading.sites || !selectedProject}
            >
              <option value="">Select Site</option>
              {sites.map((site) => (
                <option key={site.site_id} value={site.site_id}>
                  {site.site_name} (PO: {site.po_number || "N/A"})
                </option>
              ))}
            </select>
            {loading.sites && selectedProject && <Loader2 className="h-5 w-5 text-teal-500 animate-spin mt-2" />}
          </div>
        </div>

        {/* Work Description Selection */}
        {selectedCompany && selectedProject && selectedSite && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Work Description</label>
            <Select
              options={workOptions}
              value={selectedWorkOption}
              onChange={handleWorkDescChange}
              placeholder="Select Work Description"
              isSearchable
              isClearable
              isDisabled={loading.workDescriptions}
              className="text-sm"
              classNamePrefix="select"
              styles={{
                control: (provided, state) => ({
                  ...provided,
                  minHeight: '38px',
                  borderColor: state.isFocused ? '#3b82f6' : '#d1d5db',
                  boxShadow: state.isFocused ? '0 0 0 2px rgba(59, 130, 246, 0.2)' : 'none',
                }),
                menu: (provided) => ({
                  ...provided,
                  zIndex: 10,
                }),
              }}
            />
            {loading.workDescriptions && <Loader2 className="h-5 w-5 text-teal-500 animate-spin mt-2" />}
          </div>
        )}

        {/* Dispatch Details */}
        {selectedCompany && selectedProject && selectedSite && selectedWorkDesc && (
          <div className="mb-6 bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Dispatch Details</h3>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <div className="w-full sm:w-1/5">
                <label className="block text-xs font-medium text-gray-600" htmlFor="master_dc_no">
                  Master DC No <span className="text-red-500">*</span>
                </label>
                {loading.masterDcNo ? (
                  <Loader2 className="h-5 w-5 text-teal-500 animate-spin mt-2" />
                ) : isMasterDcNoEditable ? (
                  <input
                    type="text"
                    id="master_dc_no"
                    value={masterDcNo}
                    onChange={(e) => handleMasterDcNoChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm transition-all duration-200"
                    placeholder="Enter Master DC No"
                    aria-required="true"
                  />
                ) : (
                  <div className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-100 text-gray-700">
                    {masterDcNo || "N/A"}
                  </div>
                )}
              </div>
              <div className="w-full sm:w-1/5">
                <label className="block text-xs font-medium text-gray-600" htmlFor="dc_no">
                  PO DC No <span className="text-red-500">*</span>
                </label>
                <div className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-100 text-gray-700">
                  {loading.dcNo ? (
                    <Loader2 className="h-5 w-5 text-teal-500 animate-spin inline-block" />
                  ) : (
                    nextDcNo || "N/A"
                  )}
                </div>
              </div>
              <div className="w-full sm:w-1/5">
                <label className="block text-xs font-medium text-gray-600" htmlFor="dispatch_date">
                  Dispatch Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  id="dispatch_date"
                  value={dispatchData.dispatch_date}
                  onChange={(e) => handleDispatchChange("dispatch_date", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm transition-all duration-200"
                  aria-required="true"
                />
              </div>
              <div className="w-full sm:w-1/5">
                <label className="block text-xs font-medium text-gray-600" htmlFor="order_no">
                  Order No <span className="text-red-500">*</span>
                </label>
                <div className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-100 text-gray-700">
                  {dispatchData.order_no || "N/A"}
                </div>
              </div>
              <div className="w-full sm:w-1/5">
                <label className="block text-xs font-medium text-gray-600" htmlFor="vendor_code">
                  Vendor Code <span className="text-red-500">*</span>
                </label>
                <div className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-100 text-gray-700">
                  {dispatchData.vendor_code || "N/A"}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg shadow-md flex items-center justify-between transition-all duration-300">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-red-500" aria-hidden="true" />
              <span>{error}</span>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-red-500 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 rounded-full"
              aria-label="Close error message"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading.materials || loading.workDescriptions ? (
          <div className="flex justify-center items-center py-16">
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="h-12 w-12 text-teal-600 animate-spin" aria-hidden="true" />
              <p className="text-gray-600 text-lg font-medium">Loading material assignments...</p>
            </div>
          </div>
        ) : !selectedCompany || !selectedProject || !selectedSite ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-lg border border-gray-200">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" aria-hidden="true" />
            <p className="text-gray-600 text-lg font-medium">Please select a company, project, and site.</p>
          </div>
        ) : !selectedWorkDesc ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-lg border border-gray-200">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" aria-hidden="true" />
            <p className="text-gray-600 text-lg font-medium">Please select a work description.</p>
          </div>
        ) : filteredMaterials.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-lg border border-gray-200">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" aria-hidden="true" />
            <p className="text-gray-600 text-lg font-medium">No non-dispatched material assignments found for this work description.</p>
            <p className="text-gray-500 mt-2">Assign materials to this work description to dispatch them.</p>
          </div>
        ) : (
          <>
            {/* Desktop View with Table */}
            <div className="hidden md:block bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden mb-6">
              <div className="p-4 overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gradient-to-r from-teal-600 to-teal-700 text-white">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold tracking-wider">#</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold tracking-wider">Material Details</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold tracking-wider">Assigned Quantity</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold tracking-wider">Remaining Quantity & UOM</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold tracking-wider">Dispatch Quantity</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold tracking-wider">Component Quantities</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold tracking-wider">Remarks</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredMaterials.map((assignment, index) => {
                      const dispatchQty = dispatchQuantities[assignment.id]?.dispatch_qty || 0;
                      const { comp_a_qty, comp_b_qty, comp_c_qty } = calculateComponentQuantities(assignment, dispatchQty);
                      return (
                        <tr key={assignment.id} className="hover:bg-teal-50 transition-colors duration-200">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{index + 1}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            <div className="space-y-1">
                              <p className="font-medium">{assignment.item_name || "N/A"} {getRatioString(assignment)}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            <span className="inline-flex items-center px-2.5 py-0.5 text-md font-bold">
                              {assignment.quantity || "N/A"} | {assignment.uom_name || "N/A"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            <span className="inline-flex items-center px-2.5 py-0.5 text-md font-bold">
                              {assignment.remaining_quantity || "N/A"} | {assignment.uom_name || "N/A"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            <div className="space-y-1">
                              <input
                                type="number"
                                value={dispatchQty}
                                onChange={(e) => handleQuantityChange(assignment.id, e.target.value)}
                                className="w-full px-2 py-1 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 shadow-sm"
                                placeholder="Dispatch Qty"
                                min="0"
                                max={assignment.remaining_quantity}
                              />
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700">
                            <div className="space-y-4">
                              {assignment.comp_ratio_a !== null && (
                                <div className="flex items-center gap-4">
                                  <label className="w-24 text-sm font-medium text-gray-700">Comp A:</label>
                                  <span className="text-sm bg-teal-50 px-3 py-1 rounded-md">{comp_a_qty ?? "N/A"}</span>
                                </div>
                              )}
                              {assignment.comp_ratio_b !== null && (
                                <div className="flex items-center gap-4">
                                  <label className="w-24 text-sm font-medium text-gray-700">Comp B:</label>
                                  <span className="text-sm bg-teal-50 px-3 py-1 rounded-md">{comp_b_qty ?? "N/A"}</span>
                                </div>
                              )}
                              {assignment.comp_ratio_c !== null && (
                                <div className="flex items-center gap-4">
                                  <label className="w-24 text-sm font-medium text-gray-700">Comp C:</label>
                                  <span className="text-sm bg-teal-50 px-3 py-1 rounded-md">{comp_c_qty ?? "N/A"}</span>
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700">
                            <div className="space-y-4">
                              {assignment.comp_ratio_a !== null && (
                                <div className="flex items-center gap-4">
                                  <input
                                    type="text"
                                    value={remarks[assignment.id]?.comp_a_remarks ?? ""}
                                    onChange={(e) => handleRemarksChange(assignment.id, "comp_a_remarks", e.target.value)}
                                    className="w-full px-2 py-1 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 shadow-sm"
                                    placeholder="Remarks for Component A"
                                    required={comp_a_qty !== null}
                                  />
                                </div>
                              )}
                              {assignment.comp_ratio_b !== null && (
                                <div className="flex items-center gap-4">
                                  <input
                                    type="text"
                                    value={remarks[assignment.id]?.comp_b_remarks ?? ""}
                                    onChange={(e) => handleRemarksChange(assignment.id, "comp_b_remarks", e.target.value)}
                                    className="w-full px-2 py-1 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 shadow-sm"
                                    placeholder="Remarks for Component B"
                                    required={comp_b_qty !== null}
                                  />
                                </div>
                              )}
                              {assignment.comp_ratio_c !== null && (
                                <div className="flex items-center gap-4">
                                  <input
                                    type="text"
                                    value={remarks[assignment.id]?.comp_c_remarks ?? ""}
                                    onChange={(e) => handleRemarksChange(assignment.id, "comp_c_remarks", e.target.value)}
                                    className="w-full px-2 py-1 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 shadow-sm"
                                    placeholder="Remarks for Component C"
                                    required={comp_c_qty !== null}
                                  />
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="p-4 flex justify-end">
                <button
                  onClick={() => setIsTransportModalOpen(true)}
                  className={`px-4 py-2 text-white rounded-lg text-sm font-medium shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                    isDispatchEnabled() ? "bg-teal-600 hover:bg-teal-700" : "bg-gray-400 cursor-not-allowed"
                  }`}
                  disabled={!isDispatchEnabled()}
                >
                  <Truck className="h-4 w-4 inline-block mr-2" />
                  Assign Transport
                </button>
              </div>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-6 mb-6">
              {filteredMaterials.map((assignment, index) => {
                const dispatchQty = dispatchQuantities[assignment.id]?.dispatch_qty || 0;
                const { comp_a_qty, comp_b_qty, comp_c_qty } = calculateComponentQuantities(assignment, dispatchQty);
                return (
                  <div key={assignment.id} className="bg-white rounded-xl shadow-lg border border-gray-100 p-5 space-y-6">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-900">#{index + 1}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Material Details</p>
                      <p className="text-sm text-gray-600">{assignment.item_name || "N/A"} {getRatioString(assignment)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Assigned Quantity</p>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800">
                        {assignment.quantity || "N/A"} {assignment.uom_name || "N/A"}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Remaining Quantity & UOM</p>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800">
                        {assignment.remaining_quantity || "N/A"} {assignment.uom_name || "N/A"}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Dispatch Quantity</p>
                      <input
                        type="number"
                        value={dispatchQty}
                        onChange={(e) => handleQuantityChange(assignment.id, e.target.value)}
                        className="w-full px-2 py-1 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 shadow-sm"
                        placeholder="Dispatch Qty"
                        min="0"
                        max={assignment.remaining_quantity}
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Component Quantities</p>
                      <div className="space-y-4 mt-2">
                        {assignment.comp_ratio_a !== null && (
                          <div className="flex items-center gap-4">
                            <label className="w-24 text-sm font-medium text-gray-700">Component A:</label>
                            <span className="text-sm bg-teal-50 px-3 py-1 rounded-md">{comp_a_qty ?? "N/A"}</span>
                          </div>
                        )}
                        {assignment.comp_ratio_b !== null && (
                          <div className="flex items-center gap-4">
                            <label className="w-24 text-sm font-medium text-gray-700">Component B:</label>
                            <span className="text-sm bg-teal-50 px-3 py-1 rounded-md">{comp_b_qty ?? "N/A"}</span>
                          </div>
                        )}
                        {assignment.comp_ratio_c !== null && (
                          <div className="flex items-center gap-4">
                            <label className="w-24 text-sm font-medium text-gray-700">Component C:</label>
                            <span className="text-sm bg-teal-50 px-3 py-1 rounded-md">{comp_c_qty ?? "N/A"}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Remarks</p>
                      <div className="space-y-4 mt-2">
                        {assignment.comp_ratio_a !== null && (
                          <div className="space-y-1">
                            <label className="text-xs font-medium text-gray-700">Component A</label>
                            <input
                              type="text"
                              value={remarks[assignment.id]?.comp_a_remarks ?? ""}
                              onChange={(e) => handleRemarksChange(assignment.id, "comp_a_remarks", e.target.value)}
                              className="w-full px-2 py-1 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 shadow-sm"
                              placeholder="Remarks for Component A"
                              required={comp_a_qty !== null}
                            />
                          </div>
                        )}
                        {assignment.comp_ratio_b !== null && (
                          <div className="space-y-1">
                            <label className="text-xs font-medium text-gray-700">Component B</label>
                            <input
                              type="text"
                              value={remarks[assignment.id]?.comp_b_remarks ?? ""}
                              onChange={(e) => handleRemarksChange(assignment.id, "comp_b_remarks", e.target.value)}
                              className="w-full px-2 py-1 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 shadow-sm"
                              placeholder="Remarks for Component B"
                              required={comp_b_qty !== null}
                            />
                          </div>
                        )}
                        {assignment.comp_ratio_c !== null && (
                          <div className="space-y-1">
                            <label className="text-xs font-medium text-gray-700">Component C</label>
                            <input
                              type="text"
                              value={remarks[assignment.id]?.comp_c_remarks ?? ""}
                              onChange={(e) => handleRemarksChange(assignment.id, "comp_c_remarks", e.target.value)}
                              className="w-full px-2 py-1 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 shadow-sm"
                              placeholder="Remarks for Component C"
                              required={comp_c_qty !== null}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div className="p-4 flex justify-end">
                <button
                  onClick={() => setIsTransportModalOpen(true)}
                  className={`px-4 py-2 text-white rounded-lg text-sm font-medium shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                    isDispatchEnabled() ? "bg-teal-600 hover:bg-teal-700" : "bg-gray-400 cursor-not-allowed"
                  }`}
                  disabled={!isDispatchEnabled()}
                >
                  <Truck className="h-4 w-4 inline-block mr-2" />
                  Dispatch Materials
                </button>
              </div>
            </div>

            {/* Transport Modal */}
            {isTransportModalOpen && (
              <div
                className="backdrop-blur-xl fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 p-4"
                onClick={() => setIsTransportModalOpen(false)}
              >
                <div
                  className="bg-white rounded-2xl shadow-2xl w-full max-w-lg sm:max-w-xl lg:max-w-4xl p-6 relative max-h-[90vh] overflow-y-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => setIsTransportModalOpen(false)}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 rounded-full"
                    aria-label="Close transport modal"
                  >
                    <X className="h-6 w-6" />
                  </button>
                  <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">Dispatch Materials</h3>
                  <div className="space-y-6">
                    {/* Transport Details */}
                    <div>
                      <h4 className="text-lg font-medium text-gray-800 mb-4">Transport Details</h4>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-2">
                            Transport Type <span className="text-red-500">*</span>
                          </label>
                          <select
                            value={transportData.transport_type_id}
                            onChange={(e) => handleTransportChange("transport_type_id", e.target.value)}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm bg-white shadow-sm transition-all duration-200"
                            disabled={loading.transportTypes}
                            required
                          >
                            <option value="">Select Transport Type</option>
                            {transportTypes.map((type) => (
                              <option key={type.id} value={type.id}>
                                {type.type}
                              </option>
                            ))}
                          </select>
                          {loading.transportTypes && <Loader2 className="h-5 w-5 text-teal-500 animate-spin mt-2" />}
                        </div>

                        {transportData.transport_type_id && (
                          <>
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-2">
                                {isOwnVehicle ? "Contract Provider" : "Logistics Provider"} <span className="text-red-500">*</span>
                              </label>
                              <SearchableDropdown
                                options={providers}
                                selectedValue={transportData.provider_id}
                                onSelect={(value) => handleTransportChange("provider_id", value)}
                                placeholder={`Select or enter ${isOwnVehicle ? "Contract" : "Logistics"} Provider`}
                                searchKeys={["provider_name"]}
                                label="Provider"
                                disabled={!transportData.transport_type_id}
                                loading={loading.providers}
                                allowNew={true}
                                onNewEntryChange={(value) => handleNewEntryDropdown("provider_id", value)}
                              />
                              {transportData.provider_id && !providers.some((p) => p.id == transportData.provider_id) && (
                                <div className="mt-4 space-y-4">
                                  <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-2">
                                      Provider Address
                                    </label>
                                    <input
                                      type="text"
                                      value={newEntryData.provider_address}
                                      onChange={(e) => handleNewEntryChange("provider_address", e.target.value)}
                                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm"
                                      placeholder="Enter Provider Address"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-2">
                                      Provider Mobile
                                    </label>
                                    <input
                                      type="text"
                                      value={newEntryData.provider_mobile}
                                      onChange={(e) => handleNewEntryChange("provider_mobile", e.target.value)}
                                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm"
                                      placeholder="Enter Provider Mobile"
                                    />
                                  </div>
                                </div>
                              )}
                            </div>

                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-2">
                                Vehicle <span className="text-red-500">*</span>
                              </label>
                              <SearchableDropdown
                                options={vehicles}
                                selectedValue={transportData.vehicle_id}
                                onSelect={(value) => handleTransportChange("vehicle_id", value)}
                                placeholder="Select or enter Vehicle"
                                searchKeys={["vehicle_name", "vehicle_number"]}
                                label="Vehicle"
                                loading={loading.vehicles}
                                allowNew={true}
                                onNewEntryChange={(value) => handleNewEntryDropdown("vehicle_id", value)}
                              />
                              {transportData.vehicle_id && !vehicles.some((v) => v.id == transportData.vehicle_id) && (
                                <div className="mt-4 space-y-4">
                                  <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-2">
                                      Vehicle Model
                                    </label>
                                    <input
                                      type="text"
                                      value={newEntryData.vehicle_model}
                                      onChange={(e) => handleNewEntryChange("vehicle_model", e.target.value)}
                                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm"
                                      placeholder="Enter Vehicle Model"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-2">
                                      Vehicle Number
                                    </label>
                                    <input
                                      type="text"
                                      value={newEntryData.vehicle_number}
                                      onChange={(e) => handleNewEntryChange("vehicle_number", e.target.value)}
                                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm"
                                      placeholder="Enter Vehicle Number"
                                    />
                                  </div>
                                </div>
                              )}
                            </div>

                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-2">
                                Driver <span className="text-red-500">*</span>
                              </label>
                              <SearchableDropdown
                                options={drivers}
                                selectedValue={transportData.driver_id}
                                onSelect={(value) => handleTransportChange("driver_id", value)}
                                placeholder="Select or enter Driver"
                                searchKeys={["driver_name", "driver_mobile"]}
                                label="Driver"
                                loading={loading.drivers}
                                allowNew={true}
                                onNewEntryChange={(value) => handleNewEntryDropdown("driver_id", value)}
                              />
                              {transportData.driver_id && !drivers.some((d) => d.id == transportData.driver_id) && (
                                <div className="mt-4 space-y-4">
                                  <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-2">
                                      Driver Mobile
                                    </label>
                                    <input
                                      type="text"
                                      value={newEntryData.driver_mobile}
                                      onChange={(e) => handleNewEntryChange("driver_mobile", e.target.value)}
                                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm"
                                      placeholder="Enter Driver Mobile"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-2">
                                      Driver Address
                                    </label>
                                    <input
                                      type="text"
                                      value={newEntryData.driver_address}
                                      onChange={(e) => handleNewEntryChange("driver_address", e.target.value)}
                                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm"
                                      placeholder="Enter Driver Address"
                                    />
                                  </div>
                                </div>
                              )}
                            </div>

                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-2">
                                Destination <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="text"
                                id="destination"
                                placeholder="Enter Destination"
                                value={transportData.destination}
                                onChange={(e) => handleTransportChange("destination", e.target.value)}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm"
                                required
                              />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              {!isOwnVehicle && (
                                <div>
                                  <label className="block text-xs font-medium text-gray-600 mb-2">
                                    Booking Expense <span className="text-red-500">*</span>
                                  </label>
                                  <input
                                    type="number"
                                    id="booking_expense"
                                    placeholder="Enter Booking Expense"
                                    value={transportData.booking_expense}
                                    onChange={(e) => handleTransportChange("booking_expense", e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm"
                                    step="0.01"
                                    min="0"
                                    required
                                  />
                                </div>
                              )}
                              <div>
                                <label className="block text-xs font-medium text-gray-600 mb-2">
                                  Travel Expense <span className="text-red-500">*</span>
                                </label>
                                <input
                                  type="number"
                                  id="travel_expense"
                                  placeholder="Enter Travel Expense"
                                  value={transportData.travel_expense}
                                  onChange={(e) => handleTransportChange("travel_expense", e.target.value)}
                                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm"
                                  step="0.01"
                                  min="0"
                                  required
                                />
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 flex justify-center space-x-4">
                    <button
                      onClick={() => setIsTransportModalOpen(false)}
                      className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg text-base font-medium shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDispatchSubmit}
                      className="px-6 py-3 bg-teal-600 text-white rounded-lg text-base font-medium shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      disabled={loading.submitting || !createdBy}
                    >
                      {loading.submitting ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin inline-block mr-2" />
                          Dispatching...
                        </>
                      ) : (
                        <>
                          <Truck className="h-5 w-5 inline-block mr-2" />
                          Dispatch Material
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <style>{`
        .select__control {
          border-color: #d1d5db;
          min-height: 38px;
        }
        .select__control--is-focused {
          border-color: #3b82f6;
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
        }
        .select__menu {
          z-index: 10;
        }
      `}</style>
    </div>
  );
};

export default MaterialDispatch;