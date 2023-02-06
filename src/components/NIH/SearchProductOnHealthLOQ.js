import React, { useEffect, useState } from "react";
import "./index.scss";
import { connect } from "react-redux";
import {
  getHealthLOQProductList,
  getHealthLOQBatchInfo,
  readCoaUsingDocumentAi,
  updateFormFields,
} from "../../redux/NIH/action";

export const SearchProductOnHealthLOQ = ({
  healthloqProductList,
  getHealthLOQProductList,
  getHealthLOQBatchInfo,
  batchInfo,
  readCoaUsingDocumentAi,
  documentAiCoaResult,
  updateFormFields,
}) => {
  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("");
  const [selectedCoa, setSelectedCoa] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    let formData = new FormData();
    formData.append("type", "processDocumentWithFormParser");
    const coaData = batchInfo?.exhibitsInfo
      ?.map((item) => item?.exhibitsType)
      ?.flatMap((item) => item)
      ?.filter((item) => item?.id === selectedCoa)[0];
    formData.append("url", coaData?.url);
    readCoaUsingDocumentAi(formData);
  };
  const handleBatchChange = (batchId) => {
    const product = healthloqProductList?.data?.filter(
      (item) => item?.id === selectedProduct
    )[0];
    getHealthLOQBatchInfo({
      short_code: product?.organization?.short_code,
      external_id_slug: product?.integrantsType?.filter(
        (batch) => batch?.id === batchId
      )[0]?.external_id_slug,
    });
  };
  useEffect(() => {
    getHealthLOQProductList();
  }, []);
  return (
    <div className="healthloq-coa-form-section">
      <h3>Select Product COA From HealthLOQ Database</h3>
      <form onSubmit={handleSubmit} className="form">
        <div className="form-div">
          <label htmlFor="healthloq-product-select-box">Select Product</label>
          <select
            id="healthloq-product-select-box"
            value={selectedProduct}
            onChange={(e) => {
              setSelectedProduct(e.target.value);
              setSelectedBatch("");
              setSelectedCoa("");
              updateFormFields({
                key: "selectedProductName",
                value: e.target.value?.trim()
                  ? healthloqProductList?.data?.filter(
                      (item) => item?.id === e.target.value
                    )[0]?.title
                  : "",
              });
            }}
          >
            <option value={""} disabled>
              {healthloqProductList?.isLoading
                ? "Loading..."
                : healthloqProductList?.data?.length
                ? "Select Product"
                : "Products not available."}
            </option>
            {healthloqProductList?.data?.map((item, key) => {
              return (
                <option value={item?.id} key={key}>
                  {item?.title}
                </option>
              );
            })}
          </select>
        </div>
        <div className="form-div">
          <label htmlFor="healthloq-batch-select-box">
            Select Product Batch
          </label>
          <select
            id="healthloq-batch-select-box"
            value={selectedBatch}
            onChange={(e) => {
              setSelectedBatch(e.target.value);
              setSelectedCoa("");
              if (e.target?.value?.trim()) {
                handleBatchChange(e.target.value);
              }
            }}
          >
            <option value={""} disabled>
              Select Product Batch
            </option>
            {healthloqProductList?.data
              ?.filter((product) => product?.id === selectedProduct)[0]
              ?.integrantsType?.map((item, key) => {
                return (
                  <option key={key} value={item?.id}>
                    {item?.external_id}
                  </option>
                );
              })}
          </select>
        </div>
        <div className="form-div">
          <label htmlFor="healthloq-coa-select-box">Select COA</label>
          <select
            id="healthloq-coa-select-box"
            value={selectedCoa}
            onChange={(e) => {
              setSelectedCoa(e.target.value);
            }}
          >
            <option value={""} disabled>
              {batchInfo?.isLoading ? "Loading..." : "Select COA"}
            </option>
            {!batchInfo?.isLoading &&
              batchInfo?.exhibitsInfo
                ?.map((item) => item?.exhibitsType)
                ?.flatMap((item) => item)
                ?.map((item, key) => {
                  return (
                    <option key={key} value={item?.id}>
                      {item?.title}
                    </option>
                  );
                })}
          </select>
        </div>
        <button
          type="submit"
          disabled={
            !selectedProduct ||
            !selectedBatch ||
            !selectedCoa ||
            documentAiCoaResult?.isLoading
          }
        >
          {documentAiCoaResult?.isLoading ? "Loading..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

const mapStateToProps = ({
  nihReducer: { healthloqProductList, batchInfo, documentAiCoaResult },
}) => ({
  healthloqProductList,
  batchInfo,
  documentAiCoaResult,
});

const mapDispatchToProps = {
  getHealthLOQProductList,
  getHealthLOQBatchInfo,
  readCoaUsingDocumentAi,
  updateFormFields,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchProductOnHealthLOQ);
