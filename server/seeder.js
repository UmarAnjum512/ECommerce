import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

import User from './models/User.js';
import Product from './models/Product.js';
import Collection from './models/Collection.js';
import Banner from './models/Banner.js';
import Order from './models/Order.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/fatima_khan_db';

const collectionsData = [
  {
    name: "Endless Summer '26",
    slug: 'endless-summer-26',
    description: 'Breezy silks, pastel palettes, and statement silhouettes crafted for radiant celebrations.',
    bannerImage: 'https://www.fatimakhanofficial.com/images/thumbs/0010520_fatimadk.jpeg',
    tag: 'NEW',
  },
  {
    name: 'Formals',
    slug: 'formals',
    description: 'Traditional silhouettes with delicate signature embroideries; your definite go-to for the festive season.',
    bannerImage: 'https://www.fatimakhanofficial.com/images/thumbs/0008357_bvcbvcn.jpeg',
    tag: 'FESTIVE',
  },
  {
    name: 'Luxury Pret',
    slug: 'luxury-pret',
    description: 'Couture hand embellishments fused with contemporary elegance for festive daywear.',
    bannerImage: 'https://www.fatimakhanofficial.com/images/thumbs/0010442_dkbannerfk.jpeg',
    tag: 'TRENDING',
  },
  {
    name: 'Digital Silk Prints',
    slug: 'digital-silk-prints',
    description: 'Fluid pure silk kaftans and coordinates adorned with bespoke artistic botanicals.',
    bannerImage: 'https://www.fatimakhanofficial.com/images/thumbs/0010302_1111111111.jpeg',
    tag: 'SIGNATURE',
  },
  {
    name: 'Ready to Ship',
    slug: 'ready-to-ship',
    description: 'Express delivery pieces shipped within 24 to 48 hours for immediate celebrations.',
    bannerImage: 'https://www.fatimakhanofficial.com/images/thumbs/0010538_fkdddk.jpeg',
    tag: 'FLAT 25% OFF',
  },
  {
    name: 'Mommy & Me',
    slug: 'mommy-and-me',
    description: 'Coordinated mother-daughter and family ensembles capturing heirloom perfection.',
    bannerImage: 'https://www.fatimakhanofficial.com/images/thumbs/0010293_2.jpeg',
    tag: 'FAMILY',
  },
];

const bannersData = [
  {
    title: "Vivre Formal '26 | Coming Soon",
    subtitle: 'Signature bridal and luxury festive collections handcrafted with timeless artisanal heritage.',
    link: '/shop?collection=Formals',
    desktopImage: 'https://www.fatimakhanofficial.com/images/thumbs/0010538_fkdddk.jpeg',
    mobileImage: 'https://www.fatimakhanofficial.com/images/thumbs/0010539_fkmbbbb.jpeg',
    type: 'hero',
    order: 1,
  },
  {
    title: "Endless Summer '26 | Shop Now",
    subtitle: 'Luminous silks, delicate florals, and statement artisanal silhouettes for warm festive evenings.',
    link: '/shop?collection=Endless Summer \'26',
    desktopImage: 'https://www.fatimakhanofficial.com/images/thumbs/0010520_fatimadk.jpeg',
    mobileImage: 'https://www.fatimakhanofficial.com/images/thumbs/0010521_fatimamb.jpeg',
    type: 'hero',
    order: 2,
  },
  {
    title: "Formals '26 | Festive Couture",
    subtitle: 'Traditional cutwork, kora, dabka, and resham threadwork crafted on pure hand-woven fabrics.',
    link: '/shop?category=Formals',
    desktopImage: 'https://www.fatimakhanofficial.com/images/thumbs/0010442_dkbannerfk.jpeg',
    mobileImage: 'https://www.fatimakhanofficial.com/images/thumbs/0010443_bannermbfk.jpeg',
    type: 'hero',
    order: 3,
  },
  {
    title: 'Elahe Formals | Pure Craft',
    subtitle: 'Regal silhouettes with delicate embellishments and artisanal excellence.',
    link: '/shop?collection=Formals',
    desktopImage: 'https://www.fatimakhanofficial.com/images/thumbs/0010297_33333.jpeg',
    mobileImage: 'https://www.fatimakhanofficial.com/images/thumbs/0010296_vggggggggggg.jpeg',
    type: 'hero',
    order: 4,
  },
];

