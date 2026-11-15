import AddProductNew from "../../pages/products/productNew/AddProductNew";
import BrandProducts from "../../pages/products/BrandProducts";
import ViewProduct from "../../pages/products/ViewProduct";
import EditPostNew from "../../pages/post/postNew/EditPostNew";
import AddPostNew from "../../pages/post/postNew/AddPostNew";
import InfluencerPosts from "../../pages/post/InfluencerPosts";
import ViewPost from "../../pages/post/ViewPost";
import EditProductNew from "../../pages/products/productNew/EditProductNew";
import Profile from "../../pages/profile";
import SegmentCreate from "../../pages/segments/SegmentCreate";
import SegmentIndex from "../../pages/segments/SegmentIndex";
import ReviewDocumentPage from "../../pages/segments/ReviewDocumentPage";
import CampaignIndex from "../../pages/campaigns/CampaignIndex";
import CampaignEdit from "../../pages/campaigns/CampaignEdit";
import DocumentSentPage from "../../pages/segments/DocumentSentPage";
import CampaignView from "../../pages/campaigns/CampaignView";
import ReviewContract from "../../pages/campaign-contract/ReviewContract";
import ChatContainer from "../../pages/chat";
import FilteredInfluencer from "../../pages/filtered-influencers/FilteredInfluencer";
import CreateProposal from "../../pages/proposals/CreateProposal";
import EditProposal from "../../pages/proposals/EditProposal";
import Page404 from "../../components/ErrorBoundary/Page404";
import PublishCampaign from "@src/pages/campaigns/PublishCampaign";
import Subscriptions from "@src/pages/Subscriptions/Subscriptions";
import Success from "@src/pages/Subscriptions/Success/Success";
import BrandProfileIndex from "@src/pages/brand-profile/BrandProfileIndex";
import NotificationsPage from "@src/pages/notification";
import PrivateRoute from "./PrivateRoute";
import InfluencerProfileIndex from "../../pages/filtered-influencers/influencerProfile/InflluencerProfileIndex";
import WeeklyReport from "@src/pages/reports/WeeklyReport";
import Analytics from "@src/pages/analytics/Analytics";
import BlogsList from "@src/pages/blogs";
import CreateBlog from "@src/pages/blogs/CreateBlog";
import ViewBlog from "@src/pages/blogs/ViewBlog";
import EditBlog from "@src/pages/blogs/EditBlog";

import { Route, Routes } from "react-router-dom";
import BusinessIndex from "@src/pages/influencer-business/BusinessIndex";
import ProposalIndex from "@src/pages/proposals";
import ChatWrapper from "@src/pages/chat/ChatWrapper";
import BrandProtectedRoute from "./BrandProtectedRoute";
import InfluencerProtectedRoute from "./InfluencerProtectedRoute";
import ConnectedAccount from "@src/pages/ConnectedAccount/ConnectedAccount";
import ConnectedAccountProvider from "@src/components/Providers/ConnectedAccountProvider";
import ChangePassword from "@src/pages/profile/ChangePassword";
import Transactions from "@src/pages/Transactions";
import WhatsNewIndex from "@src/pages/whats-new";
import CreateWhatsNew from "@src/pages/whats-new/CreateWhatsNew/CreateWhatsNew";
import EditWhatsNew from "@src/pages/whats-new/EditWhatsNew/EditWhatsNew";
import Disputes from "@src/pages/Disputes";
import BodyScanCountIndex from "@src/pages/body-scan-count";
import SignupUsers from "@src/pages/SignupUsers";
import WaitlistUsers from "@src/pages/WaitlistUsers";
import SessionLogs from "@src/pages/sessionlog";
import UserErrorIndex from "@src/pages/user-error";
import InfluencerPayouts from "@src/pages/influencer-payouts";
import InfluencerAnalytics from "@src/pages/influencer-payouts/InfluencerAnalytics";
import ApplicationLogsIndex from "@src/pages/application-logs";

