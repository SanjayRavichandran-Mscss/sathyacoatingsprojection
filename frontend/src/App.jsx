
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppLayout from './components/AppLayout';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import MaterialPlanning from './pages/contract/MaterialPlanning';
import MaterialDispatch from './pages/contract/MaterialDispatch';
import ClientMasterCreation from './pages/contract/ClientMasterCreation';
import ProjectList from './pages/contract/ProjectList';
import POMasterCreation from './pages/contract/POMasterCreation';
import POMasterMain from './pages/contract/POMasterMain';
import WorkForcePlanning from './pages/contract/WorkForcePlanning';
import ProjectProjection from './pages/contract/ProjectProjection';
import AdditionalCash from './pages/contract/AdditionalCash';
import DashboardMain from './pages/dashboard/DashBoardMain';
import EmployeeDetails from './pages/contract/EmployeeDetails';
import DispatchedMaterials from './pages/contract/DispatchedMaterials';
import MaterialAcknowledgement from './pages/site-incharge/MaterialAcknowledgement';
import MaterialUsage from './pages/site-incharge/MaterialUsage';
import BudgetExpenseEntry from './pages/site-incharge/BudgetExpenseEntry';
import WorkCompletionEntry from './pages/site-incharge/WorkCompletionEntry';
import LabourAssign from './pages/site-incharge/LabourAssign';
import LabourAttendance from './pages/site-incharge/LabourAttendance';
import AdditionalExpense from './pages/site-incharge/AdditionalExpense';
import SupplyClientMasterCreation from './pages/supply/SupplyClientMasterCreation';
import SupplyMaterialPlanning from './pages/supply/SupplyMaterialPlanning';
import ProjectProjectionOld from './pages/contract/ProjectProjectionOld';

