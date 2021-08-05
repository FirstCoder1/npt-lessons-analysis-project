import { metricsUtils } from '@corva/ui/utils';

const metrics = metricsUtils.default;

export const MAX_OFFSETS_SUPPORTED = 400;

export const TABLE_LIST = [
  {
    label: 'Type',
    key: 'type',
    kind: 'all',
    active: true,
    width: 40,
  },
  {
    label: 'Well Name',
    key: 'wellName',
    kind: 'all',
    active: true,
    width: 230,
  },
  {
    label: 'Rig Name',
    key: 'rigName',
    kind: 'all',
    active: true,
    width: 100,
  },
  {
    label: 'Detail',
    key: 'detail',
    kind: 'npt',
    active: true,
    width: 100,
  },
  {
    label: 'Accountable Party',
    key: 'party',
    kind: 'npt',
    active: true,
    width: 100,
  },
  {
    label: 'Responsible Company',
    key: 'company',
    kind: 'npt',
    active: true,
    width: 80,
  },
  {
    label: 'Topic',
    key: 'topic',
    kind: 'lessons',
    active: true,
    width: 80,
  },
  {
    label: 'Severity',
    key: 'severity',
    kind: 'lessons',
    active: true,
    width: 80,
  },
  {
    label: 'Cause',
    key: 'cause',
    kind: 'lessons',
    active: true,
    width: 80,
  },
  {
    label: 'Description',
    key: 'description',
    kind: 'all',
    active: true,
    width: 300,
  },
  {
    label: 'Hole Section',
    key: 'holeSection',
    kind: 'all',
    active: true,
    width: 80,
  },
  {
    label: 'Operation',
    key: 'operation',
    kind: 'all',
    active: true,
    width: 80,
  },
  {
    label: 'TVD',
    key: 'tvd',
    kind: 'all',
    active: true,
    width: 80,
  },
  {
    label: 'Phase',
    key: 'phase',
    kind: 'all',
    active: true,
    width: 80,
  },
  {
    label: 'Start Time',
    key: 'startTime',
    kind: 'all',
    active: true,
    width: 80,
  },
  {
    label: 'End Time',
    key: 'endTime',
    kind: 'all',
    active: true,
    width: 80,
  },
  {
    label: 'Link',
    key: 'link',
    kind: 'all',
    active: true,
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

export const EVENTS_OPTIONS = [
  {
    title: 'NPT',
    key: 'npt',
    checked: true,
  },
  {
    title: 'Lessons Learned',
    key: 'lessons',
    checked: false,
  }
];

export const NPT_FILTER_TYPE_OPTIONS = [
  {
    title: 'Build Rates',
    key: 'buildrates',
    checked: true,
    color: '#BB002E',
  },
  {
    title: 'Fishing',
    key: 'fishing',
    checked: true,
    color: '#FFE268',
  },
  {
    title: 'H2S',
    key: 'h2s',
    checked: true,
    color: '#85D947',
  },
  {
    title: 'Losses',
    key: 'losses',
    checked: true,
    color: '#FB4E32',
  },
  {
    title: 'Pack Off',
    key: 'packoff',
    checked: true,
    color: '#24BB8E',
  }, 
  {
    title: 'Sidetrack',
    key: 'sidetrack',
    checked: true,
    color: '#FFBA00',
  }, 
  {
    title: 'Stuck Pipe',
    key: 'stuckpipe',
    checked: true,
    color: '#961AEE',
  },
  {
    title: 'Washout',
    key: 'washout',
    checked: true,
    color: '#F50258',
  },
  {
    title: 'Well Control',
    key: 'wellcontrol',
    checked: true,
    color: '#1657F5',
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

export const LESSONS_FILTER_OPTIONS = [
  {
    key: 'topic',
    title: 'Event Topic',
    value: '',
    array: ['Topic 1', 'Topic 2'],
  },
  {
    key: 'severity',
    title: 'Event Severity',
    value: '',
    array: ['Severity 1', 'Severity 2'],
  },
  {
    key: 'cause',
    title: 'Event Cause',
    value: '',
    array: ['Cause 1', 'Cause 2'],
  },
];

export const OPERATIONAL_FILTER_OPTIONS = [
  {
    key: 'holesection',
    title: 'Hole Section',
    value: '',
    array: ['Hole Section 1', 'Section 2'],
  },
  {
    key: 'activity',
    title: 'Activity',
    value: '',
    array: ['Activity 1', 'Activity 2'],
  },
  {
    key: 'phase',
    title: 'Phase',
    value: '',
    array: ['Phase 1', 'Phase 2'],
  },
  {
    key: 'measureddepth',
    title: 'Measured Depth',
    value: '',
    array: ['Depth 1', 'Depth 2'],
  },
];

export const CO_RELATION_FILTERS = [
  {
    key: 'driller',
    title: 'Directional Provider',
    renderValue: length => (length === 0 ? `All Drillers` : `${length} Drillers`),
  },
  {
    key: 'rigName',
    title: 'Rig',
    renderValue: length => (length === 0 ? `All Rigs` : `${length} Rigs`),
  },
  {
    key: 'holeSectionName',
    title: 'Hole Section',
    path: 'data.name',
    renderValue: length => (length === 0 ? `All Sections` : `${length} Sections`),
  },
  {
    key: 'holeSectionSize',
    title: 'Hole Size',
    path: 'data.diameter',
    renderValue: length => (length === 0 ? `All Sizes` : `${length} Sizes`),
  },
];

export const DEFAULT_SETTINGS = {
  savedIsTutorialShown: false,
  savedCoRelationFilters: {},
  savedRssFilter: 'all',
  savedStepoutFilter: null,
  savedInclinationFilter: null,
  savedMdFilter: null,
  savedOneRunBhaFilter: {
    on: false,
    objective: 'section',
    percent: 95,
  },
  savedTableSettings: TABLE_LIST.reduce((result, item) => {
    return [
      ...result,
      {
        ...item,
        show: !item.hideByDefault,
      },
    ];
  }, []),
  savedSortInfo: {
    key: metrics.rop_rotary.key,
    direction: 'asc',
  },
  savedPageInfo: {
    perPage: 10,
    pageNo: 0,
  },
  savedRemovedBhas: {},
  savedOffsetSetting: {},
};

