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
} from 'lucide-react'; // tree-shakable with Vite [8]

const encodedUserId = localStorage.getItem("encodedUserId");

const getTopMenus = (encodedUserId) => [
  { id: 1, name: 'Dashboard', path: `/admin/dashboard/${encodedUserId}`, activePath:"/admin/dashboard", icon: LayoutDashboard },
  { id: 2, name: 'Contract Management', path: `/admin/contracts/master-client/${encodedUserId}`, activePath:"/admin/contracts", icon: PaintBucket },
  { id: 3, name: 'Supply Management', path: `/admin/supply/master-client/${encodedUserId}`, activePath:"/admin/supply", icon: Package },
  { id: 4, name: 'Finance Management', path: '/finance', activePath:"/finance", icon: IndianRupee },
  { id: 5, name: 'Resource Management', path: '/resources', activePath:"/resources", icon: SwatchBook },
  { id: 6, name: 'Site Incharge', path: '/site-incharge', activePath:"/site-incharge", icon: Users },
  { id: 99, name: 'User', path: '#', activePath:"#", icon: User },
];

export const topMenus = getTopMenus(encodedUserId);

// Left sidebar config per section
export const sidebarConfig = {
  '/admin/dashboard': [
    {
      title: 'Overview',
      icon: LayoutDashboard,
      items: [
        { label: 'Summary', to: `/admin/dashboard/${encodedUserId}`, icon: ListCollapse },
        // { label: 'Reports', to: `/admin/dashboard/reports/${encodedUserId}`, icon: FileText },
      ],
    },
  ],
  '/admin/contracts': [
    {
      title: 'Masters',
      icon: ClipboardList,
      items: [
        { label: 'Master Client Creation', to: `/admin/contracts/master-client/${encodedUserId}`, icon: Users },
        { label: 'Master PO Creation', to: `/admin/contracts/master-po/${encodedUserId}`, icon: FileText },
      ],
    },
    {
      title: 'Project',
      icon: PanelsTopLeft,
      items: [
        { label: 'Project List', to: `/admin/contracts/projects/${encodedUserId}`, icon: Layers },
        { label: 'Project Projections', to: `/admin/contracts/projects/projections/${encodedUserId}`, icon: ListCollapse },
        {label: 'Project Projections Old', to: `/admin/contracts/projects/project-planning/${encodedUserId}`, icon: Hammer },
        { label: 'Work Force Planning', to: `/admin/contracts/projects/work-force-planning/${encodedUserId}`, icon: Users },
        { label: 'Material Planning', to: `/admin/contracts/projects/material-planning/${encodedUserId}`, icon: Boxes },
        { label: 'Material Dispatch', to: `/admin/contracts/projects/material-dispatch/${encodedUserId}`, icon: Truck },
        { label: 'Employee Details', to: `/admin/contracts/projects/employee-details/${encodedUserId}`, icon: IdCardLanyard },
        { label: 'Additional Cash', to: `/admin/contracts/projects/additional-cash/${encodedUserId}`, icon: Coins },
        { label: 'Dispatched Materials List', to: `/admin/contracts/projects/dispatched-materials/${encodedUserId}`, icon: Truck },

      ],
      // accordion: {
      //   label: 'Project Projections',
      //   icon: ListCollapse,
      //   children: [
      //     { label: 'Material Projection', to: '/contracts/projections/material', icon: Boxes },
      //     { label: 'Labor Projection', to: '/contracts/projections/labor', icon: Hammer },
      //     { label: 'Rental Projection', to: '/contracts/projections/rental', icon: Truck },
      //     { label: 'Miscellaneous Projection', to: '/contracts/projections/misc', icon: Wrench },
      //   ],
      //   allowAdd: { label: 'Add Projection', icon: PlusCircle, to: '/contracts/projections/new' },
      // },
    },
  ],
  '/admin/supply': [
    {
      title: 'Master',
      icon: ClipboardList,
      items: [
        { label: 'Client Master Creation', to: `/admin/supply/master-client/${encodedUserId}`, icon: Users },
        { label: 'Master PO Creation', to: `/admin/supply/master-po/${encodedUserId}`, icon: FileText },
        // { label: 'Vendors', to: '/supply/vendors', icon: Users },
        // { label: 'Purchase Orders', to: '/supply/po', icon: FileText },
      ],
    }, {
      title: 'Supply',
      icon: PanelsTopLeft,
      items: [
        { label: 'Supply Material Planning', to: `/admin/supply/material-planning/${encodedUserId}`, icon: Boxes }, 
        { label: 'Supply Material Dispatch', to: `/admin/supply/material-dispatch/${encodedUserId}`, icon: Truck },
        { label: 'Supplied Materials', to: `/admin/supply/supplied-materials/${encodedUserId}`, icon: Boxes },
      ]
    } 
  ],
  '/finance': [
    {
      title: 'Finance',
      icon: IndianRupee,
      items: [
        { label: 'Invoices', to: '/finance/invoices', icon: FileText },
        // { label: 'Payments', to: '/finance/payments', icon: IndianRupee },
        // { label: 'Reports', to: '/finance/reports', icon: ListCollapse },
      ],
    },
  ],
  '/resources': [
    {
      title: 'Resources',
      icon: SwatchBook,
      items: [
        // { label: 'Staff', to: '/resources/staff', icon: Users },
        { label: 'Assign', to: '/resources/assign', icon: ClipboardList },
        // { label: 'Utilization', to: '/resources/utilization', icon: ListCollapse },
      ],
    },
    
  ],
  '/site-incharge': [
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
      ],
    },
  ],

};

export const miscIcons = {
  ChevronDown,
  PanelLeftClose,
  PanelLeftOpen,
};
