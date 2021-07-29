import { memo, useCallback, useState } from 'react';
import { get } from 'lodash';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core';
import { OffsetWellPickerV2 as OffsetWellPickerDialog } from '@corva/ui/components';

// import DesignApp from './DesignApp';
import LearnedApp from './LearnedApp';
import AppHeader from './AppHeader';

const useStyles = makeStyles({
  nptLessonApp: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'nowrap',
    position: 'relative',
  },
  frame: {
    display: 'flex',
    width: '100%',
    height: 'calc(100% - 55px)',
  },
});

function App(props) {
  const classes = useStyles();
  console.log('props=', props);
  const [offsetSetting, setOffsetSetting] = useState(props.savedOffsetSetting);
  const [isOpenOffsetsDialog, setIsOpenOffsetsDialog] = useState(false);
  const [offsetWellBha, setOffsetWellBha] = useState(null);

  const handleOpenOffsetsDialog = useCallback(() => {
    setIsOpenOffsetsDialog(true);
  }, []);

  const handleCloseOffsetsDialog = useCallback(() => {
    setIsOpenOffsetsDialog(false);
  }, []);

  const handleSaveOffsetSetting = useCallback(
    newOffsetSetting => {
      setOffsetSetting(newOffsetSetting);
      props.onSettingChange('savedOffsetSetting', newOffsetSetting);
      setIsOpenOffsetsDialog(false);
    },
    [props.onSettingChange]
  );

  const handleApplyBha = useCallback(bha => {
    setOffsetWellBha(bha);
  }, []);

  return (
    <div className={classes.nptLessonApp}>
      <AppHeader onOpenOffsetsDialog={handleOpenOffsetsDialog} offsetSetting={offsetSetting} />

      <div className={classes.frame}>
        <LearnedApp {...props} offsetSetting={offsetSetting} handleApplyBha={handleApplyBha} />
      </div>

      <OffsetWellPickerDialog
        currentUser={props.currentUser}
        companyId={get(props, ['well', 'companyId'])}
        offsetSetting={offsetSetting}
        isOpen={isOpenOffsetsDialog}
        onClose={handleCloseOffsetsDialog}
        onSave={handleSaveOffsetSetting}
      />
    </div>
  );
}

App.propTypes = {
  // savedIsDesignMode: PropTypes.bool,
  savedOffsetSetting: PropTypes.shape({}),
  currentUser: PropTypes.shape({}).isRequired,
  onSettingChange: PropTypes.func.isRequired,
};

App.defaultProps = {
  // savedIsDesignMode: true,
  savedOffsetSetting: {},
};

// Important: Do not change root component default export (App.js). Use it as container
//  for your App. It's required to make build and zip scripts work as expected;
export default memo(App);
