import { createContext, useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import { food_list as defaultFoodList } from "../assets/assets";

export const StoreContext = createContext(null)

const StoreContextProvider = (props) => {

    const [food_list, setFoodList] = useState(defaultFoodList);
    const [ cartItems,setCartItems] = useState({});
    const url = "http://localhost:4000";

    const fetchFoodList = async () => {
        try {
            const response = await axios.get(`${url}/api/food/list`);
            if (response.data.success && response.data.data.length > 0) {
                   // Combine database items with default items
                   const dbItems = response.data.data.map(item => ({
                       ...item,
                       image: `${url}/images/${item.image}` // Add full URL to image
                   }));
                   const combinedList = [...defaultFoodList, ...dbItems];
                setFoodList(combinedList);
            }
        } catch (error) {
            console.log("Error fetching food list, using default items:", error);
            setFoodList(defaultFoodList);
        }
    }

    useEffect(() => {
        fetchFoodList();
        // Listen for admin food updates via custom event (same-tab) and storage event (cross-tab)
        const handleFoodUpdate = () => {
            console.log('Food list updated from admin panel (event)');
            fetchFoodList();
        };
        const handleStorage = (e) => {
            if (e.key === 'foodListUpdated') {
                console.log('Food list updated from admin panel (storage)');
                fetchFoodList();
            }
        };
        window.addEventListener('foodListUpdated', handleFoodUpdate);
        window.addEventListener('storage', handleStorage);
        return () => {
            window.removeEventListener('foodListUpdated', handleFoodUpdate);
            window.removeEventListener('storage', handleStorage);
        };
    }, [])

    const addToCart = (itemId) => {
        setCartItems((prev) => {
            const prevCount = prev?.[itemId] || 0;
            return { ...prev, [itemId]: prevCount + 1 };
        });
    }

    const removeFromCart = (itemId) => {
        setCartItems((prev) => {
            const prevCount = prev?.[itemId] || 0;
            const nextCount = prevCount - 1;
            const next = { ...prev };
            if (nextCount > 0) next[itemId] = nextCount;
            else delete next[itemId];
            return next;
        });
    }

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for (const itemKey in cartItems) {
            const qty = cartItems[itemKey];
            if (!qty || qty <= 0) continue;
            // Match ids as strings to avoid type mismatch between server and local ids
            const itemInfo = food_list.find((product) => String(product._id) === String(itemKey));
            if (!itemInfo) continue; // skip missing items
            totalAmount += (itemInfo.price || 0) * qty;
        }
        return totalAmount;
    }

    const contextValue = {  
        food_list,
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        refetchFoodList: fetchFoodList
    }
    return(
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    )
}
export default StoreContextProvider
