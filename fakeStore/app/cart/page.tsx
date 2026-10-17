'use client';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import QuantitySelector from '@/components/QuantitySelector';
import Link from 'next/link';
import Image from 'next/image';

export default function CartPage() {
    const { cart, setQuantity, removeFromCart, clearCart, totalItems, totalPrice } = useCart();
    const { user } = useAuth();

    const ownerLabel = user ? user.email : 'Guest';

    if (cart.length === 0) {
        return (
            <div style={{ padding: '40px', textAlign: 'center' }}>
                <h2>Your Cart is empty</h2>
                <p style={{ color: '#718096', marginBottom: '12px' }}>Viewing cart for: <strong>{ownerLabel}</strong></p>
                <Link href="/products" style={{ color: '#3182ce' }}>Return to Catalogue Shopping</Link>
            </div>
        );
    }

    return (
        <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
            <h1>Shopping Cart</h1>
            <p style={{ color: '#718096', marginTop: '-8px' }}>
                {totalItems} item{totalItems !== 1 ? 's' : ''} · Cart for <strong>{ownerLabel}</strong>
            </p>

            <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                {cart.map((item) => {
                    const stock = item.product.stock;
                    const lineTotal = item.product.price * item.quantity;
                    return (
                        <div key={item.product.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0', borderBottom: '1px solid #edf2f7', gap: '16px', flexWrap: 'wrap' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: '1 1 240px' }}>
                                <Image src={item.product.thumbnail} alt={item.product.title} width={50} height={50} style={{ objectFit: 'contain' }} />
                                <div>
                                    <h4 style={{ margin: '0 0 4px 0', maxWidth: '320px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.product.title}</h4>
                                    <p style={{ margin: 0, color: '#718096', fontSize: '14px' }}>
                                        ${item.product.price.toFixed(2)} each · max {stock}
                                    </p>
                                </div>
                            </div>

                            <QuantitySelector
                                value={item.quantity}
                                min={1}
                                max={stock}
                                onChange={(next) => setQuantity(item.product.id, next)}
                            />

                            <div style={{ textAlign: 'right', minWidth: '96px' }}>
                                <p style={{ margin: '0 0 4px 0', fontWeight: 'bold', color: '#2b6cb0' }}>${lineTotal.toFixed(2)}</p>
                                <button onClick={() => removeFromCart(item.product.id)} style={{ background: 'transparent', color: '#e53e3e', border: 'none', cursor: 'pointer', fontSize: '14px' }}>
                                    Remove
                                </button>
                            </div>
                        </div>
                    );
                })}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px', fontWeight: 'bold', fontSize: '18px' }}>
                    <span>Total Balance:</span>
                    <span style={{ color: '#2b6cb0' }}>${totalPrice.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', gap: '12px', marginTop: '24px', justifyContent: 'flex-end' }}>
                    <button onClick={clearCart} style={{ padding: '10px 20px', background: '#edf2f7', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Clear All</button>
                    <button onClick={() => alert('Proceeding to mock payments...')} style={{ padding: '10px 20px', background: '#48bb78', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Checkout</button>
                </div>
            </div>
        </div>
    );
}
