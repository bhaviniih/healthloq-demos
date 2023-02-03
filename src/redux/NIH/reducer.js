import {
  HEALTHLOQ_GET_PRODUCT_LIST,
  HEALTHLOQ_GET_BATCH_INFO,
  READ_COA_USING_DOCUMENT_AI,
  BROWSE_PRODUCTS_FROM_NIH_DATABASE,
  UPDATE_FORM_FIELDS,
  GET_NIH_LABEL_INFO,
} from "./actionType";

const initialState = {
  healthloqProductList: {
    isLoading: false,
    data: [],
  },
  batchInfo: {
    isLoading: false,
  },
  documentAiCoaResult: {
    isLoading: false,
    hasError: false,
  },
  productListFromNIH: {
    isLoading: false,
  },
  nihLabelInfo: {
    isLoading: false,
  },
  activeNIHProductId: 0,
  selectedProductName: "",
};

const NIHReducer = (
  previousState = initialState,
  { type, payload = {} },
  state
) => {
  switch (type) {
    case GET_NIH_LABEL_INFO: {
      return {
        ...previousState,
        nihLabelInfo: {
          ...previousState.nihLabelInfo,
          isLoading: !previousState.nihLabelInfo.isLoading,
          ...payload,
        },
      };
    }
    case UPDATE_FORM_FIELDS: {
      return {
        ...previousState,
        [payload?.key]: payload.value,
      };
    }
    case BROWSE_PRODUCTS_FROM_NIH_DATABASE: {
      return {
        ...previousState,
        productListFromNIH: {
          ...previousState.productListFromNIH,
          isLoading: !previousState.productListFromNIH.isLoading,
          ...payload,
        },
      };
    }
    case READ_COA_USING_DOCUMENT_AI: {
      return {
        ...previousState,
        documentAiCoaResult: {
          ...previousState.documentAiCoaResult,
          isLoading: !previousState.documentAiCoaResult.isLoading,
          ...payload,
          hasError: !!previousState.documentAiCoaResult.isLoading
            ? Object.keys(payload) !== 3
            : false,
        },
      };
    }
    case HEALTHLOQ_GET_BATCH_INFO: {
      return {
        ...previousState,
        batchInfo: {
          ...previousState.batchInfo,
          isLoading: !previousState.batchInfo.isLoading,
          ...payload,
        },
      };
    }
    case HEALTHLOQ_GET_PRODUCT_LIST: {
      return {
        ...previousState,
        healthloqProductList: {
          ...previousState.healthloqProductList,
          isLoading: !previousState.healthloqProductList.isLoading,
          data: payload?.length ? payload : [],
        },
      };
    }
    default:
      return previousState || initialState;
  }
};

export default NIHReducer;
