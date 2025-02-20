import { BadRequestException } from '@nestjs/common';
import { isEmail } from 'class-validator';

export function toLowerCaseEmail(email: any): string {
  if (email === null || email === undefined) {
    throw new BadRequestException('Email is required');
  }

  const emailString = String(email).trim().toLowerCase();

  if (!isEmail(emailString)) {
    throw new BadRequestException('Invalid email');
  }

  return emailString.toLowerCase();
}
