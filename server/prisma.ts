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

export async function addSpending(
  email: string,
  name: string,
  amount: number,
  time: string
) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user || user == undefined) {
      return false;
    }

    await prisma.item.create({
      data: {
        name,
        amount,
        time,
        User: {
          connect: {
            email: email,
          },
        },
      },
    });
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function addTransactions(
  email: string,
  type: string,
  from: string,
  to: string,
  amount: number,
  time: string
) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user || user == undefined) {
      return false;
    }

    await prisma.trans.create({
      data: {
        from,
        to,
        amount,
        time,
        type,
        User: {
          connect: {
            email: email,
          },
        },
      },
    });
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function getHistory(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user || user == undefined) {
      return [];
    }

    const trans = await prisma.trans.findMany({
      where: {
        userId: user.id,
      },
    });

    return trans;
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function getSpending(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user || user == undefined) {
      return [];
    }

    const items = await prisma.item.findMany({
      where: {
        userId: user.id,
      },
    });

    return items;
  } catch (error) {
    console.log(error);
    return [];
  }
}
