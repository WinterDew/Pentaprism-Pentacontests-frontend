import { useEffect, useState } from "react";
import LoginPage from "./components/login";
import pb from "./services/pocketbase";


function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    pb.authStore.onChange(() => {
      setLoggedIn(pb.authStore.isValid);
    });
  }, []);

  if(loggedIn){
    return <div>Logged in</div>;
  } else {
    return <LoginPage/>
  }
}

export default App
