// Paste this in browser console to debug
console.log("=== DASHBOARD DEBUG ===");

// 1. Check localStorage
const data = localStorage.getItem('brightRankData');
console.log("1. localStorage data:", data ? JSON.parse(data) : "NONE");

// 2. Check if component is mounted
const dashboard = document.querySelector('[class*="Dashboard"]');
console.log("2. Dashboard component:", dashboard ? "FOUND" : "NOT FOUND");

// 3. Check for errors
window.addEventListener('error', (e) => {
  console.error("Error caught:", e.error);
});

// 4. Monitor state changes
setTimeout(() => {
  const loading = document.querySelectorAll('.animate-pulse').length;
  console.log("3. Still loading after 3s:", loading > 0);
  
  const content = document.querySelector('[class*="fade-in"]');
  console.log("4. Content rendered:", content !== null);
}, 3000);

// 5. Check network requests
console.log("5. Check Network tab for failed requests");
