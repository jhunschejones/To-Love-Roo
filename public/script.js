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
    newMessage: "",
    sender: ""
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
          this.getUser();
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
    addMessage: function(event) {
      let date = new Date().toISOString();
      let content = {
        title: date,
        messageBody: this.newMessage.trim(),
        recipient: "5cac3053bcf76a16432764e8",
        sender: this.sender.id
      };
      fetch("/api/v1/message/new",
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
      fetch("/api/v1/message/latest").then(async function(data) {
        data = await data.json();
        app.message = data;
        app.newestMessageOrder = data.order;
      })
    },
    getUser: async function() {
      fetch("/api/v1/user/" + this.userID).then(async function(data) {
        data = await data.json();
        app.sender = data;
      })
    },
    previousMessage: async function() {
      fetch("/api/v1/message/previous/" + this.message.order).then(async function(data) {
        data = await data.json();
        if (data.message === "There are no more messages.") return false;
        app.message = data;
      })
    },
    randomMessage: async function() {
      fetch("/api/v1/message/random/").then(async function(data) {
        data = await data.json();
        app.message = data;
      })
    },
  },
  beforeMount(){
    this.getMessage();
  },
});

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    app.userID = user.uid;
    app.getUser();
    app.adminUser = user.uid === "XWnYBJEDhid9GMnHo1xfcDq8t7j2";
  }
});
