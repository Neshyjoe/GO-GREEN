// Server URL 
const API_URL = 'http://localhost:3000';

// Voting System - Optimized Version
async function vote(candidateId) {
  try {
    // Get current candidate data
    const response = await fetch(`${API_URL}/candidates/${candidateId}`);
    const candidate = await response.json();
    
    // Optimistic UI update
    const newVotes = candidate.votes + 1;
    const voteElement = document.getElementById(`candidate${candidateId}`);
    if (voteElement) {
      voteElement.textContent = newVotes; 
    }

    // Update server with the new vote count
    await fetch(`${API_URL}/candidates/${candidateId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...candidate,
        votes: newVotes,
      }),
    });
  } catch (error) {
    console.error('Error voting:', error);
    // If an error occurs, revert the UI
    const voteElement = document.getElementById(`candidate${candidateId}`);
    if (voteElement) {
      voteElement.textContent = candidate.votes;
    }
    alert('Vote failed - please try again!');
  }
}

// Registration Form
document.getElementById('registrationForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const formData = {
    name: e.target.elements[0].value,
    gender: e.target.elements[1].value,
    age: e.target.elements[2].value,
    healthIssues: e.target.elements[3].value,
    timestamp: new Date().toISOString(),
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
    alert('Registration failed - please try again!');
  }
});

// Contact Form
document.getElementById('contactForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const formData = {
    name: e.target.elements[0].value,
    email: e.target.elements[1].value,
    message: e.target.elements[2].value,
    timestamp: new Date().toISOString(),
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
    alert('Message failed to send - please try again!');
  }
});

// Initialize votes display on page load
window.addEventListener('DOMContentLoaded', async () => {
  try {
    const response = await fetch(`${API_URL}/candidates`);
    const candidates = await response.json();
    
    // Loop through each candidate and display their vote count
    candidates.forEach(candidate => {
      const voteElement = document.getElementById(`candidate${candidate.id}`);
      if (voteElement) {
        voteElement.textContent = candidate.votes;
      }
    });
  } catch (error) {
    console.error('Error initializing votes:', error);
    alert('Could not load voting data - please refresh the page!');
  }
});
