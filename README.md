## Intuit Budget App 

An application used to manage expenses, built with React, Redux, JavaScript, and CSS. 
Click [here](https://intuit-budget-app.web.app/) for demo

## Project Status

This project is currently in MVP stage. Users can add accounts, mention transactions accross accounts, track expenses on monthly basis, associate tags against transactions and check trends of their expense on monthly basis.


## Installation and Setup Instructions

Clone down this repository. You will need `node` and `npm` installed globally on your machine.  

Installation:

`npm install`  

To start App:  

`npm start`  
 
To visit App:

`localhost:3000`  

## Reflection


The backend server used is a third party api service [crudcrud](https://crudcrud.com/)  with an limitation of 1 lac request for 30 days.It allows all CRUD activities.

There are few areas of improvement/enhancement which is on the checklist as
* Authentication of users
* Disallowing of duplicate tag creation
* Showing transaction of previous years
* Deleting account should delete all the transactions associated with it.
* Memoizing data returned by useSelector used in hooks.

  
