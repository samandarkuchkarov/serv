import { createBrowserRouter, Navigate } from 'react-router-dom';
import AdminLayout from '../components/layout/AdminLayout';
import LoginPage from '../pages/login/LoginPage';
import DashboardPage from '../pages/dashboard/DashboardPage';
import BannersPage from '../pages/banners/BannersPage';
import BannerFormPage from '../pages/banners/BannerFormPage';
import AdvantagesPage from '../pages/advantages/AdvantagesPage';
import AdvantageFormPage from '../pages/advantages/AdvantageFormPage';
import EquipmentsPage from '../pages/equipment/EquipmentsPage';
import EquipmentFormPage from '../pages/equipment/EquipmentFormPage';
import VacanciesPage from '../pages/vacancy/VacanciesPage';
import VacancyFormPage from '../pages/vacancy/VacancyFormPage';
import ServicesPage from '../pages/service/ServicesPage';
import ServiceFormPage from '../pages/service/ServiceFormPage';
import ConstructorPage from '../pages/constructor/ConstructorPage';
import SectionPage from '../pages/constructor/SectionPage';
import ItemFormPage from '../pages/constructor/ItemFormPage';
import PartnersPage from '../pages/partner/PartnersPage';
import PartnerFormPage from '../pages/partner/PartnerFormPage';
import { useAuthStore } from '../store/authStore';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'banners', element: <BannersPage /> },
      { path: 'banners/create', element: <BannerFormPage /> },
      { path: 'banners/:id/edit', element: <BannerFormPage /> },
      { path: 'advantages', element: <AdvantagesPage /> },
      { path: 'advantages/create', element: <AdvantageFormPage /> },
      { path: 'advantages/:id/edit', element: <AdvantageFormPage /> },
      { path: 'equipments', element: <EquipmentsPage /> },
      { path: 'equipments/create', element: <EquipmentFormPage /> },
      { path: 'equipments/:id/edit', element: <EquipmentFormPage /> },
      { path: 'vacancies', element: <VacanciesPage /> },
      { path: 'vacancies/create', element: <VacancyFormPage /> },
      { path: 'vacancies/:id/edit', element: <VacancyFormPage /> },
      { path: 'services', element: <ServicesPage /> },
      { path: 'services/create', element: <ServiceFormPage /> },
      { path: 'services/:id/edit', element: <ServiceFormPage /> },
      { path: 'constructor', element: <ConstructorPage /> },
      { path: 'constructor/sections/:sectionId', element: <SectionPage /> },
      { path: 'constructor/sections/:sectionId/items/create', element: <ItemFormPage /> },
      { path: 'constructor/items/:id/edit', element: <ItemFormPage /> },
      { path: 'partners', element: <PartnersPage /> },
      { path: 'partners/create', element: <PartnerFormPage /> },
      { path: 'partners/:id/edit', element: <PartnerFormPage /> },
    ],
  },
]);
