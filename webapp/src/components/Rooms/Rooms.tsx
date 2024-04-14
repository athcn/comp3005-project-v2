/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { Accordion, Button, Card, Row, Table } from "react-bootstrap"
import { useRestApi } from "../../sharedHooks/useRestApi";
import { NewBookingModal } from "./NewBookingModal";

export const Rooms = () => {
  const {getFormatedUrl} = useRestApi();
  const [refresh, setRefresh] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [bookings, setBookings] = useState<any>([]);
  const [sessions, setSessions] = useState<any>([]);

  useEffect(() => {
    fetch(getFormatedUrl(`admin/room-bookings`))
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw response.status;
    })
    .then(data => {
      setBookings(data.bookings);
    })
  }, [refresh, showModal])

  const openModal = () => {
    setShowModal(true);
  }

  const deleteBooking = (sessionId: string) => {
    const params = new URLSearchParams({ sessionId: sessionId });
    fetch(getFormatedUrl(`admin/delete-booking?${params.toString()}`), {
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

  const generateSessionTable = (sessionData: any[]) => {
    return (
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
          sessionData.map(session => {
            return (
              <tr key={session.sessionId}>
                <td>{new Date(session.date).toISOString().split("T")[0]}</td>
                <td>{session.startTime}</td>
                <td>{session.endTime}</td>
                <td>{session.trainerName}</td>
                <td>{session.type == "group" ? "Group" : "Personal"}</td>
                <td>
                  <Button type="button" variant="danger" onClick={() => deleteBooking(session.sessionId)}>
                    Delete Booking
                  </Button>
                </td>
              </tr>
            )
          })
        }
      </tbody>
    </Table>
    )
  }

  return (
    <Card className="mt-4 ms-3 me-3">
      <NewBookingModal show={showModal} setShow={setShowModal} />
      <Card.Header className="h3 text-primary"><b>Room Management</b></Card.Header>
      <Card.Body>
        <Row className="mb-3 ms-2 me-2">
          <Button variant="primary" type="button" onClick={openModal}>
            Create a new room booking
          </Button>
        </Row>
        {`Today: ${new Date().toISOString().split("T")[0]}`}
        {
          bookings.map(room => {
            return (
              <Accordion>
                <Accordion.Header>{room[0].roomName}</Accordion.Header>
                <Accordion.Body>
                  {
                    generateSessionTable(room.slice(1))
                  }
                </Accordion.Body>
              </Accordion>
            )
          })
        }
      </Card.Body>
    </Card>
  )
}