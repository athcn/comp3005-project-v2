import { useContext, useEffect, useState } from "react";
import { Alert, Button, Col, Form, InputGroup, Modal, Row } from "react-bootstrap";
import { useRestApi } from "../../../../sharedHooks/useRestApi";
import { AuthContext } from "../../../Auth/AuthProvider";
import { timeSegments, withinTime } from "../../../Home/components/TrainerHome/components/TimetableOverview";

interface NewSessionModalProps {
  show: boolean;
  setShow: (shouldShow: boolean) => void;
  availability: any;
  setAvailability: (availability: any) => void;
}

export const NewSessionModal = ({show, setShow, availability, setAvailability}: NewSessionModalProps) => {
  const {getFormatedUrl} = useRestApi();
  const {userId} = useContext(AuthContext);
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("09:00");
  const [type, setType] = useState("group");
  const [alert, setAlert] = useState('');
  const [scheduleIndex, setScheduleIndex] = useState(0);
  const [dropdown, setDropdown] = useState<(JSX.Element | null)[]>();

  useEffect(() => {
    setAlert('');
  }, [show]);

  useEffect(() => {
    const availableTime = timeSegments.map(time => {
      if (availability.length != 7) return null;

      if (availability[scheduleIndex].some(schedule => withinTime(schedule.startTime, schedule.endTime, time))) {
        return <option key={time} value={time}>{time}</option>
      }
      return <option disabled key={time} value={time}>{time}</option>
    })

    setDropdown(availableTime)
  }, [scheduleIndex])

  const newDateChosen = (date: string) => {
    setDate(date);

    // Adjusting dropdowns to new day by changing the index
    // Starting day of .getDay is Monday but we start on Sunday so adjust 
    setScheduleIndex((new Date(date).getDay() + 1) % 7) 
  }

  const changeStartTime = (time: string) => {
    console.log("start", time);
    setStartTime(time);
  }

  const createSession = () => {
    if (!userId) return;

    // Check to see if there is a valid date entered
    const sessionDate = new Date(date);
    const today = new Date();
    sessionDate.setHours(0,0,0,0);
    today.setHours(0,0,0,0);

    if (date == "" || today > sessionDate) {
      setAlert("Session Date must be set to a later day");
      return;
    }

    // Check to make sure the start time is < end time
    const start = new Date(`2000-01-01T00:${startTime}`);
    const end = new Date(`2000-01-01T00:${endTime}`);

    if (start >= end) {
      setAlert("Start time must be earlier than end time");
      return;
    } 

    fetch(getFormatedUrl('trainer/create-sessions'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        trainerId: userId,
        date,
        startTime,
        endTime,
        type,
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
          <b>Create a new session</b>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {alert != "" ? <Alert variant="danger">{alert}</Alert> : null}
        <Form>
          <Row>
            <Col sm={6}>
              <Form.Group className="mb-3">
                <Form.Label>Session Date</Form.Label>
                <Form.Control type="date" value={date} onChange={(value) => newDateChosen(value.target.value)}/>
              </Form.Group>
            </Col>
            <Col sm={6}>
              <Form.Group className="mb-3">
                <Form.Label>Session type</Form.Label>
                <Form.Select value={type} onChange={(value) => setType(value.target.value)}>
                  <option value="group" disabled>Group</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col sm={6}>
              <Form.Group className="mb-3">
                <Form.Label>Starting Time</Form.Label>
                <Form.Select value={startTime} onChange={(value) => changeStartTime(value.target.value)}>
                  {dropdown}
                </Form.Select>
              </Form.Group> 
            </Col>
            <Col sm={6}>
              <Form.Group className="mb-3">
                <Form.Label>Ending Time</Form.Label>
                <Form.Select value={endTime} onChange={(value) => setEndTime(value.target.value)}>
                  {dropdown}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button type="button" variant="primary" onClick={createSession}>
          Create session
        </Button>
        <Button type="button" variant="secondary" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  )
}