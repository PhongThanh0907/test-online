import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";

import { Product } from "./types/Product.type";

function App() {
  const [listData, setListData] = useState<Product[]>([]);
  const divRef = useRef<HTMLDivElement>(null);
  const [search, setSearch] = useState<string>();

  const getProducts = useCallback(
    async (limit?: number, skip?: number) => {
      try {
        const res = await axios.get("https://dummyjson.com/products", {
          params: {
            limit: limit,
            skip: skip,
          },
        });
        const newProducts = res.data.products;

        if (skip && skip > 0) {
          setListData((prevData) => [...prevData, ...newProducts]);
        } else {
          setListData(newProducts);
        }
      } catch (error) {
        console.log(error);
      }
    },
    []
  );

  const getSearchProduct = useCallback(async(limit?: number, skip?: number) => {
    try {
      const res = await axios.get("https://dummyjson.com/products/search", {
        params: {
          limit: limit,
          skip: skip,
          q: search,
        },
      });
      const newProducts = res.data.products;
      if (skip && skip > 0) {
        setListData((prevData) => [...prevData, ...newProducts]);
      } else {
        setListData(newProducts);
      }
    } catch (error) {
      console.log(error)
    }
  }, [search])

  const handleScroll = useCallback(() => {
    const div = divRef.current;
    if (div && div.scrollHeight - div.scrollTop === div.clientHeight) {
      if(search) {
        getSearchProduct()
      } else {
        getProducts(20, listData.length);

      }
    }
  }, [getProducts, listData, search, getSearchProduct]);

  const handleSearchChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSearch(value);
    if (divRef.current) {
      divRef.current.scrollTop = 0;
    }
  }, []);

  useEffect(() => {
    if (search) {
      getSearchProduct();
    } else {
      getProducts(20)
    }
  }, [search, getSearchProduct, getProducts]);

  useEffect(() => {
    getProducts(20);
  }, []);

  useEffect(() => {
    const div = divRef.current;
    if (div) {
      div.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (div) {
        div.removeEventListener("scroll", handleScroll);
      }
    };
  }, [handleScroll]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <h1>Infinite Scroll</h1>
      <div style={{ padding: "20px" }}>
        <input
          value={search}
          onChange={handleSearchChange}
          placeholder="Tìm kiếm"
          style={{ padding: "8px" }}
          type="text"
        />
      </div>
      <div
        ref={divRef}
        style={{
          height: "500px",
          overflowY: "auto",
        }}
      >
        {listData.map((product, index) => (
          <div
            style={{
              display: "flex",
              height: "100px",
              width: "500px",
              border: "1px solid gray",
              padding: "0 10px",
              gap: "10px",
            }}
            key={index}
          >
            <img
              style={{
                width: "80px",
                height: "80px",
                objectFit: "cover",
                margin: "auto 0",
              }}
              src={product.images[0]}
              alt="img-product"
            />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                margin: "auto 0",
              }}
            >
              <span>{product.title}</span>
              <span>${product.price}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
