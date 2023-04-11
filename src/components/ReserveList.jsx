import axios from "axios";

export const ReserveList = ({ getData, dataCoWork }) => {
  const updateStatus = (bookRoomId, nowStatus) => {
    const newStatus =
      nowStatus === "PENDING"
        ? "ON_GOING"
        : nowStatus === "ON_GOING"
        ? "DONE"
        : "";

    const data = JSON.stringify({
      bookRoomId: bookRoomId,
      newStatus: newStatus,
    });

    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${import.meta.env.VITE_API_BACKEND}/kowing/updateStatus`,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        getData();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const borderColor = (status) => {
    return status === "PENDING"
      ? "border-l-orange-400/50"
      : status === "ON_GOING"
      ? "border-l-green-400"
      : "border-l-slate-400";
  };

  return (
    <div className="listQuery w-full flex md:block flex-col justify-center pl-12 md:pl-0">
      {dataCoWork?.coWork?.BranchToRoom[0].room?.BookRoom?.map(
        (bookRoom, idx) => (
          <div
            key={`room_${idx + 1}`}
            className={`w-full flex flex-wrap justify-center sm:w-1/2 md:w-full md:grid md:grid-cols-7 gap-2 bg-orange-100/20 items-center border-2 border-l-4 ${borderColor(
              bookRoom.status
            )} rounded-lg shadow-md p-2 md:p-4 mb-4`}
          >
            <div className="text-center w-full md:text-left mb-2 md:mb-0">
              <p className="font-medium">
                {dataCoWork.coWork.BranchToRoom[0].room.name}
              </p>
            </div>

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

            <div className="text-center">
              <p>{bookRoom.roomRate.duration.duration} hr(s).</p>
            </div>

            <div className="text-center">
              <p>฿{bookRoom.price}</p>
            </div>

            <div className="text-left" title={bookRoom.vertifyCode.verifyCode}>
              <p className="text-center text-ellipsis overflow-hidden">
                {bookRoom.vertifyCode.verifyCode}
              </p>
            </div>
            <button
              onClick={() => updateStatus(bookRoom.id, bookRoom.status)}
              className="w-full text-center rounded-md bg-orange-200/50 shadow-md hover:bg-orange-200/70 duration-300 p-2 px-4"
              disabled={bookRoom.status === "DONE"}
            >
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
            </button>
          </div>
        )
      )}
    </div>
  );
};
