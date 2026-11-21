import {
  INITIAL_USERS,
  INITIAL_GAMES,
  INITIAL_ACTIVITY_LOGS,
  INITIAL_TRYOUTS,
  INITIAL_ATTENDANCE_EVENTS,
  INITIAL_ATTENDANCE_RECORDS,
  INITIAL_FINANCE_INFLOWS,
  INITIAL_DISBURSEMENTS
} from './mockData';

// Storage keys
const STORAGE_KEYS = {
  USERS: 'nexus_sea_users',
  ACTIVITY_LOGS: 'nexus_sea_activity_logs',
  TRYOUTS: 'nexus_sea_tryouts',
  ATTENDANCE_EVENTS: 'nexus_sea_attendance_events',
  ATTENDANCE_RECORDS: 'nexus_sea_attendance_records',
  FINANCE_INFLOWS: 'nexus_sea_finance_inflows',
  DISBURSEMENTS: 'nexus_sea_disbursements',
  CURRENT_USER: 'nexus_sea_current_user',
  TOKEN: 'nexus_sea_token'
};

// Initialize localStorage with mock data if not yet present
export const initializeStorage = () => {
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.ACTIVITY_LOGS)) {
    localStorage.setItem(STORAGE_KEYS.ACTIVITY_LOGS, JSON.stringify(INITIAL_ACTIVITY_LOGS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.TRYOUTS)) {
    localStorage.setItem(STORAGE_KEYS.TRYOUTS, JSON.stringify(INITIAL_TRYOUTS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.ATTENDANCE_EVENTS)) {
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE_EVENTS, JSON.stringify(INITIAL_ATTENDANCE_EVENTS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.ATTENDANCE_RECORDS)) {
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE_RECORDS, JSON.stringify(INITIAL_ATTENDANCE_RECORDS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.FINANCE_INFLOWS)) {
    localStorage.setItem(STORAGE_KEYS.FINANCE_INFLOWS, JSON.stringify(INITIAL_FINANCE_INFLOWS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.DISBURSEMENTS)) {
    localStorage.setItem(STORAGE_KEYS.DISBURSEMENTS, JSON.stringify(INITIAL_DISBURSEMENTS));
  }
};

// Generic read/write helpers
const getStored = (key, fallback) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.error('Error reading localStorage for key', key, e);
    return fallback;
  }
};

const setStored = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error('Error writing localStorage for key', key, e);
  }
};

