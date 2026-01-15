### API Test Scenarios
| Test ID | Scenarios | Test Steps | Severity | Status |
|---------|-----------|------------|----------|--------|
| TC001 | Successful in fetching book list | 1. Send GET request to retrieve available book list | High | PASS |
| TC002 | Successful in adding single book | 1. Send request to Register a new user<br>2. Send GET request to retrieve ISBN for the specified book title<br>3. Send POST request to add book by ISBN received on Step 2<br>4. Send GET request to retrieve user profile details<br>4. Verify book with ISBN retrieved on Step 2 successfully reflected on the profile details | High | PASS |
| TC003 | Successful in adding multiple books | 1. Send request to Register a new user<br>2. Send GET request to retrieve ISBN for the specified book titles<br>3. Send POST request to add all books by ISBNs retrieved on Step 2<br>4. Send GET request to retrieve user profile details<br>4. Verify correct ISBN listed on user profile details | High | PASS |
| TC004 |||||
| TC005 |||||
| TC006 |||||
| TC007 |||||
| TC008 |||||
| TC009 |||||
| TC010 | Verify unable retrieve ISBN for non-existent book title | 1. Send GET request to retrieve ISBN for the specified book title | Medium | PASS |
| TC011 | Verify unable to add incorrect ISBN | 1. Send POST request to register user<br>2. Send POST request to add book by providing incorrect ISBN<br>3. Send GET request to retrieve user profile details to ensure previous ISBN was not added into the book collections list | Medium | PASS |
| TC012 | Verify unable to add duplicate books | 1. Send POST request to register user<br>2. Send POST request to add book by providing the ISBN<br>3. Send another POST request to add book by providing the same ISBN value<br>3. Verify ISBN added only once | Medium | PASS |
| TC013 | Verify unable to add books with invalid userId | 1. Send GET request to get valid ISBN<br>2. Send POST request to add book by providing invalid/non-existing User ID | High | PASS |
| TC014 | Verify unable to generate token for unregistered user | 1. Send POST request to generate token with invalid credentials (incorrect username/password)<br>2. Verify unable to generate token and correct error message displayed | High | PASS |
| TC015 | Verify unable to register with existing username | 1. Send POST request to register user by entering existing credentials<br>2. Verify unable to register and correct error message displayed | High | PASS |
| TC016 | Verify unable to delete by providing incorrect userId | 1. Send DELETE request to delete by providing incorrect userId<br>2. Verify correct error message displayed | High | WIP |
| TC017 | Verify unable to delete by providing incorrect authorization header | 1. Send POST request to register a user<br>2. Send DELETE request to delete user created on Step 1 by providing incorrect Authorization header value<br>3. Verify unable to delete user and correct error message displayed | High | PASS |
| TC018 | Verify unable to fetch profile of non-existent user | 1. Send GET request to get user profile but providing non-existing userId value | Medium | PASS |
| TC019 | Verify non-authorized user unable to add books | 1. Send POST request to register a user<br>2. Send GET request to obtain ISBN for specific book's title<br>3. Send POST request to add book without providing authorization header<br>4. Verify unable to add book and correct status code received | High | PASS |


