import {
  Navigate,
  Route,
  Routes,
} from "react-router";

import {
  AppShell,
} from "../components/layout/AppShell";

import {
  DashboardPage,
} from "../pages/DashboardPage";

import {
  GraphPage,
} from "../pages/GraphPage";

import {
  IncidentDetailPage,
} from "../pages/IncidentDetailPage";

import {
  IncidentsPage,
} from "../pages/IncidentsPage";

import {
  NotFoundPage,
} from "../pages/not-found-page";

import {
  ServiceDetailPage,
} from "../pages/ServiceDetailPage";

import {
  ServicesPage,
} from "../pages/ServicesPage";

export function AppRouter() {
  return (
    <Routes>
      <Route
        element={<AppShell />}
      >
        {/* Default route */}

        <Route
          path="/"
          element={
            <Navigate
              to="/dashboard"
              replace
            />
          }
        />

        {/* Dashboard */}

        <Route
          path="/dashboard"
          element={
            <DashboardPage />
          }
        />

        {/* Dependency Graph */}

        <Route
          path="/graph"
          element={
            <GraphPage />
          }
        />

        {/* Services */}

        <Route
          path="/services"
          element={
            <ServicesPage />
          }
        />

        <Route
          path="/services/:id"
          element={
            <ServiceDetailPage />
          }
        />

        {/* Incidents */}

        <Route
          path="/incidents"
          element={
            <IncidentsPage />
          }
        />

        <Route
          path="/incidents/:id"
          element={
            <IncidentDetailPage />
          }
        />

        {/* 404 */}

        <Route
          path="*"
          element={
            <NotFoundPage />
          }
        />
      </Route>
    </Routes>
  );
}