"use client";

import { useNextActivityCountdown } from "../../hooks/useNextActivityCountdown";

interface Props{
   activityTime?: string;
}

export default function NextActivityCountdown({
   activityTime
}:Props){

   const {
      timeLeft
   } =
   useNextActivityCountdown(
      activityTime
   );

   return (

      <span
         style={{
            color:
               timeLeft==="00:00"
               ? "#D32F2F"
               : "#0076D2",

            fontSize:"16px",

            fontWeight:600
         }}
      >

         Time Remaining:

         {timeLeft || "00:00"}

      </span>

   );

}