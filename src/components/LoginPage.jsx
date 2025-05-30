import pb from "../services/pocketbase";
import useToast from "../hooks/useToast";


function LoginOAuth(){
    const showToast = useToast();
    async function handleLogin(){
        try{
            const authData = await pb.collection('users').authWithOAuth2({ provider: 'microsoft' });
            console.log(authData);
            if(pb.authStore.isValid && (!pb.authStore.record.email.endsWith("@research.iiit.ac.in") && !pb.authStore.record.email.endsWith("@students.iiit.ac.in"))){
                await pb.collection("users").delete(pb.authStore.record.id);
                showToast("Only @research.iiit.ac.in and @students.iiit.ac.in emails are allowed.", "warning");
                pb.authStore.clear();
            }
        } catch(err){
            showToast("Login Failed, Please try again", "error");
            console.log(error);
        }

        showToast("Logged in successfully", "success");
    }

    return (
        <div className="flex items-center justify-center min-h-screen w-screen bg-base-200">
            <div className="card card-border w-full max-w-sm shadow-2xl bg-base-100">
                <div className="card-body items-center text-center">
                <h1 className="text-3xl font-bold">Pentacontests</h1>
                <p className="py-2 text-sm text-gray-500">
                    Welcome to Pentacontests, <br />Login with Microsoft OAuth with your IIIT Account.
                </p>
                <div className="card-actions w-full mt-4">
                    <button className="btn btn-outline w-full" onClick={handleLogin}>Login</button>
                    <div className="divider w-full"> ☉ </div>
                    <button className="btn btn-outline w-full" onClick={() => {showToast("Non-IIIT Login coming soon. Contact Administrator for access", "warning")}}>Don't have IIIT Account</button>
                </div>
                </div>
            </div>
        </div>

    )
}

export default LoginOAuth;