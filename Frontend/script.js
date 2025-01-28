document.getElementById('matterForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('id').value;
    const name = document.getElementById('name').value;
    const response = await fetch('/matter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, name })
    });
    if (response.ok) {
      loadMatters();
  });
  
  document.getElementById('updateStateForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('updateId').value;
    const state = document.getElementById('state').value;
    const response = await fetch(`/matter/${id}`);
    if (response.ok) {
      const matter = await response.json();
      if (matter.state === 'solid') {
        alert('Cannot update state of a solid matter');
      } else {
        await fetch(`/matter/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ state })
        });
        loadMatters();
      }
    }
  });
  
  document.getElementById('getMatterForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('getId').value;
    const response = await fetch(`/matter/${id}`);
    if (response.ok) {
      const matter = await response.json();
      const matterInfo = document.getElementById('matterInfo');
      matterInfo.innerHTML = `<p>ID: ${matter.id}</p>
        <p>Name: ${matter.name}</p>
        <p>State: ${matter.state}</p>
        <p>State History: ${matter.stateHistory.map(h => `${h.state} at ${new Date(h.updatedAt).toLocaleString()}`).join(', ')}</p>`;
    }
  });
  
  document.getElementById('deleteMatterForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('deleteId').value;
    const response = await fetch(`/matter/${id}`);
    if (response.ok) {
      const matter = await response.json();
      if (matter.state === 'solid') {
        alert('Cannot delete a solid matter');
      } else {
        await fetch(`/matter/${id}`, { method: 'DELETE' });
        loadMatters();
      }
    }
  });
  
  async function loadMatters() {
    const response = await fetch('/matter');
    const matters = await response.json();
    const matterList = document.getElementById('matterList');
    matterList.innerHTML = '';
    matters.forEach(matter => {
      const li = document.createElement('li');
      li.textContent = `${matter.id}: ${matter.name} (${matter.state})`;
      matterList.appendChild(li);
    });
  }
  
  // Load existing matters on page load
  loadMatters();
