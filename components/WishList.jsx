import React from "react";
import { Box, Input, Button, Stack, useToast, Text } from "@chakra-ui/react";
import useAuth from "../hooks/useAuth";
import { addWishListItem, getWishlistItemsByUser } from "../api/wishlist";

const WishList = () => {
    const [itemName, setItemName] = React.useState("");
    const [itemCost, setItemCost] = React.useState("");
    const [wishlistItems, setWishlistItems] = React.useState([]);
    const toast = useToast();
    const { isLoggedIn, user } = useAuth();

    React.useEffect(() => {
        if (isLoggedIn) {
            const unsubscribe = getWishlistItemsByUser(user.uid, setWishlistItems);
            return () => unsubscribe(); 
        }
    }, [isLoggedIn, user]);

    const handleWishListAdd = async () => {
        if (!isLoggedIn) {
            
            return;
        }
        const wishListItem = {
            itemName,
            itemCost,
            userId: user.uid,
        };
        await addWishListItem(wishListItem);
       
        setItemName("");
        setItemCost("");
        toast({ title: "Item added to wishlist successfully", status: "success" });
    };

    return (
        <Box w="40%" margin="0 auto" display="block" mt={5}>
            <Stack direction="column">
                <Input
                    placeholder="Item Name"
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                />
                <Input
                    placeholder="Item Cost ($)"
                    value={itemCost}
                    onChange={(e) => setItemCost(e.target.value)}
                />
                <Button onClick={handleWishListAdd}>
                    Add to Wishlist
                </Button>
            </Stack>
            {wishlistItems.map(item => (
                <Box key={item.id} mt={4}>
                    <Text>{item.itemName} - ${item.itemCost}</Text>
                    
                </Box>
            ))}
        </Box>
    );
};

export default WishList;
