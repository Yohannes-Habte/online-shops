import { useState } from "react";
import "./Address.scss";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { MdDelete } from "react-icons/md";
import NewAddress from "../addressForm/NewAddress";
import { deleteUserAddress } from "../../../redux/actions/user";

const Address = () => {
  const { currentUser, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [openNewAddress, setOpenNewAddress] = useState(false);
  const [addresses, setAddresses] = useState([]);

  useEffect(() => {
    if (currentUser?.addresses) {
      setAddresses(currentUser.addresses);
    }
  }, [currentUser]);


  // Handle delete address
  const handleDelete = async (addressId) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this address?");
    if (isConfirmed) {
      await dispatch(deleteUserAddress(addressId));
  
      // Update the state to remove the deleted address
      setAddresses((prevAddresses) =>
        prevAddresses.filter((address) => address._id !== addressId)
      );
    }
  };
  
  

  return (
    <div className="addresses-wrapper">
      {openNewAddress && <NewAddress setOpenNewAddress={setOpenNewAddress} />}

      <section className="previous-address">
        {error && <h2 className="error"> {error} </h2>}
        <article className="title-add-new-address-wrapper">
          <h2 className="address-title">My Addresses</h2>
          <button
            onClick={() => setOpenNewAddress(true)}
            className="add-new-address-btn"
          >
            Add New Address
          </button>
        </article>

        {/* Table addresses */}

        <table className="table-address">
          <thead className="table-head">
            <tr className="head-row">
              <th className="head-cell"> Address Type</th>
              <th className="head-cell"> Street Name </th>
              <th className="head-cell"> House Number </th>
              <th className="head-cell"> Zip Code </th>
              <th className="head-cell"> City </th>
              <th className="head-cell"> State </th>
              <th className="head-cell"> Country </th>
              <th className="head-cell"> Action</th>
            </tr>
          </thead>
          <tbody className="table-body">
            {addresses &&
              addresses.map((address) => {
                return (
                  <tr key={address._id} className="body-row">
                    <td className="body-cell"> {address.addressType} </td>
                    <td className="body-cell">{address.streetName}</td>
                    <td className="body-cell">{address.houseNumber}</td>
                    <td className="body-cell">{address.zipCode}</td>
                    <td className="body-cell"> {address.city} </td>
                    <td className="body-cell"> {address.state} </td>
                    <td className="body-cell"> {address.country} </td>
                    <td className="body-cell">
                      <MdDelete
                        className="delete-icon"
                        onClick={() => handleDelete(address._id)}
                      />
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>

        {currentUser && currentUser.addresses.length === 0 && (
          <h5 className="subTitle">You do not have any saved address!</h5>
        )}
      </section>
    </div>
  );
};

export default Address;
