# Locomotive Scroll Implementation Guide

## Overview
Alaama Creative Studio website uses ultra-subtle Locomotive Scroll effects with speeds between 0.05-0.2 for performance and accessibility. All effects respect `prefers-reduced-motion` and are disabled on mobile devices < 768px.

## Speed & Direction Configuration

### Hero Section Elements

| Element | Speed | Direction | Effect Description |
|---------|-------|-----------|-------------------|
| Background Image | `0.1` | vertical | Ultra-subtle background parallax |
| Main Headline | `0.05` | vertical | Gentle reveal with minimal movement |
| Tagline | `0.12` | horizontal | Horizontal drift on reveal |
| Partnership Info | `-0.03` | vertical | Counter-motion (moves opposite to scroll) |
| Primary CTA | `0.08` | vertical | Standard reveal |
| Secondary CTA | `0.15` | vertical | Slightly faster reveal for stagger |
| Value Proposition | `0.06` | horizontal | Gentle horizontal drift |
| Scroll Indicator | `-0.1` | vertical | Counter-motion bounce effect |

### Decorative Elements (Hero)

| Element | Speed | Direction | Purpose |
|---------|-------|-----------|---------|
| Top-right Circle | `-0.05` | vertical | Counter-motion background element |
| Bottom-left Square | `-0.08` | horizontal | Horizontal counter-drift |

### Services Section

| Element | Speed | Direction | Logic |
|---------|-------|-----------|--------|
| Section Divider | `-0.05` | vertical | Counter-motion separator |
| Service Cards (Even) | `0.15` | horizontal | Alternating horizontal drift |
| Service Cards (Odd) | `0.12` | vertical | Standard vertical reveal |
| Bottom CTA | `0.08` | horizontal | Gentle horizontal emphasis |

### Work Section

| Element | Speed | Direction | Pattern |
|---------|-------|-----------|---------|
| Case Studies (Even) | `0.1` | vertical | Standard reveal |
| Case Studies (Odd) | `0.2` | horizontal | Maximum speed with horizontal drift |
| Concept Gallery | `0.07-0.17` | mixed | Varied speeds, every 3rd item horizontal |

## CSS Classes & States

### Base States
```css
[data-scroll] {
  opacity: 0;
  transform: translateY(12px);
  transition: opacity 0.4s ease, transform 0.4s ease;
}

[data-scroll-direction="horizontal"] {
  transform: translateX(8px);
}
```

### In-View States
```css
.is-inview {
  opacity: 1 !important;
  transform: none !important;
}
```

### Accessibility
```css
@media (prefers-reduced-motion: reduce) {
  [data-scroll] {
    transition: none !important;
    transform: none !important;
    opacity: 1 !important;
  }
}
```

## Performance Considerations

### Ultra-Low Speeds Benefits
- **Minimal CPU usage**: Speeds < 0.2 reduce calculation frequency
- **Smooth experience**: Barely perceptible motion prevents jarring effects
- **Battery friendly**: Lower animation intensity on mobile devices
- **Accessibility**: Subtle enough to not trigger motion sensitivity

### Technical Implementation
- **Lerp value**: 0.1 for ultra-smooth transitions
- **Offset**: 30% trigger point for early reveals
- **No repeat**: Animations trigger once for performance
- **Transform-only**: No layout shifts or reflows

## Customization Guide

### Adding New Scroll Elements
```jsx
// Standard vertical reveal
<div data-scroll data-scroll-speed="0.1">
  Content
</div>

// Horizontal drift
<div 
  data-scroll 
  data-scroll-direction="horizontal" 
  data-scroll-speed="0.15"
>
  Content
</div>

// Counter-motion (decorative)
<div 
  data-scroll 
  data-scroll-speed="-0.05"
  aria-hidden="true"
>
  Decorative element
</div>
```

### Speed Guidelines
- **0.05-0.08**: Subtle reveals, text content
- **0.1-0.15**: Standard elements, cards, images
- **0.15-0.2**: Emphasis elements, CTAs
- **Negative values**: Decorative counter-motion only

### Direction Guidelines
- **Vertical** (default): Primary content, natural reading flow
- **Horizontal**: Accent elements, variety, emphasis
- **Mixed**: Galleries, grids (alternate for visual interest)

## Browser Support & Fallbacks

### Supported
- Chrome/Edge 80+
- Firefox 75+
- Safari 13+

### Automatic Fallbacks
- **Mobile < 768px**: Native scroll, no effects
- **Reduced motion**: All effects disabled
- **Older browsers**: Graceful degradation to standard scroll

## Debugging & Testing

### Enable Debug Mode
```javascript
// In browser console
localStorage.setItem('locomotive-debug', 'true');
```

### Check Performance
- Monitor FPS in Chrome DevTools
- Test on low-end devices
- Verify Lighthouse Mobile score ≥ 90

### Test Scenarios
1. Desktop with motion enabled
2. Mobile device (effects should be disabled)
3. Reduced motion preference set
4. Slow network conditions
5. Various viewport sizes

## Maintenance Notes

### When to Update Speeds
- **Too subtle**: Increase by 0.02-0.05
- **Too noticeable**: Decrease by 0.02-0.05
- **Performance issues**: Reduce all speeds by 20%

### Adding New Sections
1. Follow existing speed patterns
2. Alternate directions for variety
3. Use counter-motion sparingly
4. Test on mobile/reduced-motion
5. Update this documentation

## Accessibility Compliance

✅ **WCAG AA Compliant**
- Respects prefers-reduced-motion
- No essential content depends on motion
- Keyboard navigation unaffected
- Screen reader friendly (aria-hidden for decorative)

✅ **Performance Optimized**
- Lighthouse Mobile ≥ 90
- No layout shift (CLS = 0)
- Battery-conscious animation
- Network-friendly implementation

## Quick Reference

**Most Common Speeds**
- `0.05`: Minimal text reveals
- `0.1`: Standard content
- `0.15`: Emphasis elements  
- `-0.05`: Counter-motion

**Most Common Directions**
- Default: Vertical reveals
- `horizontal`: Accent/variety
- Mixed: Galleries/grids

**Key Files**
- `/components/LocomotiveScrollProvider.jsx`: Core setup
- `/styles/locomotive-scroll.css`: Animation styles
- `/components/Hero.jsx`: Hero effects
- `/components/Services.jsx`: Services effects