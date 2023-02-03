import React, { useState } from "react";
import "./index.scss";
import SearchProductOnHealthLOQ from "../../components/NIH/SearchProductOnHealthLOQ";
import SearchProductOnNIH from "../../components/NIH/SearchProductOnNIH";
import NIHProductListing from "../../components/NIH/NIHProductListing";
import ProductDetailComparision from "../../components/NIH/ProductDetailComparision";

function NIHDatabaseContainer() {
  const [batchInfo, setBatchInfo] = useState(null);
  const [documentAiResult, setDocumentAiResult] = useState(null);
  const [searchTextDocAiResult, setSearchTextDocAiResult] = useState(null);
  const [searchText, setSearchText] = useState("");

  const handleSearchText = (e) => {
    e.preventDefault();
    setSearchTextDocAiResult({
      ...documentAiResult,
      pages: documentAiResult?.pages?.map((page) => ({
        ...page,
        paragraphs: page?.paragraphs?.map((para) =>
          para.replace(
            new RegExp(searchText, "gi"),
            `<span class="highlight-text">${searchText}</span>`
          )
        ),
      })),
    });
  };

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
        {batchInfo && searchTextDocAiResult && (
          <div className="document-ai-overview">
            <div className="docAi-container">
              <h2 className="product-name">Product Info From Our Database</h2>
              <div className="docAi-top-item">
                <div className="product-img">
                  <img
                    src={batchInfo?.integrantInfo?.integrantsType?.image_url}
                    alt=""
                  />
                </div>
                <p className="key-value-pairs">
                  <span>Product Name: </span>
                  {batchInfo?.integrantInfo?.title}
                </p>
                <p className="key-value-pairs">
                  <span>Product Description: </span>
                  {batchInfo?.integrantInfo?.description}
                </p>
                <h3 className="product-info-sub-heading">Ingredients</h3>
                {batchInfo?.sourceLinks?.map((item, key) => {
                  return (
                    <React.Fragment key={key}>
                      <div className="ingredient-li">
                        <img src={item?.sourceInfo?.image} alt="" />
                        <p>{item?.sourceInfo?.title}</p>
                      </div>
                      {item?.nodes?.map((node, subKey) => {
                        return (
                          <div
                            className="ingredient-li nested-ingredient-li"
                            key={subKey}
                          >
                            <img src={node?.sourceInfo?.image} alt="" />
                            <p>{node?.sourceInfo?.title}</p>
                          </div>
                        );
                      })}
                    </React.Fragment>
                  );
                })}
              </div>
              <br />
              <h2 className="product-name">Text From Document AI</h2>
              <form onSubmit={handleSearchText}>
                <div className="search-div">
                  <input
                    placeholder="Search Ingredients"
                    type="text"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                  />
                  <button type="submit">Submit</button>
                </div>
              </form>
              <div className="docAi-bottom-item">
                {searchTextDocAiResult?.pages?.map((page, key) => {
                  return (
                    <div key={key}>
                      <p>Page No: {page?.pageNumber}</p>
                      {page?.paragraphs?.map((para, subKey) => {
                        return (
                          <div
                            dangerouslySetInnerHTML={{ __html: para }}
                            key={subKey}
                            className="document-ai-para"
                          />
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default NIHDatabaseContainer;
