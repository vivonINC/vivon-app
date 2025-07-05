import { useNavigate } from "react-router-dom";
import Sidebar from "./SidebarView";
import TextChat from "./TextChat";

export default function Home() {
  const nav = useNavigate();
  function handleClick(){
    nav("/testPage")
  }
  return (
    <div className="p-8 flex">
      <Sidebar/>
      <TextChat/>
    </div>
  );
}
