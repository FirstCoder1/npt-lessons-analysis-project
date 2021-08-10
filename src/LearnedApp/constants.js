export const MAX_OFFSETS_SUPPORTED = 400;

export const TABLE_KIND = {
  none: 0,
  npt: 1,
  lessons: 2,
  all: 3,
};

export const EVENTS_OPTIONS = [
  {
    title: 'NPT',
    key: TABLE_KIND.npt,
  },
  {
    title: 'Lessons Learned',
    key: TABLE_KIND.lessons,
  },
];

export const NPT_FILTER_OTHER_OPTIONS = [
  {
    key: 'nptdetail',
    title: 'NPT Detail',
    value: '',
    array: ['Detail 1', 'Detail 2'],
  },
  {
    key: 'accountableparty',
    title: 'Accountable Party',
    value: '',
    array: ['Party 1', 'Party 2'],
  },
  {
    key: 'accountablecompany',
    title: 'Accountable Company',
    value: '',
    array: ['Company 1', 'Company 2'],
  },
];

export const EVENTS = {
  BHA: 'bha',
  TOP_DRIVE: 'top drive',
  MUD_PUMPS: 'mud pumps',
  STUCK_PIPE: 'stuck pipe',
  PACK_OFF: 'packoff',
  WASHOUT: 'washout',
  BUILD_RATES: 'build rates',
  MWD: 'MWD',
  BOP: 'BOP',
  WEATHER: 'weather',
  RIG_SERVICE: 'rig service',
  SIDETRACK: 'geological sidetrack',
  LOSSES: 'losses',
  H2S: 'H2S',
  WELL_CONTROL: 'well control',
  WAITING_ON_ORDERS: 'waiting on orders',
  WIRELINE_OPERATIONS: 'wireline operations',
  DIRECTIONAL: 'directional',
  GEOLOGY: 'geology',
  FISHING: 'fishing',
  JARRING: 'jarring',
  WAITING_ON_3RD_PARTY: 'waiting on 3rd party',
  WATER_SHORTAGE: 'water shortage',
  WAITING_ON_PROPPANT: 'waiting on proppant',
  WAITING_ON_CHEMICALS: 'waiting on chemicals',
  PLUG_ISSUE: 'plug issue',
  PRODUCTIVE_TIME: 'productive time',
  SCREENOUT: 'screenout',
  OTHER: 'other',
  PUMP_MAINTENANCE: 'pump maintenance',
  WELL_INTERVENTION: 'well intervention',
  PRESSURE_TEST_FAILURE: 'pressure test failure',
  WATER_TRANSFER_ISSUE: 'water transfer issue',
  FRAC_STACK_MAINTENANCE: 'frac stack maintenance',
};

export const EVENTS_COLORS = {
  [EVENTS.BHA]: '#e30066',
  [EVENTS.TOP_DRIVE]: '#ffbb37',
  [EVENTS.MUD_PUMPS]: '#9500b7',
  [EVENTS.STUCK_PIPE]: '#f70000',
  [EVENTS.PACK_OFF]: '#ff3e02',
  [EVENTS.WASHOUT]: '#ff237b',
  [EVENTS.BUILD_RATES]: '#ffd200',
  [EVENTS.MWD]: '#4bd984',
  [EVENTS.BOP]: '#b74bef',
  [EVENTS.WEATHER]: '#8119FF',
  [EVENTS.RIG_SERVICE]: '#9387f5',
  [EVENTS.SIDETRACK]: '#a55d84',
  [EVENTS.LOSSES]: '#f28ac2',
  [EVENTS.H2S]: '#7d5c4c',
  [EVENTS.WELL_CONTROL]: '#9c500c',
  [EVENTS.WAITING_ON_ORDERS]: '#99e2bb',
  [EVENTS.WIRELINE_OPERATIONS]: '#7B6491',
  [EVENTS.PUMP_MAINTENANCE]: '#a55d84',
  [EVENTS.DIRECTIONAL]: '#ea9d23',
  [EVENTS.GEOLOGY]: '#cc8af2',
  [EVENTS.FISHING]: '#8f1859',
  [EVENTS.JARRING]: '#7d0625',
  [EVENTS.WAITING_ON_3RD_PARTY]: '#5d786a',
  [EVENTS.WAITING_ON_PROPPANT]: '#f28ac2',
  [EVENTS.WAITING_ON_CHEMICALS]: '#7d5c4c',
  [EVENTS.PLUG_ISSUE]: '#00dd00',
  [EVENTS.PRODUCTIVE_TIME]: '#99e2bb',
  [EVENTS.SCREENOUT]: '#ea9d23',
  [EVENTS.WELL_INTERVENTION]: '#cccc00',
  [EVENTS.PRESSURE_TEST_FAILURE]: '#8f1859',
  [EVENTS.WATER_TRANSFER_ISSUE]: '#777de3',
  [EVENTS.FRAC_STACK_MAINTENANCE]: '#1cdeff',
  [EVENTS.OTHER]: '#D2DFD8',
};

