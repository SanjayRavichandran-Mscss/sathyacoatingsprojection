import {
  LayoutDashboard,
  PaintBucket,
  Package,
  IndianRupee,
  SwatchBook,
  User,
  FileText,
  Users,
  ClipboardList,
  Wrench,
  Hammer,
  Truck,
  Boxes,
  ListCollapse,
  Layers,
  PanelsTopLeft,
  PlusCircle,
  ChevronDown,
  PanelLeftClose,
  PanelLeftOpen,
  IdCardLanyard,
  Coins,
  BanknoteArrowDown,
  Anvil,
  BrickWall,
  BrickWallShield,
  ChartNoAxesCombined
} from 'lucide-react'; // tree-shakable with Vite [8]

const roleToPrefix = {
  superadmin: 'superadmin',
  admin: 'admin',
  accounts_team: 'accounts',
  siteincharge: 'site-incharge'
};

const getTopMenus = (role, encodedUserId) => {
  const prefix = roleToPrefix[role] || '';
  const menus = [
    { id: 1, name: 'Dashboard', path: `/${prefix}/dashboard/${encodedUserId}`, activePath:`/${prefix}/dashboard`, icon: LayoutDashboard },
    { id: 2, name: 'Contract Management', path: `/${prefix}/contracts/master-client/${encodedUserId}`, activePath:`/${prefix}/contracts`, icon: PaintBucket },
    { id: 3, name: 'Supply Management', path: `/${prefix}/supply/master-client/${encodedUserId}`, activePath:`/${prefix}/supply`, icon: Package },
    { id: 4, name: 'Finance Management', path: `/${prefix}/finance`, activePath:`/${prefix}/finance`, icon: IndianRupee },
    { id: 5, name: 'Resource Management', path: `/${prefix}/resource/employee-details/${encodedUserId}`, activePath:`/${prefix}/resource`, icon: SwatchBook },
    { id: 6, name: 'Site Incharge', path: `/site-incharge/${encodedUserId}`, activePath:"/site-incharge", icon: Users },
    { id: 99, name: 'User', path: '#', activePath:"#", icon: User },
  ];

  if (role === "siteincharge") {
    return menus.filter(m => m.id === 6);
  } else {
    return menus.filter(m => m.id !== 6);
  }
};

const getSidebarConfig = (role, encodedUserId) => {
  const prefix = roleToPrefix[role] || '';
  let config = {};

  if (role === "siteincharge") {
    config['/site-incharge'] = [
      {
        title: 'Site Incharge Page',
        icon: Users,
        items: [
          { label: 'Material Acknowledgment', to: `/site-incharge/material-acknowledgment/${encodedUserId}`, icon: Hammer },
          { label: 'Material Usage', to: `/site-incharge/material-usage/${encodedUserId}`, icon: Hammer },
          {label: 'Expense Entry', to: `/site-incharge/expense-entry/${encodedUserId}`, icon: Hammer },
         
          { label: 'Work Completion', to: `/site-incharge/work-completion/${encodedUserId}`, icon: Hammer },
          { label: 'Labor Assignment', to: `/site-incharge/labor-assignment/${encodedUserId}`, icon: Hammer },
          { label: 'Labor Attendance', to: `/site-incharge/labor-attendance/${encodedUserId}`, icon: Hammer },
           { label: 'Additional Expenses', to: `/site-incharge/additional-expense/${encodedUserId}`, icon: Hammer },
           { label: 'Site Incharge History', to: `/site-incharge/siteincharge-history/${encodedUserId}`, icon: Hammer },
        ],
      },
    ];
  } else {
    const dashboardKey = `/${prefix}/dashboard`;
    const contractsKey = `/${prefix}/contracts`;
    const supplyKey = `/${prefix}/supply`;
    const financeKey = `/${prefix}/finance`;
    const resourcesKey = `/${prefix}/resource`;

    config = {
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
        { label: 'Expense', to: `/${prefix}/contracts/reconciliation/expense/${encodedUserId}`, icon: BanknoteArrowDown  },
        { label: 'Site Incharge Entries', to: `/${prefix}/contracts/reconciliation/site-incharge-entries/${encodedUserId}`, icon: ClipboardList },
      ],
    }
      ],
      [supplyKey]: [
        {
          title: 'Master',
          icon: ClipboardList,
          items: [
            { label: 'Client Master Creation', to: `/${prefix}/supply/master-client/${encodedUserId}`, icon: Users },
            { label: 'Master PO Creation', to: `/${prefix}/supply/master-po/${encodedUserId}`, icon: FileText },
          ],
        }, {
          title: 'Supply',
          icon: PanelsTopLeft,
          items: [
            { label: 'Supply Material Planning', to: `/${prefix}/supply/material-planning/${encodedUserId}`, icon: Boxes }, 
            { label: 'Supply Material Dispatch', to: `/${prefix}/supply/material-dispatch/${encodedUserId}`, icon: Truck },
            { label: 'Supplied Materials', to: `/${prefix}/supply/supplied-materials/${encodedUserId}`, icon: Boxes },
          ]
        } 
      ],
      [financeKey]: [
        {
          title: 'Finance',
          icon: IndianRupee,
          items: [
            { label: 'Invoices', to: `/${prefix}/finance/invoices`, icon: FileText },
          ],
        },
      ],
      [resourcesKey]: [
        {
          title: 'Resources',
          icon: SwatchBook,
          items: [
             { label: 'Employee Details', to: `/${prefix}/resource/employee-details/${encodedUserId}`, icon: IdCardLanyard },
          ],
        },
      ],
    };
  }

  return config;
};

export { getTopMenus, getSidebarConfig };

export const miscIcons = {
  ChevronDown,
  PanelLeftClose,
  PanelLeftOpen,
};