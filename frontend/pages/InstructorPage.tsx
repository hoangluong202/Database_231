import { useMemo } from 'react';
import moment from 'moment';
import { Card, CardHeader, CardBody, Chip, Input, Rating, Typography } from '@material-tailwind/react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { createColumnHelper, flexRender, getCoreRowModel, RowModel, useReactTable } from '@tanstack/react-table';
import { FilterProject } from '@fe/components';
import { COURSE_LABEL_COLOR, AUDIENCE_LABEL_COLOR } from '@fe/constants';
import { formatSecondsToHourMinute } from '@fe/utils';

export function InstructorPage() {
    const mockData = [
        {
            courseId: 1,
            courseName: 'HTML for Beginners',
            courseLabel: 'HighestRated' as CourseLabel,
            audienceLabel: 'Beginner' as AudienceLabel,
            updatedAt: '1/1/2024',
            totalDuration: 2316603,
            sponsorName: 'Google',
            priceDiscounted: null,
            averageRating: 4.7
        },
        {
            courseId: 1,
            courseName: 'HTML for Beginners',
            courseLabel: 'HighestRated' as CourseLabel,
            audienceLabel: 'Beginner' as AudienceLabel,
            updatedAt: '1/1/2024',
            totalDuration: 2316603,
            sponsorName: 'Google',
            priceDiscounted: null,
            averageRating: 4.7
        },
        {
            courseId: 1,
            courseName: 'HTML for Beginners',
            courseLabel: 'HighestRated' as CourseLabel,
            audienceLabel: 'Beginner' as AudienceLabel,
            updatedAt: '1/1/2024',
            totalDuration: 2316603,
            sponsorName: 'Google',
            priceDiscounted: null,
            averageRating: 4.7
        },
        {
            courseId: 1,
            courseName: 'HTML for Beginners',
            courseLabel: 'HighestRated' as CourseLabel,
            audienceLabel: 'Beginner' as AudienceLabel,
            updatedAt: '1/1/2024',
            totalDuration: 2316603,
            sponsorName: 'Google',
            priceDiscounted: null,
            averageRating: 4.7
        }
    ];

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
                    <div className='w-max flex items-center gap-1'>
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
                header: 'THỜI LƯỢNG KHÓA HỌC',
                cell: (info) => <Typography placeholder=''>{formatSecondsToHourMinute(info.getValue())}</Typography>
            }),
            columnHelper.accessor('priceDiscounted', {
                header: 'GIÁ TIỀN',
                cell: (info) =>
                    info.getValue() !== null ? (
                        <Chip color='amber' value={`${(info.getValue() ?? 0).toLocaleString('en-US')} VNĐ`} className='w-fit' />
                    ) : (
                        <div className='flex items-center justify-between'>
                            <Chip color='teal' value='Miễn phí' className='w-fit normal-case' />
                            <Chip variant='ghost' value={`Được tài trợ bởi ${info.row.original.sponsorName}`} className='normal-case' />
                        </div>
                    )
            }),
            columnHelper.accessor('averageRating', {
                header: 'ĐIỂM RATING',
                cell: (info) => (
                    <div className='flex flex-col items-center gap-2 font-bold text-blue-gray-500'>
                        {info.getValue()}
                        <Rating placeholder='' value={Math.floor(info.getValue())} readonly />
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
        data: mockData ?? [],
        getCoreRowModel: getCoreRowModel<RowModel<InstructorCourse>>()
    });

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
                                {headerGroup.headers.map((header) => (
                                    <th
                                        key={header.id}
                                        colSpan={header.colSpan}
                                        className='border-b border-blue-gray-100 bg-gray/2 cursor-pointer border-y bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50'
                                    >
                                        {header.isPlaceholder ? null : (
                                            <Typography
                                                placeholder=''
                                                variant='small'
                                                color='blue-gray'
                                                className='font-semibold leading-none opacity-70'
                                            >
                                                {flexRender(header.column.columnDef.header, header.getContext()) ?? ''}
                                            </Typography>
                                        )}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody className='bg-white'>
                        {mockData &&
                            mockData.length > 0 &&
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
