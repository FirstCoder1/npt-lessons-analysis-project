import { memo, useState, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { debounce, get } from 'lodash';
import { Collapse, Typography, List, ListItem, Checkbox } from '@material-ui/core';
import { KeyboardDatePicker } from '@material-ui/pickers';
import { ExpandLess, ExpandMore, InfoOutlined, CalendarToday } from '@material-ui/icons';

import { useStyles } from './styles';
import TemplateManager from './TemplateManager';
import SingleSelect from './SingleSelect';
import RangeSlider from './RangeSlider';
import { TABLE_KIND, EVENTS_OPTIONS, NPT_FILTER_OTHER_OPTIONS } from '../../constants';

function Filters({
  currentUser,
  eventKind,
  nptTypeFilter,
  lessonsFilter,
  opFilter,
  depthFilter,
  dateFilter,
  tableSettings,
  onChangeTypeFilter,
  onChangeLessonsFilter,
  onChangeOpFilter,
  onChangeDepthFilter,
  onChangeDateFilter,
  onChangeEventKind,
  onChangeTableSettings,
}) {
  const classes = useStyles();
  const [isEventsOpen, setIsEventsOpen] = useState(true);
  const [isNPTFiltersOpen, setIsNPTFiltersOpen] = useState(true);
  const [isLessonsFiltersOpen, setIsLessonsFiltersOpen] = useState(true);
  const [isOperationalFiltersOpen, setIsOperationalFiltersOpen] = useState(true);
  const [nptOtherFilters, setNptOtherFilters] = useState(NPT_FILTER_OTHER_OPTIONS);
  const [isNPTOpen, isLessonsOpen] = useMemo(() => {
    // eslint-disable-next-line no-bitwise
    return [eventKind & TABLE_KIND.npt, eventKind & TABLE_KIND.lessons];
  }, [eventKind]);

  const handleToggleEvents = () => {
    setIsEventsOpen(prev => !prev);
  };

  const handleToggleEventSelect = value => {
    // eslint-disable-next-line no-bitwise
    const newEventKind = eventKind ^ value;
    onChangeEventKind(newEventKind);

    const newSetting = tableSettings.map(item => {
      // eslint-disable-next-line no-bitwise
      if (item.kind & newEventKind) {
        return { ...item, show: true, active: true };
      } else {
        return item.kind === TABLE_KIND.all ? item : { ...item, show: false, active: false };
      }
    });
    onChangeTableSettings(newSetting);
  };

  const handleToggleNPTFilters = () => {
    setIsNPTFiltersOpen(prev => !prev);
  };

  const handleChangeNptType = key => {
    const data =
      nptTypeFilter?.map(item => (item.key === key ? { ...item, checked: !item.checked } : item)) ||
      [];
    onChangeTypeFilter(data);
  };

  const handleNptOtherSelect = (key, value) => {
    const data = nptOtherFilters.map(item => (item.key === key ? { ...item, value } : item));
    setNptOtherFilters(data);
  };

  const handleToggleLessonsFilters = () => {
    setIsLessonsFiltersOpen(prev => !prev);
  };

  const handleLessonsSelect = (key, value) => {
    const data = lessonsFilter?.map(item => (item.key === key ? { ...item, value } : item));
    onChangeLessonsFilter(data);
  };

  const handleToggleOperationalFilters = () => {
    setIsOperationalFiltersOpen(prev => !prev);
  };

  const handleOperationalSelect = (key, value) => {
    const data = opFilter?.map(item => (item.key === key ? { ...item, value } : item));
    onChangeOpFilter(data);
  };

  const handleChangeStepOutFilter = useCallback(
    debounce((depthKey, isStart, value) => {
      const rangeKey = isStart ? 'startRange' : 'endRange';
      const data = {
        ...depthFilter,
        [depthKey]: {
          ...get(depthFilter, depthKey),
          [rangeKey]: value,
        },
      };
      onChangeDepthFilter(data);
    }, 500),
    [depthFilter]
  );

  const handleChangeDateFilter = (isStartDate, date) => {
    onChangeDateFilter(isStartDate ? [date, dateFilter[1]] : [dateFilter[0], date]);
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
          {EVENTS_OPTIONS.map(item => (
            <ListItem
              key={item.key}
              className={classes.listItem}
              onClick={() => handleToggleEventSelect(item.key)}
            >
              <Checkbox
                // eslint-disable-next-line no-bitwise
                checked={eventKind & item.key}
                color="primary"
              />
              <Typography className={classes.listItemLabel}>{item.title}</Typography>
              <InfoOutlined />
            </ListItem>
          ))}
        </List>
      </Collapse>

      <div
        className={isNPTOpen ? classes.filtersHeader : classes.filtersHeaderDisable}
        onClick={handleToggleNPTFilters}
      >
        NPT Filters
        {isNPTFiltersOpen && isNPTOpen ? (
          <ExpandLess className={classes.expandIcon} />
        ) : (
          <ExpandMore className={classes.expandIcon} />
        )}
      </div>
      <Collapse in={isNPTFiltersOpen && isNPTOpen}>
        <Typography className={classes.nptTypeLabel}>Type:</Typography>
        <List className={classes.list}>
          {nptTypeFilter?.map(item => (
            <ListItem
              key={item.key}
              className={classes.listItem}
              onClick={() => handleChangeNptType(item.key)}
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
              disabled
            />
          ))}
        </div>
      </Collapse>

      <div
        className={isLessonsOpen ? classes.filtersHeader : classes.filtersHeaderDisable}
        onClick={handleToggleLessonsFilters}
      >
        Lessons Learned Filters
        {isLessonsFiltersOpen && isLessonsOpen ? (
          <ExpandLess className={classes.expandIcon} />
        ) : (
          <ExpandMore className={classes.expandIcon} />
        )}
      </div>
      <Collapse in={isLessonsFiltersOpen && isLessonsOpen}>
        <div className={classes.singleSelectContainer}>
          {lessonsFilter?.map(item => (
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
          {opFilter?.map(item => (
            <SingleSelect
              key={item.key}
              title={item.title}
              options={item.array}
              currentValue={item.value}
              onChange={e => handleOperationalSelect(item.key, e.target.value)}
            />
          ))}
          {depthFilter && opFilter?.length === 4 && (
            <>
              <RangeSlider
                title={`Start Depth ${get(depthFilter, [opFilter[3].value, 'unit'])}`}
                depthKey={opFilter[3].value}
                isStart
                min={get(depthFilter, [opFilter[3].value, 'start'])[0]}
                max={get(depthFilter, [opFilter[3].value, 'start'])[1]}
                value={get(depthFilter, [opFilter[3].value, 'startRange'])}
                onChange={handleChangeStepOutFilter}
              />
              <RangeSlider
                title={`End Depth ${get(depthFilter, [opFilter[3].value, 'unit'])}`}
                depthKey={opFilter[3].value}
                min={get(depthFilter, [opFilter[3].value, 'end'])[0]}
                max={get(depthFilter, [opFilter[3].value, 'end'])[1]}
                value={get(depthFilter, [opFilter[3].value, 'endRange'])}
                onChange={handleChangeStepOutFilter}
              />
            </>
          )}
        </div>

        <div className={classes.dateContainer}>
          <KeyboardDatePicker
            autoOk
            variant="inline"
            format="MM/DD/YYYY"
            margin="normal"
            id="date-picker-inline"
            label="Start Date"
            value={dateFilter?.length === 2 ? dateFilter[0] : null}
            onChange={date => handleChangeDateFilter(true, date)}
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
            value={dateFilter?.length === 2 ? dateFilter[1] : null}
            onChange={date => handleChangeDateFilter(false, date)}
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
  eventKind: PropTypes.number.isRequired,
  nptTypeFilter: PropTypes.shape([]).isRequired,
  lessonsFilter: PropTypes.shape([]).isRequired,
  opFilter: PropTypes.shape([]).isRequired,
  depthFilter: PropTypes.shape({}).isRequired,
  dateFilter: PropTypes.shape([]).isRequired,
  currentUser: PropTypes.shape({}).isRequired,
  initialData: PropTypes.shape({}),
  tableSettings: PropTypes.shape([]).isRequired,
  coRelationFilters: PropTypes.shape({}).isRequired,
  onChangeTableSettings: PropTypes.func.isRequired,
  onChangeTypeFilter: PropTypes.func.isRequired,
  onChangeLessonsFilter: PropTypes.func.isRequired,
  onChangeOpFilter: PropTypes.func.isRequired,
  onChangeDepthFilter: PropTypes.func.isRequired,
  onChangeDateFilter: PropTypes.func.isRequired,
  onChangeEventKind: PropTypes.func.isRequired,
};

Filters.defaultProps = {
  initialData: null,
};

export default memo(Filters);
