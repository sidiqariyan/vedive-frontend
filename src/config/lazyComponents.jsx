import { lazy } from "react";

// Optimize lazy loading with aggressive chunking
const lazyLoad = (importFunc, preload = false) => {
  const LazyComponent = lazy(() => 
    importFunc().catch(() => ({ 
      default: () => <div className="p-4 text-red-500">Failed to load component</div> 
    }))
  );
  
  if (preload) {
    LazyComponent.preload = importFunc;
    if (typeof requestIdleCallback !== 'undefined') {
      requestIdleCallback(() => importFunc());
    } else {
      setTimeout(() => importFunc(), 0);
    }
  }
  
  return LazyComponent;
};

// High priority components (preloaded instantly)
export const Login = lazyLoad(() => import("../components/other-pages/login.jsx"), true);
export const Signup = lazyLoad(() => import("../components/other-pages/sign-up.jsx"), true);
export const Dashboard = lazyLoad(() => import("../components/other-pages/dashboard.jsx"), true);
export const MailDashboard = lazyLoad(() => import("../components/other-pages/Emaildashboard.jsx"), true);

// Medium priority components (smart preloading)
export const ContactUs = lazyLoad(() => import("../components/Pages/contact.jsx"));
export const AboutUs = lazyLoad(() => import("../components/Pages/about.jsx"));
export const Pricing = lazyLoad(() => import("../components/Pages/pricing.jsx"));
export const Services = lazyLoad(() => import("../components/Pages/services.jsx"));
export const BlogPostList = lazyLoad(() => import("../components/other-pages/BlogPostList.jsx"));
export const Plan = lazyLoad(() => import("../components/other-pages/plan.jsx"));

// Low priority components (on-demand loading)
export const Passreset = lazyLoad(() => import("../components/other-pages/pass-reset.jsx"));
export const VerifyEmail = lazyLoad(() => import("../components/other-pages/VerifyEmail.jsx"));
export const PaymentStatus = lazyLoad(() => import("../components/other-pages/PaymentStatus.jsx"));
export const BlogPostDetail = lazyLoad(() => import("../components/other-pages/BlogPostDetail.jsx"));
export const CreateBlogPost = lazyLoad(() => import("../components/other-pages/CreateBlogPost.jsx"));
export const PostDetail = lazyLoad(() => import("../components/other-pages/BlogPostDetail.jsx"));
export const Account = lazyLoad(() => import("../components/other-pages/account.jsx"));
export const GmailAnalytics = lazyLoad(() => import("../components/other-pages/GmailAnalytics.jsx"));
export const LinkTrackingDashboard = lazyLoad(() => import("../components/other-pages/Gmaillink.jsx"));
export const AnalyticsDashboard = lazyLoad(() => import("../components/other-pages/whatsapp-dash.jsx"));
export const SenderBody = lazyLoad(() => import("../components/Pages/Mailer/SenderBody.jsx"));
export const EmailScrapper = lazyLoad(() => import("../components/Pages/Mailer/EmailScrapper.jsx"));
export const GmailSender = lazyLoad(() => import("../components/Pages/Gmail/GmailSender.jsx"));
export const MessageForm = lazyLoad(() => import("../components/Pages/Whatsapp/WhatsAppSender.jsx"));
export const NumberScraper = lazyLoad(() => import("../components/Pages/Whatsapp/NumberScraper.jsx"));
export const SubscriptionHistory = lazyLoad(() => import("../components/other-pages/SubscriptionHistory.jsx"));
export const PostForm = lazyLoad(() => import("../components/other-pages/PostForm.jsx"));
export const CouponManagement = lazyLoad(() => import("../components/other-pages/create-coupon.jsx"));
export const PostList = lazyLoad(() => import("../components/other-pages/PostList.jsx"));
export const TemplateEditorPage = lazyLoad(() => import("../components/other-pages/TemplateEditor.jsx"));

// Synchronously loaded components
export { default as Hero } from "../components/Pages/Hero/Hero.jsx";
export { default as ResetPassword } from "../components/other-pages/ResetPassword.jsx";
export { default as EditBlogPost } from "../components/other-pages/EditorBlogPost.jsx";
export { default as BlogAdmin } from "../components/other-pages/BlogAdmin.jsx";
export { default as OAuth2RedirectHandler } from "../components/other-pages/OAuth2RedirectHandler.jsx";