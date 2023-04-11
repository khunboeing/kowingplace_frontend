import React from "react";
import { Link } from "react-router-dom";
import { FaMapMarker, FaClock } from "react-icons/fa";

export const CardLink = ({ data }) => {
  return (
    <Link
      to={`/branch/${data?.id}`}
      className="cardList flex-none w-[110px] md:w-[200px] h-[200px] md:h-[350px] bg-orange-100/50 rounded-md transition ease-in-out duration-300 hover:scale-105"
    >
      <img
        src={data?.picture}
        alt={data?.name}
        className="object-cover object-center w-full h-[100px] md:min-h-[200px] rounded-t-md"
      />
      <div className="cardDetail flex flex-col h-[100px] md:h-[150px] text-xs md:text-base font-light gap-y-2 p-2">
        <p className="h-1/3 text-center font-medium mb-2">{data?.name}</p>
        <div className="h-2/3 flex items-end">
          <p className="text-ellipsis overflow-hidden">
            {data?.location.substring(0, 30)}
          </p>
        </div>
      </div>
    </Link>
  );
};
