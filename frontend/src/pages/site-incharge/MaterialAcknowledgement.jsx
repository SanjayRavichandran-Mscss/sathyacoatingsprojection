
import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Select from "react-select";

const MaterialAcknowledgement = () => {
  const [companies, setCompanies] = useState([]);
  const [allProjects, setAllProjects] = useState([]);
  const [projects, setProjects] = useState([]);
  const [sites, setSites] = useState([]);
  const [workDescriptions, setWorkDescriptions] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedSite, setSelectedSite] = useState(null);
  const [selectedWorkDescription, setSelectedWorkDescription] = useState(null);
  const [dispatchData, setDispatchData] = useState([]);
  const [acknowledgements, setAcknowledgements] = useState({});
  const [ackDetails, setAckDetails] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch companies
  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/project/companies");
      setCompanies(response.data || []);
    } catch (err) {
      setError("Failed to fetch companies");
      toast.error("Failed to fetch companies");
    } finally {
      setLoading(false);
    }
  };

  // Fetch projects
  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/project/projects-with-sites");
      setAllProjects(response.data || []);
    } catch (err) {
      setError("Failed to fetch projects");
      toast.error("Failed to fetch projects");
    } finally {
      setLoading(false);
    }
  };

  // Fetch work descriptions
  const fetchWorkDescriptions = async (site_id) => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/material/work-descriptions", {
        params: { site_id },
      });
      setWorkDescriptions(response.data.data || []);
    } catch (err) {
      setError("Failed to fetch work descriptions");
      toast.error("Failed to fetch work descriptions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
    fetchProjects();
  }, []);

  useEffect(() => {
    if (selectedCompany) {
      const filteredProjects = allProjects.filter((project) => project.company_id === selectedCompany.value);
      setProjects(filteredProjects);
      if (!filteredProjects.some((project) => project.project_id === (selectedProject?.value || ""))) {
        setSelectedProject(null);
        setSites([]);
        setSelectedSite(null);
        setWorkDescriptions([]);
        setSelectedWorkDescription(null);
        setDispatchData([]);
        setAckDetails({});
      }
    } else {
      setProjects([]);
      setSelectedProject(null);
      setSites([]);
      setSelectedSite(null);
      setWorkDescriptions([]);
      setSelectedWorkDescription(null);
      setDispatchData([]);
      setAckDetails({});
    }
  }, [selectedCompany, allProjects]);

  useEffect(() => {
    if (selectedProject) {
      const selectedProjectData = allProjects.find(project => project.project_id === selectedProject.value);
      setSites(selectedProjectData ? selectedProjectData.sites : []);
      setSelectedSite(null);
      setWorkDescriptions([]);
      setSelectedWorkDescription(null);
      setDispatchData([]);
      setAckDetails({});
    }
  }, [selectedProject, allProjects]);

  useEffect(() => {
    if (selectedSite) {
      fetchWorkDescriptions(selectedSite.value);
      setSelectedWorkDescription(null);
      setDispatchData([]);
      setAckDetails({});
    }
  }, [selectedSite]);

  useEffect(() => {
    if (selectedProject && selectedSite && selectedWorkDescription) {
      // Fetch dispatch details
      const fetchDispatchDetails = async () => {
        setLoading(true);
        try {
          const response = await axios.get(
            `http://localhost:5000/material/dispatch-details/?pd_id=${selectedProject.value}&site_id=${selectedSite.value}&desc_id=${selectedWorkDescription.value}`
          );

          // Create a map to store unique dispatches by their ID
          const dispatchMap = new Map();
          (response.data.data || []).forEach(dispatch => {
            if (!dispatchMap.has(dispatch.id)) {
              dispatchMap.set(dispatch.id, dispatch);
            }
          });

          // Convert map values back to array
          const uniqueDispatches = Array.from(dispatchMap.values());
          setDispatchData(uniqueDispatches);

          // Fetch acknowledgement details for each dispatch
          const ackPromises = uniqueDispatches.map(dispatch =>
            axios.get(
              `http://localhost:5000/site-incharge/acknowledgement-details?material_dispatch_id=${dispatch.id}`
            ).catch(err => ({ data: { data: [] } })) // Handle cases where no acknowledgement exists
          );

          const ackResponses = await Promise.all(ackPromises);
          const ackMap = {};
          ackResponses.forEach((ackResponse, index) => {
            const dispatchId = uniqueDispatches[index].id;
            const ackData = ackResponse.data.data[0] || null;
            ackMap[dispatchId] = ackData;
          });
          setAckDetails(ackMap);
          setError(null);
        } catch (err) {
          setError("Failed to fetch dispatch or acknowledgement details");
          toast.error("Failed to fetch dispatch or acknowledgement details");
        } finally {
          setLoading(false);
        }
      };
      fetchDispatchDetails();
    }
  }, [selectedProject, selectedSite, selectedWorkDescription]);

  const handleAcknowledge = async (dispatchId) => {
    const ackData = acknowledgements[dispatchId];
    if (!ackData) return;

    try {
      const response = await axios.post("http://localhost:5000/site-incharge/acknowledge-material", {
        material_dispatch_id: parseInt(dispatchId),
        overall_quantity: ackData.overall_quantity !== "" ? parseInt(ackData.overall_quantity) : null,
        remarks: ackData.remarks || null,
      });
      toast.success(response.data.message);
      // Refresh acknowledgement data for the specific dispatch
      const responseRefresh = await axios.get(
        `http://localhost:5000/site-incharge/acknowledgement-details?material_dispatch_id=${dispatchId}`
      );
      setAckDetails(prev => ({
        ...prev,
        [dispatchId]: responseRefresh.data.data[0] || null
      }));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save acknowledgement");
    }
  };

  const handleInputChange = (dispatchId, field, value) => {
    setAcknowledgements(prev => ({
      ...prev,
      [dispatchId]: {
        ...prev[dispatchId],
        [field]: value
      }
    }));
  };

  // Format item and ratios
  const formatItemAndRatios = (dispatch) => {
    const ratios = [dispatch.comp_ratio_a, dispatch.comp_ratio_b];
    if (dispatch.comp_ratio_c !== null) {
      ratios.push(dispatch.comp_ratio_c);
    }
    return `${dispatch.item_name} (${ratios.join(':')})`;
  };

  // Prepare options for react-select
  const companyOptions = companies.map(company => ({
    value: company.company_id,
    label: company.company_name
  }));

  const projectOptions = projects.map(project => ({
    value: project.project_id,
    label: project.project_name
  }));

  const siteOptions = sites.map(site => ({
    value: site.site_id,
    label: site.site_name
  }));

  const workDescriptionOptions = workDescriptions.map(desc => ({
    value: desc.desc_id,
    label: desc.desc_name
  }));

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Material Acknowledgement</h2>

      {/* Company, Project, Site, and Work Description Selection */}
      <div className="mb-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Select Company</label>
          <Select
            options={companyOptions}
            value={selectedCompany}
            onChange={setSelectedCompany}
            placeholder="Search Company..."
            isSearchable
            className="w-full"
            classNamePrefix="react-select"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Select Project</label>
          <Select
            options={projectOptions}
            value={selectedProject}
            onChange={setSelectedProject}
            placeholder="Search Project..."
            isSearchable
            isDisabled={!selectedCompany}
            className="w-full"
            classNamePrefix="react-select"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Select Site</label>
          <Select
            options={siteOptions}
            value={selectedSite}
            onChange={setSelectedSite}
            placeholder="Search Site..."
            isSearchable
            isDisabled={!selectedProject}
            className="w-full"
            classNamePrefix="react-select"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Select Work Description</label>
          <Select
            options={workDescriptionOptions}
            value={selectedWorkDescription}
            onChange={setSelectedWorkDescription}
            placeholder="Search Work Description..."
            isSearchable
            isDisabled={!selectedSite}
            className="w-full"
            classNamePrefix="react-select"
          />
        </div>
      </div>

      {loading && <div className="text-center text-gray-600 py-4">Loading...</div>}
      {error && <div className="text-center text-red-600 py-4">{error}</div>}

      {/* Dispatch Details */}
      {dispatchData.length > 0 && (
        <div className="space-y-4">
          {dispatchData.map(dispatch => {
            const ack = ackDetails[dispatch.id];
            return (
              <div key={dispatch.id} className="border rounded-lg p-4 bg-white shadow-md">
                <h3 className="text-lg font-medium text-gray-800 mb-2">
                  {formatItemAndRatios(dispatch)}
                </h3>

                {/* Quantities dispatched */}
                <div className="mb-3">
                  <h4 className="text-md font-medium text-gray-700 mb-1">Dispatched Quantities</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {dispatch.comp_a_qty !== null && (
                      <div>
                        <span className="font-medium">Comp A:</span> {dispatch.comp_a_qty}
                      </div>
                    )}
                    {dispatch.comp_b_qty !== null && (
                      <div>
                        <span className="font-medium">Comp B:</span> {dispatch.comp_b_qty}
                      </div>
                    )}
                    {dispatch.comp_c_qty !== null && (
                      <div>
                        <span className="font-medium">Comp C:</span> {dispatch.comp_c_qty}
                      </div>
                    )}
                  </div>
                </div>

                {/* Acknowledgement Section */}
                <div className="mt-4 border-t pt-3">
                  <h4 className="text-md font-semibold text-gray-700 mb-2">Acknowledge Receipt</h4>
                  {ack && ack.acknowledgement ? (
                    <div className="space-y-2 text-sm">
                      <p><strong>Overall Quantity:</strong> {ack.acknowledgement.overall_quantity || 'N/A'} ({ack.acknowledgement.remarks || 'No remarks'})</p>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-3">
                        <div>
                          <h5 className="text-sm font-medium text-gray-600 mb-1">Overall Quantity</h5>
                          <input
                            type="number"
                            placeholder="Overall Quantity"
                            value={acknowledgements[dispatch.id]?.overall_quantity || ""}
                            onChange={(e) => handleInputChange(dispatch.id, 'overall_quantity', e.target.value)}
                            className="w-full p-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-400"
                            min="0"
                          />
                        </div>
                        <div>
                          <h5 className="text-sm font-medium text-gray-600 mb-1">Remarks</h5>
                          <input
                            type="text"
                            placeholder="Remarks"
                            value={acknowledgements[dispatch.id]?.remarks || ""}
                            onChange={(e) => handleInputChange(dispatch.id, 'remarks', e.target.value)}
                            className="w-full p-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-400"
                          />
                        </div>
                      </div>
                      <button
                        onClick={() => handleAcknowledge(dispatch.id)}
                        className="mt-4 w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition duration-200"
                        disabled={!acknowledgements[dispatch.id] || (!acknowledgements[dispatch.id].overall_quantity && !acknowledgements[dispatch.id].remarks)}
                      >
                        Save Acknowledgement
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
      />
    </div>
  );
};

export default MaterialAcknowledgement;