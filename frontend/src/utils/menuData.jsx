// import {
//   LayoutDashboard,
//   PaintBucket,
//   Package,
//   IndianRupee,
//   SwatchBook,
//   User,
//   Users,
//   ClipboardList,
//   Wrench,
//   Hammer,
//   Truck,
//   Boxes,
//   ListCollapse,
//   Layers,
//   PanelsTopLeft,
//   IdCardLanyard,
//   Coins,
//   Receipt,
//   Calculator,
//   Building2,
//   UsersRound,
//   ScrollText,
//   FileSpreadsheet,
//   Landmark,
//   ChartNoAxesCombined,
//   BrickWallShield,
//   Anvil,
//   BanknoteArrowDown,
//   ChevronDown,
//   PanelLeftClose,
//   PanelLeftOpen,
//   FileText,
//   CreditCard,
//   // New Icon for Payments
//   ArrowUpDown,
// } from 'lucide-react';

// const roleToPrefix = {
//   superadmin: 'superadmin',
//   admin: 'admin',
//   accounts_team: 'accounts',
//   siteincharge: 'site-in-charge',
// };

// const getTopMenus = (role, encodedUserId) => {
//   const prefix = roleToPrefix[role] || '';
//   const menus = [
//     { id: 1, name: 'Dashboard', path: `/${prefix}/dashboard/${encodedUserId}`, activePath: `/${prefix}/dashboard`, icon: LayoutDashboard },
//     { id: 2, name: 'Contract Management', path: `/${prefix}/contracts/master-client/${encodedUserId}`, activePath: `/${prefix}/contracts`, icon: PaintBucket },
//     { id: 3, name: 'Supply Management', path: `/${prefix}/supply/master-client/${encodedUserId}`, activePath: `/${prefix}/supply`, icon: Package },
//     { id: 4, name: 'Finance Management', path: `/${prefix}/finance/topsheet/${encodedUserId}`, activePath: `/${prefix}/finance`, icon: IndianRupee },
//     { id: 5, name: 'Resource Management', path: `/${prefix}/resource/employee-details/${encodedUserId}`, activePath: `/${prefix}/resource`, icon: SwatchBook },
//     { id: 6, name: 'Site Incharge', path: `/site-incharge/${encodedUserId}`, activePath: '/site-incharge', icon: Users },
//     { id: 99, name: 'User', path: '#', activePath: '#', icon: User },
//   ];
//   return role === 'siteincharge' ? menus.filter(m => m.id === 6) : menus.filter(m => m.id !== 6);
// };

// const getSidebarConfig = (role, encodedUserId) => {
//   const prefix = roleToPrefix[role] || '';

//   // Site Incharge Role
//   if (role === 'siteincharge') {
//     return {
//       '/site-incharge': [
//         {
//           title: 'Site Incharge Page',
//           icon: Users,
//           items: [
//             { label: 'Expense Entry', to: `/site-incharge/expense-entry/${encodedUserId}`, icon: Hammer },
//             { label: 'Work Completion', to: `/site-incharge/work-completion/${encodedUserId}`, icon: Hammer },
//             { label: 'Material Acknowledgment', to: `/site-incharge/material-acknowledgment/${encodedUserId}`, icon: Hammer },
//             { label: 'Material Usage', to: `/site-incharge/material-usage/${encodedUserId}`, icon: Hammer },
//             { label: 'Labor Assignment', to: `/site-incharge/labor-assignment/${encodedUserId}`, icon: Hammer },
//             { label: 'Labor Attendance', to: `/site-incharge/labor-attendance/${encodedUserId}`, icon: Hammer },
//             { label: 'Additional Expenses', to: `/site-incharge/additional-expense/${encodedUserId}`, icon: Hammer },
//             { label: 'Site Incharge History', to: `/site-incharge/siteincharge-history/${encodedUserId}`, icon: Hammer },
//           ],
//         },
//       ],
//     };
//   }

//   const dashboardKey = `/${prefix}/dashboard`;
//   const contractsKey = `/${prefix}/contracts`;
//   const supplyKey = `/${prefix}/supply`;
//   const financeKey = `/${prefix}/finance`;
//   const resourcesKey = `/${prefix}/resource`;

