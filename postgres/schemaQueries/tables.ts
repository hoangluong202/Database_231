const users = {
  text: `CREATE TABLE  IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(100) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      first_name VARCHAR(50),
      last_name VARCHAR(50),
      avatar_url VARCHAR(255)
    );`
};

const students = {
  text: `CREATE TABLE  IF NOT EXISTS students (
      user_id INT PRIMARY KEY REFERENCES users(id),
      target VARCHAR(255)
    );`
};

const instructors = {
  text: `CREATE TABLE  IF NOT EXISTS instructors (
      user_id INT PRIMARY KEY REFERENCES users(id),
      bank_account_number VARCHAR(20) UNIQUE NOT NULL,
      position VARCHAR(100)
    );`
};

const courses = {
  text: `CREATE TABLE  IF NOT EXISTS courses (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(60),
    course_label course_label,
    audience_label audience_label,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    total_duration INT, 
    total_sections INT,
    user_id INT REFERENCES instructors(user_id)
  )`
}

const certificates = {
  text: `CREATE TABLE  IF NOT EXISTS certificates (
    id SERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    expiration_date DATE NOT NULL,
    course_id INT UNIQUE NOT NULL REFERENCES courses(id)
  );`
}

const free_courses = {
  text:`CREATE TABLE  IF NOT EXISTS free_courses (
    course_id INT PRIMARY KEY REFERENCES courses(id),
    sponsor_name VARCHAR(100) NOT NULL
  );`
}

const paid_courses = {
  text:`CREATE TABLE  IF NOT EXISTS paid_courses (
    course_id INT PRIMARY KEY REFERENCES courses(id),
    price_original DECIMAL(10, 2) NOT NULL,
    price_discounted DECIMAL(10, 2) NOT NULL,
    discount_percentage INT NOT NULL,
    promo_end_date DATE NOT NULL,
    course_prerequisite INT REFERENCES paid_courses(course_id)
  );`
}

const sections = {
  text: `CREATE TABLE IF NOT EXISTS sections (
    id SERIAL PRIMARY KEY,
    name VARCHAR(80) NOT NULL,
    total_completion_time INT,
    total_lectures INT,
    course_id INT NOT NULL REFERENCES courses(id) 
  );`
}

const lectures = {
  text: `CREATE TABLE  IF NOT EXISTS lectures (
    id SERIAL PRIMARY KEY,
    name VARCHAR(80) NOT NULL,
    description TEXT,
    duration INT,
    section_id INT NOT NULL REFERENCES sections(id)
  );`
}

const materials = {
  text: `CREATE TABLE  IF NOT EXISTS materials (
    lecture_id INT PRIMARY KEY REFERENCES lectures(id),
    type material_type NOT NULL,
    link VARCHAR(255) NOT NULL
  );`
}

const quizzes = {
  text: `CREATE TABLE  IF NOT EXISTS quizzes (
    lecture_id INT PRIMARY KEY REFERENCES lectures(id),
    num_questions INT
  );`
}

const questions = {
  text: `CREATE TABLE  IF NOT EXISTS questions (
    id SERIAL PRIMARY KEY,
    quiz_id INT NOT NULL REFERENCES quizzes(lecture_id),
    content TEXT NOT NULL,
    correct_option answer_option NOT NULL
  );`
}

const orders = {
  text: `CREATE TABLE  IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    total_cost DECIMAL(10, 2) NOT NULL,
    method_payment payment_method NOT NULL,
    student_id INT NOT NULL REFERENCES students(user_id)
    );`
}

const categories = {
  text: `CREATE TABLE  IF NOT EXISTS categories (
    name VARCHAR(50) NOT NULL,
    course_id INT NOT NULL REFERENCES courses(id),
    content VARCHAR(255) NOT NULL,
    description VARCHAR(255),
    PRIMARY KEY (name, course_id)
  );`
}

const students_study_lectures = {
  text: `CREATE TABLE  IF NOT EXISTS students_study_lectures (
    student_id INT NOT NULL REFERENCES students(user_id),
    lecture_id INT NOT NULL REFERENCES lectures(id),
    PRIMARY KEY (student_id, lecture_id)
  );`
}

const paid_courses_in_order = {
  text: `CREATE TABLE  IF NOT EXISTS paid_courses_in_order (
    order_id INT NOT NULL REFERENCES orders(id),
    course_id INT NOT NULL REFERENCES paid_courses(course_id),
    PRIMARY KEY (order_id, course_id)
  );`
}

const students_review_courses = {
  text: `CREATE TABLE  IF NOT EXISTS students_review_courses (
    student_id INT NOT NULL REFERENCES students(user_id),
    course_id INT NOT NULL REFERENCES courses(id),
    rating rating NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (student_id, course_id)
  );`
}

const students_register_free_courses = {
  text: `CREATE TABLE  IF NOT EXISTS students_register_free_courses (
    student_id INT NOT NULL REFERENCES students(user_id),
    course_id INT NOT NULL REFERENCES free_courses(course_id),
    PRIMARY KEY (student_id, course_id)
  );`
}

const answers = {
  text: `CREATE TABLE  IF NOT EXISTS answers (
    question_id INT,
    answer_option answer_option NOT NULL,
    content TEXT NOT NULL,
    explanation TEXT,
    PRIMARY KEY (question_id, answer_option),
    FOREIGN KEY (question_id) REFERENCES questions(id)
  );`
}

export const createTables = {
  users: users,
  students:students,
  instructors: instructors,
  courses: courses,
  certificates: certificates,
  free_courses: free_courses,
  paid_courses: paid_courses,
  sections: sections,
  lectures: lectures,
  materials: materials,
  quizzes: quizzes,
  questions: questions,
  orders: orders,
  categories: categories,
  students_study_lectures: students_study_lectures,
  paid_courses_in_order: paid_courses_in_order,
  students_review_courses: students_review_courses,
  students_register_free_courses: students_register_free_courses,
  answers: answers,
}

export const dropTables = {
  users: `DROP TABLE IF EXISTS users CASCADE;`,
  students: `DROP TABLE IF EXISTS students CASCADE;`,
  instructors: `DROP TABLE IF EXISTS instructors CASCADE;`,
  courses: `DROP TABLE IF EXISTS courses CASCADE;`,
  certificates: `DROP TABLE IF EXISTS certificates CASCADE;`,
  free_courses: `DROP TABLE IF EXISTS free_courses CASCADE;`,
  paid_courses: `DROP TABLE IF EXISTS paid_courses CASCADE;`,
  sections: `DROP TABLE IF EXISTS sections CASCADE;`,
  lectures: `DROP TABLE IF EXISTS lectures CASCADE;`,
  materials: `DROP TABLE IF EXISTS materials CASCADE;`,
  quizzes: `DROP TABLE IF EXISTS quizzes CASCADE;`,
  questions: `DROP TABLE IF EXISTS questions CASCADE;`,
  orders: `DROP TABLE IF EXISTS orders CASCADE;`,
  categories: `DROP TABLE IF EXISTS categories CASCADE;`,
  students_study_lectures: `DROP TABLE IF EXISTS students_study_lectures CASCADE;`,
  paid_courses_in_order: `DROP TABLE IF EXISTS paid_courses_in_order CASCADE;`,
  students_review_courses: `DROP TABLE IF EXISTS students_review_courses CASCADE;`,
  students_register_free_courses: `DROP TABLE IF EXISTS students_register_free_courses CASCADE;`,
  answers: `DROP TABLE IF EXISTS answers CASCADE;`,
}