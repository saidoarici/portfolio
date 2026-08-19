import fs from 'node:fs';
import path from 'node:path';

const out = path.resolve('assets/demos');
fs.mkdirSync(out, { recursive: true });

const esc = (s) => String(s).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
let font = "Inter, ui-sans-serif, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
const mono = "'SFMono-Regular', Consolas, monospace";
let c;
let ui;

const themes = {
  payment: {
    font: "Poppins, Inter, ui-sans-serif, sans-serif", ui: { cardR: 16, controlR: 10 },
    colors: { bg:'#EAF0F7', shell:'#F5F8FA', sidebar:'#FFFFFF', card:'#FFFFFF', card2:'#F9FAFB', track:'#E9ECEF', line:'#E2E8F0', text:'#1E293B', muted:'#64748B', soft:'#334155', green:'#198754', amber:'#D97706', red:'#DC3545', blue:'#0D6EFD', purple:'#4F46E5', cyan:'#0DCAF0' }
  },
  balance: {
    font: "Inter, ui-sans-serif, sans-serif", ui: { cardR: 14, controlR: 7 },
    colors: { bg:'#EDE9E1', shell:'#F8F6F1', sidebar:'#F2EFE8', card:'#FEFDFC', card2:'#F5F2EC', track:'#E8E3D9', line:'#DDD8CD', text:'#29251F', muted:'#756F66', soft:'#423D36', green:'#34855F', amber:'#C37518', red:'#C84F3F', blue:'#3866D5', purple:'#7556C8', cyan:'#237F91' }
  },
  rawabet: {
    font: "Inter, ui-sans-serif, sans-serif", ui: { cardR: 10, controlR: 6 },
    colors: { bg:'#E9EDF2', shell:'#F6F7F9', sidebar:'#FFFFFF', card:'#FFFFFF', card2:'#F0F2F5', track:'#E8EBEF', line:'#E2E6EC', text:'#141B26', muted:'#616B79', soft:'#4E5A6B', green:'#178A5B', amber:'#B45309', red:'#D6403A', blue:'#2E5FE8', purple:'#7357C8', cyan:'#17869B' }
  },
  whatsapp: {
    font: "Inter, ui-sans-serif, sans-serif", ui: { cardR: 18, controlR: 12 },
    colors: { bg:'#07101F', shell:'#0F172A', sidebar:'#111C30', card:'#1E293B', card2:'#162236', track:'#334155', line:'#334155', text:'#F8FAFC', muted:'#94A3B8', soft:'#CBD5E1', green:'#22C55E', amber:'#F59E0B', red:'#EF4444', blue:'#3B82F6', purple:'#8B5CF6', cyan:'#22D3EE' }
  }
};

const payment = { theme:'payment', slug:'payment', brand:'Payment Management', accent:'#0D6EFD', accent2:'#4F46E5', mark:'PM', nav:['Dashboard','Requests','Invoices','Beneficiaries','Odoo / QuickBooks','Reports'] };
const balance = { theme:'balance', slug:'anlik-bakiyem', brand:'Anlık Bakiyem', accent:'#3866D5', accent2:'#7BA2F7', mark:'AB', nav:['Overview','Balances','Transactions','Reconciliation','Accounts','Integrations'] };
const rawabet = { theme:'rawabet', slug:'rawabet', brand:'Rawabet', accent:'#2E5FE8', accent2:'#85AAFF', mark:'RA', nav:['Dashboard','Orders','Live fleet','Accounting','Partners','System'] };
const whatsapp = { theme:'whatsapp', slug:'whatsapp-bot', brand:'WA Bot Admin', accent:'#22C55E', accent2:'#8B5CF6', mark:'WA', nav:['Dashboard','Groups','Outbound','System logs','API Management','Security'] };

function activate(project) {
  const theme = themes[project.theme];
  c = theme.colors;
  ui = theme.ui;
  font = theme.font;
}

function t(x, y, value, size = 20, fill = c.text, weight = 500, anchor = 'start', family = font) {
  return `<text x="${x}" y="${y}" fill="${fill}" font-family="${family}" font-size="${size}" font-weight="${weight}" text-anchor="${anchor}">${esc(value)}</text>`;
}
function rect(x, y, w, h, fill, r = 16, stroke = 'none', sw = 1) {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>`;
}
function line(x1, y1, x2, y2, stroke = c.line, sw = 1, dash = '') {
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${stroke}" stroke-width="${sw}" ${dash ? `stroke-dasharray="${dash}"` : ''}/>`;
}
function circle(x, y, r, fill, stroke = 'none') { return `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" stroke="${stroke}"/>`; }
function pill(x, y, label, fill, color = c.text, width) {
  const w = width || Math.max(72, label.length * 8.1 + 26);
  return rect(x, y, w, 30, fill, ui.controlR) + t(x + w / 2, y + 20, label, 12, color, 700, 'middle');
}
function iconBox(x, y, glyph, accent) {
  return rect(x, y, 42, 42, `${accent}22`, ui.controlR, `${accent}55`) + t(x + 21, y + 27, glyph, 14, accent, 800, 'middle');
}
function metric(x, y, w, label, value, delta, accent) {
  return rect(x, y, w, 122, c.card, ui.cardR, c.line) +
    t(x + 22, y + 30, label.toUpperCase(), 11, c.muted, 750) +
    t(x + 22, y + 72, value, 29, c.text, 750) +
    pill(x + 22, y + 84, delta, `${accent}20`, accent);
}
function sectionTitle(x, y, title, detail = '') {
  return t(x, y, title, 17, c.text, 720) + (detail ? t(x, y + 24, detail, 12, c.muted, 500) : '');
}
function row(y, cols, widths, x = 368, h = 54, fills = []) {
  let s = line(x, y + h, x + widths.reduce((a,b)=>a+b,0), y + h, c.line);
  let cx = x;
  cols.forEach((v, i) => {
    const fill = fills[i] || (i === 0 ? c.soft : c.muted);
    s += t(cx + 14, y + 33, v, 13, fill, i === 0 ? 650 : 500);
    cx += widths[i];
  });
  return s;
}
function bar(x, y, w, pct, accent, label, value) {
  return t(x, y, label, 12, c.soft, 600) + t(x + w, y, value, 12, c.text, 700, 'end') +
    rect(x, y + 12, w, 8, c.track, 4) + rect(x, y + 12, w * pct, 8, accent, 4);
}

function frame(project, content, note) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 1600 900">
<defs>
  <linearGradient id="brand" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${project.accent}"/><stop offset="1" stop-color="${project.accent2}"/></linearGradient>
  <filter id="softShadow"><feDropShadow dx="0" dy="10" stdDeviation="20" flood-color="#172033" flood-opacity=".14"/></filter>
