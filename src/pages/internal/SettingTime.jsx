import React from "react";

export const SettingTime = () => {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  return (
    <div className="w-full h-full flex justify-center text-font-primary font-prompt text-sm p-4 pt-20 md:py-20">
      <div className="w-full md:w-3/4 flex flex-col gap-y-8">
        <div className="header">
          <h1 className="text-2xl text-center">Too fast too sleep Shop</h1>
        </div>
        <div className="timeBlock flex flex-col gap-y-2">
          <p className="font-medium">Sitting: OPEN / CLOSED Time</p>
          <div className="relative overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-orange-200/30">
                <tr className="">
                  <th className="hidden md:table-cell px-6 py-3">No.</th>
                  <th className="px-6 py-3">Day</th>
                  <th className="px-6 py-3">Open / Closed</th>
                  <th className="px-6 py-3">24Hrs</th>
                  <th className="px-6 py-3">Open Time</th>
                  <th className="px-6 py-3">Closed Time</th>
                </tr>
              </thead>
              <tbody className="">
                {days.map((day, idx) => (
                  <tr key={`row_${day[idx]}`} className="bg-white border-b">
                    <td className="hidden md:table-cell px-6 py-4 font-medium whitespace-nowrap">
                      <div className="">{idx + 1}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="">{days[idx]}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col md:flex-row gap-x-4">
                        <div className="flex gap-x-2">
                          <input
                            type="radio"
                            name={`${days[idx]}open/closed`}
                            id={`${days[idx]}_open`}
                            value={true}
                          />
                          <label htmlFor={`${days[idx]}_open`}>Open</label>
                        </div>
                        <div className="flex gap-x-2">
                          <input
                            type="radio"
                            name={`${days[idx]}open/closed`}
                            id={`${days[idx]}_closed`}
                            value={false}
                          />
                          <label htmlFor={`${days[idx]}_closed`}>Closed</label>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col md:flex-row gap-x-4">
                        <div className="flex gap-x-2">
                          <input
                            type="radio"
                            name={`${days[idx]}_24yes`}
                            id={`${days[idx]}_24yes`}
                            value={true}
                          />
                          <label htmlFor={`${days[idx]}_24yes`}>Yes</label>
                        </div>
                        <div className="flex gap-x-2">
                          <input
                            type="radio"
                            name={`${days[idx]}_24no`}
                            id={`${days[idx]}_24no`}
                            value={false}
                          />
                          <label htmlFor={`${days[idx]}_24no`}>No</label>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="">
                        <select
                          id="openTime"
                          className="border border-gray-300 text-sm rounded-lg block p-1 md:p-2"
                        >
                          {[...Array(24)].map((time, idx) => (
                            <option
                              key={`openTime_${idx}`}
                              value={idx}
                            >{`${idx}:00`}</option>
                          ))}
                        </select>
                      </div>
                    </td>
                    <td className="">
                      <div className="">
                        <select
                          id="closedTime"
                          className="border border-gray-300 text-sm rounded-lg block p-1 md:p-2"
                        >
                          {[...Array(24)].map((time, idx) => (
                            <option
                              key={`closedTime_${idx}`}
                              value={idx}
                            >{`${idx}:00`}</option>
                          ))}
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="flex justify-end">
          <button className="w-40 font-medium bg-green-300 hover:bg-green-400 rounded-full p-2 px-4">
            บันทึก
          </button>
        </div>
      </div>
    </div>
  );
};