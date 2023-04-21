import React, { useEffect, useState } from "react";
import { User } from "../App";
import { client } from "../App";
import {
  Chart,
  LineController,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  PolarAreaController,
  RadialLinearScale,
  ArcElement,
} from "chart.js";
import { HistorySpending } from "./History";

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
    client.getSpending.query({ email: user.email }).then((res) => {
      const prev = document.querySelector(".trx-graph2");
      prev?.remove();
      const trxGraph = document.createElement("canvas");
      trxGraph.classList.add("trx-graph2");
      const parentDiv = document.querySelector(".overview-cde");
      parentDiv?.appendChild(trxGraph);

      Chart.register(LineController);
      Chart.register(CategoryScale);
      Chart.register(LinearScale);
      Chart.register(PointElement);
      Chart.register(LineElement);
      Chart.register(PolarAreaController);
      Chart.register(RadialLinearScale);
      Chart.register(ArcElement);

      const arr = res.items;
      type item_type = typeof arr[0];

      const labels: string[] = [];
      const amounts: number[] = [];

      console.log(arr);

      arr.sort((a: item_type, b: item_type) => {
        if (a >= b) return +1;
        else return -1;
      });

      console.log(arr);

      let i = 0;
      for (const item of arr) {
        labels.push(item.name);
        amounts.push(item.amount);
        i++;
        if (i >= 5) break;
      }

      new Chart(trxGraph as HTMLCanvasElement, {
        type: "polarArea",
        data: {
          labels: labels,
          datasets: [
            {
              label: "Top 5 Bought Items",
              data: amounts,
              backgroundColor: [
                "rgb(255, 99, 132)",
                "rgb(75, 192, 192)",
                "rgb(255, 205, 86)",
                "rgb(201, 203, 207)",
                "rgb(54, 162, 235)",
              ],
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: "Top 5 Expense",
            },
          },
          scales: {
            x: {},
          },
        },
      });
    });
  }, []);

  return (
    <>
      <div className="text-1xl font-bold">Spending Overview</div>
      <div className="flex justify-between">
        <div className="overview-cde">
          <div className="flex flex-wrap">
            <Overview title="Total Spend" value={totalSpend} pos={true} />
            <Overview title="Max Spend" value={maxSpend} pos={true} />
          </div>
        </div>
        <div className="p-5 w-[50%] h-[400px] overflow-scroll">
          <span className="font-bold">History</span>
          <HistorySpending
            user={user}
            setTotalSpend={setTotalSpend}
            setMaxSpend={setMaxSpend}
          />
        </div>
      </div>
    </>
  );
}
