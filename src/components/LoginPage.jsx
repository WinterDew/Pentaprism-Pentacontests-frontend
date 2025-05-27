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
        <button className="btn ptn-primary" onClick={handleLogin}>O Auth Login</button>
    )
}

export default LoginOAuth;