const DashboardRoutes = () => {
  return (
    <Routes>
      <Route element={<PrivateRoute />}>
        {/* Brand Routes */}

        <Route element={<BrandProtectedRoute />}>
          <Route path="products/view/:id" element={<ViewProduct />} />
          <Route path="products/edit/:id" element={<EditProductNew />} />
          <Route path="products/add" element={<AddProductNew />} />
          <Route path="products" element={<BrandProducts />} />

          <Route
            path="segments/:segment_id/influencers/:inf_id/review-document"
            element={<ReviewDocumentPage />}
          />
          <Route
            path="segments/:id/influencers"
            element={<FilteredInfluencer />}
          />
          <Route
            path="segments/:segmentId/influencer-profile/:id"
            element={<InfluencerProfileIndex />}
          />
          <Route path="segments/add" element={<SegmentCreate />} />
          <Route path="segments" element={<SegmentIndex />} />

          <Route path="/subscriptions/success" element={<Success />} />
          <Route path="/subscriptions" element={<Subscriptions />} />

          <Route path="campaigns/edit/:id" element={<CampaignEdit />} />

          <Route path="document-sent" element={<DocumentSentPage />} />
        </Route>

        {/* Influencer Routes */}
        <Route element={<InfluencerProtectedRoute />}>
          <Route path="posts/:id/edit" element={<EditPostNew />} />
          <Route path="posts/:id" element={<ViewPost />} />
          <Route path="posts/create" element={<AddPostNew />} />
          <Route path="posts" element={<InfluencerPosts />} />

          <Route path="businesses" element={<BusinessIndex />} />

          <Route
            path="proposals/brand-profile/:id"
            element={<BrandProfileIndex />}
          />
          <Route path="proposals/edit/:id" element={<EditProposal />} />
          <Route path="proposals/create" element={<CreateProposal />} />
          <Route path="proposals" element={<ProposalIndex />} />

          <Route path="campaigns/:id/publish" element={<PublishCampaign />} />
          <Route path="connected-account" element={<ConnectedAccount />} />
        </Route>

        {/* Shared Routes*/}
        <Route
          path="campaigns/:id"
          element={
            <ConnectedAccountProvider>
              <CampaignView />
            </ConnectedAccountProvider>
          }
        />
        <Route path="campaigns" element={<CampaignIndex />} />

        <Route path="chats" element={<ChatContainer />}>
          <Route path=":chat_id/chat-wrapper" element={<ChatWrapper />} />
        </Route>

        <Route
          path="campaigns/:campaign_id/review-contract"
          element={<ReviewContract />}
        />

        <Route path="/reports" element={<WeeklyReport />} />
        <Route path="/blogs" element={<BlogsList />} />
        <Route path="blogs/create" element={<CreateBlog />} />
        <Route path="blogs/:id" element={<ViewBlog />} />
        <Route path="blogs/edit/:id" element={<EditBlog />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="inf-analytics/:id" element={<InfluencerAnalytics />} />

        <Route
          path="notifications"
          element={
            <ConnectedAccountProvider>
              <NotificationsPage />
            </ConnectedAccountProvider>
          }
        />
        <Route path="transactions" element={<Transactions />} />
        <Route path="profile" element={<Profile />} />

        <Route path="profile/change_password" element={<ChangePassword />} />
        <Route path="/body_scan_count" element={<BodyScanCountIndex />} />
        <Route path="/signup_users" element={<SignupUsers />} />
        <Route path="/session_logs" element={<SessionLogs />} />
        <Route path="/payouts" element={<InfluencerPayouts />} />
        <Route path="/application_logs" element={<ApplicationLogsIndex />} />
        <Route path="/waitlist-users" element={<WaitlistUsers />} />

        <Route path="/whats_new" element={<WhatsNewIndex />} />
        <Route path="whats_new/create" element={<CreateWhatsNew />} />
        <Route path="/whats_new/edit/:id" element={<EditWhatsNew />} />

        <Route path="/body_gram_errors" element={<UserErrorIndex />} />


        <Route path="/disputes" element={<Disputes />} />
        {/* <Route index element={<DashboardHome />} /> */}
      </Route>
      <Route path="*" element={<Page404 />} />
    </Routes>
  );
};

export default DashboardRoutes;
