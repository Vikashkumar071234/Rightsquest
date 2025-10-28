import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LessonsList from './components/LessonsList';
import './App.css';
function Home(){ return (<div style={{padding:20}}><h2>Welcome to RightsQuest</h2><p>Learn your rights through fun lessons!</p></div>); }
export default function App(){ return (<Router><div><Routes><Route path='/' element={<Home/>} /><Route path='/lessons' element={<LessonsList/>} /></Routes></div></Router>); }
