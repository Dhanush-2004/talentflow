// Clear localStorage to force reload new assessment data
localStorage.removeItem('msw_assessments');
localStorage.removeItem('msw_jobs');
localStorage.removeItem('msw_applications');
console.log('LocalStorage cleared - refresh the page to load new data');
