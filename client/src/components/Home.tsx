import React, { useState } from "react";
import { User } from "../App";
import { client } from "../App";

function getFirstName(name: string): string {
  const names = name.split(" ");
  return names[0];
}
function SpendingModal({
  setSModal,
  user,
}: {
  setSModal: React.Dispatch<React.SetStateAction<boolean>>;
  user: User;
}) {
  const [item, setItem] = useState("");
  const [amount, setAmount] = useState(0);

  return (
    <>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="relative w-auto my-6 mx-auto max-w-3xl">
          {/*content*/}
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
            {/*header*/}
            <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
              <h3 className="text-2xl font-semibold">Add Spending</h3>
            </div>
            {/*body*/}
            <div className="relative p-6 flex-auto">
              <div className="my-4 text-slate-500 text-lg leading-relaxed">
                <div>
                  <label>Item</label>
                  <input
                    placeholder="Coffee mug"
                    className="m-2 p-2 bg-gray-100"
                    onChange={(e) => {
                      e.preventDefault();
                      setItem(e.target.value);
                    }}
                  />
                  <br />
                  <label>Amount</label>
                  <input
                    placeholder="100"
                    className="m-2 p-2 bg-gray-100"
                    onChange={(e) => {
                      e.preventDefault();
                      setAmount(+e.target.value);
                    }}
                  />
                </div>
              </div>
            </div>
            {/*footer*/}
            <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
              <button
                className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                onClick={(e) => {
                  e.preventDefault();
                  setSModal(false);
                }}
                type="button"
              >
                Close
              </button>
              <button
                className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                onClick={async (e) => {
                  e.preventDefault();

                  const res = await client.addSpending.mutate({
                    email: user.email,
                    name: item,
                    time: new Date().toString(),
                    amount: amount,
                  });

                  console.log(res);

                  setSModal(false);
                }}
                type="button"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
  );
}

function TransModal({
  setTModal,
  user,
}: {
  setTModal: React.Dispatch<React.SetStateAction<boolean>>;
  user: User;
}) {
  const [type, setType] = useState<"send" | "receive">("receive");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState(0);

  return (
    <>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="relative w-auto my-6 mx-auto max-w-3xl">
          {/*content*/}
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
            {/*header*/}
            <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
              <h3 className="text-2xl font-semibold">Add Transition</h3>
            </div>
            {/*body*/}
            <div className="relative p-6 flex-auto">
              <div className="my-4 text-slate-500 text-lg leading-relaxed">
                <div>
                  <div className="flex flex-start gap-8">
                    <button
                      className={`rounded border-solid border-2 p-2 font-bold ${
                        type === "receive"
                          ? "bg-[#C9F4AA] border-green-100"
                          : ""
                      }`}
                      onClick={(e) => {
                        e.preventDefault();
                        setType("receive");
                      }}
                    >
                      Received
                    </button>
                    <button
                      className={`rounded border-solid border-2 p-2 font-bold ${
                        type === "send" ? "bg-[#E96479] border-red-100" : ""
                      }`}
                      onClick={(e) => {
                        e.preventDefault();
                        setType("send");
                      }}
                    >
                      Send
                    </button>
                  </div>
                  <br />
                  <label>From</label>
                  <input
                    type="text"
                    placeholder="Sender"
                    className="m-2 p-2 bg-gray-100"
                    onChange={(e) => {
                      e.preventDefault();
                      setFrom(e.target.value);
                    }}
                  />
                  <br />
                  <label>To</label>
                  <input
                    type="text"
                    placeholder="Receiver"
                    className="m-2 p-2 bg-gray-100"
                    onChange={(e) => {
                      e.preventDefault();
                      setTo(e.target.value);
                    }}
                  />
                  <br />
                  <label>Amount</label>
                  <input
                    type="text"
                    placeholder="100"
                    className="m-2 p-2 bg-gray-100"
                    onChange={(e) => {
                      e.preventDefault();
                      setAmount(e.target.value.length ? +e.target.value : 0);
                    }}
                  />
                </div>
              </div>
            </div>
            {/*footer*/}
            <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
              <button
                className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                onClick={(e) => {
                  e.preventDefault();
                  setTModal(false);
                }}
                type="button"
              >
                Close
              </button>
              <button
                className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                onClick={async (e) => {
                  e.preventDefault();

                  const res = await client.addTrans.mutate({
                    type,
                    email: user.email,
                    from,
                    to,
                    amount,
                    time: new Date().toString(),
                  });

                  console.log(res);

                  setTModal(false);
                }}
                type="button"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
  );
}

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
        className={`${pos ? "text-[#539165]" : "text-[#FC2947]"} font-bold`}
      >
        {pos ? "+" : "-"}
        {value} {" Rs"}
      </span>
    </div>
  );
}

export function Home({ user }: { user: User }) {
  const [tModal, setTModal] = useState(false);
  const [sModal, setSModal] = useState(false);

  return (
    <div>
      <div className="flex justify-around items-center rounded bg-gray-100 my-10">
        <h1 className="text-xl font-bold">{`Hello, ${getFirstName(
          user.name
        )}`}</h1>
        <div>
          <button
            className="bg-[#98D8AA] rounded p-2 my-3 mx-4 hover:bg-[#87CBB9]"
            onClick={(e) => {
              e.preventDefault();
              setTModal(true);
            }}
          >
            {" "}
            &#43; Transitions
          </button>
          <button
            className="bg-[#F6BA6F] rounded p-2 my-3 mx-4  hover:bg-[#FFA559]"
            onClick={(e) => {
              e.preventDefault();
              setSModal(true);
            }}
          >
            {" "}
            &#43; Spending
          </button>
        </div>
      </div>
      <div className="text-1xl font-bold">Transitions Overview</div>
      <div className="flex justify-between">
        <div>
          <div className="flex flex-wrap">
            <Overview title="Total In" value={100} pos={true} />
            <Overview title="Total Out" value={40} pos={false} />
            <Overview title="Max In" value={10} pos={true} />
            <Overview title="Max Out" value={5} pos={false} />
          </div>
          <div>Graph</div>
        </div>
        <div>History</div>
      </div>
      {tModal && <TransModal setTModal={setTModal} user={user} />}
      {sModal && <SpendingModal setSModal={setSModal} user={user} />}
    </div>
  );
}
