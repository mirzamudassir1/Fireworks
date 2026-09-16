import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getProducts } from "../api/products";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { CATEGORIES } from "../constants/categories";
import Footer from "../components/Footer";
import logo from "../assets/logo-transparent.png";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const { addToCart, updateQty, items, totalCount } = useCart();
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    getProducts()
      .then((res) => setProducts(res.data))
      .catch(() => setError("Failed to load products"));
  }, []);

  const getQty = (productId) => {
    const item = items.find((i) => i._id === productId);
    return item ? item.qty : 0;
  };

  const query = search.trim().toLowerCase();

  const filteredProducts = query
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          (p.category || "").toLowerCase().includes(query)
      )
    : products;

  // Only show categories that actually have at least one matching product
  const groupedCategories = CATEGORIES.filter((cat) =>
    filteredProducts.some((p) => p.category === cat)
  );

  return (
    <div className="shop-page">
      <header className="shop-header">
        <img src={logo} alt="The Cracker City" className="shop-logo" />
        <div className="header-actions">
          <button className="cart-btn" onClick={() => navigate("/cart")}>
            🛒 Cart {totalCount > 0 && <span className="badge">{totalCount}</span>}
          </button>
          <button className="logout-btn" onClick={logout}>Log out</button>
        </div>
      </header>

      <input
        type="text"
        className="search-bar"
        placeholder="Search by product name or category..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {error && <p className="shop-error">{error}</p>}

      {query && groupedCategories.length === 0 && (
        <p className="no-results">No products match "{search}"</p>
      )}

      {groupedCategories.map((category) => (
        <section key={category} className="category-section">
          <h2 className="category-title">{category}</h2>
          <div className="product-grid">
            {filteredProducts
              .filter((p) => p.category === category)
              .map((p) => (
                <div key={p._id} className="product-card">
                  <div onClick={() => navigate(`/products/${p._id}`)} style={{ cursor: "pointer" }}>
                    <img src={p.image_url} alt={p.name} loading="lazy" onError={(e) => (e.target.style.display = "none")} />
                    <h3>{p.name}</h3>
                    <p className="desc">{p.description}</p>
                    <p className="price">₹{p.price}</p>
                  </div>

                  {getQty(p._id) === 0 ? (
                    <button className="add-btn" onClick={() => addToCart(p)}>Add to Cart</button>
                  ) : (
                    <div className="qty-stepper">
                      <button onClick={() => updateQty(p._id, getQty(p._id) - 1)}>−</button>
                      <span>{getQty(p._id)}</span>
                      <button onClick={() => updateQty(p._id, getQty(p._id) + 1)}>+</button>
                    </div>
                  )}
                </div>
              ))}
          </div>
        </section>
      ))}

      <Footer />

      <style>{`
        * { box-sizing: border-box; }
        .shop-page {
          min-height: 100vh;
          background: #ffffff;
          font-family: 'Segoe UI', system-ui, sans-serif;
          padding: 16px;
        }
        .shop-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
          flex-wrap: wrap;
          gap: 10px;
        }
        .shop-logo {
          height: 44px;
          width: auto;
        }
        .header-actions {
          display: flex;
          gap: 8px;
        }
        .cart-btn {
          position: relative;
          padding: 8px 14px;
          background: #fff6ec;
          border: 1.5px solid #F2A65A;
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
          color: #16161f;
        }
        .badge {
          background: #E8794E;
          color: #fff;
          border-radius: 999px;
          padding: 1px 7px;
          font-size: 11px;
          margin-left: 4px;
        }
        .logout-btn {
          padding: 8px 14px;
          background: #f1f1f4;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
          color: #16161f;
        }
        .search-bar {
          width: 100%;
          padding: 12px 16px;
          font-size: 14px;
          border: 1.5px solid #e2e2e8;
          border-radius: 10px;
          color: #16161f;
          margin-bottom: 20px;
        }
        .search-bar:focus {
          outline: none;
          border-color: #E8794E;
        }
        .shop-error { color: #c23a3a; font-size: 14px; }
        .no-results {
          color: #6b6b7b;
          font-size: 14px;
          text-align: center;
          margin: 24px 0;
        }
        .category-section {
          margin-bottom: 32px;
        }
        .category-title {
          font-size: 17px;
          font-weight: 700;
          color: #16161f;
          margin: 0 0 12px;
          padding-bottom: 8px;
          border-bottom: 2px solid #4b2298;
        }
        .product-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          gap: 14px;
        }
        .product-card {
          border: 1.5px solid #e2e2e8;
          border-radius: 12px;
          padding: 12px;
        }
        .product-card img {
          width: 100%;
          height: 110px;
          object-fit: cover;
          border-radius: 8px;
          margin-bottom: 8px;
        }
        .product-card h3 {
          font-size: 14px;
          color: #16161f;
          margin: 0 0 4px;
        }
        .product-card .desc {
          font-size: 12px;
          color: #6b6b7b;
          margin: 0 0 6px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .product-card .price {
          font-weight: 700;
          color: #E8794E;
          margin: 0 0 8px;
          font-size: 15px;
        }
        .add-btn {
          width: 100%;
          padding: 8px;
          background: #16161f;
          color: #fff;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 13px;
        }
        .add-btn:hover { background: #E8794E; }
        .qty-stepper {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #16161f;
          border-radius: 8px;
          padding: 6px 4px;
        }
        .qty-stepper button {
          background: none;
          border: none;
          color: #fff;
          font-size: 16px;
          width: 28px;
          height: 28px;
          cursor: pointer;
          border-radius: 6px;
        }
        .qty-stepper button:hover {
          background: #E8794E;
        }
        .qty-stepper span {
          color: #fff;
          font-size: 14px;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
}