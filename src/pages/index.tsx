import useAuth from "../hooks/useAuth";
import { supabase } from "../utils/supabaseClient";
import Layout from "../components/Layout";

const Home = () => {
  const { signOut } = useAuth();

  return (
    <Layout>
      <button onClick={() => signOut()}>Log Out</button>
    </Layout>
  );
};

export default Home;

export async function getServerSideProps({ req }) {
  const { user } = await supabase.auth.api.getUserByCookie(req);
  if (!user) {
    return {
      redirect: { destination: "/login", permanent: false },
    };
  }
  return { props: { user } };
}
