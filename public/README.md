# Public Directory

This folder contains **static assets** that are served directly to the browser - images, icons, and other files that don't need processing. Next.js automatically serves everything in this folder from the root URL.

## 📁 Structure

```
public/
├── icons/              # UI icons (SVG format)
│   ├── arrow-down.svg
│   ├── audience.svg
│   ├── calendar.svg
│   ├── clock.svg
│   ├── logo.png
│   ├── mode.svg
│   └── pin.svg
├── images/             # Event images (PNG format)
│   ├── event1.png
│   ├── event2.png
│   ├── event3.png
│   ├── event4.png
│   ├── event5.png
│   ├── event6.png
│   └── event-full.png
└── *.svg               # Default Next.js files
```

## 🎯 What's Inside

### `icons/` Folder
Contains small icon graphics used throughout the UI

#### `logo.png`
- **Used in**: Navigation bar
- **Purpose**: Brand identity/logo
- **Where**: Top-left corner of every page
- **Component**: `<NavBar />`

#### `arrow-down.svg`
- **Used in**: Explore button
- **Purpose**: Visual indicator to scroll down
- **Where**: Home page hero section
- **Component**: `<ExploreBtn />`

#### `calendar.svg`
- **Used in**: Event cards and event details
- **Purpose**: Indicates event date
- **Where**: Next to date information
- **Components**: `<EventCard />`, event details page

#### `clock.svg`
- **Used in**: Event cards and event details
- **Purpose**: Indicates event time
- **Where**: Next to time information
- **Components**: `<EventCard />`, event details page

#### `pin.svg`
- **Used in**: Event cards and event details
- **Purpose**: Indicates event location
- **Where**: Next to location information
- **Components**: `<EventCard />`, event details page

#### `mode.svg`
- **Used in**: Event details page
- **Purpose**: Indicates event mode (online/offline/hybrid)
- **Where**: Event details section
- **Component**: Event details page

#### `audience.svg`
- **Used in**: Event details page
- **Purpose**: Indicates target audience
- **Where**: Event details section
- **Component**: Event details page

---

### `images/` Folder
Contains event poster/banner images

#### `event1.png` through `event6.png`
- **Used in**: Event cards as preview images
- **Purpose**: Visual representation of events
- **Where**: Home page, similar events section
- **Component**: `<EventCard />`
- **Note**: These are sample/placeholder images

#### `event-full.png`
- **Purpose**: Full-size event banner
- **Where**: Event details page
- **Note**: Example of detailed event image

---

### Root Level Files
Default Next.js placeholder files (not actively used):
- `file.svg`
- `globe.svg`
- `next.svg`
- `vercel.svg`
- `window.svg`

---

## 🔗 How to Use Public Assets

### In Next.js Image Component
```tsx
import Image from 'next/image';

<Image 
  src="/icons/logo.png"      // Path relative to public/
  alt="Logo"
  width={24}
  height={24}
/>
```

### In Regular HTML img Tag
```tsx
<img src="/icons/calendar.svg" alt="Calendar" />
```

### In CSS
```css
.hero {
  background-image: url('/images/event-full.png');
}
```

### URL Path
Files in `public/` are accessible from the root URL:
- `public/icons/logo.png` → `http://localhost:3000/icons/logo.png`
- `public/images/event1.png` → `http://localhost:3000/images/event1.png`

---

## 🎨 Why Use the Public Folder?

### Advantages
1. **Simple**: No import needed, just reference by path
2. **Cacheable**: Browser can cache these files
3. **CDN-Ready**: Can be served from a CDN
4. **Version Control**: Images are tracked in Git

### When to Use
✅ **Good for**:
- Logos and branding
- Icons that don't change often
- Favicons
- Robots.txt, sitemap.xml
- Static images

❌ **Not ideal for**:
- Images that change frequently
- User-uploaded content (use Cloudinary instead)
- Images that need processing/optimization

---

## 🔗 How Public Assets Connect to the Project

### Component Usage Map

```
NavBar.tsx
  └── /icons/logo.png

ExploreBtn.tsx
  └── /icons/arrow-down.svg

EventCard.tsx
  ├── /icons/pin.svg
  ├── /icons/calendar.svg
  ├── /icons/clock.svg
  └── /images/event[1-6].png

Event Details Page
  ├── /icons/calendar.svg
  ├── /icons/clock.svg
  ├── /icons/pin.svg
  ├── /icons/mode.svg
  ├── /icons/audience.svg
  └── Event banner (from Cloudinary)
```

