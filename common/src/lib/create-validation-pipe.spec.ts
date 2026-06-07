import { createValidationPipe } from './create-validation-pipe';

describe('createValidationPipe', () => {
  it('creates a configured ValidationPipe', () => {
    const pipe = createValidationPipe();
    expect(pipe).toBeDefined();
  });
});
