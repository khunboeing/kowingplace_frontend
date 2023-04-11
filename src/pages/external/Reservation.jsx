import { useState, useEffect, useContext } from "react";
import { ContextUserId } from "../../App";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export const Reservation = () => {
  const { userId } = useContext(ContextUserId);
  const [dataReserves, setDataReserves] = useState([]);
  const navigate = useNavigate();

  console.log("userId", userId);

  useEffect(() => {
    try {
      Object.keys(userId).length > 0 && userId.role === "user" && getData();
    } catch (error) {
      navigate("/user/login");
    }
  }, [userId]);

  const getData = () => {
    const data = JSON.stringify({
      userId: userId.userId,
    });
    console.log("data", data);
    const config = {
      method: "post",
      url: `${
        import.meta.env.VITE_API_BACKEND
      }/kowing/getBookRoomByUserExternal`,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        setDataReserves(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="w-full h-full flex justify-center text-font-primary font-prompt text-sm md:mx-auto p-4 pt-20 md:py-20">
      <div className="w-full lg:w-10/12 flex flex-col gap-y-8">
        <div className="header">
          <h1 className="text-2xl">Hi, {userId?.name}</h1>
        </div>
        <div>
          <p>Your Co-Working Space Reservation</p>
        </div>

        <div className="listQuery">
          {dataReserves?.map((bookRoom, idx) => (
            <div
              key={`room_${idx + 1}`}
              className="w-full grid grid-cols-1 md:grid-cols-8 gap-2 bg-orange-100/20 items-center border-2 border-l-4 border-l-green-400 rounded-lg shadow-md p-2 md:p-4 mb-4"
            >
              <Link
                to={`/branch/${bookRoom.room.BranchToRoom.coWork.id}`}
                className="text-center md:text-left"
              >
                <p>{bookRoom.room.BranchToRoom.coWork.name}</p>
              </Link>
              <Link
                to={`/branch/${bookRoom.room.id}`}
                className="text-center md:text-left"
              >
                <p>{bookRoom.room.name}</p>
              </Link>
              <div className="text-center">
                <p>{new Date(bookRoom.startTime).toDateString()}</p>
              </div>
              <div className="text-center">
                <p>
                  {new Date(bookRoom.startTime)
                    .toLocaleTimeString("TH-th")
                    .substring(0, 5) +
                    " - " +
                    new Date(
                      new Date(bookRoom.startTime).getTime() +
                        bookRoom.roomRate.duration.duration * 60 * 60 * 1000
                    )
                      .toLocaleTimeString("TH-th")
                      .substring(0, 5)}
                </p>
              </div>
              <div className="text-center md:text-left">
                <p>{bookRoom.roomRate.duration.duration} hr(s).</p>
              </div>
              <div className="text-center md:text-left">
                <p
                  className="text-ellipsis overflow-hidden"
                  title={bookRoom.vertifyCode.verifyCode}
                >
                  {bookRoom.vertifyCode.verifyCode}
                </p>
              </div>
              <div className="text-center">
                <p>฿{bookRoom.roomRate.price}</p>
              </div>
              <div className="text-center rounded-md bg-orange-200/50 p-2">
                <p
                  className={`${
                    bookRoom.status === "PENDING"
                      ? "text-orange-300"
                      : bookRoom.status === "ON_GOING"
                      ? "text-green-500"
                      : "text-slate-500"
                  } font-medium`}
                >
                  {bookRoom.status}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
