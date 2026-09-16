import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProduct } from "../api/products";
import { useCart } from "../context/CartContext";
import Footer from "../components/Footer";
import logo from "../assets/logo-transparent.png";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, updateQty, items } = useCart();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");
  const [added, setAdded] = useState(false);

  const getQty = (productId) => {
    const item = items.find((i) => i._id === productId);
    return item ? item.qty : 0;
  };

  useEffect(() => {
    getProduct(id)
      .then((res) => setProduct(res.data))
      .catch(() => setError("Product not found"));
  }, [id]);

  const handleAdd = () => {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  if (error) {
    return (
      <div className="detail-page">
        <p className="detail-error">{error}</p>
        <button className="back-btn" onClick={() => navigate("/products")}>← Back to Products</button>
      </div>
    );
  }

  if (!product) {
    return <div className="detail-page"><p>Loading...</p></div>;
  }

  return (
    <div className="detail-page">
      <header className="detail-header">
        <button className="back-btn" onClick={() => navigate("/products")}>← Back</button>
        <img src={logo} alt="The Cracker City" className="detail-logo" />
      </header>

      <div className="detail-content">
        <img src={product.image_url} alt={product.name} className="detail-image" />

        <div className="detail-info">
          <h1>{product.name}</h1>
          <p className="detail-price">₹{product.price}</p>
          <p className="detail-desc">{product.description}</p>
          <p className="detail-stock">
            {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
          </p>

          {getQty(product._id) === 0 ? (
            <button
              className="detail-add-btn"
              onClick={handleAdd}
              disabled={product.stock <= 0}
            >
              {added ? "Added ✓" : "Add to Cart"}
            </button>
          ) : (
            <div className="detail-qty-stepper">
              <button onClick={() => updateQty(product._id, getQty(product._id) - 1)}>−</button>
              <span>{getQty(product._id)}</span>
              <button onClick={() => updateQty(product._id, getQty(product._id) + 1)}>+</button>
            </div>
          )}
        </div>
      </div>

      <Footer />

      <style>{`
        * { box-sizing: border-box; }
        .detail-page {
          min-height: 100vh;
          background: #ffffff;
          font-family: 'Segoe UI', system-ui, sans-serif;
          padding: 16px;
        }
        .detail-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        .detail-logo {
          height: 36px;
          width: auto;
        }
        .back-btn {
          background: none;
          border: none;
          font-size: 15px;
          color: #16161f;
          cursor: pointer;
        }
        .detail-error {
          color: #c23a3a;
          font-size: 15px;
          margin-bottom: 12px;
        }
        .detail-content {
          display: flex;
          flex-direction: column;
          gap: 16px;
          max-width: 480px;
          margin: 0 auto;
        }
        .detail-image {
          width: 100%;
          border-radius: 14px;
          object-fit: contain;
          max-height: 320px;
          background: #f9f9fa;
        }
        .detail-info h1 {
          font-size: 22px;
          color: #16161f;
          margin: 0 0 8px;
        }
        .detail-price {
          font-size: 22px;
          font-weight: 700;
          color: #E8794E;
          margin: 0 0 12px;
        }
        .detail-desc {
          font-size: 15px;
          color: #4a4a55;
          line-height: 1.5;
          margin: 0 0 12px;
        }
        .detail-stock {
          font-size: 13px;
          color: #6b6b7b;
          margin: 0 0 20px;
        }
        .detail-add-btn {
          width: 100%;
          padding: 14px;
          background: #16161f;
          color: #fff;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          font-size: 15px;
          font-weight: 600;
        }
        .detail-add-btn:hover:not(:disabled) { background: #E8794E; }
        .detail-add-btn:disabled { opacity: 0.5; cursor: default; }
        .detail-qty-stepper {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #16161f;
          border-radius: 10px;
          padding: 10px 8px;
        }
        .detail-qty-stepper button {
          background: none;
          border: none;
          color: #fff;
          font-size: 20px;
          width: 40px;
          height: 40px;
          cursor: pointer;
          border-radius: 8px;
        }
        .detail-qty-stepper button:hover {
          background: #E8794E;
        }
        .detail-qty-stepper span {
          color: #fff;
          font-size: 16px;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
}