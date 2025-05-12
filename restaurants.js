document.addEventListener('DOMContentLoaded', () => {
  
  const locationInput  = document.getElementById('location');
  const distanceSelect = document.getElementById('distance');
  const cuisineSelect  = document.getElementById('cuisine');
  const cards          = Array.from(document.querySelectorAll('.restaurant-card'));

  // Map of distances for each restaurant by name
  const distances = {
    'Kayal':               2.4,
    'Herb':                3.1,
    'Casa Romana':         4.8,
    'Bistrot Pierre':      1.2,
    'Barceloneta':         5.5,
    "Bobby's Restaurant":  2.0
  };

  function applyFilters() {
    const loc     = locationInput.value.trim().toLowerCase();
    const maxDist = distanceSelect.value.toLowerCase();
    const cuisine = cuisineSelect.value.toLowerCase();

    cards.forEach(card => {
      const name        = card.querySelector('.restaurant-name').textContent.trim();
      const cuisineText = card.querySelector('.restaurant-cuisine').textContent.trim().toLowerCase();
      const postcode    = card.querySelector('.restaurant-distance').textContent.trim().toLowerCase();
      const dist        = distances[name] || Infinity;

      let visible = true;
      if (cuisine !== 'any' && cuisineText !== cuisine) visible = false;
      if (maxDist !== 'any' && dist > parseFloat(maxDist)) visible = false;
      if (loc && !postcode.includes(loc)) visible = false;


      card.style.display = visible ? '' : 'none';
    });
  }


  locationInput.addEventListener('input', applyFilters);
  distanceSelect.addEventListener('change', applyFilters);
  cuisineSelect.addEventListener('change', applyFilters);

  applyFilters();
});
