/** @format */

import { createContext, Dispatch, SetStateAction, useState } from "react";
import { USER_ROLE } from "../server/src/types";

interface User {
  _id: string;
  name: string;
  email: string;
  username: string;
  role: USER_ROLE;
}

interface UserDefinition {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
}

export const authContext = createContext<UserDefinition | null>(null);

export const AuthProvider = (props: any) => {
  const [user, setUser] = useState<User | null>(null);
  return (
    <authContext.Provider value={{ user, setUser }}>
      {props.children}
    </authContext.Provider>
  );
};
