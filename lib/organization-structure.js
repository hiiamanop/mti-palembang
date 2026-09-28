export const ORGANIZATION_GROUPS = {
  direction: [
    { key: 'pembina', role: 'Pembina' },
    { key: 'penasehat', role: 'Penasehat' }
  ],
  daily: [
    { key: 'ketua', role: 'Ketua' },
    { key: 'sekretaris', role: 'Sekretaris' },
    { key: 'wakil-sekretaris', role: 'Wakil Sekretaris' },
    { key: 'bendahara', role: 'Bendahara' },
    { key: 'wakil-bendahara', role: 'Wakil Bendahara' }
  ],
  organization: [
    {
      key: 'bidang-pengembangan-wilayah-keanggotaan',
      role: 'Pengembangan Wilayah dan Keanggotaan'
    },
    {
      key: 'bidang-kerja-sama-kemitraan',
      role: 'Kerja Sama / Kemitraan Antar Lembaga'
    },
    {
      key: 'bidang-komunikasi-publik-humas',
      role: 'Komunikasi Publik & Humas'
    },
    { key: 'bidang-pendidikan-profesi', role: 'Pendidikan Profesi' },
    { key: 'bidang-pengembangan-insan-muda', role: 'Pengembangan Insan Muda' }
  ],
  special: [
    {
      key: 'bidang-khusus-transportasi-perkeretaapian',
      role: 'Transportasi Perkeretaapian'
    },
    { key: 'bidang-khusus-jalan-raya', role: 'Jalan Raya' },
    { key: 'bidang-khusus-udara', role: 'Udara' },
    { key: 'bidang-khusus-laut-sdp', role: 'Laut dan SDP' }
  ],
  secretariat: [
    { key: 'sekretariat', role: 'Sekretariat' }
  ]
};

export const ORGANIZATION_KEYS = Object.values(ORGANIZATION_GROUPS)
  .flat()
  .map((position) => position.key);

export function resolveOrganizationGroup(group, names = {}) {
  return group.map((position) => ({
    ...position,
    name:
      typeof names[position.key] === 'string' && names[position.key].trim()
        ? names[position.key].trim()
        : '—'
  }));
}
