// NOTE: We will show different alarms based on template status
export const TEMPLATE_STATUS = {
  LOADING: 'LOADING',
  LOADED: 'LOADED',
  CREATED: 'CREATED',
  UPDATED: 'UPDATED',
  DELETED: 'DELETED',
  SHARED: 'SHARED',
  SETTINGS_CHANGED: 'SETTINGS_CHANGED',
  DEFAULT_DUPLICATED: 'DEFAULT_DUPLICATED',
  SHARED_CANNOT_EDIT: 'SHARED_CANNOT_EDIT',
};

// NOTE: All default template ids are negative values
// Template name is defined in useTemplates effect

export const DEFAULT_TEMPLATE_IDS = {
  MU_BHA: -1,
  NPT: -2,
  allPrimaryCodes: -3,
  ProductiveTime: -4,
};

export const DEFAULT_TEMPLATES = [
  { name: 'MU BHA', id: DEFAULT_TEMPLATE_IDS.MU_BHA, settings: {} },
  { name: 'NPT', id: DEFAULT_TEMPLATE_IDS.NPT, settings: {} },
  { name: 'All Primary Codes', id: DEFAULT_TEMPLATE_IDS.allPrimaryCodes, settings: {} },
  { name: 'Productive Time', id: DEFAULT_TEMPLATE_IDS.ProductiveTime, settings: {} },
];

export const NO_TEMPLATE_SELECTED_NAME = 'No Template Selected';
export const NO_TEMPLATE_SELECTED_ID = -100;

export const TEMPLATE_ID_KEY = ['templateId'];
export const APP_SETTING_KEY = ['data'];

export const METADATA = {
  segment: ['drilling'],
  title: 'Time Analysis',
  settingsTitle: 'Time Analysis',
  subtitle: 'Time Analysis',
  appKey: 'big-data-energy.bha_optimization.ui',
  developer: { name: 'Corva', url: 'http://www.corva.ai/' },
  version: 'v0.1',
  publishedAt: '2020-11-18T00:00:00',
  lightThemeReport: true,
  disableDisplayAssetName: true,
  disableAppTitle: true,
};

// NOTE: These settings are not considered as part of templates
// These settings will be stored separately

export const DEFAULT_SETTINGS = {
  [APP_SETTING_KEY]: [],
  // NOTE: non-template settings
  [TEMPLATE_ID_KEY]: NO_TEMPLATE_SELECTED_ID,
};
