import React from "react";
import "./index.scss";
import SearchProductOnHealthLOQ from "../../components/NIH/SearchProductOnHealthLOQ";
import SearchProductOnNIH from "../../components/NIH/SearchProductOnNIH";
import NIHProductListing from "../../components/NIH/NIHProductListing";
import ProductDetailComparision from "../../components/NIH/ProductDetailComparision";

function NIHDatabaseContainer() {
  return (
    <div className="nih-container center">
      <div className="nih-center-box">
        <h1>Compare NIH Labels with COA</h1>
        <div className="nih-form-section">
          <SearchProductOnHealthLOQ />
          <SearchProductOnNIH />
        </div>
        <NIHProductListing />
        <ProductDetailComparision />
      </div>
    </div>
  );
}

export default NIHDatabaseContainer;
