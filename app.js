const http = require('http');
const dayjs = require('dayjs');
const {
    getAllStudents,
    getStudentById,
    getStudentsByGrade,
    getAverageAge,
    getGradeDistribution,
    addStudent,
    updateStudent,
    deleteStudent
} = require('./students');

const GRADE_COLORS = { A: '#11998e', B: '#2563eb', C: '#f59e0b', D: '#ef4444', F: '#6b7280' };

function renderPage(students, avgAge, gradeDistribution) {
    const rows = students.map(s => {
        const color = GRADE_COLORS[s.grade] || '#6b7280';
        return `<tr data-id="${s.id}">
      <td>${s.id}</td>
      <td class="cell-name">${s.name}</td>
      <td class="cell-age">${s.age}</td>
      <td class="cell-grade"><span class="badge" style="background:${color}">${s.grade}</span></td>
      <td class="cell-email">${s.email}</td>
      <td class="actions">
        <button class="btn-edit" onclick="startEdit(${s.id})">Edit</button>
        <button class="btn-delete" onclick="removeStudent(${s.id})">Delete</button>
      </td>
    </tr>`;
    }).join('');

    return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Student Profile System</title>
<style>
  :root{--bg:#f1f5f9;--panel:#ffffff;--text:#1c2530;--muted:#64748b;--border:#e2e8f0;}
  *{box-sizing:border-box;}
  body{margin:0;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;background:var(--bg);color:var(--text);}
  .hero{background:linear-gradient(135deg,#11998e,#2563eb);color:#fff;padding:40px 24px;text-align:center;}
  .hero h1{margin:0 0 8px;font-size:1.9rem;}
  .hero p{margin:0;opacity:0.9;font-size:0.95rem;}
  .wrap{max-width:960px;margin:-24px auto 40px;padding:0 16px;}
  .card{background:var(--panel);border-radius:12px;box-shadow:0 4px 18px rgba(0,0,0,0.08);padding:24px;}
  .stats{display:flex;gap:16px;flex-wrap:wrap;margin-bottom:20px;}
  .stat{flex:1;min-width:140px;background:var(--bg);border-radius:10px;padding:14px 16px;}
  .stat .label{font-size:0.75rem;color:var(--muted);text-transform:uppercase;letter-spacing:0.04em;}
  .stat .value{font-size:1.5rem;font-weight:700;margin-top:2px;}
  table{border-collapse:collapse;width:100%;font-size:0.92rem;}
  th,td{padding:10px 12px;text-align:left;border-bottom:1px solid var(--border);}
  th{color:var(--muted);font-size:0.78rem;text-transform:uppercase;letter-spacing:0.03em;}
  tr:hover td{background:#f8fafc;}
  .badge{display:inline-block;color:#fff;font-weight:600;font-size:0.8rem;padding:2px 10px;border-radius:999px;}
  .footer-note{margin-top:18px;font-size:0.8rem;color:var(--muted);display:flex;justify-content:space-between;flex-wrap:wrap;gap:8px;}
  .pg-badge{display:inline-flex;align-items:center;gap:6px;background:#eef2ff;color:#3730a3;padding:3px 10px;border-radius:999px;font-weight:600;}
  .add-card{margin-top:20px;}
  .add-card h3{margin:0 0 12px;font-size:1rem;}
  .student-form{display:flex;gap:10px;flex-wrap:wrap;align-items:center;}
  .student-form input,.student-form select{padding:8px 10px;border:1px solid var(--border);border-radius:6px;font-size:0.9rem;}
  .student-form input[type="text"],.student-form input[type="email"]{flex:1;min-width:140px;}
  .student-form button{padding:8px 18px;border:none;border-radius:6px;background:#2563eb;color:#fff;font-weight:600;cursor:pointer;}
  .student-form button:hover{background:#1d4ed8;}
  .form-error{color:#ef4444;font-size:0.85rem;margin:8px 0 0;}
  .btn-edit,.btn-delete{padding:4px 10px;border:none;border-radius:6px;font-size:0.78rem;font-weight:600;cursor:pointer;margin-right:4px;}
  .btn-edit{background:#2563eb;color:#fff;}
  .btn-edit:hover{background:#1d4ed8;}
  .btn-delete{background:#ef4444;color:#fff;}
  .btn-delete:hover{background:#dc2626;}
  .cell-age input,.cell-grade select,.cell-name input,.cell-email input{padding:4px 6px;border:1px solid var(--border);border-radius:4px;font-size:0.88rem;}
  .cell-age input{width:60px;}
</style>
</head>
<body>
  <div class="hero">
    <h1 style="color:#f59e0b;">Student Profile System</h1>
    <p style="font-size:0.78rem;color:#dbeafe;margin-top:-6px;">v1.4 from GitHub Actions</p>
    <p>Backed by PostgreSQL · Module 6 onward</p>
  </div>
  <div class="wrap">
    <div class="card">
      <div class="stats">
        <div class="stat"><div class="label">Total Students</div><div class="value">${students.length}</div></div>
        <div class="stat"><div class="label">Average Age</div><div class="value">${avgAge.toFixed(1)}</div></div>
        <div class="stat"><div class="label">Grade A</div><div class="value">${gradeDistribution['A'] || 0}</div></div>
      </div>
      <table>
        <tr><th>ID</th><th>Name</th><th>Age</th><th>Grade</th><th>Email</th><th>Actions</th></tr>
        ${rows}
      </table>
      <div class="footer-note">
        <span class="pg-badge">&#9679; PostgreSQL</span>
        <span>Server time: ${dayjs().format('YYYY-MM-DD HH:mm:ss')}</span>
      </div>
    </div>
    <div class="card add-card">
      <h3>Add Student</h3>
      <form id="addForm" class="student-form">
        <input type="text" id="add-name" placeholder="Name" required>
        <input type="number" id="add-age" placeholder="Age" required min="1" style="width:80px;">
        <select id="add-grade" required>
          <option value="">Grade</option>
          <option>A</option><option>B</option><option>C</option><option>D</option><option>F</option>
        </select>
        <input type="email" id="add-email" placeholder="Email" required>
        <button type="submit">Add Student</button>
      </form>
      <p id="add-error" class="form-error"></p>
    </div>
  </div>
  <script>
    document.getElementById('addForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const errEl = document.getElementById('add-error');
      errEl.textContent = '';
      const body = {
        name: document.getElementById('add-name').value,
        age: document.getElementById('add-age').value,
        grade: document.getElementById('add-grade').value,
        email: document.getElementById('add-email').value
      };
      try {
        const res = await fetch('/api/students', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        });
        const result = await res.json();
        if (!result.success) { errEl.textContent = result.error; return; }
        location.reload();
      } catch (err) {
        errEl.textContent = 'Request failed: ' + err.message;
      }
    });

    async function removeStudent(id) {
      if (!confirm('Delete this student?')) return;
      const res = await fetch('/api/students/' + id, { method: 'DELETE' });
      const result = await res.json();
      if (!result.success) { alert(result.error); return; }
      location.reload();
    }

    function startEdit(id) {
      const row = document.querySelector('tr[data-id="' + id + '"]');
      const name = row.querySelector('.cell-name').textContent.trim();
      const age = row.querySelector('.cell-age').textContent.trim();
      const grade = row.querySelector('.cell-grade').textContent.trim();
      const email = row.querySelector('.cell-email').textContent.trim();
      row.querySelector('.cell-name').innerHTML = '<input type="text" class="edit-name" value="' + name + '">';
      row.querySelector('.cell-age').innerHTML = '<input type="number" class="edit-age" value="' + age + '">';
      row.querySelector('.cell-grade').innerHTML = '<select class="edit-grade">' +
        ['A', 'B', 'C', 'D', 'F'].map(g => '<option' + (g === grade ? ' selected' : '') + '>' + g + '</option>').join('') +
        '</select>';
      row.querySelector('.cell-email').innerHTML = '<input type="email" class="edit-email" value="' + email + '">';
      row.querySelector('.actions').innerHTML =
        '<button class="btn-edit" onclick="saveEdit(' + id + ')">Save</button>' +
        '<button class="btn-delete" onclick="location.reload()">Cancel</button>';
    }

    async function saveEdit(id) {
      const row = document.querySelector('tr[data-id="' + id + '"]');
      const body = {
        name: row.querySelector('.edit-name').value,
        age: row.querySelector('.edit-age').value,
        grade: row.querySelector('.edit-grade').value,
        email: row.querySelector('.edit-email').value
      };
      const res = await fetch('/api/students/' + id, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const result = await res.json();
      if (!result.success) { alert(result.error); return; }
      location.reload();
    }
  </script>
</body>
</html>`;
}

function readBody(req) {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
            try {
                resolve(body ? JSON.parse(body) : {});
            } catch (error) {
                reject(new Error('Invalid JSON body'));
            }
        });
        req.on('error', reject);
    });
}

function createServer() {
    return http.createServer(async (req, res) => {
        try {
            if (req.url === '/' && req.method === 'GET') {
                const students = await getAllStudents();
                const avgAge = await getAverageAge();
                const gradeDistribution = await getGradeDistribution();
                res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                res.end(renderPage(students, avgAge, gradeDistribution));
            } else if (req.url === '/api/students' && req.method === 'GET') {
                const students = await getAllStudents();
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, data: students }));
            } else if (req.url === '/api/students' && req.method === 'POST') {
                const body = await readBody(req);
                try {
                    const student = await addStudent(body.name, parseInt(body.age), body.grade, body.email);
                    res.writeHead(201, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: true, data: student }));
                } catch (error) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, error: error.message }));
                }
            } else if (req.url.match(/\/api\/students\/\d+/) && req.method === 'GET') {
                const id = parseInt(req.url.split('/')[3]);
                try {
                    const student = await getStudentById(id);
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: true, data: student }));
                } catch (error) {
                    res.writeHead(404, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, error: error.message }));
                }
            } else if (req.url.match(/\/api\/students\/\d+/) && req.method === 'PUT') {
                const id = parseInt(req.url.split('/')[3]);
                const body = await readBody(req);
                try {
                    const student = await updateStudent(id, body.name, parseInt(body.age), body.grade, body.email);
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: true, data: student }));
                } catch (error) {
                    const status = error.message === 'Student not found' ? 404 : 400;
                    res.writeHead(status, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, error: error.message }));
                }
            } else if (req.url.match(/\/api\/students\/\d+/) && req.method === 'DELETE') {
                const id = parseInt(req.url.split('/')[3]);
                try {
                    await deleteStudent(id);
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: true }));
                } catch (error) {
                    const status = error.message === 'Student not found' ? 404 : 400;
                    res.writeHead(status, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, error: error.message }));
                }
            } else if (req.url.match(/\/api\/students\/grade\/[A-F]/) && req.method === 'GET') {
                const grade = req.url.split('/')[4];
                const students = await getStudentsByGrade(grade);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, data: students }));
            } else {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('Page not found');
            }
        } catch (error) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, error: 'Database error: ' + error.message }));
        }
    });
}

const PORT = process.env.PORT || 3000;

if (require.main === module) {
    const server = createServer();
    server.listen(PORT, () => {
        console.log(`Student Profile System (PostgreSQL) running on http://localhost:${PORT}`);
    });
}

module.exports = { createServer };
