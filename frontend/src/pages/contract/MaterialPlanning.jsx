import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { PlusCircle, Trash2, Loader2, CheckCircle } from "lucide-react";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";

const MaterialPlanning = ({
  selectedCompany,
  selectedProject,
  selectedSite,
  selectedWorkDesc,
  existingBudget,
  onTotalCostChange,
  onMaterialsChange,
}) => {
  const [materials, setMaterials] = useState([]);
  const [uoms, setUoms] = useState([]);
  const [materialAssignments, setMaterialAssignments] = useState({});
  const [existingAssignments, setExistingAssignments] = useState([]);
  const [loading, setLoading] = useState({
    materials: false,
    uoms: false,
    assignedMaterials: false,
    submitting: false,
  });
  const [error, setError] = useState(null);
  const [addingMaterial, setAddingMaterial] = useState(false);
  const [currentDescId, setCurrentDescId] = useState(null);
  const [currentMatIndex, setCurrentMatIndex] = useState(null);
  const [materialTotalCost, setMaterialTotalCost] = useState(0);
  const [materialBudgetPercentage, setMaterialBudgetPercentage] = useState(0);

  // Fetch materials
  const fetchMaterials = async () => {
    try {
      setLoading((prev) => ({ ...prev, materials: true }));
      const response = await axios.get("http://localhost:5000/material/materials");
      setMaterials(Array.isArray(response.data?.data) ? response.data.data : []);
    } catch (error) {
      console.error("Error fetching materials:", error);
      setError("Failed to load materials. Please try again.");
      setMaterials([]);
    } finally {
      setLoading((prev) => ({ ...prev, materials: false }));
    }
  };

  // Fetch UOMs
  const fetchUoms = async () => {
    try {
      setLoading((prev) => ({ ...prev, uoms: true }));
      const response = await axios.get("http://localhost:5000/material/uom");
      setUoms(Array.isArray(response.data?.data) ? response.data.data : []);
    } catch (error) {
      console.error("Error fetching UOMs:", error);
      setError("Failed to load UOMs. Please try again.");
    } finally {
      setLoading((prev) => ({ ...prev, uoms: false }));
    }
  };

  // Fetch assigned materials
  const fetchAssignedMaterials = async (site_id, desc_id) => {
    try {
      setLoading((prev) => ({ ...prev, assignedMaterials: true }));
      const response = await axios.get(
        `http://localhost:5000/material/assigned-materials?site_id=${site_id}&desc_id=${desc_id}`
      );
      const assignedMaterials = Array.isArray(response.data?.data) ? response.data.data : [];
      setExistingAssignments(assignedMaterials);
      setMaterialAssignments({
        [desc_id]: [
          {
            item_id: "",
            uom_id: "",
            quantity: "",
            comp_ratio_a: "",
            comp_ratio_b: "",
            comp_ratio_c: "",
            rate: "",
          },
        ],
      });
    } catch (error) {
      console.error("Error fetching assigned materials:", error);
      setError("Failed to load assigned materials. Please try again.");
      setExistingAssignments([]);
      setMaterialAssignments({
        [desc_id]: [
          {
            item_id: "",
            uom_id: "",
            quantity: "",
            comp_ratio_a: "",
            comp_ratio_b: "",
            comp_ratio_c: "",
            rate: "",
          },
        ],
      });
    } finally {
      setLoading((prev) => ({ ...prev, assignedMaterials: false }));
    }
  };

  useEffect(() => {
    fetchMaterials();
    fetchUoms();
    if (selectedSite?.value && selectedWorkDesc?.value) {
      fetchAssignedMaterials(selectedSite.value, selectedWorkDesc.value);
    }
  }, [selectedSite, selectedWorkDesc]);

  // Calculate total cost for a single material
  const calculateTotalCost = (mat) => {
    const quantity = parseFloat(mat.quantity) || 0;
    const rate = parseFloat(mat.rate) || 0;
    return (quantity * rate).toFixed(2);
  };

  // Calculate overall cost for all material assignments
  const calculateOverallCost = () => {
    const materials = materialAssignments[selectedWorkDesc?.value] || [];
    return materials
      .reduce((total, mat) => {
        const cost = parseFloat(calculateTotalCost(mat)) || 0;
        return total + cost;
      }, 0)
      .toFixed(2);
  };

  // Update total cost and budget percentage
  useEffect(() => {
    if (selectedWorkDesc?.value) {
      const totalCost = calculateOverallCost();
      setMaterialTotalCost(Number(totalCost) || 0);
      if (existingBudget?.total_budget_value) {
        const percentage = (totalCost / existingBudget.total_budget_value) * 100;
        setMaterialBudgetPercentage(percentage);
      } else {
        setMaterialBudgetPercentage(0);
      }
      if (onTotalCostChange) {
        onTotalCostChange(totalCost);
      }
      if (onMaterialsChange) {
        const materials = materialAssignments[selectedWorkDesc.value] || [];
        onMaterialsChange(materials);
      }
    }
  }, [materialAssignments, selectedWorkDesc, existingBudget, onTotalCostChange, onMaterialsChange]);

  const handleMaterialChange = (desc_id, matIndex, e) => {
    const { name, value } = e.target;
    setMaterialAssignments((prev) => ({
      ...prev,
      [desc_id]: (prev[desc_id] || []).map((mat, i) =>
        i === matIndex ? { ...mat, [name]: value } : mat
      ),
    }));
    setError(null);
  };

  const handleItemSelect = (desc_id, matIndex, selectedOption) => {
    const value = selectedOption && selectedOption.value !== "N/A" ? selectedOption.value : "";
    setMaterialAssignments((prev) => ({
      ...prev,
      [desc_id]: (prev[desc_id] || []).map((mat, i) =>
        i === matIndex ? { ...mat, item_id: value } : mat
      ),
    }));
    if (!value) {
      setError(`Please select a valid material for Row ${matIndex + 1}.`);
    } else {
      setError(null);
    }
  };

  const handleAddMaterial = (desc_id) => {
    setMaterialAssignments((prev) => ({
      ...prev,
      [desc_id]: [
        ...(prev[desc_id] || []),
        {
          item_id: "",
          uom_id: "",
          quantity: "",
          comp_ratio_a: "",
          comp_ratio_b: "",
          comp_ratio_c: "",
          rate: "",
        },
      ],
    }));
    setError(null);
  };

  const handleRemoveMaterial = (desc_id, matIndex) => {
    setMaterialAssignments((prev) => {
      const materials = prev[desc_id] || [];
      if (materials.length <= 1) {
        setError(`At least one material assignment is required.`);
        return prev;
      }
      return {
        ...prev,
        [desc_id]: materials.filter((_, i) => i !== matIndex),
      };
    });
  };

  const calculateCompQuantities = (mat) => {
    const quantity = parseFloat(mat.quantity) || 0;
    const comp_a = parseInt(mat.comp_ratio_a) || 0;
    const comp_b = parseInt(mat.comp_ratio_b) || 0;
    const comp_c = parseInt(mat.comp_ratio_c) || 0;
    const total_parts = comp_a + comp_b + comp_c;
    if (total_parts === 0) {
      return { comp_a_qty: 0, comp_b_qty: 0, comp_c_qty: 0 };
    }
    return {
      comp_a_qty: ((comp_a / total_parts) * quantity).toFixed(2),
      comp_b_qty: ((comp_b / total_parts) * quantity).toFixed(2),
      comp_c_qty: ((comp_c / total_parts) * quantity).toFixed(2),
    };
  };

  const handleAddNewMaterial = async (inputValue, desc_id, matIndex) => {
    if (!inputValue.trim()) {
      setError("Material name is required.");
      return;
    }

    try {
      setAddingMaterial(true);
      const response = await axios.post("http://localhost:5000/material/add-material", {
        item_name: inputValue.trim(),
      });

      if (response.data?.status === "success" && response.data?.data?.item_id) {
        await fetchMaterials();
        const newItemId = response.data.data.item_id;
        setMaterialAssignments((prev) => ({
          ...prev,
          [desc_id]: (prev[desc_id] || []).map((mat, i) =>
            i === matIndex ? { ...mat, item_id: newItemId } : mat
          ),
        }));

        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Material Added!",
          text: "New material has been added and selected.",
          timer: 1500,
          showConfirmButton: false,
          toast: true,
          background: "#ecfdf5",
          iconColor: "#10b981",
        });
      } else {
        setError(response.data?.message || "Failed to add material.");
      }
    } catch (error) {
      console.error("Error adding material:", error);
      setError(error.response?.data?.message || "Failed to add material.");
    } finally {
      setAddingMaterial(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading((prev) => ({ ...prev, submitting: true }));
      setError(null);

      if (!selectedCompany?.value) {
        setError("Please select a company.");
        return;
      }
      if (!selectedProject?.value) {
        setError("Please select a project.");
        return;
      }
      if (!selectedSite?.value) {
        setError("Please select a site.");
        return;
      }
      if (!selectedWorkDesc?.value) {
        setError("Please select a work description.");
        return;
      }

      const validationErrors = [];
      const materialCounts = {};
      const materials = materialAssignments[selectedWorkDesc.value] || [];

      // Count occurrences of each item_id
      materials.forEach((row) => {
        if (row.item_id && row.item_id !== "N/A" && row.item_id.trim() !== "") {
          materialCounts[row.item_id] = (materialCounts[row.item_id] || 0) + 1;
        }
      });

      // Validate for three or more identical materials
      Object.entries(materialCounts).forEach(([item_id, count]) => {
        if (count >= 3) {
          const materialName = materials.find((mat) => mat.item_id === item_id)?.item_id || item_id;
          validationErrors.push(
            `Material ${materialName} is assigned ${count} times. A maximum of two assignments per material is allowed.`
          );
        }
      });

      // Validate other fields
      materials.forEach((row, index) => {
        if (!row.item_id || row.item_id === "N/A" || row.item_id.trim() === "") {
          validationErrors.push(`Row ${index + 1}: Material is required and must be a valid material ID`);
        }
        if (!row.uom_id) {
          validationErrors.push(`Row ${index + 1}: Unit of Measure is required`);
        }
        if (!row.quantity) {
          validationErrors.push(`Row ${index + 1}: Overall Quantity is required`);
        } else if (isNaN(row.quantity) || parseInt(row.quantity) <= 0) {
          validationErrors.push(`Row ${index + 1}: Overall Quantity must be a positive integer`);
        }
        if (!row.rate) {
          validationErrors.push(`Row ${index + 1}: Rate is required`);
        } else if (isNaN(row.rate) || parseFloat(row.rate) < 0) {
          validationErrors.push(`Row ${index + 1}: Rate must be a non-negative number`);
        }
        if (row.comp_ratio_a && (isNaN(row.comp_ratio_a) || parseInt(row.comp_ratio_a) < 0)) {
          validationErrors.push(`Row ${index + 1}: Component Ratio A must be a non-negative integer`);
        }
        if (row.comp_ratio_b && (isNaN(row.comp_ratio_b) || parseInt(row.comp_ratio_b) < 0)) {
          validationErrors.push(`Row ${index + 1}: Component Ratio B must be a non-negative integer`);
        }
        if (row.comp_ratio_c && (isNaN(row.comp_ratio_c) || parseInt(row.comp_ratio_c) < 0)) {
          validationErrors.push(`Row ${index + 1}: Component Ratio C must be a non-negative integer`);
        }
      });

      if (validationErrors.length > 0) {
        setError(validationErrors.join("<br />"));
        return;
      }

      const payload = materials.map((row) => ({
        pd_id: selectedProject.value,
        site_id: selectedSite.value,
        item_id: row.item_id,
        uom_id: parseInt(row.uom_id),
        quantity: parseInt(row.quantity),
        desc_id: String(selectedWorkDesc.value),
        comp_ratio_a: row.comp_ratio_a ? parseInt(row.comp_ratio_a) : null,
        comp_ratio_b: row.comp_ratio_b ? parseInt(row.comp_ratio_b) : null,
        comp_ratio_c: row.comp_ratio_c ? parseInt(row.comp_ratio_c) : null,
        rate: parseFloat(row.rate),
        materialTotalCost: materialTotalCost.toFixed(2),
        materialBudgetPercentage: materialBudgetPercentage.toFixed(2),
        overhead_type: "materials",
      }));

      if (payload.length === 0) {
        setError("Please add at least one material assignment.");
        return;
      }

      await axios.post("http://localhost:5000/material/assign-material", payload);

      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Materials Assigned Successfully!",
        showConfirmButton: false,
        timer: 2000,
        toast: true,
        background: "#ecfdf5",
        iconColor: "#10b981",
      });

      setMaterialAssignments({
        [selectedWorkDesc.value]: [
          {
            item_id: "",
            uom_id: "",
            quantity: "",
            comp_ratio_a: "",
            comp_ratio_b: "",
            comp_ratio_c: "",
            rate: "",
          },
        ],
      });
      await fetchAssignedMaterials(selectedSite.value, selectedWorkDesc.value);
    } catch (error) {
      console.error("Error submitting material assignments:", error);
      const errorMessage = error.response?.data?.message || "Failed to assign materials. Please check the data and try again.";
      const detailedErrors = error.response?.data?.errors ? error.response.data.errors.join("<br />") : errorMessage;
      await Swal.fire({
        icon: "error",
        title: "Assignment Failed",
        html: detailedErrors,
        confirmButtonText: "OK",
        confirmButtonColor: "#d33",
        background: "#fef2f2",
        iconColor: "#dc2626",
      });
      setError(detailedErrors);
    } finally {
      setLoading((prev) => ({ ...prev, submitting: false }));
    }
  };

  const isFormEnabled = selectedCompany && selectedProject && selectedSite && selectedWorkDesc;

  const materialOptions = Array.isArray(materials)
    ? materials.map((material) => ({
        value: material.item_id,
        label: material.item_name,
      }))
    : [];

  const uomOptions = Array.isArray(uoms)
    ? uoms.map((uom) => ({
        value: uom.uom_id,
        label: uom.uom_name,
      }))
    : [];

  const CustomCreateLabel = ({ inputValue }) => (
    <div className="flex items-center justify-between px-2 py-1">
      <span>Add "{inputValue}"</span>
      <button
        type="button"
        className="ml-2 px-2 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
        onClick={() => handleAddNewMaterial(inputValue, currentDescId, currentMatIndex)}
        disabled={addingMaterial}
      >
        {addingMaterial ? <Loader2 className="h-4 w-4 animate-spin" /> : "Add"}
      </button>
    </div>
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {(loading.materials || loading.uoms || loading.assignedMaterials) ? (
          <div className="flex justify-center items-center py-16">
            <div className="flex flex-col items-center space-y-3">
              <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
              <p className="text-gray-600">Loading resources...</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="">
            <div className="mb-6">
              {error && (
                <div
                  className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded text-sm"
                  dangerouslySetInnerHTML={{ __html: error }}
                />
              )}
            </div>

            {selectedWorkDesc && (
              <div className="space-y-6">
                {existingAssignments.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Previously Assigned Materials</h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full bg-white border border-gray-200 rounded-md">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Material</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">UOM</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Quantity</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Rate (₹)</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Total Cost (₹)</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Comp Ratio A (Qty)</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Comp Ratio B (Qty)</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Comp Ratio C (Qty)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {existingAssignments.map((mat, index) => {
                            const { comp_a_qty, comp_b_qty, comp_c_qty } = calculateCompQuantities(mat);
                            const totalCost = calculateTotalCost(mat);
                            const materialName = materials.find((m) => m.item_id === mat.item_id)?.item_name || mat.item_id;
                            const uomName = uoms.find((u) => u.uom_id === mat.uom_id)?.uom_name || "N/A";
                            return (
                              <tr key={index} className="border-t border-gray-200">
                                <td className="px-4 py-2 text-sm text-gray-600">{materialName}</td>
                                <td className="px-4 py-2 text-sm text-gray-600">{uomName}</td>
                                <td className="px-4 py-2 text-sm text-gray-600">{mat.quantity}</td>
                                <td className="px-4 py-2 text-sm text-gray-600">{mat.rate}</td>
                                <td className="px-4 py-2 text-sm text-gray-600">{totalCost}</td>
                                <td className="px-4 py-2 text-sm text-gray-600">{mat.comp_ratio_a || 0} ({comp_a_qty})</td>
                                <td className="px-4 py-2 text-sm text-gray-600">{mat.comp_ratio_b || 0} ({comp_b_qty})</td>
                                <td className="px-4 py-2 text-sm text-gray-600">{mat.comp_ratio_c || 0} ({comp_c_qty})</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">New Material Assignments</h3>
                  {(materialAssignments[selectedWorkDesc.value] || []).map((mat, matIndex) => {
                    const { comp_a_qty, comp_b_qty, comp_c_qty } = calculateCompQuantities(mat);
                    const totalCost = calculateTotalCost(mat);
                    return (
                      <div key={matIndex} className="border-b pb-4 last:border-b-0">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Material #{matIndex + 1}
                            </label>
                            <CreatableSelect
                              options={materialOptions}
                              value={materialOptions.find((opt) => opt.value === mat.item_id) || null}
                              onChange={(opt) => {
                                setCurrentDescId(selectedWorkDesc.value);
                                setCurrentMatIndex(matIndex);
                                handleItemSelect(selectedWorkDesc.value, matIndex, opt);
                              }}
                              formatCreateLabel={(inputValue) => (
                                <CustomCreateLabel inputValue={inputValue} />
                              )}
                              isSearchable
                              isClearable
                              isDisabled={!isFormEnabled || addingMaterial}
                              className="text-sm"
                              classNamePrefix="select"
                              placeholder="Select or type material..."
                            />
                            <div className="mt-2 space-y-2">
                              <div className="flex items-center gap-2">
                                <label className="text-sm text-gray-600 w-28">Comp Ratio A:</label>
                                <input
                                  type="number"
                                  name="comp_ratio_a"
                                  value={mat.comp_ratio_a}
                                  onChange={(e) => handleMaterialChange(selectedWorkDesc.value, matIndex, e)}
                                  className="w-20 px-2 py-1 border border-gray-300 rounded-md text-sm disabled:bg-gray-100"
                                  disabled={!isFormEnabled}
                                  min="0"
                                />
                                <span className="text-sm text-gray-600">Qty: {comp_a_qty}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <label className="text-sm text-gray-600 w-28">Comp Ratio B:</label>
                                <input
                                  type="number"
                                  name="comp_ratio_b"
                                  value={mat.comp_ratio_b}
                                  onChange={(e) => handleMaterialChange(selectedWorkDesc.value, matIndex, e)}
                                  className="w-20 px-2 py-1 border border-gray-300 rounded-md text-sm disabled:bg-gray-100"
                                  disabled={!isFormEnabled}
                                  min="0"
                                />
                                <span className="text-sm text-gray-600">Qty: {comp_b_qty}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <label className="text-sm text-gray-600 w-28">Comp Ratio C:</label>
                                <input
                                  type="number"
                                  name="comp_ratio_c"
                                  value={mat.comp_ratio_c}
                                  onChange={(e) => handleMaterialChange(selectedWorkDesc.value, matIndex, e)}
                                  className="w-20 px-2 py-1 border border-gray-300 rounded-md text-sm disabled:bg-gray-100"
                                  disabled={!isFormEnabled}
                                  min="0"
                                />
                                <span className="text-sm text-gray-600">Qty: {comp_c_qty}</span>
                              </div>
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Unit of Measure
                            </label>
                            <Select
                              options={uomOptions}
                              value={uomOptions.find((opt) => opt.value === mat.uom_id) || null}
                              onChange={(opt) =>
                                handleMaterialChange(selectedWorkDesc.value, matIndex, {
                                  target: { name: "uom_id", value: opt ? opt.value : "" },
                                })
                              }
                              isSearchable
                              isClearable
                              isDisabled={!isFormEnabled}
                              className="text-sm"
                              classNamePrefix="select"
                              placeholder="Select UOM..."
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Overall Quantity
                            </label>
                            <input
                              type="number"
                              name="quantity"
                              value={mat.quantity}
                              onChange={(e) => handleMaterialChange(selectedWorkDesc.value, matIndex, e)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm disabled:bg-gray-100"
                              required
                              disabled={!isFormEnabled}
                              min="1"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Rate per Quantity
                            </label>
                            <input
                              type="number"
                              name="rate"
                              value={mat.rate}
                              onChange={(e) => handleMaterialChange(selectedWorkDesc.value, matIndex, e)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm disabled:bg-gray-100"
                              required
                              disabled={!isFormEnabled}
                              min="0"
                              step="0.01"
                            />
                            <div className="mt-2 text-sm text-gray-600">
                              Overall Cost: ₹{calculateTotalCost(mat)}
                            </div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveMaterial(selectedWorkDesc.value, matIndex)}
                          disabled={(materialAssignments[selectedWorkDesc.value] || []).length <= 1 || !isFormEnabled}
                          className={`mt-2 p-1.5 rounded-md ${
                            (materialAssignments[selectedWorkDesc.value] || []).length <= 1 || !isFormEnabled
                              ? "text-gray-400 cursor-not-allowed"
                              : "text-red-600 hover:bg-red-50"
                          }`}
                          title={
                            (materialAssignments[selectedWorkDesc.value] || []).length <= 1
                              ? "At least one material is required"
                              : "Remove this entry"
                          }
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    );
                  })}
                  <div className="mt-4">
                    <div className="text-sm text-gray-600 mb-2">
                      Total Material Cost: ₹{calculateOverallCost()}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleAddMaterial(selectedWorkDesc.value)}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400"
                      disabled={!isFormEnabled}
                    >
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Add Material
                    </button>
                  </div>
                  {/* Total Material Cost and Budget Percentage Section */}
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">Total Material Cost:</span>
                      <span className="text-lg font-semibold">Rs. {materialTotalCost.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Budget Percentage:</span>
                      <span className="text-lg font-semibold">{materialBudgetPercentage.toFixed(2)}%</span>
                    </div>
                  </div>
                  {/* Save Material Overhead Button */}
                  <div className="flex justify-end mt-4">
                    <button
                      type="submit"
                      disabled={loading.submitting || !isFormEnabled}
                      className="inline-flex items-center px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400"
                    >
                      {loading.submitting ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Save Material Overhead
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </form>
        )}
      </div>

      <style jsx>{`
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

export default MaterialPlanning;