type CourseLabel = 'Bestseller' | 'HotAndNew' | 'New' | 'HighestRated';
type AudienceLabel = 'Beginner' | 'Intermediate' | 'Expert' | 'AllLevels';

type Review = {
    studentId: number;
    courseId: number;
    courseName: string;
    categoryName: string[];
    rating: number;
    content: string;
    createdAt: string;
};

type Course = {
    courseId: number;
    image: string;
    name: string;
    price: number | null;
    sponsor: string | null;
    description: string;
};

type InstructorCourse = {
    courseId: number;
    courseName: string;
    courseLabel: CourseLabel;
    audienceLabel: AudienceLabel;
    updatedAt: string;
    totalDuration: number;
    sponsorName: string | null;
    priceDiscounted: number | null;
    averageRating: number;
};

type ReviewCreationPayload = {
    studentId: number;
    courseId: number;
    rating: number;
    content: string;
};

type ReviewStore = {
    reviewStatus: StoreStatus;
    courseStatus: StoreStatus;
    reviewData: Review[];
    listCourses: Course[];
    getReviewByStudentId: (studentId: number) => Promise<void>;
    getListCoursesByStudentId: (studentId: number) => Promise<void>;
    createReview: (payload: ReviewCreationPayload) => Promise<void>;
    updateReview: (payload: ReviewCreationPayload) => Promise<void>;
    deleteReview: (studentId: number, courseId: number) => Promise<void>;
};
