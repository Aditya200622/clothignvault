import { PRODUCTS, CATEGORIES } from '../src/data';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../src/firebase/firebase';

async function seed() {
  try {
    console.log('Seeding products...');
    for (const product of PRODUCTS) {
      await setDoc(doc(db, 'products', product.id), product);
      console.log(`Seeded product: ${product.id}`);
    }

    console.log('Seeding categories...');
    for (const category of CATEGORIES) {
      await setDoc(doc(db, 'categories', category.id), category);
      console.log(`Seeded category: ${category.id}`);
    }

    console.log('Seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
}

seed();
