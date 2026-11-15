import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isDirty: false,
  campaignName:"",
  hashtags: [],
  inputValue: "",
  value: 1,
  customRevisions: false,
  customTurnaroundTime: false,
  availableOptions: [
    "Instagram Video Stories",
    "Instagram Image Stories",
    "Instagram Image Posts",
    "Instagram Video Posts",
  ],
  availableProductChoices: ["Add Amazon Product URL", "Add UBU Product"],
  selectedOption: null,
  selectedProductChoice: [],
  deliverableCount: 1,
  deliverables: [],

  totalCompensation: "",
  campaignAcceptanceDeadline: null,
  publicationDates: null,
  productChoice: 1,
  selectedProduct: null,
  advertisemntUrl: "",

  brandGuidelines: "",
  description: "",
  numberOfRevisions: null,
  turnAroundTime: null,
  additionalRequirements: "",
  specialConditions: "",
};

const campaignFormSlice = createSlice({
  name: "campaignForm",
  initialState,
  reducers: {
    setHashtags: (state, action) => {
      state.hashtags = action.payload;
      state.isDirty = true;
    },
    setInputValue: (state, action) => {
      state.inputValue = action.payload;
      state.isDirty = true;
    },
    setValue: (state, action) => {
      state.value = action.payload;
      state.isDirty = true;
    },
    setCustomRevisions: (state, action) => {
      state.customRevisions = action.payload;
      state.isDirty = true;
    },
    setCustomTurnaroundTime: (state, action) => {
      state.customTurnaroundTime = action.payload;
      state.isDirty = true;
    },
    setAvailableOptions: (state, action) => {
      state.availableOptions = action.payload;
      state.isDirty = true;
    },
    setSelectedOption: (state, action) => {
      state.selectedOption = action.payload;
      state.isDirty = true;
    },
    setDeliverableCount: (state, action) => {
      state.deliverableCount = action.payload;
      state.isDirty = true;
    },
    setDeliverables: (state, action) => {
      state.deliverables = action.payload;
      state.isDirty = true;
    },
    setTotalCompensation: (state, action) => {
      state.totalCompensation = action.payload;
      state.isDirty = true;
    },
    setCampaignAcceptanceDeadline: (state, action) => {
      state.campaignAcceptanceDeadline = action.payload;
      state.isDirty = true;
    },
    setPublicationDates: (state, action) => {
      state.publicationDates = action.payload;
      state.isDirty = true;
    },
    setProductChoice: (state, action) => {
      state.productChoice = action.payload;
      state.isDirty = true;
    },
    setSelectedProduct: (state, action) => {
      state.selectedProduct = action.payload;
      state.isDirty = true;
    },
    setAdvertisemntUrl: (state, action) => {
      state.advertisemntUrl = action.payload;
      state.isDirty = true;
    },
    setBrandGuidelines: (state, action) => {
      state.brandGuidelines = action.payload;
      state.isDirty = true;
    },
    setDescription: (state, action) => {
      state.description = action.payload;
      state.isDirty = true;
    },
    setCampaignName: (state, action) => {
      state.campaignName = action.payload;
      state.isDirty = true;
    },
    setNumberOfRevisions: (state, action) => {
      state.numberOfRevisions = action.payload;
      state.isDirty = true;
    },
    setTurnAroundTime: (state, action) => {
      state.turnAroundTime = action.payload;
      state.isDirty = true;
    },
    setAdditionalRequirements: (state, action) => {
      state.additionalRequirements = action.payload;
      state.isDirty = true;
    },
    setSpecialConditions: (state, action) => {
      state.specialConditions = action.payload;
      state.isDirty = true;
    },

    resetCampaignForm: () => initialState,
  },
});

export const {
  setHashtags,
  setInputValue,
  setValue,
  setCustomRevisions,
  setCustomTurnaroundTime,
  setAvailableOptions,
  setSelectedOption,
  setDeliverableCount,
  setDeliverables,
  setCampaignAcceptanceDeadline,
  setProductChoice,
  setPublicationDates,
  setSelectedProduct,
  setTotalCompensation,
  setAdvertisemntUrl,
  setCampaignName,
  setBrandGuidelines,
  setAdditionalRequirements,
  setDescription,
  setNumberOfRevisions,
  setSpecialConditions,
  setTurnAroundTime,
  resetCampaignForm,
} = campaignFormSlice.actions;

export default campaignFormSlice.reducer;
