 function getRestaurantNameById(id) { 
    const restaurants = { 1: "Restaurant One", 2: "Restaurant Two", 3: "Restaurant Three", }; 
    return restaurants[id] || "Unknown Restaurant"; }

    export function displayRewardAlert(restaurantId) {
      const restaurantName = getRestaurantNameById(restaurantId);
      alert(`Congratulations! You've won a free meal at ${restaurantName}!`);
    } 
   
   