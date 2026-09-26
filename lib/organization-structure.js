export const ORGANIZATION_GROUPS = {
  advisory: [
    { key: 'ketua-dewan-pembina', role: 'Ketua Dewan Pembina' },
    { key: 'anggota-dewan-pembina-1', role: 'Anggota Dewan Pembina' },
    { key: 'anggota-dewan-pembina-2', role: 'Anggota Dewan Pembina' }
  ],
  experts: [
    { key: 'ketua-majelis-pakar', role: 'Ketua Majelis Pakar' },
    { key: 'anggota-majelis-pakar-1', role: 'Anggota Majelis Pakar' },
    { key: 'anggota-majelis-pakar-2', role: 'Anggota Majelis Pakar' },
    { key: 'anggota-majelis-pakar-3', role: 'Anggota Majelis Pakar' }
  ],
  leadership: [
    { key: 'ketua-umum', role: 'Ketua Umum', badge: 'Ketua' },
    { key: 'wakil-ketua-umum-1', role: 'Wakil Ketua Umum I', badge: 'Wakil' },
    { key: 'wakil-ketua-umum-2', role: 'Wakil Ketua Umum II', badge: 'Wakil' },
    { key: 'sekretaris-jenderal', role: 'Sekretaris Jenderal', badge: 'Sekjen' },
    { key: 'wakil-sekretaris-jenderal', role: 'Wakil Sekretaris Jenderal', badge: 'Wakil Sekjen' },
    { key: 'bendahara-umum', role: 'Bendahara Umum', badge: 'Bendahara' },
    { key: 'wakil-bendahara-umum', role: 'Wakil Bendahara Umum', badge: 'Wakil Bendahara' }
  ],
  divisions: [
    { key: 'bidang-transportasi-jalan', role: 'Transportasi Jalan' },
    { key: 'bidang-transportasi-kereta-api', role: 'Transportasi Kereta Api' },
    { key: 'bidang-transportasi-laut', role: 'Transportasi Laut' },
    { key: 'bidang-transportasi-udara', role: 'Transportasi Udara' },
    { key: 'bidang-transportasi-perkotaan-tod', role: 'Transportasi Perkotaan & TOD' },
    { key: 'bidang-keselamatan-transportasi', role: 'Keselamatan Transportasi' },
    { key: 'bidang-logistik-supply-chain', role: 'Logistik & Supply Chain' },
    { key: 'bidang-kebijakan-regulasi', role: 'Kebijakan & Regulasi' },
    { key: 'bidang-transportasi-perdesaan-3t', role: 'Transportasi Perdesaan & 3T' },
    { key: 'bidang-riset-inovasi-teknologi', role: 'Riset, Inovasi & Teknologi' }
  ]
};

export const ORGANIZATION_KEYS = Object.values(ORGANIZATION_GROUPS)
  .flat()
  .map((position) => position.key);

export function resolveOrganizationGroup(group, names = {}) {
  return group.map((position) => ({
    ...position,
    name: typeof names[position.key] === 'string' && names[position.key].trim()
      ? names[position.key].trim()
      : '—'
  }));
}
