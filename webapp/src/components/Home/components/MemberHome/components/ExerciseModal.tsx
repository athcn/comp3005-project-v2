import { useContext, useEffect, useState } from "react";
import { Button, Form, InputGroup, Modal } from "react-bootstrap";
import { useRestApi } from "../../../../../sharedHooks/useRestApi";
import { AuthContext } from "../../../../Auth/AuthProvider";

interface NewExerciseModalProps {
  show: boolean;
  setShow: (shouldShow: boolean) => void;
  exerciseId: string | null,
  setExerciseId: (id: string | null) => void;
}

export const ExerciseModal = ({show, setShow, exerciseId, setExerciseId}: NewExerciseModalProps) => {
  const {getFormatedUrl} = useRestApi();
  const {userId} = useContext(AuthContext);
  const [areaOfFocus, setAreaOfFocus] = useState("Upper Body");
  const [name, setName] = useState('');
  const [reps, setReps] = useState<number | null>(null);
  const [sets, setSets] = useState<number | null>(null);
  const [weight, setWeight] = useState<number | null>(null);

  const areasOfFocus = [
    "Upper Body",
    "Lower Body",
    "Core",
    "Cardio",
    "Flexibility"
  ]

  useEffect(() => {
    if (exerciseId) {
      const params = new URLSearchParams({ exerciseId: exerciseId });
      fetch(getFormatedUrl(`member/exercise?${params.toString()}`))
      .then(response => {
        if (!response.ok) {
          throw "error";
        } 
        return response.json()
      })
      .then(data => {
        setAreaOfFocus(data.areaOfFocus);
        setName(data.name);
        setReps(data.reps || null);
        setSets(data.sets || null);
        setWeight(data.weight || null);
      }).catch(error => {
        console.error("New Error", error);
      }) 
    } else if (show) {
      setAreaOfFocus("Upper Body");
      setName('');
      setReps(null);
      setSets(null);
      setWeight(null);
    }
  }, [exerciseId, show]);

  const createExercise = () => {
    if (!userId) return;

    fetch(getFormatedUrl('member/create-exercise'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        memberId: userId, 
        areaOfFocus, 
        name, 
        reps, 
        sets, 
        weight
      })
    }).then(response => {
      if (response.ok) {
        setShow(false);
      }
    });
  }

  const updateExercise = () => {
    fetch(getFormatedUrl('member/update-exercise'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        exerciseId, 
        areaOfFocus, 
        name, 
        reps, 
        sets, 
        weight
      })
    }).then(response => {
      if (response.ok) {
        setShow(false);
      }
    });
  }

  const onClose = () => {
    setExerciseId(null);
    setShow(false);
  }

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title className="text-primary">
          <b>{exerciseId ? "Update Exercise" : "New Exercise"}</b>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label >Select Area of Focus</Form.Label>
            <InputGroup>
              <Form.Select value={areaOfFocus} onChange={value => setAreaOfFocus(value.target.value)}>
                <option disabled>Select area of focus here</option>
                {
                  areasOfFocus.map(area => {
                    return (
                      <option key={area} value={area}>{area}</option>
                    )
                  })
                }
              </Form.Select>
            </InputGroup>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter the name of the exercise"
              value={name}
              onChange={value => setName(value.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Reps (if applicable)</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter the reps"
              value={reps || ''}
              onChange={value => setReps(Number(value.target.value))}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Sets (if applicable)</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter the sets"
              value={sets || ''}
              onChange={value => setSets(Number(value.target.value))}
            />
          </Form.Group>
          <Form.Group className="mb-3">
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
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button type="button" variant="primary" onClick={exerciseId ? updateExercise : createExercise}>
          {exerciseId ? "Update exercise" : "Create exercise"}
        </Button>
        <Button type="button" variant="secondary" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  )
}