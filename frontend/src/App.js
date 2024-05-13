import "./App.css";
import { Route, BrowserRouter } from "react-router-dom"; // Import BrowserRouter
import Homepage from "./Pages/Homepage";
import ChatPage from "./Pages/ChatPage";
import Header from "./components/miscellaneous/Headermodel";

//sandith
import InsertFeedback from './components/InsertFeedback'
import FeedbackList from './components/FeedbackList'

//senudi
import ProjectList from './components/View1/ProjectList'
import ProjectAndTasks from './components/View2/ProjectAndTasks'; 

//chalaka
import AddDocument from './Pages/AddDocument'
import DocumentList from './Pages/DocumentList';
import Edit from './Pages/Edit';
import DocumentEdita from './Pages/adminEdit';

//pramudi
import NotificationAdmin from "./components/NotificationAdmin";

//vihandu
import Dashboard from "./components/Dashboard";
import ArchitectDashboard from "./components/ArchitectDashboard";
import AdminDashboard from "./components/AdminDashboard";


function App() {
  return (
    <div className="App">
      <BrowserRouter> 
      <Header />
        <Route path="/" component={Homepage} exact />
        <Route path="/chats" component={ChatPage} />
        <Route path="/feedback" component={InsertFeedback} />
        <Route path="/feedbackinsert" component={FeedbackList} />
        <Route path="/taskflow" component={ProjectList} />  {/*View 1*/}
        <Route path="/task/:projectId" component={ProjectAndTasks} />{/*View 2*/}
        <Route path="/AddDocument" element={AddDocument} />
        <Route path="/DocumentList" element={DocumentList} />
        <Route path="/edit/:id" element={Edit} />
        <Route path="/adminEdit/:id" element={DocumentEdita} />
        <Route path="/notification" component={NotificationAdmin}/>
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/architect-dashboard" component={ArchitectDashboard} />
        <Route path="/admin-dashboard" component={AdminDashboard} />
        
      </BrowserRouter>
    </div>
  );
}

export default App;
