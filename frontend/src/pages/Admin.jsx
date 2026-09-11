import { useState, useEffect } from "react";
import { getProducts, createProduct, updateProduct, deleteProduct } from "../api/products";
import { useAuth } from "../context/AuthContext";

const emptyForm = { name: "", description: "", price: "", image_url: "", stock: "", category: "" };

export default function Admin() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const { logout } = useAuth();

  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setError("");
    try {
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", "firework");

      const res = await fetch("https://api.cloudinary.com/v1_1/mzbbbxcj/image/upload", {
        method: "POST",
        body: data,
      });
      const result = await res.json();

      if (!result.secure_url) throw new Error("Upload failed");
      setForm((f) => ({ ...f, image_url: result.secure_url }));
    } catch {
      setError("Image upload failed — try again");
    } finally {
      setUploading(false);
    }
  };

  const loadProducts = async () => {
    try {
      const res = await getProducts();
      setProducts(res.data);
    } catch {
      setError("Failed to load products");
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const payload = {
      ...form,
      price: parseFloat(form.price),
      stock: parseInt(form.stock) || 0,
    };
    try {
      if (editingId) {
        await updateProduct(editingId, payload);
      } else {
        await createProduct(payload);
      }
      setForm(emptyForm);
      setEditingId(null);
      loadProducts();
    } catch (err) {
      setError(err.response?.data?.detail || "Save failed");
    }
  };

  const handleEdit = (product) => {
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      image_url: product.image_url,
      stock: product.stock,
      category: product.category || "",
    });
    setEditingId(product._id);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this product?")) return;
    try {
      await deleteProduct(id);
      loadProducts();
    } catch {
      setError("Delete failed");
    }
  };

  const cancelEdit = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  return (
    <div className="admin-page">
      <header className="admin-header">
        <h1>Admin Dashboard</h1>
        <button onClick={logout} className="logout-btn">Log out</button>
      </header>

      <section className="admin-form-section">
        <h2>{editingId ? "Edit Product" : "Add Product"}</h2>
        <form onSubmit={handleSubmit} className="product-form">
          <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
          <input name="description" placeholder="Description" value={form.description} onChange={handleChange} required />
          <input name="price" type="number" step="0.01" placeholder="Price" value={form.price} onChange={handleChange} required />

          <div className="image-upload-field">
            <label className="upload-btn">
              {uploading ? "Uploading..." : "Choose Photo"}
              <input type="file" accept="image/*" onChange={handleImageUpload} hidden />
            </label>
            {form.image_url && (
              <img src={form.image_url} alt="preview" className="image-preview" />
            )}
          </div>

          <input name="stock" type="number" placeholder="Stock" value={form.stock} onChange={handleChange} />
          <select name="category" value={form.category} onChange={handleChange} required>
  <option value="">Select Category</option>
  <option value="Aerial">Aerial</option>
  <option value="Ground">Ground</option>
  <option value="Sound/Blast">Sound/Blast</option>
  <option value="Sparklers & Fountains">Sparklers & Fountains</option>
</select>

          {error && <p className="admin-error">{error}</p>}

          <div className="form-actions">
            <button type="submit" className="save-btn" disabled={uploading}>
              {editingId ? "Update" : "Add"} Product
            </button>
            {editingId && <button type="button" onClick={cancelEdit} className="cancel-btn">Cancel</button>}
          </div>
        </form>
      </section>

      <section className="admin-list-section">
        <h2>Products ({products.length})</h2>
        <div className="product-grid">
          {products.map((p) => (
            <div key={p._id} className="product-card">
              <img src={p.image_url} alt={p.name} onError={(e) => (e.target.style.display = "none")} />
              <h3>{p.name}</h3>
              <p className="price">₹{p.price}</p>
              <p className="stock">Stock: {p.stock}</p>
              <div className="card-actions">
                <button onClick={() => handleEdit(p)} className="edit-btn">Edit</button>
                <button onClick={() => handleDelete(p._id)} className="delete-btn">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <style>{`
        * { box-sizing: border-box; }
        .admin-page {
          min-height: 100vh;
          background: #ffffff;
          font-family: 'Segoe UI', system-ui, sans-serif;
          padding: 20px;
        }
        .admin-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          flex-wrap: wrap;
          gap: 12px;
        }
        .admin-header h1 {
          font-size: 22px;
          color: #16161f;
          margin: 0;
        }
        .logout-btn {
          padding: 8px 16px;
          background: #f1f1f4;
          color: #16161f;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
        }
        .admin-form-section, .admin-list-section {
          margin-bottom: 32px;
        }
        .admin-form-section h2, .admin-list-section h2 {
          font-size: 17px;
          color: #16161f;
          margin-bottom: 12px;
        }
        .product-form {
          display: flex;
          flex-direction: column;
          gap: 10px;
          max-width: 420px;
        }
        .product-form input {
          padding: 10px 12px;
          font-size: 14px;
          border: 1.5px solid #e2e2e8;
          border-radius: 8px;
          color: #16161f;
          background: #ffffff;
        }
          .product-form select {
  padding: 10px 12px;
  font-size: 14px;
  border: 1.5px solid #e2e2e8;
  border-radius: 8px;
  color: #16161f;
  background: #ffffff;
}
        .product-form input:focus {
          outline: none;
          border-color: #E8794E;
        }
        .image-upload-field {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .upload-btn {
          padding: 8px 16px;
          background: #f1f1f4;
          color: #16161f;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
        }
        .image-preview {
          width: 48px;
          height: 48px;
          object-fit: cover;
          border-radius: 6px;
        }
        .admin-error {
          color: #c23a3a;
          font-size: 14px;
          margin: 0;
        }
        .form-actions {
          display: flex;
          gap: 10px;
        }
        .save-btn {
          padding: 10px 16px;
          background: #E8794E;
          color: #fff;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
        }
        .save-btn:hover { background: #D9663B; }
        .save-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .cancel-btn {
          padding: 10px 16px;
          background: #f1f1f4;
          color: #16161f;
          border: none;
          border-radius: 8px;
          cursor: pointer;
        }
        .product-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
          gap: 14px;
        }
        .product-card {
          border: 1.5px solid #e2e2e8;
          border-radius: 10px;
          padding: 12px;
          text-align: left;
        }
        .product-card img {
          width: 100%;
          height: 100px;
          object-fit: cover;
          border-radius: 6px;
          margin-bottom: 8px;
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
          margin: 0 0 8px;
        }
        .card-actions {
          display: flex;
          gap: 6px;
        }
        .edit-btn, .delete-btn {
          flex: 1;
          padding: 6px;
          font-size: 12px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
        }
        .edit-btn { background: #f1f1f4; color: #16161f; }
        .delete-btn { background: #fbe6e6; color: #c23a3a; }
      `}</style>
    </div>
  );
}