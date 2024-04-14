import { Card, Form, InputGroup, Modal, Table } from "react-bootstrap"
import { useRestApi } from "../../sharedHooks/useRestApi";
import { useEffect, useState } from "react";

interface ProfileModalProps {
  show: boolean;
  setShow: (shouldShow: boolean) => void;
  memberId: string | null,
  setMemberId: (id: string | null) => void;
}

export const ProfileModal = ({show, setShow, memberId, setMemberId}: ProfileModalProps) => {
  const {getFormatedUrl} = useRestApi();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [currentWeight, setCurrentWeight] = useState<number | null>(null);
  const [avgSleep, setAvgSleep] = useState<number | null>(null);
  const [bodyFatPercentage, setBodyFatPercentage] = useState<number | null>(null);
  const [goals, setGoals] = useState<any>([]);

  useEffect(() => {
    console.log(memberId);
    if (!memberId) return;
    
    const params = new URLSearchParams({ userId: memberId });
    fetch(getFormatedUrl(`member/profile?${params.toString()}`))
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response failed');
        } 
        return response.json();
      })
      .then(data => {
        setFirstName(data.firstName);
        setLastName(data.lastName);

        if (data.currentWeight != currentWeight) setCurrentWeight(data.currentWeight);
        if (data.avgSleep != avgSleep) setAvgSleep(data.avgSleep);
        if (data.bodyFatPercentage != bodyFatPercentage) setBodyFatPercentage(data.bodyFatPercentage);
      })
      .catch(error => {
        console.error("There was a problem with fetching the profile data ", error);
      })

      fetch(getFormatedUrl(`member/goals?${params.toString()}`))
      .then(response => {
        if (!response.ok) {
          throw "Failed to retrieve goals";
        } 
        return response.json()
      })
      .then(data => {
        // Parsing data for viewing
        const goals = data.goals.map((goal) => {
          const newGoal = {
            goalId: goal.goal_id,
            description: goal.description,
            weight: goal.weight,
            duration: goal.duration,
            achieveBy: goal.achieve_by,
          }
          
          return newGoal;
        })

        setGoals(goals);
      })
      .catch(error => console.log(error));
  }, [memberId])

  const onClose = () => {
    setMemberId(null);
    setShow(false);
  }

  return (
    <Modal show={show} onHide={onClose} size="lg">
      <Card>
        <Card.Header as="h4">Profile</Card.Header>
        <Card.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>First Name</Form.Label>
              <Form.Control 
                type="text" 
                value={firstName}
                disabled
              />
              <Form.Label>Last Name</Form.Label>
              <Form.Control 
                type="text" 
                value={lastName}
                disabled
              />
              <Form.Label>Current Weight</Form.Label>
              <InputGroup className="mb-2">
                <Form.Control 
                  type="text" 
                  value={currentWeight || ''}
                  disabled
                />
                <InputGroup.Text>kg</InputGroup.Text>
              </InputGroup>
              <Form.Label>Average Daily Sleep</Form.Label>
              <InputGroup className="mb-2">
                <Form.Control 
                  type="text"  
                  value={avgSleep || ''}
                  disabled
                />
                <InputGroup.Text>hours</InputGroup.Text>
              </InputGroup>
              <Form.Label>Body Fat Percentage</Form.Label>
              <InputGroup className="mb-2">
                <Form.Control 
                  type="text" 
                  value={bodyFatPercentage || ''}
                  disabled
                />
                <InputGroup.Text>%</InputGroup.Text>
              </InputGroup>
            </Form.Group>
          </Form>
        </Card.Body>
        <Card.Header as="h4">Goals</Card.Header>
        <Card.Body>
          <Table responsive>
            <thead>
              <tr>
                <th>Goal Description</th>
                <th>Weight (lbs)</th>
                <th>Duration (mins)</th>
                <th>Achieve By</th>
              </tr>
            </thead>
            <tbody>
              {
                goals.map((goal) => {
                  const date = goal.achieveBy ? (new Date(goal.achieveBy)).toISOString().split("T")[0] : "Indefinite";
                  return (
                    <tr key={goal.goalId}>
                      <td>{goal.description}</td>
                      <td>{goal.weight || ''}</td>
                      <td>{goal.duration || ''}</td>
                      <td>{date}</td>
                    </tr>
                  )
                })
              }
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Modal>
  )
}