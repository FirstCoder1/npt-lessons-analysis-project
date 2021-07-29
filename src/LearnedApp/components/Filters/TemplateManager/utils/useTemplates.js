import { useState, useEffect } from 'react';
import { get } from 'lodash';
import Jsona from 'jsona';

import {
  setCurrentUserSettings,
  getUserSetting,
  getAppSettingsTemplates,
  postAppSettingsTemplate,
  patchAppSettingsTemplate,
  deleteAppSettingsTemplate,
  shareAppSettingsTemplate,
} from '@corva/ui/clients/jsonApi';

import {
  TEMPLATE_STATUS,
  DEFAULT_TEMPLATES,
  METADATA,
  DEFAULT_TEMPLATE_IDS,
  NO_TEMPLATE_SELECTED_ID,
} from './constants';

const DATA_KEY = 'bhp_optimization_templates';
const { appKey } = METADATA;
const dataFormatter = new Jsona();

// NOTE: Generate default templates according to the spec
function getDefaultTemplates() {
  /**
   *  All Primary Codes
   *    - By Default Top Panels should have All selected (there should be No Filters applied).
   *    - Chart View (Stacked)
   *    - All Primary Codes should be selected.
   *    - All Sub codes should not be selected.
   */
  const defaultTemplates = DEFAULT_TEMPLATES;

  return defaultTemplates;
}

export function useTemplates(userId, templateId, setTemplateValue) {
  const [templateStatus, setTemplateStatus] = useState(TEMPLATE_STATUS.LOADING);
  const [templates, setTemplates] = useState([]);
  
  // NOTE: We don't store templates in user settings
  // But we will try to make sure to persist previous user templates stored in user settings
  const tryRestorePreviousUserTemplates = async () => {
    try {
      const user = await getUserSetting(userId, DATA_KEY);
      const savedTemplates = get(user, DATA_KEY) || [];
      if (savedTemplates.length) {
        // Move previous settings to new db table
        await Promise.all(
          savedTemplates.map(item =>
            postAppSettingsTemplate(appKey, { name: item.name, settings: item.settings })
          )
        );
        // Remove templates from user settings
        await setCurrentUserSettings(userId, { [DATA_KEY]: [] });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const updateActiveTemplateId = nextActiveTemplateId => {
    setTemplateValue(prev => ({
      ...prev,
      templateId: nextActiveTemplateId,
    }));
  };

  const loadTemplates = async () => {
    setTemplateStatus(TEMPLATE_STATUS.LOADING);
    try {
      const res = await getAppSettingsTemplates(appKey);
      setTemplates([...getDefaultTemplates(), ...(res ? dataFormatter.deserialize(res) : [])]);
      setTemplateStatus(TEMPLATE_STATUS.LOADED);
    } catch (e) {
      console.error(e);
    }
  };

  const updateTemplate = async (id, updatedTemplate) => {
    setTemplateStatus(TEMPLATE_STATUS.LOADING);
    try {
      const res = await patchAppSettingsTemplate(appKey, id, {
        name: updatedTemplate.name,
        settings: updatedTemplate.settings,
      });
      setTemplates(prev =>
        prev.map(item => (item.id === id ? dataFormatter.deserialize(res) : item))
      );
      setTemplateStatus(TEMPLATE_STATUS.UPDATED);
    } catch (e) {
      console.error(e);
    }
  };

  const deleteTemplate = async id => {
    setTemplateStatus(TEMPLATE_STATUS.LOADING);
    try {
      await deleteAppSettingsTemplate(appKey, id);
      setTemplates(prev => prev.filter(item => item.id !== id));
      setTemplateStatus(TEMPLATE_STATUS.DELETED);
      if (templateId === id) {
        updateActiveTemplateId(NO_TEMPLATE_SELECTED_ID);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const createTemplate = async (newTemplate, setToActive = '') => {
    setTemplateStatus(TEMPLATE_STATUS.LOADING);
    try {
      const res = await postAppSettingsTemplate(appKey, {
        name: newTemplate.name,
        settings: newTemplate.settings,
      });
      const result = dataFormatter.deserialize(res);
      setTemplates(prev => prev.concat(result));
      if (setToActive.length) {
        updateActiveTemplateId(get(result, 'id'));
        setTemplateStatus(setToActive);
      } else {
        setTemplateStatus(TEMPLATE_STATUS.CREATED);
      }
      return get(result, 'id');
    } catch (e) {
      console.error(e);
    }
    return null;
  };

  const shareTemplate = async (temlateId, userIds) => {
    setTemplateStatus(TEMPLATE_STATUS.LOADING);
    try {
      await shareAppSettingsTemplate(appKey, temlateId, userIds);
      setTemplateStatus(TEMPLATE_STATUS.SHARED);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    async function handleInitialLoad() {
      await tryRestorePreviousUserTemplates();
      await loadTemplates();
    }
    handleInitialLoad();
  }, []);

  const isUserTemplate = templateId => {
    const currentTemplate = templates.find(item => item.id === templateId);
    const ret =
      !Object.values(DEFAULT_TEMPLATE_IDS).includes(templateId) && currentTemplate && !currentTemplate.shared;
    return ret;
  };

  return [
    templates,
    {
      templateStatus,
      createTemplate,
      updateTemplate,
      deleteTemplate,
      shareTemplate,
      updateActiveTemplateId,
      setTemplateStatus,
      isUserTemplate,
    },
  ];
}
