# Tour Debugging Guide

## Issue: Screen Goes Blank When Starting Tour

### What I Fixed:

1. **Reduced Overlay Opacity**
   - Changed from `0.7/0.5` to `0.6/0.4` to make it less dark
   - This should prevent the screen from appearing completely black

2. **Fixed Z-Index Issues**
   - Reduced tour z-index from `10000` to `9999`
   - Increased tour target elements z-index to `10001`
   - This ensures highlighted elements appear above the overlay

3. **Disabled Problematic Features**
   - Set `disableScrolling={false}` - was causing issues
   - Set `spotlightClicks={false}` - prevents accidental clicks
   - Added `spotlightPadding={10}` - adds space around highlighted elements

4. **Updated CSS Classes**
   - Changed from `.__floater__` to `.react-joyride__` (correct class names)
   - Fixed overlay and spotlight styling
   - Ensured tour targets have proper z-index

### How to Test:

1. **Open Browser Console** (F12)
2. **Start the tour**
3. **Check for errors** in the console
4. **Look for these elements**:
   - `.react-joyride__overlay` - should be semi-transparent
   - `.react-joyride__spotlight` - should highlight the target
   - `[data-tour="sidebar"]` - should be visible and highlighted

### Common Issues and Solutions:

#### Issue: Screen is completely black
**Solution**: The overlay is too dark
- Check `overlayColor` in styles
- Verify CSS `.react-joyride__overlay` opacity

#### Issue: Can't see the tooltip
**Solution**: Z-index or positioning problem
- Check if tooltip has proper z-index
- Verify target element exists with `data-tour` attribute

#### Issue: Target element is not highlighted
**Solution**: Spotlight not working
- Check if target element has `data-tour` attribute
- Verify element is visible (not `display: none`)
- Check z-index of target element

#### Issue: Tour doesn't start at all
**Solution**: Check tour state
- Verify `run={true}` is passed to DashboardTour
- Check if `TOUR_STORAGE_KEY` is set in localStorage
- Look for JavaScript errors in console

### Debug Checklist:

```javascript
// In browser console, run these commands:

// 1. Check if tour is running
document.querySelector('.react-joyride__overlay')

// 2. Check if target exists
document.querySelector('[data-tour="sidebar"]')

// 3. Check tour storage
localStorage.getItem('brightrank_tour_completed')

// 4. Check theme
document.documentElement.classList.contains('dark')

// 5. Force restart tour
localStorage.removeItem('brightrank_tour_completed')
// Then refresh page
```

### Expected Behavior After Fix:

1. ✅ Tour starts with semi-transparent overlay
2. ✅ Target element (sidebar) is highlighted and visible
3. ✅ Tooltip appears next to target with glassmorphic effect
4. ✅ Can see the dashboard content behind the overlay
5. ✅ Buttons (Next, Skip) are visible and clickable

### If Still Not Working:

Try this minimal test:
1. Open browser console
2. Run: `localStorage.clear()`
3. Refresh the page
4. Complete onboarding
5. When welcome modal appears, click "Start Tour"
6. Check console for any errors

### CSS Classes to Inspect:

```css
.react-joyride__overlay {
  /* Should be semi-transparent */
  background-color: rgba(0, 0, 0, 0.4) !important;
}

.react-joyride__spotlight {
  /* Should be transparent */
  background-color: transparent !important;
}

.react-joyride__tooltip {
  /* Should have glassmorphic effect */
  backdrop-filter: blur(12px) !important;
}

[data-tour] {
  /* Should be above overlay */
  z-index: 10001 !important;
}
```

### Next Steps if Issue Persists:

1. Check browser console for errors
2. Verify all `data-tour` attributes exist on elements
3. Test in different browser (Chrome, Firefox, Safari)
4. Try disabling browser extensions
5. Check if React DevTools shows DashboardTour component is mounted