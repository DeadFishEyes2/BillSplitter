const socket = io();

document.getElementById('nameForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const name = document.getElementById('name').value;
  const billId = window.location.pathname.split('/').pop();
  fetch(`/bill/join/${billId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name })
  }).then(response => response.json()).then(data => {
    document.getElementById('nameForm').style.display = 'none';
    document.getElementById('startSplitting').style.display = 'block';
    // Update participants list with the new user
    const participantsList = document.getElementById('participants');
    participantsList.innerHTML = '';
    data.participants.forEach(participant => {
      const li = document.createElement('li');
      li.style.color = participant.color;
      li.textContent = participant.name;
      participantsList.appendChild(li);
    });
  });
});

document.getElementById('startSplitting').addEventListener('click', function() {
  const billId = window.location.pathname.split('/').pop();
  fetch(`/bill/start/${billId}`, {
    method: 'POST'
  }).then(response => {
    window.location.href = `/bill/start/${billId}`;
  });
});

document.querySelectorAll('#items li').forEach(item => {
  item.addEventListener('click', () => {
    const itemName = item.dataset.name;
    const billId = window.location.pathname.split('/').pop();
    socket.emit('select item', { billId, itemName, userColor: 'red' }); // Example user color
  });
});

socket.on('item selected', (data) => {
  document.querySelectorAll('#items li').forEach(item => {
    if (item.dataset.name === data.itemName) {
      item.style.color = data.userColor;
    }
  });
});
