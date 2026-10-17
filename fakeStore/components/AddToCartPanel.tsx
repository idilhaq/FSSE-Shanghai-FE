'use client';
import { useState } from 'react';
import { Product } from '@/services/dummyjson';
import { useCart } from '@/context/CartContext';
import QuantitySelector from '@/components/QuantitySelector';

/**
 * Client island for the product detail page: owns the quantity + add-to-cart
 * interaction. The surrounding product presentation stays server-rendered.
 */
export default function AddToCartPanel({ product }: { product: Product }) {
    const { addToCart, getQuantity } = useCart();
    const minQty = Math.max(1, product.minimumOrderQuantity);
    const [qty, setQty] = useState(minQty);
    const [notice, setNotice] = useState<string | null>(null);

    const inCart = getQuantity(product.id);
    const remaining = Math.max(0, product.stock - inCart);
    const soldOut = remaining === 0;

    const handleAdd = () => {
        const added = addToCart(product, qty);
        if (added > 0) {
            setNotice(`Added ${added} item${added > 1 ? 's' : ''} to your cart.`);
            setQty(minQty);
        } else {
            setNotice('Cannot add more — stock limit reached.');
        }
    };

    return (
        <div>
            {/* Stock status reflects live cart state, so it lives in the client island. */}
            <p style={{ margin: '8px 0', fontSize: '14px', color: soldOut ? '#c53030' : '#2f855a', fontWeight: 600 }}>
                {soldOut ? 'Out of stock' : `${remaining} available`}
                {inCart > 0 && !soldOut && (
                    <span style={{ color: '#718096', fontWeight: 400 }}> · {inCart} already in cart</span>
                )}
            </p>

            <div style={{ marginTop: '12px', display: 'flex', alignItems: 'flex-end', gap: '16px', flexWrap: 'wrap' }}>
                <QuantitySelector
                    label="Quantity"
                    value={qty}
                    min={minQty}
                    max={Math.max(minQty, remaining)}
                    onChange={setQty}
                />
                <button
                    onClick={handleAdd}
                    disabled={soldOut}
                    style={{
                        padding: '12px 24px',
                        background: soldOut ? '#a0aec0' : '#3182ce',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: soldOut ? 'not-allowed' : 'pointer',
                        fontWeight: 'bold',
                    }}
                >
                    🛒 {soldOut ? 'Sold Out' : 'Add to Shopping Cart'}
                </button>
            </div>

            {notice && <p style={{ marginTop: '12px', fontSize: '14px', color: '#2b6cb0' }}>{notice}</p>}
        </div>
    );
}
