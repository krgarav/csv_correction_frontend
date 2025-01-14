import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/Auth/Login";
import CreateUser from "./pages/Admin/CreateUser";
import { AllUser } from "./pages/Admin/AllUser";
import { PageNotFound } from "./pages/PageNotFound";
import { useContext, useEffect, useState } from "react";
import CsvHomepage from "./pages/CSV Comparer/CsvHomepage";
import Correction from "./pages/CSV Comparer/Correction";
import ImageUploader from "./pages/ImageUploader/ImageUploader";
import ImageScanner from "./pages/ImageScanner/ImageScanner";
import dataContext from "./Store/DataContext";
import CsvUploader from "./pages/CsvUploader/CsvUploader";
import HomePage from "./components/Navbar/Navbar";
import TemplateMapping from "./pages/TemplateMapping/TemplateMapping";
import HomePageTest from "./pages/HomePageTest";
import ResultGenerationProvider from "./Store/ResultGenerationProvider";
import TaskManager from "./pages/TaskManager/TaskManager";
import DataMatching from "./pages/DataMatching/DataMatching";
import { onGetVerifiedUserHandler } from "./services/common";
import Navbar from "./components/Navbar/Navbar";
import Profile from "./pages/Auth/Profile";
import Assignee from "./pages/CSV Comparer/Assignee";

function App() {
  const datactx = useContext(dataContext);
  const [user, setUser] = useState({});

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await onGetVerifiedUserHandler();
        setUser(response);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchUserData();
  }, [datactx]);

  const role = user?.user?.role;
  const permissions = user?.user?.permissions;

  return (
    <Router>
      {datactx.isLogin && <Navbar />}
      <Routes>
        {datactx.isLogin && (
          <>
            {/* <Route path="/home" element={""} /> */}
            {role === "Admin" && (
              <>
                <Route path="/profile" element={<Profile />} />
                <Route path="/create-user" element={<CreateUser />} />
                <Route path="/all-user" element={<AllUser />} />
              </>
            )}

            {/* ------comparecsv----------- */}
            {(role === "Admin" ||
              role === "Moderator" ||
              role === "Operator") &&
              permissions.comparecsv && (
                <>
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/comparecsv" element={<CsvHomepage />} />
                  <Route
                    path="/comparecsv/assign_operator"
                    element={<Assignee />}
                  />
                </>
              )}
            {/* ------------------dataEntry------------------ */}
            {(role === "Admin" ||
              role === "Moderator" ||
              role === "Operator") &&
              permissions.dataEntry && (
                <>
                  <Route path="/datamatching" element={<DataMatching />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route
                    path="datamatching/correct_compare_csv"
                    element={<Correction />}
                  />
                </>
              )}
            {/* -----------------csvuploader------------------- */}
            {(role === "Admin" ||
              role === "Moderator" ||
              role === "Operator") &&
              permissions.csvuploader && (
                <>
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/csvuploader" element={<CsvUploader />} />
                  <Route
                    path="/csvuploader/templatemap/:id"
                    element={<TemplateMapping />}
                  />
                  <Route
                    path="/csvuploader/taskAssign/:id"
                    element={<TaskManager />}
                  />
                </>
              )}
            {/* ---------createTemplate------------ */}
            {(role === "Admin" ||
              role === "Moderator" ||
              role === "Operator") &&
              permissions.createTemplate && (
                <>
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/imageuploader" element={<ImageUploader />} />
                  <Route
                    path="/imageuploader/scanner"
                    element={<ImageScanner />}
                  />
                </>
              )}

            {(role === "Admin" ||
              role === "Moderator" ||
              role === "Operator") &&
              permissions.resultGenerator && (
                <>
                  <Route
                    path="/resultGeneration"
                    element={
                      <ResultGenerationProvider>
                        <HomePageTest />
                      </ResultGenerationProvider>
                    }
                  />
                  <Route path="/profile" element={<Profile />} />
                </>
              )}

            <Route
              path="*"
              element={
                <PageNotFound errorMessage="Page Not Found" errorCode="404" />
              }
            />
          </>
        )}

        {!datactx.isLogin && (
          <>
            <Route path="/" element={<Login />} />
            <Route
              path="*"
              element={
                <PageNotFound
                  errorMessage="User Not Authorised"
                  errorCode="401"
                />
              }
            />
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;
