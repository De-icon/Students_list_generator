import  { useState,  } from 'react';
import { studentsData } from './data';
import jsPDF from 'jspdf';

export const StudentGrouping = () => {
  const [groupSize, setGroupSize] = useState();
  const [groups, setGroups] = useState([]);

  const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const generateGroups = (students, size, random = false) => {
    const sortedStudents = random
      ? shuffleArray(students)
      : [...students].sort((a, b) => a.id - b.id);

    const newGroups = [];
    for (let i = 0; i < sortedStudents.length; i += size) {
      newGroups.push(sortedStudents.slice(i, i + size));
    }
    setGroups(newGroups);
  };

  const handleRandomGroups = () => {
    generateGroups(studentsData, groupSize, true);
  };

  const handleIdGroups = () => {
    generateGroups(studentsData, groupSize, false);
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    let yOffset = 10;

    groups.forEach((group, index) => {
      doc.setFontSize(16);
      doc.text(`Group ${index + 1}`, 10, yOffset);
      yOffset += 10;

      doc.setFontSize(12);
      group.forEach((student) => {
        doc.text(`${student.name} ------ 23/${student.Rgn}`, 20, yOffset);
        yOffset += 7;
      });

      yOffset += 10;

      if (yOffset > 280) {
        doc.addPage();
        yOffset = 10;
      }
    });

    doc.save("student_groups.pdf");
  };


  return (
    <div className="p-4">
      <div className="mb-4">
        <input
        style={{padding: "10px", margin: "10px 0"}}
          type="number"
          value={groupSize}
          onChange={(e) => setGroupSize(parseInt(e.target.value))}
          placeholder="Enter group size"
          className="mr-2"
        />
        <div>
            <button onClick={handleRandomGroups} className="mr-2">Generate Random Groups</button>
            <button onClick={handleIdGroups}>Generate Groups by ID</button>
            {groups.length > 0 && (
              <button onClick={generatePDF} className="p-2 bg-red-500 text-white rounded">Download PDF</button>
            )}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {groups.map((group, index) => (
          <div key={index}>
            <div>
              <div style={{fontWeight: 700, fontSize: '1rm'}}>Group {index + 1}</div>
            </div>
            <div>
              <ul style={{listStyle: "none", border: "1px solid #fff", borderRadius: "10px"}}>
                {group.map((student) => (
                  <li key={student.id} >
                    {student.name} ----- 23/{student.Rgn}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

