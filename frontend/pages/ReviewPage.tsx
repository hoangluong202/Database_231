import { useEffect, useMemo } from 'react';
import { createColumnHelper, flexRender, getCoreRowModel, RowModel, useReactTable } from '@tanstack/react-table';
import moment from 'moment';
import { Card, CardBody, CardHeader, Chip, IconButton, Rating, Tooltip, Typography } from '@material-tailwind/react';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { CATEGORY_COLOR } from '@fe/constants';
import { useReviewStore } from '@fe/states';

export function ReviewPage() {
    const { reviewData, getReviewByStudentId } = useReviewStore();

    useEffect(() => {
        getReviewByStudentId(1);
    }, [getReviewByStudentId]);

    const columnHelper = createColumnHelper<Review>();

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
            columnHelper.accessor('categoryName', {
                header: 'DANH MỤC',
                cell: (info) => (
                    <div className='w-max flex flex-col gap-1'>
                        {info.getValue().map((item, index) => (
                            <Chip
                                key={index}
                                variant='ghost'
                                size='sm'
                                value={item}
                                color={CATEGORY_COLOR[index]}
                                className='normal-case w-fit'
                            />
                        ))}
                    </div>
                )
            }),
            columnHelper.accessor('rating', {
                header: 'ĐIỂM RATING',
                cell: (info) => <Rating placeholder='' value={info.getValue()} />
            }),
            columnHelper.accessor('content', {
                header: 'NHẬN XÉT',
                cell: (info) => info.getValue()
            }),
            columnHelper.accessor('createdAt', {
                header: 'NGÀY NHẬN XÉT',
                cell: (info) =>
                    info.getValue() && info.getValue().length > 0 ? (
                        <Typography placeholder=''>{moment.unix(moment(info.getValue()).unix()).format('DD/MM/YYYY')}</Typography>
                    ) : (
                        ''
                    )
            }),
            columnHelper.display({
                id: 'updateReview',
                cell: () => (
                    <Tooltip content='Edit Review'>
                        <IconButton placeholder='' variant='text'>
                            <PencilIcon strokeWidth={2} className='h-5 w-5' />
                        </IconButton>
                    </Tooltip>
                )
            }),
            columnHelper.display({
                id: 'deleteReview',
                cell: () => (
                    <Tooltip content='Delete Review'>
                        <IconButton placeholder='' variant='text'>
                            <TrashIcon strokeWidth={2} className='w-5 h-5 text-red-500' />
                        </IconButton>
                    </Tooltip>
                )
            })
        ],
        [columnHelper]
    );

    const fileTable = useReactTable<Review>({
        columns: columnDefs,
        data: reviewData ?? [],
        getCoreRowModel: getCoreRowModel<RowModel<Review>>()
    });

    return (
        <Card placeholder='' className='h-full w-full'>
            <CardHeader placeholder='' floated={false} shadow={false} className='rounded-none'>
                <div className='flex items-center'>
                    <Typography placeholder='' variant='h5' color='blue-gray'>
                        Danh sách các nhận xét
                    </Typography>
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
                        {reviewData &&
                            reviewData.length > 0 &&
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
