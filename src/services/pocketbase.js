import PocketBase from 'pocketbase';

const pb = new PocketBase('https://winterdewserver.eastus.cloudapp.azure.com/pentacontestspb');
if(localStorage.getItem("pocketbase_auth") != null){
    var data = JSON.parse(localStorage.getItem("pocketbase_auth"));
    pb.authStore.save(data.token, data.record);
    try{
        await pb.collection("users").authRefresh();
    } catch(err) {
        pb.authStore.clear();
    }
}

export default pb;
