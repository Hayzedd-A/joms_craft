# Digital Catalog App

A production-ready Next.js digital catalog / price list web app designed for small businesses.

## Features

- **Mobile-first, responsive design** - Works perfectly on all devices
- **No user authentication required** - Customers can browse freely
- **Anonymous user tracking** - Each visitor gets a unique ID stored in localStorage
- **Category-based browsing** - Tab navigation to switch between categories
- **Search functionality** - Search items across all categories
- **Favourite system** - Users can favourite items (saved locally + database)
- **WhatsApp integration** - Click-to-Chat with pre-filled messages
- **Admin panel** - Protected admin section for managing items
- **Image uploads** - Cloudinary integration for image storage
- **Favourites insights** - Admin view of most favourited items

## Tech Stack

- **Framework**: Next.js 16 with React 19
- **Database**: MongoDB with Mongoose
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Image Hosting**: Cloudinary

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

Required environment variables:

```env
# MongoDB Connection String
MONGODB_URI=mongodb://localhost:27017/catelog

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Admin Credentials
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_secure_password

# WhatsApp Number (format: 1234567890, no + sign)
WHATSAPP_NUMBER=1234567890

# Business Name
NEXT_PUBLIC_BUSINESS_NAME=Your Business Name
```

### 3. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
catelog/
├── app/
│   ├── api/
│   │   ├── admin/
│   │   │   ├── insights/route.ts   # Favourites insights endpoint
│   │   │   └── login/route.ts      # Admin login endpoint
│   │   ├── categories/route.ts     # Get all categories
│   │   ├── favourites/route.ts     # Favourite items endpoint
│   │   ├── items/
│   │   │   ├── [id]/route.ts       # Item CRUD operations
│   │   │   └── route.ts            # Items list endpoint
│   │   └── upload/route.ts         # Image upload endpoint
│   ├── admin/
│   │   ├── dashboard/page.tsx      # Admin dashboard
│   │   ├── insights/page.tsx       # Favourites insights
│   │   ├── items/page.tsx          # Manage items
│   │   └── login/page.tsx          # Admin login
│   ├── globals.css                 # Global styles
│   ├── layout.tsx                  # Root layout
│   └── page.tsx                    # Landing page
├── components/
│   ├── AdminLayout.tsx             # Admin sidebar layout
│   ├── AdminSidebar.tsx            # (if separate)
│   ├── CatalogClient.tsx           # Main catalog client
│   ├── CategoryTabs.tsx            # Category navigation
│   ├── Header.tsx                  # App header
│   ├── ItemCard.tsx                # Item display card
│   ├── ItemForm.tsx                # Item add/edit form
│   └── ItemModal.tsx               # Item detail modal
├── hooks/
│   └── useAnonymousUser.ts         # Anonymous user ID hook
├── lib/
│   ├── cloudinary.ts               # Cloudinary utilities
│   └── mongodb.ts                  # MongoDB connection
├── models/
│   ├── Favourite.ts                # Favourite model
│   └── Item.ts                     # Item model
├── .env.local                      # Environment variables
├── .env.example                    # Environment template
├── next.config.ts                  # Next.js config
├── package.json
└── tailwind.config.ts              # Tailwind config
```

## Admin Panel

Access the admin panel at `/admin/login`

Default credentials (set in environment variables):
- Username: `admin`
- Password: `admin123` (change in production!)

### Admin Features

1. **Dashboard** - Overview stats (total items, categories, favourites)
2. **Manage Items** - Add, edit, delete items with image uploads
3. **Insights** - View most favourited items and user engagement

## Customer Features

1. **Browse Items** - Grid view of all items
2. **Filter by Category** - Tab-based category navigation
3. **Search** - Search items across all categories
4. **Favourite Items** - Save items to favourites
5. **Share via WhatsApp** - Send item details to business

## API Endpoints

### Items
- `GET /api/items` - Get all items (with optional `?category=xxx`)
- `POST /api/items` - Create new item
- `GET /api/items/[id]` - Get single item
- `PUT /api/items/[id]` - Update item
- `DELETE /api/items/[id]` - Delete item

### Categories
- `GET /api/categories` - Get all categories

### Favourites
- `GET /api/favourites?userId=xxx` - Get user's favourites
- `POST /api/favourites` - Toggle favourite (requires `itemId`, `anonymousUserId`)

### Admin
- `POST /api/admin/login` - Admin login
- `GET /api/admin/insights` - Get favourites insights

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Docker

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
CMD ["npm", "start"]
```

## Production Considerations

1. **Change admin credentials** - Use strong passwords in environment variables
2. **Use production MongoDB** - Consider MongoDB Atlas for cloud database
3. **Configure Cloudinary** - Set up proper Cloudinary credentials
4. **HTTPS** - Ensure SSL certificate for production
5. **Rate limiting** - Add rate limiting to API endpoints
6. **Error handling** - Improve error logging and monitoring

## License

MIT

