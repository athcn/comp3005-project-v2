import { useContext, useEffect, useState } from "react";
import { Alert, Button, Col, Form, Modal, Row } from "react-bootstrap";
import { useRestApi } from "../../../../sharedHooks/useRestApi";
import { AuthContext } from "../../../Auth/AuthProvider";
import { timeSegments, withinTime } from "../../../Home/components/TrainerHome/components/TimetableOverview";

interface NewSessionModalProps {
  show: boolean;
  setShow: (shouldShow: boolean) => void;
  sessionId: string;
  setSessionId: (sessionId: string) => void;
}

export const RescheduleModal = ({show, setShow, sessionId, setSessionId}: NewSessionModalProps) => {
  const {getFormatedUrl} = useRestApi();
  const {userId} = useContext(AuthContext);
  const [availability, setAvailability] = useState<any>([]);
  const [refresh, setRefresh] = useState(false);
  const [trainerName, setTrainerName] = useState("");
  const [trainerId, setTrainerId] = useState("default");
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("09:00");
  const [type, setType] = useState("personal");
  const [alert, setAlert] = useState('');
  const [scheduleIndex, setScheduleIndex] = useState(0);
  const [dropdown, setDropdown] = useState<(JSX.Element | null)[]>();

  useEffect(() => {
    setAlert('');
    if (!sessionId || sessionId == "") return;
    const params = new URLSearchParams({ sessionId: sessionId });

    // Fetch the current session data
    fetch(getFormatedUrl(`member/session?${params.toString()}`))
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response failed');
      } 
      return response.json();
    })
    .then(data => {
      setTrainerId(data.session.trainerId);
      setTrainerName(data.session.trainerName);
      newDateChosen(new Date(data.session.date).toISOString().split("T")[0]);
      setStartTime(data.session.startTime);
      setEndTime(data.session.endTime);
      setType(data.session.type);
    })
  }, [show, sessionId]);


  // Fetching the new trainers availability
  useEffect(() => {
    if (trainerId == "" || trainerId == "default") return;
    console.log("Hello");

    const params = new URLSearchParams({ trainerId: trainerId });
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
  }, [trainerId])

  // Refreshes the time drop downs for selecting
  useEffect(() => {
    const availableTime = timeSegments.map(time => {
      if (availability.length != 7) return null;

      if (availability[scheduleIndex].some(schedule => withinTime(schedule.startTime, schedule.endTime, time))) {
        return <option key={time} value={time}>{time}</option>
      }
      return <option disabled key={time} value={time}>{time}</option>
    })

    setDropdown(availableTime)
  }, [scheduleIndex, trainerId, availability])

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
    if (!trainerId || !userId) return;

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

    fetch(getFormatedUrl('member/create-session'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        trainerId,
        memberId: userId,
        date,
        startTime,
        endTime,
        type,
      })
    }).then(response => {
      if (response.ok) {
        setAlert("Created!")
      }
    });
  }

  const onClose = () => {
    setSessionId("");
    setShow(false);
  }

  return (
    <Modal show={show} onHide={onClose} size="xl">
      <Modal.Header closeButton>
        <Modal.Title className="text-primary">
          <b>Reschedule Session</b>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {alert != "" ? <Alert variant="danger">{alert}</Alert> : null}
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Trainer: {trainerName}</Form.Label>
          </Form.Group> 
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
                  <option value="personal" disabled>Personal</option>
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
          Reschedule session
        </Button>
        <Button type="button" variant="secondary" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  )
}