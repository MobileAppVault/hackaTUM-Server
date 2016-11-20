# Demo

Purchaser
- Peter
- Marcus

User 
- Florian

Products

    - productid: uuid
    - title: APPLE iPhone 7 32 GB Schwarz
    - content: Betriebssystem: iOS 10 Prozessor: A10 Fusion Chip mit 64‑Bit Architektur, Integrierter M10 Motion Coprozessor...
    - image: http://picscdn.redblue.de/doi/pixelboxx-mss-72006882/fee_325_225_png/APPLE-iPhone-7-32-GB-Schwarz-
    - price: 759

Ratings generieren für Producte

/api/v1/demoproducts


# Infrastructure

## Database

- Azure DocumentDB - MongoDB

## API

- Azure API App ( NodeJS / Express )

## Push Notification 

- Azure Push Notification Hub 
    -> integrated but replaced because we had some certificate issues 
    -> replaced with https://github.com/node-apn/node-apn

# Open Todos

- Mongoose -> use related database item with ref 
- API Authentication ( API_KEY/ TOKEN )
- Azure Analitics Services

---

# API endpoints

## inspect data

[http://machtspass-server.azurewebsites.net/api/v1/profiles]

[http://machtspass-server.azurewebsites.net/api/v1/products]

[http://machtspass-server.azurewebsites.net/api/v1/questions]

[http://machtspass-server.azurewebsites.net/api/v1/answers]

[http://machtspass-server.azurewebsites.net/api/v1/ratings?page=1&limit=10]

## Initial Setup (triggered manualy)

### setup fake data

    GET: /api/v1/fakedata

## User Profile

### create new user profile 
    
    POST: /api/v1/profile
    {
      name: String,
      avatar: String,
      pushid: String,
      notificationactive: Boolean
    }

### get user profile 
    
    GET: /api/v1/profile:id

### update profile

    PUT: /api/v1/profile:id
    {
      name: String,
      avatar: String,
      pushid: String,
      notificationactive: Boolean
    }

## Product

### get product data includes rating & and setup user if not exists 
### ( huge performance improvement in process flow )

    POST: /api/v1/product
    {
        "productid":"",
        "userid":"",
        "pushid":"", // device token
    }


**return**

    {
      userid: String,
      product: {
        productid: String,
        title: String,
        content: String,
        features: String,
        link: String,
        image: String,
        price: Number
      },
      rating: {
        funfactor: Number,
        likes: Number,
        dislikes: Number
      }
    }

## Qestion 

### send question "Macht Spaß?"

    POST: /api/v1/question
    {
      "userid": "",
      "productid": "",
      "latitude": "",
      "longitude": ""
    }


**return**

    {
      "status": "OK",
      "message": "",
      "questionid": "",
      "waitfor": "500"
    }

### pull question status

    GET: /api/v1/question/:id/status
    
**return**

    {
        "status": "OK",
        "message": "",
        "questionid": 0,
        "likes": 10,
        "dislikes": 2,
        "funfactor": 10
    }


### get question details

    GET: /api/v1/question:id
    
**return**

    {
        "questionid": "",
        "product": {
            productid: String,
            title: String,
            content: String,
            features: String,
            link: String,
            image: String,
            price: Number
        },
    }


## Answer 

### send Answer ( Macht Spaß | Macht kein Spaß )

    POST: /api/v1/answer
    {
      "userid": "",
      "productid": "",
      "like": 1,
      "dislike": 0
    }

**return**

    {
      "status": "OK",
      "message": "",
    }

---
