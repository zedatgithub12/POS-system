const ProductDummy = [
    {
        picture: 'https://example.com/product1.jpg',
        name: 'Ethiopian Coffee Beans',
        category: 'Food & Beverage',
        brand: 'Yirgacheffe',
        code: 'YG001',
        cost: 200,
        unit: '1 kg',
        price: 300,
        quantity: 50,
        description: 'Premium quality coffee beans from the Yirgacheffe region of Ethiopia.',
        shop: 'Coffee House',
        status: 'In stock'
    },

    {
        picture: 'https://example.com/product2.jpg',
        name: 'Ethiopian Honey',
        category: 'Food & Beverage',
        brand: 'Lalibela',
        code: 'LH002',
        cost: 100,
        unit: '500g',
        price: 150,
        quantity: 100,
        description: 'Pure and natural honey from the highlands of Ethiopia.',
        shop: 'Honey Land',
        status: 'In stock'
    },

    {
        picture: 'https://example.com/product3.jpg',
        name: 'Ethiopian Leather Bag',
        category: 'Fashion',
        brand: 'Addis Ababa Leather Co.',
        code: 'AAL003',
        cost: 500,
        unit: '1 piece',
        price: 800,
        quantity: 20,
        description: 'Handcrafted leather bag made by skilled artisans in Addis Ababa.',
        shop: 'Leather World',
        status: 'In stock'
    },

    {
        picture: 'https://example.com/product4.jpg',
        name: 'Ethiopian Spices',
        category: 'Food & Beverage',
        brand: 'Berbere',
        code: 'BB004',
        cost: 50,
        unit: '100g',
        price: 100,
        quantity: 200,
        description: 'A blend of spices commonly used in Ethiopian cuisine.',
        shop: 'Spice Bazaar',
        status: 'In stock'
    },

    {
        picture: 'https://example.com/product5.jpg',
        name: 'Ethiopian Opal Necklace',
        category: 'Fashion',
        brand: 'Opalite',
        code: 'OP005',
        cost: 1000,
        unit: '1 piece',
        price: 1500,
        quantity: 5,
        description: 'A stunning necklace featuring Ethiopian opals.',
        shop: 'Jewelry Palace',
        status: 'In stock'
    },

    {
        picture: 'https://example.com/product6.jpg',
        name: 'Ethiopian Handwoven Basket',
        category: 'Home Decor',
        brand: 'Bahir Dar Baskets',
        code: 'BDB006',
        cost: 150,
        unit: '1 piece',
        price: 250,
        quantity: 30,
        description: 'A beautiful handwoven basket made by artisans in Bahir Dar.',
        shop: 'Home Accents',
        status: 'In stock'
    },

    {
        picture: 'https://example.com/product7.jpg',
        name: 'Ethiopian Teff Flour',
        category: 'Food & Beverage',
        brand: 'Teff Time',
        code: 'TT007',
        cost: 75,
        unit: '500g',
        price: 120,
        quantity: 100,
        description: 'A gluten-free flour made from teff, a staple grain in Ethiopia.',
        shop: 'Healthy Living',
        status: 'In stock'
    },

    {
        picture: 'https://example.com/product8.jpg',
        name: 'Ethiopian Cotton Scarf',
        category: 'Fashion',
        brand: 'Cotton Clouds',
        code: 'CC008',
        cost: 200,
        unit: '1 piece',
        price: 350,
        quantity: 15,
        description: 'A soft and lightweight scarf made from Ethiopian cotton.',
        shop: 'Fashionista',
        status: 'In stock'
    },

    {
        picture: 'https://example.com/product9.jpg',
        name: 'Ethiopian Black Seed Oil',
        category: 'Health & Wellness',
        brand: 'Black Seed Co.',
        code: 'BSC009',
        cost: 300,
        unit: '100ml',
        price: 450,
        quantity: 50,
        description: 'A natural oil extracted from Ethiopian black seeds, known for its health benefits.',
        shop: 'Wellness Corner',
        status: 'In stock'
    },

    {
        picture: 'https://example.com/product10.jpg',
        name: 'Ethiopian Handmade Pottery',
        category: 'Home Decor',
        brand: 'Addis Pottery',
        code: 'AP010',
        cost: 250,
        unit: '1 piece',
        price: 400,
        quantity: 25,
        description: 'Unique and colorful pottery made by hand in Addis Ababa.',
        shop: 'Artisanal Finds',
        status: 'In stock'
    },

    {
        picture: 'https://example.com/product11.jpg',
        name: 'Ethiopian Leather Shoes',
        category: 'Fashion',
        brand: 'Sheba Leather',
        code: 'SL011',
        cost: 600,
        unit: '1 pair',
        price: 900,
        quantity: 10,
        description: 'Stylish and comfortable leather shoes made in Ethiopia.',
        shop: 'Shoe Haven',
        status: 'In stock'
    },

    {
        picture: 'https://example.com/product12.jpg',
        name: 'Ethiopian Sidamo Coffee',
        category: 'Food & Beverage',
        brand: 'Sidamo Roasters',
        code: 'SR012',
        cost: 250,
        unit: '500g',
        price: 400,
        quantity: 30,
        description: 'A smooth and rich coffee from the Sidamo region of Ethiopia.',
        shop: 'Coffee Lovers',
        status: 'In stock'
    },

    {
        picture: 'https://example.com/product13.jpg',
        name: 'Ethiopian Handmade Scarf',
        category: 'Fashion',
        brand: 'Addis Scarves',
        code: 'AS013',
        cost: 150,
        unit: '1 piece',
        price: 250,
        quantity: 20,
        description: 'A beautifully crafted scarf made by hand in Addis Ababa.',
        shop: 'Boutique',
        status: 'In stock'
    },

    {
        picture: 'https://example.com/product14.jpg',
        name: 'Ethiopian Tribal Necklace',
        category: 'Fashion',
        brand: 'Tribal Treasures',
        code: 'TT014',
        cost: 500,
        unit: '1 piece',
        price: 750,
        quantity: 8,
        description: 'A striking necklace featuring traditional Ethiopian tribal beads.',
        shop: 'Boho Chic',
        status: 'In stock'
    },

    {
        picture: 'https://example.com/product15.jpg',
        name: 'Ethiopian Macchiato Mug',
        category: 'Home Decor',
        brand: 'Coffee Culture',
        code: 'CC015',
        cost: 100,
        unit: '1 piece',
        price: 150,
        quantity: 50,
        description: 'A fun and colorful mug perfect for enjoying a macchiato.',
        shop: 'Coffee Shop',
        status: 'In stock'
    },

    {
        picture: 'https://example.com/product16.jpg',
        name: 'Ethiopian Cotton Tote Bag',
        category: 'Fashion',
        brand: 'Cotton Canvas',
        code: 'CC016',
        cost: 150,
        unit: '1 piece',
        price: 250,
        quantity: 30,
        description: 'A sturdy and eco-friendly tote bag made from Ethiopian cotton.',
        shop: 'Sustainable Living',
        status: 'In stock'
    },

    {
        picture: 'https://example.com/product17.jpg',
        name: 'Ethiopian Leather Wallet',
        category: 'Fashion',
        brand: 'Addis Wallets',
        code: 'AW017',
        cost: 200,
        unit: '1 piece',
        price: 350,
        quantity: 25,
        description: 'A sleek and functional leather wallet made in Addis Ababa.',
        shop: 'Accessories Galore',
        status: 'In stock'
    },

    {
        picture: 'https://example.com/product18.jpg',
        name: 'Ethiopian Beeswax Candle',
        category: 'Home Decor',
        brand: 'Beeswax Co.',
        code: 'BC018',
        cost: 50,
        unit: '1 piece',
        price: 100,
        quantity: 100,
        description: 'A natural and eco-friendly candle made from Ethiopian beeswax.',
        shop: 'Candle Corner',
        status: 'In stock'
    },

    {
        picture: 'https://example.com/product19.jpg',
        name: 'Ethiopian Amharic Alphabet Chart',
        category: 'Education',
        brand: 'Amharic ABCs',
        code: 'ABC019',
        cost: 75,
        unit: '1 piece',
        price: 120,
        quantity: 50,
        description: 'A colorful and educational chart featuring the Amharic alphabet.',
        shop: 'Learning Center',
        status: 'In stock'
    },

    {
        picture: 'https://example.com/product20.jpg',
        name: 'Ethiopian Handmade Pottery Bowl',
        category: 'Home Decor',
        brand: 'Gondar Pottery',
        code: 'GP020',
        cost: 300,
        unit: '1 piece',
        price: 500,
        quantity: 15,
        description: 'A beautiful and functional pottery bowl made by artisans in Gondar.',
        shop: 'Artisanal Finds',
        status: 'In stock'
    }
];

export default ProductDummy;
