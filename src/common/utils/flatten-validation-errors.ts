import type { ValidationError } from 'class-validator';

export function flattenValidationErrors(validationErrors: ValidationError[]): string[] {
  const messages: string[] = [];

  for (const validationError of validationErrors) {
    if (validationError.constraints) {
      messages.push(...Object.values(validationError.constraints));
    }

    if (validationError.children?.length) {
      messages.push(...flattenValidationErrors(validationError.children));
    }
  }

  return messages;
}
