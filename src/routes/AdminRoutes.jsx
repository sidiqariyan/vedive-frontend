import React, { Suspense } from "react";
import { Route } from "react-router-dom";
import { LoadingSpinner, PageTransition } from "../components/common/CommonComponents.jsx";
import AdminRoute from "../components/other-pages/AdminRoute.jsx";
import {
  CreateBlogPost,
  BlogAdmin,
  EditBlogPost,
  CouponManagement,
  PostForm
} from "../config/lazyComponents.jsx";

const AdminRoutes = () => (
  <>
    {/* ADMIN ROUTES */}
    <Route path="/create-blog" element={
      <AdminRoute>
        <Suspense fallback={<LoadingSpinner />}>
          <PageTransition><CreateBlogPost /></PageTransition>
        </Suspense>
      </AdminRoute>
    } />
    <Route path="/admin/blog" element={
      <AdminRoute>
        <PageTransition><BlogAdmin /></PageTransition>
      </AdminRoute>
    } />
    <Route path="/admin/blog/create" element={
      <AdminRoute>
        <Suspense fallback={<LoadingSpinner />}>
          <PageTransition><CreateBlogPost /></PageTransition>
        </Suspense>
      </AdminRoute>
    } />
    <Route path="/admin/blog/edit/:id" element={
      <AdminRoute>
        <PageTransition><EditBlogPost /></PageTransition>
      </AdminRoute>
    } />
    <Route path="/create-coupun" element={
      <AdminRoute>
        <PageTransition><CouponManagement /></PageTransition>
      </AdminRoute>
    } />
    <Route path="/post-form" element={
      <AdminRoute>
        <Suspense fallback={<LoadingSpinner />}>
          <PageTransition><PostForm /></PageTransition>
        </Suspense>
      </AdminRoute>
    } />
  </>
);

export default AdminRoutes;