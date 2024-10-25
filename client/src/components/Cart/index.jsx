import { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { idbPromise } from "../../utils/helpers";
import CartItem from "../CartItem";
import Auth from "../../utils/auth";
import { useStoreContext } from "../../utils/GlobalState";
import { TOGGLE_CART, ADD_MULTIPLE_TO_CART } from "../../utils/actions";
import "./index.css";
import cartImg from "../../assets/images/menuBtns/cart.png";

const Cart = () => {
  const [state, dispatch] = useStoreContext();
  const navigate = useNavigate();

  const cartRef = useRef();

  useEffect(() => {
    async function getCart() {
      const cart = await idbPromise("cart", "get");
      dispatch({ type: ADD_MULTIPLE_TO_CART, products: [...cart] });
    }

    if (!state.cart.length) {
      getCart();
    }
  }, [state.cart.length, dispatch]);

  function toggleCart() {
    dispatch({ type: TOGGLE_CART });
  }

  function calculateTotal() {
    let sum = 0;
    state.cart.forEach((item) => {
      sum += item.price * item.purchaseQuantity;
    });
    return sum.toFixed(2);
  }

  function submitCheckout() {
    navigate("/checkout");
    toggleCart();
  }

  function handleClickOutside(event) {
    if (cartRef.current && !cartRef.current.contains(event.target)) {
      toggleCart();
    }
  }

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!state.cartOpen) {
    return (
      <div className="cart-closed" onClick={toggleCart}>
        <span role="img" aria-label="trash">
          <img className="cartImg" src={cartImg} alt="Cart" />
        </span>
      </div>
    );
  }

  return (
    <div className="cart" ref={cartRef}>
      <div className="close" onClick={toggleCart}>
        <img src={cartImg} alt="Cart" />
      </div>
      <h2>Shopping Cart</h2>
      {state.cart.length ? (
        <div>
          {state.cart.map((item) => (
            <CartItem key={item._id} item={item} />
          ))}

          <div className="flex-column total">
            <strong>Total: ${calculateTotal()}</strong>

            {Auth.loggedIn() ? (
              <button onClick={submitCheckout}>Checkout</button>
            ) : (
              <Link to="/login" onClick={toggleCart}>
                Log in to check out!
              </Link>
            )}
          </div>
        </div>
      ) : (
        <h3>
          <span role="img" aria-label="shocked">
            😱
          </span>
          You haven't added anything to your cart yet!
        </h3>
      )}
    </div>
  );
};

export default Cart;
