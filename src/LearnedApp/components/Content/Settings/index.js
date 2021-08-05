import { useState, memo } from 'react';
import PropTypes from 'prop-types';
import { Typography, Button, makeStyles } from '@material-ui/core';
import { Close as CloseIcon } from '@material-ui/icons';

import TableSettings from './TableSettings';

const useStyles = makeStyles({
  backdrop: {
    position: 'fixed',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    zIndex: 1001,
  },
  root: {
    position: 'absolute',
    top: 32,
    right: 0,
    height: 550,
    width: 280,
    zIndex: 1001,
    background: '#414141',
    borderRadius: '4px',
    boxShadow: '0px 3px 10px rgba(0, 0, 0, 0.4)',
  },
  container: {
    position: 'relative',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    paddingTop: 16,
    paddingBottom: 52,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingLeft: 16,
    paddingRight: 16,
  },
  title: {
    fontSize: 20,
  },
  closeIcon: {
    fontSize: 20,
    cursor: 'pointer',
    color: '#bdbdbd',
  },
  content: {
    flex: 1,
    minHeight: 0,
    overflowY: 'auto',
    paddingLeft: 16,
    paddingRight: 16,
    paddingBottom: 16,
  },
  footer: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    right: 0,
    paddingRight: 16,
    paddingLeft: 16,
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    height: 52,
    background: '#414141',
    boxShadow: '0px -4px 10px rgba(0, 0, 0, 0.25)',
  },
  actionButton: {
    marginLeft: 16,
  },
});

function SettingsPopover(props) {
  const classes = useStyles();
  const [tableSettings, setTableSettings] = useState(props.tableSettings);

  const handleChangeTableSettings = newSettings => {
    setTableSettings(newSettings);
  };

  const handleSave = () => {
    props.onSave({
      tableSettings,
    });

    // props.showSuccessNotification('Settings has been successfully saved.');
  };

  return (
    <>
      <div className={classes.backdrop} onClick={props.onClose} />
      <div className={classes.root}>
        <div className={classes.container}>
          <div className={classes.header}>
            <Typography className={classes.title}>Settings</Typography>
            <CloseIcon className={classes.closeIcon} onClick={props.onClose} />
          </div>

          <div className={classes.content}>
            <TableSettings
              tableSettings={tableSettings}
              onChangeTableSettings={handleChangeTableSettings}
            />
          </div>
          <div className={classes.footer}>
            <Button color="primary" className={classes.actionButton} onClick={props.onClose}>
              Cancel
            </Button>
            <Button
              color="primary"
              variant="contained"
              onClick={handleSave}
              className={classes.actionButton}
            >
              Save
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

SettingsPopover.propTypes = {
  tableSettings: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default memo(SettingsPopover);
