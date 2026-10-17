import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import Navbar from '@/components/Navbar';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'sans-serif', background: '#f7fafc', color: '#1a202c' }}>
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <main style={{ minHeight: 'calc(100vh - 70px)' }}>{children}</main>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
