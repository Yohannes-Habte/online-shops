# Online Shops

The processes that have to be followed to create an online shop are as follows:

## A seller creates an Online Shop account

Any user can create a shop.
To create an account, you need to consider the following attributes:
name
email
password
phoneNumber
description
shopAddress
withdrawMethod
availableBalance
role
LogoImage
agree
shopProducts
soldProducts
suppliers
transactions

## A seller creates a Category for the shop products

Consider the following attributes:
categoryName
categoryDescription
shop

## A seller creates a Subcategory for the shop products

Consider the following attributes:
categoryName
categoryDescription
shop

## A seller creates an a Supplier

The supplier have relationship with the shop only
Consider the following attributes:
supplierName
supplierDescription
supplierEmail
supplierPhone
supplierAddress
country
isActive
shop

## A seller can create a brand for the shop products

The brand have relationship with the shop, supplier, category and subcategory.
The seller has a mandate to create, delete and update his own shop, suppliers, categories, subcategories and events.
The shop details dashboard will show only the seller products, review and events.
Consider the following attributes:
brandName
brandDescription
shop
supplier
category
subcategory

## A seller can create a product for his shop

The shop owner has the mandate to create, update and delete his own products only
The product has relationship with the shop, supplier, category, subcategory and brand
Consider the following attributes:
title
description
shop
supplier
category
subcategory
brand
tags
status
stock
soldOut
ratings
reviews
variants

## A seller can create an event for his shop

The shop owner has the mandate to create, update and delete his own events only
The event has relationship with the shop, category, subcategory and brand.
Consider the following attributes:
eventName
description
shop
category
subcategory
brand
startDate
endDate
status
tags
originalPrice
discountPrice
stock
images
soldOut

### Shop Relationship

The shop has the following relationships with:

1. categories
2. subCategories
3. brands
4. shopProducts
5. soldProducts
6. suppliers
7. orders
   When one of the above items will be deleted, it has to be deleted from shop as well

### User Relationship

The user has the following relationships with:

1. myOrders
2. comments

When an order or a comment will be deleted, it has to be deleted user collection as well

### Product Variant and Review

1. When a product variant, such as productColor, productImage and ProductSizes are updated, it has to update the product
2. When a product variant, such as ProductSizes' size or/and stock are updated, it has to update the product
3. When a product variant will be deleted, it has to update the product
4. When a product variant's productSizes will be deleted, it has to update the product
5. When a product review will be deleted, it has to update the product

## Single Shop Detail information

It has one page (ShopHomePage.jsx) and two components, such as ShopInfo.jsx and ShopBiodata.jsx.

## Shop Dashboard

Shop dashboard has a lot of information, such as shop name, and other component as follows:
Shop Overview
Categories
Brands
New Product
All Products
New Event
All Events
Discount Codes
All Orders
Withdraw Money
Shop Inbox
Refunds
Suppliers
Update Shop
Shop Profile
Log Out

## Create New Transaction

1. Validate the various Ids and then apply session for the transaction. A session is required for transactions in MongoDB because it's the mechanism that groups multiple operations into a single, atomic unit of work—meaning either all operations succeed, or none do.

2. Make sure the transaction does not exist in the database. If it exists, the error message will be "Transaction with this ID already exists".

3. Create transaction object and a new Mongoose model instance called newTransaction using the Transaction model and populating it with data from transactionObject. 

4. Find the order using the order id from the frontend

5. If the transactionType is "Payout" and an order exists, then update the order's transaction field with the ID of the new transaction, and save the order within the current session (to maintain atomicity).
