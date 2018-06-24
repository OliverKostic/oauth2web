
const CLIENT_ID = '635810552534-1s6b3iongkovqapcbo19e6d1mqvb3cp7.apps.googleusercontent.com';
const API_KEY = 'AIzaSyA1yto1cD1BwF5up_cfT68cq43oYqbsooo';
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/people/v1/rest"];
const SCOPES = "https://www.googleapis.com/auth/contacts.readonly";

const signinButton = document.getElementById('signinButton');
const signoutButton = document.getElementById('signoutButton');

function handleClientLoad() {
    gapi.load('client:auth2', initClient);
}

function initClient() {
    gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES
    }).then(function () {
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    })
}

function updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
        signinButton.style.display = 'none';
        signoutButton.style.display = 'block';
        getProfile();
        listContacts();
    } else {
        signinButton.style.display = 'block';
        signoutButton.style.display = 'none';
        document.getElementsByClassName("data")[0].style.display = "none";
    }
}

function onSignIn() {
    gapi.auth2.getAuthInstance().signIn();
}

function onSignOut() {
    gapi.auth2.getAuthInstance().signOut();
}

function getProfile() {
    gapi.client.people.people.get({
        'resourceName': 'people/me',
        'personFields': 'names,photos,emailAddresses'
    }).then(function(resp) {
        document.getElementsByClassName("data")[0].style.display = "block";
        document.getElementById("pic").setAttribute("src", resp.result.photos[0].url);
        document.getElementById("email").innerHTML = resp.result.emailAddresses[0].value;
        document.getElementById("fullName").innerHTML = resp.result.names[0].displayName;
        document.getElementById("givenName").innerHTML = resp.result.names[0].givenName;
        document.getElementById("familyName").innerHTML = resp.result.names[0].familyName;
    })
}

function addContact(contact) {
    var pre = document.getElementById('contacts');
    var textContent = document.createTextNode(contact + '\n');
    pre.appendChild(textContent);
}

function removeContacts() {
    var cont = document.getElementById('contacts');
    while (cont.firstChild) {
        cont.removeChild(cont.firstChild);
    }
}

function listContacts() {
    gapi.client.people.people.connections.list({
        'resourceName': 'people/me',
        'pageSize': 10,
        'personFields': 'names,phoneNumbers,emailAddresses'
    }).then(function (response) {
        removeContacts();
        const connections = response.result.connections;
        if (connections.length > 0) {
            for (i = 0; i < connections.length; i++) {
                var person = connections[i];
                if (person.names && person.names.length > 0) {
                    const phoneNumber = (person.phoneNumbers && person.phoneNumbers.length > 0) ? (' - ' + person.phoneNumbers[0].canonicalForm) : '';
                    addContact(person.names[0].displayName + phoneNumber)
                }
            }
        }
    })
}



