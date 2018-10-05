var StudentID = "";
var corsiID = new Array();
var annunci = new Array();
var compiti = new Array();
var links = "";
var glt = "";
var porcodio = -1;
var porcodio2 = -1;
//funzione logout
function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        console.log('Disconnessione eseguita con successo');
    });
}
//---------------


//funzioni chiamate ai dati
function authenticate() {
    return gapi.auth2.getAuthInstance()
        .signIn({ scope: "https://www.googleapis.com/auth/classroom.announcements.readonly" })
        .then(function () { console.log("Accesso agli annunci eseguito"); },
            function (err) { console.error("Error signing in", err); });
}

function authenticateCourses() {
    return gapi.auth2.getAuthInstance()
        .signIn({ scope: "https://www.googleapis.com/auth/classroom.courses https://www.googleapis.com/auth/classroom.courses.readonly" })
        .then(function () { console.log("Accesso ai corsi eseguito"); },
            function (err) { console.error("Error signing in", err); });
}

function authenticateClassWorks() {
    return gapi.auth2.getAuthInstance()
        .signIn({ scope: "https://www.googleapis.com/auth/classroom.coursework.me https://www.googleapis.com/auth/classroom.coursework.me.readonly https://www.googleapis.com/auth/classroom.coursework.students https://www.googleapis.com/auth/classroom.coursework.students.readonly" })
        .then(function () { console.log("Accesso ai compiti eseguito"); },
            function (err) { console.error("Error signing in", err); });
}

//-------------------------

function onSignIn(googleUser) {

    var profile = googleUser.getBasicProfile();
    StudentID = profile.getId();
    console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    console.log('Name: ' + profile.getName());
    console.log('Image URL: ' + profile.getImageUrl());
    console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
}

function loadClient() {
    return gapi.client.load("https://content.googleapis.com/discovery/v1/apis/classroom/v1/rest")
        .then(function () {
            executeCourses();


        },
            function (err) { console.error("Error loading GAPI client for API", err); });
}


// Make sure the client is loaded and sign-in is complete before calling this method.
function executeCourses() {
    return gapi.client.classroom.courses.list({
        "courseStates": [
            "ACTIVE"
        ],
        "studentId": StudentID
    })
        .then(function (response) {
            // Handle the results here (response.result has the parsed body).
            for (var i = 0; i < response.result.courses.length; i++) {
                corsiID.push(response.result.courses[i].id);
            }
            getAllAnnouncments();
            getAllWorks();

        },
            function (err) { console.error("Execute error", err); });
}
gapi.load("client:auth2", function () {
    gapi.auth2.init({ client_id: "27996083320-vanbjd9pblftu2sgq2m1ilm7du8oj8mr.apps.googleusercontent.com" });
});
function execute(id) {
    return gapi.client.classroom.courses.announcements.list({
        "courseId": id
    })
        .then(function (response) {


            

            for (var i = 0; i < response.result.announcements.length; i++) {
                porcodio = porcodio + 1;

                annunci.push({ text: response.result.announcements[i].text, dataInserimento: response.result.announcements[i].creationTime.slice(-24, -14), link: response.result.announcements[i].alternateLink, id: response.result.announcements[i].courseId, url: "",lt:"" });

                var materialiArray = new Array();
                for (var y = 0; y < response.result.announcements[i].materials.length; y++) {

                    materialiArray.push({ titolo: response.result.announcements[i].materials[y].driveFile.driveFile.title, link: response.result.announcements[i].materials[y].driveFile.driveFile.alternateLink });



                }
                for (var z = 0; z < materialiArray.length; z++) {
                    if (links == "") {
                        links = materialiArray[z].link;
                        glt = materialiArray[z].titolo;

                    }
                    else {
                        links += "§"+materialiArray[z].link;
                        glt += "§"+materialiArray[z].titolo;

                    }
                }
                annunci[porcodio].url = links;
                annunci[porcodio].lt = glt;
                links = "";
                glt = "";
               
            }


        },
            //function (err) { console.error("Execute error", err); });
        )
}
gapi.load("client:auth2", function () {
    gapi.auth2.init({ client_id: "27996083320-vanbjd9pblftu2sgq2m1ilm7du8oj8mr.apps.googleusercontent.com" });
});

function executeClassWorks(id) {
    return gapi.client.classroom.courses.courseWork.list({
        "courseId": id
    })
        .then(function (response) {
            

            for (var i = 0; i < response.result.courseWork.length; i++) {
                porcodio2 = porcodio2 + 1;

                compiti.push({ titolo: response.result.courseWork[i].title, id: response.result.courseWork[i].courseId, dataInserimento: response.result.courseWork[i].creationTime.slice(-24, -14), link: response.result.courseWork[i].alternateLink, url: "", lt: "" });

                var materialiArray = new Array();
                for (var y = 0; y < response.result.courseWork[i].materials.length; y++) {

                    materialiArray.push({ titolo: response.result.courseWork[i].materials[y].driveFile.driveFile.title, link: response.result.courseWork[i].materials[y].driveFile.driveFile.alternateLink });



                }
                for (var z = 0; z < materialiArray.length; z++) {
                    if (links == "") {
                        links = materialiArray[z].link;
                        glt = materialiArray[z].titolo;

                    }
                    else {
                        links += "§"+materialiArray[z].link;
                        glt += "§"+materialiArray[z].titolo;

                    }
                }
                compiti[porcodio2].url = links;
                compiti[porcodio2].lt = glt;
                links = "";
                glt = "";

            }
        },
            function (err) { console.error("Execute error", err); });
}
gapi.load("client:auth2", function () {
    gapi.auth2.init({ client_id: "27996083320-vanbjd9pblftu2sgq2m1ilm7du8oj8mr.apps.googleusercontent.com" });
});

function getAllAnnouncments() {

    for (var i = 0; i < corsiID.length; i++) {

        execute(corsiID[i]);

    }
}

function getAllWorks() {
    for (var i = 0; i < corsiID.length; i++) {

        executeClassWorks(corsiID[i]);

    }
}

function loggaStream() {
    for (var i = 0; i < annunci.length; i++) {
        console.log("Titolo° ", annunci[i].text);
        console.log("Data° ", annunci[i].dataInserimento);
        console.log("Link° ", annunci[i].link);
        console.log("ID° ", annunci[i].id);
        console.log("Tit materiale° ", annunci[i].lt);
        console.log("URLs° ", annunci[i].url);

    }
    for (var i = 0; i < compiti.length; i++) {
        console.log("Titolo° ", compiti[i].titolo);
        console.log("Data° ", compiti[i].dataInserimento);
        console.log("Link° ", compiti[i].link);
        console.log("ID° ", compiti[i].id);
    console.log("tit url: ", compiti[i].lt);
    console.log("url: ", compiti[i].url);

    }

}
