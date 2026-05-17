'use client';

import { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import Carousel from '@/components/Carousel';
import ParallaxSection from '@/components/ParallaxSection';
import FerrariParallax from '@/components/FerrariParallax';
import Link from 'next/link';
import { DEFAULT_CARS } from '@/lib/defaultCars';

interface Vehicle {
  _id: string;
  name: string;
  brand: string;
  image: string;
  price: number;
  category: string;
}

export default function Home() {
  const [featuredCars, setFeaturedCars] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedCars = async () => {
      try {
        const response = await fetch('/api/vehicles?category=all');
        const data = await response.json();
        setFeaturedCars(data.length > 0 ? data.slice(0, 3) : DEFAULT_CARS.slice(0, 3));
      } catch (error) {
        console.error('Error fetching cars:', error);
        // Use default cars if API fails
        setFeaturedCars(DEFAULT_CARS.slice(0, 3));
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedCars();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8 },
    },
  };

  return (
    <>
      <Navigation />
      <main>
        {/* Carousel Hero Section */}
        <Carousel items={featuredCars.length > 0 ? featuredCars : DEFAULT_CARS.slice(0, 3)} />

        {/* Additional Hero Section */}
        <section className="min-h-screen bg-gradient-to-b from-background to-secondary/20 flex items-center justify-center pt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <motion.h1
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight"
              >
                Luxury Redefined
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto"
              >
                Discover the world&apos;s finest exotic automobiles at Auto Land International
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <Link href="/collection">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 bg-primary text-primary-foreground font-bold rounded-lg hover:bg-accent transition-colors"
                  >
                    Explore Collection
                  </motion.button>
                </Link>
                <Link href="/contact">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 border-2 border-primary text-primary font-bold rounded-lg hover:bg-primary/10 transition-colors"
                  >
                    Contact Us
                  </motion.button>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Featured Cars Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          <ParallaxSection className="absolute inset-0 opacity-5">
            <div className="text-6xl font-bold text-primary">Luxury</div>
          </ParallaxSection>
          <div className="max-w-7xl mx-auto relative z-10">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={containerVariants}
              className="mb-12"
            >
              <motion.h2
                variants={itemVariants}
                className="text-4xl md:text-5xl font-bold text-foreground mb-4"
              >
                Featured Collection
              </motion.h2>
              <motion.p
                variants={itemVariants}
                className="text-muted-foreground text-lg"
              >
                Experience our premium selection of exotic vehicles
              </motion.p>
            </motion.div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-96 bg-secondary/50 rounded-lg animate-pulse" />
                ))}
              </div>
            ) : featuredCars.length > 0 ? (
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={containerVariants}
                className="grid grid-cols-1 md:grid-cols-3 gap-8"
              >
                {featuredCars.map((car) => (
                  <motion.div
                    key={car._id}
                    variants={itemVariants}
                    whileHover={{ y: -15, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="group cursor-pointer"
                  >
                    <div className="relative overflow-hidden rounded-xl bg-secondary/50 h-72 border border-border/50 hover:border-primary/50 transition-all duration-300">
                      <motion.img
                        src={car.image}
                        alt={car.name}
                        className="w-full h-full object-cover"
                        whileHover={{ scale: 1.15 }}
                        transition={{ duration: 0.4 }}
                      />
                      <motion.div
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"
                      />
                      <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        whileHover={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="absolute bottom-0 left-0 right-0 p-4 text-foreground"
                      >
                        <p className="text-accent text-sm font-semibold mb-1">Featured</p>
                        <p className="text-sm text-muted-foreground">Click to explore</p>
                      </motion.div>
                    </div>
                    <motion.div className="mt-4">
                      <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                        {car.brand} {car.name}
                      </h3>
                      <motion.p
                        initial={{ opacity: 0.7 }}
                        whileHover={{ opacity: 1 }}
                        className="text-primary font-bold text-lg mt-2 transition-opacity duration-300"
                      >
                        PKR {car.price.toLocaleString()}
                      </motion.p>
                    </motion.div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">No vehicles available yet</p>
              </div>
            )}

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="text-center mt-12"
            >
              <Link href="/collection" className="cursor-pointer">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-secondary text-foreground font-bold rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer"
                >
                  View All Vehicles
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Company Info Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-secondary/20 to-background relative overflow-hidden">
          {/* Glassmorphic Ferrari Background */}
          <FerrariParallax scrollRange={[0, 1000]} offsetX={-50} />
          
          <ParallaxSection className="absolute inset-0 opacity-5">
            <div className="text-6xl font-bold text-accent">Excellence</div>
          </ParallaxSection>
          <div className="max-w-7xl mx-auto relative z-10">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={containerVariants}
            >
              <motion.h2
                variants={itemVariants}
                className="text-4xl md:text-5xl font-bold text-foreground mb-12 text-center"
              >
                Why Choose Auto Land International
              </motion.h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <motion.div
                  variants={itemVariants}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="cursor-pointer text-center p-8 rounded-xl border border-border/50 hover:border-primary/50 bg-secondary/30 hover:bg-secondary/50 transition-all duration-300"
                >
                  <motion.div
                    className="w-16 h-16 bg-gradient-to-br from-primary/40 to-accent/40 rounded-full flex items-center justify-center mx-auto mb-4 cursor-pointer"
                    whileHover={{ scale: 1.1, rotate: 10 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                  >
                    <span className="text-3xl">🏆</span>
                  </motion.div>
                  <h3 className="text-2xl font-bold text-foreground mb-3">Premium Quality</h3>
                  <p className="text-muted-foreground">
                    Carefully curated collection of verified authentic exotic vehicles
                  </p>
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="cursor-pointer text-center p-8 rounded-xl border border-border/50 hover:border-primary/50 bg-secondary/30 hover:bg-secondary/50 transition-all duration-300"
                >
                  <motion.div
                    className="w-16 h-16 bg-gradient-to-br from-primary/40 to-accent/40 rounded-full flex items-center justify-center mx-auto mb-4 cursor-pointer"
                    whileHover={{ scale: 1.1, rotate: 10 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                  >
                    <span className="text-3xl">👤</span>
                  </motion.div>
                  <h3 className="text-2xl font-bold text-foreground mb-3">Expert Leadership</h3>
                  <p className="text-muted-foreground">
                    Led by CEO Hamza with years of automotive expertise
                  </p>
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="cursor-pointer text-center p-8 rounded-xl border border-border/50 hover:border-primary/50 bg-secondary/30 hover:bg-secondary/50 transition-all duration-300"
                >
                  <motion.div
                    className="w-16 h-16 bg-gradient-to-br from-primary/40 to-accent/40 rounded-full flex items-center justify-center mx-auto mb-4 cursor-pointer"
                    whileHover={{ scale: 1.1, rotate: 10 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                  >
                    <span className="text-3xl">📍</span>
                  </motion.div>
                  <h3 className="text-2xl font-bold text-foreground mb-3">Located in Islamabad</h3>
                  <p className="text-muted-foreground">
                    Visit our showroom or call us at 92 3333337270
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background relative overflow-hidden">
          {/* Glassmorphic Ferrari Background */}
          <FerrariParallax scrollRange={[0, 1000]} offsetX={50} />
          
          <ParallaxSection className="absolute inset-0 opacity-5">
            <div className="text-6xl font-bold text-primary">Trust</div>
          </ParallaxSection>
          <div className="max-w-7xl mx-auto relative z-10">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={containerVariants}
              className="mb-16"
            >
              <motion.h2
                variants={itemVariants}
                className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-center"
              >
                What Our Clients Say
              </motion.h2>
              <motion.p
                variants={itemVariants}
                className="text-muted-foreground text-lg text-center max-w-2xl mx-auto"
              >
                Experience the satisfaction of our valued customers who trust us with their exotic car purchases
              </motion.p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={containerVariants}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              {[
                {
                  name: "Ahmed Hassan",
                  role: "Business Entrepreneur",
                  content: "Auto Land International provided exceptional service. The Porsche 911 I purchased exceeded all my expectations. Highly recommended!",
                  rating: 5,
                },
                {
                  name: "Fatima Khan",
                  role: "Luxury Collector",
                  content: "The attention to detail and professionalism at Auto Land is unmatched. CEO Hamza and his team made the buying experience seamless and enjoyable.",
                  rating: 5,
                },
                {
                  name: "Muhammad Ali",
                  role: "Investment Manager",
                  content: "I trusted Auto Land with my exotic car investment. Their expertise and transparent pricing gave me complete confidence in my purchase.",
                  rating: 5,
                },
              ].map((testimonial, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="cursor-pointer p-8 rounded-xl border border-border/50 hover:border-primary/50 bg-secondary/30 hover:bg-secondary/50 transition-all duration-300 backdrop-blur-sm"
                >
                  <motion.div className="mb-4 flex gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <motion.span
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        className="text-accent text-lg"
                      >
                        ★
                      </motion.span>
                    ))}
                  </motion.div>

                  <motion.p
                    className="text-foreground mb-6 text-lg leading-relaxed italic"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    &quot;{testimonial.content}&quot;
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="border-t border-border/50 pt-4"
                  >
                    <p className="text-primary font-bold text-lg">{testimonial.name}</p>
                    <p className="text-muted-foreground text-sm">{testimonial.role}</p>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
