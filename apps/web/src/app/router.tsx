import {
  Navigate,
  Route,
  Routes,
} from "react-router";

import { AppShell } from "../components/layout/AppShell";
import { DashboardPage } from "../pages/DashboardPage";
import { GraphPage } from "../pages/GraphPage";
import { IncidentsPage } from "../pages/IncidentsPage";
import { ServicesPage } from "../pages/ServicesPage";
import { ServiceDetailPage } from "../pages/ServiceDetailPage";
import { IncidentDetailPage } from "../pages/Incidentdetailpage";

export function AppRouter() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route
          path="/"
          element={
            <Navigate
              to="/dashboard"
              replace
            />
          }
        />

        <Route
          path="/dashboard"
          element={<DashboardPage />}
        />

        <Route
          path="/services"
          element={<ServicesPage />}
        />

        <Route
          path="/graph"
          element={<GraphPage />}
        />

        <Route
          path="/incidents"
          element={<IncidentsPage />}
        />
      </Route>

      <Route
  path="/services/:id"
  element={<ServiceDetailPage />}
/>

      <Route
        path="/incidents/:id"
        element={<IncidentDetailPage />}
      />

      <Route
        path="*"
        element={
          <Navigate
            to="/dashboard"
            replace
          />
        }
      />
    </Routes>
    
  );
}