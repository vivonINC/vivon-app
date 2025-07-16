import { MicrophoneIcon, HeadphonesIcon, GearSixIcon } from '@phosphor-icons/react';
import { IconButton } from './IconButton';

export default function SidebarUserSection() {
  return (
    <div className="p-2 bg-stone-800/50 rounded-md">
      <div className="flex items-center gap-2">
        {/* Avatar and Name */}
        <div className="flex items-center gap-2 flex-1">
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-stone-700">
              {/* Avatar image would go here */}
            </div>
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-stone-900" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-white font-medium">{sessionStorage.getItem("username")}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-1">
          <IconButton
            icon={MicrophoneIcon}
            variant="default"
            size="md"
            className="text-stone-400 hover:text-white hover:bg-stone-700"
          />
          <IconButton
            icon={HeadphonesIcon}
            variant="default"
            size="md"
            className="text-stone-400 hover:text-white hover:bg-stone-700"
          />
          <IconButton
            icon={GearSixIcon}
            variant="default"
            size="md"
            className="text-stone-400 hover:text-white hover:bg-stone-700"
          />
        </div>
      </div>
    </div>
  );
}