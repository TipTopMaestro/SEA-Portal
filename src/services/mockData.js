// DNSC Student Esports Academy (NexusSEA) Initial Mock Data

export const INITIAL_USERS = [
  {
    id: 'usr_exec_01',
    studentId: '2022-00412',
    name: 'Marcus Reyes',
    ign: 'Vanguard',
    email: 'marcus.reyes@dnsc.edu.ph',
    role: 'executive',
    title: 'Executive President',
    program: 'BS Information Technology',
    yearLevel: '4th Year',
    duesStatus: 'paid',
    joinedDate: '2023-08-15',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    discord: 'Vanguard#0001',
    primaryGame: 'Valorant',
  },
  {
    id: 'usr_gm_01',
    studentId: '2023-01189',
    name: 'Samantha Cruz',
    ign: 'Aegis',
    email: 'samantha.cruz@dnsc.edu.ph',
    role: 'game_manager',
    title: 'Head Game Manager (FPS & MOBA)',
    program: 'BS Information Systems',
    yearLevel: '3rd Year',
    duesStatus: 'paid',
    joinedDate: '2023-09-01',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    discord: 'Aegis_Sam#2401',
    primaryGame: 'Valorant',
  },
  {
    id: 'usr_fin_01',
    studentId: '2023-00821',
    name: 'Gabriel Tan',
    ign: 'Ledger',
    email: 'gabriel.tan@dnsc.edu.ph',
    role: 'finance_officer',
    title: 'Director of Finance & Dues',
    program: 'BS Business Administration',
    yearLevel: '3rd Year',
    duesStatus: 'paid',
    joinedDate: '2023-08-20',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    discord: 'LedgerGabe#7712',
    primaryGame: 'Mobile Legends: Bang Bang',
  },
  {
    id: 'usr_mem_01',
    studentId: '2024-02341',
    name: 'Kristoff Ramos',
    ign: 'Phoenix',
    email: 'kristoff.ramos@dnsc.edu.ph',
    role: 'member',
    title: 'Academy Varsity Candidate',
    program: 'BS Computer Science',
    yearLevel: '2nd Year',
    duesStatus: 'unpaid',
    joinedDate: '2024-09-10',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    discord: 'PhoenixFlame#4591',
    primaryGame: 'Valorant',
  },
  {
    id: 'usr_mem_02',
    studentId: '2024-01992',
    name: 'Chloe Dela Rosa',
    ign: 'Luminary',
    email: 'chloe.delarosa@dnsc.edu.ph',
    role: 'member',
    title: 'General Member',
    program: 'BS Information Technology',
    yearLevel: '1st Year',
    duesStatus: 'paid',
    joinedDate: '2024-10-02',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    discord: 'Luminary#8841',
    primaryGame: 'Mobile Legends: Bang Bang',
  },
  {
    id: 'usr_mem_03',
    studentId: '2023-03014',
    name: 'Joshua "Riptide" Morales',
    ign: 'Riptide',
    email: 'joshua.morales@dnsc.edu.ph',
    role: 'member',
    title: 'General Member',
    program: 'BS Marine Biology',
    yearLevel: '3rd Year',
    duesStatus: 'pending',
    joinedDate: '2024-08-18',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    discord: 'Riptide_JM#1234',
    primaryGame: 'League of Legends',
  }
];

export const INITIAL_GAMES = [
  { id: 'val', name: 'Valorant', genre: 'Tactical FPS', teamSize: 5, bannerColor: 'from-rose-600 to-red-900' },
  { id: 'mlbb', name: 'Mobile Legends: Bang Bang', genre: 'MOBA Mobile', teamSize: 5, bannerColor: 'from-amber-500 to-orange-800' },
  { id: 'lol', name: 'League of Legends: PC', genre: 'MOBA PC', teamSize: 5, bannerColor: 'from-cyan-600 to-blue-900' },
  { id: 'codm', name: 'Call of Duty: Mobile', genre: 'FPS Mobile', teamSize: 5, bannerColor: 'from-emerald-600 to-green-950' },
  { id: 'tekken', name: 'Tekken 8', genre: 'Fighting Game (FGC)', teamSize: 1, bannerColor: 'from-purple-600 to-indigo-950' }
];

