# Lisa Online eCommerce Platform
Lisa Online is a comprehensive eCommerce platform designed to empower individuals and businesses to create, manage, and grow their own online shops with ease. It provides a user-friendly and scalable environment where sellers can showcase products, manage orders, interact with customers, and handle financial transactions—all from a centralized dashboard.

The platform supports end-to-end eCommerce functionality, including seller registration, product listing, order management, payment processing, refund handling, and supplier coordination. Through a modular system architecture, Lisa Online ensures that each part of the selling and buying process—from shop creation to order fulfillment—is efficiently managed and transparently tracked.

With tools for customization, real-time analytics, and integrated logistics support, Lisa Online offers a robust solution for modern online retail, catering to startups, individual sellers, and established businesses alike.

## A Seller Creates an Online Shop Account
On the Lisa Online eCommerce Platform, any user has the ability to register and create their own online shop. This functionality is designed to be inclusive and accessible, supporting individuals, small businesses, and larger vendors alike.

When creating an online shop account, the seller is required to provide and configure the following key attributes:

- name: The name of the shop or seller's display name.

- email: A valid and unique email address for account identification and communication.

- password: A secure password to protect the seller’s account.

- phoneNumber: A contact number for verification, communication, and customer support.

- description: A brief summary that describes the shop’s offerings or brand identity.

- shopAddress: The physical or operational address of the shop.

- withdrawMethod: The preferred payment method for receiving earnings (e.g., bank transfer, mobile money).

- availableBalance: The current balance available for withdrawal in the seller’s account.

- role: The user role within the platform (typically set as "seller").

- LogoImage: A visual logo or image representing the shop’s branding.

- agree: A flag indicating the user’s agreement to the platform’s terms and conditions.

- shopProducts: A list or catalog of products currently offered for sale.

- soldProducts: A record of products that have already been purchased by customers.

- suppliers: Information about third-party suppliers linked to the shop (if applicable).

- transactions: A complete log of all financial and operational transactions tied to the shop.

These attributes serve as the foundation for establishing a fully functional seller account and enable seamless interaction with customers, inventory, and order management within the Lisa Online ecosystem.

## A Seller Creates a Category for the Shop Products
To organize and manage products efficiently, sellers on the Lisa Online eCommerce Platform can create custom product categories within their shop. Categories help improve product discoverability, enhance the shopping experience for customers, and streamline inventory management for sellers.

When creating a category, the seller must define the following attributes:

- categoryName: The name of the product category (e.g., "Electronics," "Clothing," "Home Essentials").

- categoryDescription: A brief description of the category to provide context and details about the types of products it includes.

shop: A reference to the specific shop to which the category belongs, ensuring that it is linked to the correct seller account.

Creating well-structured categories enables sellers to maintain a clear and organized storefront, making it easier for customers to browse and find products within the shop.

## A Seller Creates a Subcategory for the Shop Products
To further organize their inventory, sellers on the Lisa Online eCommerce Platform can create subcategories under existing product categories. Subcategories allow for more precise product classification, enabling customers to navigate the shop more easily and locate specific items.

When creating a subcategory, the seller must provide the following attributes:

- subcategoryName: The name of the subcategory (e.g., "Smartphones" under the "Electronics" category).

- subcategoryDescription: A brief description that explains the purpose or scope of the subcategory.

- shop: A reference to the shop that owns the subcategory, ensuring proper association with the seller’s account.

By using subcategories, sellers can maintain a detailed and hierarchical product structure, which enhances both user experience and product management within the platform.

## A Seller Creates a Supplier
Sellers on the Lisa Online eCommerce Platform can create and manage suppliers who are associated exclusively with their shop. This feature allows sellers to track and maintain relationships with vendors who provide the goods listed in their store.

Each supplier record must include the following attributes:

- supplierName: The name of the supplier or supplying company.

- supplierDescription: A short description outlining the supplier’s business or the types of products they provide.

- supplierEmail: The supplier’s official email address for communication and coordination.

- supplierPhone: A contact number for direct communication with the supplier.

- supplierAddress: The physical or mailing address of the supplier.

- country: The country where the supplier is based.

- isActive: A status flag indicating whether the supplier is currently active or inactive.

