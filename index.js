// Server URL
const API_URL = 'http://localhost:3000';

// Voting System
async function vote(candidateId) {
  try {
    // Get current candidate
    const response = await fetch(`${API_URL}/candidates/${candidateId}`);
    const candidate = await response.json();
    
    // Update votes
    const updatedCandidate = {
      ...candidate,
      votes: candidate.votes + 1
    };

    await fetch(`${API_URL}/candidates/${candidateId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedCandidate),
    });

    updateVoteDisplay(candidateId);
  } catch (error) {
    console.error('Error voting:', error);
  }
}

async function updateVoteDisplay(candidateId) {
  const response = await fetch(`${API_URL}/candidates/${candidateId}`);
  const candidate = await response.json();
  document.getElementById(`candidate${candidateId}`).textContent = candidate.votes;
}

// Registration Form
document.getElementById('registrationForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const formData = {
    name: e.target.elements[0].value,
    gender: e.target.elements[1].value,
    age: e.target.elements[2].value,
    healthIssues: e.target.elements[3].value,
    timestamp: new Date().toISOString()
  };

  try {
    await fetch(`${API_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    alert('Registration successful!');
    e.target.reset();
  } catch (error) {
    console.error('Registration error:', error);
  }
});

// Contact Form
document.getElementById('contactForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const formData = {
    name: e.target.elements[0].value,
    email: e.target.elements[1].value,
    message: e.target.elements[2].value,
    timestamp: new Date().toISOString()
  };

  try {
    await fetch(`${API_URL}/contacts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    alert('Message sent successfully!');
    e.target.reset();
  } catch (error) {
    console.error('Error sending message:', error);
  }
});

// Initialize votes display on page load
window.addEventListener('DOMContentLoaded', async () => {
  try {
    const response = await fetch(`${API_URL}/candidates`);
    const candidates = await response.json();
    
    candidates.forEach(candidate => {
      const voteElement = document.getElementById(`candidate${candidate.id}`);
      if (voteElement) {
        voteElement.textContent = candidate.votes;
      }
    });
  } catch (error) {
    console.error('Error initializing votes:', error);
  }
});