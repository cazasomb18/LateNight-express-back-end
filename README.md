#  Late Night
## Bringing you all the late night kitchens in Chicago

## 05-12-2019: Goals

### BackEnd

	1.) Resolve "Router.use() requires middleware" error message (server.js 38:5)
	2.) Test auth routes and restaurant routes
	3.) auth routes - functionality - create user, access their their comments (edit/delete), leave
	 possibility to save savorite restaurants.
	4.) commentController/routes - create comments, store comments to userDbId, comments will have to be pushed into userModel?

## 05-12-2019: Questions to Ask
### restaurantController:
	- is only getting the data from the 3rd party API... is the the best practice for having the functionality of users leaving comments on API data?
	- making second API call in restaurantController - googlePlaces fetch followed by googleDetails 
	 the second API call depends on the information returns from the first.

	- what are the advantages of storing 3rd partyAPI data into MongoDB?
		-- I want users to be able to leave comments on particular documents gathered from the 3rd 
		party API - does this necessitate a mongoDB connection to that API?
		-- I was to leave the possibility for users to be able to save their favorite restaurants 
		 to their profile - would this also be a good way to do this?

	- I don't want my 3rd party API data to be editable - I just want it to be sorted according to 
	user fields returned via 3rd party API and have the users to be able to leave comments on 
	API entries - what is the best way to go about this?  

	-- it's sounding more and more like I probably need to create mongoDB entries for the restaurants
	 but what is the most efficient way to do it?  I don't want to have to run a massive query everytime a user logs in...

## User Stories

	1.) When user goes to the home page they will be prompted to login or create an account.  If 
	they don't have an account they will have an option to register for their account.

	2.) Once an account has been created, they will have access to the dataset, which is a list of
	restaurants in Chicago open later than 2200 hours.

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


 	USER.CONTROLLER - POST ROUTE - if user hasn't registered they will redirected to the restaurants
 	 index page.  This is also save the user's information in a local mongoDB.



 	RESTAURANT.CONTROLLER - GET ROUTE - after user has logged in this is what they will see - an 
 	index of all restaurants in Chicago opened later than 2200 hours.

 	GET /restaurants - an index of all restaurants in Chicago opened later than 2200 hours


 	GET /restaurants/:id - show info about a restaurant -- include comments 

 	COMMENT.CONTROLLER - POST ROUTE - users will be able to leave a comment on any restaurant in the 
 	restaurants index page detailing their experience(s).  This will be uniquely tied to their 
 	account and they will be unable to leave a comment unless they are logged in.

 	POST /comments - users will be able to leave a comment on any restaurant

 	COMMENT.CONTROLLER - DELETE ROUTE - users will have the option to delete their comments they 
 	have left if they want to.

 	DELETE /comments/:id - 

 	COMMENT.CONTROLLER - EDIT ROUTE - users will have the option to edit their comments after 
 	posting.

 	PUT /comments/:id - update comment

## REACT:
	UI - temporarily handles all user information via userController, commentController, and 
	temporarily (in state) handles send that information to the server, which then validates that 
	information and stores it into the mongoDB.

	UI - displays the 3rd party API information to the user (which is received via server/express controller). Rendered in a sortable list displaying the information denoted via fetch request and models.

## 3RD PARTY API:
	RESTAURANT.POST - 3rd party google places api will POST a list of restaurants opened later than
	 2200 hours and send the data to REACT.










<!-- googleAPI_key:  AIzaSyCbQ8Y7CHZUWrnEGUCqC8fNR4Kw1dfk5AE -->
