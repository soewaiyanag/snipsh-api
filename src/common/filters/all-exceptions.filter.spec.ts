import {
  ArgumentsHost,
  BadRequestException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { AllExceptionsFilter } from './all-exceptions.filter.js';

const REQUEST = { method: 'GET', url: '/links/abc' };

function runFilter(exception: unknown) {
  const response = { status: vi.fn().mockReturnThis(), json: vi.fn() };
  const host = {
    switchToHttp: () => ({
      getRequest: () => REQUEST,
      getResponse: () => response,
    }),
  } as unknown as ArgumentsHost;

  new AllExceptionsFilter().catch(exception, host);

  return {
    status: response.status.mock.calls[0][0],
    body: response.json.mock.calls[0][0],
  };
}

describe('AllExceptionsFilter', () => {
  beforeEach(() => {
    vi.spyOn(Logger.prototype, 'error').mockImplementation(() => undefined);
  });

  it('keeps the status and message of an HTTP error', () => {
    const { status, body } = runFilter(new NotFoundException('Link not found'));

    expect(status).toBe(404);
    expect(body).toMatchObject({
      statusCode: 404,
      error: 'Not Found',
      message: 'Link not found',
      path: '/links/abc',
    });
  });

  it('keeps the list of validation messages', () => {
    const { body } = runFilter(
      new BadRequestException({ message: ['url must be a URL address'] }),
    );

    expect(body.message).toEqual(['url must be a URL address']);
  });

  it('hides the details of an unexpected error', () => {
    const { status, body } = runFilter(new Error('password=secret in query'));

    expect(status).toBe(500);
    expect(body.message).toBe('Internal Server Error');
    expect(JSON.stringify(body)).not.toContain('secret');
  });
});
