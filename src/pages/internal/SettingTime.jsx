import { useState, useEffect, useContext } from "react";
import { ContextUserId } from "@/App.jsx";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { PartnerMainNav } from "../../components";

export const SettingTime = () => {
  const { userId, token } = useContext(ContextUserId);
  const [dataCoWork, setDataCoWork] = useState({});
  const [open, setOpen] = useState([...Array(7)].map((r) => false));
  const [openTime, setOpenTime] = useState([0, 0, 0, 0, 0, 0, 0]);
  const [closedTime, setClosedTime] = useState([0, 0, 0, 0, 0, 0, 0]);
  const [openClosed24Hours, setOpenClosed24Hours] = useState(
    [...Array(7)].map((r) => false)
  );
  const navigate = useNavigate();

  console.log("userId", userId);
  console.log("open", open);
  console.log("openTime", openTime);
  console.log("closedTime", closedTime);
  console.log("openClosed24Hours", openClosed24Hours);

  useEffect(() => {
    try {
      Object.keys(userId).length > 0 &&
        userId.role === "partner" &&
        getOldData();
    } catch (error) {
      navigate("/partner/welcome");
    }
  }, [userId]);

  useEffect(() => {
    const strOpen = [
      "sunOpen",
      "monOpen",
      "tueOpen",
      "wedOpen",
      "thursOpen",
      "friOpen",
      "satOpen",
    ].map(
      (str) => dataCoWork?.coWork?.Open != null && dataCoWork.coWork.Open[str]
    );
    dataCoWork?.coWork?.Open != null && setOpenTime(strOpen);

    const strClosed = [
      "sunClose",
      "monClose",
      "tueClose",
      "wedClose",
      "thursClose",
      "friClose",
      "satClose",
    ].map(
      (str) => dataCoWork?.coWork?.Close != null && dataCoWork.coWork.Close[str]
    );
    dataCoWork?.coWork?.Close != null && setClosedTime(strClosed);

    const strOpenClosed24Hours = [
      "sun24hours",
      "mon24hours",
      "tue24hours",
      "wed24hours",
      "thurs24hours",
      "fri24hours",
      "sat24hours",
    ].map(
      (str) =>
        dataCoWork?.coWork?.OpenClose24Hours != null &&
        dataCoWork.coWork.OpenClose24Hours[str]
    );
    dataCoWork?.coWork?.OpenClose24Hours != null &&
      setOpenClosed24Hours(strOpenClosed24Hours);

    const strOpenClosedBoolean = [
      "sunOnOff",
      "monOnOff",
      "tueOnOff",
      "wedOnOff",
      "thursOnOff",
      "friOnOff",
      "satOnOff",
    ].map(
      (str) =>
        dataCoWork?.coWork?.OpenCloseBoolean != null &&
        dataCoWork.coWork.OpenCloseBoolean[str]
    );
    dataCoWork?.coWork?.OpenCloseBoolean != null &&
      setOpen(strOpenClosedBoolean);
  }, [dataCoWork]);

  //get old data
  const getOldData = () => {
    const data = JSON.stringify({
      userInternalId: userId.userId,
    });
    console.log("data", data);
    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${import.meta.env.VITE_API_BACKEND}/kowing/getCoworkByUserId`,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        setDataCoWork(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const submitData = () => {
    const data = JSON.stringify({
      open: open.map((r, idx) =>
        r ? (openClosed24Hours[idx] ? 0 : openTime[idx]) : 0
      ),
      close: open.map((r, idx) =>
        r ? (openClosed24Hours[idx] ? 0 : closedTime[idx]) : 0
      ),
      openCloseBoolean: open,
      openClose24hours: openClosed24Hours,
      coWorkId: dataCoWork.coWork.id,
    });
    console.log("submit", data);
    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${import.meta.env.VITE_API_BACKEND}/kowing/createTimeOpenClose`,
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
      data: data,
    };
    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        // getOldData();
        navigate("/partner/main");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const settingFunc = (state, setStateFunc, idx, value) => {
    const _temp = [...state];
    _temp[idx] = value === "true";
    setStateFunc(_temp);
  };

  const settingTime = (state, setStateFunc, idx, value) => {
    const _temp = [...state];
    _temp[idx] = Number(value);
    setStateFunc(_temp);
  };

  return (
    <div className="w-full h-full flex justify-center text-font-primary font-prompt text-sm p-4 pt-20">
      <div className="w-full lg:w-3/4 flex flex-col gap-y-4">
        <div className="header mb-0 md:mb-8">
          <h1 className="h-8 text-2xl text-center">
            {dataCoWork?.coWork?.name}
          </h1>
        </div>
        <PartnerMainNav />
        <div className="flex flex-col gap-y-4 pl-12 md:pl-0">
          <div className="timeBlock flex flex-col gap-y-2 mt-8">
            <p className="font-medium">Setting: OPEN / CLOSED Time</p>
            <div className="relative overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs uppercase bg-orange-200/30">
                  <tr className="">
                    <th className="hidden md:table-cell px-6 py-3">No.</th>
                    <th className="px-6 py-3">Day</th>
                    <th className="px-6 py-3">Open / Closed</th>
                    <th className="px-6 py-3">24Hrs(n/a)</th>
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
                        {/* openClosedBtn */}
                        <div className="openClosedBtn flex flex-col md:flex-row gap-x-4">
                          <div className="flex gap-x-2">
                            <input
                              type="radio"
                              name={`${days[idx]}open/closed`}
                              id={`${days[idx]}_open`}
                              value={true}
                              checked={open[idx]}
                              onChange={(e) =>
                                settingFunc(open, setOpen, idx, e.target.value)
                              }
                              className="cursor-pointer"
                            />
                            <label
                              className="cursor-pointer"
                              htmlFor={`${days[idx]}_open`}
                            >
                              Open
                            </label>
                          </div>
                          <div className="flex gap-x-2">
                            <input
                              type="radio"
                              name={`${days[idx]}open/closed`}
                              id={`${days[idx]}_closed`}
                              value={false}
                              checked={!open[idx]}
                              onChange={(e) =>
                                settingFunc(open, setOpen, idx, e.target.value)
                              }
                              className="cursor-pointer"
                            />
                            <label
                              className="cursor-pointer"
                              htmlFor={`${days[idx]}_closed`}
                            >
                              Closed
                            </label>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {/* openClosed24Hours */}
                        <div className="openClosed24Hours flex flex-col md:flex-row gap-x-4">
                          <div className="flex gap-x-2">
                            <input
                              type="radio"
                              name={`${days[idx]}_24`}
                              id={`${days[idx]}_24yes`}
                              value={true}
                              checked={openClosed24Hours[idx]}
                              // disabled={!open[idx]}
                              disabled={true} //feature log
                              onChange={(e) =>
                                settingFunc(
                                  openClosed24Hours,
                                  setOpenClosed24Hours,
                                  idx,
                                  e.target.value
                                )
                              }
                              className="cursor-pointer"
                            />
                            <label
                              className="cursor-pointer"
                              htmlFor={`${days[idx]}_24yes`}
                            >
                              Yes
                            </label>
                          </div>
                          <div className="flex gap-x-2">
                            <input
                              type="radio"
                              name={`${days[idx]}_24`}
                              id={`${days[idx]}_24no`}
                              value={false}
                              checked={!openClosed24Hours[idx]}
                              // disabled={!open[idx]}
                              disabled={true} //feature log
                              onChange={(e) =>
                                settingFunc(
                                  openClosed24Hours,
                                  setOpenClosed24Hours,
                                  idx,
                                  e.target.value
                                )
                              }
                              className="cursor-pointer"
                            />
                            <label
                              className="cursor-pointer"
                              htmlFor={`${days[idx]}_24no`}
                            >
                              No
                            </label>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {/* openTime */}
                        <div className="openTime">
                          <select
                            id="openTime"
                            className="border border-gray-300 text-sm rounded-lg block cursor-pointer p-1 md:p-2"
                            disabled={!open[idx] || openClosed24Hours[idx]}
                            value={openTime[idx]}
                            onChange={(e) =>
                              settingTime(
                                openTime,
                                setOpenTime,
                                idx,
                                e.target.value
                              )
                            }
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
                      <td className="px-6 py-4">
                        {/* closedTime */}
                        <div className="closedTime">
                          <select
                            id="closedTime"
                            className="border border-gray-300 text-sm rounded-lg block cursor-pointer p-1 md:p-2"
                            disabled={!open[idx] || openClosed24Hours[idx]}
                            value={closedTime[idx]}
                            onChange={(e) =>
                              settingTime(
                                closedTime,
                                setClosedTime,
                                idx,
                                e.target.value
                              )
                            }
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
            {dataCoWork.coWork != null && (
              <button
                onClick={() => submitData()}
                className="w-full md:w-40 font-medium bg-green-300 hover:bg-green-400 rounded-full p-2 px-4"
              >
                บันทึก
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
