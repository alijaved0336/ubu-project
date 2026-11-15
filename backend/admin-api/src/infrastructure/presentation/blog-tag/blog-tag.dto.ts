export class CreateBlogTagDto {
  blogId: number;
  tagId: number;
}

export class UpdateBlogTagDto {
  blogId?: number;
  tagId?: number;
}
