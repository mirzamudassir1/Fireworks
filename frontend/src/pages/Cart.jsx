import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { createOrder } from "../api/orders";
import Footer from "../components/Footer";
import logo from "../assets/logo-transparent.png";

export default function Cart() {
  const { items, removeFromCart, updateQty, totalAmount, clearCart } = useCart();
  const [showPhoneForm, setShowPhoneForm] = useState(false);
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [placing, setPlacing] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handlePhoneChange = (e) => {
    const digitsOnly = e.target.value.replace(/\D/g, "").slice(0, 10);
    setPhone(digitsOnly);
  };

  const isValidPhone = (num) => {
    if (!/^[6-9]\d{9}$/.test(num)) return false; // 10 digits, starts 6-9
    if (/^(\d)\1{9}$/.test(num)) return false;   // reject all-same-digit
    return true;
  };

  const handleCheckoutClick = () => {
    setError("");
    setShowPhoneForm(true);
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError("");

    if (!isValidPhone(phone)) {
      setError("Enter a genuine 10-digit mobile number");
      return;
    }

    setPlacing(true);
    try {
      await createOrder({
        phone,
        items: items.map((i) => ({
          product_id: i._id,
          name: i.name,
          price: i.price,
          qty: i.qty,
        })),
        total: totalAmount,
      });
      clearCart();
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to place order");
    } finally {
      setPlacing(false);
    }
  };

  if (success) {
    return (
      <div className="cart-page">
        <header className="cart-header">
          <img src={logo} alt="The Cracker City" className="cart-logo" />
        </header>
        <div className="success-box">
          <h2>✅ Order placed!</h2>
          <p>We'll contact you on {phone} soon.</p>
          <button className="checkout-btn" onClick={() => navigate("/products")}>
            Continue Shopping
          </button>
        </div>
        <Footer />
        <style>{globalStyles}</style>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <header className="cart-header">
        <button className="back-btn" onClick={() => navigate("/products")}>← Back</button>
        <img src={logo} alt="The Cracker City" className="cart-logo" />
      </header>

      {items.length === 0 ? (
        <p className="empty-msg">Your cart is empty.</p>
      ) : (
        <>
          <div className="bill">
            {items.map((item) => (
              <div key={item._id} className="bill-row">
                <div className="item-info">
                  <p className="item-name">{item.name}</p>
                  <p className="item-unit">₹{item.price} each</p>
                </div>
                <div className="qty-controls">
                  <button onClick={() => updateQty(item._id, item.qty - 1)}>−</button>
                  <span>{item.qty}</span>
                  <button onClick={() => updateQty(item._id, item.qty + 1)}>+</button>
                </div>
                <p className="item-total">₹{(item.price * item.qty).toFixed(2)}</p>
                <button className="remove-btn" onClick={() => removeFromCart(item._id)}>✕</button>
              </div>
            ))}

            <div className="bill-total-row">
              <span>Total</span>
              <span>₹{totalAmount.toFixed(2)}</span>
            </div>
          </div>

          {!showPhoneForm ? (
            <div className="cart-actions">
              <button className="clear-btn" onClick={clearCart}>Clear Cart</button>
              <button className="checkout-btn" onClick={handleCheckoutClick}>Checkout</button>
            </div>
          ) : (
            <form className="phone-form" onSubmit={handlePlaceOrder}>
              <label>Phone number</label>
              <input
                type="tel"
                inputMode="numeric"
                placeholder="10-digit mobile number"
                value={phone}
                onChange={handlePhoneChange}
                maxLength={10}
                required
              />
              {error && <p className="cart-error">{error}</p>}
              <button type="submit" className="checkout-btn" disabled={placing}>
                {placing ? "Placing order…" : "Place Order"}
              </button>
            </form>
          )}
        </>
      )}

      <Footer />

      <style>{globalStyles}</style>
    </div>
  );
}

const globalStyles = `
  * { box-sizing: border-box; }
  .cart-page {
    min-height: 100vh;
    background: #ffffff;
    font-family: 'Segoe UI', system-ui, sans-serif;
    padding: 16px;
  }
  .cart-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 20px;
  }
  .cart-logo {
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
  .empty-msg {
    color: #6b6b7b;
    font-size: 15px;
  }
  .bill {
    border: 1.5px solid #e2e2e8;
    border-radius: 12px;
    padding: 14px;
  }
  .bill-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    padding: 10px 0;
    border-bottom: 1px solid #f0f0f2;
    flex-wrap: wrap;
  }
  .item-info { flex: 1; min-width: 100px; }
  .item-name { font-size: 14px; color: #16161f; margin: 0; font-weight: 600; }
  .item-unit { font-size: 12px; color: #6b6b7b; margin: 2px 0 0; }
  .qty-controls {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .qty-controls button {
    width: 26px;
    height: 26px;
    border: 1px solid #e2e2e8;
    background: #f9f9fa;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
  }
  .item-total {
    font-weight: 700;
    color: #16161f;
    min-width: 60px;
    text-align: right;
    margin: 0;
  }
  .remove-btn {
    background: none;
    border: none;
    color: #c23a3a;
    cursor: pointer;
    font-size: 14px;
  }
  .bill-total-row {
    display: flex;
    justify-content: space-between;
    padding-top: 14px;
    font-size: 17px;
    font-weight: 700;
    color: #16161f;
  }
  .cart-actions {
    display: flex;
    gap: 10px;
    margin-top: 20px;
  }
  .clear-btn {
    flex: 1;
    padding: 12px;
    background: #f1f1f4;
    color: #16161f;
    border: none;
    border-radius: 8px;
    cursor: pointer;
  }
  .checkout-btn {
    flex: 1;
    padding: 12px;
    background: #E8794E;
    color: #fff;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
  }
  .checkout-btn:disabled { opacity: 0.6; cursor: default; }
  .phone-form {
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .phone-form label {
    font-size: 13px;
    font-weight: 600;
    color: #33333f;
  }
  .phone-form input {
    padding: 12px 14px;
    font-size: 15px;
    border: 1.5px solid #e2e2e8;
    border-radius: 8px;
    color: #16161f;
  }
  .phone-form input:focus { outline: none; border-color: #E8794E; }
  .cart-error { color: #c23a3a; font-size: 13px; margin: 0; }
  .success-box {
    text-align: center;
    margin-top: 80px;
  }
  .success-box h2 { color: #16161f; margin-bottom: 8px; }
  .success-box p { color: #6b6b7b; margin-bottom: 24px; }
`;