// Service API
export const portalService = {
  // Initialize
  init: initializeStorage,

  // --- AUTH & USERS ---
  getUsers: () => getStored(STORAGE_KEYS.USERS, INITIAL_USERS),
  
  getUserById: (id) => {
    const users = portalService.getUsers();
    return users.find((u) => u.id === id);
  },

  getCurrentUser: () => {
    const saved = getStored(STORAGE_KEYS.CURRENT_USER, null);
    if (saved) return saved;
    // Default to Executive for demo exploration
    const defaultUser = INITIAL_USERS[0];
    portalService.setCurrentUser(defaultUser);
    return defaultUser;
  },

  setCurrentUser: (user) => {
    setStored(STORAGE_KEYS.CURRENT_USER, user);
    if (user) {
      localStorage.setItem(STORAGE_KEYS.TOKEN, `mock_jwt_token_${user.id}`);
    } else {
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
    }
  },

  registerUser: (userData) => {
    const users = portalService.getUsers();
    const newUser = {
      id: `usr_mem_${Date.now()}`,
      studentId: userData.studentId,
      name: userData.name,
      ign: userData.ign,
      email: userData.email,
      role: 'member', // All self-registrations start as member
      title: 'Academy Member',
      program: userData.program || 'BS Information Technology',
      yearLevel: userData.yearLevel || '1st Year',
      duesStatus: 'unpaid',
      joinedDate: new Date().toISOString().split('T')[0],
      avatar: userData.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${userData.ign}`,
      discord: userData.discord || `${userData.ign}#0000`,
      primaryGame: userData.primaryGame || 'Valorant'
    };
    const updated = [newUser, ...users];
    setStored(STORAGE_KEYS.USERS, updated);
    portalService.addActivityLog(
      'System',
      'executive',
      'New Student Registration',
      `${newUser.name} (${newUser.ign}) registered as student member.`,
      'membership'
    );
    return newUser;
  },

  updateUserRole: (userId, newRole, newTitle, officerUser) => {
    const users = portalService.getUsers();
    const targetUser = users.find(u => u.id === userId);
    if (!targetUser) throw new Error('User not found');

    const oldRole = targetUser.role;
    targetUser.role = newRole;
    if (newTitle) targetUser.title = newTitle;

    setStored(STORAGE_KEYS.USERS, users);

    // If current logged in user was modified, update session
    const current = portalService.getCurrentUser();
    if (current && current.id === userId) {
      portalService.setCurrentUser(targetUser);
    }

    // Add activity log
    portalService.addActivityLog(
      officerUser?.name || 'Executive Officer',
      officerUser?.role || 'executive',
      'Role Assignment Changed',
      `Modified role for ${targetUser.name} (${targetUser.ign}) from ${oldRole.toUpperCase()} to ${newRole.toUpperCase()}. Title: ${newTitle || targetUser.title}`,
      'hr'
    );

    return targetUser;
  },

  updateUserDuesStatus: (userId, duesStatus, officerUser) => {
    const users = portalService.getUsers();
    const targetUser = users.find(u => u.id === userId);
    if (!targetUser) throw new Error('User not found');

    targetUser.duesStatus = duesStatus;
    setStored(STORAGE_KEYS.USERS, users);

    // Update current if same
    const current = portalService.getCurrentUser();
    if (current && current.id === userId) {
      portalService.setCurrentUser(targetUser);
    }

    portalService.addActivityLog(
      officerUser?.name || 'Finance Officer',
      officerUser?.role || 'finance_officer',
      'Membership Dues Updated',
      `Updated membership dues for ${targetUser.name} (${targetUser.studentId}) to status: ${duesStatus.toUpperCase()}`,
      'membership'
    );

    return targetUser;
  },

  // --- HR & ACTIVITY LOGS ---
  getActivityLogs: () => getStored(STORAGE_KEYS.ACTIVITY_LOGS, INITIAL_ACTIVITY_LOGS),
  
  addActivityLog: (officerName, officerRole, action, details, type = 'general') => {
    const logs = portalService.getActivityLogs();
    const now = new Date();
    const timestamp = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
    
    const newEntry = {
      id: `act_${Date.now()}`,
      officerName,
      officerRole,
      action,
      details,
      timestamp,
      type
    };
    const updated = [newEntry, ...logs];
    setStored(STORAGE_KEYS.ACTIVITY_LOGS, updated);
    return newEntry;
  },

  // --- TRYOUTS ---
  getTryouts: () => getStored(STORAGE_KEYS.TRYOUTS, INITIAL_TRYOUTS),

  createTryoutApplication: (data, currentUser) => {
    const tryouts = portalService.getTryouts();
    const newTryout = {
      id: `try_${Date.now()}`,
      applicantName: data.applicantName || currentUser.name,
      ign: data.ign || currentUser.ign,
      studentId: data.studentId || currentUser.studentId,
      email: data.email || currentUser.email,
      discord: data.discord || currentUser.discord || 'N/A',
      game: data.game,
      division: data.division || 'Division 1 (Varsity)',
      type: data.type || 'individual',
      rank: data.rank,
      primaryRole: data.primaryRole,
      secondaryRole: data.secondaryRole || 'Flexible',
      trackerUrl: data.trackerUrl || '',
      notes: data.notes || '',
      status: 'Pending',
      appliedDate: new Date().toISOString().split('T')[0],
      scores: null,
      evaluatorNotes: ''
    };
    const updated = [newTryout, ...tryouts];
    setStored(STORAGE_KEYS.TRYOUTS, updated);

    portalService.addActivityLog(
      currentUser.name,
      currentUser.role,
      'Tryout Application Submitted',
      `${newTryout.applicantName} (${newTryout.ign}) submitted tryout for ${newTryout.game} (${newTryout.type}).`,
      'tryouts'
    );

    return newTryout;
  },

  updateTryoutStatus: (tryoutId, newStatus, evaluatorOfficer) => {
    const tryouts = portalService.getTryouts();
    const target = tryouts.find(t => t.id === tryoutId);
    if (!target) throw new Error('Tryout application not found');

    target.status = newStatus;
    setStored(STORAGE_KEYS.TRYOUTS, tryouts);

    portalService.addActivityLog(
      evaluatorOfficer?.name || 'Game Manager',
      evaluatorOfficer?.role || 'game_manager',
      'Tryout Status Updated',
      `Changed tryout status of ${target.applicantName} (${target.game}) to "${newStatus}".`,
      'tryouts'
    );

    return target;
  },

  evaluateTryout: (tryoutId, scores, evaluatorNotes, evaluatorOfficer) => {
    const tryouts = portalService.getTryouts();
    const target = tryouts.find(t => t.id === tryoutId);
    if (!target) throw new Error('Tryout application not found');

    const avg = Number(
      ((scores.mechanics + scores.communication + scores.gameSense + scores.coachability) / 4).toFixed(1)
    );

    target.scores = {
      mechanics: scores.mechanics,
      communication: scores.communication,
      gameSense: scores.gameSense,
      coachability: scores.coachability,
      average: avg
    };
    target.evaluatorNotes = evaluatorNotes;
    
    // Automatically advance to Under Review or Shortlisted if not set
    if (target.status === 'Pending') {
      target.status = avg >= 8.0 ? 'Shortlisted' : 'Under Review';
    }

    setStored(STORAGE_KEYS.TRYOUTS, tryouts);

    portalService.addActivityLog(
      evaluatorOfficer?.name || 'Game Manager',
      evaluatorOfficer?.role || 'game_manager',
      'Scored Tryout Evaluation',
      `Graded ${target.applicantName} for ${target.game} with Avg Score: ${avg}/10. Status: ${target.status}`,
      'tryouts'
    );

    return target;
  },

  // --- ATTENDANCE & QR CODES ---
  getAttendanceEvents: () => getStored(STORAGE_KEYS.ATTENDANCE_EVENTS, INITIAL_ATTENDANCE_EVENTS),
  getAttendanceRecords: () => getStored(STORAGE_KEYS.ATTENDANCE_RECORDS, INITIAL_ATTENDANCE_RECORDS),

  createAttendanceEvent: (eventData, officer) => {
    const events = portalService.getAttendanceEvents();
    const token = `NEXUS-ATT-${eventData.type.toUpperCase()}-${Date.now().toString().slice(-6)}`;
    const newEvent = {
      id: `evt_${Date.now()}`,
      title: eventData.title,
      type: eventData.type,
      location: eventData.location,
      date: eventData.date || new Date().toISOString().split('T')[0],
      time: eventData.time || '14:00 - 17:00',
      qrToken: token,
      expiresAt: eventData.expiresAt || new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
      active: true,
      expectedAttendees: Number(eventData.expectedAttendees) || 30,
      createdBy: officer.name
    };
    const updated = [newEvent, ...events];
    setStored(STORAGE_KEYS.ATTENDANCE_EVENTS, updated);

    portalService.addActivityLog(
      officer.name,
      officer.role,
      'Generated QR Attendance Event',
      `Launched QR Attendance session for "${newEvent.title}" (${newEvent.type}). Code: ${newEvent.qrToken}`,
      'attendance'
    );

    return newEvent;
  },

  recordAttendanceScan: (qrToken, currentUser) => {
    const events = portalService.getAttendanceEvents();
    const matchedEvent = events.find(e => e.qrToken === qrToken);

    if (!matchedEvent) {
      throw new Error('Invalid QR code token. Event not recognized.');
    }

    // Check expiration
    if (new Date(matchedEvent.expiresAt) < new Date() && !matchedEvent.active) {
      throw new Error('This QR attendance code has expired.');
    }

    const records = portalService.getAttendanceRecords();
    // Check if already scanned
    const alreadyScanned = records.find(
      r => r.eventId === matchedEvent.id && r.studentId === currentUser.studentId
    );

    if (alreadyScanned) {
      throw new Error(`You have already checked into "${matchedEvent.title}" at ${alreadyScanned.scanTimestamp}!`);
    }

    const now = new Date();
    const timestamp = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}:${String(now.getSeconds()).padStart(2,'0')}`;

    const newRecord = {
      id: `rec_${Date.now()}`,
      eventId: matchedEvent.id,
      eventTitle: matchedEvent.title,
      studentId: currentUser.studentId,
      studentName: currentUser.name,
      ign: currentUser.ign,
      scanTimestamp: timestamp,
      status: 'Verified Present',
      scanMethod: 'Mobile Camera QR Scan'
    };

    const updated = [newRecord, ...records];
    setStored(STORAGE_KEYS.ATTENDANCE_RECORDS, updated);

    return {
      record: newRecord,
      event: matchedEvent
    };
  },

  // --- FINANCE & DISBURSEMENTS ---
  getFinanceInflows: () => getStored(STORAGE_KEYS.FINANCE_INFLOWS, INITIAL_FINANCE_INFLOWS),
  getDisbursements: () => getStored(STORAGE_KEYS.DISBURSEMENTS, INITIAL_DISBURSEMENTS),

  addInflow: (inflowData, officer) => {
    const inflows = portalService.getFinanceInflows();
    const newInflow = {
      id: `inf_${Date.now()}`,
      category: inflowData.category,
      source: inflowData.source,
      amount: Number(inflowData.amount),
      recordedBy: officer.name,
      date: inflowData.date || new Date().toISOString().split('T')[0],
      paymentMethod: inflowData.paymentMethod || 'GCash',
      referenceNo: inflowData.referenceNo || `REF-${Date.now().toString().slice(-6)}`,
      notes: inflowData.notes || ''
    };
    const updated = [newInflow, ...inflows];
    setStored(STORAGE_KEYS.FINANCE_INFLOWS, updated);

    portalService.addActivityLog(
      officer.name,
      officer.role,
      'Recorded Cash Inflow',
      `Recorded PHP ${newInflow.amount.toLocaleString()} from "${newInflow.source}" (${newInflow.category}). Ref: ${newInflow.referenceNo}`,
      'finance'
    );

    return newInflow;
  },

  createDisbursementRequest: (requestData, requester) => {
    const disbursements = portalService.getDisbursements();
    const newDisbursement = {
      id: `disb_${Date.now()}`,
      title: requestData.title,
      category: requestData.category,
      amount: Number(requestData.amount),
      requestedBy: requester.name,
      requestDate: new Date().toISOString().split('T')[0],
      description: requestData.description,
      receiptUrl: requestData.receiptUrl || 'https://images.unsplash.com/photo-1554415707-9e4966779d71?w=400&auto=format&fit=crop&q=80',
      receiptName: requestData.receiptName || 'Official_Receipt.pdf',
      status: 'submitted', // submitted -> finance_approved -> executive_signed -> disbursed (or rejected)
      financeApprover: null,
      financeApprovedDate: null,
      executiveApprover: null,
      executiveSignedDate: null,
      disbursedDate: null,
      rejectionReason: null
    };

    const updated = [newDisbursement, ...disbursements];
    setStored(STORAGE_KEYS.DISBURSEMENTS, updated);

    portalService.addActivityLog(
      requester.name,
      requester.role,
      'Submitted Disbursement Request',
      `Created disbursement voucher for "${newDisbursement.title}" for PHP ${newDisbursement.amount.toLocaleString()}`,
      'finance'
    );

    return newDisbursement;
  },

  financeApproveDisbursement: (id, officer) => {
    const disbursements = portalService.getDisbursements();
    const target = disbursements.find(d => d.id === id);
    if (!target) throw new Error('Disbursement request not found');

    const now = new Date();
    const timestamp = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;

    target.status = 'finance_approved';
    target.financeApprover = officer.name;
    target.financeApprovedDate = timestamp;

    setStored(STORAGE_KEYS.DISBURSEMENTS, disbursements);

    portalService.addActivityLog(
      officer.name,
      officer.role,
      'Finance Verified Disbursement',
      `Finance verified disbursement "${target.title}" (PHP ${target.amount.toLocaleString()}). Forwarded for Executive sign-off.`,
      'finance'
    );

    return target;
  },

  executiveSignDisbursement: (id, officer) => {
    const disbursements = portalService.getDisbursements();
    const target = disbursements.find(d => d.id === id);
    if (!target) throw new Error('Disbursement request not found');

    const now = new Date();
    const timestamp = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;

    target.status = 'executive_signed';
    target.executiveApprover = officer.name;
    target.executiveSignedDate = timestamp;

    setStored(STORAGE_KEYS.DISBURSEMENTS, disbursements);

    portalService.addActivityLog(
      officer.name,
      officer.role,
      'Executive Approved Disbursement',
      `Executive signed voucher "${target.title}" (PHP ${target.amount.toLocaleString()}). Ready for fund disbursement.`,
      'finance'
    );

    return target;
  },

  markDisbursed: (id, officer) => {
    const disbursements = portalService.getDisbursements();
    const target = disbursements.find(d => d.id === id);
    if (!target) throw new Error('Disbursement request not found');

    const now = new Date();
    const timestamp = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;

    target.status = 'disbursed';
    target.disbursedDate = timestamp;

    setStored(STORAGE_KEYS.DISBURSEMENTS, disbursements);

    portalService.addActivityLog(
      officer.name,
      officer.role,
      'Disbursed Funds',
      `Funds released for "${target.title}" (PHP ${target.amount.toLocaleString()}) via treasury.`,
      'finance'
    );

    return target;
  },

  rejectDisbursement: (id, reason, officer) => {
    const disbursements = portalService.getDisbursements();
    const target = disbursements.find(d => d.id === id);
    if (!target) throw new Error('Disbursement request not found');

    target.status = 'rejected';
    target.rejectionReason = reason || 'Documentation incomplete or budget ceiling exceeded.';

    setStored(STORAGE_KEYS.DISBURSEMENTS, disbursements);

    portalService.addActivityLog(
      officer.name,
      officer.role,
      'Rejected Disbursement',
      `Disbursement "${target.title}" rejected by ${officer.name}. Reason: ${target.rejectionReason}`,
      'finance'
    );

    return target;
  },

  // --- EXPORT HELPERS (CSV) ---
  exportToCSV: (filename, rows) => {
    if (!rows || !rows.length) return;
    const separator = ',';
    const keys = Object.keys(rows[0]);
    const csvContent =
      keys.join(separator) +
      '\n' +
      rows
        .map((row) =>
          keys
            .map((k) => {
              let cell = row[k] === null || row[k] === undefined ? '' : row[k];
              cell = typeof cell === 'object' ? JSON.stringify(cell) : String(cell);
              cell = cell.replace(/"/g, '""');
              if (cell.search(/("|,|\n)/g) >= 0) cell = `"${cell}"`;
              return cell;
            })
            .join(separator)
        )
        .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

// Initialize right away
portalService.init();