export const TABLE_LIST = [
  {
    label: 'Type',
    key: 'type',
    kind: TABLE_KIND.all,
    active: true,
    show: true,
    width: 40,
  },
  {
    label: 'Well Name',
    key: 'wellName',
    kind: TABLE_KIND.all,
    active: true,
    show: true,
    width: 230,
  },
  {
    label: 'Rig Name',
    key: 'rigName',
    kind: TABLE_KIND.all,
    active: true,
    show: true,
    width: 100,
  },
  {
    label: 'Detail',
    key: 'detail',
    kind: TABLE_KIND.none,
    active: false,
    show: false,
    width: 100,
  },
  {
    label: 'Accountable Party',
    key: 'party',
    kind: TABLE_KIND.none,
    active: false,
    show: false,
    width: 100,
  },
  {
    label: 'Responsible Company',
    key: 'company',
    kind: TABLE_KIND.none,
    active: false,
    show: false,
    width: 80,
  },
  {
    label: 'Topic',
    key: 'topic',
    kind: TABLE_KIND.lessons,
    active: false,
    show: false,
    width: 80,
  },
  {
    label: 'Severity',
    key: 'severity',
    kind: TABLE_KIND.lessons,
    active: false,
    show: false,
    width: 80,
  },
  {
    label: 'Cause',
    key: 'cause',
    kind: TABLE_KIND.lessons,
    active: false,
    show: false,
    width: 80,
  },
  {
    label: 'Description',
    key: 'description',
    kind: TABLE_KIND.all,
    active: true,
    show: true,
    width: 300,
  },
  {
    label: 'Hole Section',
    key: 'holeSection',
    kind: TABLE_KIND.all,
    active: true,
    show: true,
    width: 80,
  },
  {
    label: 'Operation',
    key: 'operation',
    kind: TABLE_KIND.all,
    active: true,
    show: true,
    width: 80,
  },
  {
    label: 'TVD',
    key: 'tvd',
    kind: TABLE_KIND.all,
    active: true,
    show: true,
    width: 80,
  },
  {
    label: 'Phase',
    key: 'phase',
    kind: TABLE_KIND.all,
    active: true,
    show: true,
    width: 80,
  },
  {
    label: 'Start Time',
    key: 'startTime',
    kind: TABLE_KIND.all,
    active: true,
    show: true,
    width: 80,
  },
  {
    label: 'End Time',
    key: 'endTime',
    kind: TABLE_KIND.all,
    active: true,
    show: true,
    width: 80,
  },
  {
    label: 'Link',
    key: 'link',
    kind: TABLE_KIND.all,
    active: true,
    show: true,
    width: 40,
  },
];

export const HIGHLIGHTING_METRICS = TABLE_LIST.filter(
  item => item.isMetricsData && item.key !== 'hole_depth'
).map(item => item.key);

export const LOW_VALUE_GOOD_METRICS = [
  'drilled_feet_slide_percentage', // slide %
  'build_rate', // Build rate
  'turn_rate', // Turn rate
  'cost_per_ft', // Est Cost/foot
  'mse_percentiles.median', // mse
  'gross_time', // Gross time
  'drilled_feet_slide', // Slide Distance
  'on_bottom_time', // On-bottom time
];

export const DEFAULT_SETTINGS = {
  savedIsTutorialShown: false,
  savedStepoutFilter: null,
  savedMdFilter: null,
  savedTableSettings: TABLE_LIST.reduce((result, item) => {
    return [
      ...result,
      {
        ...item,
        show: !item.hideByDefault,
      },
    ];
  }, []),
  savedOffsetSetting: {},
};
