import {Outlet} from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export default function MainLayout() {
  return (
    <>
      <Header />
      <main className="flex flex-col min-h-screen pt-16">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