### Image Flow

```
Development:
public/images/event1.png → Browser

Production (Event Banners):
Upload to Cloudinary → Get URL → Store in Database → Display in Browser
```

---

## 📝 Key Concepts for Beginners

### What is a Static Asset?
A **static asset** is a file that doesn't change based on user input or application state. Examples:
- Icons
- Logos
- CSS files
- JavaScript libraries
- Images

### SVG vs PNG
**SVG (Scalable Vector Graphics)**:
- Vector format (scales without quality loss)
- Small file size
- Perfect for icons, logos, simple graphics
- Can be styled with CSS
- Example: All icons in `/icons/` folder

**PNG (Portable Network Graphics)**:
- Raster format (made of pixels)
- Larger file size
- Good for photos and complex images
- Fixed resolution
- Example: Event images

### Next.js Image Component Benefits
```tsx
// Regular img tag
<img src="/images/event1.png" />

// Next.js Image component (better!)
<Image src="/images/event1.png" width={400} height={300} />
```

**Benefits of Next.js `<Image>`**:
1. **Automatic optimization**: Converts to WebP format
2. **Lazy loading**: Only loads when visible
3. **Responsive**: Serves different sizes for different screens
4. **Performance**: Faster page loads

---

## 🚀 Adding New Assets

### Adding an Icon
1. Save SVG file to `public/icons/`
2. Use in component:
```tsx
<Image src="/icons/my-icon.svg" alt="..." width={20} height={20} />
```

### Adding an Image
1. Save image to `public/images/`
2. Optimize image size before adding (use tools like TinyPNG)
3. Use in component:
```tsx
<Image src="/images/my-image.png" alt="..." width={400} height={300} />
```

### Organizing Assets
**Best Practices**:
- Use folders to organize by type (`icons/`, `images/`, `fonts/`)
- Use descriptive names (`calendar.svg` not `icon1.svg`)
- Keep file sizes small (compress images)
- Use SVG for icons (scalable, smaller size)
- Use appropriate image formats (PNG for photos, SVG for icons)

---

## 🔒 Security Considerations

### What NOT to Put in Public
❌ **Never put sensitive data in public folder**:
- API keys
- Environment variables
- Private user data
- Database credentials
- Internal documents

**Why?** Everything in `public/` is accessible to anyone who visits your website.

### What's Safe
✅ **Safe to put in public**:
- Logos and branding
- Icon graphics
- Sample/demo images
- Public documents (terms of service, etc.)
- Favicons

---

## 💡 Image Optimization Tips

### Cloudinary for User-Uploaded Images
This project uses Cloudinary for event banners:
```typescript
// When creating event
POST /api/events
  → Uploads image to Cloudinary
  → Saves Cloudinary URL to database
  → Image served from Cloudinary CDN (fast!)
```

**Why Cloudinary?**
- **Automatic optimization**: Serves best format for each browser
- **Transformations**: Resize, crop, filter on-the-fly
- **CDN**: Fast global delivery
- **Storage**: No need to store images on your server

### When to Use What

**Use `public/` folder**:
- Static images that are part of the design
- Icons and logos
- Images that don't change

**Use Cloudinary (or similar)**:
- User-uploaded images
- Images that need processing
- Dynamic content
- Large image libraries

---

## 📦 File Size Guidelines

**Recommended sizes**:
- **Icons**: < 10 KB (prefer SVG)
- **Logos**: < 50 KB
- **Preview images**: < 200 KB
- **Full-size images**: < 500 KB

**Optimization Tools**:
- **TinyPNG**: Compress PNG/JPG images
- **SVGOMG**: Optimize SVG files
- **ImageOptim**: Batch compress images
- **Squoosh**: Google's image optimizer

---

## 🔍 Troubleshooting

### Image Not Loading?
1. Check file path (case-sensitive!)
2. Verify file exists in `public/` folder
3. Check file extension (`.png` not `.PNG`)
4. Restart dev server after adding new files

### Image Quality Issues?
1. Use higher resolution source image
2. Use appropriate format (PNG for photos, SVG for icons)
3. Check Next.js Image component quality prop
4. Verify image isn't being scaled up too much

### Slow Loading?
1. Compress images before adding
2. Use Next.js Image component (not `<img>`)
3. Consider using Cloudinary for large images
4. Enable caching in production
