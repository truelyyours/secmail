# secmail

## Run the application
`Default Port: 3000`
```
1. npm install
2. npm start
```

## View the application

Visit http://localhost:3000/, create a new account and enjoy sending mails!! 

# Features
They seems like feature to me (at least) :smiley:
- _Mails can be sent to anyone who is **registered** on this web app, dosen't matter if they registered while being on localhost or on any local network !!_ Advantage of using cloud database :wink:
- _Even if you are on localhost, if you are connected to the internet, you will recieve mails_ :upside_down_face:
- _Anyone can simply clone the repo, install node modules, do `npm start` and you can use the app and any other email sending application!!_ :grin: _(Not literally though)_ :zany_face:

## TODO:
- [x] Anyone who is registered with us can send and recieve email to anyone else reg with us.
- [x] Send and recieve encrypted message
- [x] Decrypt on button click!!
  - [ ] Style the button and alert box
- [ ] Do something to dislay the username (email id) of the current logged in user!!
- [ ] **Inbox and Sentbox should be two seperate buttons. Render the EmailList view accordingly**
- [ ] Get a working stego. [Implement LSP algo if possible!]
- [x] Pop an alert when the data/msg cannot be hidden in the image
- [ ] Study [this image-to-base64](https://onlinepngtools.com/convert-png-to-base64)
- [ ] Put encrypted data in image and directly render a image into the EmailView based on base64 encoding of image (F Firebase is async!! For once I need it to be sync!!!)
- [ ] Try and remove the feature to copy and paste (from the alert popup)
- [x] Design the login page.
- [ ] Fix the login click button bug

