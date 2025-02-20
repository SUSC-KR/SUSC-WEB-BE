import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/sqlite';
import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Post,
  Query,
  Res,
  UnprocessableEntityException,
} from '@nestjs/common';
import { FormAnswer } from 'src/entities/form-answer';
import { CheckSubmittedResponseDto } from './dto/CheckSubmittedResponseDto';
import { CheckSubmittedRequestDto } from './dto/CheckSubmittedRequestDto';
import { SubmitAnswerRequestDto } from './dto/SubmitAnswerRequestDto';
import { SubmitAnswerResponseDto } from './dto/SubmitAnswerResponseDto';
import { ulid } from 'ulid';
import { UseManagerToken } from 'src/core/use-manager-token';
import { writeToPath } from '@fast-csv/format';
import path from 'path';
import { Response } from 'express';
import { DeleteAnswerRequestDto } from './dto/DeleteAnswerRequestDto';

@Controller()
export class AnswerController {
  constructor(
    @InjectRepository(FormAnswer)
    private readonly formAnswerRepository: EntityRepository<FormAnswer>,
  ) {}

  @Post('/answers/check-submitted')
  async checkSubmitted(
    @Body() dto: CheckSubmittedRequestDto,
  ): Promise<CheckSubmittedResponseDto> {
    const { email } = dto;

    const answer = await this.formAnswerRepository.findOne({ email });
    const isSubmitted = !!answer;

    return new CheckSubmittedResponseDto(isSubmitted);
  }

  @Post('/answers')
  async submitAnswer(
    @Body() dto: SubmitAnswerRequestDto,
  ): Promise<SubmitAnswerResponseDto> {
    const { email, data } = dto;

    const prevAnswer = await this.formAnswerRepository.findOne({ email });
    if (prevAnswer) {
      throw new UnprocessableEntityException('Answer already submitted');
    }

    const answer = this.formAnswerRepository.create({
      id: ulid(),
      email,
      data,
      createdAt: new Date(),
    });
    await this.formAnswerRepository.insert(answer);

    return answer;
  }

  @Post('/answers/export-to-csv')
  @UseManagerToken()
  async exportCsv(@Res() res: Response) {
    const answers = await this.formAnswerRepository.findAll();

    const rows = answers.map((answer) => [
      answer.id,
      answer.email,
      JSON.stringify(answer.data),
      answer.createdAt.toISOString(),
    ]);

    await new Promise<void>((resolve, reject) =>
      writeToPath(path.resolve(__dirname, 'result.csv'), rows)
        .on('error', reject)
        .on('finish', resolve),
    );

    res.download(path.resolve(__dirname, 'result.csv'), 'result.csv');
  }

  @Delete('/answers')
  @UseManagerToken()
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Query() dto: DeleteAnswerRequestDto): Promise<void> {
    const { email } = dto;

    const answer = await this.formAnswerRepository.findOne({ email });
    if (!answer) {
      throw new NotFoundException('Answer not found');
    }

    await this.formAnswerRepository.getEntityManager().removeAndFlush(answer);
  }
}
