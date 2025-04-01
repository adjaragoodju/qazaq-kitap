"""
Pre-configured book data for seeding the database.
"""

GENRE_DATA = [
    {"name": "Тарихи"},
    {"name": "Поэзия"},
    {"name": "Роман"},
    {"name": "Повесть"},
    {"name": "Философия"},
    {"name": "Тарихи роман"},
    {"name": "Автобиографиялық шығарма"},
    {"name": "Тарихи повесть"},
    {"name": "Биографиялық роман"},
    {"name": "Тарихи зерттеу"}
]

AUTHOR_DATA = [
    {"name": "Ілияс Жансүгіров"},
    {"name": "Абай Құнанбайұлы"},
    {"name": "Мұхтар Әуезов"},
    {"name": "Міржақып Дулатов"},
    {"name": "Бердібек Соқпақбаев"},
    {"name": "Ілияс Есенберлин"},
    {"name": "Әзілхан Нұршайықов"},
    {"name": "Әбдіжәміл Нұрпейісов"},
    {"name": "Бауыржан Момышұлы"},
    {"name": "Мұхтар Мағауин"},
    {"name": "Сәуірбек Бақбергенов"},
    {"name": "Кәрібаев Берекет Бақытжанұлы"}
]

BOOKS_DATA = [
    {
        "title": "Қазақ хандығының құрылу тарихы",
        "author": "Кәрібаев Берекет Бақытжанұлы",
        "year": 2022,
        "genre": "Тарихи зерттеу",
        "image": "kaztarih.jpg",
        "bookUrl": "kaztarih.pdf",
        "price": 4500,
        "description": "Бұл еңбекте қазақ хандығының құрылу тарихы..."
    },
    {
        "title": "Құлагер: поэмалар",
        "author": "Ілияс Жансүгіров",
        "year": 1994,
        "genre": "Поэзия",
        "image": "kulager.jpg",
        "bookUrl": "kulager.pdf",
        "price": 2000,
        "description": "Құлагер — атақты қазақ ақыны Ілияс Жансүгіровтің..."
    },
    {
        "title": "Абайдың қара сөздері",
        "author": "Абай Құнанбайұлы",
        "year": 1855,
        "genre": "Философия",
        "image": "abaikara.jpeg",
        "bookUrl": "abaikara.pdf",
        "price": 3500,
        "description": "Абайдың қара сөздері — Абай Құнанбайұлының..."
    },
    {
        "title": "Қараш - Қараш оқиғасы",
        "author": "Мұхтар Әуезов",
        "year": 1927,
        "genre": "Повесть",
        "image": "karash.jpeg",
        "bookUrl": "karash.pdf",
        "price": 2800,
        "description": "Қараш-Қараш оқиғасы — Мұхтар Әуезовтың..."
    },
    {
        "title": "Оян, қазақ!",
        "author": "Міржақып Дулатов",
        "year": 1909,
        "genre": "Поэзия",
        "image": "oyankaz.jpg",
        "bookUrl": "oyankaz.pdf",
        "price": 1800,
        "description": "Оян, қазақ! — Міржақып Дулатовтың ұлттық сана мен..."
    },
    {
        "title": "Менің атым Қожа",
        "author": "Бердібек Соқпақбаев",
        "year": 1957,
        "genre": "Повесть",
        "image": "kozha.jpg",
        "bookUrl": "kozha.pdf",
        "price": 2200,
        "description": "Менің атым Қожа — Бердібек Соқпақбаевтың мектеп..."
    },
    {
        "title": "Көшпенділер",
        "author": "Ілияс Есенберлин",
        "year": 1971,
        "genre": "Тарихи роман",
        "image": "koshpendiler.jpg",
        "bookUrl": "koshpendiler.pdf",
        "price": 5000,
        "description": "Көшпенділер — Ілияс Есенберлиннің қазақ хандығының..."
    },
    {
        "title": "Махаббат, қызық мол жылдар",
        "author": "Әзілхан Нұршайықов",
        "year": 1970,
        "genre": "Роман",
        "image": "mahabbat.jpg",
        "bookUrl": "mahabbat.pdf",
        "price": 3300,
        "description": "Махаббат, қызық мол жылдар — Әзілхан Нұршайықовтың..."
    },
    {
        "title": "Қан мен тер",
        "author": "Әбдіжәміл Нұрпейісов",
        "year": 1970,
        "genre": "Роман",
        "image": "qanmenter.jpg",
        "bookUrl": "qanmenter.pdf",
        "price": 4500,
        "description": "Қан мен тер — Әбдіжәміл Нұрпейісовтың қазақ халқының..."
    },
    {
        "title": "Ұшқан ұя",
        "author": "Бауыржан Момышұлы",
        "year": 1975,
        "genre": "Автобиографиялық шығарма",
        "image": "ushkanuya.jpg",
        "bookUrl": "ushkanuya.pdf",
        "price": 2700,
        "description": "Ұшқан ұя — Бауыржан Момышұлының балалық шағы..."
    },
    {
        "title": "Қилы заман",
        "author": "Мұхтар Әуезов",
        "year": 1928,
        "genre": "Тарихи повесть",
        "image": "qilyzaman.jpg",
        "bookUrl": "qilyzaman.pdf",
        "price": 3200,
        "description": "Қилы заман — Мұхтар Әуезовтың 1916 жылғы..."
    },
    {
        "title": "Шоқан асулары",
        "author": "Сәуірбек Бақбергенов",
        "year": 1983,
        "genre": "Биографиялық роман",
        "image": "shokan.png",
        "bookUrl": "shokan.pdf",
        "price": 2900,
        "description": "Шоқан асулары — Сәуірбек Бақбергеновтің белгілі қазақ..."
    }
]
