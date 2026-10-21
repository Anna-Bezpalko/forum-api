export interface CreatePostDto {
  title: string;
  content: string;
  authorId: number;
  categoryId: number;
}