- shop: A reference to the specific shop the supplier is linked to, establishing a one-to-one relationship between the supplier and the seller’s shop.

By managing suppliers through this structured approach, sellers gain better control over their inventory sources, ensure accountability, and streamline the product sourcing workflow.

## A Seller Can Create a Brand for the Shop Products
On the Lisa Online eCommerce Platform, sellers have the ability to create and manage product brands that are uniquely associated with their shop. Brands help establish identity, improve product presentation, and provide a structured way to categorize items under recognized names or collections.

Each brand must be associated with the seller's shop and may also be linked to a specific supplier, category, and subcategory. This allows for detailed filtering and better product organization.

The following attributes are required when creating a brand:

- brandName: The name of the brand (e.g., "EcoHome," "UrbanWear").

- brandDescription: A brief description of the brand, including its identity or the types of products it represents.

- shop: A reference to the seller's shop that owns the brand.

- supplier: The supplier responsible for providing the branded products.

- category: The main product category to which the brand belongs.

- subcategory: A more specific subcategory under the main category where the brand’s products are listed.

### Seller Permissions and Dashboard Visibility
Sellers have full control over the management of their own entities within the platform. This includes the ability to create, update, and delete their own:

- Shop details

- Suppliers

- Product categories and subcategories

- Brands

- Events

The shop details dashboard is personalized and will exclusively display the seller's own products, customer reviews, and shop-related events. This ensures a secure and isolated environment for each seller to operate their business independently while maintaining clarity and focus on their own performance and assets.

## A Seller Can Create a Product for His Shop
Sellers on the Lisa Online eCommerce Platform are empowered to create and manage their own product listings. Each product is tightly linked to the seller's shop and can be associated with a specific supplier, category, subcategory, and brand to ensure structured inventory organization and ease of customer navigation.

### Product Ownership and Permissions
Only the shop owner has the authority to create, update, and delete their own products. This restriction ensures data integrity, security, and proper accountability within the platform.

### Product Relationships
Each product is related to the following entities:

- shop: The shop that owns the product.

- supplier: The vendor providing the product.

- category: The general category the product belongs to.

- subcategory: A more specific classification under the main category.

- brand: The brand under which the product is marketed or manufactured.

### Required Product Attributes
When creating a product, the seller must provide the following details:

- title: The product name or title.

- description: A detailed explanation of the product’s features, specifications, and benefits.

- shop: The owning shop reference.

- supplier: Linked supplier responsible for the product.

- category: The main classification of the product.

- subcategory: A more refined grouping within the category.

- brand: The brand associated with the product.

- tags: Keywords or labels used for search optimization and product filtering.

- status: Indicates whether the product is active, inactive, or under review.

- stock: The current inventory quantity available.

- soldOut: A boolean value indicating whether the product is sold out.

- ratings: Average customer rating score.

- reviews: Customer feedback and testimonials.

- variants: Different versions of the product (e.g., size, color, model).

This structure ensures that all products are accurately categorized, easily searchable, and presented clearly to customers, contributing to a more efficient and professional shopping experience.

## A Seller Can Create an Event for His Shop
Sellers on the Lisa Online eCommerce Platform have the ability to create, manage, and promote events for their shop. Events are designed to highlight special promotions, product launches, seasonal sales, or any other time-sensitive offers. This feature helps sellers engage customers, create urgency, and drive sales.

### Event Ownership and Permissions
Only the shop owner has the authority to create, update, and delete events for their own shop. This ensures that sellers maintain full control over their event offerings and ensures that event details remain consistent and accurate.

### Event Relationships
Each event is associated with the following entities:

- shop: The shop that is hosting the event.

- category: The product category involved in the event.

- subcategory: A more specific classification within the category that is part of the event.

- brand: The brand(s) featured in the event.

### Required Event Attributes
When creating an event, the seller must define the following attributes:

- eventName: The name or title of the event (e.g., "Summer Sale," "Black Friday Deals").

- description: A detailed explanation of the event, including the offers, products involved, and special conditions.

- shop: The reference to the shop hosting the event.

- category: The general product category associated with the event.

- subcategory: A more specific grouping of products within the category for the event.

- brand: The brand(s) involved in the event.

- startDate: The starting date and time of the event.

- endDate: The end date and time of the event.

