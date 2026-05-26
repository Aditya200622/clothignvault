import React, { useEffect, useState } from 'react';
import {
  collection,
  getDocs,
  updateDoc,
  doc
} from 'firebase/firestore';

import { db } from '../firebase/firebase';

export default function AdminView() {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const querySnapshot = await getDocs(collection(db, "orders"));

    const data = querySnapshot.docs.map((docItem) => ({
      firestoreId: docItem.id,
      ...docItem.data(),
    }));

    setOrders(data.reverse());
  };

  const updateStatus = async (
    firestoreId: string,
    newStatus: string
  ) => {
    const orderRef = doc(db, "orders", firestoreId);

    await updateDoc(orderRef, {
      status: newStatus,
    });

    fetchOrders();
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl font-bold mb-8">
        Admin Order Dashboard
      </h1>

      <div className="space-y-6">
        {orders.map((order) => (
          <div
            key={order.firestoreId}
            className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800"
          >
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold">
                  {order.id}
                </h2>

                <p className="text-zinc-400">
                  {order.userEmail}
                </p>

                <p className="mt-2">
                  Status:
                  <span className="text-purple-400 ml-2">
                    {order.status}
                  </span>
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() =>
                    updateStatus(
                      order.firestoreId,
                      "Processing"
                    )
                  }
                  className="bg-yellow-600 px-4 py-2 rounded-lg"
                >
                  Processing
                </button>

                <button
                  onClick={() =>
                    updateStatus(
                      order.firestoreId,
                      "Shipped"
                    )
                  }
                  className="bg-blue-600 px-4 py-2 rounded-lg"
                >
                  Shipped
                </button>

                <button
                  onClick={() =>
                    updateStatus(
                      order.firestoreId,
                      "Delivered"
                    )
                  }
                  className="bg-green-600 px-4 py-2 rounded-lg"
                >
                  Delivered
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}