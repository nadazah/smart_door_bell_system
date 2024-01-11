document.addEventListener('DOMContentLoaded', function() {
    // register user
    window.registerUser = async () => {
      const fullname = document.getElementById('fullname').value;
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      const userData = {
        fullname: fullname,
        mail: email,
        password: password,
        permissionLevel: 1, // Set the desired permission level
      };

      try {
        const response = await fetch('http://localhost:8080/api/user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        });

        if (response.ok) {
          console.log('User registered successfully');
          // Redirect to about.html
          window.location.href = 'login.html';
        } else {
          console.error('Failed to register user');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };
  });