//   return {
//     [dashboardKey]: [
//       {
//         title: 'Overview',
//         icon: LayoutDashboard,
//         items: [
//           { label: 'Summary', to: `/${prefix}/dashboard/${encodedUserId}`, icon: ListCollapse },
//         ],
//       },
//     ],

//     [contractsKey]: [
//       {
//         title: 'Masters',
//         icon: ClipboardList,
//         items: [
//           { label: 'Master Client Creation', to: `/${prefix}/contracts/master-client/${encodedUserId}`, icon: Users },
//           { label: 'Master PO Creation', to: `/${prefix}/contracts/master-po/${encodedUserId}`, icon: FileText },
//         ],
//       },
//       {
//         title: 'Project',
//         icon: PanelsTopLeft,
//         items: [
//           { label: 'Project List', to: `/${prefix}/contracts/projects/${encodedUserId}`, icon: Layers },
//           { label: 'Project Projections', to: `/${prefix}/contracts/projects/projections/${encodedUserId}`, icon: ListCollapse },
//           { label: 'Assign Workforce', to: `/${prefix}/contracts/projects/work-force-planning/${encodedUserId}`, icon: Users },
//           { label: 'Material Dispatch', to: `/${prefix}/contracts/projects/material-dispatch/${encodedUserId}`, icon: Truck },
//         ],
//       },
//       {
//         title: 'Reconciliation',
//         icon: PanelsTopLeft,
//         items: [
//           { label: 'Overall Progress', to: `/${prefix}/contracts/reconciliation/overall-progress/${encodedUserId}`, icon: Layers },
//           { label: 'Daily Progress', to: `/${prefix}/contracts/reconciliation/daily-progress/${encodedUserId}`, icon: ChartNoAxesCombined },
//           { label: 'Area Completion', to: `/${prefix}/contracts/reconciliation/area-completion/${encodedUserId}`, icon: BrickWallShield },
//           { label: 'Material Consumption', to: `/${prefix}/contracts/reconciliation/material-consumption/${encodedUserId}`, icon: Anvil },
//           { label: 'Expense', to: `/${prefix}/contracts/reconciliation/expense/${encodedUserId}`, icon: BanknoteArrowDown },
//           { label: 'Site Incharge Entries', to: `/${prefix}/contracts/reconciliation/site-incharge-entries/${encodedUserId}`, icon: ClipboardList },
//         ],
//       },
//     ],

//     [supplyKey]: [
//       {
//         title: 'Master',
//         icon: ClipboardList,
//         items: [
//           { label: 'Client Master Creation', to: `/${prefix}/supply/master-client/${encodedUserId}`, icon: Users },
//           { label: 'Master PO Creation', to: `/${prefix}/supply/master-po/${encodedUserId}`, icon: FileText },
//         ],
//       },
//       {
//         title: 'Supply',
//         icon: PanelsTopLeft,
//         items: [
//           { label: 'Supply Material Planning', to: `/${prefix}/supply/material-planning/${encodedUserId}`, icon: Boxes },
//           { label: 'Supply Material Dispatch', to: `/${prefix}/supply/material-dispatch/${encodedUserId}`, icon: Truck },
//           { label: 'Supplied Materials', to: `/${prefix}/supply/supplied-materials/${encodedUserId}`, icon: Boxes },
//         ],
//       },
//     ],

//     // FINANCE SECTION – Updated with "Payments" above "Payables"
//     [financeKey]: [
//       {
//         title: 'Finance Management',
//         icon: IndianRupee,
//         items: [
//           { label: 'CFS', to: `/${prefix}/finance/cfs/${encodedUserId}`, icon: FileSpreadsheet },
//           { label: 'Top Sheet', to: `/${prefix}/finance/topsheet/${encodedUserId}`, icon: Landmark },
//           { label: 'Creditors', to: `/${prefix}/finance/creditors/${encodedUserId}`, icon: Building2 },
//         ],
//       },

