import { User } from "../App";
import { trpc } from "../utils/trpc";
import React from "react";

function HistoryCard({
  type,
  from,
  to,
  amount,
  time,
}: {
  type: string;
  from: string;
  to: string;
  amount: number;
  time: string;
}) {
  return (
    <div className="p-3 bg-gray-50 m-3 border-solid border-2 rounded flex justify-between">
      <div>
        <span className="mx-4">{from}</span>
        <span className="mx-4">{to}</span>
      </div>
      <span className="text-gray-400">{new Date(time).toLocaleString()}</span>
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
  let max_in = -99999999999;
  let max_out = -99999999999;

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
