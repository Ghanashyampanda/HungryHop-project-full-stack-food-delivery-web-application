import React, { useState } from 'react'
import { FaLeaf } from "react-icons/fa";
import { FaDrumstickBite } from "react-icons/fa";
import { FaStar } from "react-icons/fa";
import { FaRegStar } from "react-icons/fa6";
import { FaMinus } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import { FaShoppingCart } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, removeCartItem, updateQuantity } from '../redux/userSlice';

function FoodCard({data}) {
    const dispatch = useDispatch()
    const { cartItems } = useSelector(state => state.user)

    const existingCartItem = cartItems.find(i => i.id === data._id)
    const quantity = existingCartItem ? existingCartItem.quantity : 0

    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
           stars.push(
            (i <= rating) ? (
                <FaStar key={i} className='text-yellow-500 text-lg'/>
            ) : (
                <FaRegStar key={i} className='text-yellow-500 text-lg'/>
            )
           )
        }
        return stars
    }

    const handleIncrease = () => {
        dispatch(addToCart({
            id: data._id,
            name: data.name,
            price: data.price,
            image: data.image,
            shop: data.shop,
            quantity: 1,
            foodType: data.foodType
        }))
    }

    const handleDecrease = () => {
        if (quantity > 1) {
            dispatch(updateQuantity({ id: data._id, quantity: quantity - 1 }))
        } else if (quantity === 1) {
            dispatch(removeCartItem(data._id))
        }
    }

    return (
        <div className='w-[250px] rounded-2xl border-2 border-[#ff4d2d]/20 bg-white shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col'>
            <div className='relative w-full h-[170px] flex justify-center items-center bg-gray-50 overflow-hidden'>
                <div className='absolute top-3 right-3 bg-white rounded-full p-1.5 shadow z-10'>
                    {data.foodType === "veg" ? <FaLeaf className='text-green-600 text-base'/> : <FaDrumstickBite className='text-red-600 text-base'/>}
                </div>
                <img src={data.image} alt={data.name} className='w-full h-full object-cover transition-transform duration-300 hover:scale-105'/>
            </div>

            <div className="flex-1 flex flex-col p-4">
                <h1 className='font-semibold text-gray-900 text-base truncate'>{data.name}</h1>
                <div className='flex items-center gap-1 mt-1'>
                    {renderStars(data.rating?.average || 0)}
                    <span className='text-xs text-gray-500 ml-1'>
                        ({data.rating?.count || 0})
                    </span>
                </div>
            </div>

            <div className='flex items-center justify-between mt-auto p-4 border-t border-gray-50 bg-gray-50/50'>
                <span className='font-bold text-gray-900 text-lg'>
                    ₹{data.price}
                </span>

                <div className='flex items-center'>
                    {quantity === 0 ? (
                        <button 
                            className='bg-[#ff4d2d] hover:bg-[#e64528] active:scale-95 text-white px-5 py-1.5 rounded-full font-semibold shadow-sm transition-all duration-200 text-sm flex items-center gap-1.5' 
                            onClick={handleIncrease}
                        >
                            <FaShoppingCart size={13}/>
                            Add
                        </button>
                    ) : (
                        <div className='flex items-center border border-[#ff4d2d]/30 bg-white rounded-full overflow-hidden shadow-sm h-8'>
                            <button className='px-2.5 py-1 hover:bg-orange-50 text-[#ff4d2d] font-bold transition duration-200' onClick={handleDecrease}>
                                <FaMinus size={10}/>
                            </button>
                            <span className='px-2 font-bold text-gray-800 text-sm min-w-[20px] text-center'>{quantity}</span>
                            <button className='px-2.5 py-1 hover:bg-orange-50 text-[#ff4d2d] font-bold transition duration-200' onClick={handleIncrease}>
                                <FaPlus size={10}/>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default FoodCard
