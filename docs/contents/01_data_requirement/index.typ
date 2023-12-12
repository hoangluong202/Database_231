#show raw.where(block: false): box.with(
  fill: luma(240),
  inset: (x: 3pt, y: 0pt),
  outset: (y: 3pt),
  radius: 2pt,
)

#show raw.where(block: true): block.with(
  fill: luma(240),
  inset: 10pt,
  radius: 4pt,
)

= Mô tả yêu cầu dữ liệu

Nhóm xây dựng một nền tảng dạy học trực tuyến, tương tự #link("https://www.udemy.com/")[Udemy]. Hệ thống e-learning bao gồm nhiều khóa học (COURSE), mỗi khóa học bao gồm các thông tin sau:
#block(inset: (left: 1cm))[
    1. Các thuộc tính:
    #block(inset: (left: 1cm))[
        - Mã định danh khóa học (duy nhất, không NULL).
        - Tên khóa học.
        - Mô tả khóa học (tối đa 60 ký tự, không NULL).
        - Nhãn khóa học. Mỗi khóa học có thể được gắn chỉ một trong các nhãn: *Bestseller*, *Hot & new*, *New, Highest rated*.
        - Nhãn đối tượng tham gia khóa học, chỉ thuộc một trong các nhãn: *Beginner*, *Intermediate*, *Expert*, *All Levels*.
        - Thời gian tạo khóa học, thời gian cập nhật gần nhất.
        - Tổng thời lượng khóa học.
        - Tổng số lượng học phần (SECTION).
        - Khóa học bao gồm 2 loại: Khóa học miễn phí (FREE COURSE) và Khóa học có phí (PAID COURSE).
        #block(inset: (left: 1cm))[
            - Khóa học miễn phí có thêm Tên nhà tài trợ.
            - Khóa học có phí có thêm Giá tiền (giá gốc, giá bán, phần trăm giá được giảm, ngày kết thúc khuyến mãi).
        ]
    ]
    2. Các mối liên kết:
    #block(inset: (left: 1cm))[
        - Một khóa học có thể có nhiều danh mục (CATEGORY). Mỗi danh mục được xác định bằng mối liên kết định danh với khóa học, thông tin bao gồm: Tên danh mục, Nội dung, mô tả.
        - Mỗi khóa học chỉ có duy nhất một chứng chỉ (CERTIFICATE) và mỗi chứng chỉ chỉ thuộc mỗi khóa học. Thông tin chứng chỉ bao gồm: Mã chứng chỉ (ID), nội dung, ngày hết hiệu lực.
        - Một khóa học bao gồm nhiều học phần (SECTION).
        - Đối với loại khóa học có phí:
        #block(inset: (left: 1cm))[
            - Một khóa học có thể là tiên quyết đối với các khóa học khác nhưng mỗi khóa học chỉ có nhiều nhất một khóa học tiên quyết.
            - Một khóa học có thể thuộc nhiều đơn hàng (ORDER) khi có người học đăng ký.
        ]
        - Một khóa học có thể được đánh giá bởi nhiều người học (STUDENT). Thông tin đánh giá bao gồm: điểm rating, thời gian tạo, nội dung.
        - Một khóa học chỉ được giảng dạy bởi một giáo viên (INSTRUCTOR).
    ]
]
Mỗi học phần (SECTION) bao gồm các thông tin sau:
#block(inset: (left: 1cm))[
    1. Các thuộc tính:
    #block(inset: (left: 1cm))[
        - Mã định danh học phần (duy nhất, không NULL).
        - Tên học phần (tối thiểu 3 ký tự và tối đa 80 ký tự).
        - Tổng thời gian hoàn thành học phần.
        - Tổng số lượng bài giảng (LECTURE).
    ]
    2. Các mối liên kết:
    #block(inset: (left: 1cm))[
        - Một học phần chỉ thuộc duy nhất 1 khóa học (COURSE).
        - Một học phần có thể bao gồm nhiều bài giảng (LECTURE).
    ]
]
Mỗi bài giảng (LECTURE) bao gồm các thông tin sau:
#block(inset: (left: 1cm))[
    1. Các thuộc tính:
    #block(inset: (left: 1cm))[
        - Mã định danh bài giảng (duy nhất, không NULL).
        - Tên bài giảng (tối thiểu 3 ký tự và tối đa 80 ký tự).
        - Mô tả nội dung bài giảng.
        - Thời lượng bài giảng.
        - Bài giảng bao gồm 2 loại: Tài liệu (MATERIAL) và Trắc nghiệm (QUIZ). Thông tin mỗi loại như sau:
        #block(inset: (left: 1cm))[
            - Tài liệu có thêm 2 thuộc tính: Loại tài liệu (video, article) và Link tài liệu.
            - Trắc nghiệm có thêm số lượng câu hỏi. Một bài trắc nghiệm có thể có nhiều câu hỏi (QUESTION), nhưng mỗi câu hỏi chỉ thuộc duy nhất một bài trắc nghiệm. Thông tin mỗi câu hỏi (QUESTION) bao gồm: Mã định danh câu hỏi (duy nhất, không NULL), nội dung câu hỏi, các đáp án lựa chọn (mỗi đáp án bao gồm: Nội dung đáp án và Giải thích đáp án), một đáp án chính xác.
        ]
    ]
    2. Các mối liên kết:
    #block(inset: (left: 1cm))[
        - Một bài giảng chỉ thuộc duy nhất một học phần (SECTION).
        - Một bài giảng có thể được học bởi nhiều người học (STUDENT). Với mỗi người học, bài giảng lưu lại tiến độ của người học đó.
    ]
]
Chỉ có 2 loại người dùng (USER) trong hệ thống: người học (STUDENT) và giáo viên (INSTRUCTOR). Người dùng có thể vừa là người học và vừa là giáo viên. Thông tin chung của 2 loại người dùng, bao gồm:
#block(inset: (left: 1cm))[
    - Mã định danh người dùng (duy nhất, không NULL).
    - Tên người dùng (họ, tên).
    - Ảnh đại diện (tối thiểu 200x200 pixels, tối đa 6000x6000 pixels).
    - Địa chỉ email.
    - Mật khẩu đăng nhập hệ thống (phải được mã hóa).
]
Người học (STUDENT) có thêm một thuộc tính: Mục tiêu học tập khi đăng ký vào hệ thống. Các mối liên kết bao quanh người học bao gồm:
#block(inset: (left: 1cm))[
    - Một người học có thể đánh giá nhiều khóa học (COURSE).
    - Một người học có thể học nhiều bài giảng (LECTURE) và có thể xem được tiến độ của mình trong mỗi bài giảng đó.
    - Một người học có thể đăng ký nhiều khóa học miễn phí (FREE COURSE).
    - Đối với các khóa học có phí (PAID COURSE), người học có thể đăng ký bằng cách tạo nhiều đơn hàng (ORDER), mỗi đơn hàng gồm nhiều khóa học. Thông tin mỗi đơn hàng bao gồm: Mã định danh đơn hàng (ID), tổng tiền đơn hàng, phương thức thanh toán.
]
Giáo viên có thêm 2 thuộc tính: Tài khoản thanh toán và Vị trí giảng dạy. Mỗi giáo viên có thể giảng dạy nhiều khóa học (COURSE).