//       // NEW: Payments Section (Above Payables)
//       {
//         title: 'Payments',
//         icon: ArrowUpDown,
//         collapsible: true,
//         isOpen: true,
//         items: [
//           {
//             label: 'Common Payment Entry',
//             to: `/${prefix}/finance/payments/${encodedUserId}`,
//             icon: Receipt,
//           },
//         ],
//       },

//       // Existing Payables Section
//       {
//         title: 'Payables',
//         icon: Receipt,
//         collapsible: true,
//         isOpen: false,
//         items: [
//           { label: 'SiteIncharge Attendance', to: `/${prefix}/finance/salary/${encodedUserId}`, icon: UsersRound },
//           { label: 'Salary Payables', to: `/${prefix}/finance/salary-payables/${encodedUserId}`, icon: FileSpreadsheet },
//           { label: 'Transport', to: `/${prefix}/finance/transport/${encodedUserId}`, icon: Truck },
//           { label: 'Scaffolding', to: `/${prefix}/finance/scaffolding/${encodedUserId}`, icon: Wrench },
//           { label: 'Site Accommodation', to: `/${prefix}/finance/site-accommodation/${encodedUserId}`, icon: Building2 },
//           { label: 'Commission', to: `/${prefix}/finance/commission/${encodedUserId}`, icon: Coins },
//           { label: 'GST', to: `/${prefix}/finance/gst/${encodedUserId}`, icon: Calculator },
//           { label: 'TDS', to: `/${prefix}/finance/tds/${encodedUserId}`, icon: ScrollText },
//           { label: 'Credit Card', to: `/${prefix}/finance/credit-card/${encodedUserId}`, icon: CreditCard },
//         ],
//       },

//       {
//         title: 'Receivables',
//         icon: Receipt,
//         collapsible: true,
//         isOpen: false,
//         items: [
//           { label: 'Billed Debtors', to: `/${prefix}/finance/billed-debtors/${encodedUserId}`, icon: FileText },
//         ],
//       },
//     ],

//     [resourcesKey]: [
//       {
//         title: 'Resources',
//         icon: SwatchBook,
//         items: [
//           { label: 'Employee Details', to: `/${prefix}/resource/employee-details/${encodedUserId}`, icon: IdCardLanyard },
//         ],
//       },
//     ],
//   };
// };

// export { getTopMenus, getSidebarConfig };

// export const miscIcons = {
//   ChevronDown,
//   PanelLeftClose,
//   PanelLeftOpen,
// };





















import {
  LayoutDashboard,
  PaintBucket,
  Package,
  IndianRupee,
  SwatchBook,
  User,
  Users,
  ClipboardList,
  Wrench,
  Hammer,
  Truck,
  Boxes,
  ListCollapse,
  Layers,
  PanelsTopLeft,
  IdCardLanyard,
  Coins,
  Receipt,
  Calculator,
  Building2,
  UsersRound,
  ScrollText,
  FileSpreadsheet,
  Landmark,
  ChartNoAxesCombined,
  BrickWallShield,
  Anvil,
  BanknoteArrowDown,
  ChevronDown,
  PanelLeftClose,
  PanelLeftOpen,
  FileText,
  CreditCard,
  ArrowUpDown,
  // New icon for Consumables (you can change to a better one if desired)
  Package2,
} from 'lucide-react';

const roleToPrefix = {
  superadmin: 'superadmin',
  admin: 'admin',
  accounts_team: 'accounts',
  siteincharge: 'site-in-charge',
};

const getTopMenus = (role, encodedUserId) => {
  const prefix = roleToPrefix[role] || '';
  const menus = [
    { id: 1, name: 'Dashboard', path: `/${prefix}/dashboard/${encodedUserId}`, activePath: `/${prefix}/dashboard`, icon: LayoutDashboard },
    { id: 2, name: 'Contract Management', path: `/${prefix}/contracts/master-client/${encodedUserId}`, activePath: `/${prefix}/contracts`, icon: PaintBucket },
    { id: 3, name: 'Supply Management', path: `/${prefix}/supply/master-client/${encodedUserId}`, activePath: `/${prefix}/supply`, icon: Package },
    { id: 4, name: 'Finance Management', path: `/${prefix}/finance/topsheet/${encodedUserId}`, activePath: `/${prefix}/finance`, icon: IndianRupee },
    { id: 5, name: 'Resource Management', path: `/${prefix}/resource/employee-details/${encodedUserId}`, activePath: `/${prefix}/resource`, icon: SwatchBook },
    { id: 6, name: 'Site Incharge', path: `/site-incharge/${encodedUserId}`, activePath: '/site-incharge', icon: Users },
    { id: 99, name: 'User', path: '#', activePath: '#', icon: User },
  ];
  return role === 'siteincharge' ? menus.filter(m => m.id === 6) : menus.filter(m => m.id !== 6);
};