</defs>
<rect width="1600" height="900" fill="${c.bg}"/>
${content}
${t(1548,878,note || 'UI concept · fictional sample data · source-informed design',9,c.muted,500,'end')}
</svg>`;
}

function paymentShell(project, title, subtitle, active, body, opts) {
  const nav = project.nav.map((n,i)=>t(520+i*148,70,n,12,i===active?project.accent:c.muted,i===active?700:550,'middle')).join('');
  const content = `${rect(20,20,1560,860,c.shell,20,c.line)}
${rect(20,20,1560,82,c.sidebar,20,c.line)}${rect(20,82,1560,20,c.sidebar,0)}
${rect(52,40,42,42,'url(#brand)',10)}${t(73,67,'PM',13,'#FFFFFF',800,'middle')}
${t(108,59,'Payment',17,project.accent,750)}${t(108,80,'Management',17,c.text,750)}${nav}
${circle(1480,60,18,`${project.accent}18`)}${t(1480,65,'SN',10,project.accent,800,'middle')}${t(1510,65,'Admin',11,c.soft,600)}
${t(210,150,title,27,c.text,720)}${t(210,177,subtitle,13,c.muted,500)}${pill(1370,132,'CONCEPT',`${project.accent}14`,project.accent,112)}
<g transform="translate(-134 42)">${body}</g>`;
  return frame(project,content,opts.note);
}

function balanceShell(project, title, subtitle, active, body, opts) {
  const nav = project.nav.map((n,i)=>{const y=174+i*50,on=i===active;return (on?rect(44,y-25,216,38,`${project.accent}12`,7):'')+t(64,y,n,13,on?project.accent:c.muted,on?680:550)+circle(240,y-5,4,on?project.accent:c.line);}).join('');
  const content = `${rect(20,20,1560,860,c.shell,16,c.line)}${rect(20,20,268,860,c.sidebar,16,c.line)}${rect(268,20,20,860,c.sidebar,0)}
${rect(44,48,40,40,'url(#brand)',9)}${t(64,74,'AB',12,'#FFFFFF',800,'middle')}${t(98,67,'Anlık Bakiyem',17,c.text,730)}${t(98,85,'FİNANS PANOSU',9,c.muted,750)}${line(44,112,260,112,c.line)}${nav}
${t(324,76,title,27,c.text,730)}${t(324,103,subtitle,13,c.muted,500)}${pill(1406,54,'ÖRNEK VERİ',`${project.accent}12`,project.accent,126)}
${rect(44,786,216,62,c.card,10,c.line)}${circle(68,817,14,`${project.accent}18`)}${t(68,821,'SN',9,project.accent,800,'middle')}${t(92,812,'Muhammed Said',11,c.text,650)}${t(92,830,'Hazine yöneticisi',9,c.muted,500)}
${body}`;
  return frame(project,content,opts.note);
}

function rawabetShell(project, title, subtitle, active, body, opts) {
  const groupAt = {0:'WORKSPACE',1:'OPERATIONS',2:'FLEET',3:'ACCOUNTING',4:'USERS',5:'SYSTEM'};
  const nav = project.nav.map((n,i)=>{const y=170+i*82,on=i===active;return t(48,y-20,groupAt[i],9,c.muted,750)+ (on?rect(42,y-6,202,36,`${project.accent}12`,6):'') + rect(54,y+5,18,18,on?project.accent:c.card2,5,on?project.accent:c.line)+t(84,y+19,n,12,on?c.text:c.soft,on?680:550);}).join('');
  const content = `${rect(20,20,1560,860,c.shell,12,c.line)}${rect(20,20,252,860,c.sidebar,12,c.line)}${rect(252,20,20,860,c.sidebar,0)}
${rect(42,42,34,34,c.text,7)}${t(59,64,'R',13,c.sidebar,850,'middle')}${t(88,64,'RAWABET',15,c.text,780)}${line(42,96,244,96,c.line)}${nav}
${rect(272,20,1308,48,c.card,0,c.line)}${rect(296,30,246,28,c.shell,6,c.line)}${t(314,49,'⌕  Search orders, drivers…',11,c.muted,500)}${pill(1390,29,'EN / AR',c.card2,c.muted,78)}${circle(1500,44,14,c.card2)}${t(1500,48,'A',9,c.text,750,'middle')}${t(1522,48,'Admin',10,c.soft,600)}
${t(312,112,title,25,c.text,720)}${t(312,137,subtitle,12,c.muted,500)}${pill(1420,92,'CONCEPT',`${project.accent}12`,project.accent,102)}
${body}`;
  return frame(project,content,opts.note);
}

function whatsappShell(project, title, subtitle, active, body, opts) {
  const nav = project.nav.map((n,i)=>{const y=176+i*54,on=i===active;return (on?rect(42,y-27,220,42,`${project.accent}14`,12):'')+circle(60,y-6,4,on?project.accent:c.muted)+t(78,y-1,n,13,on?c.text:c.muted,on?680:550);}).join('');
  const content = `${rect(20,20,1560,860,c.shell,24,c.line,'1')}<circle cx="1420" cy="80" r="220" fill="${project.accent}" opacity=".035"/>
