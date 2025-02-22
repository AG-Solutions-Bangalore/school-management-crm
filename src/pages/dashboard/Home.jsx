import React from "react";
import Layout from "../../layout/Layout";


// const Loader = () => {
//   return (
//     <Layout>
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
//       </div>
//     </Layout>
//   );
// };
const Home = () => {
  

  // if (loading)
  //   return (
  //     <div>
  //       <Loader />
  //     </div>
  //   );
  return (
    <Layout>
      <div className=" rounded-lg mx-auto px-4 py-6 bg-white">
     <p>home</p>
      </div>
    </Layout>
  );
};

export default Home;
