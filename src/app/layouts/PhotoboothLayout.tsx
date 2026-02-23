import { Outlet } from 'react-router-dom';

// WHY: Dedicated kiosk layout — strips Header/Footer for full-screen photobooth display
export default function PhotoboothLayout() {
  return (
    <div className="h-screen w-screen overflow-hidden bg-white text-gray-900">
      <Outlet />
    </div>
  );
}
