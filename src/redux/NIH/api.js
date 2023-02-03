import { healthloqGet, healthloqPost, post } from "../../Api";
import axios from "axios";

const apis = {
  getHealthloqProductList: async (config) => {
    return await healthloqGet(
      `/client-app/getIntegrantTypeForDocAIDemo`,
      config
    );
  },
  getHealthloqBatchInfo: async (params) => {
    return await healthloqPost(`/client-app/integrant-detail`, params);
  },
  readCoaUsingDocumentAi: async (params) => {
    return await post(`/api/document-ai/readDocument`, params);
  },
  browseProductsFromNIH: async (params) => {
    return await axios
      .get(
        `https://api.ods.od.nih.gov/dsld/v9/browse-products?method=${params?.method}&q=${params?.q}&size=${params?.size}&from=${params?.from}`
      )
      .then((response) => response.data)
      .catch((error) => error?.response?.data);
  },
  getNIHLabelInfo: async (params) => {
    return await axios
      .get(`https://api.ods.od.nih.gov/dsld/v9/label/${params?.id}`)
      .then((response) => response.data)
      .catch((error) => error?.response?.data);
  },
};

export default apis;
