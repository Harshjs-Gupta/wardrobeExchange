# ImageKit.io Setup Guide

This project uses ImageKit.io for image storage and delivery. Follow these steps to set up ImageKit for your application.

## 1. Create ImageKit Account

1. Go to [ImageKit.io](https://imagekit.io/) and sign up for a free account
2. The free tier includes:
   - 20 GB storage
   - 20 GB bandwidth per month
   - Image optimization and transformations
   - CDN delivery

## 2. Get Your ImageKit Credentials

1. Log in to your ImageKit dashboard
2. Go to **Settings** → **Developer Options**
3. Copy the following credentials:
   - **URL Endpoint**: `https://ik.imagekit.io/your_imagekit_id`
   - **Public Key**: Your public API key
   - **Private Key**: Your private API key (keep this secret!)

## 3. Configure Environment Variables

1. Create a `.env.local` file in the root of your project (if it doesn't exist)
2. Add the following environment variables:

```env
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_imagekit_id
NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
NEXT_PUBLIC_IMAGEKIT_AUTH_ENDPOINT=/api/imagekit/auth
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
```

**Important:**
- Replace `your_imagekit_id` with your actual ImageKit ID
- Replace `your_imagekit_public_key` with your actual public key
- Replace `your_imagekit_private_key` with your actual private key
- The `IMAGEKIT_PRIVATE_KEY` should only be used server-side (in API routes)

## 4. Install ImageKit SDK

```bash
npm install imagekit
```

## 5. Configure ImageKit Dashboard

1. In your ImageKit dashboard, go to **Settings** → **Upload**
2. Configure upload settings:
   - Enable **Unsigned Upload** (for client-side uploads) OR
   - Use **Signed Upload** with authentication endpoint (recommended for production)

### For Unsigned Uploads (Development):
- Go to **Settings** → **Upload**
- Enable "Allow unsigned uploads"
- Add your domain to allowed origins (or use `*` for development)

### For Signed Uploads (Production):
- The authentication endpoint is already set up at `/api/imagekit/auth`
- You'll need to implement proper authentication in the API route

## 6. Test the Integration

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Try uploading an image through the "Add Item" page
3. Check your ImageKit dashboard to see if the image was uploaded successfully

## 7. Image Organization

Images are organized in ImageKit as follows:
```
/wardrobe-exchange/{userId}/{itemId}/{filename}
```

This structure helps:
- Organize images by user
- Group images by item
- Easy cleanup when items are deleted

## 8. Image Optimization

ImageKit automatically optimizes images. You can also use URL transformations:

```javascript
// Get optimized thumbnail
const thumbnailUrl = imageKitService.getThumbnailUrl(imageUrl, 300);

// Get optimized image with custom transformations
const optimizedUrl = imageKitService.getOptimizedUrl(imageUrl, {
  width: 800,
  height: 600,
  quality: 80,
  format: 'webp'
});
```

## 9. Troubleshooting

### Images not uploading?
- Check that your environment variables are set correctly
- Verify that ImageKit credentials are correct
- Check browser console for error messages
- Ensure ImageKit SDK is installed: `npm install imagekit`

### CORS errors?
- Add your domain to ImageKit's allowed origins
- Check ImageKit dashboard → Settings → Upload → Allowed Origins

### Authentication errors?
- Verify your public and private keys are correct
- Check that the authentication endpoint is accessible
- For production, implement proper authentication in the API route

## 10. Migration from localStorage

If you're migrating from localStorage:
- Old items with `imageIds` will show no images (legacy support)
- New items will use `imageUrls` from ImageKit
- Consider migrating old images to ImageKit if needed

## Resources

- [ImageKit Documentation](https://docs.imagekit.io/)
- [ImageKit JavaScript SDK](https://github.com/imagekit-developer/imagekit-javascript)
- [ImageKit Dashboard](https://imagekit.io/dashboard)
