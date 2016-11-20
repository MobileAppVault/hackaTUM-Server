
# MachtSpass - Server

Server Backend for MachtSpass iOS App!
Read more about the project here: [https://github.com/ffittschen/hackaTUM]

# Videos

![Question Video](https://www.dropbox.com/s/u9yld7381dykeyk/MachtSpa%C3%9F%20-%20Part%201%20-%20Question.mov?dl=0)
![Answer Video](https://www.dropbox.com/s/3kdoum39r5bpv1f/MachtSpa%C3%9F%20-%20Part%202%20-%20%20Answer.mov?dl=0)

![Alt Text](https://github.com/MobileAppVault/hackaTUM-Server/blob/master/media/MachtSpa%C3%9F%20-%20Part%201%20-%20Question.gif)


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
- REST API Authentication ( API_KEY/ TOKEN )
- Azure Analitics Services

# Credits

    (Node-APN)[https://github.com/node-apn/node-apn] - Copyright (c) 2010 Andrew Naylor
    (ExpressJS)[http://expressjs.com/] - Copyright © 2016 StrongLoop, IBM, and other expressjs.com contributors.
    (Node.js)[https://nodejs.org/en/] Copyright © 2016 Joyent.

---

# API endpoints

## inspect data

[/api/v1/profiles]

[/api/v1/products]

[/api/v1/questions]

[/api/v1/answers]

[/api/v1/ratings?page=1&limit=10]

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
