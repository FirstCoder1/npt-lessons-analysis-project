import { useState, useMemo, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Typography } from '@material-ui/core';
import {
  Layers as LayersIcon,
  ArrowDropDown as ArrowDropDownIcon,
  ArrowDropUp as ArrowDropUpIcon,
} from '@material-ui/icons';
import { get } from 'lodash';
import { showSuccessNotification, showInfoNotification } from '@corva/ui/utils';
import { TemplatePopover } from '@corva/ui/components';

import { generateCopiedTemplateName, generateNewTemplateName } from './utils';
import useBhaTemplate from './utils/useBhaTemplate';
import {
  TEMPLATE_STATUS,
  DEFAULT_TEMPLATE_IDS,
  NO_TEMPLATE_SELECTED_NAME,
} from './utils/constants';
import { useStyles } from './styles';
import ConfirmationTemplateDialog from './ConfirmationTemplateDialog';

// Template getters
const getDefaultTemplates = templates =>
  templates.filter(({ id }) => Object.values(DEFAULT_TEMPLATE_IDS).includes(id));

const getUserTemplates = templates =>
  templates.filter(
    ({ id, shared }) => !Object.values(DEFAULT_TEMPLATE_IDS).includes(id) && !shared
  );

const getSharedTemplates = templates =>
  templates.filter(({ id, shared }) => !Object.values(DEFAULT_TEMPLATE_IDS).includes(id) && shared);

const UNSELECTED_ID = -10;

