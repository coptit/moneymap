import React, { useEffect, useState } from "react";
import { User } from "../App";
import { client } from "../App";
import { History } from "./History";
import {
  Chart,
  LineController,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
} from "chart.js";

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sept",
  "Oct",
  "Nov",
  "Dev",
];

function Overview({
  title,
  value,
  pos,
}: {
  title: string;
  value: number;
  pos: boolean;
}) {
  return (
    <div className="px-8 py-2 m-3 rounded bg-gray-50 text-left">
      <span className="text-gray-500">{title}</span>
      <br />
      <span
        className={`${pos ? "text-[#16FF00]" : "text-[#FC2947]"} font-bold`}
      >
        {pos ? "+" : "-"}
        {value} {" Rs"}
      </span>
    </div>
  );
}

export function Spending({ user }: { user: User }) {
  const [totalSpend, setTotalSpend] = useState(0);
  const [maxSpend, setMaxSpend] = useState(0);

  useEffect(() => {
    client.getHistory.query({ email: user.email }).then((res) => {
      const prev = document.querySelector(".trx-graph");
      prev?.remove();
      const trxGraph = document.createElement("canvas");
      trxGraph.classList.add("trx-graph");
      const parentDiv = document.querySelector(".overview-abc");
      parentDiv?.appendChild(trxGraph);

      Chart.register(LineController);
      Chart.register(CategoryScale);
      Chart.register(LinearScale);
      Chart.register(PointElement);
      Chart.register(LineElement);

      const arr = res.trans;
      arr.reverse();

      const labels: string[] = [];
      const amounts: number[] = [];
      for (const trx of arr) {
        const date = new Date(trx.time);
        labels.push(`${date.getDate()}, ${months[date.getMonth()]}`);
        amounts.push(trx.amount);
      }

      new Chart(trxGraph as HTMLCanvasElement, {
        type: "line",
        data: {
          labels: labels,
          datasets: [
            {
              label: "Received",
              data: amounts,
              borderColor: "green",
              // backgroundColor: Utils.transparentize(Utils.CHART_COLORS.red, 0.5),
            },
          ],
        },
      });
    });
  }, []);

  return (
    <>
      <div className="text-1xl font-bold">Spending Overview</div>
      <div className="flex justify-between">
        <div className="overview-abc">
          <div className="flex flex-wrap">
            <Overview title="Total Spend" value={totalSpend} pos={true} />
            <Overview title="Max Spend" value={maxSpend} pos={true} />
          </div>
        </div>
        <div className="p-5 w-[50%] h-[400px] overflow-scroll">
          <span className="font-bold">History</span>
        </div>
      </div>
    </>
  );
}
