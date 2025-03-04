import {
  UPDATE_PRODUCTS,
  ADD_TO_CART,
  UPDATE_CART_QUANTITY,
  REMOVE_FROM_CART,
  ADD_MULTIPLE_TO_CART,
  UPDATE_CATEGORIES,
  UPDATE_CURRENT_CATEGORY,
  CLEAR_CART,
  TOGGLE_CART,
  SET_STRIPE_PAYMENT_INTENT_ID,
  VERIFY_CART_ITEMS,
} from "./actions";
import { idbPromise } from "./helpers";

export const reducer = (state, action) => {
  switch (action.type) {
    case UPDATE_PRODUCTS:
      return {
        ...state,
        products: [...action.products],
      };

    case VERIFY_CART_ITEMS:
      return {
        ...state,
        cart: Array.isArray(action.payload) ? [...action.payload] : state.cart,
      };

    case ADD_TO_CART:
      return {
        ...state,
        cartOpen: false,
        cart: [...state.cart, action.product],
      };

    case SET_STRIPE_PAYMENT_INTENT_ID:
      return {
        ...state,
        stripePaymentIntentId: action.payload,
      };

    case ADD_MULTIPLE_TO_CART:
      return {
        ...state,
        cart: [...state.cart, ...action.products],
      };

    case UPDATE_CART_QUANTITY:
      return {
        ...state,
        cartOpen: true,
        cart: state.cart.map((product) => {
          if (action._id === product._id) {
            product.purchaseQuantity = action.purchaseQuantity;
          }
          return product;
        }),
      };

    case REMOVE_FROM_CART:
      let newState = state.cart.filter((product) => {
        return product._id !== action._id;
      });

      return {
        ...state,
        cartOpen: newState.length > 0,
        cart: newState,
      };

    case CLEAR_CART:
      idbPromise("cart", "clear");
      const newestState = {
        ...state,
        cartOpen: false,
        cart: [],
      };
      return newestState;

    case TOGGLE_CART:
      return {
        ...state,
        cartOpen: !state.cartOpen,
      };

    case UPDATE_CATEGORIES:
      return {
        ...state,
        categories: [...action.categories],
      };

    case UPDATE_CURRENT_CATEGORY:
      return {
        ...state,
        currentCategory: action.currentCategory,
      };

    default:
      return state;
  }
};
