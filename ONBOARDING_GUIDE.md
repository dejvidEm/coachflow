# Onboarding System Guide

## Overview

CoachFlow includes a professional onboarding system similar to major SaaS products like Notion, Linear, and Figma. It provides:

- **Welcome Modal**: Beautiful first-time user experience
- **Interactive Tour**: Step-by-step guided tour of key features
- **Smart Tooltips**: Contextual help that highlights UI elements
- **Progress Tracking**: Tracks completion status in localStorage
- **Restart Capability**: Users can restart the tour anytime

## Features

### 1. Welcome Modal
- Appears for new users who haven't completed onboarding
- Beautiful gradient design with brand colors
- Two options: "Start Guided Tour" or "I'll explore on my own"
- Personalized with user's name

### 2. Interactive Tour
- 8-step guided tour covering:
  1. Welcome message
  2. Dashboard overview
  3. Client management
  4. Meal planning
  5. Exercise library
  6. PDF generation
  7. Team & settings
  8. Completion message

### 3. Smart Tooltips
- Highlights target elements with overlay
- Auto-positions based on available space
- Smooth animations and transitions
- Progress indicator showing current step
- Previous/Next navigation
- Skip functionality

### 4. Progress Tracking
- Stored in localStorage
- Tracks completed steps
- Remembers if user skipped tour
- Can be reset for testing

## Architecture

```
lib/onboarding/
├── types.ts          # TypeScript types
├── steps.ts          # Tour steps configuration
├── context.tsx       # React context provider
└── index.ts          # Exports

components/onboarding/
├── tooltip.tsx       # Tooltip component
├── tour.tsx          # Tour orchestrator
├── welcome-modal.tsx # Welcome modal
├── restart-tour-button.tsx # Helper button
├── dashboard-wrapper.tsx   # Dashboard integration
└── index.ts          # Exports
```

## Usage

### For Users

1. **First Visit**: Welcome modal appears automatically
2. **Start Tour**: Click "Start Guided Tour" button
3. **Navigate**: Use Next/Previous buttons or skip steps
4. **Restart**: Click the sparkle icon (✨) in header to restart

### For Developers

#### Adding New Tour Steps

Edit `lib/onboarding/steps.ts`:

```typescript
{
  id: 'new-feature',
  title: 'New Feature',
  description: 'Description of the feature',
  target: '[data-onboarding="new-feature"]', // CSS selector
  position: 'right', // top, bottom, left, right, center
  action: {
    label: 'Try It',
    onClick: () => {
      // Action to perform
    },
  },
  skipable: true,
}
```

#### Adding Data Attributes

Add `data-onboarding` attributes to elements you want to highlight:

```tsx
<div data-onboarding="my-feature">
  {/* Your content */}
</div>
```

#### Customizing Steps

All steps are defined in `lib/onboarding/steps.ts`. You can:
- Reorder steps
- Add/remove steps
- Change descriptions
- Update targets
- Modify actions

## Current Tour Steps

1. **Welcome** - Introduction modal
2. **Dashboard Overview** - Main dashboard area
3. **Create Client** - Clients section in sidebar
4. **Create Meal** - Meals section
5. **Create Exercise** - Exercises section
6. **Generate PDF** - PDF generation feature
7. **Team Settings** - Settings section
8. **Complete** - Completion message

## Integration Points

### Dashboard Layout
- `app/(dashboard)/dashboard/layout.tsx` - Wraps with OnboardingProvider

### Dashboard Page
- `app/(dashboard)/dashboard/page.tsx` - Uses DashboardWrapper, has `data-onboarding="dashboard"`

### Navigation
- Sidebar links have `data-onboarding` attributes
- Settings dropdown has `data-onboarding="settings-section"`

### Feature Pages
- Clients page: `data-onboarding="clients-section"`
- Meals page: `data-onboarding="meals-section"`
- Exercises page: `data-onboarding="exercises-section"`
- PDF buttons: `data-onboarding="pdf-feature"`

## Customization

### Changing Colors
Edit tooltip component styles in `components/onboarding/tooltip.tsx`

### Modifying Welcome Modal
Edit `components/onboarding/welcome-modal.tsx`

### Adjusting Step Timing
Modify delays in `components/onboarding/tour.tsx`

### Changing Storage Key
Update `STORAGE_KEY` in `lib/onboarding/context.tsx`

## Testing

### Reset Onboarding
```typescript
const { resetOnboarding } = useOnboarding();
resetOnboarding(); // Clears progress and localStorage
```

### Check Completion Status
```typescript
const { progress } = useOnboarding();
console.log(progress.isCompleted); // true/false
```

### Programmatically Start Tour
```typescript
const { startTour } = useOnboarding();
startTour(); // Starts from first step
```

## Best Practices

1. **Keep Steps Short**: Each step should focus on one feature
2. **Clear Targets**: Use specific, stable CSS selectors
3. **Test Responsive**: Ensure tooltips work on mobile
4. **Skipable Steps**: Allow users to skip non-critical steps
5. **Progress Feedback**: Show progress indicator
6. **Smooth Transitions**: Use animations for better UX

## Future Enhancements

Potential additions:
- [ ] Contextual tooltips (show on hover)
- [ ] Feature discovery (highlight new features)
- [ ] Video tutorials integration
- [ ] Interactive demos
- [ ] A/B testing different flows
- [ ] Analytics tracking

