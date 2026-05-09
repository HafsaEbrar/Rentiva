let activeTab = 'kullanici';

function switchTab(btn, tab) {
  activeTab = tab;
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
}

function togglePassword() {
  const input = document.getElementById('password');
  input.type = input.type === 'password' ? 'text' : 'password';
}

async function handleLogin() {
  if (activeTab === 'yonetici') {
    window.location.href = 'admin.html';
    return;
  }

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();

  if (!email || !password) {
    alert('Lütfen e-posta ve şifrenizi girin.');
    return;
  }

  try {
    const response = await fetch('http://localhost:8080/api/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.user.role);
      localStorage.setItem('userId', data.user.id);
      window.location.href = 'index.html';
    } else {
      alert(data.message || 'Giriş başarısız.');
    }

  } catch (error) {
    alert('Sunucuya bağlanılamadı.');
    console.error(error);
  }
}