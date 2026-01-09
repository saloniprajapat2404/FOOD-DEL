import dotenv from 'dotenv';
dotenv.config();

const API = process.env.API || 'http://localhost:4000';

async function request(path, body){
  const res = await fetch(`${API}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  const text = await res.text();
  try{ return JSON.parse(text); } catch(e){ return { status: res.status, body: text }; }
}

async function run(){
  console.log('Testing register -> login against', API);
  const rnd = Math.floor(Math.random()*10000);
  const email = `test_user_${rnd}@example.com`;
  const payload = { name: 'Test User', email, password: 'pass1234' };

  console.log('Registering', email);
  const reg = await request('/api/auth/register', payload);
  console.log('Register response:', reg);

  console.log('Logging in');
  const login = await request('/api/auth/login', { email: payload.email, password: payload.password });
  console.log('Login response:', login);

  if (login?.success) {
    console.log('✅ Auth test passed — token received');
  } else {
    console.log('❌ Auth test failed — inspect responses above');
  }
}

run().catch(err=>{
  console.error('Test script error:', err?.message||err);
  process.exit(1);
});
