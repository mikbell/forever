import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from './Title'; // Assuming Title component is available

const CartTotal = () => {
    const { currency, delivery_fee, getCartAmount } = useContext(ShopContext);

    const cartSubtotal = getCartAmount();
    const finalDeliveryFee = cartSubtotal > 0 ? delivery_fee : 0; // Apply delivery fee only if cart has items
    const cartTotal = cartSubtotal + finalDeliveryFee;

    return cartSubtotal > 0 && (
        <div>
            <div className="mb-6"> {/* Added margin-bottom */}
                <Title text1={'Riepilogo'} text2={'Ordine'} />
            </div>

            <div className='flex flex-col gap-4 text-base text-gray-700'> {/* Increased gap and slightly larger text */}
                {/* Subtotal Row */}
                <div className="flex justify-between items-center pb-2"> {/* Added padding-bottom and items-center */}
                    <p>Subtotale Carrello</p>
                    <p className="font-semibold">{currency} {cartSubtotal.toFixed(2)}</p> {/* Format to 2 decimal places */}
                </div>
                <hr className='border-t border-gray-200' /> {/* Thinner, lighter hr */}

                {/* Shipping Row */}
                <div className="flex justify-between items-center py-2"> {/* Added vertical padding */}
                    <p>Spedizione</p>
                    <p className="font-semibold">{currency}{finalDeliveryFee.toFixed(2)}</p> {/* Format to 2 decimal places */}
                </div>
                <hr className='border-t border-gray-200' /> {/* Thinner, lighter hr */}

                {/* Total Row */}
                <div className="flex justify-between items-center pt-4"> {/* Increased top padding */}
                    <b className="text-xl">Totale Ordine</b> {/* Larger, bolder text for total */}
                    <b className="text-xl font-extrabold">{currency}{cartTotal.toFixed(2)}</b> {/* Prominent total amount */}
                </div>
            </div>
        </div>
    );
};

export default CartTotal;
