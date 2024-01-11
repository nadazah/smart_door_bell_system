document.addEventListener('DOMContentLoaded', async function () {
    // Step 1: Retrieve access token and user email from local storage
    const accessToken = localStorage.getItem('Token');
    console.log('accestoken jey mel profile', accessToken);
    const email = localStorage.getItem('email');
    console.log('c le mail dans le local storage', email);
  
    // If access token or user email is not present, redirect to login page
    if (!accessToken || !email) {
      console.error('Access token or user email not found. Redirecting to login page.');
      window.location.href = '../pages/login.html';
      return;
    }
  
    // Step 2: Make a request to fetch user details
    const profileEndpoint = `http://localhost:8080/api/profile/${email}`;
    const profileHeaders = {
      'Authorization': `Bearer ${accessToken}`,
    };
  
    try {
      const profileResponse = await fetch(profileEndpoint, {
        method: 'GET',
        headers: new Headers(profileHeaders),
      });
  
      const profileData = await profileResponse.json();
  
      // Step 3: Display user details on the profile page
      const fullnameElement = document.getElementById('user-fullname');
  
      if (profileData.fullname) {
        fullnameElement.textContent = profileData.fullname;
      } else {
        console.error('User details incomplete or not found.');
      }

    } catch (error) {
      console.error('Error fetching user details:', error);
      // Handle error, e.g., redirect to login page
      window.location.href = '../pages/login.html';
    }
  });
  