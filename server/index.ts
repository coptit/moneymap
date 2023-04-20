import dotenv from "dotenv";
dotenv.config();

import { initTRPC } from "@trpc/server";
import { createHTTPServer } from "@trpc/server/adapters/standalone";
import cors from "cors";
import { z } from "zod";
import sendMail, { mailMeta } from "./sendMail";
import express, { Request, Response } from "express";
import { login, signup, User } from "./prisma";

const t = initTRPC.create();

const publicProcedure = t.procedure;
const router = t.router;

const appRouter = router({
  sendMail: publicProcedure
    .input(
      z.object({
        emails: z.array(z.string()),
        subject: z.string().nonempty(),
        text: z.string().nullish(),
        html: z.string().nullish(),
      })
    )
    .mutation(async ({ input }) => {
      for (const email of input.emails) {
        const mailData: mailMeta = {
          to: email,
          subject: input.subject,
          text: input.text ?? "",
          html: input.html ?? "",
        };

        await sendMail(mailData);
      }
    }),

  signup: publicProcedure
    .input(
      z.object({
        name: z.string().nonempty(),
        email: z.string().email().nonempty(),
        password: z.string().nonempty(),
      })
    )
    .mutation(async ({ input }) => {
      const name = input.name;
      const email = input.email;
      const password = input.password;

      const user: User = await signup(name, email, password);
      return {
        user: user,
      };
    }),

  login: publicProcedure
    .input(
      z.object({
        email: z.string().email().nonempty(),
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

/*
Server for REST API Endpoints
*/

const app = express();
app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/api/sendmail", async (req: Request, res: Response) => {
  const to = req.body.to;
  const subject = req.body.subject;
  const text = req.body.text;
  const html = req.body.html;

  const mailPayload: mailMeta = {
    to,
    subject,
    text,
    html,
  };

  const messageid = await sendMail(mailPayload);

  res.status(200);
  res.json({
    messageid,
  });
});

app.listen(4002, () => {
  console.log("REST App listening at port 4002");
});
