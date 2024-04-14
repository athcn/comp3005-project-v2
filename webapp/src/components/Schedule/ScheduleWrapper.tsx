import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Auth/AuthProvider";
import { TrainerSchedule } from "./components/TrainerSchedule/TrainerSchedule";
import { MemberSchedule } from "./components/MemberSchedule/MemberSchedule";
import { AdminSchedule } from "./components/AdminSchedule/AdminSchedule";

export const ScheduleWrapper = () => {
  const {userType} = useContext(AuthContext);
  const [renderType, setRenderType] = useState<string | null>(null);

  useEffect(() => {
    setRenderType(userType);
  }, [userType])
  
  switch (renderType) {
    case ("member"): {
      return  <MemberSchedule />
    }
    case ("trainer"): {
      return <TrainerSchedule />
    }
    case ("admin"): {
      return <AdminSchedule />
    }
    default: {
      return <></>
    }
  }
}