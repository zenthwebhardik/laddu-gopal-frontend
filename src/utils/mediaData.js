// Design reference photos and video links.
// NOTE: these photos came from an image host, not from the workshop's own camera.
// Replace them with photos of jobs you actually did before going live.

const img = (id) => `/assets/work/work-${id}.webp`;

// category: 'gates' | 'grills' (railings, stair rails, window/balcony grills)
export const galleryImages = [
  { id: 1, category: 'gates', title: 'Double main gate, kaale par sunehri jaali' },
  { id: 16, category: 'gates', title: 'Double main gate, laser-cut jaali aur likhawat ke saath' },
  { id: 2, category: 'gates', title: 'Main gate, gol chakra design' },
  { id: 11, category: 'gates', title: 'Main gate, poori jaali design' },
  { id: 4, category: 'gates', title: 'Sliding gate, taare wala cut design' },
  { id: 3, category: 'gates', title: 'Safed gate, geometric cut design' },
  { id: 9, category: 'gates', title: 'Double gate, sunehri patti aur phool design' },
  { id: 6, category: 'gates', title: 'Double gate, khade pipe aur side jaali' },
  { id: 7, category: 'gates', title: 'Single gate, Ganesh ji cut panel' },
  { id: 18, category: 'gates', title: 'Single gate, patti aur taara strip' },
  { id: 19, category: 'gates', title: 'Neela double gate, steel pipe' },
  { id: 20, category: 'gates', title: 'Double gate, bhoora rang, gol design' },
  { id: 21, category: 'gates', title: 'Gate, upar naam ki likhawat' },
  { id: 14, category: 'gates', title: 'Kaala gate, patte ka design' },
  { id: 12, category: 'gates', title: 'Darwaza, neela panel aur phool cut' },
  { id: 15, category: 'grills', title: 'Seedhi ki railing, jaali design' },
  { id: 8, category: 'grills', title: 'Seedhi ki railing, patte ka design' },
  { id: 22, category: 'grills', title: 'Seedhi ki railing, scroll panel' },
  { id: 10, category: 'grills', title: 'Seedhi ki railing, khade cut panel' },
  { id: 17, category: 'grills', title: 'Balcony railing, pankha design' },
].map((item) => ({ ...item, img: img(item.id) }));

// Design-idea videos from other YouTube channels (credited by name).
export const videoGallery = [
  { id: '27xAfVzGr18', title: 'Ghar ke liye 50+ main gate design', channel: 'Classical Decor' },
  { id: 'GKBDzVHq_WM', title: 'Aluminium profile sliding gate — design aur rate', channel: 'SS fibre glass and fabrication works' },
  { id: 'Kz-GRMCHCWk', title: 'Main gate design aur rang ke idea', channel: 'SK iNTERIOR' },
  { id: 'IfHDU7zgO5A', title: 'Balcony grill aur railing ke naye design', channel: 'Decor Catalogue' },
  { id: 'P_V7WOQTLXs', title: 'CNC cutting wali MS railing', channel: 'Construction Zone' },
].map((v) => ({
  ...v,
  embed: `https://www.youtube-nocookie.com/embed/${v.id}`,
  thumbnail: `https://img.youtube.com/vi/${v.id}/hqdefault.jpg`,
}));
