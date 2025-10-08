// Quick dashboard status check
console.log("=== Dashboard Status Check ===");

// Check if we have app data
const appData = localStorage.getItem('brightRankData');
if (!appData) {
  console.error("❌ No app data found. You need to complete onboarding first!");
  console.log("Solution: Navigate to landing page and complete onboarding");
} else {
  console.log("✅ App data found:", JSON.parse(appData));
}

// Check if dashboard elements are loading
setTimeout(() => {
  const loadingElements = document.querySelectorAll('.animate-pulse');
  const dashboardContent = document.querySelector('[class*="fade-in"]');
  
  if (loadingElements.length > 0) {
    console.warn("⚠️ Still showing loading placeholders...");
  } else if (dashboardContent) {
    console.log("✅ Dashboard content rendered successfully!");
  } else {
    console.warn("⚠️ No dashboard content detected");
  }
}, 2000);

