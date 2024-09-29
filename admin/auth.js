const SUPABASE_URL = config.SUPABASE_URL;
const SUPABASE_ANON_KEY = config.SUPABASE_ANON_KEY;
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function onSignIn(googleUser) {
    const id_token = googleUser.getAuthResponse().id_token;
    
    supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            idToken: id_token,
        }
    }).then(({ data, error }) => {
        if (error) {
            console.error('Error during Google sign-in:', error);
            showErrorMessage('Failed to sign in. Please try again.');
        } else if (data.user) {
            checkUserInDatabase(data.user.email);
        }
    });
}

async function checkUserInDatabase(email) {
    const { data, error } = await supabase
        .from('users')
        .select('email')
        .eq('email', email)
        .single();

    if (error) {
        console.error('Error checking user in database:', error);
        showErrorMessage('An error occurred. Please try again.');
    } else if (data) {
        document.getElementById('login-container').style.display = 'none';
        document.getElementById('dashboard').style.display = 'block';
        fetchProjects();
    } else {
        showErrorMessage('You do not have permission to access this dashboard.');
    }
}

function showErrorMessage(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error';
    errorDiv.textContent = message;
    document.getElementById('login-container').appendChild(errorDiv);
    setTimeout(() => errorDiv.remove(), 5000); 
}

supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN' && session) {
        checkUserInDatabase(session.user.email);
    }
});

function signOut() {
    supabase.auth.signOut().then(() => {
        document.getElementById('dashboard').style.display = 'none';
        document.getElementById('login-container').style.display = 'flex';
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const signOutButton = document.createElement('button');
    signOutButton.textContent = 'Sign Out';
    signOutButton.className = 'btn';
    signOutButton.onclick = signOut;
    document.querySelector('.sidebar').appendChild(signOutButton);
});