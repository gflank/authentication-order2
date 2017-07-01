# server

## Authentication
- Register. POST /api/auth/register {"email": \<email\>, "password": \<password\>, "role": [ ROLE_MEMBER | ROLE_BUYER | ROLE_SELLER | ROLE_ADMIN ] } 
- Login. POST /api/auth/login {"email": \<email\>, "password": \<password\>}

## User
- View user profile. GET /api/user/:userId
- Update user profile. POST /api/user/:userId { "profile.firstName": \<FirstName\>, "profile.lastName": \<LastName\>, "phoneNumber": \<PhoneNumber\>, "organization" \<Organization\> }
- Activate a user. POST /api/user/activate/:userId
- Deactivate a user. POST /api/user/activate/:userId
- View user promotions. GET /api/user/promote/:userId
- Grant user promotion. POST /api/user/promote { "buyerId": \<BuyerId\>, "sellerId": \<SellerId\>, "level": \<level\> }

## Organization
- Query organization. GET /api/org/ Example: /api/org?parent_org= will return all top level organizations (companies) owned by current user.
- Get the detail of an organization. GET /api/org/:orgId
- Create an organization. POST /api/org/new { "name": \<name\>, "description": \<description\>, "owner": \<ownerId\>, "parent_org": \<orgId\> }
- Update an organization. POST /api/org/:orgId { "name": \<name\>, "description": \<description\>, "owner": \<ownerId\>, "parent_org": \<orgId\> }

## Product
- Create a product. POST /api/product/create Body example: { "name": "skyhigho", "description": "LCD Screen Display with Touch Digitizer Panel and Frame", "features": [{ "feature": "model", "value": "iPhone 6s+" }, { "feature": "color", "value": "white" }], "price": [{ "level": 0, "value": 238 }, { "level": 1, "value": 132.22 }, { "level": 2, "value": 90 }], "seller": "58d44d02323e0560d103028d", "in_stock": 10 }
- Update a product. POST /api/product/:productId Body example: { "name": "skyhigho", "description": "LCD Screen Display with Touch Digitizer Panel and Frame", "features": [{ "feature": "model", "value": "iPhone 6s+" }, { "feature": "color", "value": "white" }], "price": [{ "level": 0, "value": 238 }, { "level": 1, "value": 132.22 }, { "level": 2, "value": 90 }], "seller": "58d44d02323e0560d103028d", "in_stock": 20 }
- Query all products. GET /api/product/ Example: /api/product?name=skyhigho
- Get the detail of a product. GET /api/product/:productId

## Cart

Note: Cart ID is stored in the req.user.cart, so caller doesn't need to set it.

- Get items in the cart. GET /api/cart
- Add a new item into the cart. POST /api/cart { "productId": \<productId\>, "qty": \<quantity\>, "price": \<price\> } 
- Update quantity of an item in the cart. PUT /api/cart { "productId": \<productId\>, "old_qty": \<OldQuantity\>, "new_qty": \<NewQuantity\>, "price": \<price\> } 
- Remove an item from the cart, the parameter of qty is for updating the stock. DELETE /api/cart { "productId": \<productId\>, "qty": \<quantity\> } 

## Order
- Create an order. POST /api/order/ Body example: {"userId": "58d44d02323e0560d103028d", "items": [{"item": "58de85232a288c09b02a3a40", "qty": 1, "price": 238}, {"item": "58de866a2a288c09b02a3a46", "qty": 1, "price": 238}], "status": "unpaid"}
- Update an order. PUT /api/order/:orderId
- Query orders. GET /api/order/
- Get order detail. GET /api/order/:orderId

## Payment (Only stripe, usd at present)
- Create payment information. POST /api/pay/customer Body: { "stripeToken": \<stripeToken\> }
- Update payment information. PUT /api/pay/customer Body: { "stripeToken": \<stripeToken\> }
- Get payment information. GET /api/pay/customer
- Charge. POST /api/pay/charge Body: { "stripeToken": \<stripeToken\>, "orderId": \<orderId\> }
Typical procedure:
1. Use Element or Checkout to let user input card information
2. Generate tokenized card information using the publishable key
3. Call Create payment API to store tokenized card information for the first time
4. Call Charge API
5. To reuse previous card, call Get payment API to get stored tokenized card information, then call Charge
