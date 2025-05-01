import { useState } from "react";
import ReturnedItemForm from "../../forms/returnItem/ReturnedItem";
import "./SingleOrderRefundRequest.scss";
import { BadgeDollarSign } from "lucide-react";

const SingleOrderRefundRequest = ({ order }) => {
  const [openRefundForm, setOpenRefundForm] = useState(false);

  return (
    <section className="shop-order-refund-request-container">
      <h2 className="shop-order-refund-request-title">
        <BadgeDollarSign size={22} /> Refund Request
      </h2>
      {order?.refundRequests?.map((refund) => (
        <article
          key={refund?.refundRequestId}
          className="shop-order-refund-request-details-wrapper"
        >
          <div className="shop-order-refund-request-infos">
            <aside className="shop-order-refund-request-info-left">
              <p className="refund-request-info">
                <strong>Refund Request On:</strong>{" "}
                <span className="request-on-for">
                  {refund?.requestedDate?.slice(0, 10)}
                </span>
              </p>

              <p className="refund-request-info">
                <strong>Product ID:</strong> {refund?.product}
              </p>

              <p className="refund-request-info">
                <strong>Refund ID:</strong> {refund?.refundRequestId}
              </p>

              <p className="refund-request-info">
                <strong>Product Color:</strong> {refund?.productColor}
              </p>

              <p className="refund-request-info">
                <strong>Email:</strong> {refund?.email}
              </p>

              <p className="refund-request-info">
                <strong>Processed By:</strong> {refund?.processedBy}
              </p>
            </aside>

            <aside className="shop-order-refund-request-info-right">
              <p className="refund-request-info">
                <strong>Product Size:</strong> {refund?.productSize}
              </p>

              <p className="refund-request-info">
                <strong>Product Quantity:</strong> {refund?.productQuantity}
              </p>

              <p className="refund-request-info">
                <strong>Refund Reason:</strong> {refund?.requestRefundReason}
              </p>

              <h3 className="refund-request-info">
                <strong>Requested Refund Amount:</strong>
                <span className="request-on-for">
                  ${refund?.requestedRefundAmount?.toFixed(2)}{" "}
                  {refund?.currency}
                </span>
              </h3>

              <p className="refund-request-info">
                <strong>Refund Method:</strong> {refund?.method}
              </p>
              <button
                className="return-single-refund-btn"
                onClick={() => setOpenRefundForm(true)}
              >
                Update Return Status
              </button>
            </aside>
            {openRefundForm && (
              <ReturnedItemForm
                order={order?._id}
                processedBy={order?.orderedItems[0]?.shop?._id}
                refundRequest={refund?._id}
                refundRequestId={refund?.refundRequestId}
                refundAmount={refund?.requestedRefundAmount}
                returnedDate={refund?.requestedDate}
                product={refund?.product}
                productColor={refund?.productColor}
                productSize={refund?.productSize}
                requestRefundReason={refund?.requestRefundReason}
                currency={refund?.currency}
                method={refund?.method}
                setOpenRefundForm={setOpenRefundForm}
              />
            )}
          </div>

          {refund?.notes && (
            <>
              <h3 className="user-order-refund-request-info-title">Notes</h3>
              <p className="user-order-refund-request-reason-paragraph">
                {refund?.notes}
              </p>
            </>
          )}

          {refund?.method === "Bank Transfer" && refund?.bankDetails && (
            <div className="bank-transfer-details">
              <h3 className="bank-details-title">Bank Transfer Details</h3>
              <ul className="bank-details-list">
                <li className="bank-details-list-item">
                  <strong className="list-item-strong">Account Holder:</strong>{" "}
                  {refund.bankDetails.accountHolderName}
                </li>

                <li className="bank-details-list-item">
                  <strong className="list-item-strong">Account Number:</strong>{" "}
                  {refund.bankDetails.accountNumber}
                </li>

                <li className="bank-details-list-item">
                  <strong className="list-item-strong">Bank Name:</strong>{" "}
                  {refund.bankDetails.bankName}
                </li>

                <li className="bank-details-list-item">
                  <strong className="list-item-strong">Branch:</strong>{" "}
                  {refund.bankDetails.bankBranch}
                </li>

                <li className="bank-details-list-item">
                  <strong className="list-item-strong">Address:</strong>{" "}
                  {refund.bankDetails.bankAddress}
                </li>

                <li className="bank-details-list-item">
                  <strong className="list-item-strong">Zip Code:</strong>{" "}
                  {refund.bankDetails.bankZipCode}
                </li>

                <li className="bank-details-list-item">
                  <strong className="list-item-strong">City:</strong>{" "}
                  {refund.bankDetails.bankCity}
                </li>

                <li className="bank-details-list-item">
                  <strong className="list-item-strong">State:</strong>{" "}
                  {refund.bankDetails.bankState}
                </li>

                <li className="bank-details-list-item">
                  <strong className="list-item-strong">Country:</strong>{" "}
                  {refund.bankDetails.bankCountry}
                </li>

                <li className="bank-details-list-item">
                  <strong className="list-item-strong">SWIFT Code:</strong>{" "}
                  {refund.bankDetails.swiftCode}
                </li>

                <li className="bank-details-list-item">
                  <strong className="list-item-strong">IBAN:</strong>{" "}
                  {refund.bankDetails.IBAN}
                </li>

                <li className="bank-details-list-item">
                  <strong className="list-item-strong">Regional Code:</strong>{" "}
                  {refund.bankDetails.regionalCodes?.codeValue}
                </li>
              </ul>
            </div>
          )}
        </article>
      ))}
    </section>
  );
};

export default SingleOrderRefundRequest;
