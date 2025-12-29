import { Outlet } from "react-router-dom";
import { FloatingMenu } from "./FloatingMenu";

export function DashboardLayout() {
  return (
    <div className="flex h-screen bg-gray-900" style={{backgroundImage:"url('../assets/images/BgPhoto.png')"}}>
      <main className="flex-1">
        <Outlet />

        <FloatingMenu />
      </main>
    </div>
  );
}
