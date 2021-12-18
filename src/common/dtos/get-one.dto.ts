import { IsUUID } from 'class-validator';

export class GetOneDto {
  @IsUUID()
  id: string;
}
