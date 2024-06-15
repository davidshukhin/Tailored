import { PropsWithChildren, createContext, useContext, useState } from "react";

type CartType = {
    items: string[]; 
    addItem: (id: string) => void;
}

const CartContext = createContext({});

const CartProvider = ({ children }: PropsWithChildren) => {
const [items, setItems] = useState<string[]>([]);

const addItem = (id: string) => {
    setItems((prevItems) => [...prevItems, id]);
    console.log(id);
}

  return (
    <CartContext.Provider
      value={{ items, addItem }}
    >
        {children}
    </CartContext.Provider>
  );
};

export default CartProvider;

export const useCart = () => useContext(CartContext);
