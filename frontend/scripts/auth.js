document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');   
  const registerForm = document.getElementById('registerForm'); 

  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      try {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
          localStorage.setItem('token', data.token);
          alert("✅ Login successful!");
          window.location.href = '/';
        } else {
          alert(data.message || 'Login failed');
        }
      } catch (err) {
        alert('Error logging in');
      }
    });
  }

  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById("username").value;
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      try {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password }),
        });

        const data = await res.json();

        if (res.ok) {
          alert('✅ Registration successful! Please login.');
          window.location.href = '/login';
        } else {
          alert(data.message || 'Registration failed');
        }
      } catch (err) {
        alert('Error registering user');
      }
    });
  }
});
