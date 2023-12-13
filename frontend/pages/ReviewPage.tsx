import { useMemo } from 'react';
import { createColumnHelper, flexRender, getCoreRowModel, RowModel, useReactTable } from '@tanstack/react-table';
import { Card, CardBody, CardHeader, Chip, IconButton, Rating, Tooltip, Typography } from '@material-tailwind/react';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

export function ReviewPage() {
    const mockData = [
        {
            courseName: 'HTML for Beginners',
            categoryName: 'Web development',
            rating: 4,
            content: 'This course is awesome',
            createdAt: '1/1/2024'
        },
        {
            courseName: 'HTML for Beginners',
            categoryName: 'Web development',
            rating: 4,
            content: 'This course is awesome',
            createdAt: '1/1/2024'
        },
        {
            courseName: 'HTML for Beginners',
            categoryName: 'Web development',
            rating: 4,
            content: 'This course is awesome',
            createdAt: '1/1/2024'
        },
        {
            courseName: 'HTML for Beginners',
            categoryName: 'Web development',
            rating: 4,
            content: 'This course is awesome',
            createdAt: '1/1/2024'
        },
        {
            courseName: 'HTML for Beginners',
            categoryName: 'Web development',
            rating: 4,
            content: 'This course is awesome',
            createdAt: '1/1/2024'
        }
    ];

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
                    <div className='w-max'>
                        <Chip variant='ghost' size='sm' value={info.getValue()} color='green' />
                    </div>
                )
            }),
            columnHelper.accessor('rating', {
                header: 'ĐIỂM RATING',
                cell: (info) => (
                    <div className='flex flex-col items-center gap-2 font-bold text-blue-gray-500'>
                        {info.getValue()}
                        <Rating placeholder='' value={4} />
                    </div>
                )
            }),
            columnHelper.accessor('content', {
                header: 'NHẬN XÉT',
                cell: (info) => info.getValue()
            }),
            columnHelper.accessor('createdAt', {
                header: 'NGÀY NHẬN XÉT',
                cell: (info) => info.getValue()
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
        data: mockData ?? [],
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
