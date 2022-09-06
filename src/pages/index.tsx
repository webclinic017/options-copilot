import { useState, useEffect } from "react";
import { useRouter } from "next/router";

import useAuth from "../hooks/useAuth";
import { supabase } from "../utils/supabaseClient";

const Home = ({ user }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { signOut } = useAuth();

  console.log("user", user);

  return (
    <div className="w-full h-screen flex justify-center items-center p-4">
      hello
      <button onClick={() => signOut()}>Log Out</button>
    </div>
  );
};

export default Home;

// export async function getServerSideProps({ req }) {
//   // const { user } = await supabase.auth.api.getUserByCookie(req);
//   const user = supabase.auth.user();
//   console.log("user SSR", user);

//   if (!user) {
//     return { props: {}, redirect: { destination: "/login" } };
//   }

//   return { props: {} };
// }
export async function getServerSideProps({ req }) {
  const { user } = await supabase.auth.api.getUserByCookie(req);

  if (!user) {
    return {
      redirect: { destination: "/login", permanent: false },
    };
  }
  return { props: { user } };
}
