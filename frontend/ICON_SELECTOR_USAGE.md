# Icon Selector - Usage Guide

## Feature Overview
When creating or editing a header category, admins can now choose between:
1. Selecting a pre-designed SVG icon from a library of 20 icons
2. Uploading a custom image (existing functionality)

## How to Use

### Creating a New Header Category with Icon

1. Navigate to: **Admin Panel → Category Management → Header Categories**

2. Click the **"Add New Header"** button

3. In the modal, you'll see two options side by side:
   - **Left**: SVG Icon selector (with "Select Icon" button)
   - **Right**: Custom image uploader (with "Upload" button)

4. Click **"Select Icon"** to open the icon library

5. In the Icon Selector Modal:
   - Browse through 20 category icons displayed in a grid
   - Use the search bar to filter icons (e.g., type "food" to find food-related icons)
   - Click on any icon to select it
   - The selected icon will be highlighted with a blue border
   - Click "Done" to confirm your selection

6. Fill in the category details:
   - **Name**: Category display name (e.g., "Electronics")
   - **Slug**: URL-friendly identifier (e.g., "electronics")
   - **Status**: Active or Inactive

7. Click **"Create Header"** to save

### Editing an Existing Category

1. Click the **Edit** icon (pencil) next to any category in the table

2. The modal opens with current values pre-filled

3. To change the icon:
   - Click **"Change Icon"** to select a different SVG icon
   - OR click the image upload area to replace with a custom image

4. Click **"Update Header"** to save changes

## Icon Library

The library includes 20 icons for common categories:

| Icon ID | Category Name |
|---------|---------------|
| electronics | Electronics |
| fashion | Fashion |
| home | Home & Living |
| food | Food & Beverages |
| sports | Sports & Fitness |
| books | Books & Media |
| beauty | Beauty & Personal Care |
| toys | Toys & Games |
| automotive | Automotive |
| pets | Pet Supplies |
| health | Health & Wellness |
| garden | Garden & Outdoor |
| office | Office Supplies |
| music | Musical Instruments |
| jewelry | Jewelry & Accessories |
| baby | Baby Products |
| tools | Tools & Hardware |
| luggage | Luggage & Travel |
| art | Art & Crafts |
| grocery | Grocery |

## Display Priority

When displaying a category:
1. **First**: SVG icon (if selected)
2. **Second**: Custom uploaded image (if no icon selected)
3. **Third**: Placeholder icon (if neither is available)

## Benefits

✅ **Consistent Design**: All icons follow the same visual style
✅ **Fast Loading**: SVG icons load instantly (no image downloads)
✅ **Searchable**: Quickly find the right icon using search
✅ **No Storage Costs**: Icons are embedded, not stored as files
✅ **Flexible**: Can still use custom images when needed
✅ **Scalable**: Icons look sharp at any size

## Tips

- Use SVG icons for standard categories (faster and more consistent)
- Use custom images for unique or branded categories
- The search function in the icon selector is case-insensitive
- Icons automatically adapt to the theme colors
- You can switch between icon and image at any time

## Technical Details

- Icons are stored as identifiers (e.g., "electronics") in the database
- SVG code is rendered client-side from the icon library
- No additional API calls needed to display icons
- Backward compatible with existing image-based categories
