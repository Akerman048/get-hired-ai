export interface Question {
  id: number;
  topicId: number;
  title: string;
  answer: string;
  level: "junior" | "middle" | "senior";
}