const getSidebarConfig = (role, encodedUserId) => {
  const prefix = roleToPrefix[role] || '';

  // Site Incharge Role
  if (role === 'siteincharge') {
    return {
      '/site-incharge': [
        {
          title: 'Site Incharge Page',
          icon: Users,
          items: [
            { label: 'Expense Entry', to: `/site-incharge/expense-entry/${encodedUserId}`, icon: Hammer },
            { label: 'Work Completion', to: `/site-incharge/work-completion/${encodedUserId}`, icon: Hammer },
            { label: 'Material Acknowledgment', to: `/site-incharge/material-acknowledgment/${encodedUserId}`, icon: Hammer },
            { label: 'Material Usage', to: `/site-incharge/material-usage/${encodedUserId}`, icon: Hammer },
            { label: 'Labor Assignment', to: `/site-incharge/labor-assignment/${encodedUserId}`, icon: Hammer },
            { label: 'Labor Attendance', to: `/site-incharge/labor-attendance/${encodedUserId}`, icon: Hammer },
            { label: 'Additional Expenses', to: `/site-incharge/additional-expense/${encodedUserId}`, icon: Hammer },
            { label: 'Site Incharge History', to: `/site-incharge/siteincharge-history/${encodedUserId}`, icon: Hammer },
          ],
        },
      ],
    };
  }

  const dashboardKey = `/${prefix}/dashboard`;
  const contractsKey = `/${prefix}/contracts`;
  const supplyKey = `/${prefix}/supply`;
  const financeKey = `/${prefix}/finance`;
  const resourcesKey = `/${prefix}/resource`;

  return {
    [dashboardKey]: [
      {
        title: 'Overview',
        icon: LayoutDashboard,
        items: [
          { label: 'Summary', to: `/${prefix}/dashboard/${encodedUserId}`, icon: ListCollapse },
        ],
      },
    ],

    [contractsKey]: [
      {
        title: 'Masters',
        icon: ClipboardList,
        items: [
          { label: 'Master Client Creation', to: `/${prefix}/contracts/master-client/${encodedUserId}`, icon: Users },
          { label: 'Master PO Creation', to: `/${prefix}/contracts/master-po/${encodedUserId}`, icon: FileText },
        ],
      },
      {
        title: 'Project',
        icon: PanelsTopLeft,
        items: [
          { label: 'Project List', to: `/${prefix}/contracts/projects/${encodedUserId}`, icon: Layers },
          { label: 'Project Projections', to: `/${prefix}/contracts/projects/projections/${encodedUserId}`, icon: ListCollapse },
          { label: 'Assign Workforce', to: `/${prefix}/contracts/projects/work-force-planning/${encodedUserId}`, icon: Users },
          { label: 'Material Dispatch', to: `/${prefix}/contracts/projects/material-dispatch/${encodedUserId}`, icon: Truck },
        ],
      },
      {
        title: 'Reconciliation',
        icon: PanelsTopLeft,
        items: [
          { label: 'Overall Progress', to: `/${prefix}/contracts/reconciliation/overall-progress/${encodedUserId}`, icon: Layers },
          { label: 'Daily Progress', to: `/${prefix}/contracts/reconciliation/daily-progress/${encodedUserId}`, icon: ChartNoAxesCombined },
          { label: 'Area Completion', to: `/${prefix}/contracts/reconciliation/area-completion/${encodedUserId}`, icon: BrickWallShield },
          { label: 'Material Consumption', to: `/${prefix}/contracts/reconciliation/material-consumption/${encodedUserId}`, icon: Anvil },
          { label: 'Expense', to: `/${prefix}/contracts/reconciliation/expense/${encodedUserId}`, icon: BanknoteArrowDown },
          { label: 'Site Incharge Entries', to: `/${prefix}/contracts/reconciliation/site-incharge-entries/${encodedUserId}`, icon: ClipboardList },
        ],
      },
    ],

    [supplyKey]: [
      {
        title: 'Master',
        icon: ClipboardList,
        items: [
          { label: 'Client Master Creation', to: `/${prefix}/supply/master-client/${encodedUserId}`, icon: Users },
          { label: 'Master PO Creation', to: `/${prefix}/supply/master-po/${encodedUserId}`, icon: FileText },
        ],
      },
      {
        title: 'Supply',
        icon: PanelsTopLeft,
        items: [
          { label: 'Supply Material Planning', to: `/${prefix}/supply/material-planning/${encodedUserId}`, icon: Boxes },
          { label: 'Supply Material Dispatch', to: `/${prefix}/supply/material-dispatch/${encodedUserId}`, icon: Truck },
          { label: 'Supplied Materials', to: `/${prefix}/supply/supplied-materials/${encodedUserId}`, icon: Boxes },
        ],
      },
    ],

    [financeKey]: [
      {
        title: 'Finance Management',
        icon: IndianRupee,
        items: [
          { label: 'Fund Flow Projection', to: `/${prefix}/finance/cfs/${encodedUserId}`, icon: FileSpreadsheet },
          { label: 'Top Sheet', to: `/${prefix}/finance/topsheet/${encodedUserId}`, icon: Landmark },
          { label: 'Creditors', to: `/${prefix}/finance/creditors/${encodedUserId}`, icon: Building2 },
        ],
      },

      {
        title: 'Payments',
        icon: ArrowUpDown,
        collapsible: true,
        isOpen: true,
        items: [
          {
            label: 'Fund Flow Statement',
            to: `/${prefix}/finance/payments/${encodedUserId}`,
            icon: Receipt,
          },
        ],
      },

      {
        title: 'Payables',
        icon: Receipt,
        collapsible: true,
        isOpen: false,
        items: [
          { label: 'SiteIncharge Attendance', to: `/${prefix}/finance/salary/${encodedUserId}`, icon: UsersRound },
          { label: 'Salary Payables', to: `/${prefix}/finance/salary-payables/${encodedUserId}`, icon: FileSpreadsheet },
          { label: 'Transport', to: `/${prefix}/finance/transport/${encodedUserId}`, icon: Truck },
          { label: 'Scaffolding', to: `/${prefix}/finance/scaffolding/${encodedUserId}`, icon: Wrench },
          { label: 'Site Accommodation', to: `/${prefix}/finance/site-accommodation/${encodedUserId}`, icon: Building2 },
          { label: 'Commission', to: `/${prefix}/finance/commission/${encodedUserId}`, icon: Coins },
          { label: 'GST', to: `/${prefix}/finance/gst/${encodedUserId}`, icon: Calculator },
          { label: 'TDS', to: `/${prefix}/finance/tds/${encodedUserId}`, icon: ScrollText },
          { label: 'Credit Card', to: `/${prefix}/finance/credit-card/${encodedUserId}`, icon: CreditCard },
        ],
      },

      {
        title: 'Receivables',
        icon: Receipt,
        collapsible: true,
        isOpen: false,
        items: [
          { label: 'Billed Debtors', to: `/${prefix}/finance/billed-debtors/${encodedUserId}`, icon: FileText },
        ],
      },
    ],

    // UPDATED: Resource Management with Consumables below Employee Details
    [resourcesKey]: [
      {
        title: 'Resources',
        icon: SwatchBook,
        items: [
          { label: 'Employee Details', to: `/${prefix}/resource/employee-details/${encodedUserId}`, icon: IdCardLanyard },
          { label: 'Consumables', to: `/${prefix}/resource/consumables/${encodedUserId}`, icon: Package2 },
        ],
      },
    ],
  };
};

export { getTopMenus, getSidebarConfig };

export const miscIcons = {
  ChevronDown,
  PanelLeftClose,
  PanelLeftOpen,
};