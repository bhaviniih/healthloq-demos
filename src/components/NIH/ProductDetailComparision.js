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
    }
  }, [batchInfo]);

  useEffect(() => {
    let arr = [];
    if (nihLabelInfo?.ingredientRows?.length) {
      arr = [
        ...arr,
        ...nihLabelInfo?.ingredientRows?.map((item) => item?.name),
      ];
    }
    if (nihLabelInfo?.otheringredients?.ingredients?.length) {
      arr = [
        ...arr,
        ...nihLabelInfo?.otheringredients?.ingredients?.map(
          (item) => item?.name
        ),
      ];
    }
    if (arr?.length) {
      setIngredients((pre) => ({ ...pre, nih: arr }));
    }
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

      <div className="ingredient-comparision-table">
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
