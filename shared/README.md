# Shared Resources

This folder contains assets and data shared between the website and the app.

## Structure

```
shared/
├── assets/      # Images, icons, logos
├── data/        # JSON data, configurations
└── README.md    # This file
```

## Usage

### In the Website
Reference assets using relative paths:
```html
<img src="../shared/assets/logo.png" alt="Logo">
```

### In the App
Import and use assets:
```typescript
import logo from '@/../../shared/assets/logo.png';
```

## Purpose

This folder enables:
- Consistent branding across website and app
- Shared configuration data
- Reusable assets without duplication
- Unified source of truth for content

## Future Use Cases

- Brand colors and typography definitions
- Category descriptions and icons
- Philosophy text snippets
- Shared image assets
- Configuration JSON files

