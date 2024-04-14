import { useContext, useEffect, useState } from "react";
import { Button, Card, Table } from "react-bootstrap"
import { useRestApi } from "../../../../../sharedHooks/useRestApi";
import { AuthContext } from "../../../../Auth/AuthProvider";
import { ExerciseModal } from "./ExerciseModal";

export interface Exercise {
  exerciseId: string,
  areaOfFocus: string,
  name: string,
  reps: string | null,
  sets: string | null,
  weight: string | null,
}

export const ExercisesList = () => {
  const {getFormatedUrl} = useRestApi();
  const {userId} = useContext(AuthContext);
  const [refresh, setRefresh] = useState(false); // Used to refresh useEffects
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [openExerciseModal, setOpenExerciseModal] = useState(false);
  const [editExerciseId, setEditExerciseId] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;
    const params = new URLSearchParams({ userId: userId });
    fetch(getFormatedUrl(`member/exercises?${params.toString()}`))
      .then(response => {
        if (!response.ok) {
          throw "error";
        } 
        return response.json()
      })
      .then(data => {
        const exercises = data.exercises.map((exercise) => {
          return {
            exerciseId: exercise.exercise_id,
            areaOfFocus: exercise.area_of_focus,
            name: exercise.name,
            reps: exercise.reps,
            sets: exercise.sets,
            weight: exercise.weight,
          }
        })

        setExercises(exercises);
      })

  }, [openExerciseModal, refresh])
  

  const deleteExercise = (exerciseId: string) => {
    const params = new URLSearchParams({ exerciseId: exerciseId });
    fetch(getFormatedUrl(`member/delete-exercise?${params.toString()}`), {
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

  const openEditExerciseModal = (id: string) => {
    setEditExerciseId(id);
    setOpenExerciseModal(true);
  }

  return (
    <>
      <ExerciseModal show={openExerciseModal} setShow={setOpenExerciseModal} exerciseId={editExerciseId} setExerciseId={setEditExerciseId}/>
      <Card className="mt-4">
        <Card.Header className="h3 text-primary"><b>Exercises</b></Card.Header>
        <Card.Body>
        <Table responsive>
            <thead>
              <tr>
                <th>Area of Focus</th>
                <th>Name</th>
                <th>Weight (lbs)</th>
                <th>Reps</th>
                <th>Sets</th>
                <th/>
                <th/>
              </tr>
            </thead>
            <tbody>
              {
                exercises.map((exercise) => {
                  return (
                    <tr key={exercise.exerciseId}>
                      <td>{exercise.areaOfFocus}</td>
                      <td>{exercise.name}</td>
                      <td>{exercise.weight || ''}</td>
                      <td>{exercise.reps || ''}</td>
                      <td>{exercise.sets || ''}</td>
                      <td>
                        <Button type="button" variant="secondary" onClick={() => openEditExerciseModal(exercise.exerciseId)}>
                          Edit
                        </Button>
                      </td>
                      <td>
                        <Button type="button" variant="danger" onClick={() => deleteExercise(exercise.exerciseId)}>
                          Remove
                        </Button>
                      </td>
                    </tr>
                  )
                })
              }
            </tbody>
        </Table>
        </Card.Body>
        <Card.Footer>
            <Button type="button" onClick={() => setOpenExerciseModal(true)} variant="primary">
              Create a exercise
            </Button>
        </Card.Footer>
      </Card>
    </>
  )
}