- status: Indicates whether the event is active, upcoming, or completed.

- tags: Keywords associated with the event, often used for search optimization and marketing.

- originalPrice: The regular price of the products involved in the event, before any discounts.

- discountPrice: The discounted price for the event.

- stock: The available inventory for the products involved in the event.

- images: Visuals or promotional images for the event to enhance visibility and appeal.

- soldOut: A boolean value indicating whether the event's products are sold out.

Creating an event with these attributes helps the seller effectively communicate promotions to customers and ensure that relevant product details, offers, and timelines are well defined and easily accessible.

## Shop Relationship
A shop on the Lisa Online eCommerce Platform has various relationships with other entities that contribute to its structure, management, and product offerings. These relationships help ensure seamless organization and functioning of the shop's operations.

The shop has the following relationships:

- Categories: The shop can have multiple product categories associated with it. When a category is deleted, it must also be removed from the shop.

- Subcategories: Subcategories are further divisions within categories that help organize products in more specific ways. Deleting a subcategory will also remove it from the shop.

- Brands: Each product in the shop may be associated with a specific brand. If a brand is deleted, it must also be removed from the shop's records.

- Shop Products: These are the individual items listed for sale within the shop. Deleting a product will result in its removal from the shop's inventory.

- Sold Products: Products that have already been sold also fall under the shop’s management. If a product record is deleted, it is also removed from the sold products list.

- Suppliers: Suppliers provide products to the shop. If a supplier is deleted, the associated products must also be removed from the shop’s inventory.

- Orders: The shop is directly linked to customer orders. If an order is deleted, it is also removed from the shop’s order history.

### Deletion Process
When any of the above items (categories, subcategories, brands, products, suppliers, or orders) are deleted, the deletion must be propagated throughout the shop’s system. This ensures that all references to deleted items are removed from the shop’s records, maintaining data integrity and preventing broken references or inconsistencies in the shop's inventory, product listings, and order history.

## User Relationship
A user on the Lisa Online eCommerce Platform has specific relationships with various entities that are directly linked to their account activity, including orders and comments. These relationships ensure the user’s activities are tracked and properly managed.

The user has the following relationships:

- My Orders: Every user can place orders, which are recorded under their account. The user’s order history is tracked and managed within the system.

- Comments: Users can leave comments and reviews for products they purchase or interact with. These comments are stored and associated with the user’s profile.

### Deletion Process
When an order or comment is deleted, it must also be removed from the user’s collection to ensure consistency. Specifically:

- My Orders: If an order is deleted, the record must be removed from the user’s order history to maintain an accurate account of their purchases.

- Comments: If a comment is deleted, it must also be removed from the user’s profile to ensure there are no orphaned records or inconsistencies in the user’s activity log.

This approach maintains data integrity and ensures that the user’s account reflects their actual interactions with the platform at all times.

## Product Variant and Review
Managing product variants and reviews is essential for ensuring accurate product listings and up-to-date customer feedback on the Lisa Online eCommerce Platform. Variants such as color, size, and stock availability need to be properly updated to reflect any changes. Similarly, product reviews play a critical role in customer trust, and removing or updating reviews needs to be handled efficiently.

### Product Variant Updates
When a product variant is updated (such as productColor, productImage, or ProductSizes):
Any changes to a product’s variants, such as a new color, updated image, or modifications to available sizes, must automatically reflect in the product’s main details. This ensures that the product listing stays current and customers can view the most accurate and updated information.

When a product variant’s size or stock is updated:
- If the ProductSizes or stock levels are updated, the product’s overall details, including inventory and availability status, must be updated as well. This ensures that the product’s listing reflects the available variants, preventing potential overselling or mismatched information.

When a product variant is deleted:
- If a product variant (such as a color option or a specific size) is deleted, the product record must also be updated to remove the deleted variant. This avoids having inactive or non-existent options listed under the product.

When a product variant’s ProductSizes are deleted:
- If the ProductSizes for a specific variant are deleted, the overall product must be updated to reflect this change. This ensures that the product’s available size options are accurate and that customers can no longer select deleted sizes.

### Product Review Deletion
When a product review is deleted:
If a product review is removed, the product record must be updated to ensure the review count and ratings are accurately reflected. This helps maintain the integrity of the product’s review system and ensures that only valid, active reviews contribute to the product's overall rating.