export const INITIAL_ACTIVITY_LOGS = [
  {
    id: 'act_01',
    officerName: 'Marcus Reyes',
    officerRole: 'executive',
    action: 'Approved Disbursement',
    details: 'Final executive sign-off for DNSC Collegiate Scrimmage Venue Snacks (PHP 3,450.00)',
    timestamp: '2026-11-13 14:20',
    type: 'finance'
  },
  {
    id: 'act_02',
    officerName: 'Samantha Cruz',
    officerRole: 'game_manager',
    action: 'Shortlisted Applicant',
    details: 'Moved Kristoff Ramos (Phoenix) to Shortlisted for Valorant Roster A',
    timestamp: '2026-11-13 11:45',
    type: 'tryouts'
  },
  {
    id: 'act_03',
    officerName: 'Gabriel Tan',
    officerRole: 'finance_officer',
    action: 'Verified Dues Payment',
    details: 'Verified Semester 1 Membership Dues (PHP 200) for Chloe Dela Rosa via GCash Ref #889210',
    timestamp: '2026-11-13 09:15',
    type: 'membership'
  },
  {
    id: 'act_04',
    officerName: 'Marcus Reyes',
    officerRole: 'executive',
    action: 'Role Promoted',
    details: 'Promoted Samantha Cruz from Assistant Manager to Head Game Manager',
    timestamp: '2026-11-12 16:30',
    type: 'hr'
  },
  {
    id: 'act_05',
    officerName: 'Samantha Cruz',
    officerRole: 'game_manager',
    action: 'Generated Attendance Session',
    details: 'Created QR Code session for Inter-College Scrimmage Week 4 (TTL: 90 mins)',
    timestamp: '2026-11-12 13:00',
    type: 'attendance'
  }
];

