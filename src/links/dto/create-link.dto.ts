import { IsUrl, Matches, MaxLength, MinLength } from 'class-validator';

const MAX_URL_LENGTH = 2048;
const MIN_SLUG_LENGTH = 3;
const MAX_SLUG_LENGTH = 32;
const SLUG_PATTERN = /^[A-Za-z0-9_-]+$/;

export class CreateLinkDto {
  @MinLength(MIN_SLUG_LENGTH)
  @MaxLength(MAX_SLUG_LENGTH)
  @Matches(SLUG_PATTERN, {
    message: 'slug can only contain letters, numbers, - and _',
  })
  slug: string;

  @IsUrl({ protocols: ['http', 'https'], require_protocol: true })
  @MaxLength(MAX_URL_LENGTH)
  url: string;
}
