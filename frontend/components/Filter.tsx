import { Button, Chip, Popover, PopoverHandler, PopoverContent, Typography } from '@material-tailwind/react';
import { FunnelIcon } from '@heroicons/react/24/outline';
import filter from '@fe/assets/filter.svg';
import { COURSE_LABEL, AUDIENCE_LABEL, COURSE_LABEL_COLOR, AUDIENCE_LABEL_COLOR } from '@fe/constants';

export function FilterProject() {
    return (
        <Popover placement='bottom-start'>
            <PopoverHandler>
                <Chip
                    variant='ghost'
                    color='teal'
                    className='cursor-pointer hover:bg-teal-100 p-2'
                    value={
                        <div className='flex items-center gap-1'>
                            <FunnelIcon color='teal' className='w-6 h-6' />
                            <Typography placeholder='' variant='small' color='teal' className='font-bold normal-case'>
                                Lọc khóa học
                            </Typography>
                        </div>
                    }
                />
            </PopoverHandler>
            <PopoverContent placeholder='' className='grid gap-2 w-76'>
                <div className='grid gap-2'>
                    <Typography placeholder='' variant='h6' color='blue-gray'>
                        Nhãn khóa học
                    </Typography>
                    <div className='flex gap-1 justify-items-center'>
                        {COURSE_LABEL.map((item, index) => (
                            <Button
                                key={index}
                                tabIndex={-1}
                                placeholder=''
                                variant='outlined'
                                size='sm'
                                color={COURSE_LABEL_COLOR[item as CourseLabel]}
                                className='rounded-full focus:ring-0 hover:bg-gray-200 normal-case w-fit'
                            >
                                {item}
                            </Button>
                        ))}
                    </div>
                </div>
                <div className='grid gap-2'>
                    <Typography placeholder='' variant='h6' color='blue-gray'>
                        Nhãn đối tượng
                    </Typography>
                    <div className='flex gap-1 justify-items-center'>
                        {AUDIENCE_LABEL.map((item, index) => (
                            <Button
                                key={index}
                                tabIndex={-1}
                                placeholder=''
                                variant='outlined'
                                size='sm'
                                color={AUDIENCE_LABEL_COLOR[item as AudienceLabel]}
                                className='rounded-full focus:ring-0 hover:bg-gray-200 w-fit'
                            >
                                {item}
                            </Button>
                        ))}
                    </div>
                </div>
                <div className='flex items-center gap-2 p-1 w-fit cursor-pointer hover:bg-red-100 hover:rounded-full hover:border hover:border-red-200 active:border-red-300 active:bg-red-200'>
                    <img src={filter} alt='Funnel Slash' />
                    <span className='text-red-500 text-base font-medium'>Bỏ lựa chọn</span>
                </div>
            </PopoverContent>
        </Popover>
    );
}
