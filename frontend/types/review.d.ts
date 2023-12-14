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
    isReviewed: boolean;
};

type InstructorCourse = {
    courseId: number;
    courseName: string;
    courseLabel: string;
    audienceLabel: string;
    updatedAt: string;
    totalDuration: number;
    sponsorName: string | null;
    priceDiscounted: number | null;
    averageRating: string | null;
};

type ReviewCreationPayload = {
    studentId: number;
    courseId: number;
    rating: number;
    content: string;
};

type FilterAndSortPayload = {
    courseLabels: string[] | null;
    audienceLabels: string[] | null;
    sponsorName: string[] | null;
    sortColumns: string[];
    sortOrders: string[];
    minAverageRating: number | null;
};

type ReviewStore = {
    reviewStatus: StoreStatus;
    courseStatus: StoreStatus;
    reviewData: Review[];
    listCourses: Course[];
    listInstructorCourses: InstructorCourse[];
    getReviewByStudentId: (studentId: number) => Promise<void>;
    getListCoursesByStudentId: (studentId: number) => Promise<void>;
    createReview: (payload: ReviewCreationPayload) => Promise<void>;
    updateReview: (payload: ReviewCreationPayload) => Promise<void>;
    deleteReview: (studentId: number, courseId: number) => Promise<void>;
    getListCoursesByInstructorId: (instructorId: number) => Promise<void>;
    filterAndSortCourses: (instructorId: number, payload: FilterAndSortPayload) => Promise<void>;
};
