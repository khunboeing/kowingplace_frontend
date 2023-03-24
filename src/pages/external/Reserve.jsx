import { useParams } from "react-router-dom";
import { Calendar } from "../../components";
import { useState, useEffect, useRef } from "react";
import logo from "@/assets/images/letter-k.png";
import axios from "axios";
import { FaUsers } from "react-icons/fa";

export const Reserve = () => {
  const { branchId } = useParams();
  const [timeAvailableDB, setTimeAvailableDB] = useState({});
  const [availableStartTime, setAvailableStartTime] = useState([]);
  const [tabSelect, setTabSelect] = useState("room");
  const [selectTime, setSelectTime] = useState({ type: 0, time: undefined });
  const [modal, setModal] = useState({ show: false, page: "" });
  const [dataRooms, setDataRooms] = useState([]);
  const [selectRoom, setSelectRoom] = useState(0);
  const [selectDateTime, setSelectDateTime] = useState({
    year: 0,
    month: 0,
    date: 0,
    day: 0,
    key: 0,
  });

  const modalRef = useRef(null);

  useEffect(() => {
    const checkIfClickedOutside = (e) => {
      console.log(modal);
      if (
        modal.page === "confirm" &&
        modalRef.current &&
        !modalRef.current.contains(e.target)
      ) {
        setModal({ show: false, page: "" });
      }

      if (
        modal.page === "result" &&
        modalRef.current &&
        !modalRef.current.contains(e.target)
      ) {
        window.location.replace("/");
      }
    };
    document.addEventListener("mousedown", checkIfClickedOutside);
    return () => {
      document.removeEventListener("mousedown", checkIfClickedOutside);
    };
  }, [modal]);

  //get all room of branch id
  useEffect(() => {
    const getAllRoom = () => {
      const data = JSON.stringify({
        coWorkId: Number(branchId),
      });

      const config = {
        method: "post",
        maxBodyLength: Infinity,
        url: "http://localhost:7470/kowing/getRoomByCoWorkId",
        headers: {
          "Content-Type": "application/json",
        },
        data: data,
      };

      axios
        .request(config)
        .then((response) => {
          // console.log(JSON.stringify(response.data));
          setDataRooms(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    };

    getAllRoom();
  }, []);

  //set btn time available
  useEffect(() => {
    const dataMock = {
      typeTime: [1, 3, 6, 10],
      slotTime: [8, 9, 10, 11, 12, 15, 16, 17],
      open: 8,
      close: 18,
    };

    const genTimeChoice = () => {
      console.log("setAvailableStartTime");
      const startTime = dataMock.typeTime?.map((type) => {
        const inOpenTime = dataMock.slotTime.filter(
          (slot) => slot + type <= dataMock.close
        );
        // //console.log("inOpenTime", inOpenTime);

        const available = inOpenTime.filter((r) => {
          // //console.log("type", type);
          const checkEachHour = [...Array(type)].map((k, idx) =>
            dataMock.slotTime.includes(r + idx)
          );
          // //console.log("checkEachHour", checkEachHour);
          // //console.log(
          // //  "result",
          // //  checkEachHour.every((r) => r)
          // //);
          return checkEachHour.every((r) => r);
        });

        // //console.log({ type: type, start: available });

        return { type: type, start: available };
      });
      console.log(startTime);
      setAvailableStartTime(startTime);
      console.log("selectRoom", selectRoom);
      setTabSelect("time");
    };

    selectDateTime.year !== 0 &&
      selectDateTime.month !== 0 &&
      selectDateTime.date !== 0 &&
      selectDateTime.day !== 0 &&
      selectRoom !== 0 &&
      genTimeChoice();
  }, [selectDateTime, selectRoom]);

  useEffect(() => {
    selectDateTime.year !== 0 &&
      selectDateTime.month !== 0 &&
      selectDateTime.date !== 0 &&
      selectDateTime.day !== 0 &&
      selectRoom !== 0 &&
      selectTime.type !== 0 &&
      selectTime.time !== undefined &&
      setModal({ show: true, page: "confirm" });
  }, [selectTime]);

  useEffect(() => {
    console.log("listening", modal);
  }, [modal]);

  const reserveFunc = () => {
    //
    setModal({ show: true, page: "result" });
  };

  return (
    <div className="relative w-full flex justify-center text-font-primary font-prompt text-sm md:mx-auto p-4 pt-20">
      <div className="w-full lg:w-3/4 flex justify-center items-center gap-y-8">
        <div className="mainBlock w-full flex flex-col md:flex-row gap-4">
          <div className="calendarBlock w-full md:w-7/12 flex flex-col gap-4">
            <div>
              <h1 className="text-2xl">{dataRooms?.name}</h1>
            </div>
            <Calendar
              selectDateTime={selectDateTime}
              setSelectDateTime={setSelectDateTime}
            />
          </div>

          <div className="detailBlock w-full md:w-5/12 flex flex-col gap-2">
            <div className="flex justify-around">
              {["room", "time"].map((tab, idx) => (
                <button
                  key={tab}
                  onClick={() => setTabSelect(tab)}
                  className={`w-1/2 ${
                    tabSelect === tab ? "bg-gray-500" : "bg-gray-400"
                  } text-white ${
                    ["rounded-l-full", "rounded-r-full"][idx]
                  } p-2 px-4`}
                >
                  <h1 className="">{["เลือกห้องประชุม", "เลือกเวลา"][idx]}</h1>
                </button>
              ))}
            </div>
            {tabSelect === "room" && (
              <div className="h-full border-2 rounded-lg p-4">
                <div className="text-center mb-4">
                  <p>กรุณาเลือกห้องประชุมที่ต้องการ</p>
                </div>
                {dataRooms?.BranchToRoom?.length > 0 && (
                  <div className="roomList flex md:max-h-[400px] flex-col gap-y-4 overflow-y-auto">
                    {dataRooms?.BranchToRoom?.map((room) => (
                      <button
                        key={room.room.name}
                        onClick={() => setSelectRoom(room.room.id)}
                        className={`w-full flex items-center justify-center gap-x-2 hover:bg-orange-400/50 ${
                          selectRoom === room.room.id
                            ? "bg-orange-400/50 border-orange-500 border-2"
                            : "bg-orange-300/30"
                        } rounded-full p-2 px-4`}
                      >
                        {`${room.room.name}`}
                        <div className="flex items-center justify-center gap-x-1">
                          <FaUsers />
                          {`${room.room.capacity}`}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {tabSelect === "time" && (
              <div className="h-full border-2 rounded-lg p-4">
                <div className="text-center mb-4">
                  <p>กรุณาเลือกเวลาที่ต้องการ</p>
                </div>
                {selectRoom != 0 && (
                  <div className="timeList overflow-y-auto md:max-h-[400px]">
                    {availableStartTime.map((type) => (
                      <div
                        className="flex flex-col gap-y-2 mb-2"
                        key={`type_${type.type}`}
                      >
                        <p className="sticky top-0 bg-white text-center font-medium">
                          {type.type} ชั่วโมง
                        </p>
                        {type.start.map((time, idx) => (
                          <button
                            key={`typeStart_${type.type}_${time}`}
                            onClick={() =>
                              setSelectTime({
                                type: type.type,
                                time: time,
                              })
                            }
                            className="w-full bg-orange-200/50 hover:bg-orange-300 rounded-full p-2 px-4"
                          >
                            {`${time}:00 - ${time + type.type}:00`}
                          </button>
                        ))}
                        <hr />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {modal.show && (
        <div className="popUp fixed w-full h-full top-0 left-0 flex justify-center items-center bg-slate-900/50 p-4">
          {modal.page === "confirm" && (
            <div
              ref={modalRef}
              className="md:w-2/5 flex flex-col gap-y-4 bg-white rounded-lg p-8"
            >
              <h1 className="text-2xl font-medium text-center">
                {dataRooms?.name}
              </h1>
              <div className="w-full flex justify-center">
                <div className="w-fit flex flex-col gap-y-2">
                  <h1 className="text-xl font-medium">
                    <span className="text-sm font-normal">คุณได้เลือก</span>{" "}
                    {
                      dataRooms?.BranchToRoom.filter(
                        (room) => room.roomId === selectRoom
                      )[0].room.name
                    }
                    <FaUsers
                      size={25}
                      className="inline-block text-orange-400 mx-2"
                    />
                    {
                      dataRooms?.BranchToRoom.filter(
                        (room) => room.roomId === selectRoom
                      )[0].room.capacity
                    }
                  </h1>
                  <p className="text-xl font-medium">
                    <span className="text-sm font-normal">วันที่</span>{" "}
                    {`${selectDateTime.date}/${selectDateTime.month}/${selectDateTime.year}`}{" "}
                    <span className="text-sm">เวลา</span>{" "}
                    {`${selectTime.time}.00-${
                      selectTime.time + selectTime.type
                    }.00`}
                  </p>
                  <p>
                    รูปแบบการจอง :{" "}
                    <span className="text-xl font-medium">
                      {`${selectTime.type} ชั่วโมง`}
                    </span>
                  </p>
                  <p>ราคา : ยังไม่มีราคา</p>
                </div>
              </div>
              <button
                onClick={() => reserveFunc()}
                className="w-full bg-green-300 font-medium hover:bg-green-400 rounded-full p-2 px-4 duration-300"
              >
                ยืนยันการจอง
              </button>
            </div>
          )}

          {modal.page === "result" && (
            <div
              ref={modalRef}
              className="md:w-2/5 flex flex-col gap-y-4 bg-white rounded-lg p-8"
            >
              <h1 className="text-2xl font-medium text-center">
                {
                  dataRooms?.BranchToRoom.filter(
                    (room) => room.roomId === selectRoom
                  )[0].room.name
                }
              </h1>
              <div className="w-full flex justify-center">
                <div className="w-fit flex flex-col gap-y-2">
                  <h1 className="text-xl text-center font-medium text-green-400">
                    ระบบได้ทำการยืนยันการจองสำเร็จ
                  </h1>
                  <p>
                    กรุณาแสดงรหัส{" "}
                    <span className="text-xl font-medium">{11111}</span> ณ
                    เคาท์เตอร์ที่ให้บริการ พร้อมชำระเงินที่ร้านค้า
                  </p>
                </div>
              </div>
              <p className="h-full flex items-end justify-end">
                <img alt="" src={logo} className="w-5 h-5 mr-2" />
                Kowing Place ยินดีให้บริการ
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
