import React from "react";
import "./index.scss";
import { connect } from "react-redux";
import { updateFormFields, getNIHLabelInfo } from "../../redux/NIH/action";
import clsx from "clsx";

export const NIHProductListing = ({
  productListFromNIH,
  updateFormFields,
  activeNIHProductId,
  getNIHLabelInfo,
  selectedProductName,
}) => {
  if (Object.keys(productListFromNIH).length === 1) {
    return null;
  }
  return (
    <div className={"nih-product-list"}>
      <h3>Select NIH Product to Compare With COA</h3>
      <div>
        {productListFromNIH?.hits?.length ? (
          productListFromNIH?.hits?.map((item, key) => {
            return (
              <div
                key={key}
                className={clsx(
                  "nih-product-li",
                  activeNIHProductId === item?._id && "active"
                )}
                onClick={() => {
                  updateFormFields({
                    key: "activeNIHProductId",
                    value: item?._id,
                  });
                  getNIHLabelInfo({
                    id: item?._id,
                  });
                }}
              >
                <div>
                  <h4>{item?._source?.fullName}</h4>
                  <p>
                    <span>Brand:</span>
                    {item?._source?.brandName}
                  </p>
                  <p>
                    <span>Net Contents:</span>
                    {item?._source?.netContents[0]?.display}
                  </p>
                  {item?._source?.events?.map((event, eventKey) => {
                    return (
                      <p key={eventKey}>
                        <span>{event?.type}:</span>
                        {event?.date}
                      </p>
                    );
                  })}
                </div>
                <div>
                  <img
                    src={`https://s3-us-gov-west-1.amazonaws.com/cg-355fa78b-864d-4a44-b287-0369f11f024a/pdf/thumbnails/${item?._id}.jpg`}
                    alt={item?._source?.fullName}
                  />
                </div>
              </div>
            );
          })
        ) : (
          <p>
            We are not able to find any Label with name&nbsp;
            <b>{selectedProductName}</b>
            &nbsp;from NIH Database
          </p>
        )}
      </div>
    </div>
  );
};

const mapStateToProps = ({
  nihReducer: { productListFromNIH, activeNIHProductId, selectedProductName },
}) => ({
  productListFromNIH,
  activeNIHProductId,
  selectedProductName,
});

const mapDispatchToProps = {
  updateFormFields,
  getNIHLabelInfo,
};

export default connect(mapStateToProps, mapDispatchToProps)(NIHProductListing);
