import { useState, useEffect } from "react";
import { getProducts } from "../api/products";

const CATEGORIES = ["Aerial", "Ground", "Sound/Blast", "Sparklers & Fountains"];

export default function Products() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getProducts();
        setProducts(res.data);
      } catch {
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const grouped = CATEGORIES.map((cat) => ({
    name: cat,
    items: products.filter(
      (p) => (p.category || "").trim().toLowerCase() === cat.toLowerCase()
    ),
  }));

  const uncategorized = products.filter(
    (p) =>
      !CATEGORIES.some(
        (cat) => (p.category || "").trim().toLowerCase() === cat.toLowerCase()
      )
  );

  return (
    <div className="products-page">
      <header className="products-header">
        <h1>Fireworks</h1>
      </header>

      {loading && <p className="status-text">Loading products...</p>}
      {error && <p className="status-text error">{error}</p>}

      {!loading && !error && products.length === 0 && (
        <p className="status-text">No products yet — check back soon.</p>
      )}

      {grouped.map(
        (section) =>
          section.items.length > 0 && (
            <section key={section.name} className="category-section">
              <h2>{section.name}</h2>
              <div className="product-grid">
                {section.items.map((p) => (
                  <ProductCard key={p._id} product={p} />
                ))}
              </div>
            </section>
          )
      )}

      {uncategorized.length > 0 && (
        <section className="category-section">
          <h2>Other</h2>
          <div className="product-grid">
            {uncategorized.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </section>
      )}

      <style>{`
        * { box-sizing: border-box; }
        .products-page {
          min-height: 100vh;
          background: #fffaf5;
          font-family: 'Segoe UI', system-ui, sans-serif;
          padding: 24px;
        }
        .products-header {
          margin-bottom: 24px;
        }
        .products-header h1 {
          font-size: 26px;
          color: #16161f;
          margin: 0;
        }
        .status-text {
          color: #6b6b7b;
          font-size: 14px;
        }
        .status-text.error {
          color: #c23a3a;
        }
        .category-section {
          margin-bottom: 36px;
        }
        .category-section h2 {
          font-size: 19px;
          color: #16161f;
          border-bottom: 2px solid #E8794E;
          display: inline-block;
          padding-bottom: 4px;
          margin-bottom: 16px;
        }
        .product-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: 16px;
        }
        .product-card {
          border: 1.5px solid #e2e2e8;
          border-radius: 10px;
          padding: 12px;
          background: #ffffff;
          text-align: left;
        }
        .product-card img {
          width: 100%;
          height: 120px;
          object-fit: cover;
          border-radius: 6px;
          margin-bottom: 8px;
          background: #f1f1f4;
        }
        .product-card h3 {
          font-size: 14px;
          color: #16161f;
          margin: 0 0 4px;
        }
        .product-card .price {
          font-weight: 700;
          color: #E8794E;
          margin: 0 0 2px;
          font-size: 14px;
        }
        .product-card .stock {
          font-size: 12px;
          color: #6b6b7b;
          margin: 0;
        }
        .product-card .out-of-stock {
          color: #c23a3a;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
}

function ProductCard({ product }) {
  return (
    <div className="product-card">
      <img
        src={product.image_url}
        alt={product.name}
        onError={(e) => (e.target.style.display = "none")}
      />
      <h3>{product.name}</h3>
      <p className="price">₹{product.price}</p>
      <p className={`stock ${product.stock === 0 ? "out-of-stock" : ""}`}>
        {product.stock === 0 ? "Out of stock" : `Stock: ${product.stock}`}
      </p>
    </div>
  );
}