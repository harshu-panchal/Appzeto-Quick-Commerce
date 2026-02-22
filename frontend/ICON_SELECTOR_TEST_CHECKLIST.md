# Icon Selector - Test Checklist

## Pre-Testing Setup

- [ ] Backend server is running
- [ ] Frontend dev server is running
- [ ] Logged in as admin user
- [ ] Navigate to: Admin Panel → Category Management → Header Categories

## Basic Functionality Tests

### Creating New Category with Icon

- [ ] Click "Add New Header" button
- [ ] Modal opens successfully
- [ ] Click "Select Icon" button
- [ ] Icon selector modal opens
- [ ] All 20 icons are visible in grid layout
- [ ] Icons are properly aligned and sized
- [ ] Click on "Electronics" icon
- [ ] Icon is highlighted with blue border
- [ ] Click "Done" button
- [ ] Modal closes and selected icon appears in the form
- [ ] Fill in Name: "Test Electronics"
- [ ] Fill in Slug: "test-electronics"
- [ ] Click "Create Header"
- [ ] Success toast appears
- [ ] New category appears in table with icon
- [ ] Icon displays correctly in table row

### Creating New Category with Custom Image

- [ ] Click "Add New Header" button
- [ ] Click on the upload area (right side)
- [ ] Select an image file
- [ ] Image preview appears
- [ ] Fill in Name: "Test Custom"
- [ ] Fill in Slug: "test-custom"
- [ ] Click "Create Header"
- [ ] Success toast appears
- [ ] New category appears with custom image

### Editing Existing Category

- [ ] Click edit icon on a category
- [ ] Modal opens with existing data
- [ ] Current icon/image is displayed
- [ ] Click "Change Icon" (if icon exists) or "Select Icon"
- [ ] Select a different icon
- [ ] Click "Done"
- [ ] New icon appears in form
- [ ] Click "Update Header"
- [ ] Success toast appears
- [ ] Table updates with new icon

## Search Functionality Tests

### Icon Search

- [ ] Open icon selector modal
- [ ] Type "food" in search box
- [ ] Only "Food & Beverages" icon appears
- [ ] Type "fashion"
- [ ] Only "Fashion" icon appears
- [ ] Type "xyz" (non-existent)
- [ ] "No icons found" message appears
- [ ] Clear search box
- [ ] All icons reappear
- [ ] Search is case-insensitive (try "FOOD")

## Icon Selection Tests

### Single Selection

- [ ] Open icon selector
- [ ] Click "Electronics" icon
- [ ] Icon is highlighted
- [ ] Click "Fashion" icon
- [ ] Only "Fashion" is highlighted (single selection)
- [ ] Previous selection is cleared

### Selection Persistence

- [ ] Select an icon
- [ ] Click "Done"
- [ ] Reopen icon selector
- [ ] Previously selected icon is still highlighted
- [ ] Click "Done" without changing
- [ ] Selection remains the same

### Cancel Selection

- [ ] Open icon selector
- [ ] Select an icon
- [ ] Click X (close button)
- [ ] Modal closes
- [ ] Previous selection is retained (not changed)

## Display Priority Tests

### Icon vs Image Priority

- [ ] Create category with icon only
- [ ] Verify icon displays in table
- [ ] Edit category and add custom image
- [ ] Verify icon still displays (takes priority)
- [ ] Edit category and remove icon (clear iconId)
- [ ] Verify custom image now displays

### Fallback Display

- [ ] Create category without icon or image
- [ ] Verify placeholder icon displays
- [ ] Placeholder is gray Image icon

## UI/UX Tests

### Modal Behavior

- [ ] Modal has backdrop blur effect
- [ ] Clicking outside modal doesn't close it
- [ ] X button closes modal
- [ ] ESC key closes modal (if implemented)
- [ ] Modal is centered on screen
- [ ] Modal is scrollable if content overflows

### Icon Grid Layout

- [ ] Icons are evenly spaced
- [ ] Grid is responsive (6 columns on desktop)
- [ ] Icons have consistent sizing
- [ ] Icon names are visible below each icon
- [ ] Long icon names are truncated properly

