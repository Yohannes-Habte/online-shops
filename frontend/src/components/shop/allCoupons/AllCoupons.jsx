import axios from 'axios';
import React, { useEffect, useState } from 'react';
import './AllCoupons.scss';
import { DataGrid } from '@mui/x-data-grid';
import { AiOutlineDelete } from 'react-icons/ai';
import { RxCross1 } from 'react-icons/rx';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { MdEmojiEvents } from 'react-icons/md';
import { API } from '../../../utils/security/secreteKey';

const AllCoupons = () => {
  // Global state variables
  const { currentSeller } = useSelector((state) => state.seller);
  const { products } = useSelector((state) => state.product);
  const dispatch = useDispatch();

  // Local state variables
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [percent, setPercent] = useState(null);
  const [minAmount, setMinAmout] = useState(null);
  const [maxAmount, setMaxAmount] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [coupouns, setCoupouns] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  // local state variables
  const [shopProducts, setShopProducts] = useState([]);

  // Display products for a single shop
  useEffect(() => {
    const shopProducts = async () => {
      try {
        // dispatch(productsShopFetchStart());
        const { data } = await axios.get(
          `${API}/products/${currentSeller._id}/shop-products`
        );
        // dispatch(productsShopFetchSuccess(data));
        setShopProducts(data.products);
      } catch (error) {
        console.log(error);
        // dispatch(productsShopFetchFailure(error.response.data.message));
      }
    };
    shopProducts();
  }, [dispatch]);

  // Display coupon data
  useEffect(() => {
    const fechtCoupons = async () => {
      try {
        setIsLoading(true);

        const { data } = await axios.get(
          `${API}/coupons/shop/${currentSeller._id}`
        );
        setIsLoading(false);
        setCoupouns(data.coupons);
      } catch (error) {
        setIsLoading(false);
        toast.error(error.response.data.message);
      }
    };
    fechtCoupons();
  }, []);

  // Reset
  const reset = () => {
    setName('');
    setPercent(null);
    setMinAmout(null);
    setMaxAmount(null);
    setSelectedProduct(null);
    setIsLoading(false);
    setSuccess(false);
  };
  // Delete coupon
  const handleDelete = async (couponID) => {
    try {
      setIsLoading(true);
      setSuccess(false);

      const { data } = await axios.delete(`${API}/coupons/${couponID}`);
      setIsLoading(false);
      setSuccess(true);
      toast.success(data);

      window.location.reload();
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);

      const newCoupon = {
        name: name,
        minAmount: minAmount,
        maxAmount: maxAmount,
        selectedProduct: selectedProduct,
        percent: percent,
        shopId: currentSeller._id,
      };

      const { data } = await axios.post(
        `${API}/coupons/create-coupon`,
        newCoupon
      );

      toast.success('Coupon code created successfully!');
      reset();
      setOpen(false);
      window.location.reload();
    } catch (error) {
      setIsLoading(false);
      toast.error(error.response.data.message);
    }
  };

  const columns = [
    { field: 'id', headerName: 'Id', minWidth: 150, flex: 0.7 },
    {
      field: 'name',
      headerName: 'Coupon Code',
      minWidth: 100,
      flex: 1.4,
    },
    {
      field: 'percent',
      headerName: 'Percent',
      minWidth: 100,
      flex: 0.6,
    },
    {
      field: 'Delete',
      headerName: 'Delete',
      flex: 0.8,
      minWidth: 120,
      type: 'number',
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <button onClick={() => handleDelete(params.id)}>
              <AiOutlineDelete size={20} />
            </button>
          </>
        );
      },
    },
  ];

  const row = [];

  coupouns &&
    coupouns.forEach((item) => {
      row.push({
        id: item._id,
        name: item.name,
        percent: item.percent + ' %',
        sold: 10,
      });
    });

  return (
    <React.Fragment>
      {isLoading ? (
        <p>loading..</p>
      ) : (
        <section className="coupons-wrapper">
          <article className="create-coupon-header">
            <h2 className="subTitle"> Create Coupon Code</h2>
            <button onClick={() => setOpen(true)} className="add-coupon-btn">
              Create Code
            </button>
          </article>

          {/* Coupon codes table */}
          <DataGrid
            rows={row}
            columns={columns}
            pageSize={10}
            disableSelectionOnClick
            autoHeight
          />
          {open && (
            <article className="create-coupon-code-form-wrapper">
              <form
                onSubmit={handleSubmit}
                aria-required={true}
                className="form"
              >
                <h5 className="subTitle">Create Coupon code</h5>
                <RxCross1
                  className="close-icon"
                  onClick={() => setOpen(false)}
                />
                {/*  coupon code name */}
                <div className="input-container">
                  <MdEmojiEvents className="icon" />
                  <input
                    type="text"
                    name="name"
                    id="name"
                    autoComplete="name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter Coupon Name"
                    className="input-field"
                  />
                  <label htmlFor="name" className="input-label">
                    Coupon Code Name
                  </label>
                  <span className="input-highlight"></span>
                </div>

                {/*   Discount Percentenge */}
                <div className="input-container">
                  <MdEmojiEvents className="icon" />
                  <input
                    type="number"
                    name="percent"
                    id="percent"
                    autoComplete="percent"
                    required
                    value={percent}
                    onChange={(e) => setPercent(e.target.value)}
                    placeholder="Enter Discount Percentenge"
                    className="input-field"
                  />
                  <label htmlFor="percent" className="input-label">
                    Discount Percentenge
                  </label>
                  <span className="input-highlight"></span>
                </div>

                {/* Enter coupon code min amount */}
                <div className="input-container">
                  <MdEmojiEvents className="icon" />
                  <input
                    type="number"
                    name="minAmount"
                    id="minAmount"
                    autoComplete="minAmount"
                    required
                    value={minAmount}
                    onChange={(e) => setMinAmout(e.target.value)}
                    placeholder="Enter coupon min amount"
                    className="input-field"
                  />
                  <label htmlFor="minAmount" className="input-label">
                    Min Amount
                  </label>
                  <span className="input-highlight"></span>
                </div>

                {/* Enter coupon code maximum amount */}
                <div className="input-container">
                  <MdEmojiEvents className="icon" />
                  <input
                    type="number"
                    name="maxAmount"
                    id="maxAmount"
                    autoComplete="maxAmount"
                    required
                    value={maxAmount}
                    onChange={(e) => setMaxAmount(e.target.value)}
                    placeholder="Enter coupon max amount"
                    className="input-field"
                  />
                  <label htmlFor="maxAmount" className="input-label">
                    Max Amount
                  </label>
                  <span className="input-highlight"></span>
                </div>

                {/* Selected Product */}
                <div className="input-container">
                  <MdEmojiEvents className="icon" />
                  <select
                    type="text"
                    name="selectedProduct"
                    id="selectedProduct"
                    value={selectedProduct}
                    onChange={(e) => setSelectedProduct(e.target.value)}
                    className="input-field"
                  >
                    <option value="default"> Select product</option>

                    {shopProducts &&
                      shopProducts.map((product) => (
                        <option value={product.name} key={product.name}>
                          {product.name}
                        </option>
                      ))}
                  </select>
                  <label htmlFor="selectedProduct" className="input-label">
                    Selected Product
                  </label>
                  <span className="input-highlight"></span>
                </div>

                <button className="coupon-btn"> Submit </button>
              </form>
            </article>
          )}
        </section>
      )}
    </React.Fragment>
  );
};

export default AllCoupons;
