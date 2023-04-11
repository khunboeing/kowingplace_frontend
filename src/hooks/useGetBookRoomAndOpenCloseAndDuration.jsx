import { useState, useEffect } from "react";
import axios from "axios";

export const UseGetBookRoomAndOpenCloseAndDuration = ({
  selectDateTime,
  selectRoom,
  setTabSelect,
}) => {
  const [detailBookRoom, setDetailBookRoom] = useState({});
  const [timeAvailableDB, setTimeAvailableDB] = useState({});
  const [availableStartTime, setAvailableStartTime] = useState([]);
  const strDay = ["sun", "mon", "tue", "wed", "thurs", "fri", "sat"];

  useEffect(() => {
    const getBookRoom = () => {
      const submitTime = new Date(
        selectDateTime.year,
        selectDateTime.month - 1,
        selectDateTime.date
      );
      // console.log("submitTime", submitTime.toString());
      // console.log("submitTime.toISOString()", submitTime.toISOString());

      const data = JSON.stringify({
        initTime: submitTime.toISOString(),
        roomId: selectRoom,
      });
      console.log("data send api", data);

      const config = {
        method: "post",
        url: `${import.meta.env.VITE_API_BACKEND}/kowing/getBookRoomOnTheDate`,
        headers: {
          "Content-Type": "application/json",
        },
        data: data,
      };

      axios
        .request(config)
        .then((response) => {
          console.log("setDetailBookRoom", response.data);
          setDetailBookRoom(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    };

    selectDateTime.year !== 0 &&
      selectDateTime.month !== 0 &&
      selectDateTime.date !== 0 &&
      selectDateTime.day !== 0 &&
      selectRoom !== 0 &&
      getBookRoom();
  }, [selectDateTime, selectRoom]);

  useEffect(() => {
    const getAvailable = () => {
      const coWorkObj = detailBookRoom.BranchToRoom.coWork;
      const open24hrs =
        coWorkObj.OpenClose24Hours[strDay[selectDateTime.day - 1] + "24hours"];
      const openTime = open24hrs
        ? 0
        : coWorkObj.Open[strDay[selectDateTime.day - 1] + "Open"];
      const closeTime = open24hrs
        ? 23
        : coWorkObj.Close[strDay[selectDateTime.day - 1] + "Close"];
      // console.log("openTime", openTime);
      // console.log("closeTime", closeTime);

      const filterTimeBooking = detailBookRoom.BookRoom.map((item) => {
        const userStartTime = new Date(item.startTime).getHours();
        const duration = item.roomRate.duration.duration;
        // console.log("duration", duration);

        const usedTime = [...Array(duration)].map((r, idx) => {
          return userStartTime + idx;
        });
        // console.log("usedTime", usedTime);
        return usedTime;
      });
      // console.log("filterTimeBooking", filterTimeBooking);

      const usageTime = [...new Set(filterTimeBooking.flat())];
      // console.log("usageTime", usageTime);

      const slotTimeOpen = open24hrs
        ? [...Object.keys([...Array(24)])].map((r) => Number(r))
        : [...Object.keys([...Array(closeTime - openTime)])].map(
            (r, idx) => idx + openTime
          );
      // console.log("slotTimeOpen", slotTimeOpen);

      const availableTime = slotTimeOpen.filter((r) => {
        const findTime = usageTime.map((item) => item === r);
        // console.log(findTime);

        return findTime.every((r) => !r);
      });

      const durations = detailBookRoom.RoomRate.map((r) => ({
        roomRateId: r.id,
        duration: r.duration.duration,
        price: r.price,
      }));

      console.log("setTimeAvailableDB", {
        slotTime: availableTime,
        open: openTime,
        close: closeTime,
        duration: durations,
      });
      setTimeAvailableDB({
        slotTime: availableTime,
        open: openTime,
        close: closeTime,
        duration: durations,
      });
    };

    Object.keys(detailBookRoom).length > 0 && getAvailable();
  }, [detailBookRoom]);

  useEffect(() => {
    const getStartTime = () => {
      const startTime = timeAvailableDB.duration
        ?.sort((a, b) => a.duration - b.duration)
        .map((type) => {
          const inOpenTime = timeAvailableDB.slotTime.filter(
            (slot) => slot + type.duration <= timeAvailableDB.close
          );
          // console.log("inOpenTime", inOpenTime);

          const available = inOpenTime.filter((r) => {
            // console.log("type", type.duration);
            const checkEachHour = [...Array(type.duration)].map((k, idx) =>
              timeAvailableDB.slotTime.includes(r + idx)
            );
            // console.log("checkEachHour", checkEachHour);
            // console.log(
            //   "result",
            //   checkEachHour.every((r) => r)
            // );
            return checkEachHour.every((r) => r);
          });

          return {
            roomRateId: type.roomRateId,
            type: type.duration,
            price: type.price,
            start: available,
          };
        });

      console.log("setAvailableStartTime", startTime);
      setAvailableStartTime(startTime);
      setTabSelect("time");
    };

    Object.keys(timeAvailableDB).length > 0 && getStartTime();
  }, [timeAvailableDB]);

  return { availableStartTime };
};