### Hover Effects

- [ ] Hovering over icon changes background to light blue
- [ ] Hovering over icon changes border to blue
- [ ] Hover effect is smooth (transition)
- [ ] Hover effect works on all icons

### Button States

- [ ] "Select Icon" button is clickable
- [ ] "Change Icon" button appears when icon is selected
- [ ] "Done" button closes modal
- [ ] "Create Header" button is disabled while saving
- [ ] Loading spinner appears during save

## Validation Tests

### Required Fields

- [ ] Try to save without name
- [ ] Error toast appears: "Name and slug are required"
- [ ] Try to save without slug
- [ ] Error toast appears
- [ ] Icon selection is optional (can save without icon)

### Form Reset

- [ ] Open add modal
- [ ] Select an icon
- [ ] Fill in form
- [ ] Click "Cancel"
- [ ] Reopen add modal
- [ ] Form is reset (no icon selected)

## Data Persistence Tests

### Icon Storage

- [ ] Create category with icon
- [ ] Refresh page
- [ ] Icon still displays correctly
- [ ] Edit category
- [ ] Icon is pre-selected in form

### Icon ID Verification

- [ ] Open browser DevTools
- [ ] Inspect network request when creating category
- [ ] Verify `iconId` field is sent (e.g., "electronics")
- [ ] Verify it's a string, not SVG code

## Error Handling Tests

### Network Errors

- [ ] Disconnect internet
- [ ] Try to create category
- [ ] Error toast appears
- [ ] Modal remains open
- [ ] Form data is preserved

### Invalid Icon ID

- [ ] Manually set invalid iconId in database
- [ ] Refresh page
- [ ] Category displays with fallback icon
- [ ] No console errors

## Performance Tests

### Load Time

- [ ] Open icon selector modal
- [ ] Modal opens instantly (<200ms)
- [ ] All icons render immediately
- [ ] No flickering or layout shifts

### Search Performance

- [ ] Type quickly in search box
- [ ] Search results update in real-time
- [ ] No lag or delay
- [ ] Smooth filtering animation

## Browser Compatibility Tests

### Desktop Browsers

- [ ] Chrome/Edge: All features work
- [ ] Firefox: All features work
- [ ] Safari: All features work

### Mobile Browsers

- [ ] Chrome Mobile: Touch interactions work
- [ ] Safari Mobile: Touch interactions work
- [ ] Icons are tappable (not too small)

## Accessibility Tests

### Keyboard Navigation

- [ ] Tab through form fields
- [ ] Focus indicators are visible
- [ ] Enter key submits form
- [ ] ESC key closes modal

### Screen Reader

- [ ] Icon names are announced
- [ ] Buttons have clear labels
- [ ] Modal has proper ARIA attributes

## Regression Tests

### Existing Functionality

- [ ] Creating category with image still works
- [ ] Editing category still works
- [ ] Deleting category still works
- [ ] Bulk delete still works
- [ ] Search categories still works
- [ ] Status toggle still works

### Backward Compatibility

- [ ] Existing categories without iconId display correctly
- [ ] Existing categories with images display correctly
- [ ] No console errors for old data

## Edge Cases

### Special Characters

- [ ] Category name with special characters
- [ ] Slug with hyphens
- [ ] Description with line breaks

### Long Content

- [ ] Very long category name
- [ ] Very long description
- [ ] Modal handles overflow correctly

### Rapid Actions

- [ ] Quickly open/close modal multiple times
- [ ] Quickly select different icons
- [ ] No race conditions or errors

## Final Verification

- [ ] No console errors
- [ ] No console warnings
- [ ] No network errors
- [ ] All toast notifications work
- [ ] All animations are smooth
- [ ] UI is responsive on all screen sizes
- [ ] Feature works end-to-end

## Test Results

**Date Tested**: _______________
**Tested By**: _______________
**Browser**: _______________
**OS**: _______________

**Overall Result**: ☐ Pass  ☐ Fail

**Issues Found**:
1. _______________________________________________
2. _______________________________________________
3. _______________________________________________

**Notes**:
_______________________________________________
_______________________________________________
_______________________________________________
