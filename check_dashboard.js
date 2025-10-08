// This script will help diagnose the dashboard issue
console.log("=== Dashboard Diagnostic ===");

// Check localStorage
const appData = localStorage.getItem('brightRankData');
if (appData) {
  console.log("App data found:", JSON.parse(appData));
} else {
  console.log("No app data in localStorage - onboarding required");
}

// Check if running analysis
console.log("Check the network tab and console for errors");
