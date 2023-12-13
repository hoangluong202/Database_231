import { ChangeEvent, useEffect, useState } from 'react';
import { Button, Card, CardBody, CardHeader, CardFooter, Chip, Dialog, Rating, Textarea, Typography } from '@material-tailwind/react';
import { useReviewStore } from '@fe/states';

export function CoursePage() {
    const { listCourses, getListCoursesByStudentId, createReview } = useReviewStore();

    useEffect(() => {
        getListCoursesByStudentId(1);
    }, [getListCoursesByStudentId]);

    const [courseId, setCourseId] = useState<number>(-1);
    const [rating, setRating] = useState<number>(1);
    const [reviewText, setReviewText] = useState<string>('');
    const [open, setOpen] = useState<boolean>(false);

    const handleOpen = () => setOpen((cur) => !cur);
    const handleReviewText = (event: ChangeEvent<HTMLTextAreaElement>) => {
        setReviewText(event.target.value);
    };
    const handleSubmit = async () => {
        await createReview({
            studentId: 1,
            courseId: courseId,
            rating: rating,
            content: reviewText
        });
        handleOpen();
    };

    return (
        <>
            <Card placeholder='' className='h-full w-full'>
                <CardHeader placeholder='' floated={false} shadow={false} className='rounded-none'>
                    <div className='flex items-center'>
                        <Typography placeholder='' variant='h5' color='blue-gray'>
                            Danh sách các khóa học đã đăng ký
                        </Typography>
                    </div>
                </CardHeader>
                <CardBody placeholder='' className='overflow-scroll px-0'>
                    <div className='grid grid-cols-2 gap-2 lg:grid-cols-3 lg:p-4 lg:gap-3'>
                        {listCourses &&
                            listCourses.length > 0 &&
                            listCourses.map((item, index) => (
                                <Card
                                    key={index}
                                    placeholder=''
                                    className='border-2 border-gray-400 hover:border-gray-600 cursor-pointer rounded-lg'
                                >
                                    <CardBody placeholder='' className='flex flex-col justify-between h-[450px]'>
                                        <div className='line-clamp-4'>
                                            <img src={item.image} />
                                            <Typography placeholder='' variant='lead' className='font-bold'>
                                                {item.name}
                                            </Typography>
                                            {item.price !== null ? (
                                                <Chip color='amber' value={`${item.price.toLocaleString('en-US')} VNĐ`} className='w-fit' />
                                            ) : (
                                                <div className='flex items-center justify-between'>
                                                    <Chip color='teal' value='Miễn phí' className='w-fit normal-case' />
                                                    <Chip
                                                        variant='ghost'
                                                        value={`Được tài trợ bởi ${item.sponsor}`}
                                                        className='normal-case'
                                                    />
                                                </div>
                                            )}
                                            <Typography placeholder='' variant='paragraph'>
                                                {item.description}
                                            </Typography>
                                        </div>
                                        <Button
                                            placeholder=''
                                            className='bg-blue-500 text-white normal-case text-base'
                                            onClick={() => {
                                                setCourseId(item.courseId);
                                                handleOpen();
                                            }}
                                        >
                                            Thêm nhận xét
                                        </Button>
                                    </CardBody>
                                </Card>
                            ))}
                    </div>
                </CardBody>
            </Card>
            <Dialog placeholder='' size='xs' open={open} handler={handleOpen} className='bg-transparent shadow-none'>
                <Card placeholder='' className='mx-auto w-full max-w-[24rem]'>
                    <CardBody placeholder='' className='flex flex-col gap-4'>
                        <Typography placeholder='' variant='h4' color='blue-gray'>
                            Thêm điểm số và nhận xét của bạn vào khóa học này
                        </Typography>
                        <Typography placeholder='' className='-mb-2' variant='h6'>
                            Điểm số
                        </Typography>
                        <Rating placeholder='' value={rating} onChange={(value) => setRating(value)} />
                        <Typography placeholder='' className='-mb-2' variant='h6'>
                            Nhận xét
                        </Typography>
                        <Textarea label='Nhận xét' size='md' value={reviewText} onChange={handleReviewText} />
                    </CardBody>
                    <CardFooter placeholder='' className='pt-0'>
                        <Button placeholder='' variant='gradient' onClick={handleSubmit} fullWidth>
                            Xác nhận
                        </Button>
                    </CardFooter>
                </Card>
            </Dialog>
        </>
    );
}
