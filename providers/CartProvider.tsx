import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  PropsWithChildren,
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";
import { supabase } from "../lib/supabase";
import { NumberArray } from "react-native-svg";

type CartType = {
  items: string[];
  addItem: (id: string) => void;
  removeItem: (id: string) => void;
};

const CartContext = createContext<CartType>({
  items: [],
  addItem: () => {},
  removeItem: () => {},
});

const CartProvider = ({ children }: PropsWithChildren) => {
  const [items, setItems] = useState<string[]>([]);
  const [userId, setUserId] = useState<string>();
  const [needsUpdate, setNeedsUpdate] = useState<boolean>(false);

  useEffect(() => {
    const loadCart = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          setUserId(user.id);
          let { data, error } = await supabase
            .from("users")
            .select("*")
            .eq("id", userId)
            .single();

          if (data) {
            setItems(data.cart);
          }
        }
      } catch (error) {
        console.error("Failed to load cart from storage", error);
      }
    };
    loadCart();
  }, []);

  useEffect (() => {
    const updateCart = async () => {  
      try {
        const { data, error } = await supabase
          .from("users")
          .update({ cart: items })
          .eq("id", userId);
      } catch (error) {
        console.error("failed to add to cart", error);
      }
    };

    if (needsUpdate) {
      updateCart();
      setNeedsUpdate(false); // Reset the flag
    }
  }, [items, needsUpdate, userId]);

  const addItem = async (id: string) => {
    setItems((prevItems) => {
      const newItems = [...prevItems, id];
      setNeedsUpdate(true);
      return newItems;
    });
  };

  const removeItem = (id: string) => {
    setItems((prevItems) => prevItems.filter((item) => item !== id));
    console.log(id);
  };

  return (
    <CartContext.Provider value={{ items, addItem, removeItem }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;

export const useCart = () => useContext(CartContext);
