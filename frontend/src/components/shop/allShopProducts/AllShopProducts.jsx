import { useEffect, useCallback } from "react";
import "./AllShopProducts.scss";
import { AiOutlineDelete, AiOutlineEye } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import { toast } from "react-toastify";
import moment from "moment";
import {
  deleteProductFromAll,
  fetchProductsByShop,
} from "../../../redux/actions/product";
import { clearProductErrors } from "../../../redux/reducers/productReducer";

const AllShopProducts = () => {
  const dispatch = useDispatch();

  const { currentSeller } = useSelector((state) => state.seller);
  const { loading, shopProducts, error } = useSelector(
    (state) => state.product
  );

  useEffect(() => {
    if (currentSeller) {
      dispatch(fetchProductsByShop());
    } else {
      toast.error("You must be logged in as a seller.");
    }

    return () => {
      dispatch(clearProductErrors());
    };
  }, [dispatch, currentSeller]);

  console.log("shopProducts", shopProducts);

  // ======================================================================
  // ✅ Handle product deletion
  // ======================================================================
  const handleProductDelete = useCallback(
    async (productId) => {
      if (!productId) {
        console.error("Invalid product ID:", productId);
        toast.error("Invalid product ID.");
        return;
      }

      const isConfirmed = window.confirm(
        "Are you sure you want to delete this product?"
      );
      if (!isConfirmed) return;

      try {
        await dispatch(deleteProductFromAll(productId));
        toast.success("Product deleted successfully!");

        // Refresh product list
        dispatch(fetchProductsByShop());
      } catch (error) {
        console.error("Error deleting product:", error);
        toast.error("Failed to delete product. Please try again.");
      }
    },
    [dispatch]
  );

  // ✅ Define table columns
  const columns = [
    {
      field: "createdAt",
      headerName: "Date",
      minWidth: 180,
      flex: 0.8,
      valueFormatter: (params) => moment(params?.value).format("DD-MM-YYYY"),
    },
    { field: "id", headerName: "Product ID", minWidth: 150, flex: 0.7 },
    { field: "title", headerName: "Name", minWidth: 180, flex: 1.4 },
    { field: "price", headerName: "Price", minWidth: 100, flex: 0.6 },
    {
      field: "stock",
      headerName: "Stock",
      type: "number",
      minWidth: 80,
      flex: 0.5,
    },
    {
      field: "soldOut",
      headerName: "Sold",
      type: "number",
      minWidth: 130,
      flex: 0.6,
    },
    {
      field: "Preview",
      headerName: "Preview",
      minWidth: 100,
      flex: 0.8,
      sortable: false,
      renderCell: (params) => (
        <Link to={`/products/${params.row.id}`} className="product-icon-btn">
          <AiOutlineEye size={20} />
        </Link>
      ),
    },
    {
      field: "Delete",
      headerName: "Delete",
      minWidth: 120,
      flex: 0.8,
      sortable: false,
      renderCell: (params) => (
        <button
          onClick={() => handleProductDelete(params.row.id)}
          className="delete-icon-btn"
        >
          <AiOutlineDelete size={20} />
        </button>
      ),
    },
  ];

  // Format product data for the table
  const rows =
    shopProducts?.map((product) => {
      const totalStock = product.variants?.reduce(
        (sum, variant) =>
          sum +
          variant.productSizes.reduce(
            (sizeSum, size) => sizeSum + size.stock,
            0
          ),
        0
      );

      return {
        id: product._id,
        createdAt: product?.createdAt,
        title: product?.title,
        price: `$ ${product?.discountPrice}`,
        stock: totalStock,
        soldOut: product?.soldOut || 0,
      };
    }) || [];

  return (
    <section className="all-shop-products-wrapper">
      <h1 className="title">{currentSeller?.name} Shop</h1>

      {loading ? (
        <p>Loading products...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : rows.length > 0 ? (
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={10}
          disableSelectionOnClick
          autoHeight
        />
      ) : (
        <p>No products found.</p>
      )}
    </section>
  );
};

export default AllShopProducts;
