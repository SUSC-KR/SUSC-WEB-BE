import { Transform } from 'class-transformer';
import { IsEmail } from 'class-validator';
import { toLowerCaseEmail } from 'src/util/lower-case-email.transformer';

export class DeleteAnswerRequestDto {
  @Transform(({ value }) => toLowerCaseEmail(value))
  @IsEmail()
  email!: string;
}
