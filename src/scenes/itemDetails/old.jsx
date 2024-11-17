import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Box, Typography } from '@mui/material';
import Item from '../../components/Item';

const ItemDetails = () => {
  const dispatch = useDispatch();
  const { itemId } = useParams();
  const [value, setValue] = useState("description");
  const [count, setCount] = useState(1);
  const [item, setItem] = useState(null);
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  async function getItem() {
    try {
      const response = await fetch(
        `http://localhost:1337/api/items?filters[documentId][$eq]=${itemId}&populate=image`,
        {
          method: "GET",
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const itemJson = await response.json();
      setItem(itemJson.data[0]); // Assuming the response is an array
    } catch (error) {
      setError(error.message);
      console.error('Error fetching item:', error);
    }
  }

  async function getItems() {
    try {
      const response = await fetch(
        `http://localhost:1337/api/items?populate=image`,
        {
          method: "GET",
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const itemsJson = await response.json();
      setItems(itemsJson.data);
    } catch (error) {
      setError(error.message);
      console.error('Error fetching items:', error);
    }
  }

  useEffect(() => {
    getItem();
    getItems();
  }, [itemId]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Box width="80%" m="80px auto">
      {error ? (
        <Typography variant="h6" color="error">
          Error: {error}
        </Typography>
      ) : (
        <Box display="flex" flexWrap="wrap" columnGap="40px">
          {item && (
            <Box flex="1 1 40%" mb="40px">
              <img
                width="100%"
                height="100%"
                style={{ objectFit: "contain" }}
                src={`http://localhost:1337${item.image.formats.medium.url}`}
                alt={item.name}
              />
              {/* Add other item details here */}
              
              <Box m="65px 0 25px 0">
              <Typography variant="h3">{item.name}</Typography>
              <Typography>${item.price}</Typography>
              <Typography sx={{ mt: "20px" }}>
                {item.longDescription[0].children[0].text}
              </Typography>
            </Box>
            </Box>
          )}

      <Box mt="50px" width="100%">
        <Typography variant="h3" fontWeight="bold">
          Related Products
        </Typography>
        <Box
          mt="20px"
          display="flex"
          flexWrap="wrap"
          columnGap="1.33%"
          justifyContent="space-between"
        >
          {items.slice(0, 4).map((item, i) => (
            <Item key={`${item.name}-${i}`} item={item} />
          ))}
        </Box>
      </Box>
        </Box>
      )}
    </Box>
  );
};

export default ItemDetails;