export const INITIAL_TRYOUTS = [
  {
    id: 'try_01',
    applicantName: 'Kristoff Ramos',
    ign: 'Phoenix',
    studentId: '2024-02341',
    email: 'kristoff.ramos@dnsc.edu.ph',
    discord: 'PhoenixFlame#4591',
    game: 'Valorant',
    division: 'Division 1 (Varsity)',
    type: 'individual',
    rank: 'Ascendant 2',
    primaryRole: 'Duelist (Jett/Reyna)',
    secondaryRole: 'Initiator (Sova)',
    trackerUrl: 'https://tracker.gg/valorant/profile/riot/Phoenix%23SEA',
    notes: 'Aggressive entry fragger, collegiate tournament experience in high school.',
    status: 'Shortlisted', // Pending, Under Review, Shortlisted, Scheduled, Accepted, Rejected
    appliedDate: '2026-11-10',
    scores: {
      mechanics: 9,
      communication: 8,
      gameSense: 8.5,
      coachability: 9,
      average: 8.6
    },
    evaluatorNotes: 'Remarkable first-bullet accuracy. Communicates clearly during retakes.'
  },
  {
    id: 'try_02',
    applicantName: 'Team Eclipse (Cap: Vince Lopez)',
    ign: 'Eclipse Gaming',
    studentId: '2023-01882',
    email: 'vince.lopez@dnsc.edu.ph',
    discord: 'EclipseCap#9921',
    game: 'Mobile Legends: Bang Bang',
    division: 'Division 1 (Varsity)',
    type: 'team',
    rank: 'Mythical Immortal (112 Stars)',
    primaryRole: 'Full 5-Man Roster',
    secondaryRole: 'Roam / Jungler Synergy',
    trackerUrl: 'https://mlbb.gg/teams/dnsc-eclipse',
    notes: 'Established chemistry for 8 months. Local barangay tournament champions.',
    status: 'Scheduled',
    appliedDate: '2026-11-11',
    scores: {
      mechanics: 8.5,
      communication: 9,
      gameSense: 8.5,
      coachability: 8,
      average: 8.5
    },
    evaluatorNotes: 'Fast objective rotations. Need minor adjustments in draft adaptation.'
  },
  {
    id: 'try_03',
    applicantName: 'Andrea Nicole Beltran',
    ign: 'Starlight',
    studentId: '2024-05519',
    email: 'andrea.beltran@dnsc.edu.ph',
    discord: 'Starlight#1010',
    game: 'League of Legends: PC',
    division: 'Division 2 (Academy)',
    type: 'individual',
    rank: 'Emerald 1',
    primaryRole: 'Mid Laner (Ahri, Syndra)',
    secondaryRole: 'Support (Nami, Lulu)',
    trackerUrl: 'https://u.gg/lol/profile/ph/starlight',
    notes: 'Wants to improve wave management and shotcalling in team environments.',
    status: 'Under Review',
    appliedDate: '2026-11-12',
    scores: null,
    evaluatorNotes: ''
  },
  {
    id: 'try_04',
    applicantName: 'Dexter James Ocampo',
    ign: 'Havoc',
    studentId: '2023-04122',
    email: 'dexter.ocampo@dnsc.edu.ph',
    discord: 'Havoc_CODM#3311',
    game: 'Call of Duty: Mobile',
    division: 'Division 1 (Varsity)',
    type: 'individual',
    rank: 'Legendary (12,400 pts)',
    primaryRole: 'Slayer / SMG (QQ9)',
    secondaryRole: 'Anchor / AR',
    trackerUrl: '',
    notes: 'Fast reaction time, reliable Hardpoint hold.',
    status: 'Accepted',
    appliedDate: '2026-11-05',
    scores: {
      mechanics: 9.5,
      communication: 8.5,
      gameSense: 9,
      coachability: 9,
      average: 9.0
    },
    evaluatorNotes: 'Signed for Season 2026 Roster.'
  },
  {
    id: 'try_05',
    applicantName: 'Raphael Sanchez',
    ign: 'IronFist',
    studentId: '2024-00192',
    email: 'raphael.sanchez@dnsc.edu.ph',
    discord: 'IronFist_Raphy#777',
    game: 'Tekken 8',
    division: 'Division 1 (Varsity)',
    type: 'individual',
    rank: 'Tekken Emperor (Reina/Jin)',
    primaryRole: 'FGC Soloist',
    secondaryRole: 'Mishima Specialist',
    trackerUrl: '',
    notes: 'Top 8 finisher in Southern Mindanao Regional FGC Cup.',
    status: 'Shortlisted',
    appliedDate: '2026-11-08',
    scores: {
      mechanics: 9,
      communication: 7.5,
      gameSense: 9,
      coachability: 8.5,
      average: 8.5
    },
    evaluatorNotes: 'Consistent electrics and punish execution.'
  }
];

export const INITIAL_ATTENDANCE_EVENTS = [
  {
    id: 'evt_01',
    title: 'Inter-College Scrimmage: Tactical FPS',
    type: 'scrimmage', // scrimmage, booth, assembly, tournament
    location: 'DNSC ICT Lab 3 / Discord SEA Server',
    date: '2026-11-13',
    time: '17:00 - 20:00',
    qrToken: 'NEXUS-ATT-SCRIM-20261113-T99',
    expiresAt: '2026-11-13T20:30:00+08:00',
    active: true,
    expectedAttendees: 20,
    createdBy: 'Samantha Cruz'
  },
  {
    id: 'evt_02',
    title: 'DNSC Esports Booth & Recruitment Fair',
    type: 'booth',
    location: 'Gymnasium Lobby Ground Floor',
    date: '2026-11-12',
    time: '09:00 - 16:00',
    qrToken: 'NEXUS-ATT-BOOTH-20261112-B01',
    expiresAt: '2026-11-12T16:00:00+08:00',
    active: false,
    expectedAttendees: 60,
    createdBy: 'Marcus Reyes'
  },
  {
    id: 'evt_03',
    title: 'General Academy Assembly & Orientation Q4',
    type: 'assembly',
    location: 'Audio-Visual Center (AVC)',
    date: '2026-11-08',
    time: '13:00 - 15:30',
    qrToken: 'NEXUS-ATT-ASSM-20261108-A42',
    expiresAt: '2026-11-08T16:00:00+08:00',
    active: false,
    expectedAttendees: 85,
    createdBy: 'Marcus Reyes'
  }
];

