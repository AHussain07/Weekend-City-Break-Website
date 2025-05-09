// auth.js

document.addEventListener('DOMContentLoaded', () => {
    // ——— Helpers ———
    function showError(input, message) {
      let err = input.parentElement.querySelector('.error-message');
      if (!err) {
        err = document.createElement('div');
        err.className = 'error-message';
        input.parentElement.appendChild(err);
      }
      err.textContent = message;
      input.classList.add('invalid');
    }
  
    function clearErrors(form) {
      form.querySelectorAll('.error-message').forEach(el => el.remove());
      form.querySelectorAll('.invalid').forEach(el => el.classList.remove('invalid'));
    }
  
    function isValidEmail(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
  
    // ——— SIGN UP ———
    const signupForm = document.querySelector('.signup-form');
    if (signupForm) {
      signupForm.addEventListener('submit', e => {
        e.preventDefault();
        clearErrors(signupForm);
  
        const nameInput     = signupForm.querySelector('#name');
        const emailInput    = signupForm.querySelector('#email');
        const passwordInput = signupForm.querySelector('#password');
        const confirmInput  = signupForm.querySelector('#confirm-password');
  
        const name  = nameInput.value.trim();
        const email = emailInput.value.trim().toLowerCase();
        const pwd   = passwordInput.value;
        const cpwd  = confirmInput.value;
  
        let valid = true;
        if (!name) {
          showError(nameInput, 'Name is required.');
          valid = false;
        }
        if (!email) {
          showError(emailInput, 'Email is required.');
          valid = false;
        } else if (!isValidEmail(email)) {
          showError(emailInput, 'Invalid email format.');
          valid = false;
        }
        if (!pwd) {
          showError(passwordInput, 'Password is required.');
          valid = false;
        } else if (pwd.length < 8) {
          showError(passwordInput, 'Password must be at least 8 characters.');
          valid = false;
        }
        if (pwd !== cpwd) {
          showError(confirmInput, 'Passwords do not match.');
          valid = false;
        }
        if (!valid) {
          signupForm.reset();
          return;
        }
  
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        if (users.some(u => u.email === email)) {
          showError(emailInput, 'This email is already registered.');
          signupForm.reset();
          return;
        }
  
        users.push({ name, email, password: pwd });
        localStorage.setItem('users', JSON.stringify(users));
  
        alert('✅ Sign-up successful! Redirecting to login…');
        signupForm.reset();
        window.location.href = 'index.html'; 
      });
    }
  
    // ——— LOG IN ———
    const loginForm = document.querySelector('.login-card form');
    if (loginForm) {
      loginForm.addEventListener('submit', e => {
        e.preventDefault();
        clearErrors(loginForm);
  
        const emailInput    = loginForm.querySelector('#email');
        const passwordInput = loginForm.querySelector('#password');
        const email = emailInput.value.trim().toLowerCase();
        const pwd   = passwordInput.value;
  
        let valid = true;
        if (!email) {
          showError(emailInput, 'Email is required.');
          valid = false;
        } else if (!isValidEmail(email)) {
          showError(emailInput, 'Please enter a valid email.');
          valid = false;
        }
        if (!pwd) {
          showError(passwordInput, 'Password is required.');
          valid = false;
        }
        if (!valid) {
          loginForm.reset();
          return;
        }
  
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user  = users.find(u => u.email === email);
  
        if (!user) {
          showError(emailInput, 'No account found with that email.');
          loginForm.reset();
          return;
        }
        if (user.password !== pwd) {
          showError(passwordInput, 'Incorrect password.');
          loginForm.reset();
          return;
        }
  
        // — on success —
        localStorage.setItem('currentUser', JSON.stringify(user));
        loginForm.reset();
        window.location.href = 'fixtures.html'; // redirect to the dashboard or main page
      });
    }
  });
  