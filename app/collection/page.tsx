'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { DEFAULT_CARS } from '@/lib/defaultCars';

interface Vehicle {
  _id: string;
  name: string;
  brand: string;
  model: string;
  image: string;
  price: number;
  category: string;
  year: number;
  description: string;
  specifications: {
    engine: string;
    horsepower: number;
    topSpeed: number;
  };
}

const CATEGORIES = ['all', 'sports', 'luxury', 'suv', 'convertible', 'exotic'];

export default function Collection() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await fetch('/api/vehicles?category=all');
        const data = await response.json();
        const vehiclesData = data.length > 0 ? data : DEFAULT_CARS;
        setVehicles(vehiclesData);
        setFilteredVehicles(vehiclesData);
      } catch (error) {
        console.error('Error fetching vehicles:', error);
        // Use default cars if API fails
        setVehicles(DEFAULT_CARS);
        setFilteredVehicles(DEFAULT_CARS);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    if (category === 'all') {
      setFilteredVehicles(vehicles);
    } else {
      setFilteredVehicles(vehicles.filter((v) => v.category === category));
    }
  };

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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
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
              Our Collection
            </h1>
            <p className="text-xl text-muted-foreground">
              Explore our premium selection of exotic automobiles, organized by category
            </p>
          </motion.div>

          {/* Category Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mb-12 flex flex-wrap gap-3"
          >
            {CATEGORIES.map((category) => (
              <motion.button
                key={category}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleCategoryChange(category)}
                className={`px-6 py-2 rounded-full font-medium capitalize transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-foreground hover:bg-secondary/80'
                }`}
              >
                {category}
              </motion.button>
            ))}
          </motion.div>

          {/* Vehicles Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-secondary/50 rounded-lg h-96 animate-pulse" />
              ))}
            </div>
          ) : filteredVehicles.length > 0 ? (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={containerVariants}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredVehicles.map((vehicle) => (
                <motion.div
                  key={vehicle._id}
                  variants={itemVariants}
                  whileHover={{ y: -10 }}
                  className="group cursor-pointer rounded-lg overflow-hidden bg-secondary/30 border border-border hover:border-primary transition-all duration-300"
                >
                  {/* Image */}
                  <div className="relative overflow-hidden h-64 bg-secondary/50">
                    <img
                      src={vehicle.image}
                      alt={vehicle.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="text-primary text-sm font-semibold capitalize">{vehicle.category}</p>
                        <h3 className="text-2xl font-bold text-foreground">
                          {vehicle.brand} {vehicle.name}
                        </h3>
                      </div>
                      <span className="text-muted-foreground text-sm">{vehicle.year}</span>
                    </div>

                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                      {vehicle.description}
                    </p>

                    {/* Specs */}
                    <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Engine</p>
                        <p className="text-foreground font-semibold">
                          {vehicle.specifications?.engine || 'N/A'}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Horsepower</p>
                        <p className="text-foreground font-semibold">
                          {vehicle.specifications?.horsepower || 'N/A'} HP
                        </p>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="border-t border-border pt-4 flex justify-between items-center">
                      <span className="text-primary font-bold text-xl">
                        PKR {vehicle.price.toLocaleString()}
                      </span>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-accent transition-colors"
                      >
                        Inquire
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <p className="text-muted-foreground text-xl">
                No vehicles found in this category. Please check back soon!
              </p>
            </motion.div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
