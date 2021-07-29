import { useState, useEffect, useRef } from 'react';
import { debounce, omit, isEqual, isEmpty, get } from 'lodash';

import { useTemplates } from './useTemplates';

import {
  TEMPLATE_STATUS,
  DEFAULT_SETTINGS,
  TEMPLATE_ID_KEY,
  DEFAULT_TEMPLATE_IDS,
  NO_TEMPLATE_SELECTED_ID,
} from './constants';

import { generateCopiedTemplateName } from './index';

// NOTE: App settings tend to change frequently, so make debounced func not to make api call a lot
const debouncedFunc = debounce(callback => {
  callback();
}, 1000);

// NOTE: All app settings
function useBhaTemplate(userId, onSelectTemplate) {
  const prevSettingsRef = useRef(null);
  const [template, setTemplate] = useState({});
  const [templates, templateUtils] = useTemplates(userId, NO_TEMPLATE_SELECTED_ID, setTemplate);
  
  // NOTE: Update template settings
  const storeTemplate = async () => {
    if (isEmpty(template)) return;
    const templateSettingsToSave = omit(template, TEMPLATE_ID_KEY);
    const currentTemplate = templates.find(item => item.id === template.templateId);
    const isUserTemplate =
      !Object.values(DEFAULT_TEMPLATE_IDS).includes(template.templateId) && !currentTemplate.shared;

    if (isUserTemplate) {
      templateUtils.updateTemplate(currentTemplate.id, {
        name: currentTemplate.name,
        settings: templateSettingsToSave,
      });
      templateUtils.setTemplateStatus(TEMPLATE_STATUS.SETTINGS_CHANGED);
    } else {
      // For default & shared template, duplicate it to user templates
      const newTemplateName = generateCopiedTemplateName(templates, template.templateId);
      templateUtils.createTemplate(
        {
          ...currentTemplate,
          name: newTemplateName,
          settings: templateSettingsToSave,
        },
        currentTemplate && currentTemplate.shared
          ? TEMPLATE_STATUS.SHARED_CANNOT_EDIT
          : TEMPLATE_STATUS.DEFAULT_DUPLICATED
      );
    }
  };

  useEffect(() => {
    // Do not make api call in the initial loading
    if (!isEmpty(template) && !isEqual(prevSettingsRef.current, template)) {
      // When template id is changed, just merge new template settings into app settings
      if (get(template, 'templateId') !== get(prevSettingsRef.current, 'templateId')) {
        const currentTemplate = templates.find(item => item.id === template.templateId);
        const newSettings = {
          ...DEFAULT_SETTINGS,
          templateId: template.templateId,
          ...(currentTemplate ? omit(currentTemplate.settings, TEMPLATE_ID_KEY) : {}), // template
        };
        setTemplate(newSettings);
        prevSettingsRef.current = newSettings;
        onSelectTemplate(newSettings.data);
        return;
      }
      // NOTE: Save template settings
      const newTemplateValue = omit(template, TEMPLATE_ID_KEY);
      const currentTemplate = templates.find(item => item.id === template.templateId);
      if (
        currentTemplate &&
        !isEqual(newTemplateValue, omit(currentTemplate.settings, TEMPLATE_ID_KEY))
      ) {
        debouncedFunc(storeTemplate);
      }

      prevSettingsRef.current = template;
    }
  }, [template]);

  const updateTemplateData = data => {
    setTemplate({
      ...template,
      data,
      templateId: data && !isEmpty(data) ? template.templateId : NO_TEMPLATE_SELECTED_ID,
    });
  };

  return {
    templates,
    templateUtils: {
      ...templateUtils,
      activeTemplateId: template.templateId,
    },
    updateTemplateData,
  };
}

export default useBhaTemplate;
