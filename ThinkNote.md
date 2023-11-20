# Backend Module Assignment 07 - E-Com

- please also see the live version
- [Visit here to see the live demo](https://backendmodule6.netlify.app/)
- To test paypal payment use this credential to make payment
- [paypal email](sb-pzerl26650718@personal.example.com)
- [paypal password](84a2M.a>)

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
│ ├── controller/
│ │ └── admin  
│ │ └── addProductController.js
│ │ └── adminController.js
│ │ └── cartController.js
│ │ └── categoryController.js
│ │ └── filesController.js
│ │ └── myOrderController.js
│ │ └── orderController.js
│ │ └── productController.js
│ │ └── ratingController.
│ │ └── shippingController.js
│ │ └── userController.js
│ ├── helper/
│ │ └── nodeMailer.js
│ │ └── userHelper.js
│ ├── middleware/
│ │ └── userMiddleware.js
│ ├── model/
│ │ └── cartModel.js
│ │ └── categoryModel.js
│ │ └── forgotPasswordTokenModel.js
│ │ └── myOrderModel.js
│ │ └── orderModel.js
│ │ └── productModel.js
│ │ └── ratingModel.js
│ │ └── shippingAddressModel.js
│ │ └── userModel.js
│ ├──routes/  
│ │ └──admin
│ │ └── categoryRoutes.js
│ │ └── cartRoutes.js
│ │ └── filesRoutes.js
│ │ └── myOrderRoutes.js
│ │ └── orderRoutes.js
│ │ └── productRoutes.js
│ │ └── ratingRoutes.js
│ │ └── shippingRoutes.js
│ │ └── userRoutes.js
│ ├── uploadedFiles.js
│ ├── server.js
│ └── config.js
│ └── package.json
│
└── frontend
├── public
│ └── index.html
├── src
│ ├── admin
│ │ └── addCategory
│ │ └── AddCategory.css
│ │ └── AddCategory.js
│ │ └── addProduct
│ │ └── AddProduct.css
│ │ └── AddProduct.js
│ │ └── allproduct
│ │ └── Allproduct.css
│ │ └── Allproduct.js
│ │ └── component
│ │ └── itemCard
│ │ └── ItemCard.css
│ │ └── ItemCard.js
│ │ └── sidebar
│ │ └── Sidebar.css
│ │ └── Sidebar.js
│ │ └── dashboard
│ │ └── Dashboard.css
│ │ └── Dashboard.js
│ │ └── editAndViewProduct
│ │ └── EditAndViewProduct.js
│ │ └── orders
│ │ └── Orders.js
│ │ └── userlist
│ │ └── Userlist.css
│ │ └── Userlist.js
│ ├── components
│ │ └── file2.js
│ ├── folder3
│ │ └── file3.js
│ └── folder4
│ └── file4.js
│ ├── app.js
└── (other frontend files)

# Code overview:

`Frontend:`

# 1. App.js:

- App.js contains the routing logics for the application
- Initialization of Shopping Cart and User Authentication:
- Used react-router-dom to defines the application's routing
- Role-Based Component Rendering:
  The Admin and User functions conditionally render components based on the user's role. The Admin function displays the admin interface if the user is an admin, while the User function renders different components based on the user's role, facilitating role-specific user experiences.

# 2. admin: (from 2.1 to 2.9)

# 2.1. SddCategory.js:

- Component to add category only by admin role
- The component manages form validation through the validated state and the Bootstrap Form component.
- The handelCategory function handles the submission of a new category.
- The component features a sidebar toggle functionality controlled by the toggleSideBar state.

- The component adjusts its layout based on the window width, ensuring a responsive design.

# 2.2. AddProduct.js:

- used useState hook to manage various state variables, including product details (name, description, price, color, size, image), categories, form validation, and sidebar toggle

- The getCategories function uses Axios to fetch categories from the server and updates the categories state variable.

- The component handles image selection using the handleFileSelect function, which updates the image state with a preview and the selected image data.

- The handelProduct function handles the submission of product details. It validates the form, uploads the selected image, and sends a POST request to add the product with details like name, description, price, category, quantity, shipping, colors, size, and the uploaded image's filename.

# 2.3. AllProduct.js:

- This component has all the product uploaded by admin
- Provides buttons for viewing product details and deleting products, triggering corresponding functions (productDetails and deleteProduct).
- Implements pagination with next and previous buttons, allowing users to navigate through the product list.

# 2.4. Dashboard.js:

- The component utilizes the useState hook to manage local state variables, including toggleSideBar, totalUsers, newOrders, and shippedOrders.
- Asynchronous functions (getTotalUsers, getNewOrders, getShippedOrders) use the axios library to fetch data from the server.
- The main content area includes a heading, item cards displaying total users, new orders, and shipped orders.
- The component uses conditional rendering

# 2.5. ItemCard.js:

- Component to display dashboard data

# 2.6. Sidebar.js:

- Component to display side navigation

# 2.7. EditAndViewProduct.js:

- This component appears to be responsible for editing and viewing product
- State variables are used to manage the component's internal state. For example, isEditing and isImageEditing toggle between editing modes for product details and the product image, respectively.
- The component makes asynchronous requests using the Axios library to fetch and update product details
- getProduct, handleSave, and handleImageSave that handle fetching product details and saving edited details and images.
- The component provides a user interface for editing and viewing product details. It includes form inputs for various product attributes such as name, description, price, and more. Users can edit these details, toggle between editing modes, and upload a new product image
- The component conditionally renders different elements based on the editing modes
- when editing the image, it displays an input for selecting a file and a button to save the image

# 2.8. Orders.js :

- Orders component responsible for displaying and managing orders
- State variables like toggleSideBar, orders, totalPages, and page are used to manage the component's internal state, including order data, pagination, and sidebar visibility.
- The component makes asynchronous requests using the Axios library to fetch and update order-related information. Functions like getOrders, getSearchedOrders, and handelNewStatus handle different aspects of order management.
- It provides options to change the order status through a dropdown and handles sidebar toggling.
- The component includes pagination functionality

# 2.9. UserList.js:

- The component uses the useState hook to manage local state
- Two main functions, getAllUsers and getSearchedUser fetch all users and searched users based on the current page and search query.
- The deleteUser function handles the deletion of a user by making a DELETE request to the server with the user's ID
- The handelSideBar function toggles the visibility of the sidebar by updating the toggleSideBar state when a button is clicked.
- The component manages page navigation through the handlePageChange

# 3. components/ (from 3.1 to 3.9 )

# 3.1 Carousel.js:

- Dynamic Cards Per Slide:
  The cardsPerSlide state is updated based on the props.cardsPerSlide prop, allowing dynamic adjustment of the number of cards displayed per slide.

- Products are grouped into chunks: based on the specified number of cards per slide to ensure proper rendering in the carousel.

- Carousel Navigation:
  Navigation controls (Previous and Next buttons) are provided for the carousel to manually navigate between slides.

# 3.2. Filter.js:

- Dynamic Checkbox Handling:
  The handelCheck function dynamically manages the state of checkboxes, allowing users to select or deselect categories.
- Price Range Handling:
  The handelPrice function manages the selected price range when users choose a specific radio button option.

- Category and Price Filter Application:
  The filter function triggers the filter application by invoking the parent component's onClick callback, passing the selected categories and price range.

- Filter Reset:
  The reset function triggers the filter reset by invoking the parent component's reset callback.

- Fetch Categories on Component Mount:
  The useEffect hook fetches all categories from the server when the component mounts, populating the category list dynamically.

# 3.3. Input.js:

- Dynamic Input Handling:
  The Input component dynamically handles various input types, such as text, password, checkbox, and textarea.
- Input Value Change Handling:

The handelChange function determines the input type and triggers the onChange callback with the updated input value.

- Checkbox Specific Logic:
  For checkboxes, the component captures the checked status and passes it to the onChange callback.
- Label Rendering:
  If a label is provided (label prop), it renders a label element for better form accessibility.
- Conditional Rendering for Textarea:
  For textarea inputs, it renders a textarea element instead of a regular input, allowing for multiline text input.

# 3.4. Select.js :

- Dropdown Select Handling:
  The Select component facilitates dropdown selection and dynamically handles changes in the selected value.

- Option Mapping:
  It maps through the provided options array to generate the dropdown options based on the array elements.

- Select Change Handling:
  The handelChange function captures the selected value and triggers the onChange callback with the updated value.

- Label Rendering:
  If a label is provided (label prop), it renders a label element for better form accessibility.

- Default Disabled Option:
  The component includes a default disabled option prompting the user to select a value, enhancing user experience and indicating the purpose of the dropdown.

# 3.5. Header.js :

- Search Functionality:
  The Header component has search bar allowing users to input search queries.

- Category Dropdown:
  Displays a dropdown menu of categories retrieved from the server.

- Logout Handling:
  Provides a logout button that removes user information, triggers the login fail action, and redirects to the login page.

- Conditional Navigation Links:
  Adjusts navigation links based on user roles (admin or regular user) and authentication status.

# 3.6. Loader.js :

- Redirection:
  The Loder component includes a countdown that decrements every second. When the countdown reaches zero, it triggers a redirection to the login page.

- Spinner Animation:
  Utilizes the Bootstrap Spinner component to display a loading spinner during the countdown.

- Navigation and Location:
  Uses the useNavigate hook for programmatic navigation and useLocation hook to access the current location.

- Conditional UI Rendering:
  The countdown message is conditionally displayed based on the redirect prop.

- Interval Cleanup:
  Clears the interval when the component is unmounted to prevent memory leaks.

# 3.7. Message.js :

- SweetAlert2 Integration:
  Utilizes the Swal.fire function from the SweetAlert2 library to display toast notifications.

- Toast Configuration:
  Configures the appearance and behavior of the toast notification based on the type and message props.

- Conditional Icon and Content:
  Conditionally sets the icon and content of the toast notification based on the type prop ('success' or 'error').

-Automatic Dismissal:
The toast notification is configured to automatically dismiss after 2000 milliseconds (2 seconds).

- Positioning and Styling:
  Sets the position of the toast notification to "top-end" and includes a progress bar for the timer.

# 3.8. Products.js

- Product Display:
  Renders product information, including image, name, price, short description, and average rating.

- Dynamic Image Source:
  Conditionally sets the image source based on whether the product has an image or not.

- Link to Product Details:
  Wraps the product information in a link to navigate to the detailed product page.

- Limited description:
  Limits the display of product name and description to a certain number of words for a concise presentation.

# 3.9. Rating.js

- Component Structure:
  Defines a Rating component to display and interact with product ratings.

- State Management:
  Manages state for user interaction (giveStar, givenStar) and locations of full and half stars (fullStarLocation, halfStarLocation).

- Rendering Stars:
  Dynamically renders stars based on the total rating, with special handling for giving stars.

- User Interaction:
  Allows users to give stars when giveStar is true, updating the state and triggering the onClick callback.

# 4. context/ cartContext.js

- Context and Reducer Setup:
  The code sets up a React context (CartContext) and initializes the state using useReducer.

- Initial State and Actions:
  The initialState object defines the initial structure of the cart state, including cart items, user information, authentication token, shipping address, and a search query.
  The cartReducer function handles various actions, such as user authentication, cart operations (add, remove, update quantities), clearing the cart, setting the shipping address, and updating the search query.
- The useCart hook is defined to easily access the cart context

# 5 cartContextProvider.js:

- The useReducer hook is used to initialize the cart state and dispatch function. It uses the cartReducer function and the initialState from the cartContext
- The CartContextProvider component is created to wrap its children with the CartContext.Provider. This provider ensures that any component nested within it can access the cart state and dispatch function.
- The value prop of the CartContext.Provider is set to an object containing cartState and cartDispatch. This object is then made available to the components consuming the CartContext, allowing them to interact with the cart state and dispatch actions.

# 6 pages/ (from 4.1 to 4.11)

# 6.1 Login.js :

- Component Structure:
  Defines a Login component to handle user login and password recovery.
- State Management:
  Manages state for email, password, loading state, password visibility, and password recovery.

- User Authentication:
  Handles user login through API calls and updates context on successful login.

- Password Visibility:
  Allows users to toggle password visibility.

- Forgot Password:
  Functionality for requesting a password recovery link.

- Form Rendering:
  Renders the appropriate form based on the isForgotPassword state.

- Social Login Buttons: ** Only for design not functional **
  Provides buttons for Google and Facebook login.

- Signup Link:
  Includes a link to the signup page for users without an account.

# 6.2 Signup.js:

- Component Structure:
  Defines a Signup component to handle user registration.

- State Management:
  Manages state for user details and loading state during signup.

- User Registration:
  Handles user registration through API calls and updates context on successful signup.

- Form Rendering:
  Renders the signup form with input fields for name, email, phone, password, and password
  confirmation.
- Social Signup Buttons: ** Only for design purposes not functional **
  Provides buttons for Google and Facebook signup.

# 6.3 Home.js:

- Component Structure:
  . Component for displaying and filtering products
  . Product carousel, and home banner with slogan and logo
- State Management:
  Manages state variables for product data, category and price filters, pagination, and source of products.
- API Requests:
  Utilizes Axios to make API requests for getting all products, filtered products, and search results.
- Filter Handling:
  Implements functions for handling category and price filters, as well as resetting filters.
- Pagination:
  Implements pagination with page change and next/previous functionality.

# 6.4 HomeCover.js:

- Component Purpose:
  Defines a HomeCover component for displaying a banner with a logo and text.

- Image Import:
  Imports an image file named "logo1.png" from the "./images" directory using the import statement.
- Logo Display:
  Displays the logo image (logo) within an img element.
- Banner Text:
  Includes a banner text (Ultimate T-shirt destination at T-Corner) in a p element.

# 6.5. ProductDetails.js :

- Component Purpose:
  Defines a ProductDetails component for displaying detailed information about a product.
- Context Usage:
  Utilizes the cartContext to manage the state of the shopping cart.
- API Requests:
  Makes API requests using the axios library to fetch and update product details and quantities.
- User Interaction:
  Provides buttons for adding items to the cart and purchasing.
- Location Check:
  Allows users to check if delivery is available at their location based on a provided PIN code.

# 6.6. Cart.js :

- Component Purpose:
  Defines a Cart component for displaying and managing the user's shopping cart.
- State Management:
  Manages state variables using the useState hook for price, estimated price, shipping cost, and loader.
- Context Usage:
  Utilizes the useCart context for managing the shopping cart state.
- Data Fetching:
  Fetches available product quantity using the axios library.
- Functions:
  Defines functions for deleting a cart item, updating item quantity, and fetching available product quantity.
- Dynamic Rendering:
  Dynamically renders cart items, allows users to update item quantity, and displays cart summary.

# 6.7. CheckOut.js :

- Component Purpose:
  Defines a CheckOut component for managing the user's checkout process.

- State Management:
  Utilizes useState hook to manage state variables for user's saved addresses, shipping address, selected address, address form visibility, user ID, form fields, current step, payment method, total price, and shipping charge.

- Context Usage:
  Relies on the useCart context for accessing and managing the shopping cart state.

- Functions:
  Includes functions for handling changes in form input, fetching user addresses, submitting the address form, handling selected shipping address, toggling the address form visibility, and reviewing the order.

- Dynamic Rendering:
  Dynamically renders different steps of the checkout process based on the currentStep state variable.

# 6.8. ReviewOrder.js :

- Component Purpose:
  Defines a ReviewOrder component for reviewing shipping and payment details before placing an order.
- State Management:
  Utilizes useCart context for accessing and managing the shopping cart state.
- API Requests:
  Makes API requests to check product quantities, place orders, and capture PayPal payments.
- Dynamic Rendering:
  Dynamically renders shipping and payment details, as well as cart items based on the context state.
- PayPal Integration:
  Utilizes the PayPalScriptProvider and PayPalButtons components for PayPal payment integration, handling order creation and approval.

# 6.9. MyOrder.js :

- Component Purpose:
  Defines a MyOrders component for displaying user's order history.
- State Management:
  Utilizes useState hook to manage the state variable for user's orders.
- Context Usage:
  Relies on the useCart context for accessing and managing the shopping cart state.
- Functions:
  Includes functions for fetching user's order history and handling user's product rating.
- Dynamic Rendering:
  Maps through the user's orders to dynamically render order details and product information.

# 6.10. OrderDetails.js:

- Component Purpose:
  Defines an OrderDetails component for displaying details of a specific order.
- State Management:
  Utilizes useState hook to manage the state variable for order details.
- Context Usage:
  Relies on the useCart context for accessing and managing the shopping cart state.
- Functions:
  Includes a function for fetching details of a specific order.
- Dynamic Rendering:
  Dynamically renders order items and their details based on the fetched data.

# 6.11. Profile.js :

- Component Purpose:
  The Profile component is designed for displaying and editing user profiles. It includes sections for basic user information, profile picture, and saved shipping addresses.
- State Management:
  Utilizes useState hooks to manage state variables such as user data, profile image, editing mode, and shipping addresses.
- Profile Editing:
  Implements the ability to edit user information, including name, email, and phone, with a toggle button for enabling/disabling editing mode.
- Profile Image Handling:
  Allows users to upload and preview profile images. Uses the `BsCamera` icon to trigger the file input for image selection and a "Save" button for image upload.
- Shipping Addresses:
  Retrieves and displays user shipping addresses. Enables editing of each address with a modal, and updates the address details upon user confirmation. Also includes an option to set an address as the primary address.
  Utilizes a modal for editing address details, with form fields for first name, last name, address, city, state, pin code, phone, landmark, and a checkbox for setting the address as the primary one.

- Sidebar Toggle (for Admins):
  If the user is an admin, a sidebar toggle button is provided for responsive design.

- API Requests:
  Utilizes Axios for making asynchronous requests to the server for updating user information, uploading profile images, and managing shipping addresses.

# 6.12. ResetPassword.js :

- Component Purpose:
  Defines a ResetPassword component for handling the password reset process.
- State Management:
  Uses useState to manage the state of email, password, loading indicator, and password visibility.
- API Request:
  Makes an API request to reset the user password when the form is submitted.
- Loader Display:
  Displays a loading spinner while processing the password reset request.
- Password Visibility Toggle:
  Implements a password visibility toggle button using the Eye and EyeSlash icons from React Icons.

`Backend:`

# 1. server.js:

- Import Modules:
  Import necessary modules such as Express, CORS, and Mongoose for building the server and connecting to MongoDB.

- Connect to Database:
  Use the mongoose.connect method to establish a connection to the MongoDB database using the URL provided in the config file.

- Middleware Setup:
  Configure middleware using app.use to enable CORS and parse incoming JSON requests.

- Route Configuration:
  Set up various routes for different API endpoints using app.use. Routes are organized based on different functionalities like user management, product handling, ratings, and more.

- Server Setup and Start:
  Set the server port number, and use the app.listen method to start the server and listen on the specified port. The server's status is logged to the console once it starts.

# 2. config.js:

- Database Configuration:
  The dbURL constant holds the MongoDB database URL, with options for local and remote development (one of them is commented out). This URL is used to connect to the database.

- Frontend URLs:
  The frontEndUrl constant holds the URL of the frontend application, with options for local development and production. This is useful for setting up CORS and handling different environments.

- JWT Secrets:
  Two constants, JWT_SECRET and JWT_SECRET_RESET_PASS, hold secret keys used for JWT authentication and password reset functionality, respectively.

- File and Directory Handling:
  Import modules for handling file paths and directories (fileURLToPath, dirname, join). Get the current module's filename and directory using import.meta.url and then export the directory name for use in other parts of the application.

# 3. routes:

# 3.1. categoryRoutes.js:

- Module and Controller Imports:
  Import the necessary modules, including Express, and controllers (categoryController.js and addProductController.js). These controllers handle category creation, category fetching, and adding a product.

- Router Creation:
  Create an Express router using express.Router(). This router will handle specific API endpoints related to category management and product addition.

- Endpoint:
  POST endpoint ("/create-category") that is used for creating a new category.
  GET endpoint ("/categories") that is used for fetching all categorie.
  POST endpoint ("/addproduct") that is used for adding a new product.

# 3.2 cartRoutes.js :

- Module and Controller Imports:
  Import the necessary modules, including Express, and the controllers (cartController.js). These controllers handle adding items to the cart (addToCart) and deleting items from the cart (deleteFromCart).

- Router Creation:
  Create an Express router using express.Router(). This router will handle specific API endpoints related to cart management.

- Endpoint:  
  POST endpoint ("/addToCart/:userId") that is used for adding an item to the cart.
  POST endpoint ("/deleteFromCart") that is used for deleting an item from the cart.

# 3.3 filesRoutes.js :

- Module and Controller Imports:
  Import the necessary modules, including Express, and controllers (filesController.js). These controllers handle various file-related actions such as uploading, downloading, and editing images.

Router Creation:
Create an Express router using express.Router(). This router will handle specific API endpoints related to file management.

- Endpoint:
  POST endpoint ("/upload") for uploading a file. The upload.single("file") middleware indicates that a single file named "file" is expected in the request. This endpoint is associated with the uploadFileController controller function.
  PUT endpoint ("/edit-image/:productId") for editing an image file associated with a product.
  GET endpoint ("/get-file/:filename") for downloading a file by filename.

# 3.5 myOrderRoutes.js :

- Module and Controller Imports:
  Import the necessary modules, including Express, and the controllers (myOrderController.js)

- Router Creation:
  Create an Express router using express.Router(). This router will handle specific API endpoints related to myOrder management.

- Endpoint:  
  POST endpoint ("/orders") for placing an order in Cash on Delivery (COD) mode. The isLogin middleware is used to ensure that the user is authenticated before placing an order.

  GET endpoint ("/orders/:orderId") for retrieving order details by orderId. The isLogin middleware is used to ensure that the user is authenticated before accessing order details

# 3.6 orderRoutes.js :

- Module and Controller Imports:
  Import the necessary modules, including Express, and controllers (orderController.js). These controllers handle various order-related actions, such as placing orders, retrieving order details, and managing order status.

- Router Creation:
  Create an Express router using express.Router(). This router will handle specific API endpoints related to order management.

- Endpoint:
  POST endpoint ("/order") for placing an order in Cash on Delivery (COD) mode. The isLogin middleware is used to ensure that the user is authenticated before placing an order.
  GET endpoint ("/orders/:orderId") for retrieving order details by orderId. The isLogin middleware is used to ensure that the user is authenticated before accessing order details.

# 3.7 productRoutes.js :

- Module and Controller Imports:
  Import the necessary modules, including Express, and controllers (productController.js). These controllers handle various product-related actions, such as adding, updating, deleting, and retrieving products.

- Router Creation:
  Create an Express router using express.Router(). This router will handle specific API endpoints related to product management.

- Endpoint:
  POST endpoint ("/addProduct") for adding a new product. The isLogin and isAdmin middlewares are used to ensure that the user is authenticated and has admin access before adding a product

  PUT endpoint ("/updateProduct/:productId") for updating an existing product. The isLogin and isAdmin middlewares are used to ensure that the user is authenticated and has admin access before updating a product.

  DELETE endpoint (/delete/:productId) is a DELETE request for deleting a product. It requires the user to be logged in (isLogin middleware) and have admin access (isAdmin middleware).

  GET endpoint (/allproducts/:page) is a GET request for retrieving all products with pagination. The :page parameter in the route indicates the page number.

  GET endpoint (/getProductId/:productId) is a GET request for retrieving a product by its ID. The :productId parameter in the route indicates the product ID.

  POST endpoint (/quantity) is a POST request for getting product quantity. The associated controller function is getQuantity.

  POST endpoint (/filter/:page) is a POST request for filtering products by category with pagination

  POST endpoint (/search) is a GET request for searching products. The associated controller function is searchProduct.

# 3.8 ratingRoutes.js :

- Module and Controller Imports:
  Import the necessary modules, including Express, and controllers (ratingController.js).
- Create Rating Endpoint:
  POST endpoint (/rating) is a POST request for creating a new rating. It requires the user to be logged in (isLogin middleware).

# 3.9 shippingRoutes.js :

- Module and Controller Imports:
  Import the necessary modules, including Express, and controllers (shippingAddressController.js). These controllers handle various actions related to shipping addresses, such as adding, retrieving, and editing.

- Router Creation: Create an Express router using express.Router(). This router will handle specific API endpoints related to shipping address management.

- Endpoint:
  POST endpoint (/shipping-address/:user) for adding a new shipping address. The isLogin middleware is used to ensure that the user is authenticated before adding a shipping address.

  GET endpoint (/shipping-address/:user) for retrieving shipping addresses for a user. The isLogin middleware is used to ensure that the user is authenticated before accessing shipping addresses.

  PUT endpoint (/edit-address/:user) for editing a shipping address for a user. The isLogin middleware is used to ensure that the user is authenticated before editing a shipping address.

# 3.10 userRoutes.js :

- Module and Controller Imports:
  Import the necessary modules, including Express, and controllers (userController.js). These controllers handle various user-related actions, such as user signup, login, profile editing, and password management.

- Router Creation:
  Create an Express router using express.Router(). This router will handle specific API endpoints related to user management.

- Endpoint:
  POST endpoint ("/signup") for user creation (signup).
  POST endpoint ("/login") for user login.
  GET endpoint ("/isLoggedIn") to check if a user is logged in. The isLogin middleware is used to ensure that the user is authenticated before accessing this endpoint.
  GET endpoint ("/all-users/:page") to retrieve all users with pagination. The isLogin middleware is used to ensure that the user is authenticated before accessing this endpoint.
  GET endpoint ("/search-users") to search for users. The isLogin middleware is used to ensure that the user is authenticated before accessing this endpoint.
  DELETE endpoint ("/delete-user/:userId") to delete a user. The isLogin and isAdmin middlewares are used to ensure that the user is authenticated and has admin access before deleting a user.
  POST endpoint ("/forgot-password/:email") for initiating the forgot password process.
  PUT endpoint ("/reset-password") for resetting the password.
  GET endpoint ("/total-users") to retrieve the total number of users.
  PUT endpoint ("/edit/:userId") to edit user profiles.

# 4 controllers :

# 4.1 cartController.js :

- Model Imports: Import the necessary models for the cart, user.

- addToCart Function:
  This function handles the addition of a product to the user's cart. It checks if the user exists, updates the cart with new items, and creates a new cart item if the product is not in the cart. Returns a success response with the updated cart item.

- deleteFromCart Function:
  This function handles the deletion of a product from the user's cart. It finds and updates the user's cart with the updated cart items. Returns a success response if the item is successfully deleted from the cart.

- Error Handling:
  Both functions include try-catch blocks to handle potential errors. If there's an error, it returns an appropriate error response.

# 4.2 categoryController.js:

- Model Import:
  Import the necessary model (CategoryModel) for category management.

- createCategory Function:
  This function handles the creation of a new category. It checks if the category field is provided, whether the category already exists, creates a new category, saves it to the database, and returns a success response with the created category.

- getCategories Function:
  This function retrieves all categories from the database and returns a success response with the list of categories.

- Error Handling:
  Both functions include try-catch blocks to handle potential errors. If there's an error, it returns an appropriate error response.

# 4.3. filesController.js :

- Module Imports:
  Import Multer for handling file uploads and necessary models (ProductModel and UserModel).

- Multer Configuration:
  Define storage settings for Multer, specifying the destination folder and file name.

- Multer Instance Creation:
  Create a Multer instance with specified storage and size limits settings.

- General File Upload Function (uploadFileController):
  Handles the upload of any file type, checks if a file is provided, and returns a success response with the uploaded file details.

- Product Image Editing Function (editImageFileController):
  Handles the upload of product images, updates the product image in the database, and returns a success response with the updated product details.

- Profile Image Editing Function (editProfileImageFileController):
  Handles the upload of user profile images, updates the user's profile picture in the database, and returns a success response with the updated user details.

- Download File Function (downloadFile):
  Allows the user to download a file from the server.

- Error Handling:
  Each function includes try-catch blocks to handle potential errors. If there's an error, it returns an appropriate error response.

# 4.4. myOrderController.js :

- Model Imports:
  Import necessary models (MyOrderModel and OrderModel) for order management.

- myOrders Function:
  Retrieves all orders for a specific user using their user ID. Checks if the user ID is provided and returns a success response with the user's orders.

- getMyOrderDetailsByOrderId Function:
  Retrieves details of a specific order by its ID. Checks if the order ID is provided and returns a success response with the details of the specific order.

- Error Handling:
  Both functions include try-catch blocks to handle potential errors. If there's an error, it returns an appropriate error response.

# 4.5. orderController.js :

- Model and Library Imports:
  Import necessary models, libraries, and environmental variables for order management and PayPal integration.

- placeOrderController Function:
  Controller function to place a new order, update product quantities, and update the user's myOrder record.

- PayPal Integration Code:
  Functions for generating an access token, creating an order, and capturing an order using PayPal APIs.

- getOrderDetailsByOrderId Function:
  Retrieve detailed information about a specific order based on its ID.

- getOrders Function:
  Retrieve a paginated list of all orders, including customer details.
  Uses pagination parameters, such as page and perPage, to fetch a sorted list of orders from the OrderModel.

- getSearchedOrders Function:
  Search for orders based on a query, providing results with pagination.
  Performs a case-insensitive search on order status using regular expressions and returns paginated results.

- changeOrderStatus Function:
  Change the status of a specific order.
  Utilizes the OrderModel to find and update the order status based on the provided order ID.

- getNewOrders Function:
  Retrieve the count of new orders with the status "pending."
  Queries the OrderModel to count orders with the specified status.

- getShippedOrders Function:
  Retrieve the count of shipped orders with the status "shipped."
  Queries the OrderModel to count orders with the specified status.

# 4.6. productController.js :

- Model and Library Imports:
  Import necessary models productModel.js for product management

- createProduct Function:
  Purpose: Create a new product with details provided in the request body.
  Implementation: Validates input fields, creates a new product using ProductModel, and returns the created product.

- allProducts Function:
  Purpose: Retrieve a paginated list of all products sorted by creation date.
  Implementation: Uses pagination parameters to fetch a sorted list of products from the ProductModel.

- productById Function:
  Purpose: Retrieve details of a specific product based on its ID.
  Implementation: Fetches details of the specified product using ProductModel.

- updateProduct Function:
  Purpose: Update details of a specific product based on its ID.
  Implementation: Validates and updates product details using ProductModel.

- deleteProduct Function:
  Purpose: Delete a specific product based on its ID.
  Implementation: Deletes the specified product using ProductModel.

- getQuantity Function:
  Purpose: Check the available stock quantity for a given product ID.
  Implementation: Retrieves and compares the available quantity with the requested quantity.

- filterProduct Function:
  Purpose: Retrieve a paginated list of products based on filtering criteria such as category and price range.
  Implementation: Applies filters to ProductModel and returns paginated results.

- searchProduct Function:
  Purpose: Search for products based on a query, providing paginated results.
  Implementation: Performs a case-insensitive search on product names and descriptions using regular expressions.
  These

- Error Handling:
  all functions include try-catch blocks to handle potential errors. If there's an error, it returns an appropriate error response.

# 4.7. ratingController.js :

- createRatings Function:
  Purpose: Store reviews and ratings for a product.
  Implementation: Validates input, updates user's order with rating, checks existing ratings, and calculates average ratings.
- myRating Function:
  Purpose: Update user's order with the given rating.
  Implementation: Finds user's orders, updates order with the given rating for the specified product.

# 4.8. shippingAddressController.js :

- addShippingAddress Function:
  Purpose: Add a new shipping address for a user.
  Implementation: Validates input, checks existing addresses, updates primary address, and saves the new or updated address.
- getShippingAddress Function:
  Purpose: Retrieve shipping addresses for a user.
  Implementation: Retrieves addresses from the database based on the user ID.
- editShippingAddress Function:
  Purpose: Edit an existing shipping address for a user.
  Implementation: Validates input, updates primary address, and saves the edited address.

# 4.9 userController.js :

- Signup Controller:
  Purpose: Handle user sign-up, validate input, check user existence, hash the password, and save the user to the database.
  Implementation: Checks required fields, verifies user existence, hashes the password, and saves the user details.

- Login Controller:
  Purpose: Handle user login, validate credentials, generate a token, and return user details.
  Implementation: Validates login credentials, generates a JWT token upon successful login, and returns user details.

- Test Controller:
  Purpose: Testing controller endpoint.
  Implementation: Logs the user information and sends a test response.

- IsLoggedIn Controller:
  Purpose: Controller to authorize normal users.
  Implementation: Sends a success response indicating that access is granted for logged-in users.

- GetAllUsersController:
  Purpose: Get a paginated list of all non-admin users.
  Implementation: Retrieves a paginated list of non-admin users from the database.

- GetSearchedUser:
  Purpose: Get a paginated user list based on a search query.
  Implementation: Retrieves a paginated list of users based on a search query from the database.

- DeleteUserController:
  Purpose: Delete a user by ID.
  Implementation: Deletes a user from the database based on the provided user ID.

- ForgotPasswordController:
  Purpose: Handle forgot password requests, generate a reset token, and send a reset password email.
  Implementation: Validates user existence, generates and stores a reset token, and sends a reset password email.

- ResetPassword:
  Purpose: Reset the user password using a valid reset token.
  Implementation: Validates the reset token, checks token validity, updates the user's password, and removes the reset token.

- GetTotalUsers:
  Purpose: Get the total count of non-admin users.
  Implementation: Retrieves and returns the total count of non-admin users from the database.

- EditUserProfile:
  Purpose: Edit user profile information.
  Implementation: Updates user profile information based on the provided user ID.

`helpers`:

# 5.1. nodeMailer.js :

- Nodemailer Configuration:
  Sets up nodemailer to send emails using the Gmail service.

- Create a Nodemailer Transporter:
  Creates a transporter with Gmail service and authentication credentials.

- Function to Send Email:
  Defines an asynchronous function named sendEmail to handle the email sending process.

- Extract Email Information:
  Extracts necessary information such as recipient, subject, text, HTML, and attachments from the provided email configuration object.

- Send Email:
  Uses the nodemailer transporter to send the email with the specified content and attachments. Returns true if the email is sent successfully.

- Return Success Response:
  Sends a confirmation response to the client indicating that the email has been sent successfully.

- Error Handling:
  Logs any errors that occur during the email sending process. If an error occurs, returns false and sends an error response.

# 5.2. userHelper.js:

- Import Necessary Libraries and Modules:
  Import bcrypt, JWT, and the ForgotPasswordTokenModel.
- Hash Password Function:
  Asynchronously hash the provided password using bcrypt with a salt round of 10.
- Remove Password Function:
  Exclude the password field from the user object to enhance security.
- Compare Password Function:
  Asynchronously compare a password with its hashed version using bcrypt.
- Generate and Store Token Function:
  Create a JWT and store it in MongoDB, handling duplicate requests and returning a success message.

# 6. userMiddlewares.js:

- Import Necessary Libraries and Modules:
  Import jwt and the userModel.
- isLogin Middleware:
  Check if a user is logged in by verifying the authorization token, extracting user details, and adding them to the request object.
- isAdmin Middleware:
  Check if the logged-in user is an admin by comparing roles and return a message if not.
- isValidToken Function:
  Validate a token by verifying it against the provided secret key.

# 7 `models/`: this folder contains all the schema used in the application
