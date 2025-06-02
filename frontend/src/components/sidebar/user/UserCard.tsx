import {
  GearSixIcon,
  HeadphonesIcon,
  MicrophoneIcon,
} from '@phosphor-icons/react';

interface UserProfileProps {
  avatar: string;
  username: string;
  status: string;
}

export default function UserProfile({
  avatar,
  username,
  status,
}: UserProfileProps) {
  return (
    <div className="h-fit w-full bg-stone-900 rounded-md p-2 flex gap-2 justify-between">
      <div className="w-full flex flex-col gap-2">
        <div className="h-16 w-full flex flex-col rounded-md border-stone-700 overflow-hidden border">
          <div className="flex w-full h-fit bg-stone-900 p-2 gap-2">
            <img
              src={avatar}
              alt="User Avatar"
              className="w-11 h-11 rounded-full"
            />
            <div className="flex flex-col gap-1">
              <span className="text-white text-sm font-semibold">
                {username}
              </span>
              <span className="text-xs text-stone-300">{status}</span>
            </div>
          </div>
        </div>
        <div className="h-10 w-full flex flex-col rounded-md border-stone-700 overflow-hidden border">
          <span className="text-white text-xs m-auto">
            Something goes here..
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <button className="flex items-center justify-center size-8 rounded border border-stone-600">
          <MicrophoneIcon size={24} className="text-stone-400" />
        </button>
        <button className="flex items-center justify-center size-8 rounded border border-stone-600">
          <HeadphonesIcon size={24} className="text-stone-400" />
        </button>
        <button className="flex items-center justify-center size-8 bg-stone-700 rounded">
          <GearSixIcon size={24} className="text-stone-400" />
        </button>
      </div>
    </div>
  );
}
