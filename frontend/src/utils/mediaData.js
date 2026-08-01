/**
 * Central Media Data Store
 * Contains updated video links, topic images (TIG & Storage Tank),
 * and 23 IM.GE gallery images for GATE, Steel Design & Civil Engineering.
 */

// 1. Video Links (6 Mandatory links)
export const videoGallery = [
  {
    id: 1,
    title: 'GATE & Civil Engineering Steel Design Analysis',
    category: 'GATE & Steel Design',
    url: 'https://youtu.be/27xAfVzGr18?si=nCJqQPSZ8X5POOdC',
    embed: 'https://www.youtube.com/embed/27xAfVzGr18',
    thumbnail: 'https://img.youtube.com/vi/27xAfVzGr18/hqdefault.jpg'
  },
  {
    id: 2,
    title: 'Structural Steelwork & Heavy Welding Techniques',
    category: 'Steel Design',
    url: 'https://youtu.be/GKBDzVHq_WM?si=4pCSlvtUK1I_C7n9',
    embed: 'https://www.youtube.com/embed/GKBDzVHq_WM',
    thumbnail: 'https://img.youtube.com/vi/GKBDzVHq_WM/hqdefault.jpg'
  },
  {
    id: 3,
    title: 'Precision TIG Welding & High-Spec Joint Fabrication',
    category: 'TIG Welding',
    url: 'https://youtu.be/Kz-GRMCHCWk?si=lgpu026Y2QQ6osJz',
    embed: 'https://www.youtube.com/embed/Kz-GRMCHCWk',
    thumbnail: 'https://th.bing.com/th/id/OIP.72hdeKYKZSEEt6VUQjknWwHaEK?w=310&h=180&c=7&r=0&o=7&dpr=1.4&pid=1.7&rm=3'
  },
  {
    id: 4,
    title: 'Advanced Civil Engineering Welding & Structural Joints',
    category: 'Civil Engineering',
    url: 'https://youtu.be/IfHDU7zgO5A?si=whjV1JZ3LDNKmstD',
    embed: 'https://www.youtube.com/embed/IfHDU7zgO5A',
    thumbnail: 'https://img.youtube.com/vi/IfHDU7zgO5A/hqdefault.jpg'
  },
  {
    id: 5,
    title: 'On-Site Industrial Welding & Custom Steel Fabrication',
    category: 'On-Site Fabrication',
    url: 'https://youtu.be/P_V7WOQTLXs?si=amU_DkQkiwzGS_s6',
    embed: 'https://www.youtube.com/embed/P_V7WOQTLXs',
    thumbnail: 'https://img.youtube.com/vi/P_V7WOQTLXs/hqdefault.jpg'
  }
];

// 2. Specific Topic Images
export const topicImages = {
  tigWelding: {
    title: 'Precision TIG Welding',
    img: 'https://th.bing.com/th/id/OIP.72hdeKYKZSEEt6VUQjknWwHaEK?w=310&h=180&c=7&r=0&o=7&dpr=1.4&pid=1.7&rm=3',
    description: 'High precision Tungsten Inert Gas welding for exotic alloys and flawless aesthetic joints.'
  },
  storageTank: {
    title: 'Storage Tank Fabrication',
    img: 'https://th.bing.com/th/id/OIP.FpzhAx13lldYCTYNsxnr3gHaHa?w=176&h=180&c=7&r=0&o=7&dpr=1.4&pid=1.7&rm=3',
    description: 'Heavy duty pressure vessel and industrial storage tank welding with X-ray quality joints.'
  }
};

