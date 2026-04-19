// ── Mock data ── //

export const CURRENT_USER = {
  name: 'James Dlamini',
  initials: 'JD',
  zone: 'Durban North',
  role: 'citizen', // 'citizen' | 'collector'
};

export const SCHEDULE = [
  { id: 1, date: '2026-04-17', title: 'Recycling collection',       types: ['Paper','Plastic','Glass'], route: 'Durban North',       time: '07:00' },
  { id: 2, date: '2026-04-19', title: 'General waste',              types: ['Black bin'],               route: 'All Durban North',   time: '06:00' },
  { id: 3, date: '2026-04-24', title: 'Garden refuse & bulky items',types: ['Garden waste','Bulky items'],route: 'Durban North',     time: '08:00' },
  { id: 4, date: '2026-05-01', title: 'Recycling collection',       types: ['Paper','Plastic','Glass'], route: 'Durban North',       time: '07:00' },
  { id: 5, date: '2026-05-08', title: 'General waste',              types: ['Black bin'],               route: 'All Durban North',   time: '06:00' },
];

export const TYPE_COLORS = {
  'Paper':        { bg: '#E1F5EE', color: '#0F6E56' },
  'Plastic':      { bg: '#E6F1FB', color: '#185FA5' },
  'Glass':        { bg: '#FAEEDA', color: '#BA7517' },
  'Black bin':    { bg: '#F1EFE8', color: '#5F5E5A' },
  'Garden waste': { bg: '#EAF3DE', color: '#3B6D11' },
  'Bulky items':  { bg: '#FAEEDA', color: '#BA7517' },
};

export const RECYCLE_ITEMS = [
  { id:1,  name:'Plastic bottles (1 & 2)', category:'plastic',   recyclable:'yes',  note:'Rinse before placing in yellow bin' },
  { id:2,  name:'Cardboard boxes',         category:'paper',     recyclable:'yes',  note:'Flatten and keep dry' },
  { id:3,  name:'Pizza boxes',             category:'paper',     recyclable:'prep', note:'Remove greasy portions first' },
  { id:4,  name:'Plastic bags',            category:'plastic',   recyclable:'prep', note:'Take to supermarket drop-off point' },
  { id:5,  name:'Batteries',              category:'hazardous', recyclable:'no',   note:'Never place in general waste bin' },
  { id:6,  name:'Motor oil & chemicals',  category:'hazardous', recyclable:'no',   note:'eThekwini depot collection required' },
  { id:7,  name:'Glass bottles & jars',   category:'glass',     recyclable:'yes',  note:'Remove lids, rinse clean' },
  { id:8,  name:'Thermal paper receipts', category:'paper',     recyclable:'no',   note:'Contains BPA — general waste only' },
  { id:9,  name:'Tin & steel cans',       category:'metal',     recyclable:'yes',  note:'Rinse and crush if possible' },
  { id:10, name:'Aluminium cans',         category:'metal',     recyclable:'yes',  note:'Crush to save space' },
  { id:11, name:'Tetra Pak cartons',      category:'paper',     recyclable:'prep', note:'Rinse thoroughly, remove straws' },
  { id:12, name:'Electronic waste',       category:'hazardous', recyclable:'no',   note:'eThekwini e-waste drop-off sites' },
  { id:13, name:'Polystyrene foam',       category:'plastic',   recyclable:'no',   note:'General waste — not recyclable here' },
  { id:14, name:'Magazines & newspapers', category:'paper',     recyclable:'yes',  note:'Keep dry, bundle together' },
  { id:15, name:'PET plastic containers', category:'plastic',   recyclable:'yes',  note:'Check number 1 on the bottom' },
  { id:16, name:'Fluorescent light bulbs',category:'hazardous', recyclable:'no',   note:'Hazardous — special drop-off required' },
];

export const NOTIFICATIONS = [
  { id:1, title:'Recycling collection tomorrow — put bins out tonight', time:'Today, 20:00',    type:'collection', read: false },
  { id:2, title:'Your report #WM-4821 has been reviewed',              time:'Yesterday, 14:32', type:'report',     read: false },
  { id:3, title:'eThekwini hazardous waste drive — Sat 20 Apr, Springfield', time:'2 days ago', type:'event',      read: true  },
  { id:4, title:'Tip: Flatten cardboard boxes to save bin space',       time:'4 days ago',      type:'tip',        read: true  },
];

export const ISSUE_TYPES = [
  'Missed collection',
  'Illegal dumping',
  'Overflowing bin',
  'Damaged bin',
  'Hazardous waste',
  'Blocked drain with waste',
];

// Map centre — Durban North
export const MAP_CENTER = [-29.795, 31.035];

export const SAMPLE_REPORTS = [
  { id:'WM-4821', lat:-29.791, lng:31.038, type:'Illegal dumping',   status:'In review',  date:'2026-04-15' },
  { id:'WM-4802', lat:-29.800, lng:31.030, type:'Overflowing bin',   status:'Resolved',   date:'2026-04-10' },
  { id:'WM-4778', lat:-29.788, lng:31.044, type:'Missed collection', status:'Resolved',   date:'2026-04-05' },
];
