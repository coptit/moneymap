import { initTRPC } from "@trpc/server";
import { createHTTPServer } from "@trpc/server/adapters/standalone";
import cors from "cors";
import { z } from "zod";
import {
  login,
  signup,
  User,
  addSpending,
  addTransactions,
  getHistory,
  getSpending,
} from "./prisma";

const t = initTRPC.create();

const publicProcedure = t.procedure;
const router = t.router;

const appRouter = router({
  signup: publicProcedure
    .input(
      z.object({
        name: z.string().nonempty(),
        email: z.string().nonempty(),
        password: z.string().nonempty(),
      })
    )
    .mutation(async ({ input }) => {
      const name = input.name;
      const email = input.email;
      const password = input.password;

      const [user, valid]: [User, boolean] = await signup(
        name,
        email,
        password
      );

      if (!valid) {
        return {
          user: null,
          valid: false,
        };
      } else {
        return {
          user: user,
          valid: true,
        };
      }
    }),

  login: publicProcedure
    .input(
      z.object({
        email: z.string().nonempty(),
        password: z.string().nonempty(),
      })
    )
    .mutation(async ({ input }) => {
      const email = input.email;
      const password = input.password;

      const [user, isAuth]: [User, boolean] = await login(email, password);

      if (!isAuth) {
        return {
          user: null,
          auth: false,
        };
      } else {
        return {
          user: user,
          auth: true,
        };
      }
    }),
  addSpending: publicProcedure
    .input(
      z.object({
        email: z.string().nonempty(),
        name: z.string().nonempty(),
        time: z.string().nonempty(),
        amount: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      const res = await addSpending(
        input.email,
        input.name,
        input.amount,
        input.time
      );
      return {
        res,
      };
    }),
  addTrans: publicProcedure
    .input(
      z.object({
        email: z.string().nonempty(),
        type: z.string().nonempty(),
        from: z.string().nonempty(),
        to: z.string().nonempty(),
        amount: z.number(),
        time: z.string().nonempty(),
      })
    )
    .mutation(async ({ input }) => {
      const res = await addTransactions(
        input.email,
        input.type,
        input.from,
        input.to,
        input.amount,
        input.time
      );
      return {
        res,
      };
    }),
  getHistory: publicProcedure
    .input(
      z.object({
        email: z.string().nonempty(),
      })
    )
    .query(async ({ input }) => {
      const trans = await getHistory(input.email);
      trans.reverse();
      return {
        trans,
      };
    }),
  getSpending: publicProcedure
    .input(
      z.object({
        email: z.string().nonempty(),
      })
    )
    .query(async ({ input }) => {
      const items = await getSpending(input.email);
      items.reverse();
      return {
        items,
      };
    }),
});

export type AppRouter = typeof appRouter;

createHTTPServer({
  middleware: cors({
    origin: "*",
  }),
  router: appRouter,
  createContext() {
    return {};
  },
}).listen(4001);
console.log("Started TRPC server at 4001");
