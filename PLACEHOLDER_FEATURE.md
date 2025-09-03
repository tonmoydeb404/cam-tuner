# Placeholder Feature Specification

## Overview

The placeholder feature allows replacing the video stream with static content (text or image) when enabled. This is useful for privacy, branding, "be right back" scenarios, or custom status indicators.

## Feature Components

### 1. Placeholder Configuration Interface

```typescript
interface PlaceholderConfig {
  enabled: boolean;
  mode: "text" | "image";
  text?: {
    content: string;
    backgroundColor: string;
  };
  image?: {
    url: string;
  };
}
```

### 2. Rendering Behavior

#### When Placeholder is Enabled (`enabled: true`)

- **Background**: Canvas filled with backgroundColor (text mode) or transparent (image mode)
- **Content**: Text or image rendered based on mode
- **Video**: Original video stream is hidden (not rendered)
- **Overlays**: Confetti and media overlays still work normally

#### When Placeholder is Disabled (`enabled: false`)

- **Normal Operation**: Standard video stream rendering
- **All Effects**: Normal crop, filter, and overlay functionality

### 3. Text Mode Features

#### Text Rendering

```typescript
// Example text configuration
{
  enabled: true,
  mode: 'text',
  text: {
    content: 'Be Right Back',
    backgroundColor: '#2c3e50'
  }
}
```

#### Features

- **Simple Text**: Plain text string content
- **Auto Font Sizing**: Auto-scales to fit canvas
- **Center Aligned**: Always centered horizontally and vertically
- **Default Styling**: White text on specified background color
- **Single Line**: No multi-line support (keep it simple)

### 4. Image Mode Features

#### Image Rendering

```typescript
// Example image configuration
{
  enabled: true,
  mode: 'image',
  image: {
    url: '/assets/company-logo.png'
  }
}
```

#### Features

- **Simple URL**: Just provide image URL string
- **Auto Fit**: Image automatically scaled to fit canvas while preserving aspect ratio
- **Center Positioned**: Always centered in the canvas
- **Transparent Background**: No background color (image only)
- **Format Support**: PNG, JPG, GIF, SVG
- **Full Opacity**: No transparency controls (keep it simple)

### 5. Integration Architecture

#### StreamProcessor Integration

```typescript
class StreamProcessor {
  private placeholderConfig: PlaceholderConfig;
  private placeholderManager: PlaceholderManager;

  private renderFrame = (): void => {
    if (this.placeholderConfig.enabled) {
      this.placeholderManager.render(ctx, this.originalStreamSize);
    } else {
      // Normal video rendering
      this.renderVideoFrame(ctx);
    }
    // Overlays still render in both cases
    this.renderOverlays(ctx);
  };
}
```

#### Global Management

```typescript
// Global placeholder control across all streams
export function applyGlobalPlaceholder(config: PlaceholderConfig): void;
export function toggleGlobalPlaceholder(enabled: boolean): void;
export function updateGlobalPlaceholderText(text: string): void;
export function updateGlobalPlaceholderImage(imageUrl: string): void;
```

### 6. Use Cases & Examples

#### Privacy Mode

```typescript
{
  enabled: true,
  mode: 'text',
  text: {
    content: 'Camera Off',
    backgroundColor: '#1a1a1a'
  }
}
```

#### Away Message

```typescript
{
  enabled: true,
  mode: 'text',
  text: {
    content: 'Be Right Back',
    backgroundColor: '#667eea'
  }
}
```

#### Company Branding

```typescript
{
  enabled: true,
  mode: 'image',
  image: {
    url: '/assets/company-logo.png'
  }
}
```

#### Meeting Room Status

```typescript
{
  enabled: true,
  mode: 'text',
  text: {
    content: 'MEETING IN PROGRESS',
    backgroundColor: '#e74c3c'
  }
}
```

### 7. Performance Considerations

#### Optimization Features

- **Canvas Caching**: Static placeholders cached to avoid re-rendering
- **Image Preloading**: Images loaded and cached on configuration
- **Minimal Redraws**: Only re-render when placeholder config changes
- **Memory Management**: Automatic cleanup of cached resources

#### Resource Limits

- **Image Size**: Max 2MB per image
- **Text Length**: Max 1000 characters
- **Font Loading**: Timeout after 3 seconds for web fonts

### 8. API Methods

#### StreamProcessor Methods

```typescript
updatePlaceholder(config: PlaceholderConfig): void;
togglePlaceholder(enabled: boolean): void;
getPlaceholderConfig(): PlaceholderConfig;
```

#### Global Control Methods

```typescript
applyGlobalPlaceholder(config: PlaceholderConfig): void;
toggleGlobalPlaceholder(enabled: boolean): void;
updateGlobalPlaceholderText(content: string): void;
updateGlobalPlaceholderImage(imageUrl: string): void;
```

### 9. Error Handling

#### Image Loading Errors

- Fallback to text mode with error message
- Retry mechanism for network failures
- Invalid URL handling

#### Font Loading Errors

- Fallback to system fonts
- Graceful degradation for unsupported fonts

#### Configuration Errors

- Validation for all config parameters
- Default value substitution
- Warning logs for invalid settings

### 10. Future Enhancements

#### Planned Features

- **Video Placeholders**: Support for looped video backgrounds
- **Animation Support**: CSS animations for text and images
- **Template System**: Pre-defined placeholder templates
- **Dynamic Content**: Real-time data integration (time, weather, etc.)
- **Transition Effects**: Smooth fade in/out when toggling

#### Advanced Configurations

- **Multiple Elements**: Combine text and images
- **Responsive Design**: Auto-adjust based on canvas size
- **Theme Support**: Light/dark mode compatibility
- **Accessibility**: Screen reader support and high contrast options
