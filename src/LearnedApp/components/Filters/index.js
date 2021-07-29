import { memo, useState } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { Collapse, makeStyles, Typography, List, ListItem, Checkbox } from '@material-ui/core';
import { KeyboardDatePicker } from '@material-ui/pickers';
import { ExpandLess, ExpandMore, InfoOutlined, CalendarToday } from '@material-ui/icons';

import TemplateManager from './TemplateManager';
import SingleSelect from './SingleSelect';
import RangeSlider from './RangeSlider';
import {
  EVENTS_OPTIONS,
  NPT_FILTER_TYPE_OPTIONS,
  NPT_FILTER_OTHER_OPTIONS,
  LESSONS_FILTER_OPTIONS,
  OPERATIONAL_FILTER_OPTIONS,
} from '../../constants';

const useStyles = makeStyles({
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: '12px',
    paddingBottom: '2px',
    cursor: 'pointer',
    color: 'grey',
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

function Filters({
  currentUser,
  initialData,
  coRelationFilters,
  stepOutFilter,
  stepOutRange,
  mdFilter,
  mdRange,
  inclinationFilter,
  inclinationRange,
  onChangeEventKind,
  oneRunBhaFilter,
  onChangeStepOutFilter,
  onChangeMdFilter,
  onChangeInclinationFilter,
  onChangeOneRunBhaFilter,
}) {
  const classes = useStyles();
  const [isEventsOpen, setIsEventsOpen] = useState(true);
  const [isNPTFiltersOpen, setIsNPTFiltersOpen] = useState(true);
  const [isLessonsFiltersOpen, setIsLessonsFiltersOpen] = useState(true);
  const [isOperationalFiltersOpen, setIsOperationalFiltersOpen] = useState(true);
  const [events, setEvents] = useState(EVENTS_OPTIONS);
  const [nptTypeFilters, setNptTypeFilters] = useState(NPT_FILTER_TYPE_OPTIONS);
  const [nptOtherFilters, setNptOtherFilters] = useState(NPT_FILTER_OTHER_OPTIONS);
  const [lessonsFilters, setLessonsFilters] = useState(LESSONS_FILTER_OPTIONS);
  const [operationalFilters, setOperationalFilters] = useState(OPERATIONAL_FILTER_OPTIONS);
  const [startDate, handleStartDateChange] = useState(null);
  const [endDate, handleEndDateChange] = useState(null);

  const handleToggleEvents = () => {
    setIsEventsOpen(prev => !prev);
  };

  const handleToggleEventSelect = key => {
    const data = events.map(item =>
      item.key === key ? { ...item, checked: !item.checked } : item
    );
    setEvents(data);
    if (data[0].checked && data[1].checked) {
      onChangeEventKind('all');
    } else if (data[0].checked) {
      onChangeEventKind('npt');
    } else if (data[1].checked) {
      onChangeEventKind('lessons');
    } else {
      onChangeEventKind('none');
    }
  };

  const handleToggleNPTFilters = () => {
    setIsNPTFiltersOpen(prev => !prev);
  };

  const handleNptTypeSelect = key => {
    const data = nptTypeFilters.map(item =>
      item.key === key ? { ...item, checked: !item.checked } : item
    );
    setNptTypeFilters(data);
  };

  const handleNptOtherSelect = (key, value) => {
    const data = nptOtherFilters.map(item => (item.key === key ? { ...item, value } : item));
    setNptOtherFilters(data);
  };

  const handleToggleLessonsFilters = () => {
    setIsLessonsFiltersOpen(prev => !prev);
  };

  const handleLessonsSelect = (key, value) => {
    const data = lessonsFilters.map(item => (item.key === key ? { ...item, value } : item));
    setLessonsFilters(data);
  };

  const handleToggleOperationalFilters = () => {
    setIsOperationalFiltersOpen(prev => !prev);
  };

  const handleOperationalSelect = (key, value) => {
    const data = operationalFilters.map(item => (item.key === key ? { ...item, value } : item));
    setOperationalFilters(data);
  };

  return (
    <>
      <div className={classes.template}>
        <Typography className={classes.templateTitle}>
          Use templates to speed up your work with Filters Settings.
        </Typography>
        <div className={classes.templateContainer}>
          <Typography className={classes.templateLabel}>Templates</Typography>
          <TemplateManager currentUser={currentUser} />
        </div>
      </div>
      <div className={classes.filtersHeader} onClick={handleToggleEvents}>
        Events
        {isEventsOpen ? (
          <ExpandLess className={classes.expandIcon} />
        ) : (
          <ExpandMore className={classes.expandIcon} />
        )}
      </div>
      <Collapse in={isEventsOpen}>
        <List className={classes.list}>
          {events.map(item => (
            <ListItem
              key={item.key}
              className={classes.listItem}
              onClick={() => handleToggleEventSelect(item.key)}
            >
              <Checkbox checked={item.checked} color="primary" />
              <Typography className={classes.listItemLabel}>{item.title}</Typography>
              <InfoOutlined />
            </ListItem>
          ))}
        </List>
      </Collapse>

      <div
        className={events[0].checked ? classes.filtersHeader : classes.filtersHeaderDisable}
        onClick={handleToggleNPTFilters}
      >
        NPT Filters
        {isNPTFiltersOpen && events[0].checked ? (
          <ExpandLess className={classes.expandIcon} />
        ) : (
          <ExpandMore className={classes.expandIcon} />
        )}
      </div>
      <Collapse in={isNPTFiltersOpen && events[0].checked}>
        <Typography className={classes.nptTypeLabel}>Type:</Typography>
        <List className={classes.list}>
          {nptTypeFilters.map(item => (
            <ListItem
              key={item.key}
              className={classes.listItem}
              onClick={() => handleNptTypeSelect(item.key)}
            >
              <Checkbox checked={item.checked} color="primary" />
              <Typography className={classes.listItemLabel}>{item.title}</Typography>
              <div className={classes.nptTypeIcon} style={{ background: item.color }} />
            </ListItem>
          ))}
        </List>

        <div className={classes.singleSelectContainer}>
          {nptOtherFilters.map(item => (
            <SingleSelect
              key={item.key}
              title={item.title}
              options={item.array}
              currentValue={item.value}
              onChange={e => handleNptOtherSelect(item.key, e.target.value)}
            />
          ))}
        </div>
      </Collapse>

      <div
        className={events[1].checked ? classes.filtersHeader : classes.filtersHeaderDisable}
        onClick={handleToggleLessonsFilters}
      >
        Lessons Learned Filters
        {isLessonsFiltersOpen && events[1].checked ? (
          <ExpandLess className={classes.expandIcon} />
        ) : (
          <ExpandMore className={classes.expandIcon} />
        )}
      </div>
      <Collapse in={isLessonsFiltersOpen && events[1].checked}>
        <div className={classes.singleSelectContainer}>
          {lessonsFilters.map(item => (
            <SingleSelect
              key={item.key}
              title={item.title}
              options={item.array}
              currentValue={item.value}
              onChange={e => handleLessonsSelect(item.key, e.target.value)}
            />
          ))}
        </div>
      </Collapse>

      <div className={classes.filtersHeader} onClick={handleToggleOperationalFilters}>
        Operational Filters
        {isOperationalFiltersOpen ? (
          <ExpandLess className={classes.expandIcon} />
        ) : (
          <ExpandMore className={classes.expandIcon} />
        )}
      </div>
      <Collapse in={isOperationalFiltersOpen}>
        <div className={classes.singleSelectContainer}>
          {operationalFilters.map(item => (
            <SingleSelect
              key={item.key}
              title={item.title}
              options={item.array}
              currentValue={item.value}
              onChange={e => handleOperationalSelect(item.key, e.target.value)}
            />
          ))}
          <RangeSlider
            title="Start Depth (ft, MD)"
            min={0}
            max={89}
            value={[12, 56]}
            onChange={onChangeStepOutFilter}
          />
          <RangeSlider
            title="End Depth (ft, MD)"
            min={0}
            max={89}
            value={[12, 56]}
            onChange={onChangeStepOutFilter}
          />
        </div>

        <div className={classes.dateContainer}>
          <KeyboardDatePicker
            autoOk
            variant="inline"
            format="MM/DD/YYYY"
            margin="normal"
            id="date-picker-inline"
            label="Start Date"
            value={startDate}
            onChange={date => handleStartDateChange(date)}
            keyboardIcon={<CalendarToday className={classes.datePickerEventIcon} />}
            KeyboardButtonProps={{
              'aria-label': 'change date',
            }}
          />
          <KeyboardDatePicker
            autoOk
            variant="inline"
            format="MM/DD/YYYY"
            margin="normal"
            id="date-picker-inline"
            label="End Date"
            value={endDate}
            onChange={date => handleEndDateChange(date)}
            keyboardIcon={<CalendarToday className={classes.datePickerEventIcon} />}
            KeyboardButtonProps={{
              'aria-label': 'change date',
            }}
          />
        </div>
      </Collapse>
    </>
  );
}

Filters.propTypes = {
  currentUser: PropTypes.shape({}).isRequired,
  initialData: PropTypes.shape({}),
  coRelationFilters: PropTypes.shape({}).isRequired,
  stepOutFilter: PropTypes.arrayOf(PropTypes.number),
  stepOutRange: PropTypes.arrayOf(PropTypes.number),
  mdFilter: PropTypes.arrayOf(PropTypes.number),
  mdRange: PropTypes.arrayOf(PropTypes.number),
  inclinationFilter: PropTypes.arrayOf(PropTypes.number),
  inclinationRange: PropTypes.arrayOf(PropTypes.number),
  onChangeEventKind: PropTypes.func.isRequired,
  oneRunBhaFilter: PropTypes.shape({}).isRequired,
  onChangeStepOutFilter: PropTypes.func.isRequired,
  onChangeMdFilter: PropTypes.func.isRequired,
  onChangeInclinationFilter: PropTypes.func.isRequired,
  onChangeOneRunBhaFilter: PropTypes.func.isRequired,
};

Filters.defaultProps = {
  initialData: null,
  stepOutFilter: null,
  stepOutRange: null,
  mdFilter: null,
  mdRange: null,
  inclinationFilter: null,
  inclinationRange: null,
};

export default memo(Filters);
