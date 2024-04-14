import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Auth/AuthProvider";
import { MemberHome } from "./components/MemberHome/MemberHome";
import { DefaultHome } from "./components/DefaultHome";
import { TrainerHome } from "./components/TrainerHome/TrainerHome";
import { AdminHome } from "./components/AdminHome/AdminHome";

export const HomeWrapper = () => {
  const {userType} = useContext(AuthContext);
  const [renderType, setRenderType] = useState<string | null>(null);

  useEffect(() => {
    setRenderType(userType);
  }, [userType])
  
  switch (renderType) {
    case ("member"): {
      return  <MemberHome />
    }
    case ("trainer"): {
      return <TrainerHome />
    }
    case ("admin"): {
      return <AdminHome />
    }
    default: {
      return <DefaultHome />
    }
  }
}