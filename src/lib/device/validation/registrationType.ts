const VALID_SECURITY_TYPES = ['SECURITY_CODE', 'ACCOUNT'];

export function validate(type: string) {
  if (!VALID_SECURITY_TYPES.includes(type)) {
    throw new Error(`INVALID_REGISTRATION_TYPE: ${type}`);
  }
}