By maintaining these update and deletion processes, the system ensures that both product listings and customer feedback remain consistent, accurate, and up-to-date, providing a reliable shopping experience for users.

## Single Shop Detail Information
The Single Shop Detail Information page is designed to display comprehensive details about a specific shop on the Lisa Online eCommerce Platform. This page provides an overview of the shop, including its basic information, bio, product offerings, and more. The page is made up of a main component, ShopHomePage.jsx, along with two subcomponents, ShopInfo.jsx and ShopBiodata.jsx.

### ShopHomePage.jsx
This is the main page responsible for rendering the details of the shop. It serves as the container for all shop-related information and includes the following:

Integration of ShopInfo.jsx and ShopBiodata.jsx components.

Display of shop's products, reviews, ratings, events, and other essential details.

Navigation to other sections of the shop’s profile, such as product listings, event pages, or customer interactions.

#### ShopInfo.jsx
The ShopInfo.jsx component focuses on presenting the core details of the shop. This includes:

- Shop Name: The name of the shop as provided by the shop owner.

- Shop Logo: The visual representation of the shop.

- Shop Description: A brief description about the shop and its offerings.

- Shop Address: Physical or delivery address for the shop.

- Available Balance: The current financial balance in the shop account (for transactions).

- Shop’s Available Products: Key statistics on available products in the shop.

#### ShopBiodata.jsx
The ShopBiodata.jsx component displays additional biodata information related to the shop, including:

- Owner Information: Details about the shop owner, such as their name and contact information.

- Suppliers: A list of suppliers the shop is partnered with.

- Shop’s Events: Any ongoing or upcoming events related to the shop (e.g., sales, promotions).

- Shop Rating and Reviews: Displays the overall rating and any customer feedback provided for the shop.

- Social Links: Links to any social media profiles or additional platforms where the shop is active.

### Overall Structure
This structure ensures that shop information is presented in a clear and organized manner, allowing customers to view relevant details about the shop, its products, and its owner. The use of separate components like ShopInfo.jsx and ShopBiodata.jsx helps modularize the code, improving maintainability and reusability.

## Shop Dashboard
The Shop Dashboard is the central hub for sellers on the Lisa Online eCommerce Platform. It provides shop owners with a comprehensive view of their business, allowing them to manage and monitor different aspects of their shop’s operations. The dashboard includes a variety of components that help the seller stay informed and in control of their shop.

### Shop Dashboard Components
Shop Overview:
The overview section provides high-level information about the shop, such as the shop name, total sales, number of products, and customer ratings. It gives a quick snapshot of the shop’s performance and activity.

Categories:
This component allows the seller to view and manage product categories. Categories help organize products into groups for better navigation and searchability.

Brands:
Sellers can manage the brands associated with their products. This section allows the creation, editing, and removal of brands within the shop.

New Product:
The seller can add a new product to their shop through this section. It provides a form or interface to input product details such as title, description, images, price, variants, and stock availability.

All Products:
This section displays a list of all the products available in the shop, allowing the seller to view, update, or delete products. It provides easy access to product management.

New Event:
This component allows the shop owner to create new events, such as sales, promotions, or special offers, to engage customers and boost sales.

All Events:
This section lists all the ongoing and past events related to the shop. The shop owner can view, update, or delete events here.

Discount Codes:
The seller can manage and create discount codes for promotions or sales. These codes can be applied to products or events, offering customers a discount on their purchases.

All Orders:
This section provides an overview of all customer orders made in the shop. The seller can manage, process, or update the status of these orders, such as marking them as shipped or delivered.

Withdraw Money:
Sellers can manage their financial transactions, including withdrawing earnings from their shop’s available balance. This section allows them to request or track payouts.

Shop Inbox:
The inbox serves as the communication center for the seller. It allows them to receive and respond to messages from customers, potential suppliers, and the platform's support team.

Refunds:
This section tracks any refund requests made by customers. The seller can manage refund statuses and process refunds according to the platform's policies.

Suppliers:
Sellers can manage their suppliers here. This section lists all the suppliers providing products to the shop, allowing the seller to add, update, or remove supplier information.