const productsData = [
  {
    title: 'Midnight Kaftan',
    slug: 'midnight-kaftan',
    sku: 'FK-26-MK01',
    description:
      'A striking silk kaftan crafted on a deep charcoal base, adorned with intricate paisley motifs and vibrant floral accents. Finished with tassel ties, delicate lace detailing, and decorative borders, this fluid silhouette blends effortless elegance with artisanal charm for festive evenings and special gatherings.',
    fabricDetails: 'Pure Raw Silk with organza lace borders and handcrafted resham tassel tie finishes.',
    category: 'Luxury Pret',
    collectionName: "Endless Summer '26",
    price: 106,
    originalPrice: 125,
    images: [
      'https://www.fatimakhanofficial.com/images/thumbs/0010448_midnight-kaftan_1000.jpeg',
      'https://www.fatimakhanofficial.com/images/thumbs/0010449_midnight-kaftan_700.jpeg',
    ],
    hoverImage: 'https://www.fatimakhanofficial.com/images/thumbs/0010449_midnight-kaftan_700.jpeg',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'Custom'],
    heightOptions: ['Standard (45-48 inches)', 'Tall (54-56 inches)', 'Petite (42-44 inches)', 'Custom Length'],
    addons: [
      { name: 'Matching Raw Silk Pants', price: 35, description: 'Tailored straight-cut silk pants with slit cuffs' },
      { name: 'Embellished Silk Chiffon Dupatta', price: 45, description: 'Hand-block printed dupatta with lace edges' },
    ],
    countInStock: 12,
    isFeatured: true,
    isReadyToShip: true,
    isNewArrival: true,
    deliveryTimeline: 'Ready to Ship: 3-5 working days',
    careInstructions: 'Dry clean only. Store in garment bag provided.',
  },
  {
    title: 'Blush Blossom',
    slug: 'blush-blossom',
    sku: 'FK-26-BB02',
    description:
      'A luminous peach-blush silk ensemble featuring delicate pastel botanicals, paired with a flowing floral dupatta and voluminous crushed sharara bottom. Ivory embroidery, vertical lace detailing, and scalloped trims add a romantic, feminine finish, perfect for festive daywear and elegant soirées.',
    fabricDetails: 'Pure Silk Organza, Crushed Silk Sharara, Hand-embroidered resham and pearls.',
    category: 'Luxury Pret',
    collectionName: "Endless Summer '26",
    price: 108,
    originalPrice: 130,
    images: [
      'https://www.fatimakhanofficial.com/images/thumbs/0010467_blush-blossom_1000.jpeg',
      'https://www.fatimakhanofficial.com/images/thumbs/0010468_blush-blossom_700.jpeg',
    ],
    hoverImage: 'https://www.fatimakhanofficial.com/images/thumbs/0010468_blush-blossom_700.jpeg',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'Custom'],
    heightOptions: ['Standard (45-48 inches)', 'Tall (54-56 inches)', 'Custom Length'],
    addons: [
      { name: 'Crushed Silk Sharara Pants', price: 50, description: 'Voluminous gathered sharara in blush peach' },
      { name: 'Handcrafted Tassel Belt', price: 20, description: 'Pearl encrusted tie-belt' },
    ],
    countInStock: 8,
    isFeatured: true,
    isReadyToShip: false,
    isNewArrival: true,
    deliveryTimeline: 'Made to Order: 2-3 weeks',
    careInstructions: 'Strictly dry clean only. Do not machine wash.',
  },
  {
    title: 'Mint Garden',
    slug: 'mint-garden',
    sku: 'FK-26-MG03',
    description:
      'A refreshing mint-green silk ensemble featuring tropical foliage and delicate floral prints, paired with soft pink cigarette trousers. Finished with an embellished spread collar, pastel tassel ties, and scalloped lace detailing for a graceful, contemporary festive look.',
    fabricDetails: 'Pure Karandi Silk with thread embroidered neckline and organza trim inserts.',
    category: 'Ready to Ship',
    collectionName: "Endless Summer '26",
    price: 84,
    originalPrice: 99,
    images: [
      'https://www.fatimakhanofficial.com/images/thumbs/0010487_mint-garden_1000.jpeg',
      'https://www.fatimakhanofficial.com/images/thumbs/0010488_mint-garden_700.jpeg',
    ],
    hoverImage: 'https://www.fatimakhanofficial.com/images/thumbs/0010488_mint-garden_700.jpeg',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    heightOptions: ['Standard (45-48 inches)', 'Tall (54-56 inches)'],
    addons: [
      { name: 'Cigarette Trousers', price: 30, description: 'Matching soft pink straight trousers' },
    ],
    countInStock: 15,
    isFeatured: true,
    isReadyToShip: true,
    isNewArrival: true,
    deliveryTimeline: 'Ready to Ship: 2-4 working days',
    careInstructions: 'Dry clean recommended. Cool iron on reverse side.',
  },
  {
    title: 'Blush Whisper',
    slug: 'blush-whisper',
    sku: 'FK-26-BW04',
    description:
      'A luminous powder-rose silk kaftan adorned with delicate floral panels, geometric vines, and pastel butterfly motifs. Finished with an embellished slit neckline, statement white lace cuffs, and a contrasting pastel hem, it offers effortless elegance for festive daywear.',
    fabricDetails: 'Heavy Crêpe Silk with scalloped lace cuffs and crystal neckline accents.',
    category: 'Digital Silk Prints',
    collectionName: "Endless Summer '26",
    price: 94,
    originalPrice: 110,
    images: [
      'https://www.fatimakhanofficial.com/images/thumbs/0010506_blush-whisper_1000.jpeg',
      'https://www.fatimakhanofficial.com/images/thumbs/0010507_blush-whisper_700.jpeg',
    ],
    hoverImage: 'https://www.fatimakhanofficial.com/images/thumbs/0010507_blush-whisper_700.jpeg',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'Custom'],
    heightOptions: ['Standard (45-48 inches)', 'Tall (54-56 inches)', 'Custom Length'],
    addons: [
      { name: 'Matching Silk Slip', price: 25, description: 'Pure cotton silk breathable inner slip' },
    ],
    countInStock: 10,
    isFeatured: true,
    isReadyToShip: true,
    isNewArrival: true,
    deliveryTimeline: 'Ready to Ship: 3-5 working days',
    careInstructions: 'Dry clean only.',
  },
  {
    title: 'Nadine',
    slug: 'nadine',
    sku: 'FK-FM-ND05',
    description:
      'Beautifully blends traditional elements with a modern flair. The hot pink raw silk angharka shirt with intricate hand-embellishments, block print details, paired with an ivory rust screen printed silk sharara and a hot pink net dupatta is stunning. The use of kora, dabka, and threadwork along with the hand-blocked and zari embroidery details adds a touch of timeless elegance.',
    fabricDetails: 'Pure Raw Silk Angharka, Screen printed Sharara, Fine tulle Net Dupatta.',
    category: 'Formals',
    collectionName: 'Formals',
    price: 189,
    originalPrice: 220,
    images: [
      'https://www.fatimakhanofficial.com/images/thumbs/0006067_nadine_1000.jpeg',
      'https://www.fatimakhanofficial.com/images/thumbs/0006068_nadine_700.jpeg',
    ],
    hoverImage: 'https://www.fatimakhanofficial.com/images/thumbs/0006068_nadine_700.jpeg',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'Custom Stitching'],
    heightOptions: ['Standard (45-48 inches)', 'Tall (54-56 inches)', 'Custom Tailoring'],
    addons: [
      { name: 'Screen Printed Silk Sharara', price: 65, description: 'Ivory rust handcrafted block printed sharara' },
      { name: 'Embellished Net Dupatta', price: 55, description: 'Hot pink net dupatta with zardozi four-sided borders' },
    ],
    countInStock: 6,
    isFeatured: true,
    isReadyToShip: false,
    isNewArrival: false,
    deliveryTimeline: 'Made to Order: 4-5 weeks',
    careInstructions: 'Specialist dry clean only. Preserve zardozi and dabka with tissue paper.',
  },
  {
    title: 'Zarminay',
    slug: 'zarminay',
    sku: 'FK-FM-ZM06',
    description:
      'The fusion cutwork-styled jacket is adorned with exquisite zari embroidery and intricate handwork, making it a truly luxurious piece. The cutwork sleeves add a modern twist to the traditional artistry, enhancing the overall look. This jacket is a perfect blend of innovation and meticulous detail, making it an outstanding choice for any fashion-forward individual.',
    fabricDetails: 'Handcrafted Zari cutwork over Pure Tissue Silk, layered with Silk Trousers.',
    category: 'Formals',
    collectionName: 'Formals',
    price: 680,
    originalPrice: 750,
    images: [
      'https://www.fatimakhanofficial.com/images/thumbs/0006143_zarminay_1000.jpeg',
      'https://www.fatimakhanofficial.com/images/thumbs/0006144_zarminay_700.jpeg',
    ],
    hoverImage: 'https://www.fatimakhanofficial.com/images/thumbs/0006144_zarminay_700.jpeg',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'Custom Stitching'],
    heightOptions: ['Standard (45-48 inches)', 'Tall (54-56 inches)', 'Custom Tailoring'],
    addons: [
      { name: 'Tailored Wide-Leg Silk Pants', price: 75, description: 'Pure silk crepe wide trousers' },
      { name: 'Hand-worked Inner Blouse', price: 60, description: 'Bustier inner with dabka work' },
    ],
    countInStock: 4,
    isFeatured: true,
    isReadyToShip: false,
    isNewArrival: false,
    deliveryTimeline: 'Bespoke Haute Couture: 5-6 weeks',
    careInstructions: 'Specialist couture dry cleaning only.',
  },
  {
    title: 'Mashal',
    slug: 'mashal',
    sku: 'FK-FM-MS07',
    description:
      'This matte gold piece is a testament to the art of intricate craftsmanship. Delicate hand embellishment shirt enhanced with zardozi and crystal work gracefully adorns, woven together with precision and care paired up with the underdress. The dupattas four corners are embellished with silver chan, while the net frill on underdress adds an element of elegance.',
    fabricDetails: 'Matte Gold Lame with Swarovski crystals, zardozi needlework, and layered net underdress.',
    category: 'Formals',
    collectionName: 'Formals',
    price: 168,
    originalPrice: 195,
    images: [
      'https://www.fatimakhanofficial.com/images/thumbs/0006136_mashal_1000.jpeg',
      'https://www.fatimakhanofficial.com/images/thumbs/0006137_mashal_700.jpeg',
    ],
    hoverImage: 'https://www.fatimakhanofficial.com/images/thumbs/0006137_mashal_700.jpeg',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'Custom'],
    heightOptions: ['Standard (45-48 inches)', 'Tall (54-56 inches)', 'Custom Length'],
    addons: [
      { name: 'Net Underdress with Frill', price: 45, description: 'Structured underdress with double net frill hem' },
      { name: 'Chan Embellished Dupatta', price: 40, description: 'Dupatta with silver chan and scalloped border' },
    ],
    countInStock: 7,
    isFeatured: true,
    isReadyToShip: false,
    isNewArrival: false,
    deliveryTimeline: 'Made to Order: 3-4 weeks',
    careInstructions: 'Dry clean only.',
  },
  {
    title: 'Shahnoor',
    slug: 'shahnoor',
    sku: 'FK-FM-SH08',
    description:
      'This angharka radiates charm in a mustard hue enriched with colorful resham embroidery and handcrafted details. The neckline and sleeves are beautifully adorned with intricate embellishments, adding richness to the design. It is paired with printed pants that lend character and a flowing dupatta edged with delicate finishes.',
    fabricDetails: 'Pure Organza Angharka, Hand-embellished resham motifs, Screen printed silk pants.',
    category: 'Formals',
    collectionName: 'Formals',
    price: 193,
    originalPrice: 230,
    images: [
      'https://www.fatimakhanofficial.com/images/thumbs/0008248_shahnoor_1000.jpeg',
      'https://www.fatimakhanofficial.com/images/thumbs/0008249_shahnoor_700.jpeg',
    ],
    hoverImage: 'https://www.fatimakhanofficial.com/images/thumbs/0008249_shahnoor_700.jpeg',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'Custom Stitching'],
    heightOptions: ['Standard (45-48 inches)', 'Tall (54-56 inches)', 'Custom Tailoring'],
    addons: [
      { name: 'Printed Silk Trousers', price: 45, description: 'Matching mustard patterned trousers' },
      { name: 'Organza Embroidered Dupatta', price: 50, description: 'Flowing dupatta with delicate lace borders' },
    ],
    countInStock: 9,
    isFeatured: true,
    isReadyToShip: false,
    isNewArrival: false,
    deliveryTimeline: 'Made to Order: 3-4 weeks',
    careInstructions: 'Specialist dry clean only.',
  },
  {
    title: 'Seashell Pearl',
    slug: 'seashell-pearl',
    sku: 'FK-FM-SP09',
    description:
      'This ensemble presents a contemporary yet graceful take on eastern wear. The halter-style jacket is richly adorned with delicate thread embroidery and sequins, forming floral and lattice-inspired motifs. The pastel palette of soft pinks and silvers lends a dreamy elegance. Paired with sleek draped silk pants.',
    fabricDetails: 'Raw Silk Halter Jacket with silver sequence and pearl accents, Draped Silk Crepe Pants.',
    category: 'Formals',
    collectionName: 'Formals',
    price: 273,
    originalPrice: 310,
    images: [
      'https://www.fatimakhanofficial.com/images/thumbs/0008317_seashell-pearl_1000.jpeg',
      'https://www.fatimakhanofficial.com/images/thumbs/0008318_seashell-pearl_700.jpeg',
    ],
    hoverImage: 'https://www.fatimakhanofficial.com/images/thumbs/0008318_seashell-pearl_700.jpeg',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'Custom'],
    heightOptions: ['Standard (45-48 inches)', 'Tall (54-56 inches)', 'Custom Tailoring'],
    addons: [
      { name: 'Draped Silk Crepe Pants', price: 65, description: 'Sleek draped palazzo pants' },
    ],
    countInStock: 5,
    isFeatured: true,
    isReadyToShip: false,
    isNewArrival: false,
    deliveryTimeline: 'Made to Order: 4 weeks',
    careInstructions: 'Dry clean only.',
  },
  {
    title: 'Ziya',
    slug: 'ziya',
    sku: 'FK-FM-ZY10',
    description:
      'A contemporary ivory-silver ensemble that fuses modern elegance with traditional craftsmanship. The sleeveless jacket is intricately hand embellished with silver sequins, crystals, and threadwork, styled over wide legged silk trousers for a sleek silhouette. Minimal yet regal.',
    fabricDetails: 'Ivory Raw Silk, Handcrafted silver zardozi, cutdana and crystal embroidery.',
    category: 'Formals',
    collectionName: 'Formals',
    price: 218,
    originalPrice: 250,
    images: [
      'https://www.fatimakhanofficial.com/images/thumbs/0008324_ziya_1000.jpeg',
      'https://www.fatimakhanofficial.com/images/thumbs/0008325_ziya_700.jpeg',
    ],
    hoverImage: 'https://www.fatimakhanofficial.com/images/thumbs/0008325_ziya_700.jpeg',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'Custom Stitching'],
    heightOptions: ['Standard (45-48 inches)', 'Tall (54-56 inches)', 'Custom Tailoring'],
    addons: [
      { name: 'Wide Legged Silk Trousers', price: 55, description: 'Flowing ivory silk trousers' },
    ],
    countInStock: 8,
    isFeatured: true,
    isReadyToShip: false,
    isNewArrival: false,
    deliveryTimeline: 'Made to Order: 3-4 weeks',
    careInstructions: 'Dry clean only.',
  },
  {
    title: 'Gulnar',
    slug: 'gulnar',
    sku: 'FK-FM-GL11',
    description:
      'A regal gold kameez infused with traditional charm, enhanced by resham embroidery and subtle floral motifs. Paired with a vibrant magenta and burnt orange dupatta featuring traditional bandhani-inspired patterns, the contrast brings warmth and grandeur. Timeless, versatile, and celebratory.',
    fabricDetails: 'Gold Handloom Silk, Bandhani dyed silk dupatta with gold gotta and resham border.',
    category: 'Formals',
    collectionName: 'Formals',
    price: 289,
    originalPrice: 320,
    images: [
      'https://www.fatimakhanofficial.com/images/thumbs/0008331_gulnar_1000.jpeg',
      'https://www.fatimakhanofficial.com/images/thumbs/0008332_gulnar_700.jpeg',
    ],
    hoverImage: 'https://www.fatimakhanofficial.com/images/thumbs/0008332_gulnar_700.jpeg',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'Custom Stitching'],
    heightOptions: ['Standard (45-48 inches)', 'Tall (54-56 inches)', 'Custom Tailoring'],
    addons: [
      { name: 'Bandhani Contrast Silk Dupatta', price: 75, description: 'Hand-dyed magenta & burnt orange dupatta' },
      { name: 'Gold Gotta Trousers', price: 45, description: 'Pure silk cigarette pants with gotta lace' },
    ],
    countInStock: 6,
    isFeatured: true,
    isReadyToShip: false,
    isNewArrival: false,
    deliveryTimeline: 'Made to Order: 4-5 weeks',
    careInstructions: 'Dry clean only.',
  },
  {
    title: 'Zyra',
    slug: 'zyra',
    sku: 'FK-FM-ZR12',
    description:
      'A modern ivory ensemble redefining elegance. The long open jacket is embellished with delicate handwork in silver sequins, cutdana, and thread detailing, layered gracefully over wide palazzo pants and a cropped inner blouse. Sleek, refined, and luxurious.',
    fabricDetails: 'Ivory Pure Chiffon and Raw Silk with silver cutdana and sequin embellishments.',
    category: 'Formals',
    collectionName: 'Formals',
    price: 268,
    originalPrice: 300,
    images: [
      'https://www.fatimakhanofficial.com/images/thumbs/0008338_zyra_1000.jpeg',
      'https://www.fatimakhanofficial.com/images/thumbs/0008339_zyra_700.jpeg',
    ],
    hoverImage: 'https://www.fatimakhanofficial.com/images/thumbs/0008339_zyra_700.jpeg',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'Custom Stitching'],
    heightOptions: ['Standard (45-48 inches)', 'Tall (54-56 inches)', 'Custom Tailoring'],
    addons: [
      { name: 'Wide Palazzo Pants', price: 60, description: 'Pure crepe wide palazzo pants' },
      { name: 'Cropped Embellished Inner Blouse', price: 45, description: 'Matching ivory sequin inner blouse' },
    ],
    countInStock: 7,
    isFeatured: true,
    isReadyToShip: true,
    isNewArrival: false,
    deliveryTimeline: 'Ready to Ship: 3-5 working days',
    careInstructions: 'Specialist dry clean only.',
  },
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('🌱 Connected to MongoDB for seeding...');

    // Clear existing data
    await User.deleteMany();
    await Product.deleteMany();
    await Collection.deleteMany();
    await Banner.deleteMany();
    await Order.deleteMany();

    console.log('🧹 Cleared existing collections, users, products, orders, banners.');

    // Seed Users
    const adminUser = await User.create({
      name: 'Fatima Khan Admin',
      email: 'admin@fatimakhan.com',
      password: 'admin123',
      role: 'admin',
      phone: '+923033333705',
    });

    const demoUser = await User.create({
      name: 'Ayesha Malik',
      email: 'customer@fatimakhan.com',
      password: 'customer123',
      role: 'user',
      phone: '+923001234567',
      addresses: [
        {
          addressLine: 'House 42, Street 10, F-7/2',
          city: 'Islamabad',
          postalCode: '44000',
          country: 'Pakistan',
          isDefault: true,
        },
      ],
    });

    console.log('👤 Seeded Admin & Demo User:');
    console.log('   Admin: admin@fatimakhan.com / admin123');
    console.log('   User: customer@fatimakhan.com / customer123');

    // Seed Collections
    const createdCollections = await Collection.insertMany(collectionsData);
    console.log(`📁 Seeded ${createdCollections.length} collections.`);

    // Seed Banners
    const createdBanners = await Banner.insertMany(bannersData);
    console.log(`🖼️ Seeded ${createdBanners.length} banners.`);

    // Seed Products
    const createdProducts = await Product.insertMany(productsData);
    console.log(`👗 Seeded ${createdProducts.length} luxury products.`);

    // Seed Sample Initial Order
    const sampleProduct = createdProducts[0];
    await Order.create({
      orderNumber: `FK-${new Date().getFullYear()}-8821`,
      user: demoUser._id,
      customerInfo: {
        name: demoUser.name,
        email: demoUser.email,
        phone: demoUser.phone,
      },
      shippingAddress: {
        addressLine: 'House 42, Street 10, F-7/2',
        city: 'Islamabad',
        postalCode: '44000',
        country: 'Pakistan',
      },
      orderItems: [
        {
          product: sampleProduct._id,
          title: sampleProduct.title,
          image: sampleProduct.images[0],
          price: sampleProduct.price,
          quantity: 1,
          size: 'M',
          heightOption: 'Standard (45-48 inches)',
          selectedAddons: sampleProduct.addons.slice(0, 1),
          itemTotal: sampleProduct.price + sampleProduct.addons[0].price,
        },
      ],
      currency: 'USD',
      itemsPrice: sampleProduct.price + sampleProduct.addons[0].price,
      shippingPrice: 15,
      totalPrice: sampleProduct.price + sampleProduct.addons[0].price + 15,
      paymentMethod: 'COD',
      paymentStatus: 'Pending',
      orderStatus: 'Processing',
      trackingNumber: 'FK-EXP-9921',
    });

    console.log('📦 Seeded initial sample order for demonstration.');

    console.log('✨ All seed data created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedDatabase();
