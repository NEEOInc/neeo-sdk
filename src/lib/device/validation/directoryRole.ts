const VALID_DIRECTORY_ROLES = ['ROOT', 'QUEUE'];

export function validate(role: string) {
  if (!VALID_DIRECTORY_ROLES.includes(role)) {
    throw new Error(`INVALID_DIRECTORY_ROLE: ${role}`);
  }
}
