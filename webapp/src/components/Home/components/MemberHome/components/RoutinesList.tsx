import { useContext, useEffect, useState } from "react";
import { Accordion, Button, Card, Stack, Table } from "react-bootstrap"
import { RoutineModal } from "./RoutineModal";
import { AuthContext } from "../../../../Auth/AuthProvider";
import { useRestApi } from "../../../../../sharedHooks/useRestApi";
import { Exercise } from "./ExercisesList";

interface Routine {
  routineId: string,
  routineName: string,
  exercises: Exercise[],
}

export const RoutinesList = () => {
  const {getFormatedUrl} = useRestApi();
  const {userId} = useContext(AuthContext);
  const [refresh, setRefresh] = useState(false); // Used to refresh useEffects
  const [openNewRoutineModal, setOpenNewRoutineModal] = useState(false);
  const [editRoutineId, setEditRoutineId] = useState<string | null>(null);
  const [routines, setRoutines] = useState<Routine[]>([]);

  useEffect(() => {
    if (!userId) return;
    const params = new URLSearchParams({ userId: userId });
    fetch(getFormatedUrl(`member/routines?${params.toString()}`))
      .then(response => {
        if (!response.ok) {
          throw "error";
        } 
        return response.json()
      })
      .then(data => {
        setRoutines(data.routines);
      })

  }, [openNewRoutineModal, refresh])

  const deleteRoutine = (routineId: string) => {
    const params = new URLSearchParams({ routineId: routineId });
    fetch(getFormatedUrl(`member/delete-routine?${params.toString()}`), {
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

  const openEditRoutineModal = (id: string) => {
    setEditRoutineId(id);
    setOpenNewRoutineModal(true);
  }

  return (
    <>
      <RoutineModal show={openNewRoutineModal} setShow={setOpenNewRoutineModal} routineId={editRoutineId} setRoutineId={setEditRoutineId}/>
      <Card className="mt-4">
        <Card.Header className="h3 text-primary"><b>Routines</b></Card.Header>
        <Card.Body>
          <Accordion>
            {
              routines.map((routine, index) => {
                return (
                  <Accordion.Item eventKey={`${index}`}>
                    <Accordion.Header>
                      {routine.routineName}
                    </Accordion.Header>
                    <Accordion.Body>
                      <Stack direction="vertical" gap={2}>
                      <Table responsive>
                        <thead>
                          <tr>
                            <th>Area of Focus</th>
                            <th>Name</th>
                            <th>Weight (lbs)</th>
                            <th>Reps</th>
                            <th>Sets</th>
                          </tr>
                        </thead>
                        <tbody>
                          {
                            routine.exercises.map((exercise) => {
                              return (
                                <tr key={exercise.exerciseId}>
                                  <td>{exercise.areaOfFocus}</td>
                                  <td>{exercise.name}</td>
                                  <td>{exercise.weight || ''}</td>
                                  <td>{exercise.reps || ''}</td>
                                  <td>{exercise.sets || ''}</td>
                                </tr>
                              )
                            })
                          }
                        </tbody>
                        </Table>
                        <Stack direction="horizontal" gap={2}>
                          <Button variant="secondary" className="ms-auto" onClick={() => openEditRoutineModal(routine.routineId)}>
                            Edit
                          </Button>
                          <Button variant="danger" onClick={() => deleteRoutine(routine.routineId)}>
                            Delete
                          </Button>
                        </Stack>
                      </Stack>
                    </Accordion.Body>
                  </Accordion.Item>
                )
              })
            }
          </Accordion>
        </Card.Body>
        <Card.Footer>
            <Button type="button" onClick={() => setOpenNewRoutineModal(true)} className="me-2">
              Create a new routine
            </Button>
        </Card.Footer>
      </Card>
    </>
  )
}