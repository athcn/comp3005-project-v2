import { useContext, useEffect, useState } from "react";
import { Button, Card, Table } from "react-bootstrap"
import { useRestApi } from "../../../../../sharedHooks/useRestApi";
import { AuthContext } from "../../../../Auth/AuthProvider";

export const timeSegments = [
  "09:00", 
  "09:30", 
  "10:00", 
  "10:30", 
  "11:00", 
  "11:30", 
  "12:00", 
  "12:30", 
  "13:00", 
  "13:30", 
  "14:00", 
  "14:30", 
  "15:00", 
  "15:30", 
  "16:00", 
  "16:30", 
  "17:00", 
  "17:30", 
  "18:00", 
  "18:30", 
  "19:00", 
  "19:30", 
  "20:00", 
  "20:30", 
  "21:00"
];

interface TimetableOverviewProps {
  refresh: boolean
}

export const TimetableOverview = ({refresh}: TimetableOverviewProps) => {
  const {getFormatedUrl} = useRestApi();
  const {userId} = useContext(AuthContext);
  const [schedules, setSchedules] = useState<any>([]);
  
  useEffect(() => {
    if (!userId) return;
    const params = new URLSearchParams({ trainerId: userId });
    fetch(getFormatedUrl(`trainer/schedules?${params.toString()}`))
      .then(response => {
        if (!response.ok) {
          throw "Failed to retrieve schedules";
        } 
        return response.json()
      })
      .then(data => {
        setSchedules(data.schedules);
      })
      .catch(error => console.log(error));
  }, [refresh])

  return (
    <Card>
      <Card.Header className="h3 text-primary"><b>Timetable Overview</b></Card.Header>
      <Card.Body>
        <Table>
          <thead>
            <tr>
              <th>Time</th>
              <th>Sunday</th>
              <th>Monday</th>
              <th>Tuesday</th>
              <th>Wednesday</th>
              <th>Thursday</th>
              <th>Friday</th>
              <th>Saturday</th>
            </tr>
          </thead>
          <tbody>
            {
              timeSegments.map((time) => {
                return (
                  <tr>
                    <th>{time}</th>
                    {
                      schedules.map(day => {
                        if (day.some(schedule => withinTime(schedule.startTime, schedule.endTime, time))) {
                          return <td className="bg-success"/>
                        }
                        return <td className="bg-secondary" />
                      })
                    }
                  </tr>
                )
              })
            }
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  )
}

export const withinTime = (startingTime: string, endingTime: string, currentTime: string) => {
  const start = new Date();
  start.setHours(Number(startingTime.split(":")[0]));
  start.setMinutes(Number(startingTime.split(":")[1]));

  const end = new Date();
  end.setHours(Number(endingTime.split(":")[0]));
  end.setMinutes(Number(endingTime.split(":")[1]));

  const current = new Date();
  current.setHours(Number(currentTime.split(":")[0]));
  current.setMinutes(Number(currentTime.split(":")[1]));

  return (start <= current && end > current);
}