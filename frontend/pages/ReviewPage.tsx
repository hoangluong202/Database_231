import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { createColumnHelper, flexRender, getCoreRowModel, RowModel, useReactTable } from '@tanstack/react-table';
import moment from 'moment';
import {
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Chip,
    Dialog,
    IconButton,
    Rating,
    Textarea,
    Tooltip,
    Typography
} from '@material-tailwind/react';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { CATEGORY_COLOR } from '@fe/constants';
import { useReviewStore } from '@fe/states';

export function ReviewPage() {
    const { reviewData, getReviewByStudentId, updateReview, deleteReview } = useReviewStore();

    const [courseId, setCourseId] = useState<number>(-1);
    const [rating, setRating] = useState<number>(1);
    const [reviewText, setReviewText] = useState<string>('');
    const [openEdit, setOpenEdit] = useState<boolean>(false);
    const [openDelete, setOpenDelete] = useState<boolean>(false);

    const handleReviewText = (event: ChangeEvent<HTMLTextAreaElement>) => {
        setReviewText(event.target.value);
    };

    const handleOpenEdit = useCallback(
        (index: number) => {
            setCourseId(reviewData[index].courseId);
            setRating(reviewData[index].rating);
            setReviewText(reviewData[index].content);
            setOpenEdit((cur) => !cur);
        },
        [reviewData]
    );

    const handleOpenDelete = useCallback(
        (index: number) => {
            setCourseId(reviewData[index].courseId);
            setOpenDelete((cur) => !cur);
        },
        [reviewData]
    );

    const handleUpdateReview = async () => {
        await updateReview({
            studentId: 1,
            courseId: courseId,
            rating: rating,
            content: reviewText
        });
        setOpenEdit((cur) => !cur);
    };

    const handleDeleteReview = async () => {
        await deleteReview(1, courseId);
        setOpenDelete((cur) => !cur);
    };

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
                cell: (info) => (
                    <div className='flex flex-col items-center gap-2 font-bold text-blue-gray-500'>
                        {info.getValue()}.0
                        <Rating placeholder='' value={info.getValue()} readonly />
                    </div>
                )
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
                cell: (info) => (
                    <Tooltip content='Edit Review'>
                        <IconButton placeholder='' variant='text' onClick={() => handleOpenEdit(info.row.index)}>
                            <PencilIcon strokeWidth={2} className='h-5 w-5' />
                        </IconButton>
                    </Tooltip>
                )
            }),
            columnHelper.display({
                id: 'deleteReview',
                cell: (info) => (
                    <Tooltip content='Delete Review'>
                        <IconButton placeholder='' variant='text' onClick={() => handleOpenDelete(info.row.index)}>
                            <TrashIcon strokeWidth={2} className='w-5 h-5 text-red-500' />
                        </IconButton>
                    </Tooltip>
                )
            })
        ],
        [columnHelper, handleOpenEdit, handleOpenDelete]
    );

    const fileTable = useReactTable<Review>({
        columns: columnDefs,
        data: reviewData ?? [],
        getCoreRowModel: getCoreRowModel<RowModel<Review>>()
    });

    return (
        <>
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
            <Dialog placeholder='' size='xs' open={openEdit} handler={() => setOpenEdit(false)} className='bg-transparent shadow-none'>
                <Card placeholder='' className='mx-auto w-full'>
                    <CardBody placeholder='' className='flex flex-col gap-4'>
                        <Typography placeholder='' variant='h4' color='blue-gray'>
                            Chỉnh sửa điểm số và nhận xét của bạn trong khóa học này
                        </Typography>
                        <Typography placeholder='' className='-mb-2' variant='h6'>
                            Điểm số: {rating}.0
                        </Typography>
                        <Rating placeholder='' value={rating} onChange={(value) => setRating(value)} />
                        <Typography placeholder='' className='-mb-2' variant='h6'>
                            Nhận xét
                        </Typography>
                        <Textarea label='Nhận xét' size='md' value={reviewText} onChange={handleReviewText} />
                    </CardBody>
                    <CardFooter placeholder='' className='pt-0'>
                        <Button placeholder='' variant='gradient' onClick={handleUpdateReview} fullWidth>
                            Xác nhận
                        </Button>
                    </CardFooter>
                </Card>
            </Dialog>
            <Dialog placeholder='' size='xs' open={openDelete} handler={() => setOpenDelete(false)} className='bg-transparent shadow-none'>
                <Card placeholder='' className='mx-auto w-full max-w-[24rem]'>
                    <CardBody placeholder=''>
                        <Typography placeholder='' variant='h4' color='blue-gray'>
                            Bạn có chắc chắn muốn xóa nhận xét này ?
                        </Typography>
                    </CardBody>
                    <CardFooter placeholder='' className='pt-0'>
                        <Button placeholder='' color='red' variant='gradient' onClick={handleDeleteReview} fullWidth>
                            Xác nhận
                        </Button>
                    </CardFooter>
                </Card>
            </Dialog>
        </>
    );
}
