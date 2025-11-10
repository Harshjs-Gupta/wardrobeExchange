# localStorage Image Storage Migration

## Overview

This project has been migrated from Firebase Storage to localStorage for image storage. This change provides several benefits:

- **Faster Performance**: No network requests for image loading
- **Offline Capability**: Images work without internet connection
- **Reduced Costs**: No Firebase Storage costs
- **Privacy**: Images stay on the user's device

## Architecture Changes

### Before (Firebase Storage)

- Images uploaded to Firebase Storage
- Image URLs stored in Firestore documents
- Images fetched from Firebase URLs

### After (localStorage)

- Images converted to base64 and stored in localStorage
- Image IDs stored in Firestore documents
- Images loaded from localStorage using base64 data

## New Services

### LocalStorageService (`src/services/localStorageService.js`)

Handles all localStorage operations for images:

```javascript
// Store images for a user
await LocalStorageService.storeImages(userId, images);

// Get all images for a user
const images = LocalStorageService.getImages(userId);

// Get specific images by IDs
const images = LocalStorageService.getImagesByIds(userId, imageIds);

// Delete images
LocalStorageService.deleteImages(userId, imageIds);

// Get storage usage
const usage = LocalStorageService.getStorageUsage(userId);
```

### Updated ItemService (`src/services/itemService.js`)

Modified to work with localStorage:

- `createItem()`: Stores images in localStorage, saves image IDs to Firestore
- `getItems()`: Loads images from localStorage for each item
- `getItem()`: Loads images from localStorage for single item
- `deleteItem()`: Deletes images from localStorage when item is deleted

## Updated Pages

### Add Item Page (`src/app/add-item/page.jsx`)

- Removed Firebase Storage imports
- Updated to use localStorage for image storage
- Added storage space validation

### Browse Page (`src/app/browse/page.jsx`)

- Updated image display to use `item.images[0].url` instead of `item.imageUrls[0]`

### Dashboard Page (`src/app/dashboard/page.jsx`)

- Updated image display to use `item.images[0].url`
- Added storage usage display in stats

### Item Detail Page (`src/app/item/[id]/page.jsx`)

- Updated main image display to use `item.images[0].url`
- Updated additional images to use `item.images[index].url`

## Storage Limits

localStorage has limitations:

- **Size Limit**: ~5-10MB total (varies by browser)
- **Per User**: Each user has their own storage space
- **Validation**: System checks available space before storing

## Testing

A test page has been created at `/test-localstorage` to verify functionality:

- Upload and store images
- View stored images
- Check storage usage
- Delete images
- Test storage limits

## Data Structure

### Image Object in localStorage

```javascript
{
  id: "userId_timestamp_index",
  data: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ...",
  name: "image.jpg",
  type: "image/jpeg",
  size: 1024000
}
```

### Item Object in Firestore

```javascript
{
  id: "itemId",
  title: "Item Title",
  description: "Item description",
  category: "t-shirt",
  size: "M",
  condition: "good",
  brand: "Nike",
  tags: ["casual", "cotton"],
  userId: "user123",
  imageIds: ["user123_1234567890_0", "user123_1234567890_1"],
  status: "available",
  createdAt: timestamp
}
```

## Migration Notes

### Existing Data

- Existing items with `imageUrls` will show fallback images
- New items will use localStorage storage
- No automatic migration of existing Firebase Storage images

### Browser Compatibility

- Works in all modern browsers
- localStorage is widely supported
- Base64 encoding is standard

### Performance Considerations

- Base64 encoding increases file size by ~33%
- localStorage access is synchronous and fast
- Large images may hit storage limits

## Usage Examples

### Adding an Item with Images

```javascript
const itemData = {
  title: "Vintage T-shirt",
  description: "Comfortable cotton t-shirt",
  category: "t-shirt",
  size: "M",
  condition: "good",
};

const images = [file1, file2, file3]; // File objects
const result = await ItemService.createItem(itemData, images, userId);
```

### Loading Items with Images

```javascript
const items = await ItemService.getItems();
// Each item now has an 'images' array with base64 data
items.forEach((item) => {
  item.images.forEach((image) => {
    console.log(image.url); // Base64 data URL
    console.log(image.name); // Original filename
  });
});
```

### Checking Storage Usage

```javascript
const usage = ItemService.getStorageUsage(userId);
console.log(usage.formattedSize); // "2.5 MB"
console.log(usage.imageCount); // 15
console.log(usage.totalSize); // 2621440 bytes
```

## Error Handling

The system includes comprehensive error handling:

- **Storage Full**: Prevents upload when localStorage is full
- **Invalid Files**: Filters out non-image files
- **Size Limits**: Validates file sizes before storage
- **Network Issues**: No network dependency for image loading

## Future Enhancements

Potential improvements:

- Image compression before storage
- Automatic cleanup of unused images
- Backup/restore functionality
- Cross-device synchronization (if needed)
