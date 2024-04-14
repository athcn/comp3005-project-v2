/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { Button, Card, Row, Table } from "react-bootstrap"
import { useRestApi } from "../../../../sharedHooks/useRestApi";
import { NewSessionModal } from "./NewSessionModal";

export const AdminSchedule = () => {
  const {getFormatedUrl} = useRestApi();
  const [refresh, setRefresh] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [sessions, setSessions] = useState<any>([]);

  useEffect(() => {
    fetch(getFormatedUrl(`admin/sessions`))
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw response.status;
    })
    .then(data => {
      setSessions(data.sessions);
    })
  }, [refresh, showModal])

  const openModal = () => {
    setShowModal(true);
  }

  const deleteSession = (sessionId: string) => {
    const params = new URLSearchParams({ sessionId: sessionId });
    fetch(getFormatedUrl(`admin/delete-session?${params.toString()}`), {
      method: "DELETE",
    })
    .then(response => {
      if (!response.ok) {
        console.log("Failed to delete");
      } else {
        console.log("Deleted successfully");
        setRefresh(!refresh);
      }
    })
  }

  return (
    <Card className="mt-4 ms-3 me-3">
      <NewSessionModal show={showModal} setShow={setShowModal} />
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
                <th>Trainer Name</th>
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
                      <td>{session.trainerName}</td>
                      <td>{session.type == "group" ? "Group" : "Personal"}</td>
                      <td>
                        <Button type="button" variant="danger" onClick={() => deleteSession(session.sessionId)}>
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