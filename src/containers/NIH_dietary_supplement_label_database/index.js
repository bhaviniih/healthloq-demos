import { useState } from "react";
import axios from "axios";
import "./index.sass";

function NIHDatabaseContainer() {
  const [coa, setCoa] = useState(null);
  const [searchProductParams, setSearchProductParams] = useState({
    q: "",
    method: "by_letter",
    from: 0,
    size: 10,
    isLoading: false,
  });
  const [productList, setProductList] = useState([]);
  const [coaData, setCoaData] = useState(null);

  const handleProductSearchChange = (key, value) => {
    setSearchProductParams((pre) => ({ ...pre, [key]: value }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    let formData = new FormData();
    formData.append("productCoaFile", coa);
    formData.append("type", "quickstart");
    const documentInfo = await axios.post(
      `http://localhost:7777/api/document-ai/readDocument`,
      formData
    );
    console.log(documentInfo);
    if (documentInfo?.data?.status === "1" && documentInfo?.data?.data) {
      setCoaData(documentInfo?.data?.data);
    }
  };
  const handleSearchIngredients = async (e) => {
    e.preventDefault();
    setSearchProductParams((pre) => ({ ...pre, isLoading: true }));
    const productList = await axios.get(
      `https://api.ods.od.nih.gov/dsld/v9/browse-products?method=${searchProductParams?.method}&q=${searchProductParams?.q}&size=${searchProductParams?.size}&from=${searchProductParams?.from}`
    );
    if (productList?.data?.hits?.length) {
      const response = await axios.all(
        productList?.data?.hits?.map((item) =>
          axios.get(`https://api.ods.od.nih.gov/dsld/v9/label/${item["_id"]}`)
        )
      );
      setProductList(response?.map((item) => item?.data));
    }
    setSearchProductParams((pre) => ({ ...pre, isLoading: false }));
  };
  // https://us-documentai.googleapis.com/v1/projects/224664002400/locations/us/processors/9391674c6c2bdc83/processorVersions/pretrained-ocr-v1.1-2022-09-12:process
  return (
    <div className="app-container">
      <div className="app-center-container">
        <h1 className="heading-h1">
          NIH Dietary Supplement Label Database Demo
        </h1>
        <h2 className="heading-h2">
          Read COA using Google Cloud Document-Ai (pending)
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="form-div">
            <label htmlFor="coa-input-file">Select COA</label>
            <input
              id="coa-input-file"
              type={"file"}
              onChange={(e) => {
                e.target?.files?.length && setCoa(e.target.files[0]);
                setCoaData(null);
              }}
              onClick={(e) => (e.target.value = null)}
              required
            />
          </div>
          <div className="form-action-btns">
            <button type="submit">Submit</button>
          </div>
        </form>
        {coaData && (
          <div className="coa-info-container">
            <p>{JSON.stringify(coaData)}</p>
          </div>
        )}
        <h2 className="heading-h2">Find Ingredients from NIH Database</h2>
        <form onSubmit={handleSearchIngredients}>
          <div className="form-div">
            <label htmlFor="product-search-method">Select search method</label>
            <select
              id="product-search-method"
              required
              value={searchProductParams?.method}
              onChange={(e) =>
                handleProductSearchChange("method", e.target.value)
              }
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
              value={searchProductParams?.q}
              onChange={(e) => handleProductSearchChange("q", e.target.value)}
              required
            />
          </div>
          <div className="form-action-btns">
            <button type="submit" disabled={searchProductParams?.isLoading}>
              {searchProductParams?.isLoading ? "Loading..." : "Submit"}
            </button>
          </div>
        </form>
        {productList?.length > 0 && !searchProductParams?.isLoading ? (
          <div className="product-ul">
            {productList?.map((item, key) => {
              return (
                <div className="product-info" key={key}>
                  <h2 className="product-name">{item?.fullName}</h2>
                  <div className="product-img">
                    <img
                      src={`https://s3-us-gov-west-1.amazonaws.com/cg-355fa78b-864d-4a44-b287-0369f11f024a/pdf/thumbnails/${item?.id}.jpg`}
                      alt={item?.fullName}
                    />
                  </div>
                  <div className="form-action-btns">
                    <button
                      onClick={() =>
                        window.open(
                          `https://s3-us-gov-west-1.amazonaws.com/cg-355fa78b-864d-4a44-b287-0369f11f024a/pdf/${item?.id}.pdf`,
                          "_blank"
                        )
                      }
                    >
                      View as PDF
                    </button>
                  </div>

                  <div className="product-info-section">
                    <h2>Product Overview</h2>
                    <h3 className="product-info-sub-heading">
                      =&gt; General Information
                    </h3>
                    <p className="key-value-pairs">
                      <span>Product Name:</span>
                      {item?.fullName}
                    </p>
                    <p className="key-value-pairs">
                      <span>Organization Name:</span>
                      {item?.brandName}
                    </p>
                    <p className="key-value-pairs">
                      <span>Bar Code:</span>
                      {item?.upcSku}
                    </p>
                    <p className="key-value-pairs">
                      <span>Net Contents:</span>
                      {item?.netContents?.reduce(
                        (str, content, i, arr) =>
                          `${str} ${content?.display}${
                            i !== arr?.length - 1 ? "," : ""
                          }`,
                        ""
                      )}
                    </p>
                    <p className="key-value-pairs">
                      <span>Market Status:</span>
                      {item?.offMarket ? "Off Market" : "On Market"}
                    </p>
                    {item?.events?.length > 0 &&
                      item?.events?.map((event, key) => {
                        return (
                          <p key={key} className="key-value-pairs">
                            <span>{event?.type}:</span>
                            {event?.date}
                          </p>
                        );
                      })}
                    <p className="key-value-pairs">
                      <span>DSLD ID:</span>
                      {item?.id}
                    </p>
                  </div>

                  <div className="product-info-section">
                    <h3 className="product-info-sub-heading">
                      =&gt; Product Classification
                    </h3>
                    <p className="key-value-pairs">
                      <span>Product Type:</span>
                      {item?.productType?.langualCodeDescription}
                    </p>
                    <p className="key-value-pairs">
                      <span>Supplement Form:</span>
                      {item?.physicalState?.langualCodeDescription}
                    </p>
                    <p className="key-value-pairs">
                      <span>Dietary Claim(s) or Use(s):</span>
                      {item?.claims?.reduce(
                        (str, claim, i, arr) =>
                          `${str} ${claim?.langualCodeDescription}${
                            i !== arr?.length - 1 ? "," : ""
                          }`,
                        ""
                      )}
                    </p>
                    <p className="key-value-pairs">
                      <span>Intended Target Group(s):</span>
                      {item?.targetGroups?.reduce(
                        (str, group, i, arr) =>
                          `${str} ${group}${i !== arr?.length - 1 ? "," : ""}`,
                        ""
                      )}
                    </p>
                  </div>

                  <div className="product-info-section">
                    <h2>Label Information</h2>
                    <h3 className="product-info-sub-heading">
                      =&gt; Supplement Facts
                    </h3>
                    <p className="key-value-pairs">
                      <span>Daily Value (DV) Target Group(s):</span>
                      {item?.userGroups?.reduce(
                        (str, group, i, arr) =>
                          `${str} ${group?.dailyValueTargetGroupName}${
                            i !== arr?.length - 1 ? "," : ""
                          }`,
                        ""
                      )}
                    </p>
                    <p className="key-value-pairs">
                      <span>Serving Size:</span>
                      {item?.servingSizes?.reduce(
                        (str, size, i, arr) =>
                          `${str} ${size?.maxDailyServings} ${size?.unit}${
                            i !== arr?.length - 1 ? "," : ""
                          }`,
                        ""
                      )}
                    </p>
                    <p className="key-value-pairs">
                      <span>Alternate Serving Size:</span>-
                    </p>
                    <p className="key-value-pairs">
                      <span>Servings per Container:</span>
                      {item?.servingsPerContainer}
                    </p>
                    <table>
                      <thead>
                        <tr>
                          <th className="tabel-head-th">Serving Size(s)</th>
                          <th className="tabel-head-th">
                            {item?.servingSizes?.reduce(
                              (str, size, i, arr) =>
                                `${str} ${size?.maxQuantity} ${size?.unit}${
                                  i !== arr?.length - 1 ? "," : ""
                                }`,
                              ""
                            )}
                          </th>
                        </tr>
                        <tr>
                          <th className="tabel-head-th">Ingredient</th>
                          <th className="tabel-head-th">Amount per Serving</th>
                        </tr>
                      </thead>
                      <tbody>
                        {item?.ingredientRows?.map((ingredient, key) => {
                          return (
                            <tr key={key}>
                              <td className="tabel-body-td">
                                <p>
                                  <span>Name:</span>
                                  {ingredient?.name}
                                </p>
                                {ingredient?.forms?.length > 0 && (
                                  <p>
                                    <span>Forms:</span>
                                    {ingredient?.forms?.[0]?.name}
                                  </p>
                                )}
                                {ingredient?.notes !== "" && (
                                  <p>
                                    <span>Notes:</span>
                                    {ingredient?.notes}
                                  </p>
                                )}
                              </td>
                              <td>
                                {ingredient?.quantity?.[0]?.quantity}{" "}
                                {ingredient?.quantity?.[0]?.unit}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                    {item?.otheringredients?.ingredients?.length > 0 && (
                      <p className="key-value-pairs">
                        <span>Other Ingredients:</span>
                        {item?.otheringredients?.ingredients?.reduce(
                          (str, ingredient, i, arr) =>
                            `${str} ${ingredient?.name}${
                              arr.length - 1 !== i ? "," : ""
                            }`,
                          ""
                        )}
                      </p>
                    )}
                  </div>

                  <div className="product-info-section">
                    <h3 className="product-info-sub-heading">
                      =&gt; Label Statements
                    </h3>
                    {item?.statements?.length > 0 &&
                      item?.statements?.map((statement, key) => {
                        return (
                          <p className="key-value-pairs" key={key}>
                            <span>{statement?.type}</span>
                            {statement?.notes}
                          </p>
                        );
                      })}
                  </div>

                  {item?.contacts?.length > 0 &&
                    item?.contacts?.map((contact, key) => {
                      return (
                        <div className="product-info-section" key={key}>
                          <h2>Brand Information</h2>
                          <h4 className="product-info-sub-heading">
                            =&gt; {contact?.text}
                          </h4>
                          <p>{contact?.contactDetails?.name}</p>
                          <p>{contact?.contactDetails?.streetAddress}</p>
                          <p>
                            {contact?.contactDetails?.city}
                            {contact?.contactDetails?.city && ", "}
                            {contact?.contactDetails?.state}
                            {contact?.contactDetails?.state && ", "}
                            {contact?.contactDetails?.zipCode}
                            {contact?.contactDetails?.zipCode && ", "}
                            {contact?.contactDetails?.country}
                          </p>
                          <p>{contact?.contactDetails?.phoneNumber}</p>
                          <p>{contact?.contactDetails?.email}</p>
                          {contact?.contactDetails?.webAddress !== "" && (
                            <a
                              href={`${
                                contact?.contactDetails?.webAddress?.includes(
                                  "http"
                                ) ||
                                contact?.contactDetails?.webAddress?.includes(
                                  "https"
                                )
                                  ? ""
                                  : "http://"
                              }${contact?.contactDetails?.webAddress}`}
                              target="_blank"
                              rel="noreferrer"
                            >
                              {contact?.contactDetails?.webAddress}
                            </a>
                          )}
                        </div>
                      );
                    })}
                </div>
              );
            })}
          </div>
        ) : (
          !searchProductParams?.isLoading && (
            <div className="zero-state-msg">
              <p>Data not available.</p>
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default NIHDatabaseContainer;
