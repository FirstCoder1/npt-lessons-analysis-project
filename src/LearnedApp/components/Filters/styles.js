import { makeStyles } from '@material-ui/core';

export const useStyles = makeStyles({
  template: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px 0 12px 0',
  },
  templateTitle: {
    width: '100%',
    textAlign: 'left',
    fontSize: '12px',
    lineHeight: '17px',
    paddingBottom: '10px',
  },
  templateContainer: {
    borderTopLeftRadius: '8px 8px',
    borderTopRightRadius: '8px 8px',
    background: '#333333',
  },
  templateLabel: {
    marginTop: '8px',
    marginLeft: '12px',
    fontSize: '11px',
    lineHeight: '17px',
    paddingBottom: '4px',
  },
  filtersHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: '12px',
    paddingBottom: '2px',
    cursor: 'pointer',
  },
  filtersHeaderDisable: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingTop: '12px',
    paddingBottom: '2px',
    color: 'grey',
    cursor: 'default',
  },
  filtersBody: {
    paddingLeft: '8px',
    paddingRight: '8px',
  },
  expandIcon: {
    color: 'grey',
    '&:hover': {
      color: '#fff',
    },
  },
  list: {
    width: '100%',
  },
  listItem: {
    padding: 0,
    cursor: 'pointer',
  },
  listItemLabel: {
    width: '200px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    fontSize: '16px',
  },
  nptTypeLabel: {
    marginLeft: '10px',
    marginTop: '12px',
  },
  nptTypeIcon: {
    width: '15px',
    height: '12px',
    marginRight: '10px',
    borderRadius: '2px',
  },
  singleSelectContainer: {
    padding: '0 12px 12px 12px',
  },
  dateContainer: {
    paddingLeft: '12px',
    paddingRight: '12px',
  },
  datePickerEventIcon: {
    width: '16px',
    height: '16px',
  },
});
