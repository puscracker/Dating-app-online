let auth, db, currentUser = null;

document.addEventListener('DOMContentLoaded', function() {
    const firebaseConfig = {
        apiKey: "YOUR_API_KEY",
        authDomain: "YOUR_PROJECT.firebaseapp.com",
        projectId: "YOUR_PROJECT",
        storageBucket: "YOUR_PROJECT.appspot.com",
        messagingSenderId: "YOUR_ID",
        appId: "YOUR_APP_ID"
    };

    firebase.initializeApp(firebaseConfig);
    auth = firebase.auth();
    db = firebase.firestore();

    checkAuthState();
});

function checkAuthState() {
    auth.onAuthStateChanged(async (user) => {
        if (user) {
            currentUser = user;
            await loadUserData(user.uid);
            showApp();
        } else {
            currentUser = null;
            showAuth();
        }
    });
}

// ===== AUTH =====
async function signup() {
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const name = document.getElementById('signupName').value;
    const age = parseInt(document.getElementById('signupAge').value) || 18;
    const gender = document.getElementById('signupGender').value;
    const bio = document.getElementById('signupBio').value;

    try {
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;

        await db.collection('users').doc(user.uid).set({
            uid: user.uid,
            name,
            email,
            age,
            gender,
            bio,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        alert("Account created!");
    } catch (e) { alert(e.message); }
}

async function login() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        await auth.signInWithEmailAndPassword(email, password);
        alert("Logged in!");
    } catch (e) { alert(e.message); }
}

function logout() {
    auth.signOut();
    alert("Logged out");
}

// ===== USER DATA =====
async function loadUserData(uid) {
    try {
        const doc = await db.collection('users').doc(uid).get();
        if (doc.exists) {
            console.log("User data loaded:", doc.data());
        }
    } catch (e) { console.error(e); }
}

// ===== UI =====
function showApp() {
    document.getElementById('authModal').style.display = 'none';
    document.getElementById('app').style.display = 'block';
}

function showAuth() {
    document.getElementById('authModal').style.display = 'flex';
    document.getElementById('app').style.display = 'none';
}

function showTab(tab) {
    document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
    document.getElementById(tab + 'Form').classList.add('active');
}

window.signup = signup;
window.login = login;
window.logout = logout;
window.showTab = showTab;
