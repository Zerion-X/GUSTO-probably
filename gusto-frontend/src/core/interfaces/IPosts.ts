export default interface RecipePost {
  id: number;
  author: string;
  title: string;
  description: string;
  steps: string[];
  image: string;
  createdAt: string;
  likes: number;
  saves: number;
}