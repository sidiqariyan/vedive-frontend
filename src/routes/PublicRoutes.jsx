import React, { Suspense } from "react";
import { Route } from "react-router-dom";
import { LoadingSpinner, PageTransition } from "../components/common/CommonComponents.jsx";
import {
  Hero,
  Login,
  Signup,
  ContactUs,
  AboutUs,
  Pricing,
  Services,
  BlogPostList,
  Plan,
  OAuth2RedirectHandler,
  Passreset,
  ResetPassword,
  VerifyEmail,
  PaymentStatus,
  PostList,
  TemplateEditorPage,
  BlogPostDetail,
  PostDetail,
  CreateBlogPost
} from "../config/lazyComponents.jsx";

const PublicRoutes = () => (
  <>
    {/* PUBLIC ROUTES - Outside of MainLayout */}
    <Route path="/" element={
      <Suspense fallback={<LoadingSpinner />}>
        <PageTransition><Hero /></PageTransition>
      </Suspense>
    } />
    <Route path="/home" element={
      <Suspense fallback={<LoadingSpinner />}>
        <PageTransition><Hero /></PageTransition>
      </Suspense>
    } />
    <Route path="/login" element={
      <Suspense fallback={<LoadingSpinner />}>
        <PageTransition><Login /></PageTransition>
      </Suspense>
    } />
    <Route path="/signup" element={
      <Suspense fallback={<LoadingSpinner />}>
        <PageTransition><Signup /></PageTransition>
      </Suspense>
    } />
    <Route path="/contact" element={
      <Suspense fallback={<LoadingSpinner />}>
        <PageTransition><ContactUs /></PageTransition>
      </Suspense>
    } />
    <Route path="/about" element={
      <Suspense fallback={<LoadingSpinner />}>
        <PageTransition><AboutUs /></PageTransition>
      </Suspense>
    } />
    <Route path="/pricing" element={
      <Suspense fallback={<LoadingSpinner />}>
        <PageTransition><Pricing /></PageTransition>
      </Suspense>
    } />
    <Route path="/services" element={
      <Suspense fallback={<LoadingSpinner />}>
        <PageTransition><Services /></PageTransition>
      </Suspense>
    } />
    <Route path="/blogs" element={
      <Suspense fallback={<LoadingSpinner />}>
        <PageTransition><BlogPostList /></PageTransition>
      </Suspense>
    } />
    <Route path="/plans" element={
      <Suspense fallback={<LoadingSpinner />}>
        <PageTransition><Plan /></PageTransition>
      </Suspense>
    } />
    
    {/* OTHER PUBLIC ROUTES */}
    <Route path="/oauth2/redirect" element={
      <Suspense fallback={<LoadingSpinner />}>
        <PageTransition><OAuth2RedirectHandler /></PageTransition>
      </Suspense>
    } />
    <Route path="/pass-reset" element={
      <Suspense fallback={<LoadingSpinner />}>
        <PageTransition><Passreset /></PageTransition>
      </Suspense>
    } />
    <Route path="/reset-password" element={<PageTransition><ResetPassword /></PageTransition>} />
    <Route path="/verify-email" element={
      <Suspense fallback={<LoadingSpinner />}>
        <PageTransition><VerifyEmail /></PageTransition>
      </Suspense>
    } />
    <Route path="/plans/payment-status" element={
      <Suspense fallback={<LoadingSpinner />}>
        <PageTransition><PaymentStatus /></PageTransition>
      </Suspense>
    } />
    <Route path="/templates" element={
      <Suspense fallback={<LoadingSpinner />}>
        <PageTransition><PostList /></PageTransition>
      </Suspense>
    } />
    <Route path="/editor/:id" element={
      <Suspense fallback={<LoadingSpinner />}>
        <PageTransition><TemplateEditorPage /></PageTransition>
      </Suspense>
    } />
    
    {/* BLOG ROUTES */}
    <Route path="/search" element={
      <Suspense fallback={<LoadingSpinner />}>
        <PageTransition><BlogPostList /></PageTransition>
      </Suspense>
    } />
    <Route path="/category/:category" element={
      <Suspense fallback={<LoadingSpinner />}>
        <PageTransition><BlogPostList /></PageTransition>
      </Suspense>
    } />
    <Route path="/tag/:tag" element={
      <Suspense fallback={<LoadingSpinner />}>
        <PageTransition><BlogPostList /></PageTransition>
      </Suspense>
    } />
    <Route path="/blog/:slug" element={
      <Suspense fallback={<LoadingSpinner />}>
        <PageTransition><BlogPostDetail /></PageTransition>
      </Suspense>
    } />
    <Route path="/blog-posts/:identifier" element={
      <Suspense fallback={<LoadingSpinner />}>
        <PageTransition><PostDetail /></PageTransition>
      </Suspense>
    } />
    <Route path="/blog/create" element={
      <Suspense fallback={<LoadingSpinner />}>
        <PageTransition><CreateBlogPost /></PageTransition>
      </Suspense>
    } />
    
    {/* CATCH-ALL FOR BLOG SLUGS */}
    <Route path="/:slug" element={
      <Suspense fallback={<LoadingSpinner />}>
        <PageTransition><BlogPostDetail /></PageTransition>
      </Suspense>
    } />
  </>
);

export default PublicRoutes;