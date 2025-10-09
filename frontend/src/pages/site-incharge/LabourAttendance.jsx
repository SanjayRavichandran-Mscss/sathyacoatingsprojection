import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Select from "react-select";
import { Save } from "lucide-react";
import { useParams } from "react-router-dom";

const LabourAttendance = () => {
  const { encodedUserId } = useParams();
  const [companies, setCompanies] = useState([]);
  const [projects, setProjects] = useState([]);
  const [sites, setSites] = useState([]);
  const [workDescriptions, setWorkDescriptions] = useState([]);
  const [assignedLabours, setAssignedLabours] = useState([]);
  const [shifts, setShifts] = useState({});
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedSite, setSelectedSite] = useState(null);
  const [selectedWorkDesc, setSelectedWorkDesc] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await axios.get("http://localhost:5000/project/companies");
        if (Array.isArray(response.data) && response.data.length > 0) {
          setCompanies(response.data);
        } else {
          setError("No companies found");
          toast.error("No companies found");
        }
      } catch (err) {
        setError("Failed to fetch companies");
        toast.error("Failed to fetch companies");
      }
    };
    fetchCompanies();
  }, []);

  useEffect(() => {
    if (selectedCompany) {
      const fetchProjectsAndSites = async () => {
        try {
          const response = await axios.get("http://localhost:5000/project/projects-with-sites");
          if (Array.isArray(response.data) && response.data.length > 0) {
            const filteredProjects = response.data.filter(project => project.company_id === selectedCompany.value);
            setProjects(filteredProjects);
            setSelectedProject(null);
            setSites([]);
            setSelectedSite(null);
            setWorkDescriptions([]);
            setSelectedWorkDesc(null);
            setAssignedLabours([]);
            setShifts({});
          } else {
            setError("No projects found");
            toast.error("No projects found");
          }
        } catch (err) {
          setError("Failed to fetch projects and sites");
          toast.error("Failed to fetch projects and sites");
        }
      };
      fetchProjectsAndSites();
    } else {
      setProjects([]);
      setSelectedProject(null);
      setSites([]);
      setSelectedSite(null);
      setWorkDescriptions([]);
      setSelectedWorkDesc(null);
      setAssignedLabours([]);
      setShifts({});
    }
  }, [selectedCompany]);

  useEffect(() => {
    if (selectedProject) {
      const selectedProjectData = projects.find(project => project.project_id === selectedProject.value);
      setSites(selectedProjectData ? selectedProjectData.sites : []);
      setSelectedSite(null);
      setWorkDescriptions([]);
      setSelectedWorkDesc(null);
      setAssignedLabours([]);
      setShifts({});
    }
  }, [selectedProject, projects]);

  useEffect(() => {
    if (selectedProject && selectedSite) {
      const fetchWorkDescriptions = async () => {
        setLoading(true);
        try {
          const response = await axios.get(`http://localhost:5000/site-incharge/work-descriptions?site_id=${selectedSite.value}`);
          setWorkDescriptions(response.data.data || []);
          setError(null);
        } catch (err) {
          toast.error("Failed to fetch work descriptions");
        } finally {
          setLoading(false);
        }
      };
      fetchWorkDescriptions();
    }
  }, [selectedProject, selectedSite]);

  useEffect(() => {
    if (selectedProject && selectedSite && selectedWorkDesc) {
      const fetchLabourAttendance = async () => {
        setLoading(true);
        try {
          const response = await axios.get(
            `http://localhost:5000/site-incharge/labour-attendance?project_id=${selectedProject.value}&site_id=${selectedSite.value}&desc_id=${selectedWorkDesc.value}&entry_date=${selectedDate}`
          );
          setAssignedLabours(response.data.data || []);
          setShifts({});
          setError(null);
        } catch (err) {
          toast.error("Failed to fetch labour attendance");
        } finally {
          setLoading(false);
        }
      };
      fetchLabourAttendance();
    }
  }, [selectedProject, selectedSite, selectedWorkDesc, selectedDate]);

  const handleShiftChange = (id, value) => {
    setShifts(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSaveAttendance = async () => {
    if (!selectedCompany || !selectedProject || !selectedSite || !selectedWorkDesc || !selectedDate) {
      toast.error("Please fill all required fields");
      return;
    }

    const attendanceData = assignedLabours
      .filter(labour => !labour.shift && shifts[labour.id] && parseFloat(shifts[labour.id]) > 0)
      .map(labour => ({
        labour_assignment_id: labour.id,
        entry_date: selectedDate,
        shift: parseFloat(shifts[labour.id])
      }));

    if (attendanceData.length === 0) {
      toast.error("Please enter a positive shift for at least one labour without existing attendance");
      return;
    }

    try {
      setSubmitting(true);
      if (!encodedUserId) {
        toast.error("User ID is missing from URL");
        return;
      }
      let user_id;
      try {
        user_id = atob(encodedUserId);
        if (!/^\d+$/.test(user_id)) throw new Error();
      } catch {
        toast.error("Invalid User ID in URL");
        return;
      }

      const payload = {
        attendance_data: attendanceData,
        created_by: parseInt(user_id)
      };
      console.log('Sending payload:', payload); // Debug log
      const response = await axios.post("http://localhost:5000/site-incharge/save-labour-attendance", payload);
      toast.success(response.data.message);
      setShifts({});
      // Refresh attendance data
      const responseRefresh = await axios.get(
        `http://localhost:5000/site-incharge/labour-attendance?project_id=${selectedProject.value}&site_id=${selectedSite.value}&desc_id=${selectedWorkDesc.value}&entry_date=${selectedDate}`
      );
      setAssignedLabours(responseRefresh.data.data || []);
    } catch (err) {
      console.error('Error saving labour attendance:', err.response?.data);
      toast.error(err.response?.data?.message || "Failed to save labour attendance");
    } finally {
      setSubmitting(false);
    }
  };

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

  const workDescOptions = workDescriptions.map(desc => ({
    value: desc.desc_id,
    label: desc.desc_name
  }));

  return (
    <div className="min-h-screen bg-gray-100 p-4 flex flex-col items-center">
      <div className="w-full max-w-md">
        <h1 className="text-xl font-bold text-gray-900 mb-4">Labour Attendance</h1>

        <div className="mb-4 space-y-4">
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
              options={workDescOptions}
              value={selectedWorkDesc}
              onChange={setSelectedWorkDesc}
              placeholder="Search Work Description..."
              isSearchable
              isDisabled={loading || !selectedProject || !selectedSite}
              className="w-full"
              classNamePrefix="react-select"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full p-2 border rounded-lg text-sm"
            />
          </div>
        </div>

        {loading && <div className="text-center py-6 text-sm text-gray-500">Loading...</div>}
        {error && <div className="text-center py-6 text-sm text-red-600">{error}</div>}

        {assignedLabours.length > 0 && (
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Assigned Labours</h2>
            <div className="space-y-4">
              {assignedLabours.map(labour => (
                <div key={labour.id} className="flex items-center justify-between p-2 border rounded-lg bg-white shadow-sm">
                  <span className="text-sm text-gray-700">{labour.emp_id} - {labour.full_name}</span>
                  {labour.shift ? (
                    <span className="text-sm text-gray-700">{labour.shift}</span>
                  ) : (
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      value={shifts[labour.id] || ''}
                      onChange={(e) => handleShiftChange(labour.id, e.target.value)}
                      placeholder="Shift"
                      className="w-20 p-1 border rounded-lg text-sm"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={handleSaveAttendance}
          className="w-full p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center justify-center"
          disabled={submitting}
        >
          <Save size={14} className="mr-2" />
          Save Attendance
        </button>
      </div>

      <ToastContainer
        position="top-center"
        autoClose={2500}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
      />
    </div>
  );
};

export default LabourAttendance;