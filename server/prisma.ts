import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export type User = {
  name: string;
  email: string;
};

export async function signup(
  name: string,
  email: string,
  password: string
): Promise<[User, boolean]> {
  try {
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password,
      },
    });
    const userReturn: User = {
      name: user.name,
      email: user.email,
    };
    return [userReturn, true];
  } catch (err) {
    console.log(err);
    return [
      {
        name: "",
        email: "",
      },
      false,
    ];
  }
}

export async function login(
  email: string,
  password: string
): Promise<[User, boolean]> {
  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
  if (!user || user == undefined) {
    const user: User = {
      name: "",
      email: "",
    };
    return [user, false];
  }
  if (user.password != password) {
    const user: User = {
      name: "",
      email: "",
    };
    return [user, false];
  }
  const userReturn: User = {
    name: user.name,
    email: user.email,
  };
  return [userReturn, true];
}
