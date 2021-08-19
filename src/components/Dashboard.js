import axios from "axios";
import { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import CreateThread from "./CreateThreadForm";
import UserThreadList from "./UserThreadList";

export default function Dashboard({user}) {

  return(
    <div className="dashboard-wrapper">
      <h2>Dashboard</h2>
      <h3>Welcome, {user.username}</h3>
      <CreateThread user={user}/>
      <UserThreadList user={user}/>
    </div>
  );
}