import SidebarUserSection from '../UiLib/SidebarUserSection';
import SidebarItems from '../UiLib/SidebarItems';

function Sidebar() {
  return (
    <div className="flex flex-col w-96 not-first:bg-stone-900">
      <SidebarItems />
      <div className="mt-auto">
        <SidebarUserSection />
      </div>
    </div>
  );
}

export default Sidebar;