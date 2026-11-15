export class CreateTagDto {
  tagName: string;
  userId: number;
}

export class UpdateTagDto {
  tagName?: string;
  userId?: number;
}
