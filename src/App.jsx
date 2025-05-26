import { useEffect, useState } from "react";
import LoginPage from "./components/loginPage";
import pb from "./services/pocketbase";
import HomePage from "./components/homePage";

function App() {
  // console.log(pb.authStore.isValid);
  const [loggedIn, setLoggedIn] = useState(pb.authStore.isValid);

  useEffect(() => {
    // Update loggedIn when authStore changes
    return pb.authStore.onChange(() => {
      setLoggedIn(pb.authStore.isValid);
      
    });
  }, []);

  return loggedIn ? <HomePage /> : <LoginPage />;
}

export default App;
