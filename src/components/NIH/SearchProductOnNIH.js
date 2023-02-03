import React, { useEffect, useState } from "react";
import "./index.scss";
import { connect } from "react-redux";
import { browseProductsFromNIH } from "../../redux/NIH/action";

export const SearchProductOnNIH = ({
  browseProductsFromNIH,
  productListFromNIH,
  selectedProductName,
}) => {
  const [searchMethod, setSearchMethod] = useState("by_letter");
  const [searchText, setSearchText] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    browseProductsFromNIH({
      method: searchMethod,
      q: searchText,
      size: 100,
      from: 0,
    });
  };
  useEffect(() => {
    if (selectedProductName?.trim()) {
      browseProductsFromNIH({
        method: searchMethod,
        q: selectedProductName,
        size: 100,
        from: 0,
      });
      setSearchText(selectedProductName);
    }
  }, [selectedProductName]);
  return (
    <div className="healthloq-nih-form-section">
      <h3>Search Product From NIH Database</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-div">
          <label htmlFor="nih-search-method-select-box">
            Select search method
          </label>
          <select
            id="nih-search-method-select-box"
            required
            value={searchMethod}
            onChange={(e) => setSearchMethod(e.target.value)}
          >
            <option value={"by_letter"}>by_letter</option>
            <option value={"by_keyword"}>by_keyword</option>
          </select>
        </div>
        <div className="form-div">
          <label htmlFor="product-name">Enter product name</label>
          <input
            id="product-name"
            type={"text"}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          disabled={!searchText || productListFromNIH?.isLoading}
        >
          {productListFromNIH?.isLoading ? "Loading..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

const mapStateToProps = ({
  nihReducer: { productListFromNIH, selectedProductName },
}) => ({
  productListFromNIH,
  selectedProductName,
});

const mapDispatchToProps = { browseProductsFromNIH };

export default connect(mapStateToProps, mapDispatchToProps)(SearchProductOnNIH);
