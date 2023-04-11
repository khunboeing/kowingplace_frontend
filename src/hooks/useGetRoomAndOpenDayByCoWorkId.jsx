import { useState, useEffect } from "react";
import axios from "axios";

export const useGetRoomAndOpenDayByCoWorkId = ({ coWorkId }) => {
  const [dataCoWork, setDataCoWork] = useState({});

  useEffect(() => {
    const data = JSON.stringify({
      coWorkId: Number(coWorkId),
    });
    console.log("data", data);
    const config = {
      method: "post",
      url: `${import.meta.env.VITE_API_BACKEND}/kowing/getCoWorkByCoWorkId`,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        // console.log("setDataCoWork", response.data);
        setDataCoWork(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return { dataCoWork };
};