Update Shop:
Sellers can update their shop details, such as the name, description, address, and other essential information. This section helps maintain an up-to-date profile for the shop.

Shop Profile:
This section allows the seller to manage their shop profile, including the profile image, logo, shop description, and contact information.

Log Out:
The log-out option allows the seller to securely log out of the shop dashboard when they are finished managing their store.

### Summary
The Shop Dashboard is designed to give sellers a comprehensive view of their business operations. With easy access to all the critical functions like managing products, events, orders, and financial transactions, the dashboard ensures sellers have all the tools they need to run their online shop efficiently and effectively.

# Order Management
Order management encompasses the complete lifecycle of handling customer orders, from initial placement to final resolution. This process includes key stages such as order entry, packaging, and processing, followed by shipment and delivery. It also covers scenarios where orders may be cancelled or where post-delivery actions are required, such as refund requests. The refund process involves several steps, including “Refund Requested,” “Awaiting Item Return,” “Returned,” “Refund Processing,” and potential outcomes such as “Refund Accepted,” “Refund Rejected,” or “Refunded.” A robust order management system ensures each of these stages is efficiently managed, providing accuracy, transparency, and a seamless experience for both the business and its customers.

## Processing
At the processing stage, the shipping company is notified, and the order status is updated to "Processing." This stage is essential in the order fulfillment workflow, as it marks the transition from order confirmation to preparation for shipment. 

It serves as a prerequisite for subsequent actions in the order lifecycle. Specifically, statuses such as "Shipped", "Delivered", "Refund Requested", "Returned Items", "Refund Processing", and "Refunded" must not be triggered or executed before the order has been marked as "Processing." Ensuring this sequence maintains the integrity and accuracy of the order management process.

Furthermore, once an order reaches the "Processing" stage, reverting to any earlier statuses such as "Pending," is strictly prohibited. This rule preserves the consistency, traceability, and legal integrity of the order history.

## Shipped
At the "Shipped" stage, the shipping company is provided with the customer's delivery address along with all necessary shipment details. This marks the point at which the physical handling and transportation of the order begins. Once this handoff occurs, the system updates the order status to "Shipped," indicating that the item is officially in transit.

This stage serves as a critical checkpoint in the order management lifecycle. It ensures that the product is en route and allows both the business and the customer to track the shipment. Importantly, no further status transitions such as "Delivered," "Refund Requested," "Returned Items," "Refund Processing," or "Refunded" should occur prior to the completion of the "Shipped" stage. This sequence preserves the integrity and traceability of the entire order process.

Furthermore, once an order reaches the "Shipped" stage, reverting to any earlier statuses such as "Pending," or "Processing," is strictly prohibited. This rule preserves the consistency, traceability, and legal integrity of the order history.

All operations related to shipping are handled through the Shipping Model. This model is responsible for managing carrier integration, tracking information, and ensuring timely updates. By centralizing these tasks, the Shipping Model plays a vital role in ensuring consistency, accuracy, and a seamless customer experience.

## Delivered
At the "Delivered" stage, the shipping company successfully delivers the order to the customer. Once delivery is confirmed, the order status is updated to "Delivered," signaling the completion of the physical fulfillment process. This milestone marks the point at which the customer receives the product and is essential for enabling any post-delivery actions.

It is important to enforce the correct sequence of order status updates. Specifically, actions such as "Refund Requested," "Returned Items," "Refund Processing," and "Refunded" must not be initiated until the order has been marked as "Delivered." This ensures that any refund or return processes are only considered once the customer has officially received the item.

Furthermore, once an order reaches the "Delivered" stage, reverting to any earlier statuses such as "Pending," "Processing," or "Shipped," is strictly prohibited. This rule preserves the consistency, traceability, and legal integrity of the order history.

All tasks related to the delivery status and its dependencies are managed through the Transaction Model. This model is responsible for handling financial transactions, tracking delivery confirmations, and supporting the flow of post-delivery operations, ensuring accuracy and accountability throughout the process.

## Cancelled
The "Cancelled" status applies when a customer chooses to cancel an order that is still in the early stages of processing. Specifically, cancellation is permitted only if the order status is "Pending," "Processing," "Shipped," or "Delivered." This allows customers to halt the fulfillment process before the order progresses too far.

