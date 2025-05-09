// app.js

// ——— Helper Functions ———
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
  
  // Valid stand identifiers
  const validStands = [
    'P', 'P1', 'P2', 'P3',
    'A1', 'A2',
    'B1', 'B2', 'B3',
    'C1', 'C2',
    'SK4', 'SK3', 'SK2', 'SK1',
    'G1', 'G2',
    'H1',
    'J1', 'J2', 'J3',
    'K1',
    'L1'
  ];
  
  // Phone validation: allows optional + and 10-15 digits
  function isValidPhone(phone) {
    return /^\+?\d{10,15}$/.test(phone);
  }
  
  // Membership validation: exactly 12 digits
  function isValidMembership(id) {
    return /^\d{12}$/.test(id);
  }
  
  // Stand validation: must match one of the validStands
  function isValidStand(stand) {
    return validStands.includes(stand.toUpperCase());
  }
  
  // Renders a calendar month, highlighting the booked day and showing event text
  function renderCalendar(dateStr, eventText) {
    const [year, month, day] = dateStr.split('-').map(n => parseInt(n, 10));
    const firstOfMonth = new Date(year, month - 1, 1);
    const monthName = firstOfMonth.toLocaleString('default', { month: 'long', year: 'numeric' });
    const startWeekday = firstOfMonth.getDay();
    const daysInMonth = new Date(year, month, 0).getDate();
  
    let html = `<div class="cal-header"><h2>${monthName}</h2></div><div class="cal-grid">`;
  
    // Weekday headers
    ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].forEach(d => {
      html += `<div class="cal-day-name">${d}</div>`;
    });
  
    // Empty leading cells
    for (let i = 0; i < startWeekday; i++) {
      html += `<div class="cal-day empty"></div>`;
    }
  
    // Days of month
    for (let d = 1; d <= daysInMonth; d++) {
      const isBooked = d === day;
      const classes = isBooked ? 'cal-day has-event' : 'cal-day';
      html += `<div class="${classes}"><div class="date">${d}</div>`;
      if (isBooked && eventText) {
        html += `<div class="event-name">${eventText}</div>`;
      }
      html += `</div>`;
    }
  
    html += `</div>`;
    return html;
  }
  
  // ——— Main Initialization ———
  document.addEventListener('DOMContentLoaded', () => {
    // 1) Fixtures Page: redirect to booking with date & opponent, prevent if already booked
    const fixtureBtns = document.querySelectorAll('.book-now-btn');
    if (fixtureBtns.length > 0) {
      fixtureBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          const existing = JSON.parse(localStorage.getItem('booking') || 'null');
          if (existing) {
            alert('You have already booked a match.');
            return;
          }
          const card = btn.closest('.fixture-card');
          const date = card.dataset.date;
          const opponent = encodeURIComponent(
            card.querySelector('.fixture-title').textContent.trim()
          );
          window.location.href = `booking.html?date=${date}&opponent=${opponent}`;
        });
      });
      return;
    }
  
    // 2) Booking Page: validate fields, prevent double-book, save, and redirect
    const bookingForm = document.getElementById('booking-form');
    if (bookingForm) {
      bookingForm.addEventListener('submit', e => {
        e.preventDefault();
        clearErrors(bookingForm);
  
        const phoneIn      = bookingForm.querySelector('#phone');
        const membershipIn = bookingForm.querySelector('#membership');
        const standIn      = bookingForm.querySelector('#stand');
        const quantityIn   = bookingForm.querySelector('#quantity');
  
        let valid = true;
        const phone      = phoneIn.value.trim();
        const membership = membershipIn.value.trim();
        const stand      = standIn.value.trim();
        const quantity   = quantityIn.value;
  
        // Prevent double booking
        const existing = JSON.parse(localStorage.getItem('booking') || 'null');
        if (existing) {
          showError(phoneIn, 'You have already booked a match.');
          valid = false;
        }
  
        // Field validations
        if (!phone)      { showError(phoneIn, 'Phone number is required.'); valid = false; }
        else if (!isValidPhone(phone)) { showError(phoneIn, 'Enter a valid phone (10–15 digits, optional +).'); valid = false; }
  
        if (!membership) { showError(membershipIn, 'Membership ID is required.'); valid = false; }
        else if (!isValidMembership(membership)) { showError(membershipIn, 'Membership ID must be 12 digits.'); valid = false; }
  
        if (!stand)      { showError(standIn, 'Stand number is required.'); valid = false; }
        else if (!isValidStand(stand)) { showError(standIn, 'Stand must be one of: ' + validStands.join(', ')); valid = false; }
  
        if (!quantity)   { showError(quantityIn, 'Please select quantity.'); valid = false; }
  
        if (!valid) {
          bookingForm.reset();
          return;
        }
  
        // Persist booking
        const params   = new URLSearchParams(window.location.search);
        const date     = params.get('date');
        const opponent = decodeURIComponent(params.get('opponent') || '');
        const booking  = { date, opponent, phone, membership, stand, quantity };
        localStorage.setItem('booking', JSON.stringify(booking));
  
        window.location.href = 'calendar.html';
      });
      return;
    }
  
    // 3) Calendar Page: always render month and highlight booking if present
    const calContainer = document.getElementById('calendar');
    if (calContainer) {
      const booking = JSON.parse(localStorage.getItem('booking') || 'null');
      const dateToShow = booking ? booking.date : new Date().toISOString().slice(0,10);
      calContainer.innerHTML = renderCalendar(dateToShow, booking ? booking.opponent : '');
  
      if (!booking) {
        const msg = document.createElement('p');
        msg.textContent = 'No bookings yet—here’s an empty calendar:';
        msg.style.textAlign = 'center';
        calContainer.parentNode.insertBefore(msg, calContainer);
      }
    }
  });
  