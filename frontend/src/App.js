import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import "shards-ui/dist/css/shards.min.css";

import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import CampaignsPage from "./pages/CampaignsPage";
import FundingRequestPage from "./pages/FundingRequestPage";

function App() {
  return (
    <Router>
      <Navbar />

      <Switch>
        <Route path="/request">
          <FundingRequestPage />
        </Route>
        <Route path="/">
          <CampaignsPage />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
