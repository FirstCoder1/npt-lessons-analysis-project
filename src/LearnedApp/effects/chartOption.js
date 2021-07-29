import { useEffect, useState } from 'react';
import { get } from 'lodash';

import { getUnit } from '../utils/unitConversion';

const DEFAULT_CHART_OPTION = {
  animation: false,
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'none',
    },
    confine: true,
    backgroundColor: 'rgba(59,59,59,0.9)',
    textStyle: {
      color: '#bdbdbd',
      fontSize: 11,
    },
  },

  legend: { show: false },

  grid: {
    left: 5,
    right: 0,
    bottom: 10,
    top: 10,
    containLabel: true,
  },

  xAxis: [],
  yAxis: [],
  series: [],
};

const DEFAULT_YAXIS_OPTION = {
  nameTextStyle: {
    color: '#ccc',
  },
  axisTick: { show: false },
  axisLabel: {
    color: '#ccc',
    formatter: value => (Math.abs(value) < 1000 ? value : `${value / 1000}k`),
  },
  splitLine: {
    lineStyle: {
      color: 'rgb(60, 60, 60)',
    },
  },
  scale: true,
};

const EMPHASIS_BOX_COLOR = '#ffc000';

function formatNumber(value, precision) {
  return Number.isFinite(parseFloat(value)) ? parseFloat(value).toFixed(precision) : '-';
}

function drawMedianLine(params, api) {
  // NOTE: Median line should be 60% of whisker box
  const bandWidth = api.size([0, 0])[0] * 0.6;
  const point = api.coord([api.value(0), api.value(1)]);

  return {
    type: 'line',
    shape: {
      x1: point[0] - bandWidth / 2,
      x2: point[0] + bandWidth / 2,
      y1: point[1],
      y2: point[1],
    },
    z2: 1000,
    style: api.style({
      fill: null,
      stroke: '#fff',
      lineWidth: 2,
    }),
  };
}

function getChartOptionForWhiskerBoxplot(chartKey, chartColor, data) {
  const metricsKey = chartKey.split('.')[0];
  const metricsUnit = getUnit(chartKey);

  const xAxis = [
    {
      data: data.map(item => `${item.wellName} (BHA #${item.bhaId})`),
      axisLabel: { show: false },
      axisTick: { show: false },
      axisLine: {
        lineStyle: {
          color: '#ddd',
        },
      },
    },
  ];

  const yAxis = [
    {
      ...DEFAULT_YAXIS_OPTION,
    },
  ];

  const tooltip = {
    ...DEFAULT_CHART_OPTION.tooltip,
    formatter: params => {
      const { wellName, bhaId, median } = params[0].data.meta;

      return `<div style="color: #fff;">${wellName} (BHA #${bhaId})</div>
        <div>P95: ${formatNumber(params[0].value[4], 2)} ${metricsUnit}</div>
        <div>P80: ${formatNumber(params[0].value[2], 2)} ${metricsUnit}</div>
        <div>P50: ${formatNumber(median, 2)} ${metricsUnit}</div>
        <div>P20: ${formatNumber(params[0].value[1], 2)} ${metricsUnit}</div>
        <div>P5: ${formatNumber(params[0].value[3], 2)} ${metricsUnit}</div>`;
    },
  };

  const series = [
    {
      name: 'Whisker Box Plot',
      type: 'candlestick',
      data: data.map(item => ({
        value: [
          get(item[metricsKey], 'p20'),
          get(item[metricsKey], 'p80'),
          get(item[metricsKey], 'p5'),
          get(item[metricsKey], 'p95'),
        ],
        itemStyle: {
          normal: {
            color: chartColor,
            color0: chartColor,
            borderColor: chartColor,
            borderColor0: chartColor,
          },
          emphasis: {
            color: EMPHASIS_BOX_COLOR,
            color0: EMPHASIS_BOX_COLOR,
            borderColor: EMPHASIS_BOX_COLOR,
            borderColor0: EMPHASIS_BOX_COLOR,
          },
        },
        meta: {
          wellName: item.wellName,
          bhaId: item.bhaId,
          median: get(item[metricsKey], 'median'),
        },
      })),
    },
    {
      name: 'Median Line',
      type: 'custom',
      renderItem: drawMedianLine,
      tooltip: {
        show: false,
        trigger: 'none',
        triggerOn: 'none',
      },
      silent: true,
      data: data.map((item, index) => [index, get(item[metricsKey], 'median')]),
    },
  ];

  return {
    ...DEFAULT_CHART_OPTION,
    xAxis,
    yAxis,
    tooltip,
    series,
  };
}

function getChartOptionForBoxPlot(chartKey, chartColor, data) {
  const metricsUnit = getUnit(chartKey);

  const xAxis = [
    {
      data: data.map(item => `${item.wellName} (BHA #${item.bhaId})`),
      axisLabel: { show: false },
      axisTick: { show: false },
      axisLine: {
        lineStyle: {
          color: '#ddd',
        },
      },
    },
  ];

  const yAxis = [
    {
      ...DEFAULT_YAXIS_OPTION,
    },
  ];

  const tooltip = {
    ...DEFAULT_CHART_OPTION.tooltip,
    formatter: params => {
      const { wellName, bhaId } = params[0].data.meta;
      return `<div style="color: #fff">${wellName} (BHA #${bhaId})</div>
      <div>${formatNumber(params[0].value[1], 2)} ${metricsUnit}</div>`;
    },
  };

  const series = [
    {
      name: 'Box Plot',
      type: 'bar',
      barWidth: '50%',
      data: data.map(item => ({
        value: [`${item.wellName} (BHA #${item.bhaId})`, item[chartKey]],
        itemStyle: {
          normal: {
            color: chartColor,
          },
          emphasis: {
            color: EMPHASIS_BOX_COLOR,
          },
        },
        meta: {
          wellName: item.wellName,
          bhaId: item.bhaId,
        },
      })),
    },
  ];

  return {
    ...DEFAULT_CHART_OPTION,
    xAxis,
    yAxis,
    tooltip,
    series,
  };
}

export function useChartOption(chartKey, chartColor, data) {
  const [chartOption, setChartOption] = useState(DEFAULT_CHART_OPTION);

  useEffect(() => {
    if (!data || data.length === 0) {
      setChartOption(DEFAULT_CHART_OPTION);
      return;
    }

    const option = chartKey.includes('median')
      ? getChartOptionForWhiskerBoxplot(chartKey, chartColor, data)
      : getChartOptionForBoxPlot(chartKey, chartColor, data);

    setChartOption(option);
  }, [chartKey, chartColor, data]);

  return chartOption;
}
