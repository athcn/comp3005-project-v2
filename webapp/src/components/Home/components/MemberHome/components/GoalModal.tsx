import { useContext, useEffect, useState } from "react";
import { Button, Modal, Form, InputGroup } from "react-bootstrap";
import { useRestApi } from "../../../../../sharedHooks/useRestApi";
import { AuthContext } from "../../../../Auth/AuthProvider";


interface GoalModalProps {
  show: boolean;
  setShow: (shouldShow: boolean) => void;
  goalId: string | null;
  setGoalId: (id: string | null) => void;
}

export const GoalModal = ({show, setShow, goalId, setGoalId}: GoalModalProps) => {
  const {getFormatedUrl} = useRestApi();
  const {userId} = useContext(AuthContext);
  const [description, setDescription] = useState('');
  const [weight, setWeight] = useState<number | null>(null);
  const [duration, setDuration] = useState<number | null>(null);
  const [achieveBy, setAchieveBy] = useState<string | null>(null);

  useEffect(() => {
    if (goalId) {
      console.log("goal id provided");
      const params = new URLSearchParams({ goalId: goalId });
      fetch(getFormatedUrl(`member/goal?${params.toString()}`))
      .then(response => {
        if (!response.ok) {
          throw "error";
        } 
        return response.json()
      })
      .then(data => {
        setDescription(data.description);
        setWeight(data.weight || '');
        setDuration(data.duration || '');
        setAchieveBy(data.achieve_by || '');
      }).catch(error => {
        console.error("New Error", error);
      }) 
    } else if (show) {
      setDescription('');
      setWeight(null);
      setDuration(null);
      setAchieveBy(null);
    }
  }, [goalId, show]);

  const onClose = () => {
    setShow(false);
    setGoalId(null);
  }

  const createGoal = () => {
    if (!userId) return;

    fetch(getFormatedUrl('member/create-goal'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        memberId: userId, 
        description, 
        weight, 
        duration, 
        achieveBy
      })
    }).then(response => {
      if (response.ok) {
        setShow(false);
      }
    });
  }

  const updateGoal = () => {
    if (!goalId) return;

    fetch(getFormatedUrl('member/update-goal'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        goalId, 
        description, 
        weight, 
        duration, 
        achieveBy
      })
    }).then(response => {
      if (response.ok) {
        setShow(false);
      }
    });
  }

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title className="text-primary">
          <b>{goalId ? "Update Fitness Goal" : "New Fitness Goal"}</b>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Goal Description</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter goal description"
              value={description}
              onChange={value => setDescription(value.target.value)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Weight (if applicable)</Form.Label>
            <InputGroup className="mb-3">
              <Form.Control
                type="number"
                placeholder="Enter the weight"
                value={weight || ''}
                onChange={value => setWeight(Number(value.target.value))}
              />
              <InputGroup.Text>lbs</InputGroup.Text>
            </InputGroup>
          </Form.Group>
          <Form.Group>
            <Form.Label>Duration (if applicable)</Form.Label>
            <InputGroup className="mb-3">
              <Form.Control
                type="number"
                placeholder="Enter the time in minutes"
                value={duration || ''}
                onChange={value => setDuration(Number(value.target.value))}
              />
              <InputGroup.Text>mins</InputGroup.Text>
            </InputGroup>
          </Form.Group>
          <Form.Group>
            <Form.Label>Achieve By (optional)</Form.Label>
            <Form.Control
              type="date"
              value={achieveBy || ''}
              onChange={value => setAchieveBy(value.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button type="button" variant="primary" onClick={goalId ? updateGoal : createGoal}>
          {goalId ? "Update goal" : "Create goal"}
        </Button>
        <Button type="button" variant="secondary" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  )
}