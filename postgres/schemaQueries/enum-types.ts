const rating = {
  text: `CREATE TYPE rating AS ENUM ('1', '2', '3', '4', '5');`
}

const course_label = {
  text: `CREATE TYPE course_label AS ENUM ('Bestseller', 'Hot & new', 'New', 'Highest rated');`
}

const audience_label = {
  text: `CREATE TYPE audience_label AS ENUM ('Beginner', 'Intermediate', 'Expert', 'All Levels');`
}

const material_type = {
  text: `CREATE TYPE material_type AS ENUM ('Video', 'Article');`
}

const answer_option = {
  text: `CREATE TYPE answer_option AS ENUM ('A', 'B', 'C', 'D');`
}

const payment_method = {
  text: `CREATE TYPE payment_method AS ENUM ('Banking', 'Cash');`
}

export const enumTypes = {
  rating: rating,
  course_label: course_label,
  audience_label: audience_label,
  material_type: material_type,
  answer_option: answer_option,
  payment_method: payment_method
}

export const dropEnumTypes = {
  rating: `DROP TYPE IF EXISTS rating;`,
  course_label: `DROP TYPE IF EXISTS course_label;`,
  audience_label: `DROP TYPE IF EXISTS audience_label;`,
  material_type: `DROP TYPE IF EXISTS material_type;`,
  answer_option: `DROP TYPE IF EXISTS answer_option;`,
  payment_method: `DROP TYPE IF EXISTS payment_method;`
}