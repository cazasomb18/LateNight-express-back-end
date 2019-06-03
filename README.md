## ROUTES

## EXPRESS:

## AUTH CONTROLLER

#### GET /auth/login - Show's success message once user has logged in (req.session.message).

#### POST /auth/login - user isn't logged in - redirect to register

#### POST /auth/register - authenticaion "meat/potatoes" - creates encrypted pw/userDbId/profile

#### GET /auth/logout - destroys session


## RESTAURANT CONTROLLER

#### GET /restaurants - an index of all restaurants in Chicago opened late in Chicago - Google

#### POST /restaurants/:id/comment - leave a new comment on a restaurant - end point creates a DB entry for restaurant if no entry exists and then populates it with comments made by the user.  

#### GET /restaurants/:place_id - restaurants show page - show all data on that restaurant prior to user leaving a comment.

## COMMENT CONTROLLER (using restaurants endpoint as '/')

#### GET comment/restaurants/:place_id - endpoints shows info about that restaurants and populates with comments.

#### PUT comment/restaurants/:place_id/edit - allows user to edit comments left on that restaurant.

#### DELETE comment/restaurant/:id - users will be able to delete their comments.


DOCUMENTATION FOR ALL ROUTES: https://documenter.getpostman.com/view/6975934/S1TWzwUB?version=latest
