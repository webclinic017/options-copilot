import React, { useState } from "react";
import Layout from "../components/Layout";
import { useCSVReader } from "react-papaparse";

const trades = () => {
  const { CSVReader } = useCSVReader();
  const [animationEffect, setAnimationEffect] = useState(false);

  const handleOnDrop = ({ data }) => {
    console.log("drop");
    // console.log(data);
    console.log("---------------------------");
    // data.forEach((o) => console.log(o));
    // console.log(data.sort((a, b) => b.DateTime - a.DateTime));
  };
  return (
    <Layout>
      <div className="flex justify-between">
        <div className="text-3xl font-bold">Trade History</div>
        <CSVReader
          config={{ header: true, dynamicTyping: true }}
          // nonDrop={handleOnDrop}
          onUploadAccepted={(result) => handleOnDrop(result)}
        >
          {({
            getRootProps,
            acceptedFile,
            ProgressBar,
            getRemoveFileProps,
          }: any) => (
            <div>
              <button
                className="bg-blue-400 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded inline-flex items-center duration-300"
                {...getRootProps()}
              >
                <svg
                  className="fill-current w-4 h-4 mr-2"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z" />
                </svg>
                <span>Import CSV</span>
              </button>
            </div>
          )}
        </CSVReader>
      </div>
    </Layout>
  );
};

export default trades;

// <div className="w-full h-screen flex flex-col justify-center items-center  p-4">
//   <Sidebar />
//   <button onClick={() => signOut()}>Log Out</button>
//   <CSVReader
//     config={{ header: true, dynamicTyping: true }}
//     // nonDrop={handleOnDrop}
//     onUploadAccepted={(result) => handleOnDrop(result)}
//   >
//     {({
//       getRootProps,
//       acceptedFile,
//       ProgressBar,
//       getRemoveFileProps,
//     }: any) => (
//       <div>
//         <button type="button" {...getRootProps()}>
//           Browse file
//         </button>
//       </div>
//     )}
//   </CSVReader>
// </div>
