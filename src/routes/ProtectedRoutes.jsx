import React, { Suspense } from "react";
import { Route } from "react-router-dom";
import { LoadingSpinner } from "../components/common/CommonComponents.jsx";
import ProtectedLayout from "../components/layouts/ProtectedLayout.jsx";
import {
  Dashboard,
  Account,
  Plan,
  GmailSender,
  GmailAnalytics,
  LinkTrackingDashboard,
  EmailScrapper,
  MailDashboard,
  AnalyticsDashboard,
  SenderBody,
  MessageForm,
  NumberScraper
} from "../config/lazyComponents.jsx";

const ProtectedRoutes = () => (
  <>
    {/* PROTECTED DASHBOARD ROUTES - MainLayout stays mounted, only Outlet changes */}
    <Route path="/dashboard" element={<ProtectedLayout />}>
      <Route index element={
        <Suspense fallback={<LoadingSpinner />}>
          <Dashboard />
        </Suspense>
      } />
    </Route>
    <Route path="/account" element={<ProtectedLayout />}>
      <Route index element={
        <Suspense fallback={<LoadingSpinner />}>
          <Account />
        </Suspense>
      } />
    </Route>
    <Route path="/plan" element={<ProtectedLayout />}>
      <Route index element={
        <Suspense fallback={<LoadingSpinner />}>
          <Plan />
        </Suspense>
      } />
    </Route>
    <Route path="/gmail-sender" element={<ProtectedLayout />}>
      <Route index element={
        <Suspense fallback={<LoadingSpinner />}>
          <GmailSender />
        </Suspense>
      } />      
    </Route>
    <Route path="/gmail-analytics" element={<ProtectedLayout />}>
      <Route index element={
        <Suspense fallback={<LoadingSpinner />}>
          <GmailAnalytics />
        </Suspense>
      } />
    </Route>
    <Route path="/gmail-link" element={<ProtectedLayout />}>
      <Route index element={
        <Suspense fallback={<LoadingSpinner />}>
          <LinkTrackingDashboard />
        </Suspense>
      } />
    </Route>
    <Route path="/email-scraper" element={<ProtectedLayout />}>
      <Route index element={
        <Suspense fallback={<LoadingSpinner />}>
          <EmailScrapper />
        </Suspense>
      } />
    </Route>
    <Route path="/mail-dash" element={<ProtectedLayout />}>
      <Route index element={
        <Suspense fallback={<LoadingSpinner />}>
          <MailDashboard />
        </Suspense>
      } />
    </Route>
    <Route path="/whatsapp-dash" element={<ProtectedLayout />}>
      <Route index element={
        <Suspense fallback={<LoadingSpinner />}>
          <AnalyticsDashboard />
        </Suspense>
      } />
    </Route>
    <Route path="/email-sender" element={<ProtectedLayout />}>
      <Route index element={
        <Suspense fallback={<LoadingSpinner />}>
          <SenderBody />
        </Suspense>
      } />
    </Route>
    <Route path="/whatsapp-sender" element={<ProtectedLayout />}>
      <Route index element={
        <Suspense fallback={<LoadingSpinner />}>
          <MessageForm />
        </Suspense>
      } />
    </Route>
    <Route path="/number-scraper" element={<ProtectedLayout />}>
      <Route index element={
        <Suspense fallback={<LoadingSpinner />}>
          <NumberScraper />
        </Suspense>
      } />
    </Route>
  </>
);

export default ProtectedRoutes;