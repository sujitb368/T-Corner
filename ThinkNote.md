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

# 4 pages/ (from 4.1 to 4.11)
