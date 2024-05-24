document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.item').forEach(item => {
    item.addEventListener('click', () => {
      const itemName = item.getAttribute('data-item');
      const userName = prompt("Enter your name");
      const userColor = "#000"; // Example color, you should retrieve the correct user color
      fetch(`/bill/select-item/${billId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ itemName, userName, userColor }),
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          const span = document.createElement('span');
          span.textContent = userName;
          span.style.color = userColor;
          item.querySelector('.selected-by').appendChild(span);
        }
      });
    });
  });
});
