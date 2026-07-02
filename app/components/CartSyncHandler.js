import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "../../context/AuthContext";
import cartSyncService from "@/services/cartSyncService";
import { setCartItems } from "@/store/slices/cartSlice";

function CartSyncHandler() {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart?.items || []);
  const initializedRef = useRef(false);
  const syncingRef = useRef(false);

  useEffect(() => {
    const loadRemoteCart = async () => {
      if (!user) return;
      try {
        const resp = await cartSyncService.getSyncedCart();
        const products = (resp?.data?.products || []).map((p) => ({
          _id: p.productId,
          id: p.productId,
          name: p.name,
          quantity: p.quantity || 1,
          netPrice: p.discountPrice || p.actualPrice || 0,
          image: p.image || "",
          isVatApplicable: false,
          vatRate: 0,
          vatAmount: 0,
        }));
        dispatch(setCartItems(products));
      } catch (e) {
        console.warn("Failed to load remote cart", e);
      } finally {
        initializedRef.current = true;
      }
    };

    loadRemoteCart();
  }, [user, dispatch]);

  useEffect(() => {
    const sync = async () => {
      if (!user || !initializedRef.current || syncingRef.current) return;
      try {
        syncingRef.current = true;
        await cartSyncService.syncCart(cartItems);
      } catch (e) {
        console.warn("Failed to sync cart", e);
      } finally {
        syncingRef.current = false;
      }
    };

    sync();
  }, [cartItems, user]);

  return null;
}

export default CartSyncHandler;
