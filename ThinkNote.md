
# Backend Module Assignment 07 - E-Com
[Visit here to see the live demo](https://backendmodule6.netlify.app/)

# Table of Contents
1. Introduction
2. Installation
3. Project Structure
4. Code Overview


# Introduction :
- In this project, presented a comprehensive E-Commerce platform, showcasing the integration of backend technologies using Express.js, JWT authentication, and Bcrypt for password security. On the frontend, build admin and normal user portal using React.js with interactive and responsive user interface 

 - Backend Implementation:

The backend architecture is developed on Express.js, a lightweight and efficient web framework for Node.js. Security measures are paramount, and to ensure secure authentication, JSON Web Tokens (JWT) are implemented. Passwords are securely hashed using Bcrypt

To manage distinct user roles, such as administrators and regular users, the backend is organized into separate routes and controllers for admin and user functionalities. This design choice emphasizes the importance of role-based access control in real-world applications.

- Frontend Features:

React.js is used on the frontend to provide a dynamic and responsive user interface. The home page is designed to display products dynamically, also build Advanced features such as filtering and search functionality, offering users an intuitive and seamless product discovery experience.

Pagination is integrated to optimize the user experience when navigating through a vast product catalog. This implementation reflects an understanding of performance considerations and user-friendly design principles in a real-world application.


# 2. Installation :
- To install required dependencies use `npm install`and all dependencies will be installed automatically from the default package manager i.e. `package.json`.


# Folder Structure:
project_root
│
├── backend/
│   ├── controller/
│   │   └── admin           
│   │       └── addProductController.js
│   │   └── adminController.js
│   │   └── cartController.js
│   │   └── categoryController.js
│   │   └── filesController.js
│   │   └── myOrderController.js
│   │   └── orderController.js
│   │   └── productController.js
│   │   └── ratingController.
│   │   └── shippingController.js
│   │   └── userController.js
│   ├── helper/
│   │   └── nodeMailer.js
│   │   └── userHelper.js
│   ├── middleware/
│   │   └── userMiddleware.js
│   ├── model/
│   │   └── cartModel.js
│   │   └── categoryModel.js
│   │   └── forgotPasswordTokenModel.js
│   │   └── myOrderModel.js
│   │   └── orderModel.js
│   │   └── productModel.js
│   │   └── ratingModel.js
│   │   └── shippingAddressModel.js
│   │   └── userModel.js
│   ├──routes/      
│   │    └──admin
│   │       └── categoryRoutes.js
│   │    └── cartRoutes.js
│   │    └── filesRoutes.js
│   │    └── myOrderRoutes.js
│   │    └── orderRoutes.js
│   │    └── productRoutes.js
│   │    └── ratingRoutes.js
│   │    └── shippingRoutes.js
│   │    └── userRoutes.js
│   ├── uploadedFiles.js
│   ├── server.js
│   └── config.js
│   └── package.json
│
└── frontend
    ├── public
    │   └── index.html
    ├── src
    │   ├── admin
    │   │   └── addCategory
    │   │       └── AddCategory.css
    │   │       └── AddCategory.js
    │   │   └── addProduct
    │   │       └── AddProduct.css
    │   │       └── AddProduct.js
    │   │   └── allproduct
    │   │       └── Allproduct.css
    │   │       └── Allproduct.js
    │   │   └── component
    │   │       └── itemCard
    │   │           └── ItemCard.css
    │   │           └── ItemCard.js
    │   │       └── sidebar
    │   │           └── Sidebar.css
    │   │           └── Sidebar.js
    │   │   └── dashboard
    │   │       └── Dashboard.css
    │   │       └── Dashboard.js
    │   │   └── editAndViewProduct
    │   │       └── EditAndViewProduct.js
    │   │   └── orders
    │   │       └── Orders.js
    │   │   └── userlist
    │   │       └── Userlist.css
    │   │       └── Userlist.js
    │   ├── components
    │   │   └── file2.js
    │   ├── folder3
    │   │   └── file3.js
    │   └── folder4
    │       └── file4.js
    │   ├── app.js
    └── (other frontend files)






# Code overview:

```Frontend:```
1. App.js:

 - App.js contains the routing logics for the application
 - Initialization of Shopping Cart and User Authentication:
 - Used react-router-dom to defines the application's routing
 - Role-Based Component Rendering: 
 The Admin and User functions conditionally render components based on the user's role. The Admin function displays the admin interface if the user is an admin, while the User function renders different components based on the user's role, facilitating role-specific user experiences.

2. admin: 
 # 2.1. addCategory.js:
 - Component to add category only by admin role
 - The component manages form validation through the validated state and the Bootstrap Form component.
 - The handelCategory function handles the submission of a new category.
 - The component features a sidebar toggle functionality controlled by the toggleSideBar state.
 
 - The component adjusts its layout based on the window width, ensuring a responsive design.

 # 2.2. addProduct.js:
 - used useState hook to manage various state variables, including product details (name, description, price, color, size, image), categories, form validation, and sidebar toggle

 - The getCategories function uses Axios to fetch categories from the server and updates the categories state variable.

 - The component handles image selection using the handleFileSelect function, which updates the image state with a preview and the selected image data.

 - The handelProduct function handles the submission of product details. It validates the form, uploads the selected image, and sends a POST request to add the product with details like name, description, price, category, quantity, shipping, colors, size, and the uploaded image's filename.



