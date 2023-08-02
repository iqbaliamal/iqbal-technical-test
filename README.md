### OVERVIEW

This code intended to take the technical test at Folkatech. This code is written using Typescript with ExpressJS framework and combined with several dependencies.

### HOW TO RUN THIS CODE?

1. Install dependencies
   `yarn install`
2. Run docker to install redis and mongodb
   `docker-compose up -d`
3. Run the app
   `yarn start`

### HOW TO TEST API?

1. Open postman
2. Import posman collection (Technical Test Folkatech.postman_collection.json)
3. Register user
4. Select spesific user then change role from `user` to `admin` (all important access restricted with role `admin`)

### WHATS INCLUDE IN THIS CODE?

1. Authentication use JWT for token
2. Save the access_token to -> redis (save session)
3. Bearer token to verify auth
4. Users API : Get all users, Get me, get by accountNumber, get by identityNumber, update profil, update user
5. Books API : Get all, get by slug, create, update, delete.
6. Any changes data _Books_ sync to redis

### CREDIT

Iqbal Ikhlasul Amal
