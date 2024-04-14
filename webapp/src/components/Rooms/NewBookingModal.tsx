import { useEffect, useState } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import { useRestApi } from "../../sharedHooks/useRestApi";

interface NewBookingModalProps {
  show: boolean;
  setShow: (shouldShow: boolean) => void;
}

export const NewBookingModal = ({show, setShow}: NewBookingModalProps) => {
  const {getFormatedUrl} = useRestApi();
  const [rooms, setRooms] = useState<any>([]);
  const [roomId, setRoomId] = useState("default");
  const [sessions, setSessions] = useState<any>([]);
  const [sessionId, setSessionId] = useState("default");
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("09:00");
  const [type, setType] = useState("group");

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

    fetch(getFormatedUrl(`admin/rooms`))
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw response.status;
    })
    .then(data => {
      setRooms(data.rooms);
    })
  }, [show])


  // Fetching the new trainers availability
  useEffect(() => {
    if (sessionId == "" || sessionId == "default") return;

    const params = new URLSearchParams({ sessionId: sessionId });
    fetch(getFormatedUrl(`admin/session?${params.toString()}`))
      .then(response => {
        if (!response.ok) {
          throw "Failed to retrieve schedules";
        } 
        return response.json()
      })
      .then(data => {
        setDate(new Date(data.session.date).toISOString().split("T")[0]);
        setStartTime(data.session.startTime);
        setEndTime(data.session.endTime);
        setType(data.session.type);
      })
      .catch(error => console.log(error));
  }, [sessionId])

  const createBooking = () => {
    if (!sessionId || !roomId) return;

    fetch(getFormatedUrl('admin/create-booking'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sessionId,
        roomId
      })
    }).then(response => {
      if (response.ok) {
        setShow(false);
      }
    });
  }

  const onClose = () => {
    setShow(false);
  }

  return (
    <Modal show={show} onHide={onClose} size="xl">
      <Modal.Header closeButton>
        <Modal.Title className="text-primary">
          <b>Create a new room booking</b>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Row>
            <Col sm={6}>
              <Form.Group className="mb-3">
                <Form.Label>Unbooked Sessions</Form.Label>
                <Form.Select value={sessionId} onChange={(value) => setSessionId(value.target.value)}>
                  <option disabled value="default">Select a session</option>
                  {
                    sessions.map(session => {
                      return (
                        <option value={session.sessionId}>{`${new Date(session.date).toISOString().split("T")[0]} | ${session.startTime} | ${session.endTime} | ${session.type}`}</option>
                      )
                    })
                  }
                </Form.Select>
              </Form.Group> 
            </Col>
            <Col sm={6}>
              <Form.Group className="mb-3">
                <Form.Label>Room number</Form.Label>
                <Form.Select value={roomId} onChange={(value) => setRoomId(value.target.value)}>
                  <option disabled value="default">Select a room</option>
                  {
                    rooms.map(room => {
                      return (
                        <option value={room.roomId}>{room.roomNumber}</option>
                      )
                    })
                  }
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col sm={6}>
              <Form.Group className="mb-3">
                <Form.Label>Session Date</Form.Label>
                <Form.Control type="date" value={date} readOnly/>
              </Form.Group>
            </Col>
            <Col sm={6}>
              <Form.Group className="mb-3">
                <Form.Label>Session type</Form.Label>
                <Form.Control type="text" disabled value={type == "group" ? "Group" : "Personal"} />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col sm={6}>
              <Form.Group className="mb-3">
                <Form.Label>Starting Time</Form.Label>
                <Form.Control type="text" disabled value={startTime} />
              </Form.Group> 
            </Col>
            <Col sm={6}>
              <Form.Group className="mb-3">
                <Form.Label>Ending Time</Form.Label>
                <Form.Control type="text" disabled value={endTime}/>
              </Form.Group>
            </Col>
          </Row>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button type="button" variant="primary" onClick={createBooking}>
          Create booking for session
        </Button>
        <Button type="button" variant="secondary" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  )
}