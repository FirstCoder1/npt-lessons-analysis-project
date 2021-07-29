import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core';

import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';

const PAGE_NAME = 'confirmationDialog';

const useStyles = makeStyles({
  dialogContent: {
    width: '462px',
  },
  actionButton: { marginLeft: 15 },
  editText: {
    height: '66px',
    marginTop: '16px',
    fontSize: '16px',
  },
});

function ConfirmationTemplateDialog(props) {
  const classes = useStyles();

  const handleChangeEdit = e => {
    props.onChangeEdit(e.target.value);
  };

  return (
    <Dialog
      open={props.open}
      onClose={props.handleClose}
      aria-labelledby="confirmation-dialog-title"
      classes={{ paper: classes.paper }}
    >
      <DialogTitle id="confirmation-dialog-title">{props.title}</DialogTitle>

      <DialogContent className={classes.dialogContent}>
        <DialogContentText>
          <Typography variant="body2" className={classes.content}>
            {props.text}
          </Typography>
          {props.confirmationText && (
            <TextField
              fullWidth
              data-testid={`${PAGE_NAME}_input`}
              onChange={handleChangeEdit}
              className={classes.editText}
              error={props.nameDuplicated}
              label={props.confirmationText}
              helperText={props.nameDuplicated && 'The Template with such name already exists'}
            />
          )}
        </DialogContentText>
      </DialogContent>
      <DialogActions className={classes.actions}>
        {props.isShowCancel && (
          <Button
            variant="text"
            data-testid={`${PAGE_NAME}_cancelButton`}
            className={classes.actionButton}
            onClick={props.handleCancel}
            color="primary"
          >
            {props.cancelText}
          </Button>
        )}
        <Button
          variant="contained"
          data-testid={`${PAGE_NAME}_confirmButton`}
          className={classes.actionButton}
          onClick={props.handleOk}
          disabled={props.nameDuplicated}
          color="primary"
        >
          {props.okText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

ConfirmationTemplateDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  confirmationText: PropTypes.string,
  handleClose: PropTypes.func,
  handleCancel: PropTypes.func,
  handleOk: PropTypes.func,
  okText: PropTypes.string,
  cancelText: PropTypes.string,
  isShowCancel: PropTypes.bool,
  onChangeEdit: PropTypes.func.isRequired,
  nameDuplicated: PropTypes.bool,
};

ConfirmationTemplateDialog.defaultProps = {
  confirmationText: null,
  handleClose: undefined,
  handleCancel: undefined,
  handleOk: undefined,
  okText: 'Ok',
  cancelText: 'Cancel',
  isShowCancel: true,
  nameDuplicated: false,
};

export default ConfirmationTemplateDialog;
