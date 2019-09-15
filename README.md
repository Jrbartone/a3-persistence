
## My Travel Dictionary App v2

your glitch link e.g. http://a3-jrbartone.glitch.me

   If you think you liked My Travel Dictionary 1 you're gonna love this. It's the same app except with a full login service and persistent data storage. In this version of the app, multiple users can exist and have their
  own travel dictionaries. You can only create an account if you're already logged in as someone else, which is a strange design choice but prevents other students from messing with my database. (admin, admin is the
  default login info. Accounts a,a and Joe,a also exist.)  

Middleware packages
- 1: passport: Locally authenticates the User and Password in my db
- 2: body-parser: Neccessary for passport to read the json objects that are recieved by the server
- 3: serve-favicon: Puts a fun little globe image in the corner of the page
- 4: connect-timeout: Attached to the calls out to the Yandex API to prevent hang in case their service is down.
- 5: helmet: Helps secure the app by adding various HTTP headers

## Technical Achievements
- **Tech Achievement 1**: Persistent table of translated words are specific per user 
- **Tech Achievement 2**: ...

### Design/Evaluation Achievements
- **Design Achievement 1**: Added a navbar and various other pages
- **Design Achievement 2**: Change the heading of the app to reflect current user
- **Design Achievement 3**: Use alert() to display feedback on submission of login