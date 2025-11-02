// src/pages/Index.tsx
import React from "react";
import Home from "./Home";

export default function Index() {
  // Option 1: render Home directly as your default landing
  return <Home />;

  // Option 2 (redirect):
  // const navigate = useNavigate();
  // useEffect(() => { navigate("/home"); }, []);
  // return null;
}
