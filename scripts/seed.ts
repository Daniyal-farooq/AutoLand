import dbConnect from '@/lib/db';
import Vehicle from '@/lib/models/Vehicle';
import GalleryItem from '@/lib/models/GalleryItem';
import Admin from '@/lib/models/Admin';

const sampleVehicles = [
  {
    name: '911 Carrera',
    brand: 'Porsche',
    model: '911 Carrera S',
    category: 'sports',
    year: 2024,
    price: 130000,
    image: '/cars/porsche-911.jpg',
    description: 'The iconic Porsche 911 Carrera offers unmatched performance and luxury in a sleek, timeless design.',
    specifications: {
      engine: '3.0L Twin-Turbo Flat-6',
      horsepower: 443,
      topSpeed: 183,
      acceleration: '3.7 sec 0-100',
      transmission: 'PDK Automatic',
    },
  },
  {
    name: 'Continental GT',
    brand: 'Bentley',
    model: 'Continental GT Mulliner',
    category: 'luxury',
    year: 2024,
    price: 215000,
    image: '/cars/bentley-continental.jpg',
    description: 'Experience ultimate luxury with Bentley\'s Continental GT, featuring handcrafted interiors and powerful performance.',
    specifications: {
      engine: '6.0L Twin-Turbo W12',
      horsepower: 635,
      topSpeed: 207,
      acceleration: '3.6 sec 0-100',
      transmission: 'Automatic ZF',
    },
  },
  {
    name: 'Huracán',
    brand: 'Lamborghini',
    model: 'Huracán EVO',
    category: 'exotic',
    year: 2024,
    price: 250000,
    image: '/cars/lamborghini-huracán.jpg',
    description: 'The Lamborghini Huracán delivers breathtaking speed and precision engineering. A true supercar experience.',
    specifications: {
      engine: '5.2L V10 Naturally Aspirated',
      horsepower: 640,
      topSpeed: 217,
      acceleration: '2.9 sec 0-100',
      transmission: 'Automatic 7-Speed',
    },
  },
];

const sampleGallery = [
  {
    title: 'Porsche 911 in Motion',
    description: 'Dynamic shot of the Porsche 911 Carrera showcasing its aerodynamic design.',
    brand: 'Porsche',
    image: '/cars/porsche-911.jpg',
    specs: '3.0L Twin-Turbo Engine, 443 HP, 0-100 in 3.7 seconds',
  },
  {
    title: 'Bentley Continental Elegance',
    description: 'The Bentley Continental GT represents the pinnacle of luxury automotive design.',
    brand: 'Bentley',
    image: '/cars/bentley-continental.jpg',
    specs: '6.0L Twin-Turbo W12, 635 HP, Top Speed 207 mph',
  },
  {
    title: 'Lamborghini Huracán Power',
    description: 'Experience the raw power and beauty of the Lamborghini Huracán EVO.',
    brand: 'Lamborghini',
    image: '/cars/lamborghini-huracán.jpg',
    specs: '5.2L V10, 640 HP, 0-100 in 2.9 seconds',
  },
];

async function seed() {
  try {
    await dbConnect();
    console.log('Connected to MongoDB');

    // Clear existing data
    await Vehicle.deleteMany({});
    await GalleryItem.deleteMany({});
    console.log('Cleared existing data');

    // Seed vehicles
    const vehicles = await Vehicle.insertMany(sampleVehicles);
    console.log(`Added ${vehicles.length} vehicles`);

    // Seed gallery
    const gallery = await GalleryItem.insertMany(sampleGallery);
    console.log(`Added ${gallery.length} gallery items`);

    // Create default admin user (optional)
    await Admin.deleteMany({ email: 'admin@autoland.com' });
    await Admin.create({
      email: 'admin@autoland.com',
      password: 'admin123',
      name: 'Admin',
    });
    console.log('Created default admin user (admin@autoland.com / admin123)');

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
}

seed();
