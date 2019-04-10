var config = {
  apiKey: "AIzaSyA95biSoKCsMAXSFj4DHivnrtHVfyhc8y8",
  authDomain: "to-love-roo.firebaseapp.com",
  databaseURL: "https://to-love-roo.firebaseio.com",
  projectId: "to-love-roo",
};
firebase.initializeApp(config);

var app = new Vue({
  el: '#app',
  data: {
    greeting: 'Letter For Roo:',
    message: "",
    newestMessageOrder: 0,
    validUsers: [ "XWnYBJEDhid9GMnHo1xfcDq8t7j2", "SpXjWR3B5Ch03jBHYmuk3naAtj63" ],
    adminUser: false,
    userID: false,
    newMessage: ""
  },
  computed: {
    loggedIn: function() {
      return this.validUsers.indexOf(this.userID) !== -1;
    }
  },
  methods: {
    logIn: function () {
      // local persistance remains if browser is closed
      firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
        .then(function() {
          var provider = new firebase.auth.GoogleAuthProvider();
          return firebase.auth().signInWithPopup(provider);
        })
        .then(function(result) {
          app.userID = result.user.uid;
          app.adminUser = result.user.uid === "XWnYBJEDhid9GMnHo1xfcDq8t7j2";
        }).catch(function(error) {
          console.log(error);
        });
    },
    logOut: function() {
      firebase.auth().signOut().then(function() {
        app.userID = false;
        location.reload();
      }).catch(function(error) {
        console.log(error);
      })
    },
    updateMessage: function(event) {
      let date = new Date().toISOString();
      let content = { date: date, "message": this.newMessage.trim() };
      fetch("/message/new",
        {
          method: "POST",
          mode: "same-origin",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(content)
        }
      ).then(function() {
        app.newMessage = "";
        app.getMessage();
      })
    },
    getMessage: async function() {
      fetch("/message/latest").then(async function(data) {
        data = await data.json();
        app.message = data;
        app.newestMessageOrder = data.order;
      })
    },
    previousMessage: async function() {
      fetch("/message/previous/" + this.message.order).then(async function(data) {
        data = await data.json();
        app.message = data;
      })
    },
    randomMessage: async function() {
      fetch("/message/random/").then(async function(data) {
        data = await data.json();
        app.message = data;
      })
    },
  },
  beforeMount(){
    this.getMessage()
  },
});

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    app.userID = user.uid;
    app.adminUser = user.uid === "XWnYBJEDhid9GMnHo1xfcDq8t7j2";
  } 
});