const Placeholder = ({ title }) => (
  <div className="p-4">
    <h1 className="text-xl font-semibold">{title}</h1>
    <p className="text-gray-600 mt-2">We are in the process of resolving this.</p>
  </div>
);

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login page at "/" WITHOUT Menubar/Sidebar */}
        <Route path="/" element={<Login />} />

        {/* App shell for all other routes */}
        <Route element={<AppLayout />}>
          {/* Dashboard (use a different path than "/" now) */}
          <Route 
            path="/admin/dashboard/:encodedUserId" 
            element={
              <ProtectedRoute role="admin">
                <DashboardMain />
              </ProtectedRoute>
            } 
          />
          
          <Route path="/admin/dashboard/reports/:encodedUserId" element={<ProtectedRoute role="admin"><Placeholder title="Dashboard Reports" /></ProtectedRoute>} />

          {/* Contracts */}
          <Route path="/admin/contracts/:encodedUserId" element={<ProtectedRoute role="admin"><Placeholder title="Contract Management" /></ProtectedRoute>} />
          
          <Route 
              path="/admin/contracts/master-client/:encodedUserId" 
              element={
              <ProtectedRoute role="admin">
                <ClientMasterCreation />
              </ProtectedRoute>
              } 
          />
          
          <Route 
              path="/admin/contracts/master-po/:encodedUserId" 
              element={
                <ProtectedRoute role="admin">
                  {/* <POMasterCreation /> */}
                  <POMasterMain />
                </ProtectedRoute>
              } 
          />

          <Route 
              path="/admin/contracts/projects/:encodedUserId" 
              element={
                <ProtectedRoute role="admin">
                  <ProjectList />
                </ProtectedRoute>
              } 
          />

          <Route 
              path="/admin/contracts/projects/projections/:encodedUserId" 
              element={
                <ProtectedRoute role="admin">
                 <ProjectProjection />
                </ProtectedRoute>
              } 
          />

          <Route 
              path="/admin/contracts/projects/project-planning/:encodedUserId" 
              element={
                <ProtectedRoute role="admin">
                 <ProjectProjectionOld />
                </ProtectedRoute>
              } 
          />

          

          <Route 
              path="/admin/contracts/projects/work-force-planning/:encodedUserId" 
              element={
                <ProtectedRoute role="admin">
                  <WorkForcePlanning />
                </ProtectedRoute>
              } 
          />

          <Route 
              path="/admin/contracts/projects/material-planning/:encodedUserId" 
              element={
                <ProtectedRoute role="admin">
                  <MaterialPlanning />
                </ProtectedRoute>
              } 
          />
          <Route 
              path="/admin/contracts/projects/material-dispatch/:encodedUserId" 
              element={
                <ProtectedRoute role="admin">
                  <MaterialDispatch />
                </ProtectedRoute>
              } 
          />

          <Route 
              path="/admin/contracts/projects/employee-details/:encodedUserId" 
              element={
                <ProtectedRoute role="admin">
                  <EmployeeDetails />
                </ProtectedRoute>
              } 
          />

          <Route 
              path="/admin/contracts/projects/additional-cash/:encodedUserId" 
              element={
                <ProtectedRoute role="admin">
                  <AdditionalCash />
                </ProtectedRoute>
              } 
          />

          <Route 
              path="/admin/contracts/projects/dispatched-materials/:encodedUserId" 
              element={
                <ProtectedRoute role="admin">
                  <DispatchedMaterials />
                </ProtectedRoute>
              } 
          />

          {/* Supply */}
          <Route path="/supply" element={<Placeholder title="Supply Management" />} />

          <Route path="/admin/supply/master-client/:encodedUserId" 
              element={
              <ProtectedRoute role="admin">
                <SupplyClientMasterCreation />
              </ProtectedRoute>
              }  
          />

          <Route 
              path="/admin/supply/master-po/:encodedUserId" 
              element={
                <ProtectedRoute role="admin">
                    <POMasterMain />
                </ProtectedRoute>} 
          />

          <Route 
              path="/admin/supply/master-po/:encodedUserId" 
              element={
                <ProtectedRoute role="admin">
                    <POMasterMain />
                </ProtectedRoute>} 
          />
          
          <Route 
              path="/admin/supply/material-planning/:encodedUserId"
              element={
                <ProtectedRoute role="admin">
                  <SupplyMaterialPlanning />
                </ProtectedRoute>
              }
          />
          <Route 
              path="/admin/supply/material-dispatch/:encodedUserId"
              element={
                <ProtectedRoute role="admin">
                  <Placeholder title="Supply Material Dispatch" />
                </ProtectedRoute>
              }
          />

          <Route 
              path="/admin/supply/supplied-materials/:encodedUserId"
              element={
                <ProtectedRoute role="admin">
                  <Placeholder title="Supplied Materials" />
                </ProtectedRoute>
              }
          />
          <Route path="/supply/stock" element={<Placeholder title="Stock" />} />
          <Route path="/supply/vendors" element={<Placeholder title="Vendors" />} />
          <Route path="/supply/po" element={<Placeholder title="Purchase Orders" />} />

          {/* Finance */}
          <Route path="/finance" element={<Placeholder title="Finance Management" />} />
          <Route path="/finance/invoices" element={<Placeholder title="Invoices" />} />
          <Route path="/finance/payments" element={<Placeholder title="Payments" />} />
          <Route path="/finance/reports" element={<Placeholder title="Finance Reports" />} />

          {/* Resources */}
          <Route path="/resources" element={<Placeholder title="Resource Management" />} />
          <Route path="/resources/staff" element={<Placeholder title="Staff" />} />
          <Route path="/resources/assign" element={<Placeholder title="Assign" />} />
          <Route path="/resources/utilization" element={<Placeholder title="Utilization" />} />

          {/* Site Incharges */}
          <Route 
              path="/site-incharge" 
              element={
                <ProtectedRoute role="admin">
                  <Placeholder title="Site Incharges" />
                </ProtectedRoute>
                }
           />



          <Route 
              path="/site-incharge/material-acknowledgment/:encodedUserId" 
              element={
                <ProtectedRoute role="admin">
                  <MaterialAcknowledgement />
                </ProtectedRoute>
              } 
          />
          <Route 
              path="/site-incharge/material-usage/:encodedUserId" 
              element={
                <ProtectedRoute role="admin">
                  <MaterialUsage />
                </ProtectedRoute>
              } 
          />

          <Route 
              path="/site-incharge/expense-entry/:encodedUserId" 
              element={
                <ProtectedRoute role="admin">
                  <BudgetExpenseEntry />
                </ProtectedRoute>
              } 
          />
           <Route 
              path="/site-incharge/work-completion/:encodedUserId" 
              element={
                <ProtectedRoute role="admin">
                  <WorkCompletionEntry />
                </ProtectedRoute>
              } 
          />

          <Route 
              path="/site-incharge/labor-assignment/:encodedUserId" 
              element={
                <ProtectedRoute role="admin">
                  <LabourAssign />
                </ProtectedRoute>
              } 
          />

            <Route 
              path="/site-incharge/labor-attendance/:encodedUserId" 
              element={
                <ProtectedRoute role="admin">
                  <LabourAttendance />
                </ProtectedRoute>
              } 
          />

          <Route 
              path="/site-incharge/additional-expense/:encodedUserId" 
              element={
                <ProtectedRoute role="admin">
                  <AdditionalExpense />
                </ProtectedRoute>
              } 
          />

          

          {/* Additional routes can be added here following the same pattern */}
          
          <Route 
              path="/admin/contracts/projects/dispatched-materials/:encodedUserId"          
              element={
                <ProtectedRoute role="admin">
                  <DispatchedMaterials />
                </ProtectedRoute>
              } 
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
