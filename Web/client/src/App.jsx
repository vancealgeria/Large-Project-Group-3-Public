import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout";
import Login from "./pages/users/Login";
import Register from "./pages/users/Register";
import Verify from "./pages/users/Verify";
import VerifyChangeEmail from "./pages/users/VerifyChangeEmail";
import Dashboard from "./pages/users/Dashboard";
import Home from "./pages/posts/Home";
import Create from "./pages/posts/Create";
import Update from "./pages/posts/Update";
import ReDirect from "./pages/users/ReDirect";
import Recoverybegin from "./pages/users/Recoverybegin";
import Recoverymiddle from "./pages/users/Recoverymiddle";
import Recoveryend from "./pages/users/Recoveryend";
import GuestRoutes from "./Routes/GuestRoutes";
import ValidRoutes from "./Routes/ValidRoutes";
import VerifyRoutes from "./Routes/VerifyRoutes";
import RecoveryMiddleRoutes from "./Routes/RecoveryMiddleRoutes";
import RecoveryEndRoutes from "./Routes/RecoveryEndRoutes";
import Record from "./pages/users/Record";
import Sleep from "./pages/users/Sleep";
import Work from "./pages/users/Work";
import Leisure from "./pages/users/Leisure";
import Leaderboard from "./pages/users/Leaderboard";
import EditTodaysStuff from "./pages/users/editTodaysStuff.jsx";
import EditHistoricalRecord from "./pages/users/editHistoricalRecord.jsx";
import History from "./pages/users/History";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<ReDirect />} />

          <Route element={<RecoveryMiddleRoutes />}>
            <Route path="recoverymiddle" element={<Recoverymiddle />} />
          </Route>

          <Route element={<RecoveryEndRoutes />}>
            <Route path="recoveryend" element={<Recoveryend />} />
          </Route>

          <Route element={<VerifyRoutes />}>
            <Route path="verify" element={<Verify />} />
            <Route path="verifychangeemail" element={<VerifyChangeEmail />} />
          </Route>

          <Route element={<ValidRoutes />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="record" element={<Record />} />
            <Route path="sleep" element={<Sleep />} />
            <Route path="work" element={<Work/>} />
            <Route path="leisure" element={<Leisure />} />
            <Route path="leaderboard" element={<Leaderboard />} />
            <Route path="history" element={<History/>} />
            <Route path="create" element={<Create />} />
            <Route path="update" element={<Update />} />
            <Route path="edittodaysstuff" element={<EditTodaysStuff />} />
            <Route path="edithistoricalrecord" element={<EditHistoricalRecord />} />
          </Route>

          <Route element={<GuestRoutes />}>
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="recovery" element={<Recoverybegin />} />
          </Route>
          
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
export default App;
