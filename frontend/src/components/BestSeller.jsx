import React, { useEffect, useState, useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from './Title';
import ProductItem from './ProductItem';

const BestSeller = () => {
    const { products, currency } = useContext(ShopContext);
    const [bestSeller, setBestSeller] = useState([]);

    useEffect(() => {
        const sortedProducts = [...products].sort((a,b) => (b.bestsellerCount || 0) - (a.bestsellerCount || 0));
        setBestSeller(sortedProducts.slice(0, 5));
    }, [products]);

    return (
        <div className="my-10">
            <div className="text-center py-8 text-3xl">
                <Title text1="BEST" text2="SELLER" />
                <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600">
                    Check out our newest products and trends in the best seller collection.
                </p>
            </div>

            {/* BestSeller Products */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
                {bestSeller.map((item, index) => (
                    <ProductItem
                        key={index}
                        id={item._id}
                        name={item.name}
                        price={item.price}
                        category={item.category}
                        rating={item.rating || 4}
                        image={item.image}
                    />
                ))}
            </div>
        </div>
    );
};

export default BestSeller;