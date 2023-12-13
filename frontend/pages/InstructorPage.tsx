import { useEffect, useMemo, useState } from 'react';
import moment from 'moment';
import {
    Button,
    Card,
    CardHeader,
    CardBody,
    Chip,
    Input,
    Rating,
    Popover,
    PopoverContent,
    PopoverHandler,
    Typography
} from '@material-tailwind/react';
import { ChevronUpIcon, FunnelIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { createColumnHelper, flexRender, getCoreRowModel, RowModel, useReactTable } from '@tanstack/react-table';
import filter from '@fe/assets/filter.svg';
import { COURSE_LABEL_COLOR, AUDIENCE_LABEL_COLOR, COURSE_LABEL, AUDIENCE_LABEL } from '@fe/constants';
import { useReviewStore } from '@fe/states';
import { formatSecondsToHourMinute } from '@fe/utils';

export function InstructorPage() {
    const { listInstructorCourses, getListCoursesByInstructorId /*filterAndSortCourses*/ } = useReviewStore();
    const [rotate, setRotate] = useState<number[]>([0, 0, 0, 0, 0]);
    const [filterAndSortPayload, setFilterAndSortPayload] = useState<FilterAndSortPayload>({
        courseLabels: null,
        audiencelabels: null,
        sponsorName: null,
        sortColumns: ['updatedAt'],
        sortOrders: ['DESC'],
        minAverageRating: null
    });

    const handleCourseLabels = (courseLabel: string) => {
        setFilterAndSortPayload((prevFilterAndSortPayload) => {
            const idx = (prevFilterAndSortPayload.courseLabels || []).findIndex((item) => item === courseLabel);

            if (idx !== -1) {
                const newCourseLabels = (prevFilterAndSortPayload.courseLabels || []).slice();
                newCourseLabels.splice(idx, 1);
                return {
                    ...prevFilterAndSortPayload,
                    courseLabels: newCourseLabels.length > 0 ? newCourseLabels : null
                };
            } else {
                const newCourseLabels = [...(prevFilterAndSortPayload.courseLabels || []), courseLabel];
                return {
                    ...prevFilterAndSortPayload,
                    courseLabels: newCourseLabels
                };
            }
        });
    };

    // const handleAudienceLabels = (audienceLabel: string) => {
    //     setFilterAndSortPayload((prevFilterAndSortPayload) => {
    //         const idx = (prevFilterAndSortPayload.courseLabels || []).findIndex(
    //             (item) => item === audienceLabel
    //         );

    //         if (idx !== -1) {
    //             const newCourseLabels = (prevFilterAndSortPayload.courseLabels || []).slice();
    //             newCourseLabels.splice(idx, 1);
    //             return {
    //                 ...prevFilterAndSortPayload,
    //                 courseLabels: newCourseLabels.length > 0 ? newCourseLabels : null,
    //             };
    //         } else {
    //             const newCourseLabels = [...(prevFilterAndSortPayload.courseLabels || []), audienceLabel];
    //             return {
    //                 ...prevFilterAndSortPayload,
    //                 courseLabels: newCourseLabels,
    //             };
    //         }
    //     });
    // };

    useEffect(() => {
        // filterAndSortCourses(2, filterAndSortPayload);
        getListCoursesByInstructorId(2);
    }, [getListCoursesByInstructorId]);

    const columnHelper = createColumnHelper<InstructorCourse>();

    const columnDefs = useMemo(
        () => [
            columnHelper.accessor('courseName', {
                header: 'TÊN KHÓA HỌC',
                cell: (info) => (
                    <Typography placeholder='' variant='paragraph' color='blue-gray' className='font-medium'>
                        {info.getValue()}
                    </Typography>
                )
            }),
            columnHelper.accessor('courseLabel', {
                header: 'NHÃN',
                cell: (info) => (
                    <div className='w-max flex flex-col gap-1'>
                        <Chip
                            variant='ghost'
                            size='sm'
                            value={info.row.original.courseLabel}
                            color={COURSE_LABEL_COLOR[info.row.original.courseLabel]}
                            className='normal-case w-fit'
                        />
                        <Chip
                            variant='ghost'
                            size='sm'
                            value={info.row.original.audienceLabel}
                            color={AUDIENCE_LABEL_COLOR[info.row.original.audienceLabel]}
                            className='normal-case w-fit'
                        />
                    </div>
                )
            }),
            columnHelper.accessor('totalDuration', {
                header: 'THỜI LƯỢNG',
                cell: (info) => <Typography placeholder=''>{formatSecondsToHourMinute(info.getValue())}</Typography>
            }),
            columnHelper.accessor('priceDiscounted', {
                header: 'GIÁ TIỀN',
                cell: (info) =>
                    info.getValue() !== null ? (
                        <Chip color='amber' value={`${(info.getValue() ?? 0).toLocaleString('en-US')} VNĐ`} className='w-fit' />
                    ) : (
                        <div className='flex flex-col gap-1'>
                            <Chip color='teal' value='Miễn phí' className='w-fit normal-case' />
                            <Chip variant='ghost' value={`Được tài trợ bởi ${info.row.original.sponsorName}`} className='normal-case' />
                        </div>
                    )
            }),
            columnHelper.accessor('averageRating', {
                header: 'ĐIỂM RATING',
                cell: (info) => (
                    <div className='flex flex-col items-center gap-2 font-bold text-blue-gray-500'>
                        {Number(info.getValue()).toFixed(1)}
                        <Rating placeholder='' value={Math.floor(Number(Number(info.getValue()).toFixed(1)))} readonly />
                    </div>
                )
            }),
            columnHelper.accessor('updatedAt', {
                header: 'NGÀY CHỈNH SỬA',
                cell: (info) =>
                    info.getValue() && info.getValue().length > 0 ? (
                        <Typography placeholder=''>{moment.unix(moment(info.getValue()).unix()).format('DD/MM/YYYY')}</Typography>
                    ) : (
                        ''
                    )
            })
        ],
        [columnHelper]
    );

    const fileTable = useReactTable<InstructorCourse>({
        columns: columnDefs,
        data: listInstructorCourses ?? [],
        getCoreRowModel: getCoreRowModel<RowModel<InstructorCourse>>()
    });

    const FilterProject = () => {
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
                                    className={
                                        'rounded-full focus:ring-0 hover:bg-gray-200 normal-case w-fit' +
                                        ((filterAndSortPayload.courseLabels ?? []).includes(item) ? ' bg-teal-100' : '')
                                    }
                                    onClick={() => async () => {
                                        handleCourseLabels(item);
                                    }}
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
    };

    return (
        <Card placeholder='' className='h-full w-full'>
            <CardHeader placeholder='' floated={false} shadow={false} className='flex flex-col gap-4 rounded-none'>
                <div className='flex items-center'>
                    <Typography placeholder='' variant='h5' color='blue-gray'>
                        Danh sách các khóa học giảng dạy
                    </Typography>
                </div>
                <div className='flex flex-col items-center justify-between gap-4 md:flex-row'>
                    <FilterProject />
                    <div className='w-full md:w-72'>
                        <Input crossOrigin='' label='Search' icon={<MagnifyingGlassIcon className='h-5 w-5' />} />
                    </div>
                </div>
            </CardHeader>
            <CardBody placeholder='' className='overflow-scroll px-0'>
                <table className='w-full min-w-max table-auto text-left'>
                    <thead>
                        {fileTable.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id} className='bg-gray-100'>
                                {headerGroup.headers.map((header, index) => (
                                    <th
                                        key={header.id}
                                        colSpan={header.colSpan}
                                        className='border-b border-blue-gray-100 bg-gray/2 cursor-pointer border-y bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50'
                                        onClick={() =>
                                            setRotate((prevRotate) => {
                                                const newRotate = [...prevRotate];
                                                newRotate[index] = newRotate[index] === 0 ? 180 : 0;
                                                return newRotate;
                                            })
                                        }
                                    >
                                        {header.isPlaceholder ? null : (
                                            <Typography
                                                placeholder=''
                                                variant='small'
                                                color='blue-gray'
                                                className='flex items-center justify-between font-semibold leading-none opacity-70'
                                            >
                                                {flexRender(header.column.columnDef.header, header.getContext()) ?? ''}
                                                {index !== 1 && (
                                                    <ChevronUpIcon
                                                        strokeWidth={2}
                                                        className={`h-4 w-4 transform rotate-${rotate[index]}`}
                                                    />
                                                )}
                                            </Typography>
                                        )}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody className='bg-white'>
                        {listInstructorCourses &&
                            listInstructorCourses.length > 0 &&
                            fileTable.getRowModel().rows.map((row, index) => {
                                const isLast = index === fileTable.getRowModel().rows.length - 1;
                                const classes = isLast ? 'p-4' : 'p-4 border-b border-blue-gray-50';

                                return (
                                    <tr key={row.id} className='border-b-2'>
                                        {row.getAllCells().map((cell) => (
                                            <td key={cell.id} className={classes}>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </td>
                                        ))}
                                    </tr>
                                );
                            })}
                    </tbody>
                </table>
            </CardBody>
        </Card>
    );
}
