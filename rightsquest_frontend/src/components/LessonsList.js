import React, { useEffect, useState } from 'react';
import LessonCard from './LessonCard';
export default function LessonsList(){ const [lessons, setLessons] = useState([]);
  useEffect(()=>{ fetch('http://127.0.0.1:8000/api/lessons/').then(r=> r.json()).then(data=> setLessons(data)).catch(e=> console.error(e)); },[]);
  return (<div style={{padding:16}}><h2>Lessons</h2>{lessons.length === 0 ? <p>No lessons available.</p> : (<div className='lessons-container'>{lessons.map(l => <LessonCard key={l.id} lesson={l} />)}</div>)}</div>);
}
