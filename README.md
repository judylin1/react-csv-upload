# react-csv-upload

Goal: Create a NPM package that allows for uploading a CSV file in React.

Requirements:  
-Accept a CSV file with or without a header.  
-Display an error if the row has a problem (tell user which row and what the issue is).  
-Can set which headers are required / not required.  
-Return array of successful rows and array of unsuccessful rows to callback function.  
-If any row contains an error, allow user to fix their CSV file or continue with uploading only the successful rows.  
-If a row of emails exists, check that the email is valid.  

Dependencies:  
-React  
-Material-UI  
-PapaParse  
