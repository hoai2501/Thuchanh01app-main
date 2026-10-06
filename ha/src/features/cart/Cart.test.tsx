import { configureStore } from "@reduxjs/toolkit";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { describe, expect, it } from "@jest/globals";

import Cart from "./Cart";
import reducer, { addToCart } from "./cartSlice";
import type { Product } from "../products/productsSlice";

const product: Product = {
  id: 7,
  title: "Mouse",
  price: 25,
  image: "/mouse.png",
};

function renderCart(withProduct = false) {
  const store = configureStore({ reducer: { cart: reducer } });
  if (withProduct) store.dispatch(addToCart(product));
  const view = render(
    <Provider store={store}>
      <Cart />
    </Provider>
  );
  return { store, ...view };
}

describe("Cart component", () => {
  it("shows the empty cart message", () => {
    renderCart();
    expect(screen.getByText("Giỏ hàng đang trống")).toBeTruthy();
  });

  it("updates quantity, computes total and removes an item", async () => {
    const user = userEvent.setup();
    const { store } = renderCart(true);

    expect(screen.getByText("Tổng tiền: 25.00 $")).toBeTruthy();
    await user.click(screen.getByRole("button", { name: "+" }));
    expect(screen.getByText("Tổng tiền: 50.00 $")).toBeTruthy();

    await user.click(screen.getByRole("button", { name: "Xóa" }));
    expect(store.getState().cart.items).toEqual([]);
  });
});