== Các kiểu thực thể

1. Thực thể mạnh (Strong entity):
#block(inset: (left: 1cm))[
    - Khóa học (COURSE).
    - Khóa học miễn phí (FREE COURSE).
    - Khóa học có phí (PAID COURSE).
    - Chứng chỉ (CERTIFICATE).
    - Học phần (SECTION).
    - Bài giảng (LECTURE).
    - Tài liệu (MATERIAL).
    - Trắc nghiệm (QUIZ).
    - Câu hỏi (QUESTION).
    - Người dùng (USER).
    - Người học (STUDENT).
    - Giáo viên (INSTRUCTOR).
    - Đơn hàng (ORDER).
]
2. Thực thể yếu (Weak entity): Danh mục (CATEGORY).
3. Lớp cha và lớp con:
#block(inset: (left: 1cm))[
    - Khóa học (COURSE): Khóa học miễn phí (FREE COURSE), Khóa học có phí (PAID COURSE).
    - Bài giảng (LECTURE): Tài liệu (MATERIAL), Trắc nghiệm (QUIZ).
    - Người dùng (USER): Người học (STUDENT), Giáo viên (INSTRUCTOR).
]

== Các kiểu thuộc tính
Đa số các thuộc tính trong phần mô tả là thuộc tính đơn trị. Nhóm chỉ liệt kê một số thuộc tính đặc biệt:
#block(inset: (left: 1cm))[
    1. Thuộc tính đa trị: Các đáp án ở thực thể CÂU HỎI (Một câu hỏi có nhiều đáp án).
    2. Thuộc tính dẫn xuất: Số lượng câu hỏi ở thực thể TRẮC NGHIỆM, Tổng tiền ở thực thể ĐƠN HÀNG,...
    3. Thuộc tính tổ hợp: Giá ở thực thể KHÓA HỌC CÓ PHÍ (giá bao gồm: giá gốc, giá bán, phần trăm được giảm, ngày kết thúc khuyến mãi), Tên đầy đủ ở thực thể NGƯỜI DÙNG (tên đầy đủ bao gồm: họ, tên).
    4. Thuộc tính phức hợp: Các đáp án ở thực thể CÂU HỎI (Một câu hỏi có nhiều đáp án, mỗi đáp án bao gồm: Nội dung đáp án và Giải thích đáp án).
]

