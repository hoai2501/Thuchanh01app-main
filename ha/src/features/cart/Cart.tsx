import { useAppDispatch, useAppSelector } from "../../app/hooks";

import {
  removeFromCart,
  updateQuantity,
} from "./cartSlice";

function Cart() {
  const dispatch = useAppDispatch();

  const cartItems = useAppSelector(
    (state) => state.cart.items
  );

  const total = cartItems.reduce<number>(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="cart">
      <h2>Giỏ hàng</h2>

      {cartItems.length === 0 ? (
        <p>Giỏ hàng đang trống</p>
      ) : (
        <>
          {cartItems.map((item) => (
            <div className="cart-item" key={item.id}>
              <img
                src={item.image}
                alt={item.title}
              />

              <div>
                <h3>{item.title}</h3>

                <p>
                  Giá: {item.price} $
                </p>

                <div>
                  <button
                    onClick={() =>
                      dispatch(
                        updateQuantity({
                          id: item.id,
                          quantity: Math.max(
                            1,
                            item.quantity - 1
                          ),
                        })
                      )
                    }
                  >
                    -
                  </button>

                  <span className="quantity">
                    {item.quantity}
                  </span>

                  <button
                    onClick={() =>
                      dispatch(
                        updateQuantity({
                          id: item.id,
                          quantity:
                            item.quantity + 1,
                        })
                      )
                    }
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={() =>
                    dispatch(removeFromCart(item.id))
                  }
                >
                  Xóa
                </button>
              </div>
            </div>
          ))}

          <h3>
            Tổng tiền: {total.toFixed(2)} $
          </h3>
        </>
      )}
    </div>
  );
}

export default Cart;