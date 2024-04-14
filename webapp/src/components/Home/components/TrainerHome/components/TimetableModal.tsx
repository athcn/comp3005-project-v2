import { useContext, useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { timeSegments } from "./TimetableOverview";
import { useRestApi } from "../../../../../sharedHooks/useRestApi";
import { AuthContext } from "../../../../Auth/AuthProvider";

interface TimetableModalProps {
  show: boolean;
  setShow: (shouldShow: boolean) => void;
  scheduleId: string | null,
  setScheduleId: (id: string | null) => void;
  refresh: boolean,
  setRefresh: (refresh: boolean) => void;
}

export const daysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
]

export const TimetableModal = ({show, setShow, scheduleId, setScheduleId, refresh, setRefresh}: TimetableModalProps) => {
  const {getFormatedUrl} = useRestApi();
  const {userId} = useContext(AuthContext);
  const [selectedDay, setSelectedDay] = useState<string>(daysOfWeek[0]);
  const [startingTime, setStartingTime] = useState<string>(timeSegments[0]);
  const [endingTime, setEndingTime] = useState<string>(timeSegments[0]); 

  const addSchedule = () => {
    fetch(getFormatedUrl('trainer/create-schedule'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        trainerId: userId,
        day: selectedDay,
        startingTime,
        endingTime,
      })
    }).then(response => {
      if (response.ok) {
        onClose();
      }
    });
  }

  const onClose = () => {
    setRefresh(!refresh);
    setScheduleId(null);
    setShow(false);
  }
  return (
    <Modal show={show} onHide={onClose} size="xl">
      <Modal.Header closeButton>
        <Modal.Title className="text-primary">
          <b>{scheduleId ? "Update Schedule" : "Add a Schedule"}</b>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Day of the Week</Form.Label>
            <Form.Select value={selectedDay} onChange={(value) => setSelectedDay(value.target.value)}>
              {
                daysOfWeek.map(day => {
                  return (
                    <option value={day}>{day}</option>
                  )
                })
              }
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Starting Time</Form.Label>
            <Form.Select value={startingTime} onChange={(value) => setStartingTime(value.target.value)}>
              {
                timeSegments.map(segment => {
                  return (
                    <option value={segment}>{segment}</option>
                  )
                })
              }
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Ending Time</Form.Label>
            <Form.Select value={endingTime} onChange={(value) => setEndingTime(value.target.value)}>
              {
                timeSegments.map(segment => {
                  return (
                    <option value={segment}>{segment}</option>
                  )
                })
              }
            </Form.Select>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button type="button" variant="primary" onClick={addSchedule}>
          {scheduleId ? "Update schedule" : "Add schedule"}
        </Button>
        <Button type="button" variant="secondary" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  )
}