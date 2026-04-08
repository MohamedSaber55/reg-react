import {Outlet} from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-neutral-50 transition-colors duration-300">
      <Outlet />
    </div>
  );
}
