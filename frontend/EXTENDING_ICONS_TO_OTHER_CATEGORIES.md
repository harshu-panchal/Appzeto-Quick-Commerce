# Extending Icon Selection to Other Category Types

## Current Implementation
Icon selection is currently implemented for Header Categories only.

## To Extend to Level2Categories or SubCategories

Follow these steps to add icon selection to other category pages:

### 1. Import Required Components
```javascript
import IconSelector from "@shared/components/IconSelector";
import { getIconSvg } from "@shared/constants/categoryIcons";
import { Sparkles } from "lucide-react";
```

### 2. Add State for Icon Selector
```javascript
const [isIconSelectorOpen, setIsIconSelectorOpen] = useState(false);
```

### 3. Update formData to Include iconId
```javascript
const [formData, setFormData] = useState({
  name: "",
  slug: "",
  description: "",
  status: "active",
  type: "category", // or "subcategory"
  parentId: "",
  iconId: "", // Add this field
});
```

### 4. Update Modal Form (Replace Image Upload Section)
```javascript
{/* Icon/Image Selection */}
<div className="flex flex-col items-center gap-4">
  <div className="flex gap-4">
    {/* SVG Icon Display */}
    <div className="flex flex-col items-center gap-2">
      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200 flex items-center justify-center">
        {formData.iconId && getIconSvg(formData.iconId) ? (
          <div 
            className="w-12 h-12 text-indigo-600"
            dangerouslySetInnerHTML={{ __html: getIconSvg(formData.iconId) }}
          />
        ) : (
          <Sparkles className="w-10 h-10 text-indigo-300" />
        )}
      </div>
      <button
        type="button"
        onClick={() => setIsIconSelectorOpen(true)}
        className="px-3 py-1.5 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
        {formData.iconId ? 'Change Icon' : 'Select Icon'}
      </button>
    </div>

    {/* OR Divider */}
    <div className="flex items-center">
      <span className="text-gray-400 font-medium">OR</span>
    </div>

    {/* Image Upload */}
    <div className="flex flex-col items-center gap-2">
      <div
        onClick={() => fileInputRef.current?.click()}
        className="w-24 h-24 rounded-full bg-gray-50 border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-indigo-500 overflow-hidden transition-colors">
        {previewUrl ? (
          <img
            src={previewUrl}
            alt="Preview"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-center">
            <Upload className="w-8 h-8 text-gray-400 mx-auto" />
            <span className="text-xs text-gray-500 mt-1">Upload</span>
          </div>
        )}
      </div>
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={handleImageChange}
        accept="image/*"
      />
      <span className="text-xs text-gray-500">Custom Image</span>
    </div>
  </div>
  <p className="text-xs text-gray-500 text-center">
    Choose an SVG icon or upload a custom image
  </p>
</div>
```

### 5. Add Icon Selector Modal (Before Delete Modal)
```javascript
{/* Icon Selector Modal */}
<AnimatePresence>
  {isIconSelectorOpen && (
    <IconSelector
      selectedIcon={formData.iconId}
      onSelect={(iconId) => {
        setFormData({ ...formData, iconId });
        setIsIconSelectorOpen(false);
      }}
      onClose={() => setIsIconSelectorOpen(false)}
    />
  )}
</AnimatePresence>
```

### 6. Update Table Display
```javascript
<td className="py-3 px-4">
  <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden flex items-center justify-center border border-gray-200">
    {cat.iconId && getIconSvg(cat.iconId) ? (
      <div 
        className="w-6 h-6 text-indigo-600"
        dangerouslySetInnerHTML={{ __html: getIconSvg(cat.iconId) }}
      />
    ) : cat.image?.url || cat.image ? (
      <img
        src={cat.image?.url || cat.image}
        alt={cat.name}
        className="w-full h-full object-cover"
      />
    ) : (
      <Image className="w-5 h-5 text-gray-400" />
    )}
  </div>
</td>
```

### 7. Update openAddModal and openEditModal
```javascript
const openAddModal = () => {
  setEditingItem(null);
  setFormData({
    name: "",
    slug: "",
    description: "",
    status: "active",
    type: "category", // or "subcategory"
    parentId: "",
    iconId: "", // Add this
  });
  setImageFile(null);
  setPreviewUrl(null);
  setIsAddModalOpen(true);
};

const openEditModal = (item) => {
  setEditingItem(item);
  setFormData({
    name: item.name,
    slug: item.slug,
    description: item.description || "",
    status: item.status,
    type: "category", // or "subcategory"
    parentId: item.parentId || "",
    iconId: item.iconId || "", // Add this
  });
  setPreviewUrl(item.image?.url || null);
  setIsAddModalOpen(true);
};
```

## Notes
- The backend already supports the `iconId` field (added to the Category model)
- No additional backend changes are needed
- The icon library is shared across all category types
- You can add more icons to `categoryIcons.js` as needed
