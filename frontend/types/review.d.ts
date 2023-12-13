type Review = {
    courseName: string;
    categoryName: string[];
    rating: number;
    content: string;
    createdAt: string;
};

type ReviewStore = {
    reviewStatus: StoreStatus;
    reviewData: Review[];
    getReviewByStudentId: (studentId: number) => Promise<void>;
};
