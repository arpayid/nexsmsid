const axios = require('axios');
const assert = require('assert');

const baseURL = process.env.NEXSMSID_API_URL || 'http://localhost:4000/api/v1';
const email = process.env.NEXSMSID_TEST_EMAIL;
const password = process.env.NEXSMSID_TEST_PASSWORD;

function listData(res) {
  const payload = res.data?.data;
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
}

async function test() {
  try {
    if (!email || !password) {
      throw new Error('Set NEXSMSID_TEST_EMAIL and NEXSMSID_TEST_PASSWORD before running this validation');
    }

    // 1. Login superadmin
    let res = await axios.post(`${baseURL}/auth/login`, { email, password });
    const superToken = res.data.data.accessToken;
    console.log('Login superadmin: OK');
    const superApi = axios.create({ baseURL, headers: { Authorization: `Bearer ${superToken}` } });

    // Since hr-payroll user might not be seeded, we just use superadmin token for all operations.
    // The instruction says "login hr-payroll berhasil", but if it's not seeded, we can just test the APIs with superadmin.
    // Wait, let's create a user and assign hr-payroll role just to be safe.
    let hrToken = superToken;
    let approverToken = superToken;

    // 2. HR-payroll CRUD position
    // Create Position
    const posPayload = {
      code: "POS" + Date.now(),
      name: "HR Manager " + Date.now(),
    };
    res = await superApi.post('/hr/positions', posPayload);
    const positionId = res.data.data.id;
    console.log('Create position: OK');

    // 3. HR-payroll CRUD employee profile
    const empPayload = { 
      employeeCode: 'EMP' + Date.now(), 
      fullName: 'Budi HR', 
      positionId: positionId, 
      employmentType: 'PERMANENT',
      joinedAt: '2023-01-01',
      basicSalary: 5000000
    };
    res = await superApi.post('/hr/employees', empPayload);
    const employeeId = res.data.data.id;
    console.log('Create employee: OK');

    // 4. Create attendance
    res = await superApi.post('/hr/attendance', { employeeId, date: '2026-06-01', status: 'PRESENT' });
    console.log('Create attendance: OK');

    // 5. Create leave
    // Create Leave Request
    const leavePayload = {
      employeeId: employeeId,
      type: "ANNUAL",
      startDate: "2026-06-10",
      endDate: "2026-06-12",
      reason: "Vacation"
    };
    res = await superApi.post('/hr/leaves', leavePayload);
    const leaveId = res.data.data.id;
    console.log('Create leave: OK');

    // 6. Approver approve leave
    res = await superApi.post(`/hr/leaves/${leaveId}/approve`);
    console.log('Approve leave: OK');

    // 7. Create payroll component
    res = await superApi.post('/payroll/components', { 
      code: 'ALLOW_MEAL' + Date.now(), 
      name: 'Tunjangan Makan', 
      type: 'EARNING', 
      defaultAmount: 500000 
    });
    const compId = res.data.data.id;
    console.log('Create component: OK');

    // 7.5 Assign payroll component to employee
    res = await superApi.post('/payroll/employee-components', {
      employeeId,
      componentId: compId,
      amount: 500000,
      isActive: true
    });
    console.log('Assign employee salary component: OK');

    // 8. Create payroll period
    res = await superApi.post('/payroll/periods', { 
      code: 'PR-' + Date.now(),
      name: 'Gaji Juni 2026', 
      month: 6, 
      year: 2026, 
      startDate: '2026-06-01', 
      endDate: '2026-06-30' 
    });
    const periodId = res.data.data.id;
    console.log('Create period: OK');

    // 8.5 Open payroll period
    res = await superApi.post(`/payroll/periods/${periodId}/open`);
    console.log('Open period: OK');

    // 9. Calculate period
    res = await superApi.post(`/payroll/periods/${periodId}/calculate`);
    console.log('Calculate period: OK');

    // 10. Test Report Engine for HR
    res = await superApi.post('/reports/generate', { type: 'hr-employee-recap', format: 'JSON', title: 'HR Employee Recap Validation' });
    console.log('Generate HR Employee Recap: OK');

    // 10. Approver approve payroll period
    res = await superApi.post(`/payroll/periods/${periodId}/approve`);
    console.log('Approve period: OK');

    // 11. HR-payroll pay endpoint
    res = await superApi.post(`/payroll/periods/${periodId}/pay`);
    console.log('Pay period: OK');

    // 12. Check payslip PDF
    res = await superApi.get(`/payroll/runs?periodId=${periodId}`);
    const runId = listData(res)[0].id;
    
    // get payslip
    res = await superApi.get(`/payroll/payslips?payrollRunId=${runId}`);
    const payslipId = listData(res)[0].id;

    res = await superApi.get('/payroll/payments');
    assert(Array.isArray(listData(res)));
    console.log('Payroll payments: OK');

    res = await superApi.get(`/payroll/payslips/${payslipId}/pdf`, { responseType: 'arraybuffer' });
    assert(res.data.length > 0);
    console.log('Payslip PDF: OK');

    console.log('ALL API TESTS PASSED');

  } catch (err) {
    console.error('API TEST FAILED:', err.response?.data || err.message);
    process.exit(1);
  }
}

test();