However, once an order has entered the refund process—i.e., if the status is "Refund Requested," "Returned Items," "Refund Processing," or "Refunded"—cancellation is strictly prohibited. This restriction ensures legal and procedural integrity, as the order has already moved into post-delivery financial and logistical workflows that cannot be reversed.

All cancellation-related operations are managed using the Order Cancellation Model. This model handles customer cancellation requests, validates the current order status, and ensures that cancellations are executed only when the request complies with the defined conditions.

## Refund Requested
At the "Refund Requested" stage, the customer initiates a request to return the order and receive a refund, typically due to issues such as product defects, incorrect items, or dissatisfaction. Once the request is submitted, the order status is updated to "Refund Requested," indicating that the return and refund process has officially begun.

This stage is dependent on prior completion of key steps in the order lifecycle. Specifically, statuses such as "Returned Items," "Refund Processing," and "Refunded" must not proceed until the order has reached at least the "Processing" stage. Enforcing this sequence ensures that refund-related actions are only considered for valid, fully processed orders.

Furthermore, once an order reaches the "Refund Requested" stage, reverting to any earlier statuses such as "Pending," "Processing," "Shipped," or "Delivered," is strictly prohibited. This rule preserves the consistency, traceability, and legal integrity of the order history.

All tasks associated with handling refund requests are managed through the RefundRequested Model. This model facilitates the evaluation of refund eligibility, logging of customer reasons, and coordination of the subsequent return and refund procedures, maintaining transparency and control throughout the process.

## Returned Items
At the "Returned Items" stage, the customer sends back the product(s) for which a refund has been requested. This step confirms that the physical items are in the process of being returned to the seller. Once the return is initiated, the system updates the order status to "Returned Items," signifying that the return action is underway.

To maintain a valid and logical workflow, certain conditions must be met before advancing to the next stages. Specifically, "Refund Processing" and "Refunded" statuses must not be executed until the order has passed the "Processing" stage. This ensures that returns and refunds are handled only for orders that were properly processed and delivered.

Furthermore, once an order reaches the "Returned Items" stage, reverting to any earlier statuses such as "Pending," "Processing," "Shipped," "Delivered," or "Refund Requested," is strictly prohibited. This rule preserves the consistency, traceability, and legal integrity of the order history.

All operations associated with returned items are managed using the ReturnedItem Model. This model is responsible for tracking return shipments, validating the condition of returned goods, and initiating the next steps in the refund workflow, ensuring that returns are processed systematically and efficiently.

## Refund Processing
At the "Refund Processing" stage, the seller initiates a request to the financial institution to issue a refund to the customer who has both requested a refund and returned the relevant product(s). Once this request is made, the order status is updated to "Refund Processing," indicating that the refund is actively being reviewed or processed by the payment provider.

This stage plays a pivotal role in the refund lifecycle and must follow the correct sequence. Specifically, the "Refunded" status must not be triggered until the "Refund Processing" stage is completed. This ensures that the system accurately reflects the refund’s progression and prevents premature financial reconciliation.

Furthermore, once an order reaches the "Refund Processing" stage, reverting to any earlier statuses such as "Pending," "Processing," "Shipped," "Delivered," "Refund Requested," or "Returned Items" is strictly prohibited. This rule preserves the consistency, traceability, and legal integrity of the order history.

All tasks related to this stage are handled through the Withdrawal Model. This model oversees the communication with payment gateways, verifies transaction details, and monitors the status of refund approvals, ensuring a secure and transparent refund process for both the seller and the customer.

## Refunded
At the "Refunded" stage, the financial institution confirms to the seller that the refund has been successfully completed and the amount has been returned to the customer who initially ordered the product. Once this confirmation is received, the order status is updated to "Refunded," marking the final step in the refund process.

This stage represents the closure of the refund lifecycle and must maintain strict sequence integrity. Once an order reaches the "Refunded" status, reverting to any previous statuses such as "Pending," "Processing," "Shipped," "Delivered," "Refund Requested," "Returned Items," or "Refund Processing" is strictly prohibited. This ensures the order history remains consistent and legally accurate.

All tasks associated with confirming and recording the refund completion are managed through the Transaction Model. This model handles the final settlement records, updates the order status in the system, and provides audit trails for compliance and financial reporting.
