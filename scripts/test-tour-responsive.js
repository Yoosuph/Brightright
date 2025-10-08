#!/usr/bin/env node

/**
 * Manual Testing Script for Tour Responsive Design
 * 
 * This script provides a checklist and automated tests for verifying
 * the responsive behavior of the onboarding tour system.
 */

const fs = require('fs');
const path = require('path');

const testResults = {
  mobile: {},
  tablet: {},
  desktop: {},
  accessibility: {},
  performance: {}
};

const testViewports = [
  { name: 'iPhone SE', width: 375, height: 667, type: 'mobile' },
  { name: 'iPhone 12', width: 390, height: 844, type: 'mobile' },
  { name: 'iPhone 12 Pro Max', width: 428, height: 926, type: 'mobile' },
  { name: 'Samsung Galaxy S21', width: 360, height: 800, type: 'mobile' },
  { name: 'iPad Mini', width: 768, height: 1024, type: 'tablet' },
  { name: 'iPad Pro', width: 1024, height: 1366, type: 'tablet' },
  { name: 'Surface Pro', width: 912, height: 1368, type: 'tablet' },
  { name: 'MacBook Air', width: 1440, height: 900, type: 'desktop' },
  { name: 'Desktop 1080p', width: 1920, height: 1080, type: 'desktop' },
  { name: 'Desktop 4K', width: 3840, height: 2160, type: 'desktop' },
];

const testChecklist = {
  mobile: [
    'Tour tooltips fit within viewport without horizontal scrolling',
    'Touch targets are at least 44px in height and width',
    'Tour buttons are easily tappable with finger',
    'Tour content is readable without zooming',
    'Tour overlay prevents interaction with background elements',
    'Tour works in both portrait and landscape orientations',
    'Welcome modal is fully visible and scrollable if needed',
    'Tour steps advance properly with touch interactions',
    'Skip functionality works on mobile',
    'Tour completion saves state correctly'
  ],
  tablet: [
    'Tour tooltips position correctly on tablet screens',
    'Touch and mouse interactions both work',
    'Tour content scales appropriately for tablet',
    'Welcome modal uses tablet-optimized layout',
    'Tour works in both orientations',
    'Tooltip positioning adapts to screen edges',
    'Tour overlay covers entire viewport',
    'Navigation between steps is smooth',
    'Tour restart from help menu works',
    'Performance is smooth on tablet devices'
  ],
  desktop: [
    'Tour tooltips position optimally around target elements',
    'Keyboard navigation works throughout tour',
    'Mouse interactions are precise and responsive',
    'Tour content is appropriately sized for desktop',
    'Welcome modal centers properly on large screens',
    'Tour steps highlight correct elements',
    'Tooltip arrows point to correct targets',
    'Tour overlay allows spotlight clicks',
    'Help menu integration works seamlessly',
    'Tour performance is optimal on desktop'
  ],
  accessibility: [
    'Tour content is readable by screen readers',
    'Tour navigation works with keyboard only',
    'High contrast mode compatibility',
    'Focus management during tour progression',
    'ARIA labels are properly implemented',
    'Tour respects reduced motion preferences',
    'Color contrast meets WCAG guidelines',
    'Tour works with browser zoom up to 200%',
    'Alternative text for tour icons',
    'Proper heading hierarchy in tour content'
  ],
  performance: [
    'Tour initialization is fast (<100ms)',
    'Tour step transitions are smooth (60fps)',
    'Memory usage remains stable during tour',
    'No layout thrashing during viewport changes',
    'Tour cleanup prevents memory leaks',
    'Responsive breakpoint changes are instant',
    'Touch event handling is responsive',
    'Tour works with slow network connections',
    'No blocking of main thread during tour',
    'Efficient re-rendering on viewport changes'
  ]
};