function TemplateManager({
  currentUser,
}) {
  const classes = useStyles();
  const indicatorRef = useRef(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedTemplateId, setSelectedTemplateId] = useState(UNSELECTED_ID);
  const [isSaveAsTemplate, setIsSaveAsTemplate] = useState(false);
  const [isConfirmDialog, setIsConfirmDialog] = useState(false);
  const [templateNameDuplicated, setTemplateNameDuplicated] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState('');

  const { templates, templateUtils } = useBhaTemplate(
    get(currentUser, 'id'),
  );

  const activeTemplateName = useMemo(() => {
    const currentTemplate = templates.find(item => item.id === templateUtils.activeTemplateId);
    return get(currentTemplate, 'name') || NO_TEMPLATE_SELECTED_NAME;
  }, [templates, templateUtils.activeTemplateId]);

  useEffect(() => {
    if (templateUtils.templateStatus === TEMPLATE_STATUS.DEFAULT_DUPLICATED) {
      showInfoNotification(
        <span>
          Default Template cannot be edited. <br />
          We duplicated it in My Templates list.
        </span>
      );
      templateUtils.setTemplateStatus(TEMPLATE_STATUS.CREATED);
    } else if (templateUtils.templateStatus === TEMPLATE_STATUS.SHARED_CANNOT_EDIT) {
      showInfoNotification(
        <span>
          Shared Templates cannot be edited. <br />
          We duplicated it in My Templates list.
        </span>
      );
      templateUtils.setTemplateStatus(TEMPLATE_STATUS.CREATED);
    }
  }, [templateUtils.templateStatus]);

  // NOTE: Event handlers
  const handlePopupOpen = e => {
    setAnchorEl(e.currentTarget);
  };

  const handlePopupClose = () => {
    setAnchorEl(null);
  };

  const getTemplateName = id => {
    return templates.find(item => item.id === id)?.name;
  };

  const handleSelectTemplate = nextActiveTemplateId => {
    setSelectedTemplateId(nextActiveTemplateId);
    setIsConfirmDialog(true);
  };

  const handleAddNewTemplate = async () => {
    const newTemplateName = generateNewTemplateName(templates);
    await templateUtils.createTemplate({
      name: newTemplateName,
      settings: settingsData,
    });
    showSuccessNotification(`Current view was saved successfully as "${newTemplateName}"`);
  };

  const handleTemplateCopy = async templateId => {
    const newTemplateName = generateCopiedTemplateName(templates, templateId);

    await templateUtils.createTemplate({
      name: newTemplateName,
      settings: settingsData,
    });
    showSuccessNotification(`"${getTemplateName(templateId)}" was copied`);
  };

  const handleTemplateDelete = async templateId => {
    await templateUtils.deleteTemplate(templateId);
    showSuccessNotification(`"${getTemplateName(templateId)}" was deleted`);
  };

  const handleTemplateEdit = async updatedTemplate => {
    await templateUtils.updateTemplate(updatedTemplate.id, updatedTemplate);
  };

  const handleTemplateShare = async (templateId, usersToShare) => {
    const userIds = usersToShare.map(user => user.id);
    const userNames = usersToShare.map(
      user => `${get(user, 'first_name')} ${get(user, 'last_name')}`
    );
    await templateUtils.shareTemplate(templateId, userIds);
    showSuccessNotification(
      `"${getTemplateName(templateId)}" was shared with ${userNames.join(', ')}`
    );
  };

  const handleSelectTemplateConfirm = ok => {
    if (ok) {
      templateUtils.updateActiveTemplateId(selectedTemplateId);
      showSuccessNotification('Template successfully applied to this BHA');
    }
    setIsConfirmDialog(false);
    setTemplateNameDuplicated(false);
    handleApplyTemplate();
  };

  const handleUpdateCurrentTemplate = ok => {
    handleUpdateTemplate(ok);
  };

  const handleTemplateNameEdit = value => {
    if (templates.find(item => item.name.toUpperCase() === value.toUpperCase())) {
      setTemplateNameDuplicated(true);
    } else if (templateNameDuplicated) {
      setTemplateNameDuplicated(false);
    }
    setNewTemplateName(value);
  };

  const handleNewTemplate = async ok => {
    if (ok && newTemplateName.length === 0) return;
    let templateId = null;
    if (ok) {
      templateId = await templateUtils.createTemplate({
        name: newTemplateName,
        settings: settingsData,
      });
      showSuccessNotification('New Template successfully saved & applied to this BHA');
    }
    setTemplateNameDuplicated(false);
    handleSaveAsTemplate();

    if (templateId) {
      templateUtils.updateActiveTemplateId(templateId);
      handleApplyTemplate();
    }
  };

  return (
    <div className={classes.templateContainer}>
      <ConfirmationTemplateDialog
        open={isConfirmDialog}
        title="Apply Template?"
        text={`Replace current BHA components & settings with "${getTemplateName(
          selectedTemplateId
        )}" template components & settings?`}
        okText="Apply"
        handleClose={() => handleSelectTemplateConfirm(false)}
        handleCancel={() => handleSelectTemplateConfirm(false)}
        handleOk={() => handleSelectTemplateConfirm(true)}
      />

      <ConfirmationTemplateDialog
        open={false}
        title="Update Template?"
        text={`You applied "${getTemplateName(
          templateUtils.activeTemplateId
        )}" template to this BHA and made some changes. Update template or NOT?`}
        okText="Don't Update"
        cancelText="Update"
        handleClose={() => handleUpdateCurrentTemplate(false)}
        handleOk={() => handleUpdateCurrentTemplate(false)}
        handleCancel={() => handleUpdateCurrentTemplate(true)}
      />

      <ConfirmationTemplateDialog
        open={isSaveAsTemplate}
        title="New Template"
        text="Current BHA and its settings will be saved as a new template."
        okText="Save"
        confirmationText="Template Name"
        handleClose={() => handleNewTemplate(false)}
        handleCancel={() => handleNewTemplate(false)}
        handleOk={() => handleNewTemplate(true)}
        onChangeEdit={handleTemplateNameEdit}
        nameDuplicated={templateNameDuplicated}
      />

      <div
        ref={indicatorRef}
        className={classes.templateIndicatorWrapper}
        onClick={handlePopupOpen}
      >
        <div className={classes.templateIndicator}>
          <LayersIcon
            fontSize="small"
            className={classes.templateIcons}
            {...(anchorEl && { color: 'primary' })}
          />
          <Typography className={classes.templateIndicatorLabel}>{activeTemplateName}</Typography>
          {anchorEl ? (
            <ArrowDropUpIcon color="primary" className={classes.templateIcons} />
          ) : (
            <ArrowDropDownIcon className={classes.templateIcons} />
          )}
        </div>
      </div>

      <TemplatePopover
        className={classes.templatePopover}
        currentUser={currentUser}
        classes={{ paper: classes.paper }}
        loading={templateUtils.templateStatus === TEMPLATE_STATUS.LOADING}
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handlePopupClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        templates={templates}
        activeTemplateName={activeTemplateName}
        getDefaultTemplates={getDefaultTemplates}
        getUserTemplates={getUserTemplates}
        getSharedTemplates={getSharedTemplates}
        activeTemplateId={templateUtils.activeTemplateId}
        onActiveTemplateChange={handleSelectTemplate}
        onAddNewTemplate={handleAddNewTemplate}
        onTemplateDelete={handleTemplateDelete}
        onTemplateCopy={handleTemplateCopy}
        onTemplateEdit={handleTemplateEdit}
        onTemplateShare={handleTemplateShare}
        // hasNameSlot={hasNameSlot}
        // renderSlot={renderSlot}
      />
    </div>
  );
}

TemplateManager.propTypes = {
  templates: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  templateUtils: PropTypes.shape({
    templateStatus: PropTypes.string,
    createTemplate: PropTypes.func,
    updateTemplate: PropTypes.func,
    deleteTemplate: PropTypes.func,
    shareTemplate: PropTypes.func,
    setTemplateStatus: PropTypes.func,
    updateActiveTemplateId: PropTypes.func,
    activeTemplateId: PropTypes.number,
  }).isRequired,
  currentUser: PropTypes.shape({}).isRequired,
  hasNameSlot: PropTypes.bool.isRequired,
  renderSlot: PropTypes.func.isRequired,
  settingsData: PropTypes.shape({}).isRequired,
  isUpdateTemplate: PropTypes.bool.isRequired,
  handleUpdateTemplate: PropTypes.func.isRequired,
  isSaveAsTemplate: PropTypes.bool.isRequired,
  handleSaveAsTemplate: PropTypes.func.isRequired,
  handleApplyTemplate: PropTypes.func.isRequired,
};

export default TemplateManager;
