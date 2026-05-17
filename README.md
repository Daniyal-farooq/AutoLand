# Auto Land International - Exotic Car Dealership Website

A modern, full-stack web application for managing and showcasing exotic automobiles. Built with Next.js, MongoDB, Cloudinary, and Framer Motion.

## Features

- **Public Showcase Pages**
  - Home page with hero section and featured cars
  - Collection page with category-based filtering (Sports, Luxury, SUV, Convertible, Exotic)
  - Gallery page with image showcase and modal viewing
  - Contact page with embedded Google Maps and contact form

- **Admin CRM Dashboard**
  - Secure authentication with JWT tokens
  - Vehicle management (Create, Read, Update, Delete)
  - Gallery management for promotional content
  - Cloudinary integration for seamless image uploads
  - Real-time data updates

- **Technology Stack**
  - **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS
  - **Animations**: Framer Motion
  - **Database**: MongoDB with Mongoose
  - **Image Storage**: Cloudinary
  - **Authentication**: Custom JWT-based auth with bcryptjs
  - **Styling**: Custom design tokens with luxury aesthetic

## Setup Instructions

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Environment Variables

Create a `.env.local` file in the root directory:

```env
# MongoDB Connection
MONGODB_URI=your_mongodb_connection_string

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# NextAuth Configuration
NEXTAUTH_SECRET=your-secret-key-change-this-in-production
NEXTAUTH_URL=http://localhost:3000
```

### 3. Seed Database (Optional)

To populate sample data:

```bash
pnpm ts-node scripts/seed.ts
```

This will add:
- 3 sample vehicles (Porsche 911, Bentley Continental, Lamborghini Huracán)
- 3 sample gallery items
- Default admin user (email: `admin@autoland.com`, password: `admin123`)

### 4. Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Project Structure

```
/app
  /api
    /auth - Authentication endpoints
    /upload - Cloudinary upload handler
    /vehicles - Vehicle CRUD endpoints
    /gallery - Gallery CRUD endpoints
  /admin
    /login - Admin login page
    /dashboard - Admin dashboard with CRM
  /collection - Vehicle collection page
  /gallery - Gallery showcase page
  /contact - Contact page
  page.tsx - Home page

/components
  Navigation.tsx - Main navigation bar
  Footer.tsx - Footer component

/lib
  db.ts - MongoDB connection
  models/
    Vehicle.ts - Vehicle schema
    GalleryItem.ts - Gallery schema
    Admin.ts - Admin user schema
  middleware.ts - JWT authentication middleware

/public
  /cars - Sample car images
```

## Admin Dashboard Usage

### Login
1. Navigate to `/admin/login`
2. Enter credentials:
   - Email: `admin@autoland.com`
   - Password: `admin123` (change after first login)

### Manage Vehicles
1. Click "Manage Vehicles" tab
2. View all vehicles with quick actions
3. Delete vehicles individually

### Add New Vehicle
1. Click "Add Vehicle" tab
2. Fill in vehicle details:
   - Brand, Model, Name
   - Category (Sports, Luxury, SUV, Convertible, Exotic)
   - Year and Price
   - Engine specifications (Engine type, Horsepower, Top Speed, Acceleration, Transmission)
   - Description
3. Upload image via Cloudinary integration
4. Click "Add Vehicle"

### Manage Gallery
1. Click "Manage Gallery" tab
2. View and delete gallery items

### Add Gallery Item
1. Click "Add Gallery Item" tab
2. Fill in title, brand, description, and specifications
3. Upload image
4. Click "Add to Gallery"

## API Endpoints

### Vehicles
- `GET /api/vehicles` - Get all vehicles (with optional ?category filter)
- `GET /api/vehicles/[id]` - Get specific vehicle
- `POST /api/vehicles` - Create new vehicle
- `PUT /api/vehicles/[id]` - Update vehicle
- `DELETE /api/vehicles/[id]` - Delete vehicle

### Gallery
- `GET /api/gallery` - Get all gallery items
- `GET /api/gallery/[id]` - Get specific gallery item
- `POST /api/gallery` - Create new gallery item
- `PUT /api/gallery/[id]` - Update gallery item
- `DELETE /api/gallery/[id]` - Delete gallery item

### Authentication
- `POST /api/auth/register` - Create new admin user
- `POST /api/auth/login` - Admin login

### Upload
- `POST /api/upload` - Upload image to Cloudinary

## Company Information

- **Name**: Auto Land International
- **CEO**: Hamza
- **Contact**: 92 3333337270
- **Location**: Islamabad, Pakistan
- **Website**: https://www.google.com/maps/place/Auto+Land+International/

## Design Features

- **Color Scheme**: Luxury-focused with gold (D4A574), deep blacks, and accent red (C41E3A)
- **Typography**: Clean, professional fonts optimized for readability
- **Animations**: Smooth Framer Motion transitions on all interactive elements
- **Responsive Design**: Fully responsive from mobile to desktop

## Production Deployment

1. Update `NEXTAUTH_URL` to your production domain
2. Use a strong `NEXTAUTH_SECRET` in production
3. Ensure MongoDB and Cloudinary credentials are set in production environment
4. Deploy to Vercel:

```bash
git push origin main
```

## Troubleshooting

### MongoDB Connection Error
- Verify `MONGODB_URI` is correct
- Ensure database user has proper permissions
- Check network access settings in MongoDB Atlas

### Cloudinary Upload Fails
- Verify API credentials are correct
- Check folder permissions in Cloudinary dashboard
- Ensure image format is supported (JPEG, PNG, GIF, WebP)

### Admin Login Not Working
- Clear browser cookies
- Check token expiration in browser console
- Verify admin user exists in database

## License

This project is proprietary to Auto Land International.

## Support

For issues or feature requests, contact the development team.
