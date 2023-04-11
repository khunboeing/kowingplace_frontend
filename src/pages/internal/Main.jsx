import { useEffect, useContext, useState } from "react";
import { ContextUserId } from "../../App";
import axios from "axios";
import { PartnerMainNav, ReserveList } from "../../components";
import { useNavigate } from "react-router-dom";

export const Main = () => {
  const { userId, token, setToken } = useContext(ContextUserId);
  const [dataCoWork, setDataCoWork] = useState({});
  const navigate = useNavigate();

  console.log("userId", userId);

  useEffect(() => {
    try {
      Object.keys(userId).length > 0 && userId.role === "partner" && getData();
    } catch (error) {
      navigate("/partner/welcome");
    }
  }, [userId]);

  const getData = () => {
    const data = JSON.stringify({
      userId: userId.userId,
    });
    console.log("data", data);
    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${import.meta.env.VITE_API_BACKEND}/kowing/getBookRoomByPartnerId`,
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        console.log("setDataCoWork", response.data);
        setDataCoWork(response.data);
      })
      .catch((error) => {
        console.log(error);
        // //ลบ token ที่หมดอายุแล้วใน localstorage
        if (error.response.data.isDeleteToken) {
          localStorage.removeItem("token");
          setToken({});
          //go back to login page
          navigate("/Login");
        }
      });
  };

  return (
    <div className="w-full h-full flex justify-center text-font-primary font-prompt text-sm md:mx-auto my-20 p-4">
      <div className="w-full lg:w-10/12 flex flex-col gap-y-8">
        <div className="header">
          <h1 className="h-8 text-2xl text-center">
            {dataCoWork?.coWork?.name}
          </h1>
        </div>
        <PartnerMainNav />
        <ReserveList getData={getData} dataCoWork={dataCoWork} />
      </div>
    </div>
  );
};
