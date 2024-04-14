import { Button, Card, Table } from "react-bootstrap";
import { GoalModal } from "./GoalModal";
import { useRestApi } from "../../../../../sharedHooks/useRestApi";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../../Auth/AuthProvider";
import checkBox from '../../../../../assets/check.svg';

export interface Goal {
  goalId: string,
  description: string,
  weight?: string,
  duration?: string,
  achieveBy?: string,
}

interface GoalsListProps {
  refresh: boolean,
  setRefresh: (value: boolean) => void;
}

export const GoalsList = ({refresh, setRefresh}: GoalsListProps) => {
  const {getFormatedUrl} = useRestApi();
  const {userId} = useContext(AuthContext);
  const [openGoalModal, setOpenGoalModal] = useState(false);
  const [editGoalId, setEditGoalId] = useState<string | null>(null);
  const [goals, setGoals] = useState<Goal[]>([]);
  
  // Fetching Fitness Goals
  useEffect(() => {
    if (!userId) return;
    const params = new URLSearchParams({ userId: userId });
    fetch(getFormatedUrl(`member/goals?${params.toString()}`))
      .then(response => {
        if (!response.ok) {
          throw "Failed to retrieve goals";
        } 
        return response.json()
      })
      .then(data => {
        // Parsing data for viewing
        const goals: Goal[] = data.goals.map((goal) => {
          const newGoal: Goal = {
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
  }, [openGoalModal, refresh])
  
  // Goal Related Functions
  const deleteGoal = (goalId: string) => {
    const params = new URLSearchParams({ goalId: goalId });
    fetch(getFormatedUrl(`member/delete-goal?${params.toString()}`), {
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

  const openEditGoalModal = (id: string) => {
    setEditGoalId(id);
    setOpenGoalModal(true);
  }

  // Achievement Related Functions
  const createAchievement = (goalId: string) => {
    fetch(getFormatedUrl('member/create-achievement'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        goalId,
        achievedDate: new Date()
      })
    }).then(response => {
      if (response.ok) {
        setRefresh(!refresh);
      }
    });
  }

  return (
    <>
      <GoalModal show={openGoalModal} setShow={setOpenGoalModal} goalId={editGoalId} setGoalId={setEditGoalId}/>
      <Card>
        <Card.Header className="h3 text-primary"><b>Fitness Goals</b></Card.Header>
        <Card.Body>
          <Table responsive>
            <thead>
              <tr>
                <th/>
                <th>Goal Description</th>
                <th>Weight (lbs)</th>
                <th>Duration (mins)</th>
                <th>Achieve By</th>
                <th/>
                <th/>
              </tr>
            </thead>
            <tbody>
              {
                goals.map((goal) => {
                  const date = goal.achieveBy ? (new Date(goal.achieveBy)).toISOString().split("T")[0] : "Indefinite";
                  return (
                    <tr key={goal.goalId}>
                      <td>
                        <Button type="button" variant="success" onClick={() => createAchievement(goal.goalId)}>
                          <img src={checkBox} />
                        </Button>
                      </td>
                      <td>{goal.description}</td>
                      <td>{goal.weight || ''}</td>
                      <td>{goal.duration || ''}</td>
                      <td>{date}</td>
                      <td>
                        <Button type="button" variant="secondary" onClick={() => openEditGoalModal(goal.goalId)}>
                          Edit
                        </Button>
                      </td>
                      <td>
                        <Button type="button" variant="danger" onClick={() => deleteGoal(goal.goalId)}>
                          Delete
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
          <Button type="button" onClick={() => setOpenGoalModal(true)}>
            Create a new goal
          </Button>
        </Card.Footer>
      </Card>
    </>
  )
}