export type Student = {
  id: string
  name: string
  email: string
  grade: string
}

let students: Student[] = [
  { id: "1", name: "Ali Hassan", email: "ali@example.com", grade: "A" },
  { id: "2", name: "Sara Ahmad", email: "sara@example.com", grade: "B" },
]

export const getStudents = () => students
export const addStudent = (data: Omit<Student, "id">) => {
  const s = { ...data, id: Date.now().toString() }
  students.push(s)
  return s
}
export const updateStudent = (id: string, data: Partial<Omit<Student, "id">>) => {
  students = students.map((s) => (s.id === id ? { ...s, ...data } : s))
  return students.find((s) => s.id === id)
}
export const deleteStudent = (id: string) => {
  students = students.filter((s) => s.id !== id)
}