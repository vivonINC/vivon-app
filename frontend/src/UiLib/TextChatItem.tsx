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
              className="w-11 h-11 rounded-full flex-shrink-0"
            />
            <div className="ml-5 flex flex-col flex-1 min-w-0">
                <div>   
                    <span className="text-white mr-3 font-bold">{name}</span>         
                    <span className="text-white text-xs">{date}</span>
                </div>
                <div className="text-white break-words">{text}</div>
            </div>
        </div>
    )
}