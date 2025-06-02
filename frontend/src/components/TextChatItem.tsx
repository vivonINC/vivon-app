interface TextItem{
    avatar: string,
    date: string,
    text: string,
    name: String
}

export default function TextChatItem({avatar, date, text, name}: TextItem){
    return(
    <div className="flex">
        <img
          src={avatar}
          alt={`User avatar`}
          className="w-11 h-11 rounded-full"
        />
        <div className=" ml-5 flex flex-col">
            <div>   
                <span className="text-white mr-3 font-bold">{name}</span>         
                <span className="text-white text-xs">{date}</span>
            </div>
            <div className="text-white">{text}</div>
        </div>
    </div>
    )
}