${rect(20,20,274,860,c.sidebar,24,c.line)}${rect(274,20,20,860,c.sidebar,0)}
${rect(42,48,42,42,'url(#brand)',12)}${t(63,75,'WA',12,'#06120A',850,'middle')}${t(98,65,'WA Bot Admin',17,c.text,760)}${t(98,84,'v1.0.0 · Enterprise',9,c.muted,650)}${line(42,112,264,112,c.line)}${nav}
${t(334,80,title,29,c.text,760)}${t(334,108,subtitle,13,c.muted,500)}${pill(1400,58,'LIVE CONCEPT',`${project.accent}18`,project.accent,134)}
${rect(42,792,220,56,c.card2,12,c.line)}${circle(66,820,14,`${project.accent}18`)}${t(66,824,'A',9,project.accent,800,'middle')}${t(90,816,'admin',11,c.soft,650)}${t(90,833,'Secure session',9,c.muted,500)}
${body}`;
  return frame(project,content,opts.note);
}

function retone(body) {
  return body
    .replaceAll('#162635', c.track)
    .replaceAll('#132331', c.card2)
    .replaceAll('#1B2A38', c.track)
    .replaceAll('#445569', c.muted)
    .replaceAll('#415365', c.muted)
    .replaceAll('#2B1620', `${c.red}14`)
    .replaceAll('#0B1C29', c.card2)
    .replaceAll('#0A1722', c.card2)
    .replaceAll('#091720', c.card2)
    .replaceAll('#284156', c.line)
    .replaceAll('#233D4D', c.line)
    .replaceAll('#1B3140', c.track);
}

function shell(project, title, subtitle, active, body, opts = {}) {
  body = retone(body);
  if (project.theme === 'payment') return paymentShell(project,title,subtitle,active,body,opts);
  if (project.theme === 'balance') return balanceShell(project,title,subtitle,active,body,opts);
  if (project.theme === 'rawabet') return rawabetShell(project,title,subtitle,active,body,opts);
  return whatsappShell(project,title,subtitle,active,body,opts);
}

function paymentCommand() {
  const p = payment; activate(p);
  let b = metric(344,184,258,'Open requests','128','12 urgent',p.accent) + metric(620,184,258,'Awaiting approval','34','3 stages',p.accent) + metric(896,184,258,'Ready for ERP','21','Odoo + QB',p.accent) + metric(1172,184,332,'Today processed','AED 418K','sample value',p.accent);
  b += rect(344,328,778,470,c.card,18,c.line) + sectionTitle(368,362,'Payment request control room','Ownership, stage and risk in one operational queue');
  b += pill(932,344,'All requests','#162635',c.soft,106)+pill(1046,344,'Urgent',`${c.red}22`,c.red,78);
  b += t(382,417,'REQUEST',11,c.muted,750)+t(560,417,'BENEFICIARY',11,c.muted,750)+t(755,417,'AMOUNT',11,c.muted,750)+t(900,417,'STAGE',11,c.muted,750)+t(1032,417,'OWNER',11,c.muted,750);
  b += row(430,['PM-2048','Atlas Supplies','AED 82,450','Finance review','M. Kaya'],[178,195,145,132,104],368,58,[c.soft,c.soft,c.text,p.accent2,c.muted]);
  b += row(488,['PM-2047','Northstar Cargo','AED 41,900','CFO approval','S. Demir'],[178,195,145,132,104],368,58,[c.soft,c.soft,c.text,c.amber,c.muted]);
  b += row(546,['PM-2046','Orbit Services','AED 18,240','ERP ready','A. Yılmaz'],[178,195,145,132,104],368,58,[c.soft,c.soft,c.text,c.green,c.muted]);
  b += row(604,['PM-2045','Vertex Trading','AED 9,780','Documents','M. Kaya'],[178,195,145,132,104],368,58,[c.soft,c.soft,c.text,c.blue,c.muted]);
  b += row(662,['PM-2044','Cedar Consulting','AED 26,500','Completed','S. Demir'],[178,195,145,132,104],368,58,[c.soft,c.soft,c.text,c.green,c.muted]);
  b += rect(1140,328,364,220,c.card,18,c.line)+sectionTitle(1164,362,'Approval health','Live workload by stage')+bar(1164,414,310,.76,p.accent,'Finance review','76%')+bar(1164,468,310,.51,c.amber,'CFO approval','51%')+bar(1164,522,310,.89,c.green,'ERP readiness','89%');
  b += rect(1140,566,364,232,c.card,18,c.line)+sectionTitle(1164,600,'Attention needed','Rules surface exceptions early')+iconBox(1164,628,'!',c.red)+t(1220,646,'3 requests missing invoice',13,c.soft,650)+t(1220,666,'Document validation',11,c.muted)+iconBox(1164,690,'↗',c.amber)+t(1220,708,'2 approvals beyond SLA',13,c.soft,650)+t(1220,728,'Escalation queue',11,c.muted);
  return shell(p,'Payment operations','Controlled request intake, approvals and execution',0,b);
}

function paymentWorkflow() {
  const p = payment; activate(p); let b='';
  b += rect(344,184,1160,614,c.card,18,c.line)+sectionTitle(372,222,'Request PM-2048','A decision-ready workspace with every financial and operational dependency');
  b += pill(1264,202,'FINANCE REVIEW',`${p.accent}22`,p.accent,202);
  const stages=[['01','Submitted',c.green],['02','Validated',c.green],['03','Finance review',p.accent],['04','CFO approval','#445569'],['05','ERP posting','#445569']];
  stages.forEach((s,i)=>{const x=388+i*205;b+=circle(x,292,22,`${s[2]}22`,s[2])+t(x,297,s[0],11,s[2],800,'middle')+(i<4?line(x+26,292,x+179,292,i<2?p.accent:c.line,3):'')+t(x,334,s[1],12,i<=2?c.soft:c.muted,650,'middle');});
  b += rect(372,370,520,384,c.card2,16,c.line)+sectionTitle(398,406,'Payment details','Structured input and validation');
  const fields=[['Beneficiary','Atlas Supplies LLC'],['Bank account','AE•• •••• •••• 4109'],['Invoice reference','INV-2026-0819'],['Payment category','Supplier services'],['Amount','AED 82,450.00']];
  fields.forEach((f,i)=>{const y=448+i*55;b+=t(398,y,f[0].toUpperCase(),10,c.muted,750)+t(540,y,f[1],13,c.soft,650)+line(398,y+17,866,y+17,c.line)});
  b += rect(916,370,560,186,c.card2,16,c.line)+sectionTitle(942,406,'Supporting evidence','Files, invoice analysis and audit context');
  b += iconBox(942,438,'PDF',p.accent)+t(996,454,'supplier-invoice.pdf',13,c.soft,650)+t(996,474,'OCR checked · reference matched',11,c.green,600)+pill(1314,446,'VERIFIED',`${c.green}20`,c.green,132);
  b += rect(916,576,560,178,c.card2,16,c.line)+sectionTitle(942,612,'Decision panel','Approver sees policy checks before action');
  b += pill(942,638,'✓ Beneficiary',`${c.green}20`,c.green,146)+pill(1096,638,'✓ Invoice',`${c.green}20`,c.green,116)+pill(1220,638,'! SLA',`${c.amber}20`,c.amber,84);
  b += rect(942,692,222,38,`${p.accent}22`,10,p.accent)+t(1053,717,'Approve & continue',13,p.accent2,700,'middle')+rect(1178,692,132,38,'#162635',10,c.line)+t(1244,717,'Request edit',13,c.soft,650,'middle')+rect(1322,692,128,38,'#2B1620',10,`${c.red}55`)+t(1386,717,'Reject',13,c.red,650,'middle');
  return shell(p,'Approval workspace','One request, one source of truth, complete decision context',1,b);
}

function paymentErp() {
  const p=payment;activate(p);let b='';
  b+=rect(344,184,1160,614,c.card,18,c.line)+sectionTitle(372,222,'ERP reconciliation studio','Normalize bank and accounting records before posting');
  b+=pill(1260,202,'21 READY TO POST',`${c.green}20`,c.green,206);
  const nodes=[['PAYMENT REQUEST','Validated'],['MATCHING ENGINE','Account + party'],['ODOO / QUICKBOOKS','Posting target'],['AUDIT LOG','Traceable result']];
  nodes.forEach((n,i)=>{const x=386+i*278;b+=rect(x,270,220,100,c.card2,15,i===1?p.accent:c.line, i===1?2:1)+t(x+18,302,n[0],10,i===1?p.accent:c.muted,750)+t(x+18,340,n[1],15,c.soft,680)+(i<3?line(x+220,320,x+270,320,p.accent,2,'6 5'):'')});
  b+=rect(372,406,704,348,c.card2,16,c.line)+sectionTitle(398,442,'Posting queue','Account mapping, source and readiness checks');
  b+=t(398,486,'ITEM',10,c.muted,750)+t(568,486,'TARGET',10,c.muted,750)+t(712,486,'ACCOUNT',10,c.muted,750)+t(932,486,'STATUS',10,c.muted,750);
  b+=row(500,['PM-2046','Odoo','610200 Services','Ready'],[170,144,220,130],390,52,[c.soft,c.soft,c.soft,c.green]);
  b+=row(552,['PM-2043','QuickBooks','Utilities expense','Review'],[170,144,220,130],390,52,[c.soft,c.soft,c.soft,c.amber]);
  b+=row(604,['PM-2039','Odoo','Trade payable','Posted'],[170,144,220,130],390,52,[c.soft,c.soft,c.soft,c.green]);
  b+=row(656,['PM-2037','QuickBooks','Office expense','Exception'],[170,144,220,130],390,52,[c.soft,c.soft,c.soft,c.red]);
  b+=rect(1100,406,376,348,c.card2,16,c.line)+sectionTitle(1126,442,'Selected item','Explainable mapping context');
  b+=t(1126,486,'COUNTERPART',10,c.muted,750)+t(1126,511,'Utilities expense',15,c.soft,680)+t(1126,550,'MATCH CONFIDENCE',10,c.muted,750)+bar(1126,577,310,.86,p.accent,'Rule + history','86%')+t(1126,634,'Checks',11,c.muted,750)+pill(1126,648,'✓ Currency',`${c.green}20`,c.green,118)+pill(1252,648,'✓ Entity',`${c.green}20`,c.green,106)+pill(1366,648,'! Memo',`${c.amber}20`,c.amber,88)+rect(1126,704,310,34,`${p.accent}22`,10,p.accent)+t(1281,727,'Confirm mapping',12,p.accent2,700,'middle');
  return shell(p,'ERP reconciliation','Odoo and QuickBooks posting with visible checks',4,b);
}

function paymentInsights() {
  const p=payment;activate(p);let b='';
  b+=metric(344,184,272,'Completed','316','selected period',p.accent)+metric(634,184,272,'Approval time','1.8 days','median',p.accent)+metric(924,184,272,'Exceptions','14','needs review',p.accent)+metric(1214,184,290,'Automation','72%','classified',p.accent);
  b+=rect(344,328,738,470,c.card,18,c.line)+sectionTitle(370,364,'Payment volume & cycle time','Decision support without exposing transaction-level data');
  const vals=[.34,.48,.44,.65,.56,.72,.69,.83,.77,.91,.74,.88]; vals.forEach((v,i)=>{const x=386+i*53;b+=rect(x,712-v*270,24,v*270,`${p.accent}${i>8?'CC':'66'}`,6)});
  b+=line(382,712,1050,712,c.line)+t(386,744,'JAN',10,c.muted,650)+t(700,744,'JUN',10,c.muted,650)+t(1038,744,'DEC',10,c.muted,650,'end');
  b+=pill(826,350,'Volume',`${p.accent}20`,p.accent,90)+pill(924,350,'Cycle time','#162635',c.soft,112);
  b+=rect(1100,328,404,226,c.card,18,c.line)+sectionTitle(1126,364,'AI-assisted classification','Human review remains in control')+bar(1126,418,330,.82,p.accent,'High confidence','82%')+bar(1126,472,330,.13,c.amber,'Review suggested','13%')+bar(1126,526,330,.05,c.red,'Unclassified','5%');
  b+=rect(1100,574,404,224,c.card,18,c.line)+sectionTitle(1126,610,'Explorer','Drill from trend to controlled detail')+t(1126,652,'Supplier services',13,c.soft,650)+pill(1362,636,'42%',`${p.accent}20`,p.accent,78)+t(1126,700,'Operating expenses',13,c.soft,650)+pill(1362,684,'31%','#162635',c.soft,78)+t(1126,748,'Cash requests',13,c.soft,650)+pill(1362,732,'17%','#162635',c.soft,78);
  return shell(p,'Finance intelligence','Reporting, classification and safe drill-down',5,b);
}

function balanceOverview() {
  const p=balance;activate(p);let b='';
  b+=metric(344,184,270,'Consolidated balance','₺ 24.8M','sample total',p.accent)+metric(632,184,270,'Connected accounts','18','6 banks',p.accent)+metric(920,184,270,'Fresh data','16 / 18','2 sync pending',p.accent)+metric(1208,184,296,'Currencies','TRY · USD · EUR','normalized',p.accent);
  b+=rect(344,328,760,470,c.card,18,c.line)+sectionTitle(370,364,'Liquidity by company','A current, permission-aware treasury view');
  const cos=[['Northstar Group','₺ 11.4M',.82],['Atlas Operations','₺ 7.9M',.61],['Vertex Services','₺ 4.2M',.42],['Orbit Labs','₺ 1.3M',.18]];
  cos.forEach((x,i)=>{const y=430+i*76;b+=circle(392,y-5,18,`${p.accent}22`)+t(392,y,'C'+(i+1),10,p.accent,800,'middle')+t(426,y-8,x[0],13,c.soft,650)+t(426,y+14,'Multi-bank entity',10,c.muted)+t(1038,y,x[1],14,c.text,700,'end')+rect(620,y-13,284,8,'#1B2A38',4)+rect(620,y-13,284*x[2],8,p.accent,4)+line(370,y+36,1078,y+36,c.line)});
  b+=rect(1122,328,382,288,c.card,18,c.line)+sectionTitle(1148,364,'Bank freshness','Last successful balance sync');
  [['Akbank','Now',c.green],['İş Bankası','2 min',c.green],['Garanti BBVA','7 min',c.green],['Yapı Kredi','Pending',c.amber]].forEach((x,i)=>{const y=414+i*48;b+=circle(1155,y-4,5,x[2])+t(1172,y,x[0],13,c.soft,620)+t(1472,y,x[1],12,x[2],650,'end')});
  b+=rect(1122,636,382,162,c.card,18,c.line)+sectionTitle(1148,672,'Operational signal','The next finance action is visible')+iconBox(1148,704,'↻',p.accent)+t(1204,721,'2 accounts need refresh',13,c.soft,650)+t(1204,742,'Retry safely from account detail',11,c.muted);
  return shell(p,'Treasury overview','Multi-company, multi-bank liquidity in one view',0,b);
}

function balanceReconcile() {
  const p=balance;activate(p);let b='';
  b+=rect(344,184,1160,614,c.card,18,c.line)+sectionTitle(372,222,'Reconciliation workspace','Keyboard-first review across bank and accounting records');
  b+=pill(1228,202,'18 SELECTED',`${p.accent}20`,p.accent,146)+pill(1386,202,'ERP READY',`${c.green}20`,c.green,100);
  b+=rect(372,260,754,466,c.card2,16,c.line)+t(396,294,'DATE',10,c.muted,750)+t(502,294,'DESCRIPTION',10,c.muted,750)+t(770,294,'AMOUNT',10,c.muted,750)+t(916,294,'AI INTENT',10,c.muted,750)+t(1050,294,'STATE',10,c.muted,750);
  const rr=[['18 Aug','Supplier payment','−₺ 84,250','expense 94%','Ready',c.green],['18 Aug','Card settlement','+₺ 42,180','transfer 88%','Review',c.amber],['17 Aug','Payroll batch','−₺ 216,900','payroll 99%','Ready',c.green],['17 Aug','Bank fee','−₺ 1,240','fee 97%','Posted',c.blue],['16 Aug','Unmapped credit','+₺ 18,600','other 54%','Exception',c.red],['16 Aug','Tax payment','−₺ 72,410','tax 93%','Ready',c.green]];
  rr.forEach((x,i)=>{const y=312+i*62;b+=row(y,[x[0],x[1],x[2],x[3],x[4]],[106,268,146,134,96],384,62,[c.muted,c.soft,c.text,p.accent2,x[5]])});
  b+=rect(1148,260,328,466,c.card2,16,c.line)+sectionTitle(1174,296,'AI review card','Evidence before automation');
  b+=t(1174,344,'SUGGESTED INTENT',10,c.muted,750)+t(1174,370,'Operating expense',16,c.soft,700)+pill(1174,390,'94% confidence',`${p.accent}20`,p.accent,138)+t(1174,452,'COUNTERPART ACCOUNT',10,c.muted,750)+rect(1174,466,274,42,'#132331',10,c.line)+t(1190,492,'760 — External services',12,c.soft,650)+t(1174,548,'WHY THIS MATCH',10,c.muted,750)+t(1174,574,'• known supplier pattern',12,c.soft)+t(1174,598,'• amount within expected range',12,c.soft)+t(1174,622,'• description rule matched',12,c.soft)+rect(1174,664,130,38,`${p.accent}22`,10,p.accent)+t(1239,689,'Approve',12,p.accent2,700,'middle')+rect(1316,664,132,38,'#162635',10,c.line)+t(1382,689,'Edit',12,c.soft,650,'middle');
  b+=rect(372,744,1104,34,'#0B1C29',10,c.line)+t(394,766,'↑↓ move   SPACE select   ENTER decide   N note   / search   ESC exit',11,c.muted,600, 'start', mono);
  return shell(p,'Reconciliation mode','Fast exception handling with explainable AI assistance',3,b);
}

function balanceIntegrations() {
  const p=balance;activate(p);let b='';
  b+=rect(344,184,1160,614,c.card,18,c.line)+sectionTitle(372,222,'Integration hub','Controlled connectivity across banks, ERP and accounting systems');
  const cards=[['BANK CONNECTORS','6 active','Secure credential vault','Balance + transaction sync',p.accent],['ODOO','Connected','Company-aware mapping','Journal posting target',c.purple],['QUICKBOOKS','Connected','Chart + entity matching','Reconciliation radar',c.blue],['AI / MCP','Read-only','Scoped financial context','Human-approved actions',c.green]];
  cards.forEach((x,i)=>{const xx=372+(i%2)*554, yy=270+Math.floor(i/2)*220;b+=rect(xx,yy,526,194,c.card2,16,c.line)+iconBox(xx+24,yy+24,i===0?'BK':i===1?'OD':i===2?'QB':'AI',x[4])+t(xx+82,yy+48,x[0],11,c.muted,760)+pill(xx+380,yy+24,x[1],`${x[4]}20`,x[4],116)+t(xx+24,yy+104,x[2],15,c.soft,680)+t(xx+24,yy+130,x[3],12,c.muted,520)+line(xx+24,yy+152,xx+502,yy+152,c.line)+circle(xx+28,yy+174,4,c.green)+t(xx+42,yy+178,'Health checks passing',11,c.green,620)});
  b+=rect(372,728,1080,44,`${p.accent}12`,12,`${p.accent}33`)+t(394,756,'Security model',11,p.accent,760)+t(512,756,'Encrypted credentials · tenant isolation · scoped capabilities · audit trail',12,c.soft,550);
  return shell(p,'Integration hub','Bank, Odoo, QuickBooks and read-only AI connectors',5,b);
}

function balanceGovernance() {
  const p=balance;activate(p);let b='';
  b+=rect(344,184,700,614,c.card,18,c.line)+sectionTitle(372,222,'Access control','Capability + scope determines every visible action');
  b+=t(372,270,'ROLE',10,c.muted,750)+t(584,270,'BALANCES',10,c.muted,750)+t(706,270,'TRANSACTIONS',10,c.muted,750)+t(856,270,'INTEGRATIONS',10,c.muted,750);
  [['Treasury admin','Full','Full','Manage'],['Finance analyst','Scoped','Scoped','View'],['Auditor','View','View','None'],['Company viewer','Company','None','None']].forEach((x,i)=>{const y=286+i*70;b+=row(y,x,[212,122,150,150],358,70,[c.soft,p.accent2,p.accent2,i===0?c.green:c.muted])});
  b+=rect(372,604,644,150,c.card2,14,c.line)+sectionTitle(396,638,'Localization built into the product','English · Turkish · Arabic / RTL')+pill(396,674,'EN','#162635',c.soft,64)+pill(468,674,'TR',`${p.accent}20`,p.accent,64)+pill(540,674,'AR / RTL','#162635',c.soft,92)+t(658,694,'Accessible themes and logical layout direction',11,c.muted,520);
  b+=rect(1068,184,436,286,c.card,18,c.line)+sectionTitle(1096,222,'Audit timeline','Who changed what, when and whether it succeeded');
  [['10:42','Account scope updated',c.green],['10:18','Integration health checked',c.green],['09:51','Login challenge verified',c.green],['09:37','Export denied by policy',c.red]].forEach((x,i)=>{const y=270+i*48;b+=circle(1102,y-4,5,x[2])+line(1102,y+4,1102,y+38,c.line)+t(1120,y,x[0],11,c.muted,650, 'start', mono)+t(1172,y,x[1],12,c.soft,600)});
  b+=rect(1068,490,436,308,c.card,18,c.line)+sectionTitle(1096,528,'Account security','Personal security and active-session control')+iconBox(1096,562,'2FA',p.accent)+t(1152,580,'Two-factor authentication',13,c.soft,650)+pill(1364,566,'ON',`${c.green}20`,c.green,74)+iconBox(1096,628,'KEY',c.blue)+t(1152,646,'Recovery codes',13,c.soft,650)+t(1152,666,'Regenerate after sudo confirmation',11,c.muted)+iconBox(1096,694,'DEV',c.amber)+t(1152,712,'Active sessions',13,c.soft,650)+t(1152,732,'Review and revoke devices',11,c.muted);
  return shell(p,'Security & governance','Tenant-safe access, auditability and multilingual UX',0,b);
}

function rawabetOps() {
  const p=rawabet;activate(p);let b='';
  b+=metric(344,184,270,'Active orders','84','12 in transit',p.accent)+metric(632,184,270,'Available drivers','31','6 vendors',p.accent)+metric(920,184,270,'On-time delivery','94%','sample KPI',p.accent)+metric(1208,184,296,'Open exceptions','7','needs action',p.accent);
  b+=rect(344,328,746,470,c.card,18,c.line)+sectionTitle(370,364,'Operations command center','Orders, fleet and service risk in a single view');
  b+=rect(370,408,694,180,'#0A1722',14,c.line)+line(392,548,1018,438,'#284156',10)+line(548,520,716,456,p.accent,5)+circle(548,520,10,p.accent)+circle(716,456,10,p.accent)+circle(918,482,9,c.green)+pill(388,426,'TRIPOLI','#132331',c.soft,90)+pill(900,514,'MISRATA','#132331',c.soft,94)+t(386,576,'Live fleet map · route progress · driver state',11,c.muted,600);
  [['RB-8421','Tripoli → Misrata','In transit',c.blue],['RB-8417','Zawiya → Tripoli','Pickup',p.accent],['RB-8409','Khoms → Benghazi','Exception',c.red]].forEach((x,i)=>{const y=626+i*49;b+=t(374,y,x[0],12,c.soft,700, 'start', mono)+t(478,y,x[1],12,c.soft,550)+pill(884,y-21,x[2],`${x[3]}20`,x[3],146)+line(370,y+20,1064,y+20,c.line)});
  b+=rect(1108,328,396,270,c.card,18,c.line)+sectionTitle(1134,364,'Service pulse','Lifecycle distribution')+bar(1134,418,334,.68,p.accent,'Quoted / approved','28')+bar(1134,472,334,.54,c.blue,'Pickup / transit','39')+bar(1134,526,334,.84,c.green,'Delivered today','17');
  b+=rect(1108,618,396,180,c.card,18,c.line)+sectionTitle(1134,654,'Exception inbox','Actionable, not decorative')+iconBox(1134,686,'!',c.red)+t(1190,703,'2 delayed route updates',13,c.soft,650)+t(1190,724,'Open tracking diagnostics',11,c.muted)+pill(1382,688,'REVIEW',`${c.red}20`,c.red,92);
  return shell(p,'Operations command','Real-time order and fleet visibility for operators',0,b);
}

function rawabetOrder() {
  const p=rawabet;activate(p);let b='';
  b+=rect(344,184,1160,614,c.card,18,c.line)+sectionTitle(372,222,'Order RB-8421','One lifecycle shared by customer, operator and driver');
  b+=pill(1280,202,'IN TRANSIT',`${c.blue}20`,c.blue,132)+pill(1422,202,'LIVE',`${c.green}20`,c.green,64);
  b+=rect(372,270,712,296,c.card2,16,c.line)+sectionTitle(398,306,'Route & execution','Tripoli → Misrata · medium truck · assigned vendor');
  b+=line(430,400,996,400,c.line,6); const ss=[['Booked',c.green],['Approved',c.green],['Assigned',c.green],['Picked up',p.accent],['Delivered','#415365']]; ss.forEach((x,i)=>{const xx=430+i*142;b+=circle(xx,400,13,x[1])+t(xx,440,x[0],11,i<4?c.soft:c.muted,650,'middle')});
  b+=rect(398,478,200,62,'#132331',12,c.line)+t(418,500,'DRIVER',10,c.muted,750)+t(418,524,'Omar A. · Unit 27',13,c.soft,650)+rect(612,478,200,62,'#132331',12,c.line)+t(632,500,'ETA',10,c.muted,750)+t(632,524,'Today · 16:40',13,c.soft,650)+rect(826,478,232,62,'#132331',12,c.line)+t(846,500,'TRACKING',10,c.muted,750)+t(846,524,'Updated 18 sec ago',13,c.green,650);
  b+=rect(1108,270,368,296,c.card2,16,c.line)+sectionTitle(1134,306,'Commercial summary','Quote, payment and document state')+t(1134,354,'Quoted amount',11,c.muted)+t(1448,354,'LYD 4,850',14,c.text,700,'end')+line(1134,374,1448,374,c.line)+t(1134,410,'Customer balance',11,c.muted)+t(1448,410,'LYD 12,300',14,c.text,700,'end')+line(1134,430,1448,430,c.line)+t(1134,466,'Invoice',11,c.muted)+pill(1344,448,'DRAFT',`${c.amber}20`,c.amber,104)+t(1134,520,'Documents',11,c.muted)+pill(1344,502,'2 VERIFIED',`${c.green}20`,c.green,104);
  b+=rect(372,590,1104,164,c.card2,16,c.line)+sectionTitle(398,626,'Cross-surface actions','The same order becomes the right interface for each role');
  const roles=[['PARTNER PORTAL','Track, view quote, manage users'],['OPERATOR PANEL','Assign fleet, resolve exceptions'],['DRIVER APP','Accept, stage, upload proof']]; roles.forEach((x,i)=>{const xx=398+i*350;b+=iconBox(xx,656,i===0?'PT':i===1?'OP':'DR',p.accent)+t(xx+56,674,x[0],10,p.accent,750)+t(xx+56,697,x[1],12,c.soft,580)});
  return shell(p,'Order lifecycle','A connected workflow across portal, admin and mobile',1,b);
}

function rawabetFleet() {
  const p=rawabet;activate(p);let b='';
  b+=rect(344,184,780,614,c.card,18,c.line)+sectionTitle(372,222,'Live fleet map','Driver location, route progress and assignment context');
  b+=rect(372,260,724,510,'#091720',14,c.line);
  const roads=[[390,650,1040,330],[410,350,1020,710],[520,270,630,752],[780,270,920,752]]; roads.forEach((r,i)=>b+=line(...r,i===0?'#233D4D':'#1B3140',i===0?16:9));
  b+=line(480,608,838,436,p.accent,6,'10 8')+circle(480,608,15,p.accent)+circle(838,436,15,c.green)+pill(440,634,'TRIPOLI',`${p.accent}22`,p.accent,100)+pill(806,398,'MISRATA',`${c.green}20`,c.green,106);
  [[620,520,'27',p.accent],[770,632,'14',c.blue],[960,546,'08',c.green],[536,382,'31',c.amber]].forEach(x=>{b+=circle(x[0],x[1],18,x[3])+t(x[0],x[1]+5,x[2],10,'#071019',800,'middle')});
  b+=rect(1148,184,356,198,c.card,18,c.line)+sectionTitle(1174,222,'Selected driver','Omar A. · Unit 27')+pill(1174,252,'ON TRIP',`${c.green}20`,c.green,100)+t(1174,306,'Last location',11,c.muted)+t(1476,306,'18 sec ago',12,c.green,650,'end')+t(1174,340,'Tracking source',11,c.muted)+t(1476,340,'Driver app',12,c.soft,650,'end');
  b+=rect(1148,402,356,188,c.card,18,c.line)+sectionTitle(1174,440,'Route progress','Tripoli → Misrata')+bar(1174,490,302,.62,p.accent,'Distance complete','62%')+t(1174,548,'ETA',11,c.muted)+t(1476,548,'16:40',14,c.text,700,'end');
  b+=rect(1148,610,356,188,c.card,18,c.line)+sectionTitle(1174,648,'Tracking health','Background service diagnostics')+circle(1180,686,5,c.green)+t(1196,691,'Native tracking active',12,c.soft,620)+circle(1180,724,5,c.green)+t(1196,729,'Socket connection healthy',12,c.soft,620)+circle(1180,762,5,c.amber)+t(1196,767,'Battery optimization warning',12,c.soft,620);
  return shell(p,'Fleet intelligence','Live tracking with route and device-health context',2,b);
}

function rawabetAccounting() {
  const p=rawabet;activate(p);let b='';
  b+=metric(344,184,270,'Customer invoices','LYD 418K','selected period',p.accent)+metric(632,184,270,'Supplier bills','LYD 276K','selected period',p.accent)+metric(920,184,270,'Collected','72%','sample KPI',p.accent)+metric(1208,184,296,'Open documents','46','invoice + bill',p.accent);
  b+=rect(344,328,712,470,c.card,18,c.line)+sectionTitle(370,364,'Accounting documents','Operational events become traceable financial records');
  b+=t(370,408,'DOCUMENT',10,c.muted,750)+t(536,408,'PARTY',10,c.muted,750)+t(754,408,'AMOUNT',10,c.muted,750)+t(908,408,'STATE',10,c.muted,750);
  [['INV-1184','Atlas Partner','LYD 18,400','Issued',c.blue],['BILL-741','North Route Vendor','LYD 12,900','Approved',c.green],['INV-1183','Orbit Logistics','LYD 9,850','Paid',c.green],['BILL-738','Fleet Services','LYD 6,300','Review',c.amber],['INV-1179','Cedar Trading','LYD 22,100','Overdue',c.red]].forEach((x,i)=>b+=row(420+i*60,x.slice(0,4),[166,218,154,138],358,60,[c.soft,c.soft,c.text,x[4]]));
  b+=rect(1078,328,426,250,c.card,18,c.line)+sectionTitle(1104,364,'Margin signal','Revenue, cost and contribution by route')+bar(1104,416,344,.84,p.accent,'Tripoli → Misrata','24.8%')+bar(1104,470,344,.62,c.blue,'Zawiya → Tripoli','18.1%')+bar(1104,524,344,.44,c.amber,'Khoms → Benghazi','11.6%');
  b+=rect(1078,598,426,200,c.card,18,c.line)+sectionTitle(1104,634,'Reporting studio','Filterable operations-to-finance analysis')+pill(1104,666,'Route','#162635',c.soft,78)+pill(1190,666,'Partner','#162635',c.soft,84)+pill(1282,666,'Vehicle',`${p.accent}20`,p.accent,84)+pill(1374,666,'Period','#162635',c.soft,82)+rect(1104,720,344,42,`${p.accent}22`,10,p.accent)+t(1276,747,'Build report',13,p.accent2,700,'middle');
  return shell(p,'Accounting & reporting','Connect logistics execution to financial outcomes',3,b);
}

function waSessions() {
  const p=whatsapp;activate(p);let b='';
  b+=metric(344,184,270,'Sessions','6','5 ready',p.accent)+metric(632,184,270,'Messages today','12,480','sample load',p.accent)+metric(920,184,270,'Delivery health','99.4%','sample KPI',p.accent)+metric(1208,184,296,'Recovery queue','3','attention needed',p.accent);
  b+=rect(344,328,1160,470,c.card,18,c.line)+sectionTitle(370,364,'Session command center','Operate multiple WhatsApp identities independently');
  const ss=[['Operations TR','+90 ••• ••• 0184','READY','Webhook active',c.green],['Logistics AR','+218 •• ••• 4201','READY','Webhook active',c.green],['Finance Alerts','+90 ••• ••• 7732','STARTING','QR required',c.blue],['Support Line','+218 •• ••• 9940','FAILED','Recovery check',c.red]];
  ss.forEach((x,i)=>{const xx=370+(i%2)*554,yy=408+Math.floor(i/2)*174;b+=rect(xx,yy,526,150,c.card2,15,c.line)+circle(xx+30,yy+34,7,x[4])+t(xx+50,yy+39,x[0],15,c.soft,700)+pill(xx+384,yy+20,x[2],`${x[4]}20`,x[4],114)+t(xx+24,yy+78,x[1],12,c.muted,550,'start',mono)+line(xx+24,yy+94,xx+502,yy+94,c.line)+t(xx+24,yy+122,x[3],11,x[4],620)+pill(xx+388,yy+106,i===2?'SCAN QR':'MANAGE','#162635',c.soft,112)});
  return shell(p,'Session command','Multi-session operation, QR onboarding and recovery health',0,b);
}

function waOutbound() {
  const p=whatsapp;activate(p);let b='';
  b+=rect(344,184,1160,614,c.card,18,c.line)+sectionTitle(372,222,'Outbound reliability monitor','Trace every attempt and recover retained messages safely');
  b+=pill(1244,202,'AUTO REFRESH',`${p.accent}20`,p.accent,136)+pill(1390,202,'CLEAR FILTERS','#162635',c.soft,96);
  b+=rect(372,264,1104,224,c.card2,16,c.line)+sectionTitle(398,300,'Failed outbound queue','Retry state, retained payload and last error');
  b+=t(398,344,'SESSION',10,c.muted,750)+t(548,344,'TARGET',10,c.muted,750)+t(724,344,'STATE',10,c.muted,750)+t(870,344,'RETRIES',10,c.muted,750)+t(1014,344,'LAST ERROR',10,c.muted,750)+t(1360,344,'ACTION',10,c.muted,750);
  b+=row(354,['Finance Alerts','group_•••91','WAITING_READY','2 / 5','Session not ready','Retry'],[150,176,146,144,346,104],384,54,[c.soft,c.muted,c.amber,c.soft,c.red,p.accent]);
  b+=row(408,['Support Line','+218•••42','FAILED','5 / 5','Timeout after send','Retry'],[150,176,146,144,346,104],384,54,[c.soft,c.muted,c.red,c.soft,c.red,p.accent]);
  b+=rect(372,512,1104,242,c.card2,16,c.line)+sectionTitle(398,548,'Send attempts','Audit trail across API request, session and provider response');
  b+=t(398,592,'TIME',10,c.muted,750)+t(502,592,'SESSION',10,c.muted,750)+t(670,592,'TARGET',10,c.muted,750)+t(848,592,'TYPE',10,c.muted,750)+t(1002,592,'RESULT',10,c.muted,750)+t(1172,592,'MESSAGE ID / ERROR',10,c.muted,750);
  [['10:42:18','Operations TR','group_•••14','group','DELIVERED','WA-7F2…'],['10:42:16','Finance Alerts','group_•••91','group','QUEUED','session not ready'],['10:41:58','Logistics AR','+218•••20','direct','DELIVERED','WA-39A…']].forEach((x,i)=>b+=row(604+i*45,x,[104,168,178,154,170,260],384,45,[c.muted,c.soft,c.muted,c.soft,x[4]==='DELIVERED'?c.green:c.amber,c.muted]));
  return shell(p,'Outbound activity','Queue visibility, retry controls and complete send trace',2,b);
}

function waApi() {
  const p=whatsapp;activate(p);let b='';
  b+=metric(344,184,270,'Active API keys','8','2 scoped',p.accent)+metric(632,184,270,'Requests / 24h','34.2K','sample volume',p.accent)+metric(920,184,270,'Denied','42','policy enforced',p.accent)+metric(1208,184,296,'Allowed sessions','6','assignment ready',p.accent);
  b+=rect(344,328,730,470,c.card,18,c.line)+sectionTitle(370,364,'API access registry','Keys, permissions and operational status');
  b+=t(370,408,'CLIENT',10,c.muted,750)+t(570,408,'SCOPE',10,c.muted,750)+t(770,408,'SESSIONS',10,c.muted,750)+t(928,408,'STATUS',10,c.muted,750);
  [['Rawabet Events','send · groups','2 assigned','Active',c.green],['Finance Alerts','send only','1 assigned','Active',c.green],['Partner Portal','groups view','3 assigned','Active',c.green],['Legacy Worker','send · queue','All','Revoked',c.red]].forEach((x,i)=>b+=row(420+i*65,x.slice(0,4),[200,200,158,124],358,65,[c.soft,c.soft,c.muted,x[4]]));
  b+=rect(1098,328,406,470,c.card,18,c.line)+sectionTitle(1124,364,'Key detail','Fine-grained permissions and assignments');
  b+=t(1124,410,'RAWABET EVENTS',11,p.accent,760)+t(1124,440,'Created for event-driven logistics messages',12,c.soft,550)+t(1124,490,'PERMISSIONS',10,c.muted,750)+pill(1124,506,'message.send',`${p.accent}20`,p.accent,128)+pill(1260,506,'groups.view','#162635',c.soft,118)+pill(1124,546,'queue.view','#162635',c.soft,112)+pill(1244,546,'sessions.view','#162635',c.soft,128)+t(1124,606,'ALLOWED SESSIONS',10,c.muted,750)+rect(1124,622,352,50,'#132331',10,c.line)+circle(1144,647,5,c.green)+t(1160,652,'Operations TR',12,c.soft,650)+t(1448,652,'READY',10,c.green,700,'end')+rect(1124,682,352,50,'#132331',10,c.line)+circle(1144,707,5,c.green)+t(1160,712,'Logistics AR',12,c.soft,650)+t(1448,712,'READY',10,c.green,700,'end')+rect(1124,746,168,34,`${p.accent}22`,9,p.accent)+t(1208,769,'Save assignments',11,p.accent2,700,'middle');
  return shell(p,'API management','Scoped machine access with per-session permissions',4,b);
}

function waSecurity() {
  const p=whatsapp;activate(p);let b='';
  b+=rect(344,184,568,614,c.card,18,c.line)+sectionTitle(372,222,'Network allowlists','Separate dashboard and API trust boundaries');
  b+=rect(372,266,512,210,c.card2,16,c.line)+iconBox(396,290,'UI',p.accent)+t(452,312,'Dashboard IPs',15,c.soft,700)+pill(746,294,'3 ALLOWED',`${c.green}20`,c.green,114);
  [['203.0.113.18','Office'],['198.51.100.44','VPN']].forEach((x,i)=>{const y=362+i*50;b+=t(396,y,x[0],12,c.soft,600,'start',mono)+t(652,y,x[1],11,c.muted,550)+pill(780,y-20,'REMOVE','#2B1620',c.red,82)});
  b+=rect(372,496,512,258,c.card2,16,c.line)+iconBox(396,520,'API',c.blue)+t(452,542,'API IPs',15,c.soft,700)+pill(746,524,'4 ALLOWED',`${c.blue}20`,c.blue,114);
  [['192.0.2.24','Rawabet prod'],['192.0.2.31','Worker node'],['198.51.100.61','Monitoring']].forEach((x,i)=>{const y=592+i*46;b+=t(396,y,x[0],12,c.soft,600,'start',mono)+t(548,y,x[1],11,c.muted,550)+circle(842,y-4,5,c.green)});
  b+=rect(936,184,568,288,c.card,18,c.line)+sectionTitle(964,222,'Security layers','Defense in depth across human and machine access');
  [['01','Admin authentication','Session + login attempt controls'],['02','API key middleware','Permission and session scope'],['03','Rate limiting','Abuse protection per route'],['04','Audit records','Every key action is traceable']].forEach((x,i)=>{const y=278+i*46;b+=circle(980,y-4,14,`${p.accent}20`,p.accent)+t(980,y,x[0],9,p.accent,800,'middle')+t(1008,y-7,x[1],12,c.soft,650)+t(1210,y-7,x[2],11,c.muted,520)});
  b+=rect(936,492,568,306,c.card,18,c.line)+sectionTitle(964,530,'Operational audit','Security events are visible and actionable');
  [['10:44','API key used','Rawabet Events',c.green],['10:32','IP allowed','Monitoring',c.green],['09:58','Login blocked','Unknown network',c.red],['09:40','Key scope changed','Finance Alerts',c.amber]].forEach((x,i)=>{const y=582+i*48;b+=t(964,y,x[0],11,c.muted,650,'start',mono)+circle(1034,y-4,5,x[3])+t(1050,y,x[1],12,c.soft,650)+t(1222,y,x[2],11,c.muted,550)});
  return shell(p,'Security control','IP boundaries, access policy and audit visibility',5,b);
}

const files = {
  'payment-01-operations.svg': paymentCommand(), 'payment-02-approval.svg': paymentWorkflow(), 'payment-03-erp.svg': paymentErp(), 'payment-04-insights.svg': paymentInsights(),
  'anlik-01-treasury.svg': balanceOverview(), 'anlik-02-reconciliation.svg': balanceReconcile(), 'anlik-03-integrations.svg': balanceIntegrations(), 'anlik-04-governance.svg': balanceGovernance(),
  'rawabet-01-operations.svg': rawabetOps(), 'rawabet-02-order.svg': rawabetOrder(), 'rawabet-03-fleet.svg': rawabetFleet(), 'rawabet-04-accounting.svg': rawabetAccounting(),
  'whatsapp-01-sessions.svg': waSessions(), 'whatsapp-02-outbound.svg': waOutbound(), 'whatsapp-03-api.svg': waApi(), 'whatsapp-04-security.svg': waSecurity()
};

for (const [name, svg] of Object.entries(files)) fs.writeFileSync(path.join(out, name), svg);
console.log(`Generated ${Object.keys(files).length} SVG demo boards in ${out}`);
