"use client";

import { useEffect, useRef, useState } from "react";
import { TimerDialog } from "../modalStepActivity/ModalTimerGlobalConfig";
import { useNextActivityCountdown }
from "../../hooks/useNextActivityCountdown";
import {
  useNextProgressActivity
} from "@/features/session-creation/hooks/SessionCreationHook";

interface Props{
   sessionId:number;
   nextActivity?:any;
   warningThreshold:number;
}
export default function NextActivityManager({
   sessionId,
   nextActivity,
   warningThreshold
}:Props){
   const {
      timeLeft,
      secondsLeft,
      initialized
   } =
   useNextActivityCountdown(
      nextActivity?.time
   );

   const {
      mutate:nextProgress
   } =
   useNextProgressActivity();
   const expiredRef = useRef(false);
   const [
      isDialogOpen,
      setIsDialogOpen
   ]
   =
   useState(false);

   const [
      hasShownDialog,
      setHasShownDialog
   ]
   =
   useState(false);
   useEffect(()=>{
      if(
         initialized &&
         secondsLeft<=warningThreshold &&
         secondsLeft>0 &&
         !hasShownDialog
      ){
         setIsDialogOpen(true);
         setHasShownDialog(true);
      }

      if(
         secondsLeft>
         warningThreshold
      ){
         setHasShownDialog(false);
      }
   },[
      secondsLeft,
      initialized,
      hasShownDialog,
      warningThreshold
   ]);

   useEffect(()=>{
      if( !initialized || !nextActivity ) return;
      const expired =
         timeLeft==="00:00"
         ||
         timeLeft==="00:00:00";

      if(!expired){
         expiredRef.current=false;
         return;
      }

      if( expiredRef.current ) return;
      expiredRef.current=true;
      nextProgress(
         sessionId,
         {
            onSuccess(){
               setHasShownDialog(false);
            },
            onError(){
               expiredRef.current=false;
            }
         }
      );
      setIsDialogOpen(false);

   },[ initialized, timeLeft, sessionId, nextActivity, nextProgress]);

   return (
      <TimerDialog
         isOpen={isDialogOpen}
         onOpenChange={
            setIsDialogOpen
         }
         duration={secondsLeft}
         activityName={
            nextActivity?.activityType
            ||
            "Next Activity"
         }
         onConfirm={()=>
            setIsDialogOpen(false)
         }
      />
   );
}