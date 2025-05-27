import pb from "../services/pocketbase";


function LoginOAuth(){
    async function handleLogin(){
        const authData = await pb.collection('users').authWithOAuth2({ provider: 'microsoft' });
    }

    return (
        <button className="btn ptn-primary" onClick={handleLogin}>O Auth Login</button>
    )
}

export default LoginOAuth;