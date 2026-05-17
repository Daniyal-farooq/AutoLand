'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
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
    <motion.footer
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={containerVariants}
      className="bg-secondary/50 border-t border-border mt-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <motion.div variants={itemVariants}>
            <h3 className="text-primary font-bold text-lg mb-4">AUTO LAND INTERNATIONAL</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Experience luxury with our curated collection of exotic cars. CEO: Hamza
            </p>
            <p className="text-muted-foreground text-sm">
              <strong>Contact:</strong> 92 3333337270
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemVariants}>
            <h4 className="font-semibold text-foreground mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-primary transition-colors cursor-pointer">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/collection"
                  className="text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                >
                  Collection
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="text-muted-foreground hover:text-primary transition-colors cursor-pointer">
                  Gallery
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors cursor-pointer">
                  Contact
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Services */}
          <motion.div variants={itemVariants}>
            <h4 className="font-semibold text-foreground mb-4">Services</h4>
            <ul className="space-y-2">
              <li>
                <span className="text-muted-foreground">Vehicle Sales</span>
              </li>
              <li>
                <span className="text-muted-foreground">Expert Consultation</span>
              </li>
              <li>
                <span className="text-muted-foreground">Premium Collection</span>
              </li>
              <li>
                <span className="text-muted-foreground">Financing Options</span>
              </li>
            </ul>
          </motion.div>

          {/* Location */}
          <motion.div variants={itemVariants}>
            <h4 className="font-semibold text-foreground mb-4">Location</h4>
            <p className="text-muted-foreground text-sm mb-4">
              Auto Land International
              <br />
              Islamabad, Pakistan
            </p>
            <a
              href="https://www.google.com/maps/place/Auto+Land+International/@31.4394149,73.1330939,20z/data=!4m6!3m5!1s0x3922686895555555:0x7314aed73a45b31a!8m2!3d31.4394516!4d73.1330354!16s%2Fg%2F11pbd__1s9?entry=ttu&g_ep=EgoyMDI2MDUxMy4wIKXMDSoASAFQAw%3D%3D"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-accent transition-colors text-sm font-medium"
            >
              View on Maps
            </a>
          </motion.div>
        </div>

        {/* Divider */}
        <motion.div variants={itemVariants} className="border-t border-border mt-8 pt-8">
          <p className="text-center text-muted-foreground text-sm">
            &copy; {currentYear} Auto Land International. All rights reserved. | Luxury Exotic Cars
          </p>
        </motion.div>
      </div>
    </motion.footer>
  );
}
