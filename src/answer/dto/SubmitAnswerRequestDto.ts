import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmptyObject } from 'class-validator';
import { toLowerCaseEmail } from 'src/util/lower-case-email.transformer';

export class SubmitAnswerRequestDto {
  @Transform(({ value }) => toLowerCaseEmail(value))
  @IsEmail()
  email!: string;

  @IsNotEmptyObject()
  data!: Record<string, any>;
}
