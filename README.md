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

## A seller can create a product his shop
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

## A seller can create an event his shop
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

 

