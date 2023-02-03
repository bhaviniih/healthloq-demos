import {
  HEALTHLOQ_GET_PRODUCT_LIST,
  HEALTHLOQ_GET_BATCH_INFO,
  READ_COA_USING_DOCUMENT_AI,
  BROWSE_PRODUCTS_FROM_NIH_DATABASE,
  UPDATE_FORM_FIELDS,
  GET_NIH_LABEL_INFO,
} from "./actionType";
import API from "./api";

export const updateFormFields = (params) => async (dispatch) => {
  dispatch({
    type: UPDATE_FORM_FIELDS,
    payload: params,
  });
};

export const getNIHLabelInfo = (params) => async (dispatch) => {
  try {
    dispatch({
      type: GET_NIH_LABEL_INFO,
    });
    const response = await API.getNIHLabelInfo(params);
    dispatch({
      type: GET_NIH_LABEL_INFO,
      payload: response,
    });
  } catch (error) {
    console.log(error);
  }
};

export const browseProductsFromNIH = (params) => async (dispatch) => {
  try {
    dispatch({
      type: BROWSE_PRODUCTS_FROM_NIH_DATABASE,
    });
    const response = await API.browseProductsFromNIH(params);
    dispatch({
      type: BROWSE_PRODUCTS_FROM_NIH_DATABASE,
      payload: response,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getHealthLOQProductList = (params) => async (dispatch) => {
  try {
    dispatch({
      type: HEALTHLOQ_GET_PRODUCT_LIST,
    });
    const response = await API.getHealthloqProductList(params);
    dispatch({
      type: HEALTHLOQ_GET_PRODUCT_LIST,
      payload: response,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getHealthLOQBatchInfo = (params) => async (dispatch) => {
  try {
    dispatch({
      type: HEALTHLOQ_GET_BATCH_INFO,
    });
    const response = await API.getHealthloqBatchInfo(params);
    dispatch({
      type: HEALTHLOQ_GET_BATCH_INFO,
      payload: response,
    });
  } catch (error) {
    console.log(error);
  }
};

export const readCoaUsingDocumentAi = (params) => async (dispatch) => {
  try {
    dispatch({
      type: READ_COA_USING_DOCUMENT_AI,
    });
    const response = await API.readCoaUsingDocumentAi(params);
    dispatch({
      type: READ_COA_USING_DOCUMENT_AI,
      payload: response,
    });
  } catch (error) {
    console.log(error);
  }
};
