import TextChatItem from "./TextChatItem";
import temp1 from "../assets/placeholder.png";
import temp2 from "../assets/placeholder2.jpg";

export default function TextChat() {
  return (
    <div className="m-3 flex flex-col">
        <div className="mb-5">
            <TextChatItem 
            avatar={temp1}
            date="2025-03-02"
            text="Suh dude"
            name = "Monke"
            />
        </div>
        <div className="mb-5">
            <TextChatItem 
            avatar={temp2}
            date="2025-03-03"
            text="Yo!"
            name = "Gengu"
            />
        </div>
    </div>
  );
}
