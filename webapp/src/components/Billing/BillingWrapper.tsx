import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Auth/AuthProvider";
import { AdminBilling } from "./components/AdminBilling/AdminBilling";
import { MemberBilling } from "./components/MemberBilling/MemberBilling";

export const BillingWrapper = () => {
  const {userType} = useContext(AuthContext);
  const [renderType, setRenderType] = useState<string | null>(null);

  useEffect(() => {
    setRenderType(userType);
  }, [userType])
  
  switch (renderType) {
    case ("member"): {
      return <MemberBilling />
    }
    case ("admin"): {
      return <AdminBilling />
    }
    default: {
      return <></>
    }
  }
}