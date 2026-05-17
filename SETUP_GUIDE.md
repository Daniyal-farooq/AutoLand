# Setup Guide - Auto Land International

This guide will help you set up all required services for the Auto Land International website.

## Prerequisites

- Node.js 18+ and pnpm installed
- A MongoDB account (Atlas recommended)
- A Cloudinary account
- Git installed

## Step 1: MongoDB Setup

### Create MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for a free account
3. Create a new project named "Auto Land"
4. Click "Build a Cluster"
5. Select "M0 Shared" tier (free)
6. Choose your region (closest to your location)
7. Click "Create Cluster"

### Get Connection String

1. Go to "Database" section
2. Click "Connect" on your cluster
3. Select "Drivers" and "Node.js"
4. Copy the connection string
5. Replace `<password>` with your database password
6. It should look like: `mongodb+srv://username:password@cluster.mongodb.net/autoland?retryWrites=true&w=majority`

### Add Database User

1. Go to "Security" → "Database Access"
2. Click "Add New Database User"
3. Create username and password
4. Choose "Built-in Role" → "Atlas Admin"
5. Click "Create User"

### Allow Network Access

1. Go to "Security" → "Network Access"
2. Click "Add IP Address"
3. Select "Allow Access from Anywhere" (for development)
4. Click "Confirm"

## Step 2: Cloudinary Setup

### Create Cloudinary Account

1. Go to [Cloudinary](https://cloudinary.com/)
2. Sign up for a free account
3. Verify your email

### Get API Credentials

1. Go to Dashboard
2. You'll see:
   - **Cloud Name**: Your unique identifier
   - **API Key**: For authentication
   - **API Secret**: Keep this private

3. Find your API Secret:
   - Click "Settings" (gear icon)
   - Go to "API Keys" tab
   - Your API Secret will be displayed there

### Configure Upload Settings

1. Go to "Settings" → "Upload"
2. Click "Add upload preset"
3. Set name to "autoland"
4. Set "Signing Mode" to "Unsigned"
5. Save

## Step 3: Project Setup

### Clone and Install

```bash
# Clone the repository
git clone <your-repo-url>
cd auto-land-international

# Install dependencies
pnpm install
```

### Create Environment File

1. In the project root, create `.env.local`:

```env
# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/autoland?retryWrites=true&w=majority

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# NextAuth
NEXTAUTH_SECRET=generate-a-random-string-here
NEXTAUTH_URL=http://localhost:3000
```

### Generate NEXTAUTH_SECRET

```bash
# Run this in terminal to generate a random secret
openssl rand -base64 32
```

## Step 4: Initialize Database

### Seed Sample Data

```bash
# This will add sample vehicles, gallery items, and default admin user
pnpm ts-node scripts/seed.ts
```

Or manually in MongoDB:

```javascript
// Add this to your MongoDB directly
db.admins.insertOne({
  email: "admin@autoland.com",
  password: "hashed_password",
  name: "Admin",
  createdAt: new Date(),
  updatedAt: new Date()
})
```

## Step 5: Run Development Server

```bash
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000)

### Test Admin Panel

1. Go to http://localhost:3000/admin/login
2. Use credentials from seeded data:
   - Email: `admin@autoland.com`
   - Password: `admin123`

## Step 6: Configure Site Information

Update the following in your code:

### In `components/Footer.tsx` and `components/Navigation.tsx`:
- Company name
- Contact number
- CEO name
- Google Maps URL

### In `app/contact/page.tsx`:
- Contact email
- Contact details
- Map iframe URL

## Step 7: Add Sample Data

### Method 1: Use Admin Dashboard

1. Login to admin panel
2. Click "Add Vehicle"
3. Fill in all details
4. Upload image (automatic Cloudinary upload)
5. Click "Add Vehicle"

### Method 2: Use Seed Script

Edit `scripts/seed.ts` with your vehicle data and run:

```bash
pnpm ts-node scripts/seed.ts
```

## Step 8: Production Deployment

### Vercel Deployment

1. Push code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Add environment variables:
   - MONGODB_URI
   - CLOUDINARY_CLOUD_NAME
   - CLOUDINARY_API_KEY
   - CLOUDINARY_API_SECRET
   - NEXTAUTH_SECRET (generate new one)
   - NEXTAUTH_URL (your domain)
6. Click "Deploy"

### Update DNS

1. In Vercel, go to "Settings" → "Domains"
2. Follow instructions to point your domain

## Troubleshooting

### "MONGODB_URI is not defined"
- Check `.env.local` file exists
- Verify MongoDB URI is correct
- Restart dev server with `pnpm dev`

### Image uploads fail
- Verify Cloudinary credentials in `.env.local`
- Check Cloudinary API limits
- Ensure image format is supported

### Admin login fails
- Check browser console for errors
- Verify admin user exists in MongoDB
- Clear cookies and try again

### NextAuth errors
- Generate a new `NEXTAUTH_SECRET`
- Check NEXTAUTH_URL matches your domain
- Ensure cookies are enabled

## Testing Checklist

- [ ] Home page loads with navigation
- [ ] Collection page shows vehicles
- [ ] Gallery page displays images
- [ ] Contact form submits
- [ ] Admin login works
- [ ] Can add vehicle from dashboard
- [ ] Can upload image to Cloudinary
- [ ] Can delete vehicle
- [ ] Can add gallery item
- [ ] Footer displays company info

## Next Steps

1. Customize company information
2. Add more vehicle listings
3. Upload professional car images
4. Customize color scheme in `globals.css`
5. Set up custom domain
6. Configure email notifications (optional)
7. Add analytics (Google Analytics, Vercel Analytics)

## Support

For detailed documentation on each service:
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com/)
- [Cloudinary Docs](https://cloudinary.com/documentation)
- [Next.js Docs](https://nextjs.org/docs)
- [Framer Motion Docs](https://www.framer.com/motion/)
