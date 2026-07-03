import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  query, 
  where,
  runTransaction,
  deleteDoc
} from 'firebase/firestore';
import { db } from './firebase';
import { Product, Order, UserProfile, CartItem } from '../types';

const usersRef = collection(db, 'users');
const productsRef = collection(db, 'products');
const ordersRef = collection(db, 'orders');

export const dbService = {
  // Users
  async getUser(uid: string): Promise<UserProfile | null> {
    const docSnap = await getDoc(doc(db, 'users', uid));
    if (docSnap.exists()) return docSnap.data() as UserProfile;
    return null;
  },

  async createUser(uid: string, data: Partial<UserProfile>) {
    await setDoc(doc(db, 'users', uid), data, { merge: true });
  },

  /**
   * Ensures the Firestore user document has the correct role.
   * - adityaworkspace22@gmail.com → role: 'admin', isActive: true
   * - everyone else → role: 'customer' (only if not already set)
   * Returns the final role assigned.
   */
  async ensureUserRole(uid: string, email: string): Promise<'admin' | 'customer'> {
    const ADMIN_EMAIL = 'adityaworkspace22@gmail.com';
    const isAdmin = email.toLowerCase() === ADMIN_EMAIL;
    const userDocRef = doc(db, 'users', uid);
    const docSnap = await getDoc(userDocRef);
    const now = new Date().toISOString();

    if (!docSnap.exists()) {
      // Create the document with correct role
      await setDoc(userDocRef, {
        uid,
        email,
        role: isAdmin ? 'admin' : 'customer',
        isActive: true,
        createdAt: now,
        updatedAt: now,
      }, { merge: true });
      return isAdmin ? 'admin' : 'customer';
    }

    const data = docSnap.data();
    const currentRole = data.role;

    if (isAdmin && currentRole !== 'admin') {
      // Promote to admin
      await updateDoc(userDocRef, { role: 'admin', isActive: true, updatedAt: now });
      return 'admin';
    }

    if (!isAdmin && !currentRole) {
      // Assign default customer role if missing
      await updateDoc(userDocRef, { role: 'customer', updatedAt: now });
      return 'customer';
    }

    return (currentRole as 'admin' | 'customer') ?? 'customer';
  },
  
  async updateUserCart(uid: string, cart: CartItem[]) {
    await updateDoc(doc(db, 'users', uid), { cart });
  },

  async updateUserWishlist(uid: string, wishlist: Product[]) {
    await updateDoc(doc(db, 'users', uid), { wishlist });
  },

  // Products
  async getProducts(): Promise<Product[]> {
    const snapshot = await getDocs(productsRef);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
  },

  async getProduct(id: string): Promise<Product | null> {
    const docSnap = await getDoc(doc(db, 'products', id));
    if (docSnap.exists()) return { id: docSnap.id, ...docSnap.data() } as Product;
    return null;
  },

  async updateProduct(id: string, data: Partial<Product>) {
    await updateDoc(doc(db, 'products', id), data);
  },

  async addProduct(product: Omit<Product, 'id'>): Promise<string> {
    const docRef = doc(collection(db, 'products'));
    await setDoc(docRef, { ...product, id: docRef.id });
    return docRef.id;
  },

  async deleteProduct(id: string) {
    await deleteDoc(doc(db, 'products', id));
  },

  // Orders
  async createOrder(orderId: string, orderData: Order) {
    await setDoc(doc(db, 'orders', orderId), orderData);
  },

  async getUserOrders(email: string): Promise<Order[]> {
    const q = query(ordersRef, where('userEmail', '==', email));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data() as Order);
  },

  async getOrders(): Promise<Order[]> {
    const snapshot = await getDocs(ordersRef);
    return snapshot.docs.map(doc => doc.data() as Order);
  },

  async updateOrderStatus(orderId: string, status: string) {
    await updateDoc(doc(db, 'orders', orderId), { status });
  },

  // Inventory Transaction
  async deductInventory(cartItems: CartItem[]) {
    try {
      await runTransaction(db, async (transaction) => {
        const productRefs = cartItems.map(item => doc(db, 'products', item.product.id));
        const productDocs = await Promise.all(productRefs.map(ref => transaction.get(ref)));
        
        cartItems.forEach((item, index) => {
          const productDoc = productDocs[index];
          if (!productDoc.exists()) {
            throw new Error(`Product ${item.product.id} does not exist!`);
          }
          
          const product = productDoc.data() as Product;
          
          if (product.stock < item.quantity) {
            throw new Error(`Insufficient stock for ${product.name}`);
          }
          
          transaction.update(productRefs[index], {
            stock: product.stock - item.quantity
          });
        });
      });
      return true;
    } catch (error) {
      console.error("Transaction failed: ", error);
      throw error;
    }
  }
};
