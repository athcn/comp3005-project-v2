import { useContext, useEffect, useState } from "react";
import { Button, Card, Row, Table } from "react-bootstrap"
import { useRestApi } from "../../../../sharedHooks/useRestApi";
import { AuthContext } from "../../../Auth/AuthProvider";
import { NewSessionModal } from "./NewSessionModal";

export const TrainerSchedule = () => {
  const {getFormatedUrl} = useRestApi();
  const {userId} = useContext(AuthContext);
  const [refresh, setRefresh] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [sessions, setSessions] = useState<any>([]);
  const [availability, setAvailability] = useState<any>([]);

  useEffect(() => {
    if (!userId) return;

    const params = new URLSearchParams({ trainerId: userId });
    fetch(getFormatedUrl(`trainer/sessions?${params.toString()}`))
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw response.status;
    })
    .then(data => {
      setSessions(data.sessions);
    })

    fetch(getFormatedUrl(`trainer/schedules?${params.toString()}`))
      .then(response => {
        if (!response.ok) {
          throw "Failed to retrieve schedules";
        } 
        return response.json()
      })
      .then(data => {
        setAvailability(data.schedules);
      })
      .catch(error => console.log(error));
  }, [refresh, showModal])

  const openModal = () => {
    setShowModal(true);
  }

  return (
    <Card className="mt-4 ms-3 me-3">
      <NewSessionModal show={showModal} setShow={setShowModal} availability={availability} setAvailability={setAvailability}/>
      <Card.Header className="h3 text-primary"><b>Upcoming Sessions</b></Card.Header>
      <Card.Body>
        <Row className="mb-3 ms-2 me-2">
          <Button variant="primary" type="button" onClick={openModal}>
            Create a new session
          </Button>
        </Row>
        {`Today: ${new Date().toISOString().split("T")[0]}`}
        <Table responsive>
            <thead>
              <tr>
                <th>Session Date</th>
                <th>Start Time</th>
                <th>End Time</th>
                <th>Session Type</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {
                sessions.map(session => {
                  return (
                    <tr key={session.sessionId}>
                      <td>{new Date(session.date).toISOString().split("T")[0]}</td>
                      <td>{session.startTime}</td>
                      <td>{session.endTime}</td>
                      <td>{session.type == "group" ? "Group" : "Personal"}</td>
                      <td>
                        <Button type="button" variant="danger">
                          Delete
                        </Button>
                      </td>
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