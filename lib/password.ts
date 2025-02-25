import { compare, hash } from 'bcrypt';

export async function hashPassword(password: string) {
  return await hash(password, 12);
}

export async function validatePassword({
  password,
  passwordHash,
}: {
  password: string;
  passwordHash: string;
}) {
  return await compare(password, passwordHash);
}
