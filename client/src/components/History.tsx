import { User } from "../App";
import { trpc } from "../utils/trpc";
import React from "react";

function HistoryCard({
  type,
  name,
  from,
  to,
  amount,
  time,
}: {
  type?: string;
  name?: string;
  from?: string;
  to?: string;
  amount?: number;
  time?: string;
}) {
  return (
    <div className="p-3 bg-gray-50 m-3 border-solid border-2 rounded flex justify-between">
      <div>
        <span className={`${from === "" || !from ? "" : "m-4"}`}>{from}</span>
        <span className={`${to === "" || !to ? "" : "m-4"}`}>{to}</span>
        <span>{name}</span>
      </div>
      <span className="text-gray-400">
        {new Date(time || "").toLocaleString()}
      </span>
      <span
        className={` font-bold ${
          type === "receive" ? "text-[#16FF00]" : "text-[#FF0032]"
        }`}
      >
        {type === "receive" ? "+" : "-"}
        {amount} {" Rs"}
      </span>
    </div>
  );
}

export function History({
  user,
  setTotalIn,
  setTotalOut,
  setMaxIn,
  setMaxOut,
}: {
  user: User;
  setTotalIn: React.Dispatch<React.SetStateAction<number>>;
  setTotalOut: React.Dispatch<React.SetStateAction<number>>;
  setMaxIn: React.Dispatch<React.SetStateAction<number>>;
  setMaxOut: React.Dispatch<React.SetStateAction<number>>;
}) {
  const trans = trpc.getHistory.useQuery({ email: user.email });

  if (trans.data?.trans === undefined) {
    return <h1>No History</h1>;
  }

  let total_in = 0;
  let total_out = 0;
  let max_in = 0;
  let max_out = 0;

  for (const trx of trans.data.trans) {
    if (trx.type === "receive") {
      total_in += trx.amount;
      max_in = Math.max(max_in, trx.amount);
    } else {
      total_out += trx.amount;
      max_out = Math.max(max_out, trx.amount);
    }
  }

  setTotalIn(total_in);
  setTotalOut(total_out);
  setMaxIn(max_in);
  setMaxOut(max_out);

  return (
    <div>
      {trans.data.trans.map((data, ind) => {
        return (
          <h1 key={ind}>
            <HistoryCard
              type={data.type}
              from={data.from}
              to={data.to}
              amount={data.amount}
              time={data.time}
            />
          </h1>
        );
      })}
    </div>
  );
}

export function HistorySpending({
  user,
  setTotalSpend,
  setMaxSpend,
}: {
  user: User;
  setTotalSpend: React.Dispatch<React.SetStateAction<number>>;
  setMaxSpend: React.Dispatch<React.SetStateAction<number>>;
}) {
  const items = trpc.getSpending.useQuery({ email: user.email });

  if (items.data?.items === undefined) {
    return <h1>No History</h1>;
  }

  let total_spend = 0;
  let max_spend = 0;

  for (const trx of items.data.items) {
    total_spend += trx.amount;
    max_spend += Math.max(max_spend, trx.amount);
  }

  setTotalSpend(total_spend);
  setMaxSpend(max_spend);

  return (
    <div>
      {items.data.items.map((data, ind) => {
        return (
          <h1 key={ind}>
            <HistoryCard
              name={data.name}
              amount={data.amount}
              time={data.time}
            />
          </h1>
        );
      })}
    </div>
  );
}