export const INITIAL_ATTENDANCE_RECORDS = [
  {
    id: 'rec_01',
    eventId: 'evt_01',
    eventTitle: 'Inter-College Scrimmage: Tactical FPS',
    studentId: '2024-02341',
    studentName: 'Kristoff Ramos',
    ign: 'Phoenix',
    scanTimestamp: '2026-11-13 17:05:12',
    status: 'Verified Present',
    scanMethod: 'Mobile Camera QR Scan'
  },
  {
    id: 'rec_02',
    eventId: 'evt_01',
    eventTitle: 'Inter-College Scrimmage: Tactical FPS',
    studentId: '2023-01189',
    studentName: 'Samantha Cruz',
    ign: 'Aegis',
    scanTimestamp: '2026-11-13 16:58:30',
    status: 'Verified Present',
    scanMethod: 'Mobile Camera QR Scan'
  },
  {
    id: 'rec_03',
    eventId: 'evt_02',
    eventTitle: 'DNSC Esports Booth & Recruitment Fair',
    studentId: '2024-01992',
    studentName: 'Chloe Dela Rosa',
    ign: 'Luminary',
    scanTimestamp: '2026-11-12 10:14:40',
    status: 'Verified Present',
    scanMethod: 'Mobile Camera QR Scan'
  },
  {
    id: 'rec_04',
    eventId: 'evt_03',
    eventTitle: 'General Academy Assembly & Orientation Q4',
    studentId: '2024-02341',
    studentName: 'Kristoff Ramos',
    ign: 'Phoenix',
    scanTimestamp: '2026-11-08 13:02:10',
    status: 'Verified Present',
    scanMethod: 'Mobile Camera QR Scan'
  },
  {
    id: 'rec_05',
    eventId: 'evt_03',
    eventTitle: 'General Academy Assembly & Orientation Q4',
    studentId: '2023-03014',
    studentName: 'Joshua Morales',
    ign: 'Riptide',
    scanTimestamp: '2026-11-08 13:12:44',
    status: 'Verified Present',
    scanMethod: 'Manual Entry by Officer'
  }
];

export const INITIAL_FINANCE_INFLOWS = [
  {
    id: 'inf_01',
    category: 'Membership Dues',
    source: '1st Semester 2026 Academy Dues (Batch 1)',
    amount: 14200.00,
    recordedBy: 'Gabriel Tan',
    date: '2026-11-05',
    paymentMethod: 'GCash & Cash on Hand',
    referenceNo: 'GC-BATCH-001',
    notes: '71 members paid ₱200 standard semester fee.'
  },
  {
    id: 'inf_02',
    category: 'Merchandise',
    source: 'Official Academy Esports Jersey Pre-orders (40 units)',
    amount: 28000.00,
    recordedBy: 'Gabriel Tan',
    date: '2026-11-09',
    paymentMethod: 'Bank Transfer / GCash',
    referenceNo: 'MERCH-JR-2026',
    notes: '₱700 per piece custom sublimation DNSC Academy jersey.'
  },
  {
    id: 'inf_03',
    category: 'Tournament Prize Share',
    source: 'Southern Mindanao Collegiate League - 2nd Place Valorant',
    amount: 15000.00,
    recordedBy: 'Marcus Reyes',
    date: '2026-10-28',
    paymentMethod: 'Direct Deposit',
    referenceNo: 'SMCL-VAL-PZ',
    notes: 'Academy organization operational share (20% of ₱75,000 total prize).'
  },
  {
    id: 'inf_04',
    category: 'Sponsorship / Donations',
    source: 'Local Cybercafe Gaming Lounge Sponsor',
    amount: 8000.00,
    recordedBy: 'Gabriel Tan',
    date: '2026-10-15',
    paymentMethod: 'Cheque Deposit',
    referenceNo: 'CHQ-SPON-912',
    notes: 'Free practice hours + financial subsidy for regional qualifiers.'
  }
];

