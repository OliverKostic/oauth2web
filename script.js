
const CLIENT_ID = '635810552534-1s6b3iongkovqapcbo19e6d1mqvb3cp7.apps.googleusercontent.com';
const API_KEY = 'AIzaSyA1yto1cD1BwF5up_cfT68cq43oYqbsooo';
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/people/v1/rest"];
const SCOPES = "https://www.googleapis.com/auth/contacts.readonly";

function handleClientLoad() {
    gapi.load('client:auth2', initClient);
}

function initClient() {
    gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES
    });
}

function onSignIn(googleUser) {
    const profile = googleUser.getBasicProfile();

    document.getElementsByClassName("g-signin2")[0].style.display = "none";
    document.getElementsByClassName("data")[0].style.display = "block";
    document.getElementById("signoutButton").style.display = "block";
    document.getElementById("pic").setAttribute("src", profile.getImageUrl());
    document.getElementById("email").innerHTML = profile.getEmail();
    document.getElementById("ID").innerHTML = profile.getId();
    document.getElementById("fullName").innerHTML = profile.getName();
    document.getElementById("givenName").innerHTML = profile.getGivenName();
    document.getElementById("familyName").innerHTML = profile.getFamilyName();

    listConnectionNames()
}

function signOut() {
    gapi.auth2.getAuthInstance().signOut().then(function () {
        document.getElementsByClassName("g-signin2")[0].style.display = "block";
        document.getElementsByClassName("data")[0].style.display = "none";
        document.getElementById("signoutButton").style.display = "none";
        var cont = document.getElementById('content');
        while (cont.firstChild) {
            cont.removeChild(cont.firstChild);
        }
    })
}

function appendPre(message) {
    var pre = document.getElementById('content');
    var textContent = document.createTextNode(message + '\n');
    pre.appendChild(textContent);
}

function listConnectionNames() {
    gapi.client.people.people.connections.list({
        'resourceName': 'people/me',
        'pageSize': 10,
        'personFields': 'names,phoneNumbers,emailAddresses'
    }).then(function (response) {
        const connections = response.result.connections;
        if (connections.length > 0) {
            for (i = 0; i < connections.length; i++) {
                var person = connections[i];
                if (person.names && person.names.length > 0) {
                    const phoneNumber = (person.phoneNumbers && person.phoneNumbers.length > 0) ? (' - ' + person.phoneNumbers[0].canonicalForm) : '';
                    appendPre(person.names[0].displayName + phoneNumber)
                }
            }
        }
    });
}