// 3. IM.GE Gallery / GATE & Steel Design Images (23 Links)
export const galleryImages = [
  {
    id: 1,
    title: 'GATE & Civil Engineering Steel Design Framework',
    category: 'gates',
    imgeUrl: 'https://im.ge/i/QMRHXYJ',
    img: 'https://i.im.ge/QMRHXYJ/2b88974d-5cdb-4796-90ee-54df4c4ded23-t600.webp'
  },
  {
    id: 2,
    title: 'Architectural Main Gate Steel Structure',
    category: 'gates',
    imgeUrl: 'https://im.ge/i/QMRHoha',
    img: 'https://i.im.ge/QMRHoha/Wonderful_amezing_Gate_ideas_-t600.webp'
  },
  {
    id: 3,
    title: 'Heavy Structural Steel Beam Joint Welding',
    category: 'custom',
    imgeUrl: 'https://im.ge/i/QMRHlBy',
    img: 'https://i.im.ge/QMRHlBy/2fa17ae3-852b-4121-8d52-53556ee00c1d-t600.webp'
  },
  {
    id: 4,
    title: 'Industrial Sliding Gate Frame Assembly',
    category: 'gates',
    imgeUrl: 'https://im.ge/i/QMRHFyz',
    img: 'https://i.im.ge/QMRHFyz/8dea4487-859b-4e07-aaa4-4ba084eab3c3-t600.webp'
  },
  {
    id: 5,
    title: 'Civil Engineering Truss & Structural Support',
    category: 'custom',
    imgeUrl: 'https://im.ge/i/QMRHuaS',
    img: 'https://i.im.ge/QMRHuaS/7b28d869-8b1b-4e01-a84e-523074aa0cab-t600.webp'
  },
  {
    id: 6,
    title: 'Decorative CNC Cut Steel Panel Gate',
    category: 'gates',
    imgeUrl: 'https://im.ge/i/QMRH21F',
    img: 'https://i.im.ge/QMRH21F/57d77429f3496f531cb98ac824463771-t600.webp'
  },
  {
    id: 7,
    title: 'High Security Iron Window Guard Grill',
    category: 'grills',
    imgeUrl: 'https://im.ge/i/QMRHOH6',
    img: 'https://i.im.ge/QMRHOH6/9c555c6e3ccb7c5ed60c3d73464dbedc-t600.webp'
  },
  {
    id: 8,
    title: 'Industrial Metal Railing & Balcony Protection',
    category: 'grills',
    imgeUrl: 'https://im.ge/i/QMRHSmK',
    img: 'https://i.im.ge/QMRHSmK/82aa15b5-1484-4df9-8716-d158908f70b9-t600.webp'
  },
  {
    id: 9,
    title: 'Custom Laser-Cut Geometric Security Gate',
    category: 'gates',
    imgeUrl: 'https://im.ge/i/QMRHdZ9',
    img: 'https://i.im.ge/QMRHdZ9/92b210acfe8be5d175292b5767d77beb-t600.webp'
  },
  {
    id: 10,
    title: 'Steel Pipe & Pipeline Flange Welding Joint',
    category: 'custom',
    imgeUrl: 'https://im.ge/i/QMRHsXX',
    img: 'https://i.im.ge/QMRHsXX/04091ebb-316d-41d8-b7ea-e490ad3514a3-t600.webp'
  },
  {
    id: 11,
    title: 'Wrought Iron Ornamental Balcony Grill',
    category: 'grills',
    imgeUrl: 'https://im.ge/i/QMRHah8',
    img: 'https://i.im.ge/QMRHah8/687775c2-6429-4ce2-924e-3b992f77faf9-t600.webp'
  },
  {
    id: 12,
    title: 'Modern Minimalist Entryway Steel Frame',
    category: 'gates',
    imgeUrl: 'https://im.ge/i/QMRH7bh',
    img: 'https://i.im.ge/QMRH7bh/717809d9a52534a1ce5917936b71ee5e-t600.webp'
  },

  {
    id: 14,
    title: 'Heavy Duty Automated Cantilever Gate',
    category: 'gates',
    imgeUrl: 'https://im.ge/i/QMRHUAD',
    img: 'https://i.im.ge/QMRHUAD/b399143f-8f30-4fa6-935d-34dfe3669fa4-t600.webp'
  },
  {
    id: 15,
    title: 'Civil Engineering Steel Beam Connection Detail',
    category: 'custom',
    imgeUrl: 'https://im.ge/i/QMRHLaY',
    img: 'https://i.im.ge/QMRHLaY/a60e1961-ea69-4e49-b010-5a631b8e7cbb-t600.webp'
  },
  {
    id: 16,
    title: 'Decorative Steel Mesh Security Enclosure',
    category: 'grills',
    imgeUrl: 'https://im.ge/i/QMRH01C',
    img: 'https://i.im.ge/QMRH01C/c00d5760d5446bf6a4f33b19181babe8-t600.webp'
  },
  {
    id: 17,
    title: 'Decorative CNC Grill Design for Balcony Walls',
    category: 'grills',
    imgeUrl: 'https://im.ge/i/QMRH5wq',
    img: 'https://i.im.ge/QMRH5wq/Decorative_CNC_Grill_Design_for_Balcony_Walls-t600.webp'
  },
  {
    id: 18,
    title: 'TIG Welded Custom Stainless Steel Railing',
    category: 'custom',
    imgeUrl: 'https://im.ge/i/QMRHhH4',
    img: 'https://i.im.ge/QMRHhH4/ba1201d7a04822c322d4697b84f42ff8-t600.webp'
  },
  {
    id: 19,
    title: 'Heavy Pressure Vessel Tank Welded Assembly',
    category: 'custom',
    imgeUrl: 'https://im.ge/i/QMRHmXP',
    img: 'https://i.im.ge/QMRHmXP/f50ee6a4d9a00d6066a64b70c481900c-t600.webp'
  },
  {
    id: 20,
    title: 'Custom Metalwork Staircase & Balustrade',
    category: 'custom',
    imgeUrl: 'https://im.ge/i/QMRH9Zp',
    img: 'https://i.im.ge/QMRH9Zp/f6f0049afaef5afcc82f724c1945e05c-t600.webp'
  },
  {
    id: 21,
    title: 'Structural Steel Column Base Plate Welding',
    category: 'custom',
    imgeUrl: 'https://im.ge/i/QMRHwi1',
    img: 'https://i.im.ge/QMRHwi1/f71d07de203a97f09b2b119e930d4a97-t600.webp'
  },
  {
    id: 22,
    title: 'Metalwork Railing Laser-Cut Artistic Figure',
    category: 'grills',
    imgeUrl: 'https://im.ge/i/QMRH6bf',
    img: 'https://i.im.ge/QMRH6bf/Metalwork_railing_laser_cut_figure-t600.webp'
  },
  {
    id: 23,
    title: 'Modern Double Swing Driveway Estate Gate',
    category: 'gates',
    imgeUrl: 'https://im.ge/i/QMRHNGm',
    img: 'https://i.im.ge/QMRHNGm/Wonderful_amezing_Gate_ideas_-t600.webp'
  }
];
