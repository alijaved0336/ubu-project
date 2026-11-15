import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Uses localStorage by default
import { combineReducers } from "redux";

import authReducer from "./features/authSlice";
import settingsReducer from "./features/settingsSlice";
import campaignFormReducer from "./features/campaignFormSlice";

import subscriptionsApi from "./api/subscriptionsApi";
import authApi from "./api/authApi";
import userApi from "./api/userApi";
import postsApi from "./api/postsApi";
import campaignPaymentApi from "./api/campaignPaymentApi";
import disputeApi from "./api/disputeApi";
import influencersApi from "./api/influencersApi";
import segmentsApi from "./api/segmentsApi";
import instagramApi from "./api/instagramApi";
import questionnaireApi from "./api/questionnaireApi";
import influencerPaymentApi from "./api/influencerPaymentApi";
import affiliateReportApi from "./api/affiliateReportApi";
import influencerPaymentsApi from "./api/influencerPaymentsApi";
import withdrawalsApi from "./api/withdrawableAmountApi";

// Persist Configurations for `auth` & `settings`
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "settings"], // Only persist these reducers
};

// Combine reducers to use with `persistReducer`
const rootReducer = combineReducers({
  auth: authReducer,
  campaignForm: campaignFormReducer,
  settings: settingsReducer,
  [authApi.reducerPath]: authApi.reducer,
  [userApi.reducerPath]: userApi.reducer,
  [subscriptionsApi.reducerPath]: subscriptionsApi.reducer,
  [postsApi.reducerPath]: postsApi.reducer,
  [campaignPaymentApi.reducerPath]: campaignPaymentApi.reducer,
  [influencerPaymentApi.reducerPath]: influencerPaymentApi.reducer,
  [disputeApi.reducerPath]: disputeApi.reducer,
  [influencersApi.reducerPath]: influencersApi.reducer,
  [segmentsApi.reducerPath]: segmentsApi.reducer,
  [instagramApi.reducerPath]: instagramApi.reducer,
  [questionnaireApi.reducerPath]: questionnaireApi.reducer,
  [affiliateReportApi.reducerPath]: affiliateReportApi.reducer,
  [influencerPaymentsApi.reducerPath]: influencerPaymentsApi.reducer,
  [withdrawalsApi.reducerPath]: withdrawalsApi.reducer,
});

// Apply persistReducer to the combined reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false })
      .concat(authApi.middleware)
      .concat(userApi.middleware)
      .concat(subscriptionsApi.middleware)
      .concat(postsApi.middleware)
      .concat(campaignPaymentApi.middleware)
      .concat(influencerPaymentApi.middleware)
      .concat(influencersApi.middleware)
      .concat(disputeApi.middleware)
      .concat(segmentsApi.middleware)
      .concat(instagramApi.middleware)
      .concat(questionnaireApi.middleware)
      .concat(affiliateReportApi.middleware)
      .concat(influencerPaymentsApi.middleware)
      .concat(withdrawalsApi.middleware),
});

const state = store.getState();
const persistor = persistStore(store);

setupListeners(store.dispatch);

export { store, persistor, state };
