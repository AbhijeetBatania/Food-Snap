export async function fetchFromOpenFoodFacts(productName) {
    const indiaURL = `https://in.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(productName)}&search_simple=1&action=process&json=1`;
    const globalURL = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(productName)}&search_simple=1&action=process&json=1`;
  
    const fetchData = async (url) => {
      const response = await fetch(url);
      const data = await response.json();
      return data.products && data.products.length > 0 ? data.products[0] : null;
    };
  
    const indiaResult = await fetchData(indiaURL);
    if (indiaResult) return { source: 'india', data: indiaResult };
  
    const globalResult = await fetchData(globalURL);
    if (globalResult) return { source: 'global', data: globalResult };
  
    return { source: 'none', data: null };
  }