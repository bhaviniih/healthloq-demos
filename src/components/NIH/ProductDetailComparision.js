import React, { useEffect, useState } from "react";
import "./index.scss";
import { connect } from "react-redux";

export const ProductDetailComparision = ({
  batchInfo,
  nihLabelInfo,
  documentAiCoaResult,
  activeNIHProductId,
}) => {
  // const [coaText, setCoaText] = useState(null);
  // const [searchIngredientsType, setSearchIngredientsType] = useState(["NIH"]);
  // const handleSearch = (type) => {
  //   setSearchIngredientsType(type);
  //   let ingredientNameList = [nihLabelInfo?.fullName];
  //   if (searchIngredientsType === "NIH") {
  //     if (nihLabelInfo?.ingredientRows?.length) {
  //       ingredientNameList = [
  //         ...ingredientNameList,
  //         ...nihLabelInfo?.ingredientRows?.map((item) => item?.name),
  //       ];
  //     }
  //     if (nihLabelInfo?.otheringredients?.ingredients?.length) {
  //       ingredientNameList = [
  //         ...ingredientNameList,
  //         ...nihLabelInfo?.otheringredients?.ingredients?.map(
  //           (item) => item?.name
  //         ),
  //       ];
  //     }
  //   } else {
  //     ingredientNameList = [
  //       ...batchInfo?.sourceLinks
  //         ?.map((item) => [
  //           item?.sourceInfo?.title,
  //           ...item?.nodes?.map((node) => node?.sourceInfo?.title),
  //         ])
  //         ?.flatMap((item) => item),
  //       batchInfo?.integrantInfo?.title,
  //     ];
  //   }
  //   ingredientNameList = [
  //     ...ingredientNameList,
  //     ...ingredientNameList
  //       ?.map((str) =>
  //         str
  //           ?.split(" ")
  //           ?.map((s) => s?.replace(/[@!&\/\\#,+()$~%.'"`_:*?<>{}-]/g, ""))
  //       )
  //       ?.flatMap((item) => item),
  //   ]?.filter((str, i, arr) => arr?.indexOf(str) === i);
  //   console.log("ingredientNameList", ingredientNameList);
  //   setCoaText({
  //     ...documentAiCoaResult?.data,
  //     pages: documentAiCoaResult?.data?.pages?.map((page) => ({
  //       ...page,
  //       paragraphs: page?.paragraphs?.map((para) =>
  //         ingredientNameList?.reduce(
  //           (str, searchText) =>
  //             str
  //               ?.toLowerCase()
  //               .replace(
  //                 new RegExp(searchText?.toLowerCase(), "gi"),
  //                 `<span class="highlight-text">${searchText?.toLowerCase()}</span>`
  //               ),
  //           para
  //         )
  //       ),
  //     })),
  //   });
  // };
  // useEffect(() => {
  //   if (
  //     !documentAiCoaResult?.isLoading &&
  //     documentAiCoaResult?.data &&
  //     Object.keys(documentAiCoaResult?.data).length
  //   ) {
  //     handleSearch("NIH");
  //   }
  // }, [documentAiCoaResult]);
  // useEffect(() => {
  //   if (activeNIHProductId) {
  //     handleSearch("NIH");
  //   }
  // }, [activeNIHProductId, documentAiCoaResult, nihLabelInfo]);

  const [ingredients, setIngredients] = useState({
    healthloq: [],
    nih: [],
    coa: [],
  });
  const [otherDetails, setOtherDetails] = useState({
    healthloq: [],
    nih: [],
    coa: [],
  });

  useEffect(() => {
    if (batchInfo?.sourceLinks?.length) {
      setIngredients((pre) => ({
        ...pre,
        healthloq: batchInfo?.sourceLinks
          ?.map((item) => [
            item?.sourceInfo?.title,
            ...item?.nodes?.map((node) => node?.sourceInfo?.title),
          ])
          ?.flatMap((item) => item),
      }));
      if (batchInfo?.integrantInfo?.facets) {
        const facets = JSON.parse(batchInfo?.integrantInfo?.facets);
        if (facets?.length) {
          setOtherDetails((pre) => ({
            ...pre,
            healthloq: facets?.map((facet) => ({
              key: facet?.title,
              value: facet?.description,
            })),
          }));
        }
      }
    }
  }, [batchInfo]);

  useEffect(() => {
    let arr = [];
    if (nihLabelInfo?.ingredientRows?.length) {
      arr = [
        ...arr,
        ...nihLabelInfo?.ingredientRows?.map(
          (item) =>
            `${item?.name} ${
              item?.forms?.length
                ? `(${item?.forms?.reduce(
                    (str, form, i, arr) =>
                      `${str}${form?.name}${i !== arr?.length - 1 ? ", " : ""}`,
                    ""
                  )})`
                : ""
            }`
        ),
      ];
    }
    if (nihLabelInfo?.otheringredients?.ingredients?.length) {
      arr = [
        ...arr,
        ...nihLabelInfo?.otheringredients?.ingredients?.map(
          (item) =>
            `${item?.name} ${
              item?.forms?.length
                ? `(${item?.forms?.reduce(
                    (str, form, i, arr) =>
                      `${str}${form?.name}${i !== arr?.length - 1 ? ", " : ""}`,
                    ""
                  )})`
                : ""
            }`
        ),
      ];
    }
    if (arr?.length) {
      setIngredients((pre) => ({ ...pre, nih: arr }));
    }
    setOtherDetails((pre) => ({
      ...pre,
      nih: [
        {
          key: "General Information",
          value: "",
        },
        {
          key: "Product Name",
          value: nihLabelInfo?.fullName,
        },
        {
          key: "Brand",
          value: nihLabelInfo?.brandName,
        },
        {
          key: "Bar Code",
          value: nihLabelInfo?.upcSku,
        },
        {
          key: "Net Contents",
          value: nihLabelInfo?.netContents?.reduce(
            (str, item, i, arr) =>
              `${str}${item?.display}${i !== arr?.length - 1 ? ", " : ""}`,
            ""
          ),
        },
        {
          key: "Market Status",
          value: nihLabelInfo?.offMarket ? "Off Market" : "On Market",
        },
        ...(nihLabelInfo?.events?.map((event) => ({
          key: event?.type,
          value: event?.date,
        })) || []),
        {
          key: "DSLD ID",
          value: nihLabelInfo?.id,
        },
        {},
        {
          key: "Product Classification",
        },
        {
          key: "Product Type",
          value: nihLabelInfo?.productType?.langualCodeDescription,
        },
        {
          key: "Supplement Form",
          value: nihLabelInfo?.physicalState?.langualCodeDescription,
        },
        {
          key: "Dietary Claim(s) or Use(s)",
          value: nihLabelInfo?.claims?.reduce(
            (str, item, i, arr) =>
              `${str}${item?.langualCodeDescription}${
                i !== arr?.length - 1 ? ", " : ""
              }`,
            ""
          ),
        },
        {
          key: "Intended Target Group(s)",
          value: nihLabelInfo?.targetGroups?.reduce(
            (str, item, i, arr) =>
              `${str}${item}${i !== arr?.length - 1 ? ", " : ""}`,
            ""
          ),
        },
        {},
        {
          key: "Supplement Facts",
        },
        {
          key: "Daily Value (DV) Target Group(s)",
          value: nihLabelInfo?.userGroups?.reduce(
            (str, item, i, arr) =>
              `${str}${item?.dailyValueTargetGroupName}${
                i !== arr?.length - 1 ? ", " : ""
              }`,
            ""
          ),
        },
        {
          key: "Serving Size",
          value: nihLabelInfo?.servingSizes?.reduce(
            (str, item, i, arr) =>
              `${str}${item?.order} ${item?.unit}${
                i !== arr?.length - 1 ? ", " : ""
              }`,
            ""
          ),
        },
        {
          key: "Alternate Serving Size",
          value: "-",
        },
        {
          key: "Servings per Container",
          value: nihLabelInfo?.servingsPerContainer,
        },
        {},
        {
          key: "Label Statements",
        },
        ...(nihLabelInfo?.statements?.map((statement) => ({
          key: statement.type,
          value: statement?.notes,
        })) || []),
        {},
        {
          key: "Manufacturer",
        },
        ...(nihLabelInfo?.contacts?.map((contact) => ({
          key: contact?.text,
          value: `${contact?.contactDetails?.name}, ${contact?.contactDetails?.streetAddress}, ${contact?.contactDetails?.city}, ${contact?.contactDetails?.state}, ${contact?.contactDetails?.zipCode}, ${contact?.contactDetails?.phoneNumber}, ${contact?.contactDetails?.email}`,
        })) || []),
      ],
    }));
  }, [nihLabelInfo, activeNIHProductId]);

  useEffect(() => {
    setIngredients((pre) => ({
      ...pre,
      coa: documentAiCoaResult?.data?.pages
        ?.map((page) =>
          page?.tables
            ?.map((tabel) => tabel?.rows?.map((row) => row[0]))
            ?.flatMap((item) => item)
        )
        ?.flatMap((item) => item)
        ?.filter((item) => Boolean(item)),
    }));
    setOtherDetails((pre) => ({
      ...pre,
      coa: documentAiCoaResult?.data?.pages
        ?.map((page) => page?.formFields)
        ?.flatMap((item) => item),
    }));
  }, [documentAiCoaResult]);

  if (!batchInfo?.integrantInfo?.title && !nihLabelInfo?.fullName) {
    return null;
  }
  return (
    <div className="product-comparision-section">
      <h3>Product Comparision Between Our Product With NIH Product</h3>
      <div>
        <div className="product-info-box">
          {batchInfo?.integrantInfo?.title ? (
            <>
              <h4>{batchInfo?.integrantInfo?.title} (From HealthLOQ)</h4>
              <div>
                <img
                  src={batchInfo?.integrantInfo?.integrantsType?.image_url}
                  alt=""
                />
              </div>
              <p>
                <span>Brand:</span>
                {batchInfo?.integrantInfo?.organizations?.name}
              </p>
              {/* <h4>Ingredients</h4>
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
              })} */}
              {/* <button onClick={() => handleSearch("HealthLOQ")}>
                Search Ingredients In COA Text
              </button> */}
            </>
          ) : null}
        </div>
        <div className="product-info-box">
          {nihLabelInfo?.fullName ? (
            <>
              <h4>{nihLabelInfo?.fullName} (From NIH)</h4>
              <div>
                <img
                  src={`https://s3-us-gov-west-1.amazonaws.com/cg-355fa78b-864d-4a44-b287-0369f11f024a/pdf/thumbnails/${nihLabelInfo?.id}.jpg`}
                  alt=""
                />
              </div>
              <p>
                <span>Brand:</span>
                {nihLabelInfo?.brandName}
              </p>
              {/* <h4>Ingredients</h4>
              {nihLabelInfo?.ingredientRows?.map((item, key) => {
                return (
                  <React.Fragment key={key}>
                    <div className="ingredient-li">
                      <p>{item?.name}</p>
                    </div>
                  </React.Fragment>
                );
              })}
              {nihLabelInfo?.otheringredients?.ingredients?.map((item, key) => {
                return (
                  <React.Fragment key={key}>
                    <div className="ingredient-li">
                      <p>{item?.name}</p>
                    </div>
                  </React.Fragment>
                );
              })} */}
              {/* <button onClick={() => handleSearch("NIH")}>
                Search Ingredients In COA Text
              </button> */}
            </>
          ) : (
            <p>Please select NIH Label from above list.</p>
          )}
        </div>
      </div>

      {/* {coaText && (
        <div className="coa-text-result">
          <h3>COA Text</h3>
          <div>
            {coaText?.pages?.map((page, key) => {
              return (
                <div key={key} className="coa-page">
                  <p>
                    <span>Page No:</span>
                    {page?.pageNumber}
                  </p>
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
      )} */}

      <div className="table-comparision">
        <h3>Ingredients Comparision</h3>
        <table border={1}>
          <thead>
            <tr className="table-row">
              <th>HealthLOQ Ingredients</th>
              <th>COA Ingredients</th>
              <th>NIH Ingredients</th>
            </tr>
          </thead>
          <tbody>
            {[
              ...Array(
                Math.max(
                  ingredients.coa?.length || 0,
                  ingredients.nih?.length || 0,
                  ingredients.healthloq?.length || 0
                )
              ),
            ]?.map((el, index) => {
              return (
                <tr className="table-row" key={index}>
                  <td>{ingredients?.healthloq?.[index]}</td>
                  <td>{ingredients?.coa?.[index]}</td>
                  <td>{ingredients?.nih?.[index]}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="table-comparision">
        <h3>COA Ingredients Detail Analysis</h3>
        {documentAiCoaResult?.data?.pages?.map((page, key) => {
          return page?.tables?.map((table, tableKey) => {
            return (
              <table border={1} key={tableKey}>
                <thead>
                  <tr className="table-row">
                    {table?.columns?.map((column, columnKey) => {
                      return <th key={columnKey}>{column}</th>;
                    })}
                  </tr>
                </thead>
                <tbody>
                  {table?.rows?.map((row, rowKey) => {
                    return (
                      <tr className="table-row" key={rowKey}>
                        {row?.map((str, strKey) => {
                          return <td key={strKey}>{str}</td>;
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            );
          });
        })}
      </div>

      <div className="table-comparision">
        <h3>NIH Ingredients Detail Analysis</h3>
        <table border={1}>
          <thead>
            <tr className="table-row">
              <th>Ingredient</th>
              <th>Amount per Serving</th>
            </tr>
          </thead>
          <tbody>
            {nihLabelInfo?.ingredientRows?.map((item, key) => {
              return (
                <tr key={key}>
                  <td>{`${item?.name} ${
                    item?.forms?.length
                      ? `(${item?.forms?.reduce(
                          (str, form, i, arr) =>
                            `${str}${form?.name}${
                              i !== arr?.length - 1 ? ", " : ""
                            }`,
                          ""
                        )})`
                      : ""
                  }`}</td>
                  <td>{`${item?.quantity?.[0]?.quantity} ${item?.quantity?.[0]?.unit}`}</td>
                </tr>
              );
            })}
            {nihLabelInfo?.otheringredients?.ingredients?.map((item, key) => {
              return (
                <tr key={key}>
                  <td>{`${item?.name} ${
                    item?.forms?.length
                      ? `(${item?.forms?.reduce(
                          (str, form, i, arr) =>
                            `${str}${form?.name}${
                              i !== arr?.length - 1 ? ", " : ""
                            }`,
                          ""
                        )})`
                      : ""
                  }`}</td>
                  <td>
                    {Boolean(item?.quantity?.length) &&
                      `${item?.quantity?.[0]?.quantity} ${item?.quantity?.[0]?.unit}`}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="table-comparision">
        <h3>Other Details</h3>
        <table border={1}>
          <thead>
            <tr className="table-row">
              <th>HealthLOQ Other Details</th>
              <th>COA Other Details</th>
              <th>NIH Other Details</th>
            </tr>
          </thead>
          <tbody>
            {[
              ...Array(
                Math.max(
                  otherDetails.coa?.length || 0,
                  otherDetails.nih?.length || 0,
                  otherDetails.healthloq?.length || 0
                )
              ),
            ]?.map((el, index) => {
              return (
                <tr className="table-row" key={index}>
                  <td className="table-td">
                    <span>
                      {otherDetails?.healthloq?.[index]?.key?.toLowerCase()}
                      {otherDetails?.healthloq?.[index] && ":"}
                    </span>
                    {otherDetails?.healthloq?.[index]?.value}
                  </td>
                  <td className="table-td">
                    <span>
                      {otherDetails?.coa?.[index]?.key?.toLowerCase()}
                      {otherDetails?.coa?.[index] &&
                        !otherDetails?.coa?.[index]?.key?.includes(":") &&
                        ":"}
                    </span>
                    {otherDetails?.coa?.[index]?.value}
                  </td>
                  <td className="table-td">
                    <span>
                      {otherDetails?.nih?.[index]?.key?.toLowerCase()}
                      {Boolean(otherDetails?.nih?.[index]?.value) && ":"}
                    </span>
                    {otherDetails?.nih?.[index]?.value}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const mapStateToProps = ({
  nihReducer: {
    nihLabelInfo,
    batchInfo,
    documentAiCoaResult,
    activeNIHProductId,
  },
}) => ({
  nihLabelInfo,
  batchInfo,
  documentAiCoaResult,
  activeNIHProductId,
});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProductDetailComparision);
