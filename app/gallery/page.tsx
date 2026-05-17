'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { DEFAULT_CARS } from '@/lib/defaultCars';

interface GalleryItem {
  _id: string;
  title: string;
  description: string;
  image: string;
  brand: string;
  specs: string;
}

export default function Gallery() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const response = await fetch('/api/gallery');
        const data = await response.json();
        const galleryData = data.length > 0 ? data : DEFAULT_CARS.map((car) => ({
          _id: car._id,
          title: `${car.brand} ${car.name}`,
          description: car.description,
          image: car.image,
          brand: car.brand,
          specs: `${car.specifications.engine} | ${car.specifications.horsepower}HP | Top Speed: ${car.specifications.topSpeed} mph`,
        }));
        setItems(galleryData);
      } catch (error) {
        console.error('Error fetching gallery:', error);
        // Use default cars as fallback gallery
        const fallbackGallery = DEFAULT_CARS.map((car) => ({
          _id: car._id,
          title: `${car.brand} ${car.name}`,
          description: car.description,
          image: car.image,
          brand: car.brand,
          specs: `${car.specifications.engine} | ${car.specifications.horsepower}HP | Top Speed: ${car.specifications.topSpeed} mph`,
        }));
        setItems(fallbackGallery);
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5 },
    },
  };

  return (
    <>
      <Navigation />
      <main className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-4">
              Gallery
            </h1>
            <p className="text-xl text-muted-foreground">
              Explore our stunning collection of exotic automobiles
            </p>
          </motion.div>

          {/* Gallery Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-secondary/50 rounded-lg h-80 animate-pulse" />
              ))}
            </div>
          ) : items.length > 0 ? (
            <>
              <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {items.map((item) => (
                  <motion.div
                    key={item._id}
                    variants={itemVariants}
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setSelectedItem(item)}
                    className="relative group cursor-pointer rounded-lg overflow-hidden bg-secondary/50 h-80 border border-border hover:border-primary transition-all duration-300"
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <h3 className="font-bold text-lg">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.brand}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Modal */}
              {selectedItem && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setSelectedItem(null)}
                  className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
                >
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-secondary/95 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                  >
                    <div className="relative">
                      <img
                        src={selectedItem.image}
                        alt={selectedItem.title}
                        className="w-full h-96 object-cover"
                      />
                      <button
                        onClick={() => setSelectedItem(null)}
                        className="absolute top-4 right-4 bg-background/80 hover:bg-background text-foreground w-10 h-10 rounded-full flex items-center justify-center transition-colors"
                      >
                        ✕
                      </button>
                    </div>
                    <div className="p-6">
                      <h2 className="text-3xl font-bold text-foreground mb-2">
                        {selectedItem.title}
                      </h2>
                      <p className="text-primary font-semibold mb-4">{selectedItem.brand}</p>
                      <p className="text-muted-foreground mb-4">{selectedItem.description}</p>
                      <div className="bg-background/50 rounded-lg p-4">
                        <h3 className="font-bold text-foreground mb-2">Specifications</h3>
                        <p className="text-muted-foreground">{selectedItem.specs}</p>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <p className="text-muted-foreground text-xl">
                Gallery items coming soon. Check back for updates!
              </p>
            </motion.div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
