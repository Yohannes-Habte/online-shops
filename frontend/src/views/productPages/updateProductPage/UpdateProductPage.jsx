import { useParams } from "react-router-dom";
import "./UpdateProductPage.scss";
import UpdateProductForm from "../../../components/shop/updateProduct/UpdateProductForm";

const UpdateProductPage = () => {
  const { id } = useParams();
  return (
    <main className="update-product-page">
      <section className="update-product-page-container">
        <h1 className="update-product-page-title">Update Product</h1>

        <UpdateProductForm productId={id} />
      </section>
    </main>
  );
};

export default UpdateProductPage;
