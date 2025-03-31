import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create genres first
  const genreData = [
    { name: 'Тарихи' },
    { name: 'Поэзия' },
    { name: 'Роман' },
    { name: 'Повесть' },
    { name: 'Философия' },
    { name: 'Тарихи роман' },
    { name: 'Автобиографиялық шығарма' },
    { name: 'Тарихи повесть' },
    { name: 'Биографиялық роман' }
  ];

  const genres = {};
  
  // Create each genre and store them in our genres object
  for (const genre of genreData) {
    // Check if genre exists first
    let genreRecord = await prisma.genre.findFirst({
      where: { name: genre.name }
    });
    
    // If not found, create it
    if (!genreRecord) {
      genreRecord = await prisma.genre.create({
        data: genre
      });
    }
    
    // Store for later reference
    genres[genre.name] = genreRecord;
  }
  
  // Create authors with the same approach
  const authorData = [
    { name: 'Ілияс Жансүгіров' },
    { name: 'Абай Құнанбайұлы' },
    { name: 'Мұхтар Әуезов' },
    { name: 'Міржақып Дулатов' },
    { name: 'Бердібек Соқпақбаев' },
    { name: 'Ілияс Есенберлин' },
    { name: 'Әзілхан Нұршайықов' },
    { name: 'Әбдіжәміл Нұрпейісов' },
    { name: 'Бауыржан Момышұлы' },
    { name: 'Мұхтар Мағауин' },
    { name: 'Сәуірбек Бақбергенов' }
  ];
  
  const authors = {};
  
  for (const author of authorData) {
    // Check if author exists
    let authorRecord = await prisma.author.findFirst({
      where: { name: author.name }
    });
    
    // If not found, create it
    if (!authorRecord) {
      authorRecord = await prisma.author.create({
        data: author
      });
    }
    
    // Store for later reference
    authors[author.name] = authorRecord;
  }

  // Create books from the JSON array
  const booksData = [
    {
      "title": "Құлагер: поэмалар",
      "author": "Ілияс Жансүгіров",
      "year": "1994",
      "genre": "Поэзия",
      "image": "/kulager.jpg",
      "bookUrl": "kulager.pdf",
      "price": 1234
    },
    {
      "title": "Абайдың қара сөздері",
      "author": "Абай Құнанбайұлы",
      "year": "1855",
      "genre": "Философия",
      "image": "/abaikara.jpeg",
      "bookUrl": "abaikara.pdf",
      "price": 1234
    },
    {
      "title": "Қараш - Қараш оқиғасы",
      "author": "Мұхтар Әуезов",
      "year": "1927",
      "genre": "Повесть",
      "image": "/karash.jpeg",
      "bookUrl": "karash.pdf",
      "price": 1234
    },
    {
      "title": "Оян, қазақ!",
      "author": "Міржақып Дулатов",
      "year": "1909",
      "genre": "Поэзия",
      "image": "/oyankaz.jpg",
      "bookUrl": "oyankaz.pdf",
      "price": 1234
    },
    {
      "title": "Менің атым Қожа",
      "author": "Бердібек Соқпақбаев",
      "year": "1957",
      "genre": "Повесть",
      "image": "/kozha.jpg",
      "bookUrl": "kozha.pdf",
      "price": 1234
    },
    {
      "title": "Көшпенділер",
      "author": "Ілияс Есенберлин",
      "year": "1971",
      "genre": "Тарихи роман",
      "image": "/koshpendiler.jpg",
      "bookUrl": "koshpendiler.pdf",
      "price": 1234
    },
    {
      "title": "Махаббат, қызық мол жылдар",
      "author": "Әзілхан Нұршайықов",
      "year": "1970",
      "genre": "Роман",
      "image": "/mahabbat.jpg",
      "bookUrl": "mahabbat.pdf","price": 1234
    },
    {
      "title": "Қан мен тер",
      "author": "Әбдіжәміл Нұрпейісов",
      "year": "1970",
      "genre": "Роман",
      "image": "/qanmenter.jpg",
      "bookUrl": "qanmenter.pdf"
      ,"price": 1234
    },
    {
      "title": "Ұшқан ұя",
      "author": "Бауыржан Момышұлы",
      "year": "1975",
      "genre": "Автобиографиялық шығарма",
      "image": "/ushkanuya.jpg",
      "bookUrl": "ushkanuya.pdf",
      "price": 1234
    },
    {
      "title": "Қилы заман",
      "author": "Мұхтар Әуезов",
      "year": "1928",
      "genre": "Тарихи повесть",
      "image": "/qilyzaman.jpg",
      "bookUrl": "qilyzaman.pdf",
      "price": 1234
    },
    {
      "title": "Шоқан асулары",
      "author": "Сәуірбек Бақбергенов",
      "year": "1983",
      "genre": "Биографиялық роман",
      "image": "/shokan.png",
      "bookUrl": "shokan.pdf",
      "price": 1234
    },
    {
      "title": "Аласапыран",  
      "author": "Мұхтар Мағауин",
      "year": "1980",
      "genre": "Тарихи роман",
      "image": "/alasapyran.jpg",
      "bookUrl": "alasapyran.pdf",
      "price": 1234
    }
  ];

  for (const bookData of booksData) {
    const authorEntity = authors[bookData.author];
    const genreEntity = genres[bookData.genre];

    if (!authorEntity || !genreEntity) {
      console.warn(`Skipping book ${bookData.title} due to missing author or genre reference`);
      continue;
    }

    // Extract just the filename without path for image and pdf
    // Ensure we have default values if split doesn't work
    const imagePath = bookData.image || "";
    const pdfPath = bookData.bookUrl || "";
    
    const imageName = imagePath.split('/').pop() || imagePath;
    const pdfName = pdfPath.split('/').pop() || pdfPath;

    // Check if book exists first by title (using findFirst since title isn't a unique field)
    const existingBook = await prisma.book.findFirst({
      where: { title: bookData.title }
    });

    if (!existingBook) {
      await prisma.book.create({
        data: {
          price: bookData.price,
          title: bookData.title,
          year: parseInt(bookData.year, 10),
          image: imageName, // Ensure this is never undefined
          pdf: pdfName, // Ensure this is never undefined
          authorId: authorEntity.id,
          genreId: genreEntity.id,
        },
      });
    }
  }

  console.log('Database seeded successfully');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });