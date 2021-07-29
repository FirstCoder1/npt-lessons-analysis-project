import OffsetSelectionToolIcon from './icons/OffsetSelectionToolIcon';
import OneRunBhaFilterIcon from './icons/OneRunBhaFilterIcon';
import StepOutFilterIcon from './icons/StepOutFilterIcon';
import DirectionalProviderIcon from './icons/DirectionalProviderIcon';
import InclinationFilterIcon from './icons/InclinationFilterIcon';

export const features = [
  {
    title: 'Hazards & Unscheduled Events:',
    description:
      "Identify drilling Hazards and Unscheduled Events from historical wells in the are of operation of your Subject Well.",
    icon: OffsetSelectionToolIcon,
  },
  {
    title: 'Leassons Learned:',
    description:
      'Identify Lessons Learned from Historical Wells in the area of operation of your Subject Well.',
    icon: OneRunBhaFilterIcon,
  },
  {
    title: 'Filters:',
    description:
      'Filter to specific types of drilling hazards or Lessons Learned in specific hole sections or that occured during certain types of operations.',
    icon: StepOutFilterIcon,
  },
  {
    title: 'Traces:',
    description:
      'Navigate to the Lesson Learned in the wells Traces to review it.',
    icon: DirectionalProviderIcon,
  },
  {
    title: 'Well Schematic:',
    description:
      'Visualize offset well drilling hazards and lessons learned on a side-by-side Well Schematic.',
    icon: InclinationFilterIcon,
  },
];

export const VIDEO_URL =
  'https://api.qa.corva.ai/v1/file/download?file_name=corva/1610381575/Big_Buck_Bunny_360_10s_1MB.mp4&authorization=eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjo1MDIsImV4cCI6MTYxMDUwODkyOSwiY29tcGFueV9pZCI6MSwiaW1wZXJzb25hdG9yX2lkIjpudWxsfQ.K0O8pTX_zDDs5djvRpkMMZqZxSZ14MoQuf0MYhYfStk';
