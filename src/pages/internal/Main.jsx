import { useEffect, useContext, useState } from "react";
import { ContextUserId } from "../../App";
import axios from "axios";
import {} from "react-icons/fa";
import { PartnerMainNav } from "../../components";

export const Main = () => {
  const { userId } = useContext(ContextUserId);
  const [dataCoWork, setDataCoWork] = useState({});
  console.log("userId", userId);

  useEffect(() => {
    const getData = () => {
      const data = JSON.stringify({
        userId: userId.userId,
        status: "",
      });
      console.log("data", data);
      const config = {
        method: "post",
        maxBodyLength: Infinity,
        url: `${
          import.meta.env.VITE_API_BACKEND
        }/kowing/getBookRoomByPartnerId`,
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

    Object.keys(userId).length > 0 && getData();
  }, [userId]);

  return (
    <div className="w-full h-full flex justify-center text-font-primary font-prompt text-sm md:mx-auto p-4 pt-20 md:py-20">
      <div className="w-full md:w-3/4 flex flex-col gap-y-8">
        <div className="header">
          <h1 className="text-2xl text-center">{dataCoWork?.coWork?.name}</h1>
        </div>
        <PartnerMainNav />
        <div className="listQuery">
          {dataCoWork?.coWork?.bookRoom?.map((bookRoom, idx) => (
            <div
              key={`room_${idx + 1}`}
              className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-2 bg-orange-100/20 transition ease-in-out delay-50 hover:scale-105 duration-200 items-center border-2 border-l-4 border-l-green-400 rounded-lg shadow-md p-2 md:p-4 mb-4"
            >
              <div className="">
                <p>{bookRoom.roomRate.room.name}</p>
              </div>
              <div className="">
                <p>{bookRoom.UserExternal.name}</p>
              </div>
              <div className="">
                <p>{new Date(bookRoom.startTime).toDateString()}</p>
              </div>
              <div className="">
                <p>
                  {new Date(bookRoom.startTime)
                    .toLocaleTimeString("TH-th")
                    .substring(0, 5)}
                </p>
              </div>
              <div className="">
                <p>{bookRoom.roomRate.duration.duration} hr(s).</p>
              </div>
              <div className="">
                <p>{bookRoom.status}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
