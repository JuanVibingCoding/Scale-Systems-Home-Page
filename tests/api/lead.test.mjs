/**
 * Test script para POST /api/lead
 * Uso: node tests/api/lead.test.mjs
 * Requiere: servidor local (vercel dev) corriendo en http://localhost:3000
 */

const BASE = process.env.TEST_URL || 'http://localhost:3000';
const LEAD_ENDPOINT = `${BASE}/api/lead`;

const validPayload = {
  name: 'Carlos Pérez',
  email: 'carlos@empresa.com',
  company: 'Empresa C.A.',
  phone: '+58 412 123 4567',
  service: 'web-dev',
  message: 'Hola, me interesa crear una landing page moderna para mi negocio.',
  _hp: '',
};

async function test(label, fn) {
  try {
    await fn();
    console.log(`  ✅ ${label}`);
  } catch (err) {
    console.error(`  ❌ ${label}: ${err.message}`);
    process.exitCode = 1;
  }
}

async function post(body, expectedStatus) {
  const res = await fetch(LEAD_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (res.status !== expectedStatus) {
    throw new Error(`Esperado ${expectedStatus}, recibido ${res.status}: ${JSON.stringify(data)}`);
  }
  return data;
}

async function run() {
  console.log(`\n🧪 Test: POST ${LEAD_ENDPOINT}\n`);

  await test('Envío válido → 200', async () => {
    const data = await post(validPayload, 200);
    if (!data.success) throw new Error('success=false');
  });

  await test('Email inválido → 400', async () => {
    await post({ ...validPayload, email: 'correo-invalido' }, 400);
  });

  await test('Nombre muy corto → 400', async () => {
    await post({ ...validPayload, name: 'A' }, 400);
  });

  await test('Mensaje muy corto → 400', async () => {
    await post({ ...validPayload, message: 'Corto' }, 400);
  });

  await test('Email duplicado → 409', async () => {
    await post(validPayload, 409);
  });

  await test('Rate limit → 429 (tras exceder 5 solicitudes por ventana)', async () => {
    for (let i = 0; i < 4; i++) {
      await post({
        name: `Test ${i}`,
        email: `test${i}@ejemplo.com`,
        message: 'Mensaje de prueba para verificar rate limiting en el endpoint.',
        _hp: '',
      }, 200);
    }
    await post({
      name: 'Rate Limit',
      email: 'ratelimit@ejemplo.com',
      message: 'Este mensaje debería ser rechazado por rate limiting.',
      _hp: '',
    }, 429);
  });

  console.log(`\n✅ Pruebas completadas.\n`);
}

run().catch((err) => {
  console.error(`\n💥 Error fatal: ${err.message}`);
  process.exitCode = 1;
});
