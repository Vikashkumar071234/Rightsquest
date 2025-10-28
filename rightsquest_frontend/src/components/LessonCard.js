import React from 'react';
export default function LessonCard({ lesson }){ return (<div className='lesson-card'><h3>{lesson.title}</h3><p>{lesson.content}</p><p><strong>Points:</strong> {lesson.points}</p></div>); }
