#  Late Night
## Bringing you all the late night kitchens in Chicago

## 05-12-2019: Goals
	## BackEnd
	- Resolve "Router.use() requires middleware" error message (server.js 38:5)
	- Ask about making second API call in restaurantController
	- Test auth routes and restaurant routes
	- restaurantController - is only getting the data from the 3rd party API...
	-- what are the advantages of storing 3rd partyAPI data into MongoDB?
		--- gives user functionality of saving favorite places, and also provides a place for<br/>
		users to leave comments.

## User Stories

	1.) When user goes to the home page they will be prompted to login or create an account.  If they<br/> don't have an account they will have an option to register for their account.

	2.) Once an account has been created, they will have access to the dataset, which is a list of<br/>restaurants in Chicago open later than 2200 hours.

	3.) This list will display the following fields: name, phone number, address and hours opened. This<br/> list is searchable and will be able to return the restaurant of their choice and can be sorted<br/> according to the following fields: name and location.

	4.) After the user has identified the restaurant they want to view, they will able to leave comments on that restaurant telling the LateNight user community anything they wish to disclose about<br/> their experience at that particular restaurant.

## ROUTES

## EXPRESS:

 	USER.CONTROLLER - NEW ROUTE - if user is not logged in then they will be redirected to the<br/> registration page.  This will create the new user in the local mongoDB.

 	POST /user - create the new user
 		request body should include these fields:
 		username
 		password
 		email


 ## GET /asdf -- gives me ___ data


 	USER.CONTROLLER - POST ROUTE - if user hasn't registered they will redirected to the restaurants index page.  This is also save the user's information in a local mongoDB.



 	RESTAURANT.CONTROLLER - GET ROUTE - after user has logged in this is what they will see - an index of all restaurants in Chicago opened later than 2200 hours.

 	GET /restaurants - an index of all restaurants in Chicago opened later than 2200 hours


 	GET /restaurants/:id - show info about a restaurant -- include comments 

 	COMMENT.CONTROLLER - POST ROUTE - users will be able to leave a comment on any restaurant in the restaurants index page detailing their experience(s).  This will be uniquely tied to their account and they will be unable to leave a comment unless they are logged in.

 	POST /comments - users will be able to leave a comment on any restaurant

 	COMMENT.CONTROLLER - DELETE ROUTE - users will have the option to delete their comments they have left if they want to.

 	DELETE /comments/:id - 

 	COMMENT.CONTROLLER - EDIT ROUTE - users will have the option to edit their comments after posting.

 	PUT /comments/:id - update comment

## REACT:
	UI - temporarily handles all user information via userController, commentController, and temporarily (in state) handles send that information to the server, which then validates that information and stores it into the mongoDB.

	UI - displays the 3rd party API information to the user (which is received via server/express controller). Rendered in a sortable list displaying the information denoted via fetch request and models.

## 3RD PARTY API:
	RESTAURANT.POST - 3rd party google places api will POST a list of restaurants opened later than 2200 hours and send the data to REACT.










googleAPI_key:  AIzaSyCbQ8Y7CHZUWrnEGUCqC8fNR4Kw1dfk5AE
