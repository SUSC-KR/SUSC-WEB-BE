import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { FormAnswer } from 'src/entities/form-answer';
import { AnswerController } from './answer.controller';

@Module({
  imports: [MikroOrmModule.forFeature([FormAnswer])],
  controllers: [AnswerController],
})
export class AnswerModule {}