export const INITIAL_DISBURSEMENTS = [
  {
    id: 'disb_01',
    title: 'Ethernet Cables & Gigabit Network Switches for Scrimmage Lab',
    category: 'Equipment & Hardware',
    amount: 4850.00,
    requestedBy: 'Samantha Cruz',
    requestDate: '2026-11-07',
    description: 'Replacing damaged Cat6 cables and adding 8-port gigabit switch for 10-player LAN scrimmages.',
    receiptUrl: 'https://images.unsplash.com/photo-1554415707-9e4966779d71?w=400&auto=format&fit=crop&q=80',
    receiptName: 'Official_Receipt_Switch_Hub.pdf',
    // Stages: submitted -> finance_approved -> executive_signed -> disbursed (or rejected)
    status: 'disbursed',
    financeApprover: 'Gabriel Tan',
    financeApprovedDate: '2026-11-08 10:15',
    executiveApprover: 'Marcus Reyes',
    executiveSignedDate: '2026-11-09 14:00',
    disbursedDate: '2026-11-09 16:30',
    rejectionReason: null
  },
  {
    id: 'disb_02',
    title: 'DNSC Esports Booth Banners & Marketing Tarpaulins',
    category: 'Marketing & Events',
    amount: 2200.00,
    requestedBy: 'Gabriel Tan',
    requestDate: '2026-11-10',
    description: 'Two 6x3 roll-up standees and membership recruitment flyers.',
    receiptUrl: 'https://images.unsplash.com/photo-1586769852044-692d6e3703f0?w=400&auto=format&fit=crop&q=80',
    receiptName: 'PrintHub_Receipt_0991.pdf',
    status: 'executive_signed',
    financeApprover: 'Gabriel Tan',
    financeApprovedDate: '2026-11-11 09:30',
    executiveApprover: 'Marcus Reyes',
    executiveSignedDate: '2026-11-12 11:00',
    disbursedDate: null,
    rejectionReason: null
  },
  {
    id: 'disb_03',
    title: 'Regional Qualifier Van Rental & Highway Toll Subsidies',
    category: 'Travel & Logistics',
    amount: 6500.00,
    requestedBy: 'Samantha Cruz',
    requestDate: '2026-11-12',
    description: 'Round-trip van transportation for 10 varsity players to Davao City LAN Arena.',
    receiptUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&auto=format&fit=crop&q=80',
    receiptName: 'Van_Charter_Quotation.jpg',
    status: 'finance_approved',
    financeApprover: 'Gabriel Tan',
    financeApprovedDate: '2026-11-13 08:45',
    executiveApprover: null,
    executiveSignedDate: null,
    disbursedDate: null,
    rejectionReason: null
  },
  {
    id: 'disb_04',
    title: 'High-end Mechanical Keyboard & Mouse Sets for Academy Pod',
    category: 'Equipment & Hardware',
    amount: 18200.00,
    requestedBy: 'Samantha Cruz',
    requestDate: '2026-11-13',
    description: 'Requesting 5 mechanical gaming keyboards for lab tournament setups.',
    receiptUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80',
    receiptName: 'PC_Depot_Quotation.pdf',
    status: 'submitted',
    financeApprover: null,
    financeApprovedDate: null,
    executiveApprover: null,
    executiveSignedDate: null,
    disbursedDate: null,
    rejectionReason: null
  }
];
