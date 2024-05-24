import { useStoreContext } from "../../utils/GlobalState";
import { REMOVE_FROM_CART, UPDATE_CART_QUANTITY } from "../../utils/actions";
import { idbPromise } from "../../utils/helpers";
import { useNavigate } from "react-router-dom";

const CartItem = ({ item }) => {
  const [, dispatch] = useStoreContext();
  const navigate = useNavigate();

  const removeFromCart = (item) => {
    dispatch({
      type: REMOVE_FROM_CART,
      _id: item._id,
    });
    idbPromise("cart", "delete", { ...item });
  };

  const onChange = (e) => {
    const value = e.target.value;
    const availableStock = item.stock;
    if (!isNaN(value) && value >= 0 && value <= availableStock) {
      if (value === "0") {
        dispatch({
          type: REMOVE_FROM_CART,
          _id: item._id,
        });
        idbPromise("cart", "delete", { ...item });
      } else {
        dispatch({
          type: UPDATE_CART_QUANTITY,
          _id: item._id,
          purchaseQuantity: parseInt(value),
        });
        idbPromise("cart", "put", {
          ...item,
          purchaseQuantity: parseInt(value),
        });
      }
    }
  };

  const itemNavigation = () => {
    navigate(`/item/${item._id}`);
  };

  return (
    <div className=" cart-container">
      <div className="cart-image">
        <img src={`${item.photo[0]}`} alt="" />
      </div>
      <div className="card-contents">
        <div className="cart-name">
          <a onClick={() => itemNavigation()}>
            <h3>{item.name}</h3>
          </a>
        </div>
        <div className="trash">
          <span
            role="img"
            aria-label="trash"
            onClick={() => removeFromCart(item)}
          >
            Remove
          </span>
        </div>
        <div className="cart-price">
          <span>Price</span>
          <span>${item.price}</span>
        </div>
        <div className="cart-quantity">
          <span>Quantity</span>
          <input
            type="number"
            placeholder="1"
            value={item.purchaseQuantity}
            onChange={onChange}
          />
        </div>
      </div>
    </div>
  );
};

export default CartItem;
