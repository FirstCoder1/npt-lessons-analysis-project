import { makeStyles } from '@material-ui/core';

export const useStyles = makeStyles(theme => ({
  paper: {
    marginLeft: 0,
    marginTop: 4,
  },
  templateContainer: {
    width: '100%',
  },
  templateIndicatorWrapper: {
    background: '#333333',
    borderRadius: '4px',
    padding: '0 8px 8px 8px',
    width: '100%',
    userSelect: 'none',
    '&:hover': {
      cursor: 'pointer',
    },
    '&:hover $templateIcons': {
      color: theme.palette.primary.main,
    },
  },
  // Just for styling
  templateIcons: {},
  templateIndicator: {
    display: 'flex',
    alignItems: 'center',
  },
  templateIndicatorTopLabel: {
    color: theme.isLightTheme ? '#000' : '#BDBDBD',
    fontSize: '11px',
    lineHeight: '16px',
    marginBottom: '4px',
  },
  templateIndicatorLabelActive: {
    color: theme.palette.primary.main,
  },
  templateIndicatorLabel: {
    fontSize: '14px',
    lineHeight: '16px',
    fontWeight: 500,
    marginLeft: '4px',
    width: '150px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  titleWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
  },
}));
