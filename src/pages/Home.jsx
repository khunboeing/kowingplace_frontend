import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CardLink, Carousel } from "../components";
import { FaRegThumbsUp, FaRegClock } from "react-icons/fa";
import axios from "axios";

export const Home = () => {
  const [dataCoWorks, setDataCoWorks] = useState([]);
  const [_tempDataCoWorks, set_TempDataCoWorks] = useState([]);
  const navigate = useNavigate();

  const topics = [
    {
      id: 1,
      name: "รวม 7 ข้อดีของการทำงานที่ Co-Working Space",
      image:
        "https://www.mangozero.com/wp-content/uploads/2017/11/7-benefits-of-co-working-space-featured.jpg",
      link: "https://www.mangozero.com/7-benefits-of-co-working-space/",
    },
    {
      id: 2,
      name: "5 เหตุผล ทำไมผู้ประกอบการยุคใหม่ เลือกใช้ Co-working Space เป็นออฟฟิศ?",
      image:
        "https://eventbanana.blob.core.windows.net/blogcontainer/2e1f3c7-f1d7.jpg",
      link: "https://www.eventbanana.com/th/blogs/blog-5-reasons-to-choose-co-working-space",
    },
    {
      id: 3,
      name: "ทำไม Co-Working Space คือคำตอบของพื้นที่คนทำงาน ในโลกยุคใหม่",
      image:
        "https://images.condonewb.com/media/1649128972974_750x500_040422-condonewb-Co-Working-Space.webp",
      link: "https://www.condonewb.com/lifestyle/19/Co-Working-Space-%E0%B8%84%E0%B8%B7%E0%B8%AD",
    },
    {
      id: 4,
      name: "ความลับของการทำงานใน Coworking Space ที่ไม่มีใครเคยบอกคุณ",
      image:
        "https://uploads-ssl.webflow.com/5c3aef15e76e088efcf1e0ea/5d53d8826e49610f34057f47_5d53c9a02086e79dd5306566_G5814QNyc8X9x05nLATnkuINqbGksSysM27Q-sfxixE52xjFv1byCbEfuUyPKWZpwvjdvSK2_iEBIi5GVgDaTpCVOSokt19HYwW26HHy1snPZjvUR9IZfxVCodzRJ9TPD1nneReu.jpeg",
      link: "https://www.hubbathailand.com/hubba-blog/working-at-coworkingspace",
    },
  ];

  useEffect(() => {
    const data = "";

    const config = {
      method: "post",
      url: `${import.meta.env.VITE_API_BACKEND}/kowing/getCoworks`,
      headers: {},
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        // console.log(JSON.stringify(response.data));
        const result = response.data.sort((a, b) => Math.random() - 0.5);
        setDataCoWorks(result);
        const _newFeat = [...Array(6)].reduce((acc, r) => {
          const index = Math.floor(Math.random() * result.length);
          return [...acc, result[index]];
        }, []);
        set_TempDataCoWorks(_newFeat);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <div className="w-full h-full flex justify-center text-font-primary font-prompt text-sm md:mx-auto p-4 pt-20">
      <div className="w-full lg:w-3/4 flex flex-col gap-y-8">
        <div className="recommendBlock flex flex-col gap-y-2 md:gap-y-4">
          <div className="w-full md:w-fit flex items-center bg-orange-300 rounded-lg p-2 px-4">
            <h1 className="font-medium mr-2">Co-Working แนะนำ</h1>
            <FaRegThumbsUp />
          </div>
          {/* {dataCoWorks.length > 0 && ( */}
          <Carousel
            slides={dataCoWorks?.map((r) => ({
              id: r.id,
              name: r.name,
              image: r.picture,
            }))}
          />
          {/* )} */}
          <div className="w-full">
            <div className="flex flex-no-wrap gap-x-2 md:gap-x-5 overflow-x-scroll scrolling-touch items-center pb-4">
              {dataCoWorks?.map((data, idx) => (
                <CardLink key={`data_${idx}`} data={data} />
              ))}
            </div>
          </div>
        </div>

        <div className="allDayAllNightBlock flex flex-col gap-y-2 md:gap-y-4">
          <div className="w-full md:w-fit flex items-center gap-x-2 bg-orange-300 rounded-lg p-2 px-4">
            <h1 className="font-medium">เปิด 24 ชั่วโมง</h1>
            <FaRegClock />
            <p>(ยังไม่เปิดใช้งาน)</p>
          </div>
          <div className="w-full">
            <div className="flex flex-no-wrap gap-x-2 md:gap-x-5 overflow-x-scroll scrolling-touch items-center pb-4">
              {_tempDataCoWorks?.map((data, idx) => (
                <CardLink key={`data_${idx}`} data={data} />
              ))}
            </div>
          </div>
        </div>

        <Carousel
          slides={topics?.map((r) => ({
            id: r.id,
            name: r.name,
            image: r.image,
            link: r.link,
          }))}
        />
      </div>
    </div>
  );
};
