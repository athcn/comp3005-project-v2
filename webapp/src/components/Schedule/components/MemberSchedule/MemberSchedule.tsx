import { useContext, useEffect, useState } from "react";
import { Button, Card, Row, Table } from "react-bootstrap"
import { useRestApi } from "../../../../sharedHooks/useRestApi";
import { AuthContext } from "../../../Auth/AuthProvider";
import { SessionModal } from "./SessionModal";
import { RescheduleModal } from "./RescheduleModal";

export const MemberSchedule = () => {
  const {getFormatedUrl} = useRestApi();
  const {userId} = useContext(AuthContext);
  const [refresh, setRefresh] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const [sessions, setSessions] = useState<any>([]);

  useEffect(() => {
    if (!userId) return;

    const params = new URLSearchParams({ userId: userId });
    fetch(getFormatedUrl(`member/sessions?${params.toString()}`))
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
  
  const openRescheduleModal = (sessionId: string) => {
    setSessionId(sessionId);
    setShowRescheduleModal(true);
  }

  const unregister = (sessionId: string) => {
    const params = new URLSearchParams({ sessionId: sessionId });
    fetch(getFormatedUrl(`member/unregister-session?${params.toString()}`), {
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
      <SessionModal show={showModal} setShow={setShowModal}/>
      <RescheduleModal show={showRescheduleModal} setShow={setShowRescheduleModal} sessionId={sessionId} setSessionId={setSessionId} />
      <Card.Header className="h3 text-primary"><b>Upcoming Registered Sessions</b></Card.Header>
      <Card.Body>
        <Row className="mb-3 ms-2 me-2">
          <Button variant="primary" type="button" onClick={openModal}>
            Create/Join a session
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
                <th>Room Number</th>
                <th>Session Type</th>
                <th></th>
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
                        <Button type="button" variant="secondary" disabled={session.type == "group"} onClick={() => openRescheduleModal(session.sessionId)}>
                          Reschedule
                        </Button>
                      </td>
                      <td>
                        <Button type="button" variant="danger" onClick={() => unregister(session.sessionId)}>
                          Unregister
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