'use server';
import ResetPasswordEmail from '@/components/emails/reset-password';
import { db } from '@/lib/db';
import { generateToken } from '@/lib/generate-token';
import { Resend } from 'resend';
import bcrypt, { compare } from 'bcrypt';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendResetLink(email: string) {
  const baseUrl = process.env.NEXTAUTH_URL;
  const nodeEnvironment = process.env.NODE_ENV;

  try {
    const user = await db.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      return {
        status: 404,
        error: 'We cannot associate this email with any user',
        data: null,
      };
    }
    const token = generateToken();
    const update = await db.user.update({
      where: {
        email,
      },
      data: {
        token,
      },
    });
    const name = user.name;

    const resetPasswordLink = `${baseUrl}/reset-password?token=${token}&&email=${email}`;

    if (nodeEnvironment === 'development') {
      console.log('Reset Token ✅:', resetPasswordLink);
      return null;
    }

    const { data, error } = await resend.emails.send({
      from: 'NextAdmin <info@desishub.com>',
      to: email,
      subject: 'Reset Password Request',
      react: ResetPasswordEmail({ userFirstName: name, resetPasswordLink }),
    });
    if (error) {
      return {
        status: 404,
        error: error.message,
        data: null,
      };
    }
    console.log(data);
    return {
      status: 200,
      error: null,
      data: data,
    };
  } catch (error) {
    console.log(error);
    return {
      status: 500,
      error: 'We cannot find your email',
      data: null,
    };
  }
}

export async function resetUserPassword(
  email: string,
  token: string,
  newPassword: string,
) {
  const user = await db.user.findUnique({
    where: {
      email,
      token,
    },
  });
  if (!user) {
    return {
      status: 404,
      error: 'Please use a valid reset link',
      data: null,
    };
  }
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  try {
    const updatedUser = await db.user.update({
      where: {
        email,
        token,
      },
      data: {
        passwordHash: hashedPassword,
      },
    });
    return {
      status: 200,
      error: null,
      data: null,
    };
  } catch (error) {
    console.log(error);
  }
}
