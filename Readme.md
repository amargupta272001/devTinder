## Packages used
- express.json() //used for json parese response
- npm cookie-parser // used for parse cookie to read
- npm mongoose [ for DB ]
- npm validator [ for validation ]
- npm bcrypt [ for hasing password ]
- npm jsonwebtoken
- express.Router for modular routing


- Pagination
    -/feed?page=1&limit=10 => .skip(0)  .limit(10)
    -/feed?page=2&limit=20 => .skip(10)  .limit(20)
    -/feed?page=3&limit=30 => .skip(20)  .limit(30)
