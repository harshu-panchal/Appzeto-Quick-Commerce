# How to Add More Icons to the Library

## Quick Guide

To add new icons to the category icon library, follow these steps:

### 1. Find Your Icon

Good sources for icons:
- **Lucide Icons**: https://lucide.dev/ (recommended - matches existing UI)
- **Heroicons**: https://heroicons.com/
- **Feather Icons**: https://feathericons.com/
- **Font Awesome**: https://fontawesome.com/ (free icons)

### 2. Get the SVG Code

1. Find the icon you want
2. Copy the SVG code (usually a "Copy SVG" button)
3. Make sure it includes these attributes:
   - `viewBox="0 0 24 24"`
   - `fill="none"`
   - `stroke="currentColor"`
   - `stroke-width="2"`

Example SVG:
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="..."/>
</svg>
```

### 3. Add to Icon Library

Open `frontend/src/shared/constants/categoryIcons.js` and add your icon to the `categoryIcons` array:

```javascript
export const categoryIcons = [
  // ... existing icons ...
  {
    id: 'your-icon-id',           // Unique identifier (lowercase, use hyphens)
    name: 'Your Icon Name',        // Display name (user-friendly)
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="..."/></svg>`
  },
];
```

### 4. Example: Adding a "Camera" Icon

```javascript
{
  id: 'camera',
  name: 'Photography',
  svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>`
}
```

## Best Practices

### Icon ID Naming
- Use lowercase letters
- Use hyphens for spaces (e.g., `home-appliances`)
- Keep it short but descriptive
- Must be unique

### Icon Name
- Use proper capitalization
- Be descriptive and user-friendly
- Match the category it represents

### SVG Requirements
- Must have `viewBox="0 0 24 24"` for consistent sizing
- Use `stroke="currentColor"` so icons inherit text color
- Keep `stroke-width="2"` for consistency
- Remove any hardcoded colors (use `currentColor` instead)

## Testing Your New Icon

1. Save the changes to `categoryIcons.js`
2. Restart the development server if needed
3. Go to Admin Panel → Header Categories
4. Click "Add New Header"
5. Click "Select Icon"
6. Search for your new icon by name
7. Verify it displays correctly

## Troubleshooting

### Icon Not Showing Up
- Check that the icon object is properly formatted
- Ensure there's a comma after the previous icon
- Verify the SVG string is wrapped in backticks
- Check browser console for errors

### Icon Looks Wrong
- Verify `viewBox="0 0 24 24"` is present
- Check that `stroke="currentColor"` is used (not hardcoded colors)
- Ensure `stroke-width="2"` matches other icons
- Remove any `width` or `height` attributes from the SVG

### Icon Not Searchable
- Check that the `name` field is set correctly
- Search is case-insensitive, so "Photography" matches "photo"

## Advanced: Custom Icon Sets

If you want to use a completely different icon set:

1. Create a new file: `frontend/src/shared/constants/customIcons.js`
2. Export a similar array structure
3. Import it in the components that need it
4. Or merge it with the existing `categoryIcons` array

Example:
```javascript
// customIcons.js
export const customIcons = [
  { id: 'custom1', name: 'Custom Icon 1', svg: '...' },
  { id: 'custom2', name: 'Custom Icon 2', svg: '...' },
];

// In categoryIcons.js
import { customIcons } from './customIcons';

export const categoryIcons = [
  ...existingIcons,
  ...customIcons
];
```

## Icon Library Size

Current library: 20 icons
Recommended maximum: 50-100 icons (for good UX in the selector)

If you need more icons, consider:
- Categorizing icons into groups
- Adding pagination to the icon selector
- Implementing lazy loading