function generateTestReport() {
  const timestamp = new Date().toISOString();
  const reportPath = path.join(__dirname, '..', 'test-reports', `tour-responsive-${timestamp.split('T')[0]}.md`);
  
  // Ensure test-reports directory exists
  const reportsDir = path.dirname(reportPath);
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }

  let report = `# Tour Responsive Design Test Report\n\n`;
  report += `**Generated:** ${timestamp}\n\n`;
  
  report += `## Test Viewports\n\n`;
  testViewports.forEach(viewport => {
    report += `- **${viewport.name}**: ${viewport.width}×${viewport.height} (${viewport.type})\n`;
  });
  
  report += `\n## Test Checklist\n\n`;
  
  Object.entries(testChecklist).forEach(([category, tests]) => {
    report += `### ${category.charAt(0).toUpperCase() + category.slice(1)} Tests\n\n`;
    tests.forEach((test, index) => {
      report += `- [ ] ${test}\n`;
    });
    report += `\n`;
  });
  
  report += `## Manual Testing Instructions\n\n`;
  report += `### 1. Mobile Testing\n`;
  report += `1. Open browser developer tools\n`;
  report += `2. Switch to device emulation mode\n`;
  report += `3. Test each mobile viewport listed above\n`;
  report += `4. Verify touch interactions work properly\n`;
  report += `5. Test both portrait and landscape orientations\n`;
  report += `6. Check tour tooltip positioning and readability\n\n`;
  
  report += `### 2. Tablet Testing\n`;
  report += `1. Use tablet viewports in developer tools\n`;
  report += `2. Test both touch and mouse interactions\n`;
  report += `3. Verify tour adapts to tablet screen sizes\n`;
  report += `4. Test orientation changes during tour\n\n`;
  
  report += `### 3. Desktop Testing\n`;
  report += `1. Test on various desktop resolutions\n`;
  report += `2. Verify keyboard navigation works\n`;
  report += `3. Check tooltip positioning and arrows\n`;
  report += `4. Test help menu integration\n\n`;
  
  report += `### 4. Accessibility Testing\n`;
  report += `1. Test with screen reader (NVDA, JAWS, VoiceOver)\n`;
  report += `2. Navigate tour using only keyboard\n`;
  report += `3. Test with high contrast mode enabled\n`;
  report += `4. Verify with browser zoom at 200%\n\n`;
  
  report += `### 5. Performance Testing\n`;
  report += `1. Monitor performance during tour execution\n`;
  report += `2. Check memory usage and cleanup\n`;
  report += `3. Test on slower devices/connections\n`;
  report += `4. Verify smooth animations and transitions\n\n`;
  
  report += `## Automated Test Commands\n\n`;
  report += `\`\`\`bash\n`;
  report += `# Run responsive design tests\n`;
  report += `npm run test src/test/tour-responsive.test.tsx\n\n`;
  report += `# Run tests with UI for visual verification\n`;
  report += `npm run test:ui\n\n`;
  report += `# Run performance tests\n`;
  report += `npm run test:coverage\n`;
  report += `\`\`\`\n\n`;
  
  report += `## Common Issues to Watch For\n\n`;
  report += `- Tooltips extending beyond viewport boundaries\n`;
  report += `- Touch targets too small for mobile interaction\n`;
  report += `- Tour overlay not preventing background interactions\n`;
  report += `- Poor performance on mobile devices\n`;
  report += `- Accessibility issues with screen readers\n`;
  report += `- Tooltip positioning problems on small screens\n`;
  report += `- Orientation change handling issues\n`;
  report += `- Memory leaks during tour execution\n\n`;
  
  report += `## Browser Compatibility\n\n`;
  report += `Test on the following browsers:\n`;
  report += `- Chrome (latest)\n`;
  report += `- Firefox (latest)\n`;
  report += `- Safari (latest)\n`;
  report += `- Edge (latest)\n`;
  report += `- Mobile Safari (iOS)\n`;
  report += `- Chrome Mobile (Android)\n\n`;
  
  fs.writeFileSync(reportPath, report);
  console.log(`Test report generated: ${reportPath}`);
  
  return reportPath;
}

function runAutomatedChecks() {
  console.log('🔍 Running automated responsive design checks...\n');
  
  // Check if required files exist
  const requiredFiles = [
    'components/onboarding/DashboardTour.tsx',
    'components/onboarding/WelcomeModal.tsx',
    'src/test/tour-responsive.test.tsx'
  ];
  
  const missingFiles = requiredFiles.filter(file => 
    !fs.existsSync(path.join(__dirname, '..', file))
  );
  
  if (missingFiles.length > 0) {
    console.error('❌ Missing required files:');
    missingFiles.forEach(file => console.error(`   - ${file}`));
    return false;
  }
  
  console.log('✅ All required files present');
  
  // Check for responsive CSS classes
  const tourFile = fs.readFileSync(
    path.join(__dirname, '..', 'components/onboarding/DashboardTour.tsx'), 
    'utf8'
  );
  
  const responsivePatterns = [
    /isMobile/,
    /isTablet/,
    /viewport/i,
    /responsive/i,
    /touch/i
  ];
  
  const hasResponsiveCode = responsivePatterns.some(pattern => 
    pattern.test(tourFile)
  );
  
  if (hasResponsiveCode) {
    console.log('✅ Responsive code patterns found in DashboardTour');
  } else {
    console.log('⚠️  No responsive code patterns found in DashboardTour');
  }
  
  // Check WelcomeModal for responsive classes
  const modalFile = fs.readFileSync(
    path.join(__dirname, '..', 'components/onboarding/WelcomeModal.tsx'), 
    'utf8'
  );
  
  const responsiveClasses = [
    'sm:',
    'md:',
    'lg:',
    'xl:',
    'max-w-',
    'min-h-'
  ];
  
  const hasResponsiveClasses = responsiveClasses.some(className => 
    modalFile.includes(className)
  );
  
  if (hasResponsiveClasses) {
    console.log('✅ Responsive CSS classes found in WelcomeModal');
  } else {
    console.log('⚠️  Limited responsive CSS classes in WelcomeModal');
  }
  
  console.log('\n📋 Generated comprehensive test checklist');
  return true;
}

function main() {
  console.log('🚀 Tour Responsive Design Testing Tool\n');
  
  const checksPass = runAutomatedChecks();
  const reportPath = generateTestReport();
  
  console.log('\n📊 Test Summary:');
  console.log(`   - Automated checks: ${checksPass ? 'PASS' : 'NEEDS ATTENTION'}`);
  console.log(`   - Test report: ${reportPath}`);
  console.log(`   - Manual testing required: YES`);
  
  console.log('\n🎯 Next Steps:');
  console.log('1. Review the generated test report');
  console.log('2. Run automated tests: npm run test src/test/tour-responsive.test.tsx');
  console.log('3. Perform manual testing using browser dev tools');
  console.log('4. Test on real devices when possible');
  console.log('5. Update this script with test results');
  
  console.log('\n💡 Pro Tips:');
  console.log('- Use Chrome DevTools device emulation for initial testing');
  console.log('- Test on real mobile devices for touch interactions');
  console.log('- Use accessibility tools like axe-core for a11y testing');
  console.log('- Monitor performance with Chrome DevTools Performance tab');
}

if (require.main === module) {
  main();
}

module.exports = {
  testViewports,
  testChecklist,
  generateTestReport,
  runAutomatedChecks
};