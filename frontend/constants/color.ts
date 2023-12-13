import { colors } from '@material-tailwind/react/types/generic';

export const CATEGORY_COLOR: Record<number, colors> = {
    0: 'orange',
    1: 'green',
    2: 'yellow',
    3: 'teal',
    4: 'blue',
    5: 'purple',
    6: 'red'
};

export const COURSE_LABEL_COLOR: Record<string, colors> = {
    Bestseller: 'deep-orange',
    HighestRated: 'amber',
    HotAndNew: 'lime',
    New: 'green'
};

export const AUDIENCE_LABEL_COLOR: Record<string, colors> = {
    AllLevels: 'teal',
    Beginner: 'cyan',
    Expert: 'blue',
    Intermediate: 'indigo'
};
