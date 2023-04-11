import { useState, useEffect, useContext } from "react";
import { ContextUserId } from "@/App.jsx";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { PartnerMainNav } from "../../components";

export const SettingRoom = () => {
  const { userId, token } = useContext(ContextUserId);
  const [dataCoWork, setDataCoWork] = useState({});
  const [rooms, setRooms] = useState([]);
  const navigate = useNavigate();

  console.log("userId", userId);

  useEffect(() => {
    try {
      Object.keys(userId).length > 0 &&
        userId.role === "partner" &&
        getOldData();
    } catch (error) {
      navigate("/partner/welcome");
    }
  }, [userId]);

  //get old data
  const getOldData = () => {
    const data = JSON.stringify({
      userInternalId: userId.userId,
    });
    console.log("data", data);
    const config = {
      method: "post",
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
        setDataCoWork(response.data.coWork);
        // setRooms(response.data.coWork.BranchToRoom);
        const alignDataRooms = response.data.coWork.BranchToRoom.map(
          (room) => ({
            branchToRoomId: room.id,
            roomId: room.roomId,
            name: room.room.name,
            capacity: room.room.capacity,
            durations: room.room.RoomRate.map((rate) => ({
              duration: rate.duration.duration,
              price: rate.price,
              roomId: room.roomId,
              roomRateId: rate.id,
            })),
          })
        );
        setRooms(alignDataRooms);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const updateDataFunc = (branchToRoomId, key, value) => {
    const _temp = [...rooms];
    console.log("_tempRoom", _temp);
    const idxRoom = _temp.findIndex((r) => r.branchToRoomId === branchToRoomId);
    console.log("idxRoom", idxRoom);
    _temp[idxRoom][key] = value;
    setRooms(_temp);
  };

  const updateCheckBoxPrice = (branchToRoomId, duration, key, value) => {
    console.log("updateCheckBoxPrice", branchToRoomId, duration, key, value);
    const _temp = [...rooms];
    const idxRoom = _temp.findIndex((r) => r.branchToRoomId === branchToRoomId);
    const idxDuration = _temp[idxRoom].durations.findIndex(
      (r) => r.duration === duration
    );
    console.log("idxRoom", idxRoom);
    console.log("idxDuration", idxDuration);
    const newData =
      key === "price"
        ? idxDuration >= 0
          ? (_temp[idxRoom].durations[idxDuration].price = value)
          : [
              ..._temp[idxRoom].durations,
              {
                duration: duration,
                price: value,
                roomId: _temp[idxRoom].roomId,
                roomRateId: 0,
              },
            ]
        : idxDuration >= 0
        ? _temp[idxRoom].durations.filter((r) => r.duration !== duration)
        : [
            ..._temp[idxRoom].durations,
            {
              duration: duration,
              price: 0,
              roomId: _temp[idxRoom].roomId,
              roomRateId: 0,
            },
          ];
    console.log("newData", newData);
    console.log("_temp", _temp);

    if (key === "duration" || (key === "price" && idxDuration < 0)) {
      _temp[idxRoom].durations = newData;
    }

    setRooms(_temp);
  };

  console.log("rooms", rooms);

  const newRoom = () => {
    setRooms([
      ...rooms,
      {
        branchToRoomId: 0,
        coworkId: 0,
        name: "",
        capacity: 0,
        durations: [],
      },
    ]);
  };

  const submitBtn = (type, branchToRoomId) => {
    console.log("branchToRoomId", branchToRoomId);
    console.log("dataCoWork", dataCoWork);

    const dataRoom = rooms.filter(
      (r) => r.branchToRoomId === branchToRoomId
    )[0];
    console.log("dataRoom", dataRoom);
    const data = JSON.stringify({
      branchToRoomId: branchToRoomId,
      name: dataRoom.name,
      capacity: dataRoom.capacity,
      coworkId: dataCoWork.id,
      rates: dataRoom.durations.map((dul) => ({
        duration: dul.duration,
        price: dul.price,
        roomId: dul.roomId,
        roomRateId: dul.roomRateId,
      })),
    });
    console.log("data", data);
    console.log("token", token);
    const urlPath =
      type === "create" ? "createRoomInternal" : "updateRoomInternal";
    console.log("submit", data);
    const config = {
      method: "post",
      url: `${import.meta.env.VITE_API_BACKEND}/kowing/${urlPath}`,
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

  const deleteRoom = (roomId) => {
    console.log("delete rooId", roomId);
    const data = JSON.stringify({
      roomId: roomId,
    });

    const config = {
      method: "post",
      url: `${import.meta.env.VITE_API_BACKEND}/kowing/deleteRoom`,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        navigate("/partner/main");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="w-full h-full flex justify-center text-font-primary font-prompt text-sm md:mx-auto p-4 pt-20">
      <div className="w-full md:w-3/4 flex flex-col gap-y-4">
        <div className="header mb-0 md:mb-8">
          <h1 className="h-8 text-2xl text-center">{dataCoWork?.name}</h1>
        </div>
        <PartnerMainNav />
        <div className="flex flex-col gap-y-4 pl-12 md:pl-0">
          <div className="createBtn">
            <button
              onClick={() => newRoom()}
              className="w-fit font-medium bg-orange-200 disabled:bg-slate-200 hover:bg-orange-300 rounded-full p-2 px-4"
              disabled={rooms.filter((r) => r.branchToRoomId === 0).length > 0}
            >
              Create Room +
            </button>
          </div>
          <div className="newRoom grid grid-cols-1 lg:grid-cols-2 gap-4">
            {rooms.map((room, idx) => (
              <div
                key={`room_${room.branchToRoomId}`}
                className="flex flex-col gap-y-4 bg-orange-100/20 border-2 rounded-lg p-4"
              >
                <div className="">
                  <div className="w-fit font-medium mb-2">
                    ระบุชื่อห้องประชุม
                  </div>
                  <input
                    type="text"
                    className="w-full border-2 rounded-lg p-2 px-4"
                    value={room.name}
                    onChange={(e) =>
                      updateDataFunc(
                        room.branchToRoomId,
                        "name",
                        e.target.value
                      )
                    }
                  />
                </div>
                <div className="flex items-center">
                  <p className="font-medium">จำนวนลูกค้าที่รองรับได้</p>
                  <input
                    type="number"
                    className="w-1/5 border-2 rounded-lg p-2 px-4 ml-2"
                    value={room.capacity}
                    onChange={(e) =>
                      updateDataFunc(
                        room.branchToRoomId,
                        "capacity",
                        Number(e.target.value)
                      )
                    }
                  />
                </div>
                <div className="flex items-center">
                  <p className="font-medium">กำหนดราคา</p>
                </div>
                <div className="priceBlock">
                  <div className="flex flex-col gap-y-2 border-2 rounded-lg p-4">
                    {[1, 3, 6, 24].map((duration, idx) => (
                      <div
                        key={`room_${room.branchToRoomId}_duration_${duration}`}
                        className={`flex justify-between items-center gap-x-2 ${
                          duration === 24 ? "hidden" : ""
                        }`}
                      >
                        <input
                          type="checkbox"
                          id={`checkboxRoom_${room.branchToRoomId}_duration_${duration}`}
                          className="w-4 h-4 text-font-primary bg-gray-100 border-gray-300 rounded cursor-pointer"
                          checked={
                            room.durations != null
                              ? room.durations.filter(
                                  (r) => r.duration === duration
                                ).length > 0
                              : false
                          }
                          onChange={(e) =>
                            updateCheckBoxPrice(
                              room.branchToRoomId,
                              duration,
                              "duration",
                              duration
                            )
                          }
                        />
                        <div className="w-1/2">
                          <label
                            htmlFor={`checkboxRoom_${room.branchToRoomId}_duration_${duration}`}
                            className="cursor-pointer"
                          >
                            <span className="hidden md:block">ระยะเวลา</span>{" "}
                            {duration} ชั่วโมง
                          </label>
                        </div>

                        <p className="hidden md:block">ราคา</p>
                        <input
                          type="number"
                          className="w-4/12 md:w-3/12 border-2 rounded-lg p-2 ml-2"
                          value={
                            room.durations != null
                              ? room.durations.filter(
                                  (r) => r.duration === duration
                                ).length > 0
                                ? room.durations.filter(
                                    (r) => r.duration === duration
                                  )[0].price
                                : 0
                              : 0
                          }
                          disabled={
                            room.durations != null
                              ? room.durations.filter(
                                  (r) => r.duration === duration
                                ).length === 0
                              : true
                          }
                          onChange={(e) =>
                            updateCheckBoxPrice(
                              room.branchToRoomId,
                              duration,
                              "price",
                              Number(e.target.value)
                            )
                          }
                        />
                        <p>บาท</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex justify-between">
                  {room.branchToRoomId === 0 ? (
                    ""
                  ) : (
                    <button
                      className="w-28 bg-red-300 font-medium hover:bg-red-400 rounded-full duration-300 p-2 px-4"
                      onClick={() => deleteRoom(room.roomId)}
                    >
                      ลบห้อง
                    </button>
                  )}
                  {room.branchToRoomId === 0 ? (
                    <button
                      onClick={() => submitBtn("create", room.branchToRoomId)}
                      className="w-28 bg-green-300 font-medium hover:bg-green-400 rounded-full duration-300 p-2 px-4"
                    >
                      สร้างห้องใหม่
                    </button>
                  ) : (
                    <button
                      onClick={() => submitBtn("update", room.branchToRoomId)}
                      className="w-28 bg-green-300 font-medium hover:bg-green-400 rounded-full duration-300 p-2 px-4"
                    >
                      บันทึก
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