== Các mối liên kết
#block(inset: (left: 1cm))[
    1. Mối liên kết (1:1): Mỗi khóa học (COURSE) có duy nhất một chứng chỉ (CERTIFICATE) và mỗi chứng chỉ (CERTIFICATE) chỉ thuộc về một khóa học (COURSE).
    2. Mối liên kết (1:N): Mỗi khóa học (COURSE) bao gồm nhiều học phần (SECTION) và mỗi học phần (SECTION) chỉ thuộc về một khóa học (COURSE),...
    3. Mối liên kết (M:N): Một đơn hàng (ORDER) có nhiều khóa học có phí (PAID COURSE) và một khóa học có phí (PAID COURSE) có thể thuộc nhiều đơn hàng (ORDER),...
    4. Mối liên kết định danh: Mỗi danh mục (CATEGORY) chỉ được xác định bằng tên danh mục và mã khóa học (COURSE).
    5. Mối liên kết đệ quy: Một khóa học (COURSE) có thể là điều kiện tiên quyết cho nhiều khóa học khác nhưng mỗi khóa học chỉ có nhiều nhất một khóa học tiên quyết.
]

== Ràng buộc dữ liệu
Các ràng buộc dữ liệu đã được thể hiện rõ trong phần mô tả như: duy nhất, không NULL, tối thiểu 3 ký tự, tối đa 80 ký tự,...

== Ràng buộc nghiệp vụ
Các ràng buộc nghiệp vụ chính của ứng dụng như:
#block(inset: (left: 1cm))[
    - Điểm rating mỗi đánh giá của người học đến khóa học được tính theo số sao từ 1 → 5.
    - Nhãn khóa học chỉ bao gồm: Bestseller, Hot & new, New, Highest rated.
    - Nhãn đối tượng người học chỉ bao gồm: Beginner, Intermediate, Expert, All Levels.
    - Loại Tài liệu của mỗi bài giảng chỉ bao gồm: Video à Article.
    - Địa chỉ thanh toán của mỗi đơn hàng mặc định là Tên quốc gia của người học.
]

== Ràng buộc nghữ nghĩa
Các ràng buộc ngữ nghĩa mà không biểu diễn được bằng (E-)ERD:
#block(inset: (left: 1cm))[
    - Không thể xóa khóa học khi đã có học sinh đăng ký khóa học.
    - Sau khi người học xem hết thời lượng của 1 bài giảng, hệ thống tự động đánh dấu hoàn thành bài giảng.
    - Học sinh đăng ký khóa học mới có thể đánh giá khóa học ấy.
    - Giá khóa học sẽ được chia thành 30 tiers. Mỗi tier sẽ có một mức giá nhất định: tier 0 là Free và tier 29 là 2,499,000 VNĐ (tùy thuộc vào đơn vị tiền tệ). 
    - Học sinh đăng kí khóa học chỉ khi hoàn thành khóa học tiên quyết của nó.
    - Đáp án đúng nhất của mỗi câu hỏi chỉ nằm trong các đáp án mẫu.
    - Mỗi khóa học có ít nhất 5 bài giảng.
    - Thời lượng tối đa cho các khóa học miễn phí là 2 giờ.
]

#pagebreak()