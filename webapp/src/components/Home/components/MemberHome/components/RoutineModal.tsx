import { useContext, useEffect, useState } from "react";
import { Button, Card, Form, InputGroup, Modal, Table } from "react-bootstrap";
import { useRestApi } from "../../../../../sharedHooks/useRestApi";
import { AuthContext } from "../../../../Auth/AuthProvider";

interface NewRoutineModalProps {
  show: boolean;
  setShow: (shouldShow: boolean) => void;
  routineId: string | null;
  setRoutineId: (id: string | null) => void;
}

interface Exercise {
  exerciseId: string,
  areaOfFocus: string,
  name: string,
  reps: string | null,
  sets: string | null,
  weight: string | null,
}

export const RoutineModal = ({show, setShow, routineId, setRoutineId}: NewRoutineModalProps) => {
  const {getFormatedUrl} = useRestApi();
  const {userId} = useContext(AuthContext);
  const [refresh, setRefresh] = useState(false); // Using to force refresh useEffect
  const [firstLoad, setFirstLoad] = useState(true);
  const [name, setName] = useState(''); 
  const [availableExercises, setAvailableExercises] = useState<Exercise[]>([]);
  const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([]);

  // Used for setting values automatically when editing
  useEffect(() => {
    if (routineId && firstLoad) {
      const params = new URLSearchParams({ routineId: routineId });
      fetch(getFormatedUrl(`member/routine?${params.toString()}`))
      .then(response => {
        if (!response.ok) {
          throw "error";
        } 
        return response.json()
      })
      .then(data => {
        const usedExercises = data.exercises.map((exercise) => {
          return {
            exerciseId: exercise.exerciseId,
            areaOfFocus: exercise.areaOfFocus,
            name: exercise.name,
            reps: exercise.reps,
            sets: exercise.sets,
            weight: exercise.weight,
          }
        })

        const unusedExercises = data.unusedExercises.map((exercise) => {
          return {
            exerciseId: exercise.exercise_id,
            areaOfFocus: exercise.area_of_focus,
            name: exercise.name,
            reps: exercise.reps,
            sets: exercise.sets,
            weight: exercise.weight,
          }
        })

        setSelectedExercises(usedExercises);
        setAvailableExercises(unusedExercises);
        console.log(unusedExercises);
        console.log(usedExercises);
        setName(data.routineName);
        setFirstLoad(false);
      })
    }
    }, [routineId, refresh]);

  // Setting the available routines
  useEffect(() => {
    if (!userId || (firstLoad && routineId)) return;
    const params = new URLSearchParams({ userId: userId });
    fetch(getFormatedUrl(`member/exercises?${params.toString()}`))
      .then(response => {
        if (!response.ok) {
          throw "error";
        } 
        return response.json()
      })
      .then(data => {
        // Removing all exercises that have already been added
        const exercises = data.exercises.filter((exercise) => {
          if (selectedExercises.some(value => value.exerciseId === exercise.exercise_id)) {
            return false;
          }
          return true;
        }).map((exercise) => {
          return {
            exerciseId: exercise.exercise_id,
            areaOfFocus: exercise.area_of_focus,
            name: exercise.name,
            reps: exercise.reps,
            sets: exercise.sets,
            weight: exercise.weight,
          }
        })

        setAvailableExercises(exercises);
      })
  }, [show, refresh])

  const addExercise = () => {
    const selectElement = document.getElementById("exerciseSelect") as HTMLSelectElement;
    if (!selectElement || !selectElement.options[selectElement.selectedIndex]) return;

    const selectedIndex = selectElement.options[selectElement.selectedIndex].value;
    if (selectedIndex.length === 0 || selectedIndex === "default") return;

    console.log(selectedIndex);
    const exercise = availableExercises[Number(selectedIndex)];

    setSelectedExercises([...selectedExercises, exercise]);

    // Updating the available exercises (non selected)
    const exercises = availableExercises.filter((exercise) => {
      if (selectedExercises.some(value => value.exerciseId === exercise.exerciseId)) {
        return false;
      }
      return true;
    })
    setAvailableExercises(exercises);
    setRefresh(!refresh);
  }

  const removeExercise = (exerciseIndex: number) => {
    const removedExercise = selectedExercises[exerciseIndex];

    // Updating the selected exercises
    const updatedSelectedExercises = selectedExercises.filter((exercise) => {
      if (exercise.exerciseId === removedExercise.exerciseId) {
        return false;
      }
      return true;
    })
    setSelectedExercises(updatedSelectedExercises);

    // Updating the available exercises (non selected)
    const updatedAvailableExercises = availableExercises.filter((exercise) => {
      if (selectedExercises.some(value => value.exerciseId === exercise.exerciseId)) {
        return false;
      }
      return true;
    })
    setAvailableExercises(updatedAvailableExercises);
    setRefresh(!refresh);
  }

  const onClose = () => {
    setName('');
    setSelectedExercises([]);
    setRoutineId(null);
    setFirstLoad(true);
    setShow(false);
  }

  const createRoutine = () => {
    const exerciseIds = selectedExercises.map(exercise => {
      return exercise.exerciseId;
    });

    fetch(getFormatedUrl('member/create-routine'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        memberId: userId, 
        name,
        exerciseIds
      })
    }).then(response => {
      if (response.ok) {
        onClose();
      }
    });
  }

  const updateRoutine = () => {
    const exerciseIds = selectedExercises.map(exercise => {
      return exercise.exerciseId;
    });

    fetch(getFormatedUrl('member/update-routine'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        routineId, 
        name,
        exerciseIds
      })
    }).then(response => {
      if (response.ok) {
        onClose();
      }
    });
  }

  console.log(Number())

  return (
    <Modal show={show} onHide={onClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title className="text-primary">
          <b>{routineId ? "Edit Routine" : "New Routine"}</b>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Routine Name</Form.Label>
            <Form.Control 
              type="text"
              placeholder="Enter routine name"
              value={name}
              onChange={value => setName(value.target.value)}
            />
          </Form.Group>
          <Card>
            <Form.Group className="m-3">
              <Form.Label >Select Exercises for Routine</Form.Label>
              <InputGroup>
                <Form.Select defaultValue="default" id="exerciseSelect">
                  <option value="default" disabled>Select exercises here</option>
                  {
                    availableExercises.map((exercise, index) => {
                      return (
                        <option value={index} key={index}>{`${index} - ${exercise.name}`}</option>
                      )
                    })
                  }
                </Form.Select>
                <Button variant="primary" onClick={addExercise}>
                  +
                </Button>
              </InputGroup>
            </Form.Group>
            <Table responsive>
                <thead>
                  <tr>
                    <th>Area of Focus</th>
                    <th>Name</th>
                    <th>Weight (lbs)</th>
                    <th>Reps</th>
                    <th>Sets</th>
                    <th/>
                  </tr>
                </thead>
                <tbody>
                  {
                    selectedExercises.map((exercise, index) => {
                      return (
                        <tr key={exercise.exerciseId}>
                          <td>{exercise.areaOfFocus}</td>
                          <td>{exercise.name}</td>
                          <td>{exercise.weight || ''}</td>
                          <td>{exercise.reps || ''}</td>
                          <td>{exercise.sets || ''}</td>
                          <td>
                            <Button type="button" variant="danger" onClick={() => removeExercise(index)}>
                              Remove
                            </Button>
                          </td>
                        </tr>
                      )
                    })
                  }
                </tbody>
            </Table>
          </Card>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button type="button" variant="primary" onClick={routineId ? updateRoutine : createRoutine}>
          {routineId ? "Update routine" : "Create routine"}
        </Button>
        <Button type="button" variant="secondary" onClick={onClose}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  )
}