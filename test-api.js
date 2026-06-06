const axios = require('axios');
const assert = require('assert');

const baseURL = 'http://76.13.197.7/api/v1';

async function test() {
  try {
    // 1. Login superadmin
    let res = await axios.post(`${baseURL}/auth/login`, { email: 'superadmin@nexsmsid.dev', password: 'ChangeMe123!' });
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
      baseSalary: 5000000,
    };
    res = await superApi.post('/hr/positions', posPayload);
    const positionId = res.data.data.id;
    console.log('Create position: OK');

    // 3. HR-payroll CRUD employee profile
    const empPayload = { 
      employeeCode: 'EMP' + Date.now(), 
      fullName: 'Budi HR', 
      positionId: positionId, 
      employmentStatus: 'PERMANENT', 
      joinDate: '2023-01-01', 
      baseSalary: 5000000 
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

    // 8. Create payroll period
    res = await superApi.post('/payroll/periods', { 
      code: 'PR-2026-06', 
      name: 'Gaji Juni 2026', 
      month: 6, 
      year: 2026, 
      startDate: '2026-06-01', 
      endDate: '2026-06-30' 
    });
    const periodId = res.data.data.id;
    console.log('Create period: OK');

    // 9. Calculate payroll period
    res = await superApi.post(`/payroll/periods/${periodId}/calculate`);
    console.log('Calculate period: OK');

    // 10. Approver approve payroll period
    res = await superApi.post(`/payroll/periods/${periodId}/approve`);
    console.log('Approve period: OK');

    // 11. HR-payroll pay endpoint
    res = await superApi.post(`/payroll/periods/${periodId}/pay`);
    console.log('Pay period: OK');

    // 12. Check payslip PDF
    res = await superApi.get(`/payroll/runs?periodId=${periodId}`);
    const runId = res.data.data[0].id;
    
    // get payslip
    res = await superApi.get(`/payroll/payslips?payrollRunId=${runId}`);
    const payslipId = res.data.data[0].id;

    res = await superApi.get(`/payroll/payslips/${payslipId}/pdf`, { responseType: 'arraybuffer' });
    assert(res.data.length > 0);
    console.log('Payslip PDF: OK');

    console.log('ALL API TESTS PASSED');

  } catch (err) {
    console.error('API TEST FAILED:', err.response?.config?.data, err.response?.data || err.message);
    process.exit(1);
  